import mongoose, { Types } from "mongoose";
import {
  TransactionReference,
  TransactionStatus,
  TransactionType,
  UserRole,
} from "../constants/enums";
import AppError from "../utils/appError";
import HTTP_STATUS from "../constants/httpStatus";
import { Commission } from "../modules/commission/commission.model";
import { Wallet } from "../modules/wallet/wallet.model";
import { ITransaction } from "../modules/transaction/transaction.interface";
import { Transaction } from "../modules/transaction/transaction.model";
import getTransactionId from "./getTransactionId";

export interface Props {
  type: TransactionType;
  from?: Types.ObjectId;
  fromModel?: UserRole.USER | UserRole.AGENT;
  to?: Types.ObjectId;
  toModel?: UserRole.USER | UserRole.AGENT;
  agent?: Types.ObjectId;
  amount: number;
  reference?: TransactionReference;
  notes?: string;
}

export const executeTransaction = async (options: Props) => {
  const {
    type,
    from,
    fromModel,
    to,
    toModel,
    agent,
    amount,
    reference,
    notes,
  } = options;

  if (amount <= 0) {
    throw new AppError(
      HTTP_STATUS.BAD_REQUEST,
      "Amount must be greater than 0"
    );
  }

  const transactionId = getTransactionId();
  const session = await mongoose.startSession();
  session.startTransaction();

  let transactionData: Partial<ITransaction> = {
    from,
    fromModel,
    to,
    toModel,
    agent,
    type,
    amount,
    charge: 0,
    commission: 0,
    status: TransactionStatus.FAILED,
    transactionId,
    reference,
    notes,
  };

  try {
    const commissionConfig = await Commission.findOne({
      type,
      isActive: true,
    }).session(session);

    const chargePercentage = commissionConfig?.charge || 0;
    const commissionPercentage = commissionConfig?.commission || 0;

    const chargeAmount = (amount * chargePercentage) / 100;
    const commissionAmount = (amount * commissionPercentage) / 100;

    transactionData.charge = chargeAmount;
    transactionData.commission = commissionAmount;

    const [fromWallet, toWallet, agentWallet, systemWallet] = await Promise.all(
      [
        from ? Wallet.findOne({ owner: from }).session(session) : null,
        to ? Wallet.findOne({ owner: to }).session(session) : null,
        agent ? Wallet.findOne({ owner: agent }).session(session) : null,
        Wallet.findOne({ isSystem: true }).session(session),
      ]
    );

    if (
      fromWallet &&
      fromWallet.balance < amount + chargeAmount + commissionAmount
    ) {
      throw new AppError(HTTP_STATUS.BAD_REQUEST, "Insufficient balance.");
    }

    if (fromWallet)
      fromWallet.balance -= amount + chargeAmount + commissionAmount;
    if (toWallet) toWallet.balance += amount;
    if (agentWallet) agentWallet.balance += commissionAmount;
    if (systemWallet) systemWallet.balance += chargeAmount;

    await Promise.all([
      fromWallet?.save({ session }),
      toWallet?.save({ session }),
      agentWallet?.save({ session }),
      systemWallet?.save({ session }),
    ]);

    transactionData.status = TransactionStatus.COMPLETED;

    const [transaction] = await Transaction.create([transactionData], {
      session,
    });

    await session.commitTransaction();
    session.endSession();

    return transaction;
  } catch (error: any) {
    await Transaction.create(transactionData);

    await session.abortTransaction();
    session.endSession();
    throw new AppError(
      HTTP_STATUS.BAD_REQUEST,
      error?.message || "Transaction failed."
    );
  }
};

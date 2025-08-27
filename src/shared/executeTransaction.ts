import { Types } from "mongoose";
import AppError from "../utils/appError";
import { envConfig } from "../configs/envConfig";
import getTransactionId from "./getTransactionId";
import HTTP_STATUS from "../constants/httpStatus";
import { Agent } from "../modules/agent/agent.model";
import { TransactionStatus } from "../constants/enums";
import { Wallet } from "../modules/wallet/wallet.model";
import { Transaction } from "../modules/transaction/transaction.model";
import { ITransactionPayload } from "../modules/transaction/transaction.interface";

const executeTransaction = async (payload: ITransactionPayload) => {
  const {
    senderWallet,
    receiverWallet,
    amount,
    isCharge,
    agentId,
    type,
    directionForSender,
    directionForReceiver,
    initiator,
    reference,
  } = payload;

  let sender = null;
  let receiver = null;
  let totalCharge = 0;
  let totalDebit = amount;
  let agentInfo: { id: Types.ObjectId; commission: number } | null = null;

  const transactionId = await getTransactionId();
  const session = await Transaction.startSession();

  try {
    session.startTransaction();

    if (isCharge) {
      const systemWallet = await Wallet.findOne({ isSystem: true }).session(
        session
      );

      if (!systemWallet) {
        throw new AppError(HTTP_STATUS.NOT_FOUND, "System wallet not found.");
      }

      const systemCharge = amount * (envConfig.PERCENTAGE.SYSTEM_CHARGE / 100);

      systemWallet.balance += systemCharge;
      totalDebit += systemCharge;

      totalCharge += systemCharge;
      await systemWallet.save({ session: session });
    }

    if (agentId) {
      const agentAccount = await Agent.findById(agentId).session(session);

      if (!agentAccount) {
        throw new AppError(HTTP_STATUS.NOT_FOUND, "Agent not found.");
      }

      const agentWallet = await Wallet.findById(agentAccount.wallet).session(
        session
      );

      if (!agentWallet) {
        throw new AppError(HTTP_STATUS.NOT_FOUND, "Agent wallet not found.");
      }

      const commission = amount * (envConfig.PERCENTAGE.AGENT_COMMISION / 100);
      agentWallet.balance += commission;

      totalDebit += commission;
      totalCharge += commission;

      await agentWallet.save({ session: session });

      agentInfo = {
        id: agentAccount._id,
        commission,
      };
    }

    if (senderWallet) {
      sender = await Wallet.findById(senderWallet).session(session);
      if (!sender) {
        throw new AppError(HTTP_STATUS.NOT_FOUND, "Sender wallet not found.");
      }

      if (sender.balance < totalDebit) {
        throw new AppError(HTTP_STATUS.BAD_REQUEST, "Insufficient balance.");
      }

      sender.balance -= totalDebit;
      await sender.save({ session: session });
    }

    if (receiverWallet) {
      receiver = await Wallet.findById(receiverWallet).session(session);
      if (!receiver) {
        throw new AppError(HTTP_STATUS.NOT_FOUND, "Receiver wallet not found.");
      }

      receiver.balance += amount;
      await receiver.save({ session: session });
    }

    const [transaction] = await Transaction.create(
      [
        {
          senderWallet,
          receiverWallet,
          amount,
          charge: totalCharge,
          agent: agentInfo,
          transactionId,
          type,
          status: TransactionStatus.COMPLETED,
          directionForSender,
          directionForReceiver,
          initiator,
          reference,
        },
      ],
      {
        session,
      }
    );

    await session.commitTransaction();

    return transaction;
  } catch (error) {
    await session.abortTransaction();

    await Transaction.create([
      {
        senderWallet,
        receiverWallet,
        amount,
        charge: totalCharge,
        agent: agentInfo,
        transactionId,
        type,
        status: TransactionStatus.FAILED,
        directionForSender,
        directionForReceiver,
        initiator,
        reference,
      },
    ]);

    if (error instanceof AppError) {
      throw error;
    }

    throw new AppError(
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      "Failed to execute transaction."
    );
  } finally {
    await session.endSession();
  }
};

export default executeTransaction;

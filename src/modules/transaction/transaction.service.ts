import { TransactionType, UserRole } from "../../constants/enums";
import { JwtPayload } from "../../interfaces";
import { executeTransaction } from "../../shared/executeTransaction";
import { resolveReceiver } from "../../shared/resolveReceiver";

const userDeposit = async (
  user: JwtPayload,
  payload: {
    amount: number;
    emailOrPhone: string;
    notes?: string;
  }
) => {
  const agent = await resolveReceiver(payload.emailOrPhone, "Agent not found");

  const transaction = await executeTransaction({
    type: TransactionType.DEPOSIT,
    from: agent._id,
    fromModel: UserRole.AGENT,
    to: user.id,
    toModel: UserRole.USER,
    agent: agent._id,
    amount: payload.amount,
    notes: payload.notes || "Deposit via agent",
  });

  return transaction;
};

const userWithdraw = async (
  user: JwtPayload,
  payload: {
    amount: number;
    agent: string;
    notes?: string;
  }
) => {
  const agent = await resolveReceiver(payload.agent, "Agent not found");

  const transaction = await executeTransaction({
    type: TransactionType.WITHDRAW,
    from: user.id,
    fromModel: UserRole.USER,
    to: agent._id,
    toModel: UserRole.AGENT,
    agent: agent._id,
    amount: payload.amount,
    notes: payload.notes || "Withdraw via agent",
  });

  return transaction;
};

const userSendMoney = async (
  user: JwtPayload,
  payload: {
    amount: number;
    emailOrPhone: string;
    notes?: string;
  }
) => {
  const receiver = await resolveReceiver(
    payload.emailOrPhone,
    "Receiver not found"
  );

  const transaction = await executeTransaction({
    type: TransactionType.SEND_MONEY,
    from: user.id,
    fromModel: UserRole.USER,
    to: receiver._id,
    toModel: receiver.role as UserRole.USER | UserRole.AGENT,
    amount: payload.amount,
    notes: payload.notes || "User send money",
  });

  return transaction;
};

const agentAddMoney = async (
  agent: JwtPayload,
  payload: {
    amount: number;
    emailOrPhone: string;
    notes?: string;
  }
) => {
  const receiver = await resolveReceiver(
    payload.emailOrPhone,
    "Receiver not found"
  );

  const transaction = await executeTransaction({
    type: TransactionType.CASH_IN,
    from: agent.id,
    fromModel: UserRole.AGENT,
    to: receiver._id,
    toModel: receiver.role as UserRole.USER | UserRole.AGENT,
    agent: agent._id,
    amount: payload.amount,
    notes: payload.notes || "Agent add money",
  });

  return transaction;
};

const agentWithdraw = async (
  agent: JwtPayload,
  payload: {
    amount: number;
    emailOrPhone: string;
    notes?: string;
  }
) => {
  const receiver = await resolveReceiver(
    payload.emailOrPhone,
    "Receiver not found"
  );

  const transaction = await executeTransaction({
    type: TransactionType.CASH_OUT,
    from: receiver._id,
    fromModel: receiver.role as UserRole.USER | UserRole.AGENT,
    to: agent._id,
    toModel: UserRole.AGENT,
    agent: agent._id,
    amount: payload.amount,
    notes: payload.notes || "Agent withdraw money",
  });

  return transaction;
};

export const transactionService = {
  userDeposit,
  userWithdraw,
  userSendMoney,
  agentAddMoney,
  agentWithdraw,
};

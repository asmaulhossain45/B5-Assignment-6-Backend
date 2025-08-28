import z from "zod";
import { TransactionType } from "../../constants/enums";

const reference = z.enum(Object.values(TransactionType));
const notes = z.string().optional();

const userDeposit = z.object({});

const userWithdraw = z.object({});

const userSendMoney = z.object({});

const agentAddMoney = z.object({});

const agentWithdraw = z.object({});

export const ZodTransactionSchema = {
  userDeposit,
  userWithdraw,
  userSendMoney,
  agentAddMoney,
  agentWithdraw,
};

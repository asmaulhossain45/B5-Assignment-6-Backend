import { JwtPayload } from "../../interfaces";
import { ITransaction } from "./transaction.interface";

const userDeposit = async (user: JwtPayload, payload) => {};

const userWithdraw = async (user: JwtPayload, payload) => {};

const userSendMoney = async (user: JwtPayload, payload) => {};

const agentAddMoney = async (user: JwtPayload, payload) => {};

const agentWithdraw = async (user: JwtPayload, payload) => {};

export const transactionService = {
  userDeposit,
  userWithdraw,
  userSendMoney,
  agentAddMoney,
  agentWithdraw,
};

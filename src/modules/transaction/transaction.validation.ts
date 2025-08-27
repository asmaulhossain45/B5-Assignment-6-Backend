import z from "zod";
import { TransactionReference } from "../../constants/enums";

const amountSchema = z.number().min(1, { message: "Amount must be positive" });
const referenceSchema = z.nativeEnum(TransactionReference, {message: "Reference is required"});

const addMoney = z.object({
  amount: amountSchema,
  reference: referenceSchema,
});

const withdraw = z.object({
  amount: amountSchema,
  reference: referenceSchema,
});

const sendMoney = z.object({
  amount: amountSchema,
  receiver: z.string().min(1, { message: "Receiver ID is required" }),
});

const cashIn = z.object({
  amount: amountSchema,
  receiver: z.string().min(1, { message: "Receiver ID is required" }),
});

const cashOut = z.object({
  amount: amountSchema,
  sender: z.string().min(1, { message: "Sender ID is required" }),
});

export const ZodTransactionSchema = {
  addMoney,
  withdraw,
  sendMoney,
  cashIn,
  cashOut,
};

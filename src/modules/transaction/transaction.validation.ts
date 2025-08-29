import z from "zod";
import { TransactionType } from "../../constants/enums";

const transaction = z.object({
  amount: z
    .number()
    .positive("Amount must be positive")
    .min(10, "Minimum transaction amount is 10 BDT"),
  emailOrPhone: z.union([
    z.email("Provide a valid email address"),
    z.string().regex(/^[0-9]{10,15}$/, "Invalid phone number"),
  ]),
  reference: z.enum(Object.values(TransactionType)).optional(),
  notes: z.string().max(250, "Notes must not exceed 250 characters").optional(),
});

export const ZodTransactionSchema = {
  transaction,
};

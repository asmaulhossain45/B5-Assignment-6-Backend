import z from "zod";
import { TransactionType, UserRole } from "../../constants/enums";

const create = z.object({
  type: z.enum(Object.values(TransactionType)),

  role: z.enum(Object.values(UserRole.USER || UserRole.AGENT)),

  minAmount: z
    .number()
    .nonnegative({ message: "Min amount must be non-negative" }),
  maxAmount: z
    .number()
    .nonnegative({ message: "Max amount must be non-negative" }),

  dailyLimit: z
    .number()
    .nonnegative({ message: "Daily limit must be non-negative" })
    .optional(),
  weeklyLimit: z
    .number()
    .nonnegative({ message: "Weekly limit must be non-negative" })
    .optional(),
  monthlyLimit: z
    .number()
    .nonnegative({ message: "Monthly limit must be non-negative" })
    .optional(),
  isActive: z.boolean().optional().default(true),
});

const update = z.object({
  type: z.enum(Object.values(TransactionType)).optional(),

  role: z.enum(Object.values(UserRole.USER || UserRole.AGENT)).optional(),

  minAmount: z
    .number()
    .nonnegative({ message: "Min amount must be non-negative" })
    .optional(),
  maxAmount: z
    .number()
    .nonnegative({ message: "Max amount must be non-negative" })
    .optional(),

  dailyLimit: z
    .number()
    .nonnegative({ message: "Daily limit must be non-negative" })
    .optional(),
  weeklyLimit: z
    .number()
    .nonnegative({ message: "Weekly limit must be non-negative" })
    .optional(),
  monthlyLimit: z
    .number()
    .nonnegative({ message: "Monthly limit must be non-negative" })
    .optional(),
});

export const ZodLimitSchema = {
  create,
  update,
};

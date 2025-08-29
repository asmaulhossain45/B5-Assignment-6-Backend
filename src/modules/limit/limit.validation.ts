import z from "zod";
import { TransactionType, UserRole } from "../../constants/enums";

const roles = [UserRole.USER, UserRole.AGENT] as const;

const create = z.object({
  type: z.enum(Object.values(TransactionType)),

  role: z.enum(roles),

  minAmount: z.number().positive({ message: "Min amount must be positive" }),
  maxAmount: z.number().positive({ message: "Max amount must be positive" }),

  dailyLimit: z
    .number()
    .positive({ message: "Daily limit must be positive" })
    .optional(),
  weeklyLimit: z
    .number()
    .positive({ message: "Weekly limit must be positive" })
    .optional(),
  monthlyLimit: z
    .number()
    .positive({ message: "Monthly limit must be positive" })
    .optional(),
  isActive: z.boolean().optional().default(true),
});

const update = z.object({
  type: z.enum(Object.values(TransactionType)).optional(),

  role: z.enum(roles).optional(),

  minAmount: z
    .number()
    .positive({ message: "Min amount must be positive" })
    .optional(),
  maxAmount: z
    .number()
    .positive({ message: "Max amount must be positive" })
    .optional(),

  dailyLimit: z
    .number()
    .positive({ message: "Daily limit must be positive" })
    .optional(),
  weeklyLimit: z
    .number()
    .positive({ message: "Weekly limit must be positive" })
    .optional(),
  monthlyLimit: z
    .number()
    .positive({ message: "Monthly limit must be positive" })
    .optional(),
});

export const ZodLimitSchema = {
  create,
  update,
};

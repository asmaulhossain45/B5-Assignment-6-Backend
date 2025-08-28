import z from "zod";
import { TransactionType } from "../../constants/enums";

const create = z.object({
  charge: z.number().nonnegative({ message: "Charge must be non-negative" }),
  commission: z
    .number()
    .nonnegative({ message: "Commission must be non-negative" })
    .optional()
    .default(0),
  type: z.enum(Object.values(TransactionType)),

  isActive: z.boolean().optional().default(true),
});

const update = z.object({
  charge: z
    .number()
    .nonnegative({ message: "Charge must be non-negative" })
    .optional(),
  commission: z
    .number()
    .nonnegative({ message: "Commission must be non-negative" })
    .optional()
    .default(0),
  type: z.enum(Object.values(TransactionType)).optional(),
});

export const ZodCommissionSchema = {
  create,
  update,
};

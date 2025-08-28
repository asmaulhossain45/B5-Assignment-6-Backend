import z from "zod";
import { Gender } from "../../constants/enums";

const locationSchema = z.object({
  division: z.string().optional(),
  district: z.string().optional(),
  address: z.string().optional(),
});

const create = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  email: z.email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

const update = z.object({
  name: z.string().min(3, "Name must be at least 3 characters").optional(),
  dob: z.date().optional(),
  phone: z.string().optional(),

  gender: z.enum(Object.values(Gender)).optional(),
  location: locationSchema.optional(),
});

export const ZodUserSchema = {
  create,
  update,
};

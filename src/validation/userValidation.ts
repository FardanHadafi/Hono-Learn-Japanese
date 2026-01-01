import z, { ZodType } from "zod";

export class UserValidation {
  static readonly SIGNUP: ZodType = z.object({
    name: z.string().min(3).max(100),
    email: z.email().max(100),
    password: z.string().min(8).max(100),
  });

  static readonly SIGNIN: ZodType = z.object({
    email: z.email().max(100),
    password: z.string().min(8).max(100),
  });

  static readonly UPDATE: ZodType = z.object({
    name: z.string().min(3).max(100),
    image: z.string(),
  });

  static readonly token: ZodType = z.string().min(1);
}

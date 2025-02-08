import { z } from "zod";

export const registerFormSchema = z
  .object({
    fullname: z.string().min(4, {
      message: "Full name must be at least 4 characters.",
    }),
    email: z.string().email({
      message: "Please enter a valid email.",
    }),
    password: z.string().min(6, {
      message: "Password must be at least 6 characters.",
    }),
    password_confirmation: z
      .string()
      .min(1, { message: "Please confirm your password" }),
  })
  .superRefine((val, ctx) => {
    if (val.password !== val.password_confirmation) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Password is not the same as confirm password",
        path: ["password_confirmation"],
      });
    }
  });
export type RegisterFormData = z.infer<typeof registerFormSchema>;

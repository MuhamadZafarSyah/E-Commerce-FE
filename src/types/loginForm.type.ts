import { z } from "zod";

export const loginFormSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email.",
  }),
  password: z.string(),
});

export type LoginFormData = z.infer<typeof loginFormSchema>;

import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string()
    .min(5, { message: "Email must be at least 5 characters long" })
    .max(320, { message: "Email must not exceed 320 characters" })
    .email({ message: "Invalid email format. Must contain '@' and '.'" }),
  password: z.string()
    .min(8, { message: "Password must be at least 8 characters long" })
    .max(20, { message: "Password must not exceed 20 characters" })
    .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
    .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
    .regex(/\d/, { message: "Password must contain at least one digit" })
    .regex(/[!@#$%^&*]/, { message: "Password must contain at least one special character" })
    .refine((value) => !/\s/.test(value), { message: "Password must not contain spaces" })
});

export const signUpSchema = z.object({
  role: z.string().min(1, { message: "Please select a role" }), // Ensure a role is selected
  userName: z.string()
    .min(3, { message: "Username must be at least 3 characters long" })
    .max(20, { message: "Username must not exceed 20 characters" }),
  email: z.string()
    .min(5, { message: "Email must be at least 5 characters long" })
    .max(320, { message: "Email must not exceed 320 characters" })
    .email({ message: "Invalid email format. Must contain '@' and '.'" })
    .refine((value) => !/\s/.test(value), { message: "Email must not contain spaces" }),
  password: z.string()
    .min(8, { message: "Password must be at least 8 characters long" })
    .max(20, { message: "Password must not exceed 20 characters" })
    .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
    .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
    .regex(/\d/, { message: "Password must contain at least one digit" })
    .regex(/[!@#$%^&*]/, { message: "Password must contain at least one special character" })
    .refine((value) => !/\s/.test(value), { message: "Password must not contain spaces" }),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"], // Specify that the error should appear on the confirmPassword field
});

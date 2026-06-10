import { z } from "zod";

export const loginSchema = z.object({
  body: z.object({
    email: z.string({ message: "Email is required" }).email("Invalid email format"),
    password: z.string({ message: "Password is required" }).min(6, "Password must be at least 6 characters"),
  })
});

export const registerSchema = z.object({
  body: z.object({
    name: z.string({ message: "Name is required" }).min(2, "Name must be at least 2 characters"),
    email: z.string({ message: "Email is required" }).email("Invalid email format"),
    password: z.string({ message: "Password is required" }).min(6, "Password must be at least 6 characters"),
    mobile: z.string({ message: "Mobile number is required" }).min(10, "Mobile number must be at least 10 characters"),
    profilePic: z.string().optional().nullable(),
  })
});

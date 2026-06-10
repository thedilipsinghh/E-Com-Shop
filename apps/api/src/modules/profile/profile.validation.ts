import { z } from "zod";

export const updateProfileSchema = z.object({
  body: z.object({
    phone: z.string().min(10, "Phone number is too short").optional().nullable(),
    dateOfBirth: z.preprocess((arg) => {
      if (typeof arg === "string" || arg instanceof Date) return new Date(arg);
      return undefined;
    }, z.date().optional()),
    gender: z.string().optional().nullable(),
    profilePic: z.string().optional().nullable(),
  })
});

export const updateUserSchema = z.object({
  body: z.object({
    name: z.string().min(2, "Name must be at least 2 characters").optional(),
    mobile: z.string().min(10, "Mobile number is too short").optional(),
    phone: z.string().min(10, "Phone number is too short").optional(),
  }).refine((data) => data.name || data.mobile || data.phone, {
    message: "At least one field (name, mobile, or phone) must be provided for update",
  })
});

export const createAddressSchema = z.object({
  body: z.object({
    label: z.string().optional().nullable(),
    fullName: z.string({ message: "Full name is required" }).min(2, "Full name is too short"),
    phone: z.string({ message: "Phone number is required" }).min(10, "Phone number is too short"),
    addressLine1: z.string({ message: "Address line 1 is required" }).min(5, "Address is too short"),
    addressLine2: z.string().optional().nullable(),
    city: z.string({ message: "City is required" }).min(1, "City cannot be empty"),
    state: z.string({ message: "State is required" }).min(1, "State cannot be empty"),
    postalCode: z.string({ message: "Postal code is required" }).min(4, "Postal code is too short"),
    country: z.string({ message: "Country is required" }).min(2, "Country name is too short"),
    isDefault: z.boolean().default(false),
  })
});

export const updateAddressSchema = z.object({
  params: z.object({
    id: z.coerce.number().int().positive("Address ID must be a positive integer"),
  }),
  body: z.object({
    label: z.string().optional().nullable(),
    fullName: z.string().min(2, "Full name is too short").optional(),
    phone: z.string().min(10, "Phone number is too short").optional(),
    addressLine1: z.string().min(5, "Address is too short").optional(),
    addressLine2: z.string().optional().nullable(),
    city: z.string().min(1, "City cannot be empty").optional(),
    state: z.string().min(1, "State cannot be empty").optional(),
    postalCode: z.string().min(4, "Postal code is too short").optional(),
    country: z.string().min(2, "Country name is too short").optional(),
    isDefault: z.boolean().optional(),
  })
});

export const addressIdParamSchema = z.object({
  params: z.object({
    id: z.coerce.number().int().positive("Address ID must be a positive integer"),
  })
});

import { z } from "zod";

export const createOrderSchema = z.object({
  body: z.object({
    userId: z.coerce.number().int().positive("User ID must be a positive integer"),
    shippingAddress: z.string({ message: "Shipping address is required" }).min(5, "Shipping address is too short"),
    billingAddress: z.string({ message: "Billing address is required" }).min(5, "Billing address is too short"),
    paymentMethod: z.string({ message: "Payment method is required" }).min(2, "Payment method is too short"),
  })
});

export const orderIdParamSchema = z.object({
  params: z.object({
    id: z.coerce.number().int().positive("Order ID must be a positive integer"),
  })
});

export const userIdParamSchema = z.object({
  params: z.object({
    userId: z.coerce.number().int().positive("User ID must be a positive integer"),
  })
});

export const updateOrderStatusSchema = z.object({
  params: z.object({
    id: z.coerce.number().int().positive("Order ID must be a positive integer"),
  }),
  body: z.object({
    status: z.string({ message: "Status is required" }).min(1, "Status cannot be empty"),
  })
});

export const updatePaymentStatusSchema = z.object({
  params: z.object({
    id: z.coerce.number().int().positive("Order ID must be a positive integer"),
  }),
  body: z.object({
    paymentStatus: z.string({ message: "Payment status is required" }).min(1, "Payment status cannot be empty"),
  })
});

export const orderItemsParamSchema = z.object({
  params: z.object({
    orderId: z.coerce.number().int().positive("Order ID must be a positive integer"),
  })
});

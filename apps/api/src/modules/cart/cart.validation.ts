import { z } from "zod";

export const addToCartSchema = z.object({
  body: z.object({
    productId: z.coerce.number().int().positive("Product ID must be a positive integer"),
    quantity: z.coerce.number().int().min(1, "Quantity must be at least 1"),
  })
});

export const updateCartItemSchema = z.object({
  body: z.object({
    quantity: z.coerce.number().int().min(0, "Quantity cannot be negative"),
  }),
  params: z.object({
    cartItemId: z.coerce.number().int().positive("Cart item ID must be a positive integer"),
  })
});

export const cartItemIdSchema = z.object({
  params: z.object({
    cartItemId: z.coerce.number().int().positive("Cart item ID must be a positive integer"),
  })
});

import { z } from "zod";

export const createProductSchema = z.object({
  body: z.object({
    name: z.string({ message: "Product name is required" }).min(2, "Product name is too short"),
    price: z.coerce.number({ message: "Price is required" }).positive("Price must be a positive number"),
    category: z.string({ message: "Category is required" }).min(1, "Category cannot be empty"),
    description: z.string().optional().nullable(),
    brand: z.string().optional().nullable(),
    stockQuantity: z.coerce.number().int().nonnegative().optional(),
    sku: z.string().optional().nullable(),
    imageUrl: z.string().url("Invalid image URL").optional().nullable(),
    isActive: z.boolean().optional(),
  })
});

export const updateProductSchema = z.object({
  params: z.object({
    id: z.coerce.number().int().positive("Product ID must be a positive integer"),
  }),
  body: z.object({
    name: z.string().min(2, "Product name is too short").optional(),
    price: z.coerce.number().positive("Price must be a positive number").optional(),
    category: z.string().min(1, "Category cannot be empty").optional(),
    description: z.string().optional().nullable(),
    brand: z.string().optional().nullable(),
    stockQuantity: z.coerce.number().int().nonnegative().optional(),
    sku: z.string().optional().nullable(),
    imageUrl: z.string().url("Invalid image URL").optional().nullable(),
    isActive: z.boolean().optional(),
  })
});

export const productIdParamSchema = z.object({
  params: z.object({
    id: z.coerce.number().int().positive("Product ID must be a positive integer"),
  })
});

export const getProductsQuerySchema = z.object({
  query: z.object({
    category: z.string().optional(),
    brand: z.string().optional(),
    isActive: z.preprocess((val) => {
      if (val === "true") return true;
      if (val === "false") return false;
      return undefined;
    }, z.boolean().optional()),
    limit: z.coerce.number().int().positive().optional(),
    offset: z.coerce.number().int().nonnegative().optional(),
  })
});

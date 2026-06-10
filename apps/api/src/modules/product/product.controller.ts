import { Request, Response } from "express";
import { ProductService } from "./product.service";
import { asyncHandler } from "../../utils/asyncHandler";
import { sendResponse } from "../../utils/sendResponse";

const productService = new ProductService();

export const createProduct = asyncHandler(async (req: Request, res: Response) => {
  const product = await productService.createProduct(req.body);
  
  return sendResponse(res, {
    success: true,
    message: "Product created successfully",
    data: product
  });
});

export const getProductById = asyncHandler(async (req: Request, res: Response) => {
  const productId = parseInt(req.params.id as string);
  const product = await productService.getProductById(productId);
  
  return sendResponse(res, {
    success: true,
    message: "Product retrieved successfully",
    data: product
  });
});

export const getAllProducts = asyncHandler(async (req: Request, res: Response) => {
  const filters = {
    category: req.query.category as string | undefined,
    brand: req.query.brand as string | undefined,
    isActive: req.query.isActive === 'true' ? true : req.query.isActive === 'false' ? false : undefined,
    limit: req.query.limit ? parseInt(req.query.limit as string) : undefined,
    offset: req.query.offset ? parseInt(req.query.offset as string) : undefined
  };
  
  const products = await productService.getAllProducts(filters);
  
  return sendResponse(res, {
    success: true,
    message: "Products retrieved successfully",
    data: products
  });
});

export const updateProduct = asyncHandler(async (req: Request, res: Response) => {
  const productId = parseInt(req.params.id as string);
  const updatedProduct = await productService.updateProduct(productId, req.body);
  
  return sendResponse(res, {
    success: true,
    message: "Product updated successfully",
    data: updatedProduct
  });
});

export const deleteProduct = asyncHandler(async (req: Request, res: Response) => {
  const productId = parseInt(req.params.id as string);
  await productService.deleteProduct(productId);
  
  return sendResponse(res, {
    success: true,
    message: "Product deleted successfully"
  });
});

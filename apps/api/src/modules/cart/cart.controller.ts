import { Request, Response } from "express";
import { CartService } from "./cart.service";
import { asyncHandler } from "../../utils/asyncHandler";
import { sendResponse } from "../../utils/sendResponse";

const cartService = new CartService();

interface AuthRequest extends Request {
  user?: { userId: number; role?: string };
}

export const addToCart = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.user?.userId;
  if (!userId) {
    return sendResponse(res, { success: false, message: "Unauthorized" }, 401);
  }

  const { productId, quantity } = req.body;
  const cartItem = await cartService.addToCart({ userId, productId, quantity });

  return sendResponse(res, {
    success: true,
    message: "Item added to cart successfully",
    data: cartItem
  }, 201);
});

export const getCartItems = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.user?.userId;
  if (!userId) {
    return sendResponse(res, { success: true, message: "Cart items", data: [] });
  }

  const cartItems = await cartService.getCartItems(userId);

  return sendResponse(res, {
    success: true,
    message: "Cart items retrieved successfully",
    data: cartItems
  });
});

export const updateCartItemQuantity = asyncHandler(async (req: AuthRequest, res: Response) => {
  const cartItemId = parseInt(req.params.cartItemId as string);
  const { quantity } = req.body;

  const updatedItem = await cartService.updateCartItemQuantity(cartItemId, quantity);

  return sendResponse(res, {
    success: true,
    message: "Cart item updated successfully",
    data: updatedItem
  });
});

export const removeFromCart = asyncHandler(async (req: AuthRequest, res: Response) => {
  const cartItemId = parseInt(req.params.cartItemId as string);

  await cartService.removeFromCart(cartItemId);

  return sendResponse(res, {
    success: true,
    message: "Item removed from cart successfully"
  });
});

export const clearCart = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.user?.userId;
  if (!userId) {
    return sendResponse(res, { success: true, message: "Cart cleared" });
  }

  await cartService.clearCart(userId);

  return sendResponse(res, {
    success: true,
    message: "Cart cleared successfully"
  });
});

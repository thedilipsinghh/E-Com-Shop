import { Request, Response } from "express";
import { OrderService } from "./order.service";
import { asyncHandler } from "../../utils/asyncHandler";
import { sendResponse } from "../../utils/sendResponse";
import { AuthRequest } from "../../middleware/auth";

const orderService = new OrderService();

export const createOrder = asyncHandler(async (req: Request, res: Response) => {
  const { userId, shippingAddress, billingAddress, paymentMethod } = req.body;
  const order = await orderService.createOrder(userId, shippingAddress, billingAddress, paymentMethod);
  
  return sendResponse(res, {
    success: true,
    message: "Order created successfully",
    data: order
  });
});

export const getOrderById = asyncHandler(async (req: Request, res: Response) => {
  const orderId = parseInt(req.params.id as string);
  const order = await orderService.getOrderById(orderId);
  
  return sendResponse(res, {
    success: true,
    message: "Order retrieved successfully",
    data: order
  });
});

export const getUserOrders = asyncHandler(async (req: Request, res: Response) => {
  const userId = parseInt(req.params.userId as string);
  const orders = await orderService.getUserOrders(userId);
  
  return sendResponse(res, {
    success: true,
    message: "User orders retrieved successfully",
    data: orders
  });
});

export const getAllOrders = asyncHandler(async (req: Request, res: Response) => {
  const orders = await orderService.getAllOrders();
  
  return sendResponse(res, {
    success: true,
    message: "All orders retrieved successfully",
    data: orders
  });
});

export const updateOrderStatus = asyncHandler(async (req: Request, res: Response) => {
  const orderId = parseInt(req.params.id as string);
  const { status } = req.body;
  const updatedOrder = await orderService.updateOrderStatus(orderId, status);
  
  return sendResponse(res, {
    success: true,
    message: "Order status updated successfully",
    data: updatedOrder
  });
});

export const updatePaymentStatus = asyncHandler(async (req: Request, res: Response) => {
  const orderId = parseInt(req.params.id as string);
  const { paymentStatus } = req.body;
  const updatedOrder = await orderService.updatePaymentStatus(orderId, paymentStatus);
  
  return sendResponse(res, {
    success: true,
    message: "Payment status updated successfully",
    data: updatedOrder
  });
});

export const getOrderItems = asyncHandler(async (req: Request, res: Response) => {
  const orderId = parseInt(req.params.orderId as string);
  const orderItems = await orderService.getOrderItems(orderId);
  
  return sendResponse(res, {
    success: true,
    message: "Order items retrieved successfully",
    data: orderItems
  });
});

export const cancelOrder = asyncHandler(async (req: Request, res: Response) => {
  const orderId = parseInt(req.params.id as string);
  const user = (req as AuthRequest).user;
  if (!user) {
    return res.status(401).json({ success: false, message: "Authentication required" });
  }

  const updatedOrder = await orderService.cancelOrder(orderId, user.userId, user.role);

  return sendResponse(res, {
    success: true,
    message: "Order cancelled successfully",
    data: updatedOrder
  });
});

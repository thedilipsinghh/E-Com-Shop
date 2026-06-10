import { OrderRepository } from "./order.repository";
import { BadRequestError, ForbiddenError, NotFoundError } from "../../errors/AppError";

export class OrderService {
  private orderRepository: OrderRepository;

  constructor() {
    this.orderRepository = new OrderRepository();
  }

  // Create a new order from cart items
  async createOrder(userId: number, shippingAddress: string, billingAddress: string, paymentMethod: string) {
    if (!userId || userId <= 0) {
      throw new BadRequestError("Invalid user ID");
    }

    if (!shippingAddress || shippingAddress.trim() === "") {
      throw new BadRequestError("Shipping address is required");
    }

    if (!billingAddress || billingAddress.trim() === "") {
      throw new BadRequestError("Billing address is required");
    }

    if (!paymentMethod || paymentMethod.trim() === "") {
      throw new BadRequestError("Payment method is required");
    }

    return await this.orderRepository.createOrder(userId, shippingAddress, billingAddress, paymentMethod);
  }

  // Get order by ID
  async getOrderById(id: number) {
    if (!id || id <= 0) {
      throw new BadRequestError("Invalid order ID");
    }

    const order = await this.orderRepository.getOrderById(id);
    if (!order) {
      throw new BadRequestError("Order not found");
    }

    return order;
  }

  // Get all orders for a user
  async getUserOrders(userId: number) {
    if (!userId || userId <= 0) {
      throw new BadRequestError("Invalid user ID");
    }

    return await this.orderRepository.getUserOrders(userId);
  }

  // Get all orders (admin function)
  async getAllOrders() {
    return await this.orderRepository.getAllOrders();
  }

  // Update order status
  async updateOrderStatus(id: number, status: string) {
    if (!id || id <= 0) {
      throw new BadRequestError("Invalid order ID");
    }

    if (!status || status.trim() === "") {
      throw new BadRequestError("Status is required");
    }

    return await this.orderRepository.updateOrderStatus(id, status);
  }

  // Update payment status
  async updatePaymentStatus(id: number, paymentStatus: string) {
    if (!id || id <= 0) {
      throw new BadRequestError("Invalid order ID");
    }

    if (!paymentStatus || paymentStatus.trim() === "") {
      throw new BadRequestError("Payment status is required");
    }

    return await this.orderRepository.updatePaymentStatus(id, paymentStatus);
  }

  // Get order items for an order
  async getOrderItems(orderId: number) {
    if (!orderId || orderId <= 0) {
      throw new BadRequestError("Invalid order ID");
    }

    return await this.orderRepository.getOrderItems(orderId);
  }

  // Cancel order (customer or admin)
  async cancelOrder(id: number, userId: number, role: string) {
    if (!id || id <= 0) {
      throw new BadRequestError("Invalid order ID");
    }

    const order = await this.getOrderById(id);
    if (!order) {
      throw new NotFoundError("Order not found");
    }

    // Check ownership
    if (order.userId !== userId && role !== "admin") {
      throw new ForbiddenError("You are not authorized to cancel this order");
    }

    // Check status - only allow cancellation of pending orders
    if (order.status !== "pending") {
      throw new BadRequestError(`Cannot cancel order in '${order.status}' status`);
    }

    return await this.orderRepository.updateOrderStatus(id, "cancelled");
  }
}

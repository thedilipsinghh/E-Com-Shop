import { eq } from "drizzle-orm";
import { db } from "../../db";
import { orders } from "../../db/schema/Order";
import { orderItems } from "../../db/schema/OrderItem";
import { products } from "../../db/schema/Product";
import { cartItems } from "../../db/schema/CartItem";

export class OrderRepository {
  // Create a new order from cart items
  async createOrder(userId: number, shippingAddress: string, billingAddress: string, paymentMethod: string) {
    try {
      // Get cart items for the user
      const cartItemsList = await db
        .select({
          productId: cartItems.productId,
          quantity: cartItems.quantity,
          price: products.price,
          name: products.name
        })
        .from(cartItems)
        .innerJoin(products, eq(cartItems.productId, products.id))
        .where(eq(cartItems.userId, userId));

      if (cartItemsList.length === 0) {
        throw new Error("Cart is empty");
      }

      // Calculate total amount
      let totalAmount = 0;
      cartItemsList.forEach(item => {
        totalAmount += Number(item.price) * item.quantity;
      });

      // Create order
      const [newOrder] = await db
        .insert(orders)
        .values({
          userId,
          status: 'pending',
          totalAmount: totalAmount.toString(),
          shippingAddress,
          billingAddress,
          paymentMethod,
          paymentStatus: 'pending'
        })
        .returning();

      if (!newOrder) {
        throw new Error("Failed to create order");
      }

      // Create order items
      const orderItemValues = cartItemsList.map(item => ({
        orderId: newOrder.id,
        productId: item.productId,
        quantity: item.quantity,
        price: item.price
      }));

      await db.insert(orderItems).values(orderItemValues);

      // Clear cart after creating order
      await db.delete(cartItems).where(eq(cartItems.userId, userId));

      return newOrder;
    } catch (error) {
      throw error;
    }
  }

  // Get order by ID
  async getOrderById(id: number) {
    try {
      const order = await db
        .select({
          id: orders.id,
          userId: orders.userId,
          status: orders.status,
          totalAmount: orders.totalAmount,
          shippingAddress: orders.shippingAddress,
          billingAddress: orders.billingAddress,
          paymentMethod: orders.paymentMethod,
          paymentStatus: orders.paymentStatus,
          createdAt: orders.createdAt,
          updatedAt: orders.updatedAt
        })
        .from(orders)
        .where(eq(orders.id, id));

      return order[0];
    } catch (error) {
      throw error;
    }
  }

  // Get all orders for a user
  async getUserOrders(userId: number) {
    try {
      const ordersList = await db
        .select({
          id: orders.id,
          userId: orders.userId,
          status: orders.status,
          totalAmount: orders.totalAmount,
          shippingAddress: orders.shippingAddress,
          billingAddress: orders.billingAddress,
          paymentMethod: orders.paymentMethod,
          paymentStatus: orders.paymentStatus,
          createdAt: orders.createdAt,
          updatedAt: orders.updatedAt
        })
        .from(orders)
        .where(eq(orders.userId, userId))
        .orderBy(orders.createdAt);

      return ordersList;
    } catch (error) {
      throw error;
    }
  }

  // Get all orders (admin function)
  async getAllOrders() {
    try {
      const ordersList = await db
        .select({
          id: orders.id,
          userId: orders.userId,
          status: orders.status,
          totalAmount: orders.totalAmount,
          shippingAddress: orders.shippingAddress,
          billingAddress: orders.billingAddress,
          paymentMethod: orders.paymentMethod,
          paymentStatus: orders.paymentStatus,
          createdAt: orders.createdAt,
          updatedAt: orders.updatedAt
        })
        .from(orders)
        .orderBy(orders.createdAt);

      return ordersList;
    } catch (error) {
      throw error;
    }
  }

  // Update order status
  async updateOrderStatus(id: number, status: string) {
    try {
      const [updatedOrder] = await db
        .update(orders)
        .set({ status })
        .where(eq(orders.id, id))
        .returning();

      return updatedOrder;
    } catch (error) {
      throw error;
    }
  }

  // Update payment status
  async updatePaymentStatus(id: number, paymentStatus: string) {
    try {
      const [updatedOrder] = await db
        .update(orders)
        .set({ paymentStatus })
        .where(eq(orders.id, id))
        .returning();

      return updatedOrder;
    } catch (error) {
      throw error;
    }
  }

  // Get order items for an order
  async getOrderItems(orderId: number) {
    try {
      const orderItemsList = await db
        .select({
          id: orderItems.id,
          orderId: orderItems.orderId,
          productId: orderItems.productId,
          quantity: orderItems.quantity,
          price: orderItems.price,
          product: {
            id: products.id,
            name: products.name,
            imageUrl: products.imageUrl
          }
        })
        .from(orderItems)
        .innerJoin(products, eq(orderItems.productId, products.id))
        .where(eq(orderItems.orderId, orderId));

      return orderItemsList;
    } catch (error) {
      throw error;
    }
  }
}

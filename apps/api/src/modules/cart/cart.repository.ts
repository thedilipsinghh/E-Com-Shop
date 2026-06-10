import { eq, and, inArray } from "drizzle-orm";
import { db } from "../../db";
import { cartItems } from "../../db/schema/CartItem";
import { products } from "../../db/schema/Product";
import { ApiError } from "../../errors/AppError";
import { Logger } from "../../utils/logger";

const logger = new Logger("CartRepository");

export interface CartItemBasic {
  id: number;
  quantity: number;
  productId: number;
  product: {
    id: number;
    name: string;
    price: string;
    imageUrl: string | null;
  } | null;
}

export class CartRepository {
  async addToCart(cartData: { userId: number; productId: number; quantity: number }) {
    const { userId, productId, quantity } = cartData;
    const qty = Number(quantity) || 1;

    try {
      logger.info(`Adding to cart: userId=${userId}, productId=${productId}, qty=${qty}`);

      const existingCartItems = await db
        .select()
        .from(cartItems)
        .where(and(eq(cartItems.userId, userId), eq(cartItems.productId, productId)))
        .limit(1);

      const existingCartItem = existingCartItems[0] || null;

      if (existingCartItem) {
        const [updatedItem] = await db
          .update(cartItems)
          .set({ quantity: existingCartItem.quantity + qty, updatedAt: new Date() })
          .where(eq(cartItems.id, existingCartItem.id))
          .returning({ id: cartItems.id, quantity: cartItems.quantity, productId: cartItems.productId });

        logger.info(`Updated cart item: ${updatedItem?.id}`);
        return updatedItem;
      } else {
        const [newItem] = await db
          .insert(cartItems)
          .values({ userId, productId, quantity: qty })
          .returning({ id: cartItems.id, quantity: cartItems.quantity, productId: cartItems.productId });

        logger.info(`Created new cart item: ${newItem?.id}`);
        return newItem;
      }
    } catch (error: any) {
      logger.error(`Failed to add to cart: ${error.message}`, error.stack);
      if (error.code === '23503') {
        throw new ApiError(400, "Invalid product ID - product does not exist");
      }
      throw new ApiError(500, "Failed to add item to cart");
    }
  }

  async getCartItems(userId: number): Promise<CartItemBasic[]> {
    try {
      logger.info(`Fetching cart for userId=${userId}`);

      const cartItemRows = await db
        .select({
          id: cartItems.id,
          quantity: cartItems.quantity,
          productId: cartItems.productId,
        })
        .from(cartItems)
        .where(eq(cartItems.userId, userId));

      if (cartItemRows.length === 0) {
        return [];
      }

      const productIds = cartItemRows.map(item => item.productId).filter(Boolean) as number[];
      
      const productMap = new Map<number, { id: number; name: string; price: string; imageUrl: string | null }>();
      
      if (productIds.length > 0) {
        const productRows = await db
          .select({
            id: products.id,
            name: products.name,
            price: products.price,
            imageUrl: products.imageUrl,
          })
          .from(products)
          .where(inArray(products.id, productIds));

        for (const p of productRows) {
          productMap.set(p.id, {
            id: p.id,
            name: p.name || "",
            price: p.price || "0",
            imageUrl: p.imageUrl,
          });
        }
      }

      const results: CartItemBasic[] = cartItemRows.map(item => ({
        id: item.id,
        quantity: item.quantity,
        productId: item.productId || 0,
        product: item.productId ? productMap.get(item.productId) || null : null,
      }));

      logger.info(`Found ${results.length} cart items`);
      return results;
    } catch (error: any) {
      logger.error(`Failed to fetch cart items: ${error.message}`, error.stack);
      throw new ApiError(500, `Failed to fetch cart items: ${error.message}`);
    }
  }

  async updateCartItemQuantity(cartItemId: number, quantity: number) {
    try {
      logger.info(`Updating cart item ${cartItemId} to quantity ${quantity}`);

      if (quantity <= 0) {
        await db.delete(cartItems).where(eq(cartItems.id, cartItemId));
        logger.info(`Removed cart item ${cartItemId} (quantity <= 0)`);
        return { success: true, message: "Item removed" };
      }

      const [updatedItem] = await db
        .update(cartItems)
        .set({ quantity, updatedAt: new Date() })
        .where(eq(cartItems.id, cartItemId))
        .returning({ id: cartItems.id, quantity: cartItems.quantity });

      if (!updatedItem) {
        throw new ApiError(404, "Cart item not found");
      }

      logger.info(`Updated cart item ${cartItemId}`);
      return updatedItem;
    } catch (error: any) {
      if (error instanceof ApiError) throw error;
      logger.error(`Failed to update cart item: ${error.message}`, error.stack);
      throw new ApiError(500, "Failed to update cart item");
    }
  }

  async removeFromCart(cartItemId: number) {
    try {
      logger.info(`Removing cart item ${cartItemId}`);
      await db.delete(cartItems).where(eq(cartItems.id, cartItemId));
      return { success: true };
    } catch (error: any) {
      logger.error(`Failed to remove cart item: ${error.message}`, error.stack);
      throw new ApiError(500, "Failed to remove cart item");
    }
  }

  async clearCart(userId: number) {
    try {
      logger.info(`Clearing cart for userId=${userId}`);
      await db.delete(cartItems).where(eq(cartItems.userId, userId));
      return { success: true };
    } catch (error: any) {
      logger.error(`Failed to clear cart: ${error.message}`, error.stack);
      throw new ApiError(500, "Failed to clear cart");
    }
  }
}

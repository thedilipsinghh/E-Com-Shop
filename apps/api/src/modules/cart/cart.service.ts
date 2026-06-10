import { CartRepository, CartItemBasic } from "./cart.repository";
import { ApiError } from "../../errors/AppError";
import { Logger } from "../../utils/logger";
import { addToCartSchema, updateCartItemSchema, cartItemIdSchema } from "./cart.validation";

const logger = new Logger("CartService");

export interface CartItemResponse {
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

export interface AddToCartData {
  userId: number;
  productId: number;
  quantity: number;
}

export class CartService {
  private cartRepository: CartRepository;

  constructor() {
    this.cartRepository = new CartRepository();
  }

  async addToCart(cartData: AddToCartData) {
    // Note: route level middleware validateRequest parses and validates body and params,
    // but we can still perform a check or keep the service validation.
    // Let's validate the inner body schema contents directly.
    const parsed = addToCartSchema.safeParse({ body: { productId: cartData.productId, quantity: cartData.quantity } });
    if (!parsed.success) {
      const errors = parsed.error.issues.map((e: any) => e.message).join(", ");
      logger.warn(`Validation failed: ${errors}`);
      throw new ApiError(400, `Validation error: ${errors}`);
    }

    const { userId, productId, quantity } = cartData;
    logger.info(`Adding to cart: userId=${userId}, productId=${productId}, qty=${quantity}`);

    return await this.cartRepository.addToCart({ userId, productId, quantity });
  }

  async getCartItems(userId: number): Promise<CartItemBasic[]> {
    if (!userId || userId <= 0) {
      throw new ApiError(400, "Invalid user ID");
    }

    logger.info(`Fetching cart for userId=${userId}`);
    return await this.cartRepository.getCartItems(userId);
  }

  async updateCartItemQuantity(cartItemId: number, quantity: number) {
    const parsedId = cartItemIdSchema.safeParse({ params: { cartItemId } });
    if (!parsedId.success) {
      throw new ApiError(400, "Invalid cart item ID");
    }

    const parsedQty = updateCartItemSchema.safeParse({ body: { quantity }, params: { cartItemId } });
    if (!parsedQty.success) {
      throw new ApiError(400, "Invalid quantity");
    }

    logger.info(`Updating cart item ${cartItemId} to quantity ${quantity}`);
    return await this.cartRepository.updateCartItemQuantity(cartItemId, quantity);
  }

  async removeFromCart(cartItemId: number) {
    const parsed = cartItemIdSchema.safeParse({ params: { cartItemId } });
    if (!parsed.success) {
      throw new ApiError(400, "Invalid cart item ID");
    }

    logger.info(`Removing cart item ${cartItemId}`);
    return await this.cartRepository.removeFromCart(cartItemId);
  }

  async clearCart(userId: number) {
    if (!userId || userId <= 0) {
      throw new ApiError(400, "Invalid user ID");
    }

    logger.info(`Clearing cart for userId=${userId}`);
    return await this.cartRepository.clearCart(userId);
  }
}

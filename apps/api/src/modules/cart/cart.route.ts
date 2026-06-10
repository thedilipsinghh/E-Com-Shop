import { Router } from "express";
import { 
  addToCart, 
  getCartItems, 
  updateCartItemQuantity, 
  removeFromCart, 
  clearCart 
} from "./cart.controller";
import { authenticate } from "../../middleware/auth";
import { validateRequest } from "../../middleware/validate";
import { addToCartSchema, updateCartItemSchema, cartItemIdSchema } from "./cart.validation";

const router = Router();

router.post("/", authenticate, validateRequest(addToCartSchema), addToCart);
router.get("/user", authenticate, getCartItems);
router.put("/:cartItemId/quantity", authenticate, validateRequest(updateCartItemSchema), updateCartItemQuantity);
router.delete("/:cartItemId", authenticate, validateRequest(cartItemIdSchema), removeFromCart);
router.delete("/user/clear", authenticate, clearCart);

export default router;

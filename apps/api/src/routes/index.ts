import { Router } from "express";
import authRoutes from "../modules/auth/auth.route";
import productRoutes from "../modules/product/product.route";
import cartRoutes from "../modules/cart/cart.route";
import orderRoutes from "../modules/order/order.route";
import profileRoutes from "../modules/profile/profile.route";

const router = Router();

router.use("/auth", authRoutes);
router.use("/products", productRoutes);
router.use("/cart", cartRoutes);
router.use("/orders", orderRoutes);
router.use("/profile", profileRoutes);

export default router;

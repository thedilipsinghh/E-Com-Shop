import { Router } from "express";
import { 
  createOrder, 
  getOrderById, 
  getUserOrders, 
  getAllOrders, 
  updateOrderStatus, 
  updatePaymentStatus, 
  getOrderItems,
  cancelOrder
} from "./order.controller";
import { authenticate, adminOnly } from "../../middleware/auth";
import { validateRequest } from "../../middleware/validate";
import { 
  createOrderSchema, 
  orderIdParamSchema, 
  userIdParamSchema, 
  updateOrderStatusSchema, 
  updatePaymentStatusSchema, 
  orderItemsParamSchema 
} from "./order.validation";

const router = Router();

router.post("/", authenticate, validateRequest(createOrderSchema), createOrder);
router.get("/user/:userId", authenticate, validateRequest(userIdParamSchema), getUserOrders);
router.get("/admin/all", authenticate, adminOnly, getAllOrders);
router.put("/status/:id", authenticate, adminOnly, validateRequest(updateOrderStatusSchema), updateOrderStatus);
router.put("/payment/:id", authenticate, adminOnly, validateRequest(updatePaymentStatusSchema), updatePaymentStatus);
router.get("/items/:orderId", authenticate, validateRequest(orderItemsParamSchema), getOrderItems);
router.put("/:id/cancel", authenticate, validateRequest(orderIdParamSchema), cancelOrder);
router.get("/:id", authenticate, validateRequest(orderIdParamSchema), getOrderById);

export default router;

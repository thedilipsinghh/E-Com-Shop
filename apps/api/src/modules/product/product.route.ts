import { Router } from "express";
import { 
  createProduct, 
  getProductById, 
  getAllProducts, 
  updateProduct, 
  deleteProduct 
} from "./product.controller";
import { authenticate, adminOnly } from "../../middleware/auth";
import { validateRequest } from "../../middleware/validate";
import { 
  createProductSchema, 
  updateProductSchema, 
  productIdParamSchema, 
  getProductsQuerySchema 
} from "./product.validation";

const router = Router();

router.get("/", validateRequest(getProductsQuerySchema), getAllProducts);
router.get("/:id", validateRequest(productIdParamSchema), getProductById);
router.post("/", authenticate, adminOnly, validateRequest(createProductSchema), createProduct);
router.put("/:id", authenticate, adminOnly, validateRequest(updateProductSchema), updateProduct);
router.delete("/:id", authenticate, adminOnly, validateRequest(productIdParamSchema), deleteProduct);

export default router;

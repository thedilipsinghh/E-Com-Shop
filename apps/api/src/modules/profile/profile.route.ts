import { Router } from "express";
import { 
  getProfile, 
  updateProfile, 
  updateUser, 
  getAddresses, 
  createAddress, 
  updateAddress, 
  deleteAddress, 
  setDefaultAddress 
} from "./profile.controller";
import { authenticate } from "../../middleware/auth";
import { validateRequest } from "../../middleware/validate";
import { 
  updateProfileSchema, 
  updateUserSchema, 
  createAddressSchema, 
  updateAddressSchema, 
  addressIdParamSchema 
} from "./profile.validation";

const router = Router();

router.get("/", authenticate, getProfile);
router.put("/", authenticate, validateRequest(updateProfileSchema), updateProfile);
router.put("/user", authenticate, validateRequest(updateUserSchema), updateUser);
router.get("/addresses", authenticate, getAddresses);
router.post("/addresses", authenticate, validateRequest(createAddressSchema), createAddress);
router.put("/addresses/:id", authenticate, validateRequest(updateAddressSchema), updateAddress);
router.delete("/addresses/:id", authenticate, validateRequest(addressIdParamSchema), deleteAddress);
router.put("/addresses/:id/default", authenticate, validateRequest(addressIdParamSchema), setDefaultAddress);

export default router;

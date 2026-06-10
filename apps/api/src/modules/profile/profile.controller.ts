import { Request, Response } from "express";
import { ProfileService } from "./profile.service";
import { UserService } from "./user.service";
import { asyncHandler } from "../../utils/asyncHandler";
import { sendResponse } from "../../utils/sendResponse";

const profileService = new ProfileService();
const userService = new UserService();

export const getProfile = asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as any).user?.userId;
  const data = await profileService.getProfile(userId);
  return sendResponse(res, { success: true, message: "Profile retrieved", data });
});

export const updateProfile = asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as any).user?.userId;
  const data = await profileService.updateProfile(userId, req.body);
  return sendResponse(res, { success: true, message: "Profile updated", data });
});

export const updateUser = asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as any).user?.userId;
  const { name, mobile, phone } = req.body;
  const data = await userService.updateUser(userId, name, mobile || phone);
  return sendResponse(res, { success: true, message: "User updated", data });
});

export const getAddresses = asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as any).user?.userId;
  const data = await profileService.getAddresses(userId);
  return sendResponse(res, { success: true, message: "Addresses retrieved", data });
});

export const createAddress = asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as any).user?.userId;
  const data = await profileService.createAddress(userId, req.body);
  return sendResponse(res, { success: true, message: "Address created", data });
});

export const updateAddress = asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as any).user?.userId;
  const addressId = parseInt(req.params.id as string);
  const data = await profileService.updateAddress(userId, addressId, req.body);
  return sendResponse(res, { success: true, message: "Address updated", data });
});

export const deleteAddress = asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as any).user?.userId;
  const addressId = parseInt(req.params.id as string);
  await profileService.deleteAddress(userId, addressId);
  return sendResponse(res, { success: true, message: "Address deleted" });
});

export const setDefaultAddress = asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as any).user?.userId;
  const addressId = parseInt(req.params.id as string);
  await profileService.setDefaultAddress(userId, addressId);
  return sendResponse(res, { success: true, message: "Default address updated" });
});

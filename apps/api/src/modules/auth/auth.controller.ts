import { LOGIN_REQUEST, REGISTER_REQUEST, USER } from "@repo/types";
import { Request, Response } from "express";
import { AuthService } from "./auth.service";
import { asyncHandler } from "../../utils/asyncHandler";
import { sendResponse } from "../../utils/sendResponse";
import { env } from "../../config/env";
import jwt from "jsonwebtoken";

const authService = new AuthService();

export const login = asyncHandler(async (
  req: Request<{}, {}, LOGIN_REQUEST>,
  res: Response
) => {
  const { email, password } = req.body;
  
  const user = await authService.login(email, password);
  
  const token = jwt.sign(
    { userId: user.id, email: user.email, role: user.role },
    env.JWT_KEY,
    { expiresIn: "7d" }
  );

  return sendResponse(res, {
    success: true,
    message: "Login successful",
    data: { token, user: user as USER }
  });
});

export const register = asyncHandler(async (
  req: Request<{}, {}, REGISTER_REQUEST>,
  res: Response
) => {
  const { name, email, password, mobile, profilePic } = req.body;
  
  const user = await authService.register(name, email, password, mobile, profilePic);
  
  const token = jwt.sign(
    { userId: user.id, email: user.email, role: user.role },
    env.JWT_KEY,
    { expiresIn: "7d" }
  );

  return sendResponse(res, {
    success: true,
    message: "Registration successful",
    data: { token, user: user as USER }
  });
});

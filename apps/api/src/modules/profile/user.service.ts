import { AuthRepository } from "../auth/auth.repository";
import { BadRequestError } from "../../errors/AppError";
import bcrypt from "bcryptjs";

export class UserService {
  private userRepository: AuthRepository;

  constructor() {
    this.userRepository = new AuthRepository();
  }

  async updateUser(userId: number, name?: string, mobile?: string) {
    if (!name && !mobile) {
      throw new BadRequestError("Name or mobile is required");
    }

    const updateData: { name?: string; mobile?: string } = {};
    if (name) updateData.name = name;
    if (mobile) updateData.mobile = mobile;

    // Check if mobile is already taken by another user
    if (mobile) {
      const existingUser = await this.userRepository.findUserByMobile(mobile);
      if (existingUser && existingUser.id !== userId) {
        throw new BadRequestError("Mobile number already in use");
      }
    }

    return this.userRepository.updateUser(userId, updateData);
  }

  async updatePassword(userId: number, currentPassword: string, newPassword: string) {
    const user = await this.userRepository.findUserByIdWithPassword(userId);
    if (!user) {
      throw new BadRequestError("User not found");
    }

    const isValid = await bcrypt.compare(currentPassword, user.password);
    if (!isValid) {
      throw new BadRequestError("Current password is incorrect");
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    return this.userRepository.updatePassword(userId, hashedPassword);
  }
}

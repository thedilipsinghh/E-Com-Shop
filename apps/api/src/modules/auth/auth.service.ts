import { AuthRepository } from "./auth.repository";
import { BadRequestError, UnauthorizedError, ConflictError } from "../../errors/AppError";
import bcrypt from "bcryptjs";

export class AuthService {
  private authRepository: AuthRepository;

  constructor() {
    this.authRepository = new AuthRepository();
  }

  async login(email: string, password: string) {
    if (!email || !password) {
      throw new BadRequestError("Email and password are required");
    }

    const existingUser = await this.authRepository.findUserByEmail(email);
    if (!existingUser) {
      throw new UnauthorizedError("Invalid email or password");
    }

    const isPasswordValid = await bcrypt.compare(password, existingUser.password);
    if (!isPasswordValid) {
      throw new UnauthorizedError("Invalid email or password");
    }

    if (!existingUser.isActive) {
      throw new UnauthorizedError("Account is inactive");
    }

    return {
      id: existingUser.id,
      name: existingUser.name,
      email: existingUser.email,
      role: existingUser.role
    };
  }

  async register(name: string, email: string, password: string, mobile: string, profilePic?: string | null) {
    if (!name || !email || !password || !mobile) {
      throw new BadRequestError("Name, email, password, and mobile are required");
    }

    const existingUser = await this.authRepository.findUserByEmail(email);
    if (existingUser) {
      throw new ConflictError("User with this email already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await this.authRepository.createUser({
      name,
      email,
      password: hashedPassword,
      mobile,
      role: "customer",
      profilePic: profilePic || null,
    });

    if (!newUser) {
      throw new BadRequestError("Failed to create user");
    }

    return {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role
    };
  }
}

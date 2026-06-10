import { eq } from "drizzle-orm";
import { db } from "../../db";
import { user } from "../../db/schema/User";

export class AuthRepository {
  async findUserByEmail(email: string) {
    const [existingUser] = await db
      .select({
        id: user.id,
        name: user.name,
        email: user.email,
        password: user.password,
        role: user.role,
        isActive: user.isActive
      })
      .from(user)
      .where(eq(user.email, email));
    return existingUser;
  }

  async findUserById(id: number) {
    const [existingUser] = await db
      .select({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        isActive: user.isActive
      })
      .from(user)
      .where(eq(user.id, id));
    return existingUser;
  }

  async findUserByIdWithPassword(id: number) {
    const [existingUser] = await db
      .select({
        id: user.id,
        name: user.name,
        email: user.email,
        password: user.password,
        role: user.role,
        isActive: user.isActive
      })
      .from(user)
      .where(eq(user.id, id));
    return existingUser;
  }

  async createUser(userData: { name: string; email: string; mobile: string; password: string; role?: string; profilePic?: string | null }) {
    const [newUser] = await db.insert(user).values({
      name: userData.name,
      email: userData.email,
      mobile: userData.mobile,
      password: userData.password,
      role: userData.role || "customer",
      isActive: true,
      profilePic: userData.profilePic || null,
    }).returning({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      isActive: user.isActive
    });
    return newUser;
  }

  async findUserByMobile(mobile: string) {
    const [existingUser] = await db
      .select({
        id: user.id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        password: user.password,
        role: user.role,
        isActive: user.isActive
      })
      .from(user)
      .where(eq(user.mobile, mobile));
    return existingUser;
  }

  async updateUser(id: number, data: { name?: string; mobile?: string }) {
    const [updatedUser] = await db
      .update(user)
      .set({
        name: data.name,
        mobile: data.mobile,
        updatedAt: new Date()
      })
      .where(eq(user.id, id))
      .returning({
        id: user.id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        role: user.role,
        isActive: user.isActive,
        profilePic: user.profilePic
      });
    return updatedUser;
  }

  async updatePassword(id: number, password: string) {
    const [updatedUser] = await db
      .update(user)
      .set({
        password,
        updatedAt: new Date()
      })
      .where(eq(user.id, id))
      .returning({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        isActive: user.isActive
      });
    return updatedUser;
  }
}

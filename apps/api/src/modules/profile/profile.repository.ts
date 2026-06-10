import { eq, and } from "drizzle-orm";
import { db } from "../../db";
import { customerProfile, address } from "../../db/schema/CustomerProfile";

export class ProfileRepository {
  async getProfileByUserId(userId: number) {
    const [profile] = await db
      .select()
      .from(customerProfile)
      .where(eq(customerProfile.userId, userId));
    return profile;
  }

  async createProfile(userId: number, data: Partial<typeof customerProfile.$inferInsert>) {
    const [profile] = await db
      .insert(customerProfile)
      .values({ userId, ...data })
      .returning();
    return profile;
  }

  async updateProfile(userId: number, data: Partial<typeof customerProfile.$inferInsert>) {
    const [profile] = await db
      .update(customerProfile)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(customerProfile.userId, userId))
      .returning();
    return profile;
  }

  async getAddresses(userId: number) {
    return db
      .select()
      .from(address)
      .where(eq(address.userId, userId));
  }

  async getDefaultAddress(userId: number) {
    const [addr] = await db
      .select()
      .from(address)
      .where(and(eq(address.userId, userId), eq(address.isDefault, true)));
    return addr;
  }

  async createAddress(userId: number, data: Omit<typeof address.$inferInsert, 'userId'>) {
    if (data.isDefault) {
      await db
        .update(address)
        .set({ isDefault: false })
        .where(and(eq(address.userId, userId), eq(address.isDefault, true)));
    }
    const [addr] = await db
      .insert(address)
      .values({ userId, ...data })
      .returning();
    return addr;
  }

  async updateAddress(id: number, userId: number, data: Partial<typeof address.$inferInsert>) {
    if (data.isDefault) {
      await db
        .update(address)
        .set({ isDefault: false })
        .where(and(eq(address.userId, userId), eq(address.isDefault, true)));
    }
    const [addr] = await db
      .update(address)
      .set({ ...data, updatedAt: new Date() })
      .where(and(eq(address.id, id), eq(address.userId, userId)))
      .returning();
    return addr;
  }

  async deleteAddress(id: number, userId: number) {
    await db
      .delete(address)
      .where(and(eq(address.id, id), eq(address.userId, userId)));
    return { success: true };
  }

  async setDefaultAddress(id: number, userId: number) {
    await db
      .update(address)
      .set({ isDefault: false })
      .where(and(eq(address.userId, userId), eq(address.isDefault, true)));
    await db
      .update(address)
      .set({ isDefault: true })
      .where(and(eq(address.id, id), eq(address.userId, userId)));
    return { success: true };
  }
}

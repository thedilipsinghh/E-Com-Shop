import { pgTable, serial, text, timestamp, integer, decimal } from "drizzle-orm/pg-core";
import { user } from "./User";

export const orders = pgTable("orders", {
    id: serial().primaryKey(),
    userId: integer("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
    status: text().default('pending').notNull(),
    totalAmount: decimal("total_amount", { precision: 10, scale: 2 }).notNull(),
    shippingAddress: text("shipping_address").notNull(),
    billingAddress: text("billing_address").notNull(),
    paymentMethod: text("payment_method").notNull(),
    paymentStatus: text("payment_status").default('pending').notNull(),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow()
});

export type Order = typeof orders.$inferSelect;
export type NewOrder = typeof orders.$inferInsert;

import { pgTable, serial, integer, timestamp, decimal } from "drizzle-orm/pg-core";
import { orders } from "./Order";
import { products } from "./Product";

export const orderItems = pgTable("order_items", {
    id: serial().primaryKey(),
    orderId: integer("order_id").notNull().references(() => orders.id, { onDelete: "cascade" }),
    productId: integer("product_id").notNull().references(() => products.id, { onDelete: "cascade" }),
    quantity: integer().notNull(),
    price: decimal({ precision: 10, scale: 2 }).notNull(),
    createdAt: timestamp("created_at").defaultNow()
});

export type OrderItem = typeof orderItems.$inferSelect;
export type NewOrderItem = typeof orderItems.$inferInsert;

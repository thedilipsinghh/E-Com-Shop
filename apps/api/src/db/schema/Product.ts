import { pgTable, serial, text, timestamp, integer, boolean, decimal } from "drizzle-orm/pg-core";

export const products = pgTable("products", {
    id: serial().primaryKey(),
    name: text().notNull(),
    description: text(),
    price: decimal({ precision: 10, scale: 2 }).notNull(),
    category: text().notNull(),
    brand: text(),
    stockQuantity: integer("stock_quantity").default(0).notNull(),
    sku: text(),
    imageUrl: text("image_url"),
    isActive: boolean("is_active").default(true).notNull(),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow()
});

export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;

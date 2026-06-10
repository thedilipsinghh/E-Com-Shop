import { pgTable, serial, text, timestamp, boolean, integer, varchar } from "drizzle-orm/pg-core";
import { user } from "./User";

export const customerProfile = pgTable("customer_profiles", {
    id: serial().primaryKey(),
    userId: integer("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
    
    phone: varchar({ length: 20 }),
    dateOfBirth: timestamp("date_of_birth"),
    gender: text(),
    
    createdAt: timestamp("created_at"),
    updatedAt: timestamp("updated_at")
});

export const address = pgTable("addresses", {
    id: serial().primaryKey(),
    userId: integer("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
    
    label: text(),
    fullName: text("full_name").notNull(),
    phone: text().notNull(),
    
    addressLine1: text("address_line_1").notNull(),
    addressLine2: text("address_line_2"),
    
    city: text().notNull(),
    state: text().notNull(),
    postalCode: text("postal_code").notNull(),
    country: text().notNull(),
    
    isDefault: boolean("is_default").notNull(),
    
    createdAt: timestamp("created_at"),
    updatedAt: timestamp("updated_at")
});

export type CustomerProfile = typeof customerProfile.$inferSelect;
export type NewCustomerProfile = typeof customerProfile.$inferInsert;
export type Address = typeof address.$inferSelect;
export type NewAddress = typeof address.$inferInsert;

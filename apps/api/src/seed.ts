import { eq } from "drizzle-orm";
import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import { user, products } from "./db/schema";
import bcrypt from "bcryptjs";
import { env } from "./config/env";

const {
    SEED_ADMIN_NAME,
    SEED_ADMIN_EMAIL,
    SEED_ADMIN_MOBILE,
    SEED_ADMIN_PASSWORD,
    SEED_ADMIN_ROLE
} = process.env;

const seedProducts = [
    { name: "Premium Wireless Headphones", description: "High-quality wireless headphones with noise cancellation", price: "149.99", category: "Electronics", brand: "SoundMax", stockQuantity: 50, sku: "WH-001", imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop", isActive: true },
    { name: "Smart Watch Pro", description: "Advanced smartwatch with health tracking", price: "299.99", category: "Electronics", brand: "TechLife", stockQuantity: 30, sku: "SW-001", imageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=500&fit=crop", isActive: true },
    { name: "Running Shoes Elite", description: "Lightweight running shoes for athletes", price: "89.99", category: "Sports", brand: "FitRun", stockQuantity: 100, sku: "RS-001", imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&h=500&fit=crop", isActive: true },
    { name: "Organic Coffee Beans", description: "Premium organic arabica coffee beans", price: "24.99", category: "Food", brand: "GreenBean", stockQuantity: 200, sku: "CF-001", imageUrl: "https://images.unsplash.com/photo-1559056199-641a0acde0ce?w=500&h=500&fit=crop", isActive: true },
    { name: "Yoga Mat Premium", description: "Non-slip yoga mat with carrying strap", price: "39.99", category: "Sports", brand: "ZenFit", stockQuantity: 75, sku: "YM-001", imageUrl: "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=500&h=500&fit=crop", isActive: true },
    { name: "Bluetooth Speaker", description: "Portable waterproof bluetooth speaker", price: "79.99", category: "Electronics", brand: "SoundMax", stockQuantity: 60, sku: "BS-001", imageUrl: "https://images.unsplash.com/photo-1608043154009-775a8c3b29a4?w=500&h=500&fit=crop", isActive: true },
    { name: "Fitness Tracker Band", description: "Lightweight fitness tracker with heart rate monitor", price: "59.99", category: "Electronics", brand: "TechLife", stockQuantity: 80, sku: "FT-001", imageUrl: "https://images.unsplash.com/photo-1575311373937-040f8e2f9b94?w=500&h=500&fit=crop", isActive: true },
    { name: "Denim Jacket Classic", description: "Stylish denim jacket for casual wear", price: "69.99", category: "Clothing", brand: "UrbanStyle", stockQuantity: 45, sku: "DJ-001", imageUrl: "https://images.unsplash.com/photo-1576995853127-5a1034d7c6dd?w=500&h=500&fit=crop", isActive: true },
    { name: "Leather Wallet", description: "Genuine leather bi-fold wallet", price: "44.99", category: "Accessories", brand: "LuxLeather", stockQuantity: 90, sku: "LW-001", imageUrl: "https://images.unsplash.com/photo-1627123424574-7247588d8551?w=500&h=500&fit=crop", isActive: true },
    { name: "Vitamin D3 Supplement", description: "60 count vitamin D3 softgels", price: "19.99", category: "Health", brand: "NatureWell", stockQuantity: 150, sku: "VD-001", imageUrl: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&h=500&fit=crop", isActive: true },
    { name: "Wireless Mouse", description: "Ergonomic wireless mouse", price: "29.99", category: "Electronics", brand: "TechLife", stockQuantity: 120, sku: "WM-001", imageUrl: "https://images.unsplash.com/photo-1527864550417-7fd91db3ca9f?w=500&h=500&fit=crop", isActive: true },
    { name: "Cotton T-Shirt Pack", description: "3-pack premium cotton t-shirts", price: "34.99", category: "Clothing", brand: "UrbanStyle", stockQuantity: 200, sku: "TS-001", imageUrl: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=500&fit=crop", isActive: true }
];

export const seedAdmin = async (): Promise<void> => {
    let pool: Pool | null = null;
    try {
        pool = new Pool({ connectionString: env.PG_URL });
        const db = drizzle(pool);

        // First create tables using raw SQL
        await pool.query(`
            CREATE TABLE IF NOT EXISTS "users" (
                "id" serial PRIMARY KEY,
                "name" text NOT NULL,
                "email" text NOT NULL UNIQUE,
                "mobile" text NOT NULL UNIQUE,
                "password" text NOT NULL,
                "role" text DEFAULT 'employee',
                "is_active" boolean DEFAULT true,
                "created_at" timestamp DEFAULT now(),
                "updated_at" timestamp DEFAULT now(),
                "profile_pic" text,
                "department" text,
                "job_role" text,
                "doj" timestamp,
                "dob" timestamp,
                "is_delete" boolean DEFAULT false
            );
            
            CREATE TABLE IF NOT EXISTS "products" (
                "id" serial PRIMARY KEY,
                "name" text NOT NULL,
                "description" text,
                "price" decimal(10,2) NOT NULL,
                "category" text NOT NULL,
                "brand" text,
                "stock_quantity" integer DEFAULT 0,
                "sku" text UNIQUE,
                "image_url" text,
                "is_active" boolean DEFAULT true,
                "created_at" timestamp DEFAULT now(),
                "updated_at" timestamp DEFAULT now()
            );
            
            CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
            CREATE INDEX IF NOT EXISTS idx_products_brand ON products(brand);
            CREATE INDEX IF NOT EXISTS idx_products_is_active ON products(is_active);
        `);
        console.log("Tables created/verified");

        // Seed admin
        if (!SEED_ADMIN_EMAIL || !SEED_ADMIN_PASSWORD) {
            throw new Error("Missing required env variables");
        }

        const [existing] = await db.select().from(user).where(eq(user.email, SEED_ADMIN_EMAIL));
        if (!existing) {
            const hashedPassword = await bcrypt.hash(SEED_ADMIN_PASSWORD, 10);
            await db.insert(user).values({
                name: SEED_ADMIN_NAME || "Admin",
                email: SEED_ADMIN_EMAIL,
                mobile: SEED_ADMIN_MOBILE || "1234567890",
                password: hashedPassword,
                role: SEED_ADMIN_ROLE || "admin",
                isActive: true
            });
            console.log("Admin user seeded");
        } else {
            console.log("Admin already exists");
        }

        // Seed products
        for (const p of seedProducts) {
            await db.insert(products).values(p).onConflictDoNothing();
        }
        console.log("Products seeded successfully");
    } catch (error) {
        console.error("Seed error:", error);
    } finally {
        if (pool) await pool.end();
        process.exit(0);
    }
};

seedAdmin();
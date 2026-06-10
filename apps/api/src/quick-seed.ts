import { Pool } from "pg";
import 'dotenv/config';

const pool = new Pool({ connectionString: process.env.PG_URL });

async function seed() {
  try {
    // Create products table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS products (
        id serial PRIMARY KEY,
        name text NOT NULL,
        description text,
        price decimal(10,2) NOT NULL,
        category text NOT NULL,
        brand text,
        stock_quantity integer DEFAULT 0,
        sku text UNIQUE,
        image_url text,
        is_active boolean DEFAULT true,
        created_at timestamp DEFAULT now(),
        updated_at timestamp DEFAULT now()
      )
    `);
    console.log('Products table created');

    // Insert products
    const products = [
      { name: "Premium Wireless Headphones", desc: "High-quality wireless headphones", price: "149.99", cat: "Electronics", brand: "SoundMax", stock: 50, sku: "WH-001", img: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500" },
      { name: "Smart Watch Pro", desc: "Advanced smartwatch", price: "299.99", cat: "Electronics", brand: "TechLife", stock: 30, sku: "SW-001", img: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500" },
      { name: "Running Shoes Elite", desc: "Lightweight running shoes", price: "89.99", cat: "Sports", brand: "FitRun", stock: 100, sku: "RS-001", img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500" },
      { name: "Organic Coffee Beans", desc: "Premium organic coffee", price: "24.99", cat: "Food", brand: "GreenBean", stock: 200, sku: "CF-001", img: "https://images.unsplash.com/photo-1559056199-641a0acde0ce?w=500" },
      { name: "Yoga Mat Premium", desc: "Non-slip yoga mat", price: "39.99", cat: "Sports", brand: "ZenFit", stock: 75, sku: "YM-001", img: "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=500" },
      { name: "Bluetooth Speaker", desc: "Portable speaker", price: "79.99", cat: "Electronics", brand: "SoundMax", stock: 60, sku: "BS-001", img: "https://images.unsplash.com/photo-1608043154009-775a8c3b29a4?w=500" },
      { name: "Fitness Tracker Band", desc: "Fitness tracker", price: "59.99", cat: "Electronics", brand: "TechLife", stock: 80, sku: "FT-001", img: "https://images.unsplash.com/photo-1575311373937-040f8e2f9b94?w=500" },
      { name: "Denim Jacket Classic", desc: "Stylish denim jacket", price: "69.99", cat: "Clothing", brand: "UrbanStyle", stock: 45, sku: "DJ-001", img: "https://images.unsplash.com/photo-1576995853127-5a1034d7c6dd?w=500" },
      { name: "Leather Wallet", desc: "Genuine leather wallet", price: "44.99", cat: "Accessories", brand: "LuxLeather", stock: 90, sku: "LW-001", img: "https://images.unsplash.com/photo-1627123424574-7247588d8551?w=500" },
      { name: "Vitamin D3 Supplement", desc: "Vitamin D3", price: "19.99", cat: "Health", brand: "NatureWell", stock: 150, sku: "VD-001", img: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500" },
      { name: "Wireless Mouse", desc: "Ergonomic mouse", price: "29.99", cat: "Electronics", brand: "TechLife", stock: 120, sku: "WM-001", img: "https://images.unsplash.com/photo-1527864550417-7fd91db3ca9f?w=500" },
      { name: "Cotton T-Shirt Pack", desc: "3-pack t-shirts", price: "34.99", cat: "Clothing", brand: "UrbanStyle", stock: 200, sku: "TS-001", img: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500" },
    ];

    for (const p of products) {
      await pool.query(
        `INSERT INTO products (name, description, price, category, brand, stock_quantity, sku, image_url, is_active) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, true) 
         ON CONFLICT (sku) DO NOTHING`,
        [p.name, p.desc, p.price, p.cat, p.brand, p.stock, p.sku, p.img]
      );
    }

    const result = await pool.query('SELECT id, name, price, category FROM products');
    console.log('Seeded:', result.rows.length, 'products');

    const userResult = await pool.query('SELECT id, name, email FROM users');
    console.log('Users:', userResult.rows);

  } catch (e) {
    console.error(e);
  } finally {
    await pool.end();
    process.exit(0);
  }
}

seed();
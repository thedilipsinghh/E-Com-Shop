import { eq } from "drizzle-orm";
import { db } from "../../db";
import { products } from "../../db/schema/Product";

export class ProductRepository {
  // Create a new product
  async createProduct(productData: typeof products.$inferInsert) {
    try {
      const [newProduct] = await db.insert(products).values(productData).returning();
      return newProduct;
    } catch (error) {
      throw error;
    }
  }

  // Get product by ID
  async getProductById(id: number) {
    try {
      const product = await db.select().from(products).where(eq(products.id, id));
      return product[0];
    } catch (error) {
      throw error;
    }
  }

  // Get all products with optional filtering
  async getAllProducts(filters: {
    category?: string;
    brand?: string;
    isActive?: boolean;
    limit?: number;
    offset?: number;
  } = {}) {
    try {
      let query = db.select().from(products);

      if (filters.category) {
        query = query.where(eq(products.category, filters.category)) as typeof query;
      }
      if (filters.brand) {
        query = query.where(eq(products.brand, filters.brand)) as typeof query;
      }
      if (filters.isActive !== undefined) {
        query = query.where(eq(products.isActive, filters.isActive)) as typeof query;
      }

      if (filters.limit) {
        query = query.limit(filters.limit) as typeof query;
      }
      if (filters.offset) {
        query = query.offset(filters.offset) as typeof query;
      }

      const productList = await (query as any);
      return productList;
    } catch (error) {
      throw error;
    }
  }

  // Update product by ID
  async updateProduct(id: number, productData: Partial<typeof products.$inferInsert>) {
    try {
      const [updatedProduct] = await db
        .update(products)
        .set(productData)
        .where(eq(products.id, id))
        .returning();
      return updatedProduct;
    } catch (error) {
      throw error;
    }
  }

  // Delete product by ID
  async deleteProduct(id: number) {
    try {
      await db.delete(products).where(eq(products.id, id));
      return { success: true };
    } catch (error) {
      throw error;
    }
  }
}

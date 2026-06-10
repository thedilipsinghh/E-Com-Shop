import { ProductRepository } from "./product.repository";
import { BadRequestError } from "../../errors/AppError";

export class ProductService {
  private productRepository: ProductRepository;

  constructor() {
    this.productRepository = new ProductRepository();
  }

  // Create a new product
  async createProduct(productData: any) {
    if (!productData.name || !productData.price || !productData.category) {
      throw new BadRequestError("Name, price, and category are required");
    }

    if (productData.price <= 0) {
      throw new BadRequestError("Price must be greater than zero");
    }

    return await this.productRepository.createProduct(productData);
  }

  // Get product by ID
  async getProductById(id: number) {
    if (!id || id <= 0) {
      throw new BadRequestError("Invalid product ID");
    }

    const product = await this.productRepository.getProductById(id);
    if (!product) {
      throw new BadRequestError("Product not found");
    }

    return product;
  }

  // Get all products with optional filtering
  async getAllProducts(filters: any = {}) {
    return await this.productRepository.getAllProducts(filters);
  }

  // Update product by ID
  async updateProduct(id: number, productData: any) {
    if (!id || id <= 0) {
      throw new BadRequestError("Invalid product ID");
    }

    if (productData.price !== undefined && productData.price <= 0) {
      throw new BadRequestError("Price must be greater than zero");
    }

    const updatedProduct = await this.productRepository.updateProduct(id, productData);
    if (!updatedProduct) {
      throw new BadRequestError("Product not found");
    }

    return updatedProduct;
  }

  // Delete product by ID
  async deleteProduct(id: number) {
    if (!id || id <= 0) {
      throw new BadRequestError("Invalid product ID");
    }

    return await this.productRepository.deleteProduct(id);
  }
}

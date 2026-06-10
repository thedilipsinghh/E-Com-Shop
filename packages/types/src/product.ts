export type ProductType = {
  id: number
  name: string
  description: string | null
  price: number
  category: string
  brand: string | null
  stockQuantity: number
  sku: string | null
  imageUrl: string | null
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export type ProductResponse = {
  success: boolean
  message: string
  data: ProductType[] | ProductType
}

export type CreateProductRequest = {
  name: string
  description?: string | null
  price: number
  category: string
  brand?: string | null
  stockQuantity?: number
  sku?: string | null
  imageUrl?: string | null
  originalPrice?: number | null
}
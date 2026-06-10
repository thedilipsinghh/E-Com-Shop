export type CartItemType = {
  id: number
  userId: number
  productId: number
  quantity: number
  createdAt: string
  updatedAt: string
  product: {
    id: number
    name: string
    price: number
    imageUrl: string | null
    stockQuantity: number
  }
}

export type CartResponse = {
  success: boolean
  message: string
  data: CartItemType[] | CartItemType
}

export type AddToCartRequest = {
  productId: number
  quantity: number
}

export type UpdateCartItemRequest = {
  cartItemId: number
  quantity: number
}
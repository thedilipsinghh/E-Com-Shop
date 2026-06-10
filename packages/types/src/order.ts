export type OrderStatus = "pending" | "processing" | "shipped" | "delivered" | "cancelled"

export type PaymentStatus = "pending" | "paid" | "failed" | "refunded"

export type OrderType = {
  id: number
  userId: number
  status: OrderStatus | string
  totalAmount: string
  shippingAddress: string
  billingAddress: string
  paymentMethod: string
  paymentStatus: PaymentStatus | string
  createdAt: string
  updatedAt: string
}

export type OrderItemType = {
  id: number
  orderId: number
  productId: number
  quantity: number
  price: string
  createdAt: string
}

export type OrderResponse = {
  success: boolean
  message: string
  data: OrderType[] | OrderType
}

export type CreateOrderRequest = {
  userId: number
  shippingAddress: string
  billingAddress: string
  paymentMethod: string
}

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { RootState } from '../store'
import type { CreateOrderRequest, OrderItemType, OrderType } from "@repo/types"

interface ApiResponse<T> {
  success: boolean
  message: string
  data: T
  meta?: Record<string, unknown>
}

// Define the base query with credentials for cookies and bearer token from state
const baseQuery = fetchBaseQuery({
  baseUrl: `${process.env.NEXT_PUBLIC_API_URL}/api/orders`,
  credentials: 'include',
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.token
    if (token) {
      headers.set('Authorization', `Bearer ${token}`)
    }
    return headers
  }
})

export const orderApi = createApi({
  reducerPath: 'orderApi',
  baseQuery,
  tagTypes: ['Order', 'OrderItem'],
  endpoints: (builder) => ({
    getOrders: builder.query<OrderType[], void>({
      query: () => '/admin/all',
      transformResponse: (response: ApiResponse<OrderType[]>) => response.data || [],
      providesTags: ['Order']
    }),
    getUserOrders: builder.query<OrderType[], number>({
      query: (userId) => `/user/${userId}`,
      transformResponse: (response: ApiResponse<OrderType[]>) => response.data || [],
      providesTags: (result, error, userId) => [{ type: 'Order', id: userId }]
    }),
    getOrderById: builder.query<OrderType, number>({
      query: (id) => `/${id}`,
      transformResponse: (response: ApiResponse<OrderType>) => response.data,
      providesTags: (result, error, id) => [{ type: 'Order', id }]
    }),
    createOrder: builder.mutation<OrderType, CreateOrderRequest>({
      query: (orderData) => ({
        url: '/',
        method: 'POST',
        body: orderData
      }),
      transformResponse: (response: ApiResponse<OrderType>) => response.data,
      invalidatesTags: ['Order']
    }),
    updateOrderStatus: builder.mutation<OrderType, { id: number; status: string }>({
      query: ({ id, status }) => ({
        url: `/status/${id}`,
        method: 'PUT',
        body: { status }
      }),
      transformResponse: (response: ApiResponse<OrderType>) => response.data,
      invalidatesTags: (result, error, arg) => [{ type: 'Order', id: arg.id }]
    }),
    updatePaymentStatus: builder.mutation<OrderType, { id: number; paymentStatus: string }>({
      query: ({ id, paymentStatus }) => ({
        url: `/payment/${id}`,
        method: 'PUT',
        body: { paymentStatus }
      }),
      transformResponse: (response: ApiResponse<OrderType>) => response.data,
      invalidatesTags: (result, error, arg) => [{ type: 'Order', id: arg.id }]
    }),
    getOrderItems: builder.query<OrderItemType[], number>({
      query: (orderId) => `/items/${orderId}`,
      transformResponse: (response: ApiResponse<OrderItemType[]>) => response.data || [],
      providesTags: (result, error, orderId) => [{ type: 'OrderItem', id: orderId }]
    }),
    cancelOrder: builder.mutation<OrderType, number>({
      query: (id) => ({
        url: `/${id}/cancel`,
        method: 'PUT'
      }),
      transformResponse: (response: ApiResponse<OrderType>) => response.data,
      invalidatesTags: (result, error, id) => [{ type: 'Order', id }]
    })
  })
})

export const {
  useGetOrdersQuery,
  useGetUserOrdersQuery,
  useGetOrderByIdQuery,
  useCreateOrderMutation,
  useUpdateOrderStatusMutation,
  useUpdatePaymentStatusMutation,
  useGetOrderItemsQuery,
  useCancelOrderMutation
} = orderApi

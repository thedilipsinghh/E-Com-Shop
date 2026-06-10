import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { RootState } from '../store'
import type { AddToCartRequest, CartItemType, UpdateCartItemRequest } from "@repo/types"

interface ApiResponse<T> {
  success: boolean
  message: string
  data: T
  meta?: Record<string, unknown>
}

const baseQuery = fetchBaseQuery({
  baseUrl: `${process.env.NEXT_PUBLIC_API_URL}/api/cart`,
  credentials: 'include',
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.token
    if (token) {
      headers.set('Authorization', `Bearer ${token}`)
    }
    return headers
  }
})

export const cartApi = createApi({
  reducerPath: 'cartApi',
  baseQuery,
  tagTypes: ['Cart'],
  endpoints: (builder) => ({
    getCart: builder.query<CartItemType[], void>({
      query: () => '/user',
      transformResponse: (response: ApiResponse<CartItemType[]>) => response.data || [],
      providesTags: ['Cart']
    }),
    addToCart: builder.mutation<CartItemType, AddToCartRequest>({
      query: (cartData) => ({
        url: '/',
        method: 'POST',
        body: cartData
      }),
      invalidatesTags: ['Cart']
    }),
    updateCartItemQuantity: builder.mutation<CartItemType, UpdateCartItemRequest & { cartItemId: number }>({
      query: ({ cartItemId, quantity }) => ({
        url: `/${cartItemId}/quantity`,
        method: 'PUT',
        body: { quantity }
      }),
      invalidatesTags: ['Cart']
    }),
    removeFromCart: builder.mutation<{ success: boolean }, number>({
      query: (cartItemId) => ({
        url: `/${cartItemId}`,
        method: 'DELETE'
      }),
      invalidatesTags: ['Cart']
    }),
    clearCart: builder.mutation<{ success: boolean }, void>({
      query: () => ({
        url: '/user/clear',
        method: 'DELETE'
      }),
      invalidatesTags: ['Cart']
    })
  })
})

export const {
  useGetCartQuery,
  useAddToCartMutation,
  useUpdateCartItemQuantityMutation,
  useRemoveFromCartMutation,
  useClearCartMutation
} = cartApi

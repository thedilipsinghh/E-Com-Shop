import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { RootState } from '../store'
import type { CreateProductRequest, ProductType } from "@repo/types"

interface ApiResponse<T> {
  success: boolean
  message: string
  data: T
  meta?: Record<string, unknown>
}

const baseQuery = fetchBaseQuery({
  baseUrl: `${process.env.NEXT_PUBLIC_API_URL}/api/products`,
  credentials: 'include',
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.token
    if (token) {
      headers.set('Authorization', `Bearer ${token}`)
    }
    return headers
  }
})

export const productApi = createApi({
  reducerPath: 'productApi',
  baseQuery,
  tagTypes: ['Product'],
  endpoints: (builder) => ({
    getProducts: builder.query<ProductType[], void>({
      query: () => '/',
      transformResponse: (response: ApiResponse<ProductType[]>) => response.data || [],
      providesTags: ['Product']
    }),
    getProductById: builder.query<ProductType, number>({
      query: (id) => `/${id}`,
      transformResponse: (response: ApiResponse<ProductType>) => response.data as ProductType,
      providesTags: (result, error, id) => [{ type: 'Product', id }]
    }),
    createProduct: builder.mutation<ProductType, CreateProductRequest>({
      query: (productData) => ({
        url: '/',
        method: 'POST',
        body: productData
      }),
      invalidatesTags: ['Product']
    }),
    updateProduct: builder.mutation<ProductType, CreateProductRequest & { id: number }>({
      query: ({ id, ...productData }) => ({
        url: `/${id}`,
        method: 'PUT',
        body: productData
      }),
      invalidatesTags: ['Product']
    }),
    deleteProduct: builder.mutation<{ success: boolean }, number>({
      query: (id) => ({
        url: `/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: ['Product']
    })
  })
})

export const {
  useGetProductsQuery,
  useGetProductByIdQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation
} = productApi

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { RootState } from '../store'

interface ApiResponse<T> {
  success: boolean
  message: string
  data: T
  meta?: Record<string, unknown>
}

const baseQuery = fetchBaseQuery({
  baseUrl: `${process.env.NEXT_PUBLIC_API_URL}/api/profile`,
  credentials: 'include',
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.token
    if (token) {
      headers.set('Authorization', `Bearer ${token}`)
    }
    return headers
  }
})

export interface Address {
  id: number
  userId: number
  label: string | null
  fullName: string
  phone: string
  addressLine1: string
  addressLine2: string | null
  city: string
  state: string
  postalCode: string
  country: string
  isDefault: boolean
  createdAt: string
  updatedAt: string
}

export interface CustomerProfile {
  id: number
  userId: number
  phone: string | null
  dateOfBirth: string | null
  gender: string | null
}

export interface ProfileResponse {
  profile: CustomerProfile
  addresses: Address[]
  defaultAddress: Address | null
}

export const profileApi = createApi({
  reducerPath: 'profileApi',
  baseQuery,
  tagTypes: ['Profile'],
  endpoints: (builder) => ({
    getProfile: builder.query<ProfileResponse, void>({
      query: () => '/profile',
      providesTags: ['Profile']
    }),
    updateProfile: builder.mutation<CustomerProfile, Partial<{ phone: string; dateOfBirth: string; gender: string; profilePic: string }>>({
      query: (profileData) => ({
        url: '/profile',
        method: 'PUT',
        body: profileData
      }),
      invalidatesTags: ['Profile']
    }),
    updateUser: builder.mutation<{ id: number; name: string; email: string; mobile: string }, { name?: string; mobile?: string }>({
      query: (userData) => ({
        url: '/user',
        method: 'PUT',
        body: userData
      }),
      invalidatesTags: ['Profile']
    }),
    getAddresses: builder.query<Address[], void>({
      query: () => '/addresses',
      transformResponse: (response: ApiResponse<Address[]>) => response.data || [],
      providesTags: ['Profile']
    }),
    createAddress: builder.mutation<Address, { label?: string; fullName: string; phone: string; addressLine1: string; addressLine2?: string; city: string; state: string; postalCode: string; country?: string; isDefault?: boolean }>({
      query: (addressData) => ({
        url: '/addresses',
        method: 'POST',
        body: addressData
      }),
      invalidatesTags: ['Profile']
    }),
    updateAddress: builder.mutation<Address, { id: number } & Partial<Address>>({
      query: ({ id, ...data }) => ({
        url: `/addresses/${id}`,
        method: 'PUT',
        body: data
      }),
      invalidatesTags: ['Profile']
    }),
    deleteAddress: builder.mutation<{ success: boolean }, number>({
      query: (id) => ({
        url: `/addresses/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: ['Profile']
    }),
    setDefaultAddress: builder.mutation<{ success: boolean }, number>({
      query: (id) => ({
        url: `/addresses/${id}/default`,
        method: 'PUT'
      }),
      invalidatesTags: ['Profile']
    })
  })
})

export const {
  useGetProfileQuery,
  useUpdateProfileMutation,
  useUpdateUserMutation,
  useGetAddressesQuery,
  useCreateAddressMutation,
  useUpdateAddressMutation,
  useDeleteAddressMutation,
  useSetDefaultAddressMutation
} = profileApi
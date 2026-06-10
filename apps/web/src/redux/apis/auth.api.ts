import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { LOGIN_REQUEST, REGISTER_REQUEST } from "@repo/types"

export interface AuthResponse {
  success: boolean
  message: string
  data: {
    token: string
    user: {
      id: number
      name: string
      email: string
      role: string
    }
  }
}

export const authApi = createApi({
    reducerPath: 'authApi',
    baseQuery: fetchBaseQuery({ 
        baseUrl: `${process.env.NEXT_PUBLIC_API_URL}/api/auth`, 
        credentials: 'include' 
    }),
    endpoints: (builder) => {
        return {
            signin: builder.mutation<AuthResponse, LOGIN_REQUEST>({
                query: (userdata) => {
                    return {
                        url: '/login',
                        method: 'POST',
                        body: userdata
                    }
                },
            }),
            signup: builder.mutation<AuthResponse, REGISTER_REQUEST>({
                query: (userdata) => {
                    return {
                        url: '/register',
                        method: 'POST',
                        body: userdata
                    }
                },
            }),
            signout: builder.mutation<{success: boolean}, void>({
                query: () => {
                    return {
                        url: '/logout',
                        method: 'POST',
                    }
                },
            }),
        }
    }
});

export const { useSigninMutation, useSignupMutation, useSignoutMutation } = authApi;
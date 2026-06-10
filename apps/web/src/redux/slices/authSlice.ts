import { createSlice } from '@reduxjs/toolkit'
import { User } from "@repo/types"

// Define types for our state
interface AuthState {
  user: User | null
  token: string | null
  isLoading: boolean
  isAuthenticated: boolean
  error: string | null
}

// Initial state - check localStorage for existing session
const loadInitialState = () => {
  if (typeof window !== 'undefined') {
    const savedUser = localStorage.getItem('user')
    const savedToken = localStorage.getItem('token')
    if (savedUser && savedToken) {
      return {
        user: JSON.parse(savedUser),
        token: savedToken,
        isLoading: false,
        isAuthenticated: true,
        error: null
      }
    }
  }
  return {
    user: null,
    token: null,
    isLoading: false,
    isAuthenticated: false,
    error: null
  }
}

const initialState: AuthState = loadInitialState()

// Auth slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload.user
      state.token = action.payload.token
      state.isAuthenticated = !!action.payload.user
      state.isLoading = false
      state.error = null
      if (typeof window !== 'undefined') {
        localStorage.setItem('user', JSON.stringify(action.payload.user))
        localStorage.setItem('token', action.payload.token)
      }
    },
    clearUser: (state) => {
      state.user = null
      state.token = null
      state.isAuthenticated = false
      state.isLoading = false
      state.error = null
      if (typeof window !== 'undefined') {
        localStorage.removeItem('user')
        localStorage.removeItem('token')
      }
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload
    },
    setError: (state, action) => {
      state.error = action.payload
      state.isLoading = false
    },
    clearError: (state) => {
      state.error = null
    }
  }
})

export const { setUser, clearUser, setLoading, setError, clearError } = authSlice.actions
export type { AuthState }
export default authSlice.reducer
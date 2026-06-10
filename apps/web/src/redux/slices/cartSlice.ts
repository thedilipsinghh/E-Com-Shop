import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { CartItemType } from "@repo/types"

// Define types for our state
interface CartState {
  items: CartItemType[]
  itemCount: number
  totalAmount: number
  isLoading: boolean
  error: string | null
}

// Initial state
const initialState: CartState = {
  items: [],
  itemCount: 0,
  totalAmount: 0,
  isLoading: false,
  error: null
}

// Async thunks for cart actions
export const fetchCart = createAsyncThunk(
  'cart/fetchCart',
  async (userId: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/cart/${userId}`, {
        method: 'GET',
        credentials: 'include',
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to fetch cart')
      }

      const data = await response.json()
      return data.data
    } catch (error: any) {
      return rejectWithValue(error.message)
    }
  }
)

export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async (cartData: { productId: number; quantity: number }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/cart`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(cartData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to add to cart')
      }

      const data = await response.json()
      return data.data
    } catch (error: any) {
      return rejectWithValue(error.message)
    }
  }
)

export const updateCartItemQuantity = createAsyncThunk(
  'cart/updateQuantity',
  async (cartData: { cartItemId: string; quantity: number }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/cart/${cartData.cartItemId}/quantity`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ quantity: cartData.quantity }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to update cart item')
      }

      const data = await response.json()
      return data.data
    } catch (error: any) {
      return rejectWithValue(error.message)
    }
  }
)

export const removeFromCart = createAsyncThunk(
  'cart/removeFromCart',
  async (cartItemId: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/cart/${cartItemId}`, {
        method: 'DELETE',
        credentials: 'include',
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to remove from cart')
      }

      const data = await response.json()
      return { success: true, cartItemId }
    } catch (error: any) {
      return rejectWithValue(error.message)
    }
  }
)

export const clearCart = createAsyncThunk(
  'cart/clearCart',
  async (userId: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/cart/user/${userId}`, {
        method: 'DELETE',
        credentials: 'include',
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to clear cart')
      }

      const data = await response.json()
      return { success: true }
    } catch (error: any) {
      return rejectWithValue(error.message)
    }
  }
)

// Cart slice
const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    // Reducers for local state updates (optimistic updates)
    addItem: (state, action) => {
      const existingItem = state.items.find(item => item.product.id === action.payload.product.id)
      if (existingItem) {
        existingItem.quantity += action.payload.quantity
      } else {
        state.items.push(action.payload)
      }
      state.itemCount = state.items.reduce((total, item) => total + item.quantity, 0)
      state.totalAmount = state.items.reduce((total, item) => total + (item.product.price * item.quantity), 0)
    },
    removeItem: (state, action) => {
      state.items = state.items.filter(item => item.product.id !== action.payload)
      state.itemCount = state.items.reduce((total, item) => total + item.quantity, 0)
      state.totalAmount = state.items.reduce((total, item) => total + (item.product.price * item.quantity), 0)
    },
    updateQuantity: (state, action) => {
      const { productId, quantity } = action.payload
      const item = state.items.find(item => item.product.id === productId)
      if (item) {
        if (quantity <= 0) {
          state.items = state.items.filter(item => item.product.id !== productId)
        } else {
          item.quantity = quantity
        }
        state.itemCount = state.items.reduce((total, item) => total + item.quantity, 0)
        state.totalAmount = state.items.reduce((total, item) => total + (item.product.price * item.quantity), 0)
      }
    },
    clearCart: (state) => {
      state.items = []
      state.itemCount = 0
      state.totalAmount = 0
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch cart
      .addCase(fetchCart.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.isLoading = false
        state.items = action.payload || []
        state.itemCount = state.items.reduce((total, item) => total + item.quantity, 0)
        state.totalAmount = state.items.reduce((total, item) => total + (item.product.price * item.quantity), 0)
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
        // If we can't fetch cart, we keep local state but show error
      })
      
      // Add to cart
      .addCase(addToCart.pending, (state) => {
        state.isLoading = true
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.isLoading = false
        // Optionally update with server data
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      
      // Update quantity
      .addCase(updateCartItemQuantity.pending, (state) => {
        state.isLoading = true
      })
      .addCase(updateCartItemQuantity.fulfilled, (state, action) => {
        state.isLoading = false
        // Optionally update with server data
      })
      .addCase(updateCartItemQuantity.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      
      // Remove from cart
      .addCase(removeFromCart.pending, (state) => {
        state.isLoading = true
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.isLoading = false
        // Optionally update with server data
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      
      // Clear cart
      .addCase(clearCart.pending, (state) => {
        state.isLoading = true
      })
      .addCase(clearCart.fulfilled, (state) => {
        state.isLoading = false
        state.items = []
        state.itemCount = 0
        state.totalAmount = 0
      })
      .addCase(clearCart.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
  }
})

export const { addItem, removeItem, updateQuantity, clearCart: clearCartReducer } = cartSlice.actions
export type { CartState }
export default cartSlice.reducer

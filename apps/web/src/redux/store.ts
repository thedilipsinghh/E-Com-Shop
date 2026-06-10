import { configureStore } from '@reduxjs/toolkit';
import { authApi } from './apis/auth.api';
import { productApi } from './apis/product.api';
import { cartApi } from './apis/cart.api';
import { orderApi } from './apis/order.api';
import { profileApi } from './apis/profile.api';
import authReducer from './slices/authSlice';
import cartReducer from './slices/cartSlice';

const reduxStore = configureStore({
    reducer: {
        [authApi.reducerPath]: authApi.reducer,
        [productApi.reducerPath]: productApi.reducer,
        [cartApi.reducerPath]: cartApi.reducer,
        [orderApi.reducerPath]: orderApi.reducer,
        [profileApi.reducerPath]: profileApi.reducer,
        auth: authReducer,
        cart: cartReducer,
    },
    middleware: (def) => def()
        .concat(authApi.middleware)
        .concat(productApi.middleware)
        .concat(cartApi.middleware)
        .concat(orderApi.middleware)
        .concat(profileApi.middleware)
});

export type RootState = ReturnType<typeof reduxStore.getState>;
export type AppDispatch = typeof reduxStore.dispatch;

export default reduxStore;

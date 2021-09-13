import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
// SLICES
import admin from './slices/admin';
import auth from './slices/auth';
import category from './slices/category';
import establishment from './slices/establishment';
import establishmentAdmin from './slices/establishmentAdmin';
import establishmentImage from './slices/establishmentImage';
import product from './slices/product';
import productImage from './slices/productImage';
import role from './slices/role';
import sale from './slices/sale';
import saleImage from './slices/saleImage';
import statistic from './slices/statistic';
import user from './slices/user';

// MIDDLEWARE
const middleware = getDefaultMiddleware();

// STORE
const store = configureStore({
    reducer: {
        admin,
        auth,
        category,
        establishment,
        establishmentAdmin,
        establishmentImage,
        product,
        productImage,
        role,
        sale,
        saleImage,
        statistic,
        user,
    },
    middleware,
});

// ROOTSTATE TYPE
export type RootState = ReturnType<typeof store.getState>;
// TYPED DISPATCH
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();

export default store;

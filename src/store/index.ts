import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
// SLICES
import admin from './slices/admin';
import auth from './slices/auth';
import statistic from './slices/statistic';
import user from './slices/user';

// MIDDLEWARE
const middleware = getDefaultMiddleware();

// STORE
const store = configureStore({
    reducer: {
        admin,
        auth,
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

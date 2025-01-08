// src/store.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../src/auth/authSlice'

const store = configureStore({
  reducer: {
    auth: authReducer, // 在 Redux store 中註冊 authSlice
  },
});

export default store;

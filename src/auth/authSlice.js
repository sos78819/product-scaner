import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isLogin: false, // 用戶是否已登錄
  user: null, // 登錄的用戶信息
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action) => {
      state.isLogin = true;
      state.user = action.payload; // 保存用戶資料
    },
    logout: (state) => {
      state.isLogin = false;
      state.user = null; // 清除用戶資料
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;

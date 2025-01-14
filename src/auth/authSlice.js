import { createSlice } from '@reduxjs/toolkit';
const user = localStorage.getItem('SYSTEM_ADMIN_NAME')
const token = localStorage.getItem('token')
const initialState = user && token ?
{
  isLogin: true, // 用戶是否已登錄
  user: user, // 登錄的用戶信息
}:{
  isLogin: false, // 用戶是否已登錄
  user: null, // 登錄的用戶信息
}

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
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;

// ApiService.js
import axios from 'axios';

class ApiService {
  constructor(baseURL) {
    this.axiosInstance = axios.create({
      baseURL: baseURL || 'http://localhost:3000',
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  setAuthorizationToken(token) {
    this.axiosInstance.defaults.headers['Authorization'] = `Bearer ${token}`;
  }



  // 設置 token
  // setToken(token) {
  //   this.token = token; // 保存 token
  // }

  // // 移除 token
  // removeToken() {
  //   this.token = null; // 清除 token
  // }

  // 錯誤處理
  handleError(error) {
    let errorMessage = '發生未知錯誤';
    let status = null;
    let errorCode = null;
  
    if (error.response) {
      // 解析 API 回應
      status = error.response.status;
      const { data } = error.response;
      
      errorMessage = data.message || errorMessage;  // 使用 API 提供的錯誤訊息
      errorCode = data.code || null; // API 若有提供錯誤碼，則一併記錄  
      switch (status) {
        case 400:
          errorMessage = errorMessage || '請求錯誤';
          break;
        case 401:
          errorMessage = errorMessage || '未授權，請重新登入';
          localStorage.removeItem('user_token'); // 清除 token
          window.location.href = '/login'; // 跳轉到登入頁
          break;
        case 403:
          errorMessage = errorMessage || '權限不足，請聯絡管理員';
          break;
        case 404:
          errorMessage = errorMessage || '請求的資源不存在';
          break;
        case 500:
          errorMessage = errorMessage || '伺服器錯誤，請稍後再試';
          break;
        default:
          errorMessage = errorMessage || `錯誤代碼 ${status}`;
      }
      console.error(`❌ API Error (${status} - ${errorCode}):`, errorMessage);
    } else if (error.request) {
      // 伺服器無回應
      errorMessage = '伺服器無回應，請檢查網路';
      console.error('❌ No response received:', error.request);
    } else {
      // 其他錯誤
      errorMessage = error.message || '未知錯誤';
      console.error('❌ Error:', errorMessage);
    }  
    return { message: errorMessage, status, code: errorCode };
  }
  

  // POST 请求
  async post(url, data) {
    try {
      const response = await this.axiosInstance.post(url, data);
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // GET 请求
  async get(url, params = {}) {
    try {
      const response = await this.axiosInstance.get(url, { params });
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // PUT 请求
  async put(url, data) {
    try {
      const response = await this.axiosInstance.put(url, data);
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }
}

export default ApiService;

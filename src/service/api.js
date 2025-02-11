// ApiService.js
import axios from 'axios';

class ApiService {
  constructor(baseURL) {
    this.token = null; // token 初始值
    this.axiosInstance = axios.create({
      baseURL: baseURL || 'http://localhost:3000',  
      headers: {
        'Content-Type': 'application/json',
      },
    });

    
    this.axiosInstance.interceptors.request.use(
      (config) => {
        // 如果有 token，加上Authorization
        if (this.token) {
          config.headers['Authorization'] = `Bearer ${this.token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

  }

  // 設置 token
  setToken(token) {
    this.token = token; // 保存 token
  }

  // 移除 token
  removeToken() {
    this.token = null; // 清除 token
  }

  // 錯誤處理
  handleError(error) {
    if (error.response) {
      // 伺服器返回錯誤代碼
      const { status, data } = error.response;
      console.error(`Error ${status}:`, data);
      if (status === 401) {
        // 處理未授權錯誤，清除 token 等
        this.removeToken();
      }
      return data; // 回傳伺服器錯誤訊息
    } else if (error.request) {
      // 請求已發送但沒有收到回應
      console.error('No response received:', error.request);
      return { message: 'No response from server' };
    } else {
      // 發生錯誤時的處理
      console.error('Error:', error.message);
      return { message: error.message };
    }
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

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

    // 
    this.axiosInstance.interceptors.response.use(
      (response) => {
        console.log(response.status)
        return response;
      },
      (error) => {
        return Promise.reject(this.handleError(error));
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
      return {
        status: error.response.status,
        message: error.response.data.message || 'An error occurred',
      };
    } else if (error.request) {
      return {
        status: 500,
        message: 'NetWork Error 系統連線失敗',
      };
    } else {
      return {
        status: null,
        message: error.message || 'An unknown error occurred',
      };
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

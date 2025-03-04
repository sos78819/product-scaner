import axios from 'axios';

class ApiService {
  constructor(baseURL) {
    this.axiosInstance = axios.create({
      baseURL: baseURL || 'http://localhost:3000',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // 需要 Token 驗證的 API 路由
    this.protectedRoutes = [
      '/qr/checkStatus',
      '/qr/setStatus',
    ];

    // 設定請求攔截器（僅攔截 `protectedRoutes` 內的 API）
    this.axiosInstance.interceptors.request.use(
      async (config) => {
        const pathname = new URL(config.url, window.location.origin).pathname;
        if (this.protectedRoutes.includes(pathname)) {
          const token = localStorage.getItem('token');
          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
          }
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // 設定回應攔截器
    this.axiosInstance.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        if (error.response) {
          const status = error.response.status;
          console.error('❌ API Error Status:', status);
        }

        // 如果是受保護的路由並且遇到 401 錯誤
        const pathname = new URL(originalRequest.url, window.location.origin).pathname;
        console.log(pathname)
        if (
          this.protectedRoutes.includes(pathname) &&
          (error.response?.status === 401 || error.response?.status === 403) &&
          !originalRequest._retry
        ) {
          originalRequest._retry = true;
          try {
            // 嘗試刷新 Token
            console.log('刷新')
            const newToken = await this.refreshToken();
            if (!newToken) {
              console.error('🔴 無法獲取新 Token');
              return Promise.reject(error); // 直接拋出原始錯誤
            }
            localStorage.setItem('token', newToken);
            originalRequest.headers.Authorization = `Bearer ${newToken}`;

            return this.axiosInstance(originalRequest); // 重新發送請求
          } catch (refreshError) {
            console.error('🔴 無法刷新 Token，請檢查 API_KEY 或伺服器狀態');
          }
        }

        return Promise.reject(error); // 不呼叫 `handleError`，讓 `catch` 處理
      }
    );
  }

  setAuthorizationToken(token) {
    this.axiosInstance.defaults.headers['Authorization'] = `Bearer ${token}`;
  }

  // **透過 API_KEY 取得新 Token**
  async refreshToken() {
    try {
      const response = await axios.post(`${import.meta.env.VITE_BASEURL}/qr/token`, {
        API_KEY: import.meta.env.VITE_APIKEY,
      });
      return response.data?.data?.TOKEN || null; // 確保回傳正確的 Token
    } catch (error) {
      console.error('🔴 無法獲取新 Token，錯誤:', error);
      return null;
    }
  }

  // **統一的錯誤處理方法**
  handleError(error) {
    console.log('handleError', error);

    if (error.isHandled) {
      return error; // 避免重複處理錯誤
    }
    error.isHandled = true; // 標記錯誤已處理

    let errorMessage = '發生未知錯誤';
    let status = null;
    let errorCode = null;

    if (error.response) {
      status = error.response.status;
      const { data } = error.response;

      errorMessage = data.message || errorMessage;
      errorCode = data.code || null;

      switch (status) {
        case 400:
          errorMessage = errorMessage || '請求錯誤';
          break;
        case 401:
          errorMessage = errorMessage || '未授權，請重新登入';
          localStorage.removeItem('user_token');
          window.location.href = '/login';
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
      errorMessage = '伺服器無回應';
      console.error('❌ No response received:', error.request);
    } else {
      errorMessage = error.message || '未知錯誤';
      console.error('❌ Error:', errorMessage);
    }

    return { message: errorMessage, status, code: errorCode };
  }

  
// **GET 請求**
async get(url, params = {}, headers = {}) {
  console.log("Headers before request:", headers);
  try {
    const response = await this.axiosInstance.get(url, {
      params: params,  
      headers: headers 
    });
    return response;
  } catch (error) {
    if (!error.isHandled) { // 確保 `handleError` 只執行一次
      throw this.handleError(error);
    }
    throw error;
  }
}


  // **POST 請求**
  async post(url, data) {
    try {
      const response = await this.axiosInstance.post(url, data);
      return response;
    } catch (error) {
      if (!error.isHandled) {
        throw this.handleError(error);
      }
      throw error;
    }
  }

  // **PUT 請求**
// **PUT 請求**
async put(url, data, headers = {}) {
  console.log("Headers before request:", headers);
  try {
    const response = await this.axiosInstance.put(url, data, {
      headers: headers,
    });
    return response;
  } catch (error) {
    if (!error.isHandled) {
      throw this.handleError(error);
    }
    throw error;
  }
}

  // **delete 請求**
  async delete(url, data, headers) {
    try {
      const response = await this.axiosInstance.delete(url, 
        data,        
        headers
      );
      return response;
    } catch (error) {
      if (!error.isHandled) {
        throw this.handleError(error);
      }
      throw error;
    }
  }
}

export default ApiService;

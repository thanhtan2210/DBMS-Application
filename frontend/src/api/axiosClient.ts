import axios, { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

/**
 * DBMS MONOLITH - CORE NETWORK LAYER
 * Updated to handle both raw responses (Auth) and wrapped responses (Business logic).
 */

const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

const axiosClient: AxiosInstance = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// --- REQUEST INTERCEPTOR ---
axiosClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Trích xuất token từ LocalStorage
    const token = localStorage.getItem('access_token');
    
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// --- RESPONSE INTERCEPTOR ---
axiosClient.interceptors.response.use(
  (response: AxiosResponse) => {
    /**
     * LOGIC XỬ LÝ WRAPPER:
     * 1. Nếu phản hồi có trường 'success', đây là ApiResponse wrapper -> trả về response.data.data
     * 2. Nếu không có 'success', đây là AuthResponse trực tiếp -> trả về response.data
     */
    const data = response.data;
    
    if (Object.prototype.hasOwnProperty.call(data, 'success')) {
      // Chỉ trả về lõi dữ liệu nếu gọi thành công
      if (data.success) {
        return data.data;
      } else {
        return Promise.reject(data);
      }
    }

    return data;
  },
  (error) => {
    if (error.response) {
      const { status } = error.response;

      // Xử lý 401 - Hết hạn phiên làm việc
      if (status === 401) {
        localStorage.removeItem('access_token');
        // Redirect về login nếu không phải đang ở trang login
        if (!window.location.pathname.includes('/login')) {
           window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

export default axiosClient;

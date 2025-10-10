import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import { useAuthStore } from '@/store/authStore';
import { message } from 'antd';

// API基础URL
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// 创建axios实例
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器
api.interceptors.request.use(
  (config) => {
    // 添加认证token
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response.data;
  },
  (error: AxiosError<any>) => {
    // 处理错误响应
    if (error.response) {
      const { status, data } = error.response;

      switch (status) {
        case 401:
          // 未授权，清除登录状态并跳转到登录页
          useAuthStore.getState().logout();
          window.location.href = '/login';
          message.error('登录已过期，请重新登录');
          break;

        case 403:
          message.error('没有权限访问该资源');
          break;

        case 404:
          message.error('请求的资源不存在');
          break;

        case 500:
          message.error('服务器错误，请稍后再试');
          break;

        default:
          message.error(data?.message || '请求失败，请稍后再试');
      }
    } else if (error.request) {
      message.error('网络连接失败，请检查网络设置');
    } else {
      message.error('请求配置错误');
    }

    return Promise.reject(error);
  }
);

// API响应类型
interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: any;
}

// 封装请求方法
export const request = {
  get: <T = any>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> => {
    return api.get(url, config);
  },

  post: <T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> => {
    return api.post(url, data, config);
  },

  put: <T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> => {
    return api.put(url, data, config);
  },

  delete: <T = any>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> => {
    return api.delete(url, config);
  },

  patch: <T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> => {
    return api.patch(url, data, config);
  },
};

export default api;

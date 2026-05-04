import axiosClient from './axiosClient';
import { LoginRequest, AuthResponse, RegisterRequest } from '@/types';

/**
 * DBMS MONOLITH - AUTH SERVICE
 * Handles communication with Spring Boot AuthController.
 */

const authService = {
  /**
   * Đăng nhập người dùng bằng email và mật khẩu.
   * Spring Boot trả về object chứa token trực tiếp.
   */
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    return axiosClient.post('/auth/login', data);
  },

  /**
   * Cập nhật Profile
   */
  getProfile: async (): Promise<any> => {
    return axiosClient.get('/v1/users/me');
  },

  updateProfile: async (data: { fullName: string; phone: string; address: string }): Promise<any> => {
    return axiosClient.put('/v1/users/me', data);
  },

  uploadAvatar: async (file: File): Promise<any> => {
    const formData = new FormData();
    formData.append('file', file);
    return axiosClient.post('/v1/users/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },

  deleteAccount: async (password: string): Promise<any> => {
    return axiosClient.delete('/v1/users/me', { data: { password } });
  },

  /**
   * Đăng ký người dùng mới.
   */
  register: async (data: RegisterRequest): Promise<any> => {
    return axiosClient.post('/auth/register', data);
  },
};

export default authService;

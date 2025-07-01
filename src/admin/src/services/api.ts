import axios, { AxiosInstance, AxiosResponse } from 'axios';

// API Response Interfaces
export interface User {
  maNguoiDung: number;
  tenDangNhap: string;
  email: string;
  hoTen: string;
  soDienThoai: string;
  trangThaiHoatDong: boolean;
  ngayTao: string;
  maVaiTro: number;
  tenVaiTro: string;
  maBacSi: number | null;
  chuyenKhoa: string | null;
  soNamKinhNghiem: number | null;
  trangThaiLamViec: boolean | null;
  maBenhNhan: number | null;
  ngaySinh: string | null;
  gioiTinh: string | null;
  diaChi: string | null;
  tienSuBenh: string | null;
  diUng: string | null;
  tuoi: number | null;
}

export interface UsersResponse {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  users: User[];
}

export interface DeactivateResponse {
  message: string;
}

// Định nghĩa interface cho doanh thu tổng thể
export interface RevenueSummary {
  nhan: string;
  doanhThu: number;
  soHoaDon: number;
  loaiThongKe: string;
}

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('token');
      window.location.href = '/admin/signin';
    }
    return Promise.reject(error);
  }
);

// Admin API Services
export const adminApi = {
  // Get all users with pagination
  getUsers: async (): Promise<UsersResponse> => {
    try {
      const response: AxiosResponse<UsersResponse> = await apiClient.get('/api/admin/users');
      return response.data;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  },

  // Get users with pagination parameters
  getUsersWithPagination: async (page: number = 0, size: number = 10): Promise<UsersResponse> => {
    try {
      const response: AxiosResponse<UsersResponse> = await apiClient.get('/api/admin/users', {
        params: {
          page,
          size,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching users with pagination:', error);
      throw error;
    }
  },

  // Get user by ID
  getUserById: async (userId: number): Promise<User> => {
    try {
      const response: AxiosResponse<User> = await apiClient.get(`/api/admin/users/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user by ID:', error);
      throw error;
    }
  },

  // Create new user
  createUser: async (userData: Partial<User>): Promise<User> => {
    try {
      const response: AxiosResponse<User> = await apiClient.post('/api/admin/users', userData);
      return response.data;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  },

  // Update user
  updateUser: async (userId: number, userData: Partial<User>): Promise<User> => {
    try {
      const response: AxiosResponse<User> = await apiClient.put(`/api/admin/users/${userId}`, userData);
      return response.data;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  },

  // Delete user
  deleteUser: async (userId: number): Promise<void> => {
    try {
      await apiClient.delete(`/api/admin/users/${userId}`);
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  },

  // Toggle user status
  toggleUserStatus: async (userId: number): Promise<User> => {
    try {
      const response: AxiosResponse<User> = await apiClient.patch(`/api/admin/users/${userId}/toggle-status`);
      return response.data;
    } catch (error) {
      console.error('Error toggling user status:', error);
      throw error;
    }
  },

  // Deactivate user
  deactivateUser: async (userId: number): Promise<DeactivateResponse> => {
    try {
      const response: AxiosResponse<DeactivateResponse> = await apiClient.put(`/api/admin/deactivate/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error deactivating user:', error);
      throw error;
    }
  },

  // Fetch tổng kết doanh thu tổng thể
  getRevenueSummary: async (
    loaiThongKe: 'THANG' | 'QUY' | 'NAM',
    nam: number,
    thang?: number,
    quy?: number
  ): Promise<RevenueSummary[]> => {
    try {
      const params: any = { loaiThongKe, nam };
      if (thang) params.thang = thang;
      if (quy) params.quy = quy;
      const response: AxiosResponse<RevenueSummary[]> = await apiClient.get('/api/admin/doanh-thu/tong-ket', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching revenue summary:', error);
      throw error;
    }
  },
};

export default apiClient; 
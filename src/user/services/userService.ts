import axios from 'axios';

const API_URL = '/api';

// Global notification callback
let showNotificationCallback: ((title: string, message: string, type: 'success' | 'error' | 'warning' | 'info', onConfirm?: () => void) => void) | null = null;

// Set notification callback
export const setNotificationCallback = (callback: (title: string, message: string, type: 'success' | 'error' | 'warning' | 'info', onConfirm?: () => void) => void) => {
  showNotificationCallback = callback;
};

// Show notification with fallback to alert
const showNotification = (title: string, message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info', onConfirm?: () => void) => {
  if (showNotificationCallback) {
    showNotificationCallback(title, message, type, onConfirm);
  } else {
    // Fallback to alert
    alert(`${title}: ${message}`);
  }
};

// Add axios interceptor to handle token validation
axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response && error.response.status === 401) {
      // Token is invalid, clear user data and show notification
      handleTokenExpiration();
    }
    return Promise.reject(error);
  }
);

// Handle token expiration with proper notification
export const handleTokenExpiration = () => {
  // Clear all user data
  clearUserData();
  
  // Show notification to user
  if (typeof window !== 'undefined') {
    // Check if we're not already on login page
    if (window.location.pathname !== '/login') {
      showNotification(
        'Phiên đăng nhập hết hạn',
        'Phiên đăng nhập của bạn đã hết hạn. Vui lòng đăng nhập lại để tiếp tục sử dụng.',
        'warning',
        () => {
          // Redirect to login page after user confirms
          window.location.href = '/login';
        }
      );
    }
  }
};

// Get user profile
export const getUserProfile = async (token: string) => {
  try {
    const response = await axios.get(`${API_URL}/user/profile`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Update user profile
export const updateUserProfile = async (token: string, userData: any) => {
  try {
    const response = await axios.put(`${API_URL}/user/profile`, userData, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get patient appointments
export const getPatientAppointments = async (token: string, patientId: number) => {
  try {
    const response = await axios.get(`${API_URL}/appointments/patient/${patientId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Cancel appointment
export const cancelAppointment = async (token: string, appointment: any) => {
  try {
    const response = await axios.put(`${API_URL}/appointments/${appointment.maLichHen}/cancel`, {
      lyDo: appointment.lydo
    }, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get available time slots for a doctor on a specific date
export const getAvailableTimeSlots = async (token: string, doctorId: number, date: string) => {
  try {
    const response = await axios.get(`${API_URL}/public/bac-si/${doctorId}/lich-trong?ngayHen=${date}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Update appointment
export const updateAppointment = async (token: string, appointmentId: number, appointmentData: any) => {
  try {
    const response = await axios.put(`${API_URL}/appointments/${appointmentId}`, appointmentData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Validate token
export const validateToken = async (refreshToken: string) => {
  try {
    const response = await axios.post(`${API_URL}/auth/validate-token`, {
      refreshToken: refreshToken
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Check if current token is valid and clear localStorage if not
export const checkAndValidateToken = async () => {
  const token = localStorage.getItem('token');
  if (!token) {
    return false;
  }

  try {
    const response = await validateToken(token);
    if (response.valid) {
      return true;
    } else {
      // Token is invalid, handle expiration
      handleTokenExpiration();
      return false;
    }
  } catch (error) {
    console.error('Token validation error:', error);
    // Token validation failed, handle expiration
    handleTokenExpiration();
    return false;
  }
};

// Clear all user data from localStorage
export const clearUserData = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  localStorage.removeItem('maNguoiDung');
  localStorage.removeItem('maBenhNhan');
  localStorage.removeItem('maBacSi');
  localStorage.removeItem('tenDangNhap');
  localStorage.removeItem('hoTen');
  localStorage.removeItem('redirectedFromLogin');
  localStorage.removeItem('redirectAfterLogin');
};

// Manual logout function with notification
export const logout = () => {
  clearUserData();
  
  // Show logout notification
  if (typeof window !== 'undefined') {
    showNotification(
      'Đăng xuất thành công',
      'Bạn đã đăng xuất khỏi hệ thống.',
      'success',
      () => {
        // Redirect to login page after user confirms
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
      }
    );
  }
}; 
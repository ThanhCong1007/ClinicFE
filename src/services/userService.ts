import axios from 'axios';

const API_URL = '/api';

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
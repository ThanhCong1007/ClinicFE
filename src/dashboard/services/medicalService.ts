import axios from 'axios';

const API_URL = '/api/tham-kham';

// Create medical examination record
export const createMedicalExam = async (data: any) => {
  try {
    const response = await axios.post(`${API_URL}/tham-kham`, data, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get doctor's appointments and medical records
export const getDoctorAppointments = async (maBacSi: number) => {
  try {
    const response = await axios.get(`${API_URL}/bac-si/${maBacSi}/lich-hen-benh-an`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get appointment details
export const getAppointmentDetails = async (maLichHen: number) => {
  try {
    const response = await axios.get(`${API_URL}/lich-hen/${maLichHen}/chi-tiet`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get patient's medical records
export const getPatientMedicalRecords = async (maBenhNhan: number) => {
  try {
    const response = await axios.get(`${API_URL}/benh-nhan/${maBenhNhan}/benh-an`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}; 
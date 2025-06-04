import { mockAppointments, mockMedicalRecords } from './mockData';

const API_URL = '/api/tham-kham';

// Create medical examination record
export const createMedicalExam = async (data: any) => {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return { success: true, message: 'Tạo bệnh án thành công', data };
  } catch (error) {
    throw error;
  }
};

// Get doctor's appointments and medical records
export const getDoctorAppointments = async (maBacSi: number) => {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockAppointments;
  } catch (error) {
    throw error;
  }
};

// Get appointment details
export const getAppointmentDetails = async (maLichHen: number) => {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockAppointments.find(app => app.maLichHen === maLichHen);
  } catch (error) {
    throw error;
  }
};

// Get patient's medical records
export const getPatientMedicalRecords = async (maBenhNhan: number) => {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockMedicalRecords.filter(record => record.maBenhNhan === maBenhNhan);
  } catch (error) {
    throw error;
  }
}; 
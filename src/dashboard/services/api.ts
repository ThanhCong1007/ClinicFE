import axios from 'axios';
import { format } from 'date-fns';

// Lấy danh sách thuốc
export const fetchDrugs = async () => {
  const response = await axios.get('/api/public/Thuoc');
  return response.data;
};

// Lấy danh sách dịch vụ
export const fetchServices = async () => {
  const response = await axios.get('/api/public/dichvu');
  return response.data;
};

// Lấy lịch hẹn của bác sĩ
export const getDoctorAppointments = async (maBacSi: number) => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('Không tìm thấy token xác thực');

  const response = await axios.get(
    `http://localhost:8080/api/tham-kham/bac-si/${maBacSi}/lich-hen-benh-an`,
    {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }
  );
  return response.data;
};

// Lấy chi tiết lịch hẹn
export const getAppointmentDetails = async (maLichHen: number) => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('Không tìm thấy token xác thực');

  const response = await axios.get(
    `http://localhost:8080/api/tham-kham/lich-hen/${maLichHen}/chi-tiet`,
    {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }
  );

  // Modify the response data to use real-time values
  const data = response.data;
  if (data) {
    const now = new Date();
    data.gioBatDau = format(now, 'HH:mm:ss');
    data.gioKetThuc = '';
    data.thoiGian = 30;
  }
  return data;
};

// Lấy danh sách bệnh án của bệnh nhân
export const getPatientMedicalRecords = async (maBenhNhan: number) => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('Không tìm thấy token xác thực');

  const response = await axios.get(
    `http://localhost:8080/api/tham-kham/benh-nhan/${maBenhNhan}/benh-an`,
    {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }
  );
  return response.data;
};

// Tạo mới bệnh án
export const createMedicalExam = async (examData: any) => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('Không tìm thấy token xác thực');

  const response = await axios.post(
    'http://localhost:8080/api/tham-kham/kham',
    examData,
    {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    }
  );
  return response.data;
};

// Hủy lịch hẹn
export const cancelAppointment = async (maLichHen: number, appointmentData: any) => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('Không tìm thấy token xác thực');

  const response = await axios.put(
    `http://localhost:8080/api/appointments/${maLichHen}/cancel`,
    appointmentData,
    {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    }
  );
  return response.data;
};

// Lấy chi tiết bệnh án theo mã bệnh án (tái khám)
export const getMedicalRecordById = async (maBenhAn: number) => {
  const token = localStorage.getItem('token');
  const response = await axios.get(`/api/tham-kham/benh-an/${maBenhAn}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {}
  });
  return response.data;
};

// Cập nhật bệnh án (tái khám)
export const updateMedicalRecord = async (maBenhAn: number, data: any) => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('Không tìm thấy token xác thực');
  const response = await axios.put(`/api/tham-kham/benh-an/${maBenhAn}`, data, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  return response.data;
};

// Lấy danh sách bệnh án của bác sĩ
export const getMedicalRecordsByDoctor = async (maBacSi: number, page: number, size: number, keyword: string = '') => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('Không tìm thấy token xác thực');
  const response = await axios.get(`http://localhost:8080/api/benh-an/bac-si/${maBacSi}?page=${page}&size=${size}&keyword=${keyword}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return response.data; // Trả về toàn bộ dữ liệu phản hồi (bao gồm phân trang)
};

// Lấy chi tiết bệnh án
export const getMedicalRecordDetail = async (maBenhAn: number) => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('Không tìm thấy token xác thực');
  const response = await axios.get(`http://localhost:8080/api/benh-an/chi-tiet/${maBenhAn}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return response.data.data; // chỉ trả về object chi tiết bệnh án
}; 
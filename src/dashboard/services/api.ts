import axios from 'axios';
import { format } from 'date-fns';

// Thêm interceptor để xử lý token
axios.interceptors.request.use(
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

// Thêm interceptor để xử lý response
axios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token hết hạn hoặc không hợp lệ
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Có thể redirect về trang login ở đây nếu cần
    }
    return Promise.reject(error);
  }
);

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
  const response = await axios.get(
    `http://localhost:8080/api/tham-kham/bac-si/${maBacSi}/lich-hen-benh-an`
  );
  return response.data;
};

// Lấy chi tiết lịch hẹn
export const getAppointmentDetails = async (maLichHen: number) => {
  const response = await axios.get(
    `http://localhost:8080/api/tham-kham/lich-hen/${maLichHen}/chi-tiet`
  );

  // Modify the response data to use real-time values
  const data = response.data;
  console.log('API Response for appointment details:', data);
  
  if (data) {
    const now = new Date();
    data.gioBatDau = format(now, 'HH:mm:ss');
    data.gioKetThuc = '';
    data.thoiGian = 30;
    // Đảm bảo các trường dữ liệu được giữ nguyên
    data.tienSuBenh = data.tienSuBenh || '';
    data.diUng = data.diUng || '';
    data.diaChi = data.diaChi || '';
    data.ngaySinh = data.ngaySinh || '';
    data.gioiTinh = data.gioiTinh || '';
  }
  return data;
};

// Lấy danh sách bệnh án của bệnh nhân
export const getPatientMedicalRecords = async (maBenhNhan: number) => {
  const response = await axios.get(
    `http://localhost:8080/api/tham-kham/benh-nhan/${maBenhNhan}/benh-an`
  );
  return response.data;
};

// Tạo mới bệnh án
export const createMedicalExam = async (examData: any, images: File[] = []) => {
  try {
    const formData = new FormData();
    // Đảm bảo trường 'data' là application/json
    const jsonBlob = new Blob([JSON.stringify(examData)], { type: 'application/json' });
    formData.append('data', jsonBlob);
    // Thêm các file ảnh với key 'images'
    images.forEach((image) => {
      formData.append('images', image);
    });

    const response = await axios.post(
      'http://localhost:8080/api/tham-kham/kham',
      formData,
      {
        headers: {
          'Accept': 'application/json'
        }
      }
    );
    return response.data;
  } catch (error: any) {
    throw error;
  }
};

// Hủy lịch hẹn
export const cancelAppointment = async (maLichHen: number, appointmentData: any) => {
  const response = await axios.put(
    `http://localhost:8080/api/appointments/${maLichHen}/cancel`,
    appointmentData,
    {
      headers: {
        'Content-Type': 'application/json'
      }
    }
  );
  return response.data;
};

// Lấy chi tiết bệnh án theo mã bệnh án (tái khám)
export const getMedicalRecordById = async (maBenhAn: number) => {
  const response = await axios.get(`/api/benh-an/chi-tiet/${maBenhAn}`);
  return response.data;
};

// Cập nhật bệnh án (tái khám) - multipart/form-data
export const updateMedicalRecord = async (maBenhAn: number, data: any, images: File[] = []) => {
  try {
    const formData = new FormData();
    // Đảm bảo trường 'data' là application/json
    const jsonBlob = new Blob([JSON.stringify(data)], { type: 'application/json' });
    formData.append('data', jsonBlob);
    // Thêm các file ảnh với key 'images'
    images.forEach((image) => {
      formData.append('images', image);
    });

    const response = await axios.put(
      `http://localhost:8080/api/tham-kham/benh-an/${maBenhAn}`,
      formData,
      {
        headers: {
          'Accept': 'application/json'
        }
      }
    );
    return response.data;
  } catch (error: any) {
    throw error;
  }
};

// Lấy danh sách bệnh án của bác sĩ
export const getMedicalRecordsByDoctor = async (maBacSi: number, page: number, size: number, keyword: string = '') => {
  const response = await axios.get(`http://localhost:8080/api/benh-an/bac-si/${maBacSi}?page=${page}&size=${size}&keyword=${keyword}`);
  return response.data; // Trả về toàn bộ dữ liệu phản hồi (bao gồm phân trang)
};

// Lấy chi tiết bệnh án
export const getMedicalRecordDetail = async (maBenhAn: number) => {
  const response = await axios.get(`http://localhost:8080/api/benh-an/chi-tiet/${maBenhAn}`);
  return response.data.data; // chỉ trả về object chi tiết bệnh án
}; 
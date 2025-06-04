import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Appointment.css';

// Type definitions
interface Doctor {
  maBacSi: number;
  hoTen: string;
}

interface TimeSlot {
  gioBatDau: string;
  gioKetThuc: string;
  daDat: boolean;
  trangThai: string;
}

function Appointment() {
  const navigate = useNavigate();
  
  // Form state
  const [formData, setFormData] = useState({
    maDichVu: '',
    maBacSi: '',
    hoTen: '',
    email: '',
    ngayKham: '',
    gioKham: '',
    ghiChu: ''
  });

  // State for doctors and available time slots
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Dữ liệu dịch vụ trực tiếp
  const dichvus = [
    { MaDv: "1", TenDv: "Tẩy trắng răng" },
    { MaDv: "2", TenDv: "Niềng răng" },
    { MaDv: "3", TenDv: "Nhổ răng khôn" },
    { MaDv: "4", TenDv: "Trám răng" }
  ];

  // Fetch doctors on component mount
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await axios.get('/api/public/bac-si');
        setDoctors(response.data);
      } catch (error) {
        console.error('Error fetching doctors:', error);
        setError('Không thể tải danh sách bác sĩ. Vui lòng thử lại sau.');
      }
    };

    fetchDoctors();
  }, []);

  // Fetch available time slots when doctor and date are selected
  useEffect(() => {
    const fetchAvailableSlots = async () => {
      if (formData.maBacSi && formData.ngayKham) {
        try {
          setLoading(true);
          const response = await axios.get(
            `/api/public/bac-si/${formData.maBacSi}/lich-trong?ngayHen=${formData.ngayKham}`
          );
          setAvailableSlots(response.data);
        } catch (error) {
          console.error('Error fetching available slots:', error);
          setError('Không thể tải khung giờ trống. Vui lòng thử lại sau.');
        } finally {
          setLoading(false);
        }
      }
    };

    fetchAvailableSlots();
  }, [formData.maBacSi, formData.ngayKham]);

  // Kiểm tra người dùng đã đăng nhập chưa
  const isAuthenticated = () => {
    return localStorage.getItem('token') !== null;
  };

  // Lấy thông tin người dùng từ localStorage
  const getUserData = () => {
    const userData = localStorage.getItem('user');
    return userData ? JSON.parse(userData) : null;
  };

  // Lấy mã bệnh nhân từ localStorage
  const getMaBenhNhan = () => {
    const userData = getUserData();
    return userData?.id || '1'; // Default để test
  };

  // Load form data from localStorage on component mount
  useEffect(() => {
    const savedFormData = localStorage.getItem('appointmentFormData');
    if (savedFormData) {
      setFormData(JSON.parse(savedFormData));
    }
    
    // Nếu đã chuyển hướng từ login trở lại, và đã đăng nhập thành công
    const redirected = localStorage.getItem('redirectedFromLogin');
    if (redirected === 'true' && isAuthenticated()) {
      // Xóa flag chuyển hướng
      localStorage.removeItem('redirectedFromLogin');
      
      // Tự động điền một số thông tin từ user data nếu có
      const userData = getUserData();
      if (userData) {
        setFormData(prevData => ({
          ...prevData,
          hoTen: userData.hoTen || prevData.hoTen,
          email: userData.email || prevData.email
        }));
      }
    }
  }, []);

  // Handle input changes
  const handleChange = (e:any) => {
    const { name, value } = e.target;
    const updatedFormData = { ...formData, [name]: value };
    
    // Reset gioKham when doctor or date changes
    if (name === 'maBacSi' || name === 'ngayKham') {
      updatedFormData.gioKham = '';
    }
    
    setFormData(updatedFormData);
    localStorage.setItem('appointmentFormData', JSON.stringify(updatedFormData));
  };

  const handleSubmit = async (e:any) => {
    e.preventDefault();
    
    // Check if user is authenticated
    if (!isAuthenticated()) {
      // Show notification to user
      alert("Vui lòng đăng nhập để đặt lịch khám!");
      
      // Save form data to localStorage before redirecting
      localStorage.setItem('appointmentFormData', JSON.stringify(formData));
      localStorage.setItem('redirectAfterLogin', '/appointment');
      localStorage.setItem('redirectedFromLogin', 'true');
      
      // Redirect to login page after a short delay so the alert is visible
      setTimeout(() => {
        navigate('/login');
      }, 500);
      return;
    }

    // Get user data and check for maBenhNhan
    const userData = getUserData();
    if (!userData || !userData.maBenhNhan) {
      alert("Không tìm thấy thông tin bệnh nhân. Vui lòng liên hệ quản trị viên!");
      return;
    }

    // Find selected time slot
    const selectedTimeSlot = availableSlots.find(slot => slot.gioBatDau === formData.gioKham);
    
    // Prepare data for API
    const appointmentData = {
      maBenhNhan: userData.maBenhNhan, // Sử dụng maBenhNhan từ userData
      maBacSi: parseInt(formData.maBacSi),
      maDichVu: parseInt(formData.maDichVu),
      ngayHen: formData.ngayKham,
      gioBatDau: selectedTimeSlot?.gioBatDau || "",
      gioKetThuc: selectedTimeSlot?.gioKetThuc || "",
      maTrangThai: 1, // Default status
      ghiChu: formData.ghiChu
    };
    
    try {
      const response = await axios.post('/api/appointments/register',
        appointmentData,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      
      // Success! Clear saved form data
      localStorage.removeItem('appointmentFormData');
      alert("Đặt lịch khám thành công!");
      
    } catch (error:any) {
      console.error("Error registering appointment:", error);
      
      // Kiểm tra nếu lỗi 401 (Unauthorized)
      if (error.response && error.response.status === 401) {
        // Token expired or invalid, show notification first
        alert("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại để tiếp tục!");
        
        // Save form data before redirecting
        localStorage.setItem('appointmentFormData', JSON.stringify(formData));
        localStorage.setItem('redirectAfterLogin', '/appointment');
        localStorage.setItem('redirectedFromLogin', 'true');
        
        // Redirect to login page after a short delay
        setTimeout(() => {
          navigate('/login');
        }, 500);
        return;
      }
      
      // Các lỗi khác
      if (error.response && error.response.data && error.response.data.message) {
        alert("Đã xảy ra lỗi: " + error.response.data.message);
      } else {
        alert("Đã xảy ra lỗi khi đặt lịch. Vui lòng thử lại sau!");
      }
    }
  };

  // Framer Motion variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  const leftColumnVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: { 
      opacity: 1, 
      x: 0, 
      transition: { duration: 0.6, delay: 0.1 }
    }
  };

  const formVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      transition: { duration: 0.6, delay: 0.3 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.4 }
    }
  };

  return (
    <motion.div
      className="container-fluid bg-primary bg-appointment my-5"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="container">
        <div className="row gx-5">
          <motion.div 
            className="col-lg-6 py-5"
            variants={leftColumnVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="py-5">
              <h1 className="display-5 text-white mb-4">Nha sĩ với nhiều năm
                kinh nghiệm và chứng nhận quốc tế</h1>
              <p className="text-white mb-0">Eirmod sed tempor lorem ut dolores.
                Aliquyam sit sadipscing kasd ipsum. Dolor ea et dolore et at sea
                ea at dolor, justo ipsum duo rebum sea invidunt voluptua. Eos
                vero eos vero ea et dolore eirmod et. Dolores diam duo invidunt
                lorem. Elitr ut dolores magna sit. Sea dolore sanctus sed et.
                Takimata takimata sanctus sed.</p>
            </div>
          </motion.div>
          <div className="col-lg-6">
            <motion.div
              className="appointment-form h-100 d-flex flex-column justify-content-center text-center p-5"
              variants={formVariants}
              initial="hidden"
              animate="visible"
            >
              <h1 className="text-white mb-4">Cung cấp thông tin để nhận tư vấn</h1>
              {error && <div className="alert alert-danger">{error}</div>}
              <form onSubmit={handleSubmit}>
                <div className="row g-3">
                  <motion.div 
                    className="col-12 col-sm-6"
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    transition={{ delay: 0.1 }}
                  >
                    <select 
                      className="form-select bg-light border-0"
                      style={{height: "55px"}}
                      name="maDichVu"
                      value={formData.maDichVu}
                      onChange={handleChange}
                    >
                      <option value="">Lựa chọn dịch vụ</option>
                      {dichvus.map((dichvu) => (
                        <option key={dichvu.MaDv} value={dichvu.MaDv}>
                          {dichvu.TenDv}
                        </option>
                      ))}
                    </select>
                  </motion.div>
                  <motion.div 
                    className="col-12 col-sm-6"
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    transition={{ delay: 0.2 }}
                  >
                    <select 
                      className="form-select bg-light border-0"
                      style={{height: "55px"}}
                      name="maBacSi"
                      value={formData.maBacSi}
                      onChange={handleChange}
                    >
                      <option value="">Chọn Bác sĩ</option>
                      {doctors.map((doctor) => (
                        <option key={doctor.maBacSi} value={doctor.maBacSi}>
                          {doctor.hoTen}
                        </option>
                      ))}
                    </select>
                  </motion.div>
                  <motion.div 
                    className="col-12 col-sm-6"
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    transition={{ delay: 0.3 }}
                  >
                    <input 
                      type="text" 
                      className="form-control bg-light border-0"
                      placeholder="Họ và tên" 
                      style={{height: "55px"}} 
                      name="hoTen"
                      value={formData.hoTen}
                      onChange={handleChange}
                    />
                  </motion.div>
                  <motion.div 
                    className="col-12 col-sm-6"
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    transition={{ delay: 0.4 }}
                  >
                    <input 
                      type="email" 
                      className="form-control bg-light border-0"
                      placeholder="Email" 
                      style={{height: "55px"}} 
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </motion.div>
                  <motion.div 
                    className="col-12 col-sm-6"
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    transition={{ delay: 0.5 }}
                  >
                    <div className="date" id="date1" data-target-input="nearest">
                      <input 
                        type="date"
                        className="form-control bg-light border-0"
                        placeholder="Ngày khám"
                        style={{height: "55px"}} 
                        name="ngayKham"
                        value={formData.ngayKham}
                        onChange={handleChange}
                      />
                    </div>
                  </motion.div>
                  <motion.div 
                    className="col-12 col-sm-6"
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    transition={{ delay: 0.6 }}
                  >
                    <select 
                      className="form-select bg-light border-0"
                      style={{height: "55px"}}
                      name="gioKham"
                      value={formData.gioKham}
                      onChange={handleChange}
                      disabled={loading || !formData.maBacSi || !formData.ngayKham}
                    >
                      <option value="">Chọn khung giờ</option>
                      {availableSlots.map((slot) => (
                        <option 
                          key={`${slot.gioBatDau}-${slot.gioKetThuc}`} 
                          value={slot.gioBatDau}
                        >
                          {slot.gioBatDau} - {slot.gioKetThuc}
                        </option>
                      ))}
                    </select>
                    {loading && <div className="text-white mt-2">Đang tải khung giờ...</div>}
                  </motion.div>
                  <motion.div 
                    className="col-12"
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    transition={{ delay: 0.7 }}
                  >
                    <textarea 
                      className="form-control bg-light border-0"
                      placeholder="Ghi chú"
                      name="ghiChu"
                      value={formData.ghiChu}
                      onChange={handleChange}
                    ></textarea>
                  </motion.div>
                  <motion.div 
                    className="col-12"
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    transition={{ delay: 0.8 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <button 
                      className="btn btn-dark w-100 py-3" 
                      type="submit"
                      disabled={loading}
                    >
                      {isAuthenticated() ? "Đặt lịch khám" : "Đăng nhập để đặt lịch"}
                    </button>
                  </motion.div>
                </div>
              </form>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default Appointment;
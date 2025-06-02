import { useState, useEffect } from 'react';
import { Calendar, User, Clock, Edit, Trash2, Eye, Phone, Mail, MapPin, Heart, FileText, Bell, Settings, LogOut, ArrowLeft } from 'lucide-react';
import { getUserProfile, updateUserProfile, getPatientAppointments, cancelAppointment, getAvailableTimeSlots, updateAppointment } from '../services/userService';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { useSpring, animated } from '@react-spring/web';

// Define types
interface UserInfo {
  maNguoiDung: number;
  tenDangNhap: string;
  email: string;
  hoTen: string;
  soDienThoai: string;
  ngaySinh: string;
  gioiTinh: string;
  diaChi: string;
  tienSuBenh?: string;
  diUng?: string;
  maBenhNhan: number;
}

interface Appointment {
  maLichHen: number;
  maBenhNhan: number;
  tenBenhNhan: string;
  soDienThoaiBenhNhan: string;
  maBacSi: number;
  tenBacSi: string;
  maDichVu: number;
  tenDichVu: string;
  ngayHen: string;
  gioBatDau: string;
  gioKetThuc: string;
  maTrangThai: number;
  tenTrangThai: string;
  ghiChu?: string;
  lydo?: string | null;
  thoiGian: number;
}

interface TimeSlot {
  gioBatDau: string;
  gioKetThuc: string;
  daDat: boolean;
  trangThai: string;
}

interface Doctor {
  maBacSi: number;
  hoTen: string;
}

interface Service {
  MaDv: string;
  TenDv: string;
}

const UserProfile = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [showAppointmentDetail, setShowAppointmentDetail] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState({
    maBenhNhan: 0,
    maBacSi: '',
    maDichVu: '',
    ngayHen: '',
    gioBatDau: '',
    gioKetThuc: '',
    maTrangThai: 1,
    ghiChu: ''
  });

  // State for doctors and available time slots for editing form
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [editAvailableSlots, setEditAvailableSlots] = useState<TimeSlot[]>([]);
  const [editSlotsLoading, setEditSlotsLoading] = useState(false);
  const [editSlotsError, setEditSlotsError] = useState<string | null>(null);

  // Dữ liệu dịch vụ tạm thời
  const dichvus: Service[] = [
    { MaDv: "1", TenDv: "Tẩy trắng răng" },
    { MaDv: "2", TenDv: "Niềng răng" },
    { MaDv: "3", TenDv: "Nhổ răng khôn" },
    { MaDv: "4", TenDv: "Trám răng" }
  ];

  const navigate = useNavigate();
  const location = useLocation();

  // Animation for the main content
  const springProps = useSpring({
    opacity: loading ? 0 : 1,
    transform: loading ? 'translateY(50px)' : 'translateY(0px)',
    config: { tension: 180, friction: 12 },
  });

  // Function to fetch appointments
  const fetchAppointments = async (patientId: number) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }
      const appointmentsData = await getPatientAppointments(token, patientId);
      setAppointments(appointmentsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch appointments');
    }
  };

  // Function to fetch appointment details
  const fetchAppointmentDetail = async (maLichHen: number) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await axios.get(`http://localhost:8080/api/appointments/${maLichHen}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setSelectedAppointment(response.data);
      setShowAppointmentDetail(true);
      setIsEditing(false);
    } catch (error) {
      console.error('Error fetching appointment details:', error);
      alert('Không thể tải thông tin chi tiết lịch hẹn');
    }
  };

  // Function to fetch doctors
  const fetchDoctors = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/public/bac-si');
      setDoctors(response.data);
    } catch (error) {
      console.error('Error fetching doctors:', error);
      // Optionally set an error state for doctors
    }
  };

  // Function to fetch available time slots for editing
  const fetchEditAvailableSlots = async (maBacSi: string, ngayHen: string) => {
    if (maBacSi && ngayHen) {
      try {
        setEditSlotsLoading(true);
        setEditSlotsError(null); // Clear previous errors
        const token = localStorage.getItem('token');
        if (!token) return;

        const slots = await getAvailableTimeSlots(token, parseInt(maBacSi), ngayHen);
        setEditAvailableSlots(slots);
      } catch (error) {
        console.error('Error fetching edit available slots:', error);
        setEditSlotsError('Không thể tải khung giờ trống. Vui lòng thử lại sau.');
        setEditAvailableSlots([]); // Clear slots on error
      } finally {
        setEditSlotsLoading(false);
      }
    } else {
      setEditAvailableSlots([]);
      setEditSlotsError(null);
    }
  };

  // Function to handle back button
  const handleBack = () => {
    setShowAppointmentDetail(false);
    setSelectedAppointment(null);
    setIsEditing(false);
    setEditAvailableSlots([]); // Clear slots when going back
    setEditSlotsError(null); // Clear errors when going back
  };

  useEffect(() => {
    if (location.state && location.state.activeTab) {
      setActiveTab(location.state.activeTab);
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No authentication token found');
        }

        const profileData = await getUserProfile(token);
        setUserInfo(profileData);

        if (profileData.maBenhNhan) {
          fetchAppointments(profileData.maBenhNhan);
        }
        fetchDoctors(); // Fetch doctors on initial load

      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Effect to fetch available slots when doctor or date changes in edit form
  useEffect(() => {
    if (isEditing) {
      fetchEditAvailableSlots(editFormData.maBacSi, editFormData.ngayHen);
    }
  }, [editFormData.maBacSi, editFormData.ngayHen, isEditing]);

  const handleUpdateProfile = async () => {
    if (window.confirm('Bạn có chắc chắn muốn lưu thay đổi thông tin cá nhân không?')) {
      try {
        const token = localStorage.getItem('token');
        if (!token || !userInfo) return;

        await updateUserProfile(token, userInfo);
        setIsEditingProfile(false);
        alert('Cập nhật thông tin cá nhân thành công!');
      } catch (err) {
        if (axios.isAxiosError(err) && err.response && err.response.data && err.response.data.message) {
          alert(`Lỗi cập nhật thông tin: ${err.response.data.message}`);
        } else {
          setError(err instanceof Error ? err.message : 'Failed to update profile');
        }
      }
    }
  };

  const handleCancelAppointment = async (appointment: Appointment) => {
    const reason = window.prompt('Vui lòng nhập lý do hủy lịch hẹn:');
    if (reason === null) return;
    
    if (window.confirm('Bạn có chắc chắn muốn hủy lịch hẹn này không?')) {
      try {
        const token = localStorage.getItem('token');
        if (!token || !userInfo) return;

        await cancelAppointment(token, { ...appointment, lydo: reason });
        if (userInfo.maBenhNhan) {
          fetchAppointments(userInfo.maBenhNhan);
        }
        alert('Lịch hẹn đã được hủy thành công.');
      } catch (err) {
        if (axios.isAxiosError(err) && err.response && err.response.data && err.response.data.message) {
          alert(`Lỗi hủy lịch hẹn: ${err.response.data.message}`);
        } else {
          setError(err instanceof Error ? err.message : 'Failed to cancel appointment');
        }
      }
    }
  };

  // Function to handle edit button click
  const handleEditClick = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    const initialFormData = {
      maBenhNhan: appointment.maBenhNhan,
      maBacSi: String(appointment.maBacSi),
      maDichVu: String(appointment.maDichVu),
      ngayHen: appointment.ngayHen,
      // Set initial time slot value for the dropdown
      gioBatDau: appointment.gioBatDau,
      gioKetThuc: appointment.gioKetThuc,
      maTrangThai: appointment.maTrangThai,
      ghiChu: appointment.ghiChu || ''
    };
    setEditFormData(initialFormData);
    setShowAppointmentDetail(true);
    setIsEditing(true);
    // Fetch available slots immediately when opening edit form
    // This will ensure the dropdown options are available when the initial value is set.
    fetchEditAvailableSlots(initialFormData.maBacSi, initialFormData.ngayHen);
  };

  // Function to handle form input changes
  const handleEditFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    let updatedFormData = { ...editFormData, [name]: value };

    // If changing date or doctor, reset time slot
    if (name === 'ngayHen' || name === 'maBacSi') {
        updatedFormData.gioBatDau = '';
        updatedFormData.gioKetThuc = '';
        // Clear available slots when doctor or date changes until new slots are fetched
        setEditAvailableSlots([]);
        setEditSlotsError(null);
        setEditSlotsLoading(false); // Reset loading state explicitly
    }

    // If changing time slot (from the dropdown), parse value
    if (name === 'gioKham') {
        const [start, end] = value.split('-');
        updatedFormData.gioBatDau = start || '';
        updatedFormData.gioKetThuc = end || '';
    }

    setEditFormData(updatedFormData);
  };

  // Function to check if form data has changed
  const hasFormDataChanged = (original: Appointment, edited: typeof editFormData) => {
    // Convert original maBacSi and maDichVu to string for comparison
    const originalMaBacSiStr = String(original.maBacSi);
    const originalMaDichVuStr = String(original.maDichVu);
    // Construct original and edited time slot strings for easy comparison
    const originalTimeSlotStr = `${original.gioBatDau}-${original.gioKetThuc}`;
    const editedTimeSlotStr = `${edited.gioBatDau}-${edited.gioKetThuc}`;

    return (
      originalMaDichVuStr !== edited.maDichVu ||
      originalMaBacSiStr !== edited.maBacSi ||
      original.ngayHen !== edited.ngayHen ||
      originalTimeSlotStr !== editedTimeSlotStr || // Compare combined time string
      original.ghiChu !== edited.ghiChu
    );
  };

  // Function to handle form submission
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAppointment) return;

    // Check if there are any changes
    if (!hasFormDataChanged(selectedAppointment, editFormData)) {
      setIsEditing(false);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      // Check available time slots only if time/date/doctor changed
      let selectedTimeSlot = null;
      const originalTimeSlot = `${selectedAppointment.gioBatDau}-${selectedAppointment.gioKetThuc}`;
      const newTimeSlot = `${editFormData.gioBatDau}-${editFormData.gioKetThuc}`;

      // Check if date, doctor, or time slot has changed
      if (editFormData.ngayHen !== selectedAppointment.ngayHen ||
          editFormData.maBacSi !== String(selectedAppointment.maBacSi) ||
          newTimeSlot !== originalTimeSlot) {

        const availableSlots = await getAvailableTimeSlots(token, parseInt(editFormData.maBacSi), editFormData.ngayHen);

        // Find the selected time slot in the newly fetched available slots
        selectedTimeSlot = availableSlots.find(
          (slot: TimeSlot) => 
            slot.gioBatDau === editFormData.gioBatDau && 
            slot.gioKetThuc === editFormData.gioKetThuc
        );

        // If the selected time slot is not found in the available slots or is already booked, show error
        if (!selectedTimeSlot || selectedTimeSlot.daDat) {
          alert('Khung giờ này không còn trống hoặc không hợp lệ. Vui lòng chọn khung giờ khác.');
          return;
        }
      } else {
         // If time/date/doctor didn't change, validate if the original slot is still a valid slot for the selected doctor and date
         // We still need to fetch to validate against the most current availability
         const availableSlots = await getAvailableTimeSlots(token, parseInt(editFormData.maBacSi), editFormData.ngayHen); 
         selectedTimeSlot = availableSlots.find(
          (slot: TimeSlot) => 
            slot.gioBatDau === editFormData.gioBatDau && 
            slot.gioKetThuc === editFormData.gioKetThuc
         );

         if (!selectedTimeSlot) {
           alert('Khung giờ ban đầu không còn hợp lệ với bác sĩ và ngày đã chọn. Vui lòng chọn khung giờ khác.');
           return;
         }
         // If selectedTimeSlot is found here, it means the original slot is still a valid offering,
         // regardless of its `daDat` status because the user is editing an existing booking.
      }

      // Prepare data for API
      const appointmentData = {
        maBenhNhan: selectedAppointment.maBenhNhan,
        maBacSi: parseInt(editFormData.maBacSi), // Ensure integer
        maDichVu: parseInt(editFormData.maDichVu), // Ensure integer
        ngayHen: editFormData.ngayHen,
        gioBatDau: editFormData.gioBatDau,
        gioKetThuc: editFormData.gioKetThuc,
        maTrangThai: 1,
        ghiChu: editFormData.ghiChu
      };

      await updateAppointment(token, selectedAppointment.maLichHen, appointmentData);

      // Refresh appointments after successful update
      if (userInfo?.maBenhNhan) {
        fetchAppointments(userInfo.maBenhNhan);
      }
      
      setIsEditing(false);
      alert('Cập nhật lịch hẹn thành công!');
    } catch (error) {
      console.error('Error updating appointment:', error);
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        alert(`Lỗi cập nhật lịch hẹn: ${error.response.data.message}`);
      } else {
        alert('Không thể cập nhật lịch hẹn. Vui lòng thử lại sau.');
      }
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Đã đặt': return 'badge bg-primary';
      case 'Đã hoàn thành': return 'badge bg-success';
      case 'Đã hủy': return 'badge bg-danger';
      default: return 'badge bg-secondary';
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    // Add one day to the date to account for timezone issues if the date string is YYYY-MM-DD
    // This is a common workaround for date inputs in React/JS
    const [year, month, day] = dateStr.split('-').map(Number);
    const correctedDate = new Date(year, month - 1, day);

    return correctedDate.toLocaleDateString('vi-VN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const upcomingAppointments = appointments.filter(apt => apt.maTrangThai === 1);
  const pastAppointments = appointments.filter(apt => apt.maTrangThai !== 1);

  if (loading) {
    return <div className="text-center p-5">Đang tải...</div>;
  }

  if (error) {
    return <div className="alert alert-danger m-3">{error}</div>;
  }

  if (!userInfo) {
    return <div className="alert alert-warning m-3">Không có dữ liệu người dùng</div>;
  }

  return (
    <>
      <div className="bg-light" style={{minHeight: '100vh'}}>
        <div className="container-fluid py-4">
          <div className="row g-4">
            {/* Sidebar */}
            <div className="col-lg-3">
              {/* User Card */}
              <div className="card shadow-sm mb-4">
                <div className="card-body text-center">
                  <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3" 
                       style={{width: '80px', height: '80px'}}>
                    <User size={40} className="text-white" />
                  </div>
                  <h5 className="card-title mb-1">{userInfo.hoTen}</h5>
                  <p className="card-text text-muted small">{userInfo.email}</p>
                </div>
              </div>

              {/* Navigation */}
              <div className="card shadow-sm">
                <div className="card-body">
                  <nav className="nav flex-column">
                    <button
                      onClick={() => setActiveTab('profile')}
                      className={`nav-link d-flex align-items-center py-3 px-3 mb-2 rounded ${
                        activeTab === 'profile' ? 'bg-primary text-white' : 'text-dark'
                      }`}
                      style={{border: 'none'}}
                    >
                      <User size={20} className="me-3" />
                      Thông tin cá nhân
                    </button>
                    <button
                      onClick={() => setActiveTab('appointments')}
                      className={`nav-link d-flex align-items-center py-3 px-3 mb-2 rounded ${
                        activeTab === 'appointments' ? 'bg-primary text-white' : 'text-dark'
                      }`}
                      style={{border: 'none'}}
                    >
                      <Calendar size={20} className="me-3" />
                      Lịch khám
                    </button>
                  </nav>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <animated.div className="col-lg-9" style={springProps}>
              {activeTab === 'profile' && (
                <div className="card shadow-sm">
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                      <h3 className="card-title mb-0">Thông tin cá nhân</h3>
                      <button
                        onClick={() => {
                          if (isEditingProfile) {
                            handleUpdateProfile();
                          } else {
                            setIsEditingProfile(true);
                          }
                        }}
                        className="btn btn-primary d-flex align-items-center"
                      >
                        <Edit size={16} className="me-2" />
                        {isEditingProfile ? 'Lưu thay đổi' : 'Chỉnh sửa'}
                      </button>
                    </div>

                    <div className="row g-4">
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label className="form-label fw-semibold">Họ và tên</label>
                          {isEditingProfile ? (
                            <input
                              type="text"
                              className="form-control"
                              value={userInfo.hoTen}
                              onChange={(e) => setUserInfo({...userInfo, hoTen: e.target.value})}
                            />
                          ) : (
                            <div className="input-group">
                              <span className="input-group-text bg-light">
                                <User size={16} className="text-muted" />
                              </span>
                              <div className="form-control bg-light">{userInfo.hoTen}</div>
                            </div>
                          )}
                        </div>

                        <div className="mb-3">
                          <label className="form-label fw-semibold">Số điện thoại</label>
                          {isEditingProfile ? (
                            <input
                              type="tel"
                              className="form-control"
                              value={userInfo.soDienThoai}
                              onChange={(e) => setUserInfo({...userInfo, soDienThoai: e.target.value})}
                            />
                          ) : (
                            <div className="input-group">
                              <span className="input-group-text bg-light">
                                <Phone size={16} className="text-muted" />
                              </span>
                              <div className="form-control bg-light">{userInfo.soDienThoai}</div>
                            </div>
                          )}
                        </div>

                        <div className="mb-3">
                          <label className="form-label fw-semibold">Email</label>
                          {isEditingProfile ? (
                            <input
                              type="email"
                              className="form-control"
                              value={userInfo.email}
                              onChange={(e) => setUserInfo({...userInfo, email: e.target.value})}
                            />
                          ) : (
                            <div className="input-group">
                              <span className="input-group-text bg-light">
                                <Mail size={16} className="text-muted" />
                              </span>
                              <div className="form-control bg-light">{userInfo.email}</div>
                            </div>
                          )}
                        </div>

                        <div className="mb-3">
                          <label className="form-label fw-semibold">Địa chỉ</label>
                          {isEditingProfile ? (
                            <textarea
                              className="form-control"
                              rows={3}
                              value={userInfo.diaChi}
                              onChange={(e) => setUserInfo({...userInfo, diaChi: e.target.value})}
                            />
                          ) : (
                            <div className="input-group">
                              <span className="input-group-text bg-light">
                                <MapPin size={16} className="text-muted" />
                              </span>
                              <div className="form-control bg-light">{userInfo.diaChi}</div>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="col-md-6">
                        <div className="mb-3">
                          <label className="form-label fw-semibold">Ngày sinh</label>
                          {isEditingProfile ? (
                            <input
                              type="date"
                              className="form-control"
                              value={userInfo.ngaySinh} // assuming userInfo.ngaySinh is in YYYY-MM-DD format
                              onChange={(e) => setUserInfo({...userInfo, ngaySinh: e.target.value})}
                            />
                          ) : (
                            <div className="input-group">
                              <span className="input-group-text bg-light">
                                <Calendar size={16} className="text-muted" />
                              </span>
                              <div className="form-control bg-light">{userInfo.ngaySinh}</div>
                            </div>
                          )}
                        </div>

                        <div className="mb-3">
                          <label className="form-label fw-semibold">Giới tính</label>
                          {isEditingProfile ? (
                            <select
                              className="form-select"
                              value={userInfo.gioiTinh}
                              onChange={(e) => setUserInfo({...userInfo, gioiTinh: e.target.value})}
                            >
                              <option value="Nam">Nam</option>
                              <option value="Nữ">Nữ</option>
                              <option value="Khác">Khác</option>
                            </select>
                          ) : (
                            <div className="input-group">
                              <span className="input-group-text bg-light">
                                <User size={16} className="text-muted" />
                              </span>
                              <div className="form-control bg-light">{userInfo.gioiTinh}</div>
                            </div>
                          )}
                        </div>

                        {userInfo.tienSuBenh && (
                          <div className="mb-3">
                            <label className="form-label fw-semibold">Tiền sử bệnh</label>
                            <div className="input-group">
                              <span className="input-group-text bg-light">
                                <FileText size={16} className="text-muted" />
                              </span>
                              <div className="form-control bg-light">{userInfo.tienSuBenh}</div>
                            </div>
                          </div>
                        )}

                        {userInfo.diUng && (
                          <div className="mb-3">
                            <label className="form-label fw-semibold">Dị ứng</label>
                            <div className="input-group">
                              <span className="input-group-text bg-light">
                                <Heart size={16} className="text-muted" />
                              </span>
                              <div className="form-control bg-light">{userInfo.diUng}</div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'appointments' && (
                <div>
                  {/* Appointments Header */}
                  <div className="card shadow-sm mb-4">
                    <div className="card-body">
                      <div className="d-flex justify-content-between align-items-center mb-4">
                        <h3 className="card-title mb-0">Lịch khám của tôi</h3>
                        <button
                          className="btn btn-success d-flex align-items-center"
                          onClick={() => navigate('/lien-he')}
                        >
                          <Calendar size={16} className="me-2" />
                          Đặt lịch mới
                        </button>
                      </div>

                      {/* Quick Stats */}
                      <div className="row g-3">
                        <div className="col-md-4">
                          <div className="card bg-primary text-white">
                            <div className="card-body">
                              <h6 className="card-title">Lịch sắp tới</h6>
                              <h2 className="card-text">{upcomingAppointments.length}</h2>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-4">
                          <div className="card bg-success text-white">
                            <div className="card-body">
                              <h6 className="card-title">Đã hoàn thành</h6>
                              <h2 className="card-text">{appointments.filter(a => a.maTrangThai === 4).length}</h2>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-4">
                          <div className="card bg-danger text-white">
                            <div className="card-body">
                              <h6 className="card-title">Đã hủy</h6>
                              <h2 className="card-text">{appointments.filter(a => a.maTrangThai === 5).length}</h2>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {!showAppointmentDetail ? (
                    <>
                  {/* Upcoming Appointments */}
                  {upcomingAppointments.length > 0 && (
                    <div className="card shadow-sm mb-4">
                      <div className="card-body">
                        <h4 className="card-title mb-4">Lịch khám sắp tới</h4>
                        {upcomingAppointments.map((appointment) => (
                          <div key={appointment.maLichHen} className="card mb-3 border">
                            <div className="card-body">
                              <div className="d-flex justify-content-between align-items-start">
                                <div className="flex-grow-1">
                                  <div className="d-flex align-items-center mb-2">
                                    <h5 className="mb-0 me-3">{appointment.tenBacSi}</h5>
                                    <span className={getStatusBadge(appointment.tenTrangThai)}>
                                      {appointment.tenTrangThai}
                                    </span>
                                  </div>
                                  <p className="text-muted mb-2">{appointment.tenDichVu}</p>
                                  <div className="row g-3 text-muted small mb-2">
                                    <div className="col-md-4 d-flex align-items-center">
                                      <Calendar size={16} className="me-2" />
                                      {formatDate(appointment.ngayHen)}
                                    </div>
                                    <div className="col-md-4 d-flex align-items-center">
                                      <Clock size={16} className="me-2" />
                                      {appointment.gioBatDau} - {appointment.gioKetThuc}
                                    </div>
                                    <div className="col-md-4 d-flex align-items-center">
                                      <MapPin size={16} className="me-2" />
                                      Phòng khám
                                    </div>
                                  </div>
                                  {appointment.ghiChu && (
                                    <p className="text-primary mb-0">
                                      <strong>Ghi chú:</strong> {appointment.ghiChu}
                                    </p>
                                  )}
                                      {appointment.maTrangThai === 5 && appointment.lydo && (
                                        <p className="text-danger mb-0 mt-2">
                                          <strong>Lý do hủy:</strong> {appointment.lydo}
                                        </p>
                                      )}
                                </div>
                                <div className="d-flex">
                                      <button 
                                        className="btn btn-outline-primary btn-sm me-2"
                                        onClick={() => fetchAppointmentDetail(appointment.maLichHen)}
                                      >
                                    <Eye size={16} />
                                  </button>
                                      {appointment.maTrangThai === 1 && (
                                        <button 
                                          className="btn btn-outline-success btn-sm me-2"
                                          onClick={() => handleEditClick(appointment)}
                                        >
                                    <Edit size={16} />
                                  </button>
                                      )}
                                  <button
                                    className="btn btn-outline-danger btn-sm"
                                    onClick={() => handleCancelAppointment(appointment)}
                                  >
                                    <Trash2 size={16} />
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Past Appointments */}
                  {pastAppointments.length > 0 && (
                    <div className="card shadow-sm">
                      <div className="card-body">
                        <h4 className="card-title mb-4">Lịch sử khám bệnh</h4>
                        {pastAppointments.map((appointment) => (
                          <div key={appointment.maLichHen} className="card mb-3 border opacity-75">
                            <div className="card-body">
                              <div className="d-flex justify-content-between align-items-start">
                                <div className="flex-grow-1">
                                  <div className="d-flex align-items-center mb-2">
                                    <h5 className="mb-0 me-3">{appointment.tenBacSi}</h5>
                                    <span className={getStatusBadge(appointment.tenTrangThai)}>
                                      {appointment.tenTrangThai}
                                    </span>
                                  </div>
                                  <p className="text-muted mb-2">{appointment.tenDichVu}</p>
                                  <div className="row g-3 text-muted small mb-2">
                                    <div className="col-md-4 d-flex align-items-center">
                                      <Calendar size={16} className="me-2" />
                                      {formatDate(appointment.ngayHen)}
                                    </div>
                                    <div className="col-md-4 d-flex align-items-center">
                                      <Clock size={16} className="me-2" />
                                      {appointment.gioBatDau} - {appointment.gioKetThuc}
                                    </div>
                                    <div className="col-md-4 d-flex align-items-center">
                                      <MapPin size={16} className="me-2" />
                                      Phòng khám
                                    </div>
                                  </div>
                                  {appointment.ghiChu && (
                                    <p className="mb-0">
                                      <strong>Ghi chú:</strong> {appointment.ghiChu}
                                    </p>
                                  )}
                                      {appointment.maTrangThai === 5 && appointment.lydo && (
                                        <p className="text-danger mb-0 mt-2">
                                      <strong>Lý do hủy:</strong> {appointment.lydo}
                                    </p>
                                  )}
                                </div>
                                <div>
                                      <button 
                                        className="btn btn-outline-primary btn-sm"
                                        onClick={() => fetchAppointmentDetail(appointment.maLichHen)}
                                      >
                                    <Eye size={16} />
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                      )}
                    </>
                  ) : (
                    showAppointmentDetail && selectedAppointment && (
                      <div className="card shadow-sm">
                        <div className="card-body">
                          <div className="d-flex align-items-center mb-4">
                            <button 
                              className="btn btn-outline-secondary me-3"
                              onClick={handleBack}
                            >
                              <ArrowLeft size={20} />
                            </button>
                            <h4 className="card-title mb-0">Chi tiết lịch hẹn</h4>
                            {!isEditing && selectedAppointment.maTrangThai === 1 && (
                              <button
                                className="btn btn-primary ms-3"
                                onClick={() => selectedAppointment && handleEditClick(selectedAppointment)}
                              >
                                <Edit size={16} className="me-2" />
                                Chỉnh sửa
                              </button>
                            )}
                          </div>
                          
                          {isEditing && selectedAppointment ? (
                            <form onSubmit={handleEditSubmit}>
                              <div className="row g-4">
                                {/* Appointment Details for Editing */}
                                <div className="col-md-6">
                                  <div className="mb-4">
                                    <h5 className="text-primary mb-3">Thông tin lịch hẹn</h5>
                                    <div className="card bg-light">
                                      <div className="card-body">
                                        {/* Select Service */}
                                        <div className="mb-3">
                                          <label className="form-label">Dịch vụ</label>
                                          <select
                                            className="form-select"
                                            name="maDichVu"
                                            value={editFormData.maDichVu}
                                            onChange={handleEditFormChange}
                                          >
                                            <option value="">Chọn dịch vụ</option>
                                            {dichvus.map((dichvu) => (
                                              <option key={dichvu.MaDv} value={dichvu.MaDv}>
                                                {dichvu.TenDv}
                                              </option>
                                            ))}
                                          </select>
                                        </div>

                                        {/* Select Doctor */}
                                        <div className="mb-3">
                                          <label className="form-label">Bác sĩ</label>
                                          <select
                                            className="form-select"
                                            name="maBacSi"
                                            value={editFormData.maBacSi}
                                            onChange={handleEditFormChange}
                                          >
                                            <option value="">Chọn bác sĩ</option>
                                            {doctors.map((doctor) => (
                                              <option key={doctor.maBacSi} value={doctor.maBacSi}>
                                                {doctor.hoTen}
                                              </option>
                                            ))}
                                          </select>
                                        </div>

                                        {/* Select Date */}
                                        <div className="mb-3">
                                          <label className="form-label">Ngày khám</label>
                                          <input
                                            type="date"
                                            className="form-control"
                                            name="ngayHen"
                                            value={editFormData.ngayHen}
                                            onChange={handleEditFormChange}
                                          />
                                        </div>

                                        {/* Select Time Slot */}
                                        <div className="mb-3">
                                          <label className="form-label">Giờ khám</label>
                                          <select
                                            className="form-select"
                                            name="gioKham"
                                            value={editFormData.gioBatDau && editFormData.gioKetThuc ? `${editFormData.gioBatDau}-${editFormData.gioKetThuc}` : ''}
                                            onChange={handleEditFormChange}
                                            disabled={editSlotsLoading || !editFormData.maBacSi || !editFormData.ngayHen}
                                          >
                                            <option value="">Chọn khung giờ</option>
                                            {editAvailableSlots.map((slot) => (
                                              <option 
                                                key={`${slot.gioBatDau}-${slot.gioKetThuc}`}
                                                value={`${slot.gioBatDau}-${slot.gioKetThuc}`}
                                                disabled={slot.daDat}
                                              >
                                                {slot.gioBatDau} - {slot.gioKetThuc} {slot.daDat ? '(Đã đặt)' : ''}
                                              </option>
                                            ))}
                                          </select>
                                          {editSlotsLoading && <div className="text-muted mt-2">Đang tải khung giờ...</div>}
                                          {editSlotsError && !editSlotsLoading && <div className="text-danger mt-2">{editSlotsError}</div>}
                                        </div>

                                        {/* Notes */}
                                        <div className="mb-3">
                                          <label className="form-label">Ghi chú</label>
                                          <textarea
                                            className="form-control"
                                            name="ghiChu"
                                            value={editFormData.ghiChu}
                                            onChange={handleEditFormChange}
                                            rows={3}
                                          />
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                {/* Patient Info (Read Only in Edit Mode) */}
                                <div className="col-md-6">
                                  <div className="mb-4">
                                    <h5 className="text-primary mb-3">Thông tin bệnh nhân</h5>
                                    <div className="card bg-light">
                                      <div className="card-body">
                                        <p><strong>Họ và tên:</strong> {selectedAppointment.tenBenhNhan}</p>
                                        <p><strong>Số điện thoại:</strong> {selectedAppointment.soDienThoaiBenhNhan}</p>
                                      </div>
                                    </div>
                                  </div>
                                </div>

                              </div>

                              <div className="d-flex justify-content-end gap-2 mt-4">
                                <button
                                  type="button"
                                  className="btn btn-secondary"
                                  onClick={() => setIsEditing(false)}
                                >
                                  Hủy
                                </button>
                                <button
                                  type="submit"
                                  className="btn btn-primary"
                                  disabled={editSlotsLoading} // Disable submit while loading slots
                                >
                                  Lưu thay đổi
                                </button>
                              </div>
                            </form>
                          ) : (
                            // Display mode
                            <div className="row g-4">
                              <div className="col-md-6">
                                <div className="mb-4">
                                  <h5 className="text-primary mb-3">Thông tin bệnh nhân</h5>
                                  <div className="card bg-light">
                                    <div className="card-body">
                                      <p><strong>Họ và tên:</strong> {selectedAppointment.tenBenhNhan}</p>
                                      <p><strong>Số điện thoại:</strong> {selectedAppointment.soDienThoaiBenhNhan}</p>
                                    </div>
                                  </div>
                                </div>

                                <div className="mb-4">
                                  <h5 className="text-primary mb-3">Thông tin bác sĩ</h5>
                                  <div className="card bg-light">
                                    <div className="card-body">
                                      <p><strong>Bác sĩ:</strong> {selectedAppointment.tenBacSi}</p>
                                      <p><strong>Dịch vụ:</strong> {selectedAppointment.tenDichVu}</p>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              <div className="col-md-6">
                                <div className="mb-4">
                                  <h5 className="text-primary mb-3">Thông tin lịch hẹn</h5>
                                  <div className="card bg-light">
                                    <div className="card-body">
                                      <p><strong>Ngày khám:</strong> {formatDate(selectedAppointment.ngayHen)}</p>
                                      <p><strong>Giờ khám:</strong> {selectedAppointment.gioBatDau} - {selectedAppointment.gioKetThuc}</p>
                                      <p><strong>Thời gian khám:</strong> {selectedAppointment.thoiGian} phút</p>
                                      <p><strong>Trạng thái:</strong> <span className={getStatusBadge(selectedAppointment.tenTrangThai)}>{selectedAppointment.tenTrangThai}</span></p>
                                      {selectedAppointment.ghiChu && (
                                        <p><strong>Ghi chú:</strong> {selectedAppointment.ghiChu}</p>
                                      )}
                                      {selectedAppointment.maTrangThai === 5 && selectedAppointment.lydo && (
                                        <p className="text-danger"><strong>Lý do hủy:</strong> {selectedAppointment.lydo}</p>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  )}
                </div>
              )}
            </animated.div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserProfile;
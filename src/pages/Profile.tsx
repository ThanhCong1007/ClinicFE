import { useState, useEffect } from 'react';
import { Calendar, User, Clock, Edit, Trash2, Eye, Phone, Mail, MapPin, Heart, FileText, Bell, Settings, LogOut } from 'lucide-react';
import { getUserProfile, updateUserProfile, getPatientAppointments, cancelAppointment } from '../services/userService';
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
  lyDoHuy?: string;
  thoiGian: number;
}

const UserProfile = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  const navigate = useNavigate();
  const location = useLocation(); // Get the current location object

  // Animation for the main content
  const springProps = useSpring({
    opacity: loading ? 0 : 1,
    transform: loading ? 'translateY(50px)' : 'translateY(0px)',
    config: { tension: 180, friction: 12 }, // Config for a subtle bounce
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

  useEffect(() => {
    // Check for state passed from navigation
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
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleUpdateProfile = async () => {
    if (window.confirm('Bạn có chắc chắn muốn lưu thay đổi thông tin cá nhân không?')) {
      try {
        const token = localStorage.getItem('token');
        if (!token || !userInfo) return;

        await updateUserProfile(token, userInfo);
        setIsEditingProfile(false);
        // Show success message or handle success case
        alert('Cập nhật thông tin cá nhân thành công!');
      } catch (err) {
        // Check if the error is an Axios error with a response
        if (axios.isAxiosError(err) && err.response && err.response.data && err.response.data.message) {
          // Display the specific error message from the API
          alert(`Lỗi cập nhật thông tin: ${err.response.data.message}`);
        } else {
          // Display a generic error message for other errors
          setError(err instanceof Error ? err.message : 'Failed to update profile');
        }
      }
    }
  };

  const handleCancelAppointment = async (appointment: Appointment) => {
    if (window.confirm('Bạn có chắc chắn muốn hủy lịch hẹn này không?')) {
      try {
        const token = localStorage.getItem('token');
        if (!token || !userInfo) return;

        await cancelAppointment(token, appointment);
        // Refresh appointments after successful cancellation
        if (userInfo.maBenhNhan) {
          fetchAppointments(userInfo.maBenhNhan);
        }
        // Optionally show a success message
        alert('Lịch hẹn đã được hủy thành công.');
      } catch (err) {
        // Check if the error is an Axios error with a response
        if (axios.isAxiosError(err) && err.response && err.response.data && err.response.data.message) {
          // Display the specific error message from the API
          alert(`Lỗi hủy lịch hẹn: ${err.response.data.message}`);
        } else {
          // Display a generic error message for other errors
          setError(err instanceof Error ? err.message : 'Failed to cancel appointment');
        }
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
    return date.toLocaleDateString('vi-VN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const upcomingAppointments = appointments.filter(apt => apt.maTrangThai === 1);
  const pastAppointments = appointments.filter(apt => apt.maTrangThai !== 1);

  if (loading) {
    return <div className="text-center p-5">Loading...</div>;
  }

  if (error) {
    return <div className="alert alert-danger m-3">{error}</div>;
  }

  if (!userInfo) {
    return <div className="alert alert-warning m-3">No user data available</div>;
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
                              value={userInfo.ngaySinh}
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
                                </div>
                                <div className="d-flex">
                                  <button className="btn btn-outline-primary btn-sm me-2">
                                    <Eye size={16} />
                                  </button>
                                  <button className="btn btn-outline-success btn-sm me-2">
                                    <Edit size={16} />
                                  </button>
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
                                  {appointment.maTrangThai === 3 && appointment.lyDoHuy && (
                                    <p className="text-danger mb-0">
                                      <strong>Lý do hủy:</strong> {appointment.lyDoHuy}
                                    </p>
                                  )}
                                </div>
                                <div>
                                  <button className="btn btn-outline-primary btn-sm">
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
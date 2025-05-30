import { useState } from 'react';
import { Calendar, User, Clock, Edit, Trash2, Eye, Phone, Mail, MapPin, Heart, FileText, Bell, Settings, LogOut } from 'lucide-react';

// Define types
interface UserInfo {
  name: string;
  phone: string;
  email: string;
  address: string;
  dateOfBirth: string;
  gender: string;
  emergencyContact: string;
  insuranceNumber: string;
}

interface Appointment {
  id: string;
  doctorName: string;
  specialty: string;
  date: string;
  time: string;
  status: 'upcoming' | 'completed' | 'cancelled';
  location: string;
  reason: string;
  notes?: string;
}

const UserProfile = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  const [userInfo, setUserInfo] = useState<UserInfo>({
    name: "Nguyễn Văn An",
    phone: "0123-456-789",
    email: "nguyenvanan@gmail.com",
    address: "123 Đường Lê Lợi, Quận 1, TP.HCM",
    dateOfBirth: "15/03/1990",
    gender: "Nam",
    emergencyContact: "Nguyễn Thị Bình - 0987-654-321",
    insuranceNumber: "BH123456789"
  });

  const [appointments] = useState<Appointment[]>([
    {
      id: "1",
      doctorName: "BS. Trần Minh Hoàng",
      specialty: "Tim mạch",
      date: "2024-06-15",
      time: "09:00",
      status: "upcoming",
      location: "Phòng khám Tim mạch - Tầng 3",
      reason: "Khám định kỳ",
      notes: "Mang theo kết quả xét nghiệm máu"
    },
    {
      id: "2",
      doctorName: "BS. Lê Thị Mai",
      specialty: "Da liễu",
      date: "2024-06-20",
      time: "14:30",
      status: "upcoming",
      location: "Phòng khám Da liễu - Tầng 2",
      reason: "Khám da",
      notes: "Tái khám sau điều trị"
    },
    {
      id: "3",
      doctorName: "BS. Phạm Văn Đức",
      specialty: "Nội khoa",
      date: "2024-05-10",
      time: "10:00",
      status: "completed",
      location: "Phòng khám Nội khoa - Tầng 1",
      reason: "Khám tổng quát"
    },
    {
      id: "4",
      doctorName: "BS. Hoàng Thị Lan",
      specialty: "Mắt",
      date: "2024-05-05",
      time: "08:30",
      status: "cancelled",
      location: "Phòng khám Mắt - Tầng 4",
      reason: "Khám mắt định kỳ"
    }
  ]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'upcoming': return 'badge bg-primary';
      case 'completed': return 'badge bg-success';
      case 'cancelled': return 'badge bg-danger';
      default: return 'badge bg-secondary';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'upcoming': return 'Sắp tới';
      case 'completed': return 'Đã khám';
      case 'cancelled': return 'Đã hủy';
      default: return status;
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

  const upcomingAppointments = appointments.filter(apt => apt.status === 'upcoming');
  const pastAppointments = appointments.filter(apt => apt.status !== 'upcoming');

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
                  <h5 className="card-title mb-1">{userInfo.name}</h5>
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
            <div className="col-lg-9">
              {activeTab === 'profile' && (
                <div className="card shadow-sm">
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                      <h3 className="card-title mb-0">Thông tin cá nhân</h3>
                      <button
                        onClick={() => setIsEditingProfile(!isEditingProfile)}
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
                              value={userInfo.name}
                              onChange={(e) => setUserInfo({...userInfo, name: e.target.value})}
                            />
                          ) : (
                            <div className="input-group">
                              <span className="input-group-text bg-light">
                                <User size={16} className="text-muted" />
                              </span>
                              <div className="form-control bg-light">{userInfo.name}</div>
                            </div>
                          )}
                        </div>

                        <div className="mb-3">
                          <label className="form-label fw-semibold">Số điện thoại</label>
                          {isEditingProfile ? (
                            <input
                              type="tel"
                              className="form-control"
                              value={userInfo.phone}
                              onChange={(e) => setUserInfo({...userInfo, phone: e.target.value})}
                            />
                          ) : (
                            <div className="input-group">
                              <span className="input-group-text bg-light">
                                <Phone size={16} className="text-muted" />
                              </span>
                              <div className="form-control bg-light">{userInfo.phone}</div>
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
                              value={userInfo.address}
                              onChange={(e) => setUserInfo({...userInfo, address: e.target.value})}
                            />
                          ) : (
                            <div className="input-group">
                              <span className="input-group-text bg-light">
                                <MapPin size={16} className="text-muted" />
                              </span>
                              <div className="form-control bg-light">{userInfo.address}</div>
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
                              value={userInfo.dateOfBirth.split('/').reverse().join('-')}
                              onChange={(e) => {
                                const date = new Date(e.target.value);
                                const formatted = `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
                                setUserInfo({...userInfo, dateOfBirth: formatted});
                              }}
                            />
                          ) : (
                            <div className="input-group">
                              <span className="input-group-text bg-light">
                                <Calendar size={16} className="text-muted" />
                              </span>
                              <div className="form-control bg-light">{userInfo.dateOfBirth}</div>
                            </div>
                          )}
                        </div>

                        <div className="mb-3">
                          <label className="form-label fw-semibold">Giới tính</label>
                          {isEditingProfile ? (
                            <select
                              className="form-select"
                              value={userInfo.gender}
                              onChange={(e) => setUserInfo({...userInfo, gender: e.target.value})}
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
                              <div className="form-control bg-light">{userInfo.gender}</div>
                            </div>
                          )}
                        </div>

                        <div className="mb-3">
                          <label className="form-label fw-semibold">Liên hệ khẩn cấp</label>
                          {isEditingProfile ? (
                            <input
                              type="text"
                              className="form-control"
                              value={userInfo.emergencyContact}
                              onChange={(e) => setUserInfo({...userInfo, emergencyContact: e.target.value})}
                            />
                          ) : (
                            <div className="input-group">
                              <span className="input-group-text bg-light">
                                <Phone size={16} className="text-muted" />
                              </span>
                              <div className="form-control bg-light">{userInfo.emergencyContact}</div>
                            </div>
                          )}
                        </div>

                        <div className="mb-3">
                          <label className="form-label fw-semibold">Số BHYT</label>
                          {isEditingProfile ? (
                            <input
                              type="text"
                              className="form-control"
                              value={userInfo.insuranceNumber}
                              onChange={(e) => setUserInfo({...userInfo, insuranceNumber: e.target.value})}
                            />
                          ) : (
                            <div className="input-group">
                              <span className="input-group-text bg-light">
                                <FileText size={16} className="text-muted" />
                              </span>
                              <div className="form-control bg-light">{userInfo.insuranceNumber}</div>
                            </div>
                          )}
                        </div>
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
                        <button className="btn btn-success d-flex align-items-center">
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
                              <h2 className="card-text">{appointments.filter(a => a.status === 'completed').length}</h2>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-4">
                          <div className="card bg-danger text-white">
                            <div className="card-body">
                              <h6 className="card-title">Đã hủy</h6>
                              <h2 className="card-text">{appointments.filter(a => a.status === 'cancelled').length}</h2>
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
                          <div key={appointment.id} className="card mb-3 border">
                            <div className="card-body">
                              <div className="d-flex justify-content-between align-items-start">
                                <div className="flex-grow-1">
                                  <div className="d-flex align-items-center mb-2">
                                    <h5 className="mb-0 me-3">{appointment.doctorName}</h5>
                                    <span className={getStatusBadge(appointment.status)}>
                                      {getStatusText(appointment.status)}
                                    </span>
                                  </div>
                                  <p className="text-muted mb-2">{appointment.specialty}</p>
                                  <div className="row g-3 text-muted small mb-2">
                                    <div className="col-md-4 d-flex align-items-center">
                                      <Calendar size={16} className="me-2" />
                                      {formatDate(appointment.date)}
                                    </div>
                                    <div className="col-md-4 d-flex align-items-center">
                                      <Clock size={16} className="me-2" />
                                      {appointment.time}
                                    </div>
                                    <div className="col-md-4 d-flex align-items-center">
                                      <MapPin size={16} className="me-2" />
                                      {appointment.location}
                                    </div>
                                  </div>
                                  <p className="mb-1">
                                    <strong>Lý do khám:</strong> {appointment.reason}
                                  </p>
                                  {appointment.notes && (
                                    <p className="text-primary mb-0">
                                      <strong>Ghi chú:</strong> {appointment.notes}
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
                                  <button className="btn btn-outline-danger btn-sm">
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
                          <div key={appointment.id} className="card mb-3 border opacity-75">
                            <div className="card-body">
                              <div className="d-flex justify-content-between align-items-start">
                                <div className="flex-grow-1">
                                  <div className="d-flex align-items-center mb-2">
                                    <h5 className="mb-0 me-3">{appointment.doctorName}</h5>
                                    <span className={getStatusBadge(appointment.status)}>
                                      {getStatusText(appointment.status)}
                                    </span>
                                  </div>
                                  <p className="text-muted mb-2">{appointment.specialty}</p>
                                  <div className="row g-3 text-muted small mb-2">
                                    <div className="col-md-4 d-flex align-items-center">
                                      <Calendar size={16} className="me-2" />
                                      {formatDate(appointment.date)}
                                    </div>
                                    <div className="col-md-4 d-flex align-items-center">
                                      <Clock size={16} className="me-2" />
                                      {appointment.time}
                                    </div>
                                    <div className="col-md-4 d-flex align-items-center">
                                      <MapPin size={16} className="me-2" />
                                      {appointment.location}
                                    </div>
                                  </div>
                                  <p className="mb-0">
                                    <strong>Lý do khám:</strong> {appointment.reason}
                                  </p>
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
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserProfile;
import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Table, Badge, Button } from 'react-bootstrap';
import { format } from 'date-fns';
import axios from 'axios';
import NotificationModal from '../components/NotificationModal';

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
  ghiChuLichHen: string | null;
  lyDoHen: string | null;
  thoiGian: number;
  maBenhAn: number | null;
  lyDoKham: string | null;
  chanDoan: string | null;
  ghiChuDieuTri: string | null;
  ngayTaiKham: string | null;
  ngayTaoBenhAn: string | null;
  coBenhAn: boolean;
}

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

const Dashboard = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({
    totalPatients: 0,
    todayAppointments: 0,
    newPatients: 0,
    pendingExaminations: 0
  });
  const [notification, setNotification] = useState<{show: boolean, title: string, message: string, type: 'success'|'error'|'info'}>({show: false, title: '', message: '', type: 'info'});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userData = JSON.parse(localStorage.getItem('user') || '{}');
        const token = localStorage.getItem('token');
        
        if (!userData.maBacSi || !token) {
          throw new Error('Không tìm thấy thông tin bác sĩ hoặc token xác thực');
        }

        const response = await axios.get(
          `http://localhost:8080/api/tham-kham/bac-si/${userData.maBacSi}/lich-hen-benh-an`,
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );
        
        setAppointments(response.data);
        
        // Calculate statistics
        const today = format(new Date(), 'yyyy-MM-dd');
        const todayAppointments = response.data.filter((app: Appointment) => app.ngayHen === today);
        const uniquePatients = new Set(response.data.map((app: Appointment) => app.maBenhNhan));
        const pendingExams = response.data.filter((app: Appointment) => !app.coBenhAn && (app.maTrangThai === 1 || app.maTrangThai === 2));
        
        // Get new patients (first appointment today)
        const newPatients = todayAppointments.filter((app: Appointment) => {
          const previousAppointments = response.data.filter((a: Appointment) => 
            a.maBenhNhan === app.maBenhNhan && a.ngayHen < today
          );
          return previousAppointments.length === 0;
        });

        setStats({
          totalPatients: uniquePatients.size,
          todayAppointments: todayAppointments.length,
          newPatients: newPatients.length,
          pendingExaminations: pendingExams.length
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Có lỗi xảy ra khi tải dữ liệu');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleCancelAppointment = async (appointment: Appointment) => {
    if (!window.confirm('Bạn có chắc chắn muốn hủy lịch hẹn này?')) {
      return;
    }

    try {
      const appointmentData = {
        maBenhNhan: appointment.maBenhNhan,
        maBacSi: appointment.maBacSi,
        maDichVu: appointment.maDichVu,
        ngayHen: appointment.ngayHen,
        gioBatDau: appointment.gioBatDau,
        gioKetThuc: appointment.gioKetThuc,
        maTrangThai: 5, // Trạng thái đã hủy
        ghiChu: appointment.ghiChuLichHen
      };

      await cancelAppointment(appointment.maLichHen, appointmentData);
      
      // Refresh appointments list
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      const response = await axios.get(
        `http://localhost:8080/api/tham-kham/bac-si/${userData.maBacSi}/lich-hen-benh-an`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      
      setAppointments(response.data);
      
      // Recalculate statistics
      const today = format(new Date(), 'yyyy-MM-dd');
      const todayAppointments = response.data.filter((app: Appointment) => app.ngayHen === today);
      const uniquePatients = new Set(response.data.map((app: Appointment) => app.maBenhNhan));
      const pendingExams = response.data.filter((app: Appointment) => !app.coBenhAn && (app.maTrangThai === 1 || app.maTrangThai === 2));
      
      const newPatients = todayAppointments.filter((app: Appointment) => {
        const previousAppointments = response.data.filter((a: Appointment) => 
          a.maBenhNhan === app.maBenhNhan && a.ngayHen < today
        );
        return previousAppointments.length === 0;
      });

      setStats({
        totalPatients: uniquePatients.size,
        todayAppointments: todayAppointments.length,
        newPatients: newPatients.length,
        pendingExaminations: pendingExams.length
      });
      
      setNotification({show: true, title: 'Thành công', message: 'Hủy lịch hẹn thành công', type: 'success'});
    } catch (err) {
      setNotification({show: true, title: 'Lỗi', message: err instanceof Error ? err.message : 'Có lỗi xảy ra khi hủy lịch hẹn', type: 'error'});
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger m-3" role="alert">
        {error}
      </div>
    );
  }

  return (
    <Container fluid className="py-4">
      {/* Statistics Cards */}
      <Row className="g-4 mb-4">
        <Col md={3}>
          <Card className="h-100 border-0 shadow-sm">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-muted mb-2">Tổng Số Bệnh Nhân</h6>
                  <h3 className="mb-0">{stats.totalPatients}</h3>
                </div>
                <div className="bg-primary bg-opacity-10 p-3 rounded">
                  <i className="fas fa-users text-primary fa-2x"></i>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="h-100 border-0 shadow-sm">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-muted mb-2">Lịch Hẹn Hôm Nay</h6>
                  <h3 className="mb-0">{stats.todayAppointments}</h3>
                </div>
                <div className="bg-success bg-opacity-10 p-3 rounded">
                  <i className="fas fa-calendar-check text-success fa-2x"></i>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="h-100 border-0 shadow-sm">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-muted mb-2">Bệnh Nhân Mới</h6>
                  <h3 className="mb-0">{stats.newPatients}</h3>
                </div>
                <div className="bg-info bg-opacity-10 p-3 rounded">
                  <i className="fas fa-user-plus text-info fa-2x"></i>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="h-100 border-0 shadow-sm">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-muted mb-2">Chờ Khám</h6>
                  <h3 className="mb-0">{stats.pendingExaminations}</h3>
                </div>
                <div className="bg-warning bg-opacity-10 p-3 rounded">
                  <i className="fas fa-stethoscope text-warning fa-2x"></i>
                </div>
              </div>
              {stats.pendingExaminations > 0 && (
                <Button 
                  variant="warning" 
                  size="sm" 
                  className="mt-2 w-100"
                  onClick={() => window.location.href = '/dashboard/appointments'}
                >
                  Khám bệnh ngay
                </Button>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Today's Appointments */}
      <Card className="border-0 shadow-sm mb-4">
        <Card.Header className="bg-white">
          <h5 className="mb-0">Lịch Hẹn Hôm Nay</h5>
        </Card.Header>
        <Card.Body>
          {appointments.length === 0 ? (
            <div className="alert alert-info">
              Không có lịch hẹn nào cho hôm nay
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-striped table-hover">
                <thead>
                  <tr>
                    <th>Thời gian</th>
                    <th>Bệnh nhân</th>
                    <th>Số điện thoại</th>
                    <th>Dịch vụ</th>
                    <th>Trạng thái</th>
                    <th>Ghi chú</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.map((appointment) => (
                    <tr key={appointment.maLichHen}>
                      <td>{`${appointment.gioBatDau} - ${appointment.gioKetThuc}`}</td>
                      <td>{appointment.tenBenhNhan}</td>
                      <td>{appointment.soDienThoaiBenhNhan}</td>
                      <td>{appointment.tenDichVu}</td>
                      <td>
                        <span className={`badge ${getStatusBadgeClass(appointment.maTrangThai)}`}>
                          {appointment.tenTrangThai}
                        </span>
                      </td>
                      <td>{appointment.ghiChuLichHen || '-'}</td>
                      <td>
                        <div className="d-flex gap-2">
                          <button 
                            className="btn btn-primary btn-sm rounded-pill"
                            onClick={() => window.location.href = `/dashboard/appointments/${appointment.maLichHen}`}
                          >
                            Chi tiết
                          </button>
                          {!appointment.coBenhAn && (appointment.maTrangThai === 1 || appointment.maTrangThai === 2) && (
                            <button 
                              className="btn btn-success btn-sm rounded-pill"
                              onClick={() => window.location.href = `/dashboard/examination/${appointment.maLichHen}`}
                            >
                              Khám bệnh
                            </button>
                          )}
                          {appointment.maTrangThai !== 5 && appointment.maTrangThai !== 4 && (
                            <button 
                              className="btn btn-danger btn-sm rounded-pill"
                              onClick={() => handleCancelAppointment(appointment)}
                            >
                              Hủy lịch
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card.Body>
      </Card>

      {/* Recent Patients */}
      <Card className="border-0 shadow-sm">
        <Card.Header className="bg-white">
          <h5 className="mb-0">Bệnh Nhân Gần Đây</h5>
        </Card.Header>
        <Card.Body>
          <Table responsive hover>
            <thead>
              <tr>
                <th>Mã BN</th>
                <th>Họ và Tên</th>
                <th>Ngày Khám Cuối</th>
                <th>Thao Tác</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>BN001</td>
                <td>Lê Văn C</td>
                <td>15/03/2024</td>
                <td>
                  <Button variant="info" size="sm">
                    <i className="fas fa-file-medical me-1"></i>
                    Xem Hồ Sơ
                  </Button>
                </td>
              </tr>
              <tr>
                <td>BN002</td>
                <td>Phạm Thị D</td>
                <td>14/03/2024</td>
                <td>
                  <Button variant="info" size="sm">
                    <i className="fas fa-file-medical me-1"></i>
                    Xem Hồ Sơ
                  </Button>
                </td>
              </tr>
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      <NotificationModal
        show={notification.show}
        onClose={() => setNotification({...notification, show: false})}
        title={notification.title}
        message={notification.message}
        type={notification.type}
      />
    </Container>
  );
};

function getStatusBadgeClass(maTrangThai: number): string {
  switch (maTrangThai) {
    case 1: // Đã đặt
      return 'bg-primary';
    case 2: // Đã xác nhận
      return 'bg-success';
    case 3: // Đang thực hiện
      return 'bg-warning';
    case 4: // Hoàn thành
      return 'bg-success';
    case 5: // Đã hủy
      return 'bg-danger';
    default:
      return 'bg-secondary';
  }
}

export default Dashboard; 
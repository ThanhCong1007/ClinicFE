import { useEffect, useState } from 'react';
import { getDoctorAppointments } from '../services/medicalService';

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
  coBenhAn: boolean;
}

export default function Appointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState('all'); // 'all', 'today', 'upcoming', 'past'

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const userData = JSON.parse(localStorage.getItem('user') || '{}');
        const maBacSi = userData.maBacSi;
        
        if (!maBacSi) {
          throw new Error('Không tìm thấy thông tin bác sĩ');
        }

        const data = await getDoctorAppointments(maBacSi);
        setAppointments(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Có lỗi xảy ra khi tải dữ liệu');
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  const filteredAppointments = appointments.filter(appointment => {
    const appointmentDate = new Date(appointment.ngayHen);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    switch (filter) {
      case 'today':
        return appointment.ngayHen === today.toISOString().split('T')[0];
      case 'upcoming':
        return appointmentDate > today;
      case 'past':
        return appointmentDate < today;
      default:
        return true;
    }
  });

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
    <div className="container-fluid p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Danh sách lịch hẹn</h2>
        <div className="btn-group">
          <button 
            className={`btn ${filter === 'all' ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => setFilter('all')}
          >
            Tất cả
          </button>
          <button 
            className={`btn ${filter === 'today' ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => setFilter('today')}
          >
            Hôm nay
          </button>
          <button 
            className={`btn ${filter === 'upcoming' ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => setFilter('upcoming')}
          >
            Sắp tới
          </button>
          <button 
            className={`btn ${filter === 'past' ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => setFilter('past')}
          >
            Đã qua
          </button>
        </div>
      </div>

      {filteredAppointments.length === 0 ? (
        <div className="alert alert-info">
          Không có lịch hẹn nào
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped table-hover">
            <thead>
              <tr>
                <th>Ngày</th>
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
              {filteredAppointments.map((appointment) => (
                <tr key={appointment.maLichHen}>
                  <td>{appointment.ngayHen}</td>
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
                    <button 
                      className="btn btn-primary btn-sm me-2"
                      onClick={() => window.location.href = `/dashboard/appointments/${appointment.maLichHen}`}
                    >
                      Chi tiết
                    </button>
                    {!appointment.coBenhAn && appointment.maTrangThai === 2 && (
                      <button 
                        className="btn btn-success btn-sm"
                        onClick={() => window.location.href = `/dashboard/examination/${appointment.maLichHen}`}
                      >
                        Khám bệnh
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function getStatusBadgeClass(maTrangThai: number): string {
  switch (maTrangThai) {
    case 1: // Chờ xác nhận
      return 'bg-warning';
    case 2: // Đã xác nhận
      return 'bg-info';
    case 3: // Đã hủy
      return 'bg-danger';
    case 4: // Hoàn thành
      return 'bg-success';
    default:
      return 'bg-secondary';
  }
} 
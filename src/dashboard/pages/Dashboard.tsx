import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Table, Tag, Button, Modal, Statistic, notification } from 'antd';
import { format } from 'date-fns';
import axios from 'axios';
import { getDoctorAppointments, cancelAppointment } from '../services/api';
import { useNavigate } from 'react-router-dom';

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
  const navigate = useNavigate();

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
    Modal.confirm({
      title: 'Xác nhận',
      content: 'Bạn có chắc chắn muốn hủy lịch hẹn này?',
      okText: 'Hủy lịch',
      okType: 'danger',
      cancelText: 'Không',
      onOk: async () => {
        try {
          const appointmentData = {
            maBenhNhan: appointment.maBenhNhan,
            maBacSi: appointment.maBacSi,
            maDichVu: appointment.maDichVu,
            ngayHen: appointment.ngayHen,
            gioBatDau: appointment.gioBatDau,
            gioKetThuc: appointment.gioKetThuc,
            maTrangThai: 5,
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
          notification.success({ message: 'Thành công', description: 'Hủy lịch hẹn thành công' });
        } catch (err) {
          notification.error({ message: 'Lỗi', description: err instanceof Error ? err.message : 'Có lỗi xảy ra khi hủy lịch hẹn' });
        }
      }
    });
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <span className="ant-spin-dot ant-spin-dot-spin" style={{ fontSize: 32 }} />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ margin: 24 }}>
        <Card><div style={{ color: 'red', padding: 16 }}>{error}</div></Card>
      </div>
    );
  }

  const columns = [
    {
      title: 'Ngày',
      dataIndex: 'ngayHen',
      key: 'ngayHen',
      render: (text: string) => <span>{text}</span>
    },
    {
      title: 'Thời gian',
      key: 'thoiGian',
      render: (_: any, record: Appointment) => `${record.gioBatDau} - ${record.gioKetThuc}`
    },
    {
      title: 'Bệnh nhân',
      dataIndex: 'tenBenhNhan',
      key: 'tenBenhNhan',
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'soDienThoaiBenhNhan',
      key: 'soDienThoaiBenhNhan',
    },
    {
      title: 'Dịch vụ',
      dataIndex: 'tenDichVu',
      key: 'tenDichVu',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'maTrangThai',
      key: 'maTrangThai',
      render: (maTrangThai: number, record: Appointment) => (
        <Tag color={getStatusBadgeColor(maTrangThai)}>{record.tenTrangThai}</Tag>
      )
    },
    {
      title: 'Ghi chú',
      dataIndex: 'ghiChuLichHen',
      key: 'ghiChuLichHen',
      render: (text: string) => text || ''
    },
    {
      title: 'Thao tác',
      key: 'actions',
      render: (_: any, record: Appointment) => (
        <>
          {(record.maTrangThai === 1 || record.maTrangThai === 2) && (
            <Button type="primary" size="small" onClick={() => navigate(`/dashboard/examination/${record.maLichHen}`)} style={{ marginRight: 8 }}>
              Khám bệnh
            </Button>
          )}
          {record.maTrangThai !== 5 && record.maTrangThai !== 4 && (
            <Button danger size="small" onClick={() => handleCancelAppointment(record)}>
              Hủy lịch
            </Button>
          )}
        </>
      )
    }
  ];

  return (
    <div style={{ padding: 24 }}>
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card>
            <Statistic title="Tổng Số Bệnh Nhân" value={stats.totalPatients} prefix={<i className="fas fa-users" style={{ color: '#1890ff' }} />} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="Lịch Hẹn Hôm Nay" value={stats.todayAppointments} prefix={<i className="fas fa-calendar-day" style={{ color: '#52c41a' }} />} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="Bệnh Nhân Mới" value={stats.newPatients} prefix={<i className="fas fa-user-plus" style={{ color: '#faad14' }} />} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="Lịch Khám Chờ Xử Lý" value={stats.pendingExaminations} prefix={<i className="fas fa-stethoscope" style={{ color: '#eb2f96' }} />} />
          </Card>
        </Col>
      </Row>
      <Card title="Danh sách lịch hẹn" variant="outlined">
        <Table
          columns={columns}
          dataSource={appointments}
          rowKey="maLichHen"
          loading={loading}
          locale={{ emptyText: 'Không có lịch hẹn nào' }}
          pagination={{ pageSize: 10 }}
          bordered
        />
      </Card>
    </div>
  );
};

function getStatusBadgeColor(maTrangThai: number): string {
  switch (maTrangThai) {
    case 1: return 'blue';
    case 2: return 'green';
    case 3: return 'gold';
    case 4: return 'cyan';
    case 5: return 'red';
    default: return 'default';
  }
}

export default Dashboard; 
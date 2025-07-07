import { useEffect, useState } from 'react';
import { Table, Modal, Form, Button, Input, Tag, Select, Row, Col, Card, message } from 'antd';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getDoctorAppointments, getAppointmentDetails, getPatientMedicalRecords, createMedicalExam, cancelAppointment } from '../services/api';

const { Option } = Select;

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

interface Prescription {
  maThuoc: number;
  tenThuoc: string;
  soLuong: number;
  donVi: string;
  cachDung: string;
  ghiChu: string;
  giaBan: number;
  tongTien: number;
  dotDungThuoc: string;
}

export default function Appointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState('all');
  const [showExamModal, setShowExamModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [isWalkIn, setIsWalkIn] = useState(false);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [newPrescription, setNewPrescription] = useState<Prescription>({
    maThuoc: 0,
    tenThuoc: '',
    soLuong: 1,
    donVi: '',
    cachDung: '',
    ghiChu: '',
    giaBan: 0,
    tongTien: 0,
    dotDungThuoc: ''
  });
  const [medicalRecord, setMedicalRecord] = useState({
    lyDoKham: '',
    chanDoan: '',
    ghiChuDieuTri: '',
    ngayTaiKham: '',
    tienSuBenh: '',
    diUng: ''
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [fetchingExam, setFetchingExam] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const userData = JSON.parse(localStorage.getItem('user') || '{}');
        const maBacSi = userData.maBacSi;
        if (!maBacSi) throw new Error('Không tìm thấy thông tin bác sĩ');
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

  const handleStartExam = async (record: Appointment) => {
    setFetchingExam(true);
    try {
      const detail = await getAppointmentDetails(record.maLichHen);
      navigate('/dashboard/examination', { state: { appointment: detail } });
    } catch (err) {
      message.error('Không thể lấy chi tiết lịch hẹn');
    } finally {
      setFetchingExam(false);
    }
  };

  const handleExamSubmit = async () => {
    if (!selectedAppointment) return;
    try {
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      const now = new Date();
      const danhSachThuoc = prescriptions.map(pres => ({
        maThuoc: pres.maThuoc,
        tenThuoc: pres.tenThuoc,
        lieuDung: pres.cachDung,
        tanSuat: pres.dotDungThuoc,
        thoiDiem: '',
        thoiGianDieuTri: 7,
        soLuong: pres.soLuong,
        donViDung: pres.donVi,
        donGia: pres.giaBan,
        ghiChu: pres.ghiChu,
        lyDoDonThuoc: ''
      }));
      const examData = {
        maBenhNhan: selectedAppointment.maBenhNhan,
        hoTen: selectedAppointment.tenBenhNhan,
        soDienThoai: selectedAppointment.soDienThoaiBenhNhan,
        email: '',
        diaChi: '',
        ngaySinh: '',
        gioiTinh: '',
        tienSuBenh: medicalRecord.tienSuBenh,
        diUng: medicalRecord.diUng,
        maLichHen: isWalkIn ? null : selectedAppointment.maLichHen,
        maBacSi: userData.maBacSi,
        lyDoKham: medicalRecord.lyDoKham,
        chanDoan: medicalRecord.chanDoan,
        ghiChuDieuTri: medicalRecord.ghiChuDieuTri,
        ngayTaiKham: medicalRecord.ngayTaiKham,
        maDichVu: [selectedAppointment.maDichVu],
        danhSachThuoc: danhSachThuoc,
        ghiChuDonThuoc: '',
        ngayKham: format(now, "yyyy-MM-dd'T'HH:mm:ss.SSSSSS")
      };
      await createMedicalExam(examData);
      setShowExamModal(false);
      setMedicalRecord({
        lyDoKham: '',
        chanDoan: '',
        ghiChuDieuTri: '',
        ngayTaiKham: '',
        tienSuBenh: '',
        diUng: ''
      });
      setPrescriptions([]);
      const data = await getDoctorAppointments(userData.maBacSi);
      setAppointments(data);
      message.success('Lưu bệnh án thành công!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra khi tạo bệnh án');
      message.error('Có lỗi xảy ra khi tạo bệnh án');
    }
  };

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
          const userData = JSON.parse(localStorage.getItem('user') || '{}');
          const data = await getDoctorAppointments(userData.maBacSi);
          setAppointments(data);
          message.success('Hủy lịch hẹn thành công');
        } catch (err) {
          message.error(err instanceof Error ? err.message : 'Có lỗi xảy ra khi hủy lịch hẹn');
        }
      }
    });
  };

  const filteredAppointments = appointments.filter(appointment => {
    const appointmentDateStr = format(new Date(appointment.ngayHen), 'yyyy-MM-dd');
    const today = new Date();
    const todayStr = format(today, 'yyyy-MM-dd');
    switch (filter) {
      case 'today':
        return appointmentDateStr === todayStr;
      case 'upcoming':
        return appointmentDateStr > todayStr;
      case 'past':
        return appointmentDateStr < todayStr;
      default:
        return true;
    }
  });

  const sortedAppointments = [...filteredAppointments].sort((a, b) => {
    const statusPriority = (status: number) => {
      switch (status) {
        case 3: return 1;
        case 2: return 2;
        case 1: return 3;
        case 4: return 4;
        case 5: return 5;
        default: return 6;
      }
    };
    const statusA = statusPriority(a.maTrangThai);
    const statusB = statusPriority(b.maTrangThai);
    if (statusA !== statusB) return statusA - statusB;
    const dateA = new Date(`${a.ngayHen}T${a.gioBatDau}`);
    const dateB = new Date(`${b.ngayHen}T${b.gioBatDau}`);
    return dateA.getTime() - dateB.getTime();
  });

  const displayedAppointments = sortedAppointments.filter(appointment =>
    appointment.tenBenhNhan.toLowerCase().includes(searchTerm.toLowerCase()) ||
    appointment.soDienThoaiBenhNhan.includes(searchTerm) ||
    appointment.tenDichVu.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
            <Button type="primary" size="small" onClick={() => handleStartExam(record)} loading={fetchingExam} style={{ marginRight: 8 }}>
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
      <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
        <Col><h2>Danh sách lịch hẹn</h2></Col>
        <Col>
          <Button type="primary" onClick={() => navigate('/dashboard/examination')} style={{ marginRight: 8 }}>
            Khám bệnh
          </Button>
          <Select value={filter} onChange={setFilter} style={{ width: 120 }}>
            <Option value="all">Tất cả</Option>
            <Option value="today">Hôm nay</Option>
            <Option value="upcoming">Sắp tới</Option>
            <Option value="past">Đã qua</Option>
          </Select>
        </Col>
      </Row>
      <Input.Search
        placeholder="Tìm kiếm theo tên, số điện thoại, dịch vụ..."
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
        style={{ marginBottom: 16, maxWidth: 400 }}
        allowClear
      />
      <Table
        columns={columns}
        dataSource={displayedAppointments}
        rowKey="maLichHen"
        loading={loading}
        locale={{ emptyText: 'Không có lịch hẹn nào' }}
        pagination={{ pageSize: 10 }}
        bordered
      />
      {/* Modal khám bệnh (giữ nguyên logic, chỉ đổi UI sang antd) */}
      <Modal
        open={showExamModal}
        onCancel={() => setShowExamModal(false)}
        title={`Khám bệnh ${isWalkIn ? 'vãng lai' : ''}`}
        width={900}
        footer={[
          <Button key="cancel" onClick={() => setShowExamModal(false)}>
            Hủy
          </Button>,
          <Button key="submit" type="primary" onClick={handleExamSubmit}>
            Lưu bệnh án
          </Button>
        ]}
      >
        <Row gutter={16}>
          <Col span={14}>
            <Card title="Thông tin bệnh nhân" style={{ marginBottom: 16 }}>
              {isWalkIn ? (
                <Form layout="vertical">
                  <Form.Item label="Họ và tên">
                    <Input
                      value={selectedAppointment?.tenBenhNhan || ''}
                      onChange={e => setSelectedAppointment(prev => prev ? { ...prev, tenBenhNhan: e.target.value } : null)}
                    />
                  </Form.Item>
                  <Form.Item label="Số điện thoại">
                    <Input
                      value={selectedAppointment?.soDienThoaiBenhNhan || ''}
                      onChange={e => setSelectedAppointment(prev => prev ? { ...prev, soDienThoaiBenhNhan: e.target.value } : null)}
                    />
                  </Form.Item>
                </Form>
              ) : (
                <div>
                  <p><strong>Họ và tên:</strong> {selectedAppointment?.tenBenhNhan}</p>
                  <p><strong>Số điện thoại:</strong> {selectedAppointment?.soDienThoaiBenhNhan}</p>
                  <p><strong>Dịch vụ:</strong> {selectedAppointment?.tenDichVu}</p>
                  <p><strong>Thời gian:</strong> {selectedAppointment?.gioBatDau} - {selectedAppointment?.gioKetThuc}</p>
                </div>
              )}
            </Card>
            <Card title="Thông tin khám bệnh">
              <Form layout="vertical">
                <Form.Item label="Lý do khám">
                  <Input
                    value={medicalRecord.lyDoKham}
                    onChange={e => setMedicalRecord({ ...medicalRecord, lyDoKham: e.target.value })}
                  />
                </Form.Item>
                <Form.Item label="Tiền sử bệnh">
                  <Input.TextArea
                    rows={3}
                    value={medicalRecord.tienSuBenh}
                    onChange={e => setMedicalRecord({ ...medicalRecord, tienSuBenh: e.target.value })}
                  />
                </Form.Item>
                <Form.Item label="Dị ứng">
                  <Input
                    value={medicalRecord.diUng}
                    onChange={e => setMedicalRecord({ ...medicalRecord, diUng: e.target.value })}
                  />
                </Form.Item>
                <Form.Item label="Chẩn đoán">
                  <Input
                    value={medicalRecord.chanDoan}
                    onChange={e => setMedicalRecord({ ...medicalRecord, chanDoan: e.target.value })}
                  />
                </Form.Item>
                <Form.Item label="Ghi chú điều trị">
                  <Input.TextArea
                    rows={3}
                    value={medicalRecord.ghiChuDieuTri}
                    onChange={e => setMedicalRecord({ ...medicalRecord, ghiChuDieuTri: e.target.value })}
                  />
                </Form.Item>
                <Form.Item label="Ngày tái khám">
                  <Input
                    type="date"
                    value={medicalRecord.ngayTaiKham}
                    onChange={e => setMedicalRecord({ ...medicalRecord, ngayTaiKham: e.target.value })}
                  />
                </Form.Item>
              </Form>
            </Card>
          </Col>
          <Col span={10}>
            <Card title="Đơn thuốc">
              {/* Prescription Table (có thể chuyển sang antd Table nếu muốn) */}
              <Table
                dataSource={prescriptions.map((pres, idx) => ({ ...pres, stt: idx + 1 }))}
                rowKey="stt"
                pagination={false}
                bordered
                size="small"
                columns={[
                  { title: 'STT', dataIndex: 'stt', key: 'stt', width: 50 },
                  { title: 'Mã thuốc', dataIndex: 'maThuoc', key: 'maThuoc', width: 80 },
                  { title: 'Tên thuốc', dataIndex: 'tenThuoc', key: 'tenThuoc' },
                  {
                    title: 'Đơn vị', dataIndex: 'donVi', key: 'donVi', render: (text, record, idx) => <Input value={text} onChange={e => {
                      const newList = [...prescriptions];
                      newList[idx].donVi = e.target.value;
                      setPrescriptions(newList);
                    }} size="small" />
                  },
                  {
                    title: 'Số lượng', dataIndex: 'soLuong', key: 'soLuong', render: (text, record, idx) => <Input type="number" min={1} value={text} onChange={e => {
                      const newList = [...prescriptions];
                      newList[idx].soLuong = parseInt(e.target.value) || 1;
                      newList[idx].tongTien = (newList[idx].soLuong * (newList[idx].giaBan || 0));
                      setPrescriptions(newList);
                    }} size="small" />
                  },
                  {
                    title: 'Đợt dùng thuốc', dataIndex: 'dotDungThuoc', key: 'dotDungThuoc', render: (text, record, idx) => <Input value={text} onChange={e => {
                      const newList = [...prescriptions];
                      newList[idx].dotDungThuoc = e.target.value;
                      setPrescriptions(newList);
                    }} size="small" />
                  },
                  {
                    title: 'Ghi chú', dataIndex: 'ghiChu', key: 'ghiChu', render: (text, record, idx) => <Input value={text} onChange={e => {
                      const newList = [...prescriptions];
                      newList[idx].ghiChu = e.target.value;
                      setPrescriptions(newList);
                    }} size="small" />
                  },
                  {
                    title: 'Giá bán', dataIndex: 'giaBan', key: 'giaBan', render: (text, record, idx) => <Input type="number" min={0} value={text} onChange={e => {
                      const newList = [...prescriptions];
                      newList[idx].giaBan = parseInt(e.target.value) || 0;
                      newList[idx].tongTien = (newList[idx].soLuong * newList[idx].giaBan);
                      setPrescriptions(newList);
                    }} size="small" />
                  },
                  { title: 'Tổng tiền', dataIndex: 'tongTien', key: 'tongTien', render: (text) => <span>{text?.toLocaleString() || 0}</span> },
                  {
                    title: '', key: 'actions', width: 40, render: (_: any, record: any, idx: number) => (
                      <Button danger size="small" onClick={() => setPrescriptions(prescriptions.filter((_, i) => i !== idx))}>Xóa</Button>
                    )
                  }
                ]}
                summary={pageData => (
                  <Table.Summary.Row>
                    <Table.Summary.Cell index={0} colSpan={8} align="right"><b>Tổng tiền:</b></Table.Summary.Cell>
                    <Table.Summary.Cell index={1} colSpan={2} align="left">{prescriptions.reduce((sum, p) => sum + (p.tongTien || 0), 0).toLocaleString()}</Table.Summary.Cell>
                  </Table.Summary.Row>
                )}
              />
              <Button type="dashed" block style={{ marginTop: 12 }} onClick={() => setPrescriptions([...prescriptions, { maThuoc: 0, tenThuoc: '', soLuong: 1, donVi: '', cachDung: '', ghiChu: '', giaBan: 0, tongTien: 0, dotDungThuoc: '' }])}>
                Thêm thuốc mới
              </Button>
            </Card>
          </Col>
        </Row>
      </Modal>
    </div>
  );
}

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
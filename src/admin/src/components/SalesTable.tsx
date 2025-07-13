import React, { useEffect, useState } from 'react';
import { Table, Card, Avatar, Typography, Spin, Alert, Row, Col, Select, InputNumber, Space } from 'antd';
import { UserOutlined, CrownFilled } from '@ant-design/icons';
import apiClient from '../services/api';
const { Title } = Typography;
const { Option } = Select;

interface TopPatient {
  key: number;
  avatar?: string;
  name: string;
  phone: string;
  invoiceCount: number;
  totalAmount: number;
}

interface ChiTietHoaDon {
  maMuc: number;
  maHoaDon: number;
  maBenhAnDichVu: number | null;
  moTa: string;
  soLuong: number;
  donGia: number;
  thanhTien: number;
  ngayTao: string;
}

interface HoaDon {
  maHoaDon: number;
  maBenhNhan: number;
  tenBenhNhan: string;
  soDienThoai: string;
  email: string | null;
  maLichHen: number | null;
  tongTien: number;
  thanhTien: number;
  ngayHoaDon: string;
  trangThai: string;
  nguoiTao: number;
  tenNguoiTao: string;
  ngayTao: string;
  chiTietHoaDon: ChiTietHoaDon[];
}

const columns = [
  {
    title: '',
    dataIndex: 'topIcon',
    key: 'topIcon',
    align: 'center' as const,
    width: 48,
    render: (_: any, __: TopPatient, index: number) => {
      if (index === 0) return <CrownFilled style={{ color: '#FFD700', fontSize: 20 }} title="Top 1" />;
      if (index === 1) return <CrownFilled style={{ color: '#C0C0C0', fontSize: 20 }} title="Top 2" />;
      if (index === 2) return <CrownFilled style={{ color: '#cd7f32', fontSize: 20 }} title="Top 3" />;
      return null;
    },
    className: 'no-border',
  },
  {
    title: 'Bệnh nhân',
    dataIndex: 'name',
    key: 'name',
    render: (_: any, record: TopPatient) => (
      <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <Avatar src={record.avatar} icon={<UserOutlined />} />
        <span>{record.name}</span>
      </span>
    ),
  },
  {
    title: 'Số điện thoại',
    dataIndex: 'phone',
    key: 'phone',
    responsive: ['md' as const],
  },
  {
    title: 'Số hóa đơn',
    dataIndex: 'invoiceCount',
    key: 'invoiceCount',
    align: 'center' as const,
    render: (val: number) => <b>{val}</b>,
  },
  {
    title: 'Tổng tiền',
    dataIndex: 'totalAmount',
    key: 'totalAmount',
    align: 'right' as const,
    render: (val: number) => val.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }),
  },
];

const SalesTable: React.FC = () => {
  const now = new Date();
  const [month, setMonth] = useState<number>(now.getMonth() + 1);
  const [year, setYear] = useState<number>(now.getFullYear());
  const [data, setData] = useState<TopPatient[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await apiClient.get<HoaDon[]>('/api/hoa-don/admin');
        const invoices = response.data;
        // Filter by month/year
        const filtered = invoices.filter(hd => {
          if (hd.trangThai !== 'DA_THANH_TOAN') return false;
          const d = new Date(hd.ngayHoaDon);
          if (year && d.getFullYear() !== year) return false;
          if (month && d.getMonth() + 1 !== month) return false;
          return true;
        });
        // Group by patient
        const patientMap = new Map<number, TopPatient>();
        for (const hd of filtered) {
          if (!patientMap.has(hd.maBenhNhan)) {
            patientMap.set(hd.maBenhNhan, {
              key: hd.maBenhNhan,
              name: hd.tenBenhNhan,
              phone: hd.soDienThoai,
              invoiceCount: 0,
              totalAmount: 0,
            });
          }
          const p = patientMap.get(hd.maBenhNhan)!;
          p.invoiceCount += 1;
          p.totalAmount += hd.thanhTien;
        }
        const topPatients = Array.from(patientMap.values())
          .sort((a, b) => b.totalAmount - a.totalAmount || b.invoiceCount - a.invoiceCount)
          .slice(0, 5);
        setData(topPatients);
      } catch (err) {
        setError('Lỗi khi tải dữ liệu bảng hóa đơn');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [month, year]);

  // Tạo danh sách tháng, năm
  const monthOptions = [
    <Option key={0} value={0}>Tất cả</Option>,
    ...Array.from({ length: 12 }, (_, i) => (
      <Option key={i + 1} value={i + 1}>Tháng {i + 1}</Option>
    ))
  ];
  const yearOptions = [
    ...Array.from({ length: 6 }, (_, i) => (
      <Option key={now.getFullYear() - i} value={now.getFullYear() - i}>{now.getFullYear() - i}</Option>
    )),
    <Option key={0} value={0}>Tất cả</Option>
  ];

  return (
    <Card className="admin-table-responsive" bordered={false} style={{ marginBottom: 24 }}>
      <Row align="middle" justify="space-between" style={{ marginBottom: 16 }} gutter={[16, 16]}>
        <Col>
          <Title level={5} style={{ margin: 0 }}>Top 5 bệnh nhân có tổng chi tiêu cao nhất</Title>
        </Col>
        <Col>
          <Space>
            <Select value={month} style={{ width: 120 }} onChange={setMonth}>
              {monthOptions}
            </Select>
            <Select value={year} style={{ width: 120 }} onChange={setYear}>
              {yearOptions}
            </Select>
          </Space>
        </Col>
      </Row>
      {loading ? (
        <Spin tip="Đang tải dữ liệu..." size="large" style={{ width: '100%' }} />
      ) : error ? (
        <Alert type="error" message={error} showIcon />
      ) : (
        <Table
          columns={columns}
          dataSource={data}
          pagination={false}
          rowKey="key"
          bordered={false}
          size="middle"
          scroll={{ x: 'max-content' }}
          locale={{ emptyText: 'Không có dữ liệu' }}
        />
      )}
    </Card>
  );
};

export default SalesTable; 
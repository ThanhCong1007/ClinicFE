import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Card, Button, Modal, Tag, Descriptions, Spin } from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import { Invoice, InvoiceDetail } from './types';

interface ProfileInvoicesProps {
  maBenhNhan: number;
}

const statusColor = (status: string) => {
  switch (status) {
    case 'CHUA_THANH_TOAN': return 'red';
    case 'DA_THANH_TOAN': return 'green';
    default: return 'default';
  }
};

const ProfileInvoices: React.FC<ProfileInvoicesProps> = ({ maBenhNhan }) => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  useEffect(() => {
    if (!maBenhNhan) return;
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Yêu cầu xác thực.');
      return;
    }
    setLoading(true);
    setError(null);
    axios.get(`/api/hoa-don/benh-nhan/${maBenhNhan}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => {
        setInvoices(res.data || []);
      })
      .catch(() => setError('Không thể tải danh sách hóa đơn'))
      .finally(() => setLoading(false));
  }, [maBenhNhan]);

  const handleSelectInvoice = (maHoaDon: number) => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Yêu cầu xác thực.');
      return;
    }
    setDetailLoading(true);
    setSelectedInvoice(null);
    axios.get(`/api/hoa-don/${maHoaDon}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => setSelectedInvoice(res.data))
      .catch(() => setError('Không thể tải chi tiết hóa đơn'))
      .finally(() => setDetailLoading(false));
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '---';
    return new Date(dateStr).toLocaleString('vi-VN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Table columns
  const columns = [
    {
      title: 'Ngày hóa đơn',
      dataIndex: 'ngayHoaDon',
      key: 'ngayHoaDon',
      render: (ngayHoaDon: string) => formatDate(ngayHoaDon),
    },
    {
      title: 'Tên bệnh nhân',
      dataIndex: 'tenBenhNhan',
      key: 'tenBenhNhan',
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'soDienThoai',
      key: 'soDienThoai',
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'tongTien',
      key: 'tongTien',
      render: (tongTien: number) => tongTien.toLocaleString('vi-VN') + 'đ',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'trangThai',
      key: 'trangThai',
      render: (status: string) => <Tag color={statusColor(status)}>{status === 'CHUA_THANH_TOAN' ? 'Chưa thanh toán' : 'Đã thanh toán'}</Tag>,
    },
    {
      title: '',
      key: 'actions',
      render: (_: any, record: Invoice) => (
        <>
          <Button icon={<EyeOutlined />} onClick={() => handleSelectInvoice(record.maHoaDon)} style={{ marginRight: 8 }} />
          {record.trangThai === 'CHUA_THANH_TOAN' && (
            <Button type="primary" onClick={() => handlePayInvoice(record.maHoaDon)}>
              Thanh toán VNPay
            </Button>
          )}
        </>
      ),
    },
  ];

  // Modal for detail
  const detailModal = (
    <Modal
      open={!!selectedInvoice}
      onCancel={() => setSelectedInvoice(null)}
      title={selectedInvoice ? `Chi tiết hóa đơn #${selectedInvoice.maHoaDon}` : ''}
      footer={null}
      width={900}
    >
      {detailLoading || !selectedInvoice ? (
        <Spin />
      ) : (
        <Card bordered={false}>
          <Descriptions column={2} bordered size="middle">
            <Descriptions.Item label="Ngày hóa đơn">{formatDate(selectedInvoice.ngayHoaDon)}</Descriptions.Item>
            <Descriptions.Item label="Tên bệnh nhân">{selectedInvoice.tenBenhNhan}</Descriptions.Item>
            <Descriptions.Item label="Số điện thoại">{selectedInvoice.soDienThoai}</Descriptions.Item>
            <Descriptions.Item label="Email">{selectedInvoice.email}</Descriptions.Item>
            <Descriptions.Item label="Trạng thái" span={2}>
              <Tag color={statusColor(selectedInvoice.trangThai)}>{selectedInvoice.trangThai === 'CHUA_THANH_TOAN' ? 'Chưa thanh toán' : 'Đã thanh toán'}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Tổng tiền">{selectedInvoice.tongTien.toLocaleString('vi-VN')}đ</Descriptions.Item>
            <Descriptions.Item label="Thành tiền">{selectedInvoice.thanhTien.toLocaleString('vi-VN')}đ</Descriptions.Item>
          </Descriptions>
          <Card title="Chi tiết hóa đơn" size="small" style={{ marginTop: 16 }}>
            <Table
              dataSource={selectedInvoice.chiTietHoaDon}
              rowKey="maMuc"
              pagination={false}
              columns={[
                { title: 'Mô tả', dataIndex: 'moTa', key: 'moTa' },
                { title: 'Số lượng', dataIndex: 'soLuong', key: 'soLuong' },
                { title: 'Đơn giá', dataIndex: 'donGia', key: 'donGia', render: (v: number) => v.toLocaleString('vi-VN') + 'đ' },
                { title: 'Thành tiền', dataIndex: 'thanhTien', key: 'thanhTien', render: (v: number) => v.toLocaleString('vi-VN') + 'đ' },
                { title: 'Ngày tạo', dataIndex: 'ngayTao', key: 'ngayTao', render: (v: string) => formatDate(v) },
              ]}
            />
          </Card>
        </Card>
      )}
    </Modal>
  );

  // Thêm hàm thanh toán VNPay
  const handlePayInvoice = async (maHoaDon: number) => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Yêu cầu xác thực.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await axios.post(
        '/api/hoa-don/payment/create',
        {
          maHoaDon,
          bankCode: 'NCB',
          language: 'vn',
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (res.data && res.data.code === '00' && res.data.paymentUrl) {
        window.location.href = res.data.paymentUrl;
      } else {
        setError(res.data?.message || 'Không thể tạo thanh toán VNPay');
      }
    } catch (e: any) {
      setError('Không thể tạo thanh toán VNPay');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card title="Danh sách hóa đơn" style={{ marginBottom: 24 }}>
      {loading ? <Spin /> : error ? <div style={{ color: 'red' }}>{error}</div> : (
        <Table
          columns={columns}
          dataSource={invoices}
          rowKey="maHoaDon"
          pagination={false}
        />
      )}
      {detailModal}
    </Card>
  );
};

export default ProfileInvoices; 
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Card, Button, Modal, Tag, Descriptions, Spin } from 'antd';
import { EyeOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { ProfileMedicalRecordsProps, MedicalRecord, MedicalRecordDetail } from './types';

const statusColor = (status: string) => {
  switch (status) {
    case 'Đã hoàn thành': return 'green';
    case 'Đang điều trị': return 'blue';
    default: return 'default';
  }
};

const ProfileMedicalRecords: React.FC<ProfileMedicalRecordsProps> = ({ maBenhNhan }) => {
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedRecord, setSelectedRecord] = useState<MedicalRecordDetail | null>(null);
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
    axios.get(`/api/benh-an/benh-nhan/${maBenhNhan}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => {
        setRecords(res.data.data || []);
      })
      .catch(() => setError('Không thể tải danh sách bệnh án'))
      .finally(() => setLoading(false));
  }, [maBenhNhan]);

  const handleSelectRecord = (maBenhAn: number) => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Yêu cầu xác thực.');
      return;
    }
    setDetailLoading(true);
    setSelectedRecord(null);
    axios.get(`/api/benh-an/chi-tiet/${maBenhAn}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => setSelectedRecord(res.data.data))
      .catch(() => setError('Không thể tải chi tiết bệnh án'))
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
      title: 'Ngày tạo',
      dataIndex: 'ngayTao',
      key: 'ngayTao',
      render: (ngayTao: string) => formatDate(ngayTao),
    },
    {
      title: 'Bác sĩ',
      dataIndex: 'tenBacSi',
      key: 'tenBacSi',
    },
    {
      title: 'Lý do khám',
      dataIndex: 'lyDoKham',
      key: 'lyDoKham',
    },
    {
      title: 'Chẩn đoán',
      dataIndex: 'chanDoan',
      key: 'chanDoan',
    },
    {
      title: '',
      key: 'actions',
      render: (_: any, record: MedicalRecord) => (
        <Button icon={<EyeOutlined />} onClick={() => handleSelectRecord(record.maBenhAn)} />
      ),
    },
  ];

  // Modal for detail
  const detailModal = (
    <Modal
      open={!!selectedRecord}
      onCancel={() => setSelectedRecord(null)}
      title={selectedRecord ? `Chi tiết bệnh án #${selectedRecord.maBenhAn}` : ''}
      footer={null}
      width={900}
    >
      {detailLoading || !selectedRecord ? (
        <Spin />
      ) : (
        <Card bordered={false}>
          <Descriptions column={2} bordered size="middle">
            <Descriptions.Item label="Ngày tạo">{formatDate(selectedRecord.ngayTao)}</Descriptions.Item>
            <Descriptions.Item label="Bác sĩ">{selectedRecord.tenBacSi}</Descriptions.Item>
            <Descriptions.Item label="Lý do khám">{selectedRecord.lyDoKham}</Descriptions.Item>
            <Descriptions.Item label="Chẩn đoán">{selectedRecord.chanDoan}</Descriptions.Item>
            <Descriptions.Item label="Ghi chú điều trị">{selectedRecord.ghiChuDieuTri || '-'}</Descriptions.Item>
            <Descriptions.Item label="Ngày tái khám">{selectedRecord.ngayTaiKham ? formatDate(selectedRecord.ngayTaiKham) : '-'}</Descriptions.Item>
            <Descriptions.Item label="Mô tả chẩn đoán" span={2}>{selectedRecord.moTaChanDoan || '-'}</Descriptions.Item>
          </Descriptions>
          {/* Dịch vụ đã sử dụng */}
          {selectedRecord.danhSachDichVu && selectedRecord.danhSachDichVu.length > 0 && (
            <Card title="Dịch vụ đã sử dụng" size="small" style={{ marginTop: 16 }}>
              <Table
                dataSource={selectedRecord.danhSachDichVu}
                rowKey="maDichVu"
                pagination={false}
                columns={[
                  { title: 'Tên dịch vụ', dataIndex: 'tenDichVu', key: 'tenDichVu' },
                  { title: 'Mô tả', dataIndex: 'moTa', key: 'moTa' },
                  { title: 'Giá', dataIndex: 'gia', key: 'gia', render: (gia: number) => gia.toLocaleString('vi-VN') + 'đ' },
                ]}
              />
            </Card>
          )}
          {/* Đơn thuốc */}
          {selectedRecord.danhSachThuoc && selectedRecord.danhSachThuoc.length > 0 && (
            <Card title="Đơn thuốc" size="small" style={{ marginTop: 16 }}>
              <Table
                dataSource={selectedRecord.danhSachThuoc}
                rowKey="maChiTiet"
                pagination={false}
                columns={[
                  { title: 'Tên thuốc', dataIndex: 'tenThuoc', key: 'tenThuoc' },
                  { title: 'Hoạt chất', dataIndex: 'hoatChat', key: 'hoatChat' },
                  { title: 'Hàm lượng', dataIndex: 'hamLuong', key: 'hamLuong' },
                  { title: 'Liều dùng', dataIndex: 'lieudung', key: 'lieudung' },
                  { title: 'Tần suất', dataIndex: 'tanSuat', key: 'tanSuat' },
                  { title: 'Thời gian', dataIndex: 'thoiGianDieuTri', key: 'thoiGianDieuTri', render: (v: number) => v + ' ngày' },
                  { title: 'Số lượng', dataIndex: 'soLuong', key: 'soLuong' },
                  { title: 'Đơn giá', dataIndex: 'donGia', key: 'donGia', render: (v: number) => v.toLocaleString('vi-VN') + 'đ' },
                  { title: 'Thành tiền', dataIndex: 'thanhTien', key: 'thanhTien', render: (v: number) => v.toLocaleString('vi-VN') + 'đ' },
                ]}
              />
              {selectedRecord.ghiChuDonThuoc && <div style={{ marginTop: 8 }}><Tag color="blue">Ghi chú: {selectedRecord.ghiChuDonThuoc}</Tag></div>}
            </Card>
          )}
        </Card>
      )}
    </Modal>
  );

  return (
    <Card title="Danh sách bệnh án" style={{ marginBottom: 24 }}>
      {loading ? <Spin /> : error ? <div style={{ color: 'red' }}>{error}</div> : (
        <Table
          columns={columns}
          dataSource={records}
          rowKey="maBenhAn"
          pagination={false}
        />
      )}
      {detailModal}
    </Card>
  );
};

export default ProfileMedicalRecords; 
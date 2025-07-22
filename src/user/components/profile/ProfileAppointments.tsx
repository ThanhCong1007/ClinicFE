import React, { useState, useEffect } from 'react';
import { Table, Tag, Button, Modal, Card, Pagination, Space, message, Descriptions } from 'antd';
import { EyeOutlined, EditOutlined, DeleteOutlined, ArrowLeftOutlined, PlusOutlined } from '@ant-design/icons';
import { ProfileAppointmentsProps, Appointment } from './types';

const statusColor = (status: string) => {
  switch (status) {
    case 'Đã đặt': return 'blue';
    case 'Đã hoàn thành': return 'green';
    case 'Đã hủy': return 'red';
    default: return 'default';
  }
};

const ProfileAppointments: React.FC<ProfileAppointmentsProps> = ({
  appointments,
  userInfo,
  showAppointmentDetail,
  setShowAppointmentDetail,
  selectedAppointment,
  setSelectedAppointment,
  isEditing,
  setIsEditing,
  editFormData,
  setEditFormData,
  doctors,
  editAvailableSlots,
  editSlotsLoading,
  editSlotsError,
  fetchAppointmentDetail,
  handleEditClick,
  handleEditFormChange,
  handleEditSubmit,
  handleCancelAppointment,
  handleBack,
  navigate,
  dichvus,
  getStatusBadge,
  formatDate,
}) => {
  const [page, setPage] = useState(1);
  const ITEMS_PER_PAGE = 5;
  // Sắp xếp: "Đã đặt" lên đầu, sau đó các trạng thái khác
  const sortedAppointments = [...appointments].sort((a, b) => {
    if (a.maTrangThai === 1 && b.maTrangThai !== 1) return -1;
    if (a.maTrangThai !== 1 && b.maTrangThai === 1) return 1;
    return 0;
  });
  const paginatedAppointments = sortedAppointments.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);
  const totalPages = Math.ceil(sortedAppointments.length / ITEMS_PER_PAGE);

  useEffect(() => { setPage(1); }, [sortedAppointments.length]);

  // Table columns
  const columns = [
    {
      title: 'Bác sĩ',
      dataIndex: 'tenBacSi',
      key: 'tenBacSi',
    },
    {
      title: 'Dịch vụ',
      dataIndex: 'tenDichVu',
      key: 'tenDichVu',
    },
    {
      title: 'Ngày hẹn',
      dataIndex: 'ngayHen',
      key: 'ngayHen',
      render: (ngayHen: string) => formatDate(ngayHen),
    },
    {
      title: 'Giờ',
      key: 'gio',
      render: (_: any, record: Appointment) => `${record.gioBatDau} - ${record.gioKetThuc}`,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'tenTrangThai',
      key: 'tenTrangThai',
      render: (status: string) => <Tag color={statusColor(status)}>{status}</Tag>,
    },
    {
      title: '',
      key: 'actions',
      render: (_: any, record: Appointment) => (
        <Space>
          <Button icon={<EyeOutlined />} onClick={() => fetchAppointmentDetail(record.maLichHen)} />
          {record.maTrangThai === 1 && <Button icon={<EditOutlined />} onClick={() => handleEditClick(record)} />}
          {record.maTrangThai === 1 && <Button icon={<DeleteOutlined />} danger onClick={() => handleCancelAppointment(record)} />}
        </Space>
      ),
    },
  ];

  // Modal for detail/edit
  const detailModal = (
    <Modal
      open={showAppointmentDetail}
      onCancel={handleBack}
      title={isEditing ? 'Chỉnh sửa lịch hẹn' : 'Chi tiết lịch hẹn'}
      footer={null}
      width={700}
    >
      {selectedAppointment && (
        <Card bordered={false}>
          <Descriptions column={2} bordered size="middle">
            <Descriptions.Item label="Bác sĩ">{selectedAppointment.tenBacSi}</Descriptions.Item>
            <Descriptions.Item label="Dịch vụ">{selectedAppointment.tenDichVu}</Descriptions.Item>
            <Descriptions.Item label="Ngày hẹn">{formatDate(selectedAppointment.ngayHen)}</Descriptions.Item>
            <Descriptions.Item label="Giờ">{selectedAppointment.gioBatDau} - {selectedAppointment.gioKetThuc}</Descriptions.Item>
            <Descriptions.Item label="Trạng thái" span={2}>
              <Tag color={statusColor(selectedAppointment.tenTrangThai)}>{selectedAppointment.tenTrangThai}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Ghi chú" span={2}>{selectedAppointment.ghiChu || '-'}</Descriptions.Item>
            {selectedAppointment.lydo && <Descriptions.Item label="Lý do hủy" span={2}>{selectedAppointment.lydo}</Descriptions.Item>}
          </Descriptions>
        </Card>
      )}
    </Modal>
  );

  return (
    <Card
      title="Lịch khám của tôi"
      extra={<Button type="primary" icon={<PlusOutlined />} onClick={() => navigate('/lien-he')}>Đặt lịch mới</Button>}
      style={{ marginBottom: 24 }}
    >
      <Table
        columns={columns}
        dataSource={paginatedAppointments}
        rowKey="maLichHen"
        pagination={false}
        style={{ marginBottom: 16 }}
      />
      <Pagination
        current={page}
        pageSize={ITEMS_PER_PAGE}
        total={sortedAppointments.length}
        onChange={setPage}
        style={{ textAlign: 'right', marginTop: 16 }}
      />
      {detailModal}
    </Card>
  );
};

export default ProfileAppointments; 
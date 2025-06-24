import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Table, Button, Form, Modal, Tag, Input, Select, DatePicker } from 'antd';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';

const { Option } = Select;

const PatientRecords = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const DRAFT_KEY = 'draft_patient_form';

  // Auto-restore form values from localStorage khi mở modal
  useEffect(() => {
    if (isModalVisible) {
      const draft = localStorage.getItem(DRAFT_KEY);
      if (draft) {
        try {
          const values = JSON.parse(draft);
          form.setFieldsValue(values);
        } catch {}
      }
    }
  }, [isModalVisible, form]);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    form.validateFields().then(values => {
      console.log('Form values:', values);
      setIsModalVisible(false);
      form.resetFields();
      localStorage.removeItem(DRAFT_KEY); // Xóa draft khi submit thành công
    });
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const columns = [
    { title: 'Mã BN', dataIndex: 'id', key: 'id' },
    { title: 'Họ và Tên', dataIndex: 'name', key: 'name' },
    { title: 'Ngày Sinh', dataIndex: 'dob', key: 'dob' },
    { title: 'Giới Tính', dataIndex: 'gender', key: 'gender' },
    { title: 'Số Điện Thoại', dataIndex: 'phone', key: 'phone' },
    { title: 'Nhóm Máu', dataIndex: 'bloodType', key: 'bloodType', render: (bloodType: string) => <Tag color={bloodType === 'A' ? 'volcano' : 'geekblue'}>{bloodType}</Tag> },
    { title: 'Lần Khám Cuối', dataIndex: 'lastVisit', key: 'lastVisit' },
    {
      title: 'Thao Tác',
      key: 'action',
      render: () => (
        <Row gutter={8}>
          <Col><Button size="small">Xem Hồ Sơ</Button></Col>
          <Col><Button size="small" type="dashed">Tạo Lịch Hẹn</Button></Col>
          <Col><Button size="small" type="primary">Sửa</Button></Col>
        </Row>
      ),
    },
  ];

  const data = [
    { key: '1', id: 'BN001', name: 'Nguyễn Văn A', dob: '15/05/1985', gender: 'Nam', phone: '0123456789', bloodType: 'A', lastVisit: '15/03/2024' },
    { key: '2', id: 'BN002', name: 'Trần Thị B', dob: '20/08/1990', gender: 'Nữ', phone: '0987654321', bloodType: 'O', lastVisit: '14/03/2024' },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
        <Col><h2>Quản Lý Hồ Sơ Bệnh Nhân</h2></Col>
        <Col>
          <Button type="primary" icon={<PlusOutlined />} onClick={showModal}>
            Thêm Bệnh Nhân Mới
          </Button>
        </Col>
      </Row>

      <Card style={{ marginBottom: 24 }}>
        <Form layout="inline">
          <Form.Item label="Tìm Kiếm">
            <Input placeholder="Tên, số điện thoại..." />
          </Form.Item>
          <Form.Item label="Nhóm Máu">
            <Select placeholder="Tất Cả" style={{ width: 120 }}>
              <Option value="A">A</Option>
              <Option value="B">B</Option>
              <Option value="AB">AB</Option>
              <Option value="O">O</Option>
            </Select>
          </Form.Item>
          <Form.Item label="Độ Tuổi">
            <Select placeholder="Tất Cả" style={{ width: 120 }}>
              <Option value="0-18">0-18</Option>
              <Option value="19-30">19-30</Option>
              <Option value="31-50">31-50</Option>
              <Option value="51+">51+</Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <Button type="default" icon={<SearchOutlined />}>
              Tìm Kiếm
            </Button>
          </Form.Item>
        </Form>
      </Card>

      <Card>
        <Table columns={columns} dataSource={data} bordered />
      </Card>

      <Modal
        title="Thêm Bệnh Nhân Mới"
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        width={800}
        footer={[
          <Button key="back" onClick={handleCancel}>
            Hủy
          </Button>,
          <Button key="submit" type="primary" onClick={handleOk}>
            Thêm Bệnh Nhân
          </Button>,
        ]}
      >
        <Form
          form={form}
          layout="vertical"
          onValuesChange={(_, allValues) => {
            localStorage.setItem(DRAFT_KEY, JSON.stringify(allValues));
          }}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="name" label="Họ và Tên" rules={[{ required: true, message: 'Vui lòng nhập họ và tên!' }]}>
                <Input placeholder="Nhập họ và tên" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="dob" label="Ngày Sinh" rules={[{ required: true, message: 'Vui lòng chọn ngày sinh!' }]}>
                <DatePicker style={{ width: '100%' }} placeholder="Chọn ngày sinh" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="gender" label="Giới Tính" rules={[{ required: true, message: 'Vui lòng chọn giới tính!' }]}>
                <Select placeholder="Chọn giới tính">
                  <Option value="male">Nam</Option>
                  <Option value="female">Nữ</Option>
                  <Option value="other">Khác</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="phone" label="Số Điện Thoại" rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}>
                <Input placeholder="Nhập số điện thoại" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="email" label="Email" rules={[{ type: 'email', message: 'Email không hợp lệ!' }]}>
                <Input placeholder="Nhập email" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="bloodType" label="Nhóm Máu">
                <Select placeholder="Chọn nhóm máu">
                  <Option value="A">A</Option>
                  <Option value="B">B</Option>
                  <Option value="AB">AB</Option>
                  <Option value="O">O</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item name="address" label="Địa Chỉ">
                <Input.TextArea rows={2} placeholder="Nhập địa chỉ" />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item name="medicalHistory" label="Tiền Sử Bệnh">
                <Input.TextArea rows={3} placeholder="Nhập tiền sử bệnh (nếu có)" />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
};

export default PatientRecords; 
import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Form, Input, DatePicker, Select, Button, Table, List, Typography } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;
const { Option } = Select;

const Prescriptions = () => {
  const [form] = Form.useForm();
  const [medicines, setMedicines] = useState([
    { key: 1, name: 'Paracetamol 500mg', dosage: '1 viên', frequency: '2 lần/ngày', duration: '5 ngày', notes: '' },
  ]);
  const DRAFT_KEY = 'draft_prescription';

  // Auto-restore form and medicines from localStorage
  useEffect(() => {
    const draft = localStorage.getItem(DRAFT_KEY);
    if (draft) {
      try {
        const { formValues, medicines: draftMeds } = JSON.parse(draft);
        if (formValues) form.setFieldsValue(formValues);
        if (draftMeds) setMedicines(draftMeds);
      } catch {}
    }
  }, [form]);

  // Auto-save medicines to localStorage when medicines change
  useEffect(() => {
    const formValues = form.getFieldsValue();
    localStorage.setItem(DRAFT_KEY, JSON.stringify({ formValues, medicines }));
  }, [medicines, form]);

  const handleAddMedicine = () => {
    const newKey = medicines.length + 1;
    setMedicines([...medicines, { key: newKey, name: '', dosage: '', frequency: '', duration: '', notes: '' }]);
  };

  const handleRemoveMedicine = (key: number) => {
    setMedicines(medicines.filter(item => item.key !== key));
  };

  const medicineColumns = [
    {
      title: 'Tên Thuốc',
      dataIndex: 'name',
      render: () => (
        <Select placeholder="Chọn thuốc">
          <Option value="Paracetamol 500mg">Paracetamol 500mg</Option>
          <Option value="Amoxicillin 500mg">Amoxicillin 500mg</Option>
          <Option value="Omeprazole 20mg">Omeprazole 20mg</Option>
        </Select>
      ),
    },
    { title: 'Liều Dùng', dataIndex: 'dosage', render: () => <Input placeholder="ví dụ: 1 viên" /> },
    {
      title: 'Tần Suất',
      dataIndex: 'frequency',
      render: () => (
        <Select placeholder="Chọn tần suất">
          <Option value="1 lần/ngày">1 lần/ngày</Option>
          <Option value="2 lần/ngày">2 lần/ngày</Option>
          <Option value="3 lần/ngày">3 lần/ngày</Option>
        </Select>
      ),
    },
    { title: 'Thời Gian', dataIndex: 'duration', render: () => <Input placeholder="ví dụ: 7 ngày" /> },
    { title: 'Ghi Chú', dataIndex: 'notes', render: () => <Input placeholder="Ghi chú" /> },
    {
      title: 'Thao Tác',
      dataIndex: 'action',
      render: (_: any, record: { key: number }) => (
        <Button icon={<DeleteOutlined />} onClick={() => handleRemoveMedicine(record.key)} danger />
      ),
    },
  ];
  
  const recentPrescriptionsColumns = [
    { title: 'Ngày', dataIndex: 'date', key: 'date' },
    { title: 'Bệnh Nhân', dataIndex: 'patient', key: 'patient' },
    { title: 'Thuốc', dataIndex: 'medicines', key: 'medicines' },
    {
      title: 'Thao Tác',
      key: 'action',
      render: () => (
        <Row gutter={8}>
          <Col><Button size="small">Xem</Button></Col>
          <Col><Button type="primary" size="small">In</Button></Col>
        </Row>
      ),
    },
  ];

  const recentData = [
    { key: '1', date: '2024-03-15', patient: 'Nguyễn Văn A', medicines: 'Paracetamol, Amoxicillin' },
    { key: '2', date: '2024-03-14', patient: 'Trần Thị B', medicines: 'Omeprazole, Metformin' },
  ];

  const commonDrugs = [
    { title: 'Paracetamol 500mg', description: 'Thuốc giảm đau, hạ sốt' },
    { title: 'Amoxicillin 500mg', description: 'Kháng sinh điều trị nhiễm khuẩn' },
    { title: 'Omeprazole 20mg', description: 'Thuốc điều trị viêm loét dạ dày' },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Row gutter={24}>
        <Col span={16}>
          <Card>
            <Title level={4}>Tạo Đơn Thuốc Mới</Title>
            <Form
              form={form}
              layout="vertical"
              onValuesChange={(_, allValues) => {
                localStorage.setItem(DRAFT_KEY, JSON.stringify({ formValues: allValues, medicines }));
              }}
              onFinish={() => {
                localStorage.removeItem(DRAFT_KEY);
              }}
            >
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item label="Mã Bệnh Nhân">
                    <Input value="BN001" readOnly />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Tên Bệnh Nhân">
                    <Input value="Nguyễn Văn A" readOnly />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Ngày">
                    <DatePicker style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Bác Sĩ">
                    <Input value="Bs. Vũ" readOnly />
                  </Form.Item>
                </Col>
              </Row>
              
              <Title level={5} style={{ marginTop: 16 }}>Danh sách thuốc</Title>
              <Table
                columns={medicineColumns}
                dataSource={medicines}
                pagination={false}
                bordered
                size="small"
              />
              <Button
                type="dashed"
                onClick={handleAddMedicine}
                icon={<PlusOutlined />}
                style={{ width: '100%', marginTop: 16 }}
              >
                Thêm Thuốc
              </Button>

              <Form.Item label="Hướng Dẫn Sử Dụng" style={{ marginTop: 24 }}>
                <Input.TextArea rows={3} placeholder="Hướng dẫn chi tiết cho bệnh nhân" />
              </Form.Item>

              <Row gutter={16} style={{ marginTop: 24 }}>
                <Col>
                  <Button type="primary" htmlType="submit">Lưu Đơn Thuốc</Button>
                </Col>
                <Col>
                  <Button>In Đơn Thuốc</Button>
                </Col>
              </Row>
            </Form>
          </Card>
        </Col>
        <Col span={8}>
          <Card style={{ marginBottom: 24 }}>
            <Title level={5}>Đơn Thuốc Gần Đây</Title>
            <Table
              columns={recentPrescriptionsColumns}
              dataSource={recentData}
              pagination={{ pageSize: 5 }}
              size="small"
            />
          </Card>
          <Card>
            <Title level={5}>Thuốc Thường Dùng</Title>
            <List
              itemLayout="horizontal"
              dataSource={commonDrugs}
              renderItem={item => (
                <List.Item>
                  <List.Item.Meta
                    title={<Text strong>{item.title}</Text>}
                    description={item.description}
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Prescriptions; 
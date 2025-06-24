import React, { useEffect } from 'react';
import { Row, Col, Card, Form, Input, Button, Descriptions, InputNumber, Table, List, Typography } from 'antd';
import { Link } from 'react-router-dom';

const { Title, Text } = Typography;

const MedicalExamination = () => {
  const [form] = Form.useForm();
  const DRAFT_KEY = 'draft_medical_exam';
  
  const historyColumns = [
    { title: 'Ngày', dataIndex: 'date', key: 'date' },
    { title: 'Chẩn Đoán', dataIndex: 'diagnosis', key: 'diagnosis' },
    { title: 'Điều Trị', dataIndex: 'treatment', key: 'treatment' },
  ];
  
  const historyData = [
    { key: '1', date: '2024-03-15', diagnosis: 'Cao Huyết Áp', treatment: 'Kê đơn thuốc' },
    { key: '2', date: '2024-02-28', diagnosis: 'Cảm Cúm', treatment: 'Nghỉ ngơi và uống nhiều nước' },
  ];

  const allergies = ['Penicillin', 'Sulfa'];
  const currentMedications = ['Lisinopril 10mg mỗi ngày', 'Aspirin 81mg mỗi ngày'];

  // Auto-restore form values from localStorage
  useEffect(() => {
    const draft = localStorage.getItem(DRAFT_KEY);
    if (draft) {
      try {
        const values = JSON.parse(draft);
        form.setFieldsValue(values);
      } catch {}
    }
  }, [form]);

  return (
    <div style={{ padding: 24 }}>
      <Row gutter={24}>
        <Col span={16}>
          <Card>
            <Title level={4}>Thông Tin Khám Bệnh</Title>
            <Form
              form={form}
              layout="vertical"
              onValuesChange={(_, allValues) => {
                localStorage.setItem(DRAFT_KEY, JSON.stringify(allValues));
              }}
              onFinish={() => {
                // Khi submit thành công, xóa draft
                localStorage.removeItem(DRAFT_KEY);
              }}
            >
              <Descriptions bordered column={2} style={{ marginBottom: 24 }}>
                <Descriptions.Item label="Mã Bệnh Nhân">BN001</Descriptions.Item>
                <Descriptions.Item label="Tên">Nguyễn Văn A</Descriptions.Item>
                <Descriptions.Item label="Tuổi">45</Descriptions.Item>
                <Descriptions.Item label="Giới Tính">Nam</Descriptions.Item>
              </Descriptions>

              <Title level={5}>Dấu Hiệu Sinh Tồn</Title>
              <Row gutter={16}>
                <Col span={6}>
                  <Form.Item label="Huyết Áp">
                    <Input placeholder="ví dụ: 120/80" />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item label="Nhịp Tim">
                    <InputNumber placeholder="lần/phút" style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item label="Nhiệt Độ">
                    <InputNumber placeholder="°C" style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item label="Cân Nặng">
                    <InputNumber placeholder="kg" style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
              </Row>

              <Title level={5} style={{ marginTop: 16 }}>Ghi Chú Khám Bệnh</Title>
              <Form.Item label="Lý Do Khám">
                <Input.TextArea rows={2} placeholder="Lý do chính bệnh nhân đến khám" />
              </Form.Item>
              <Form.Item label="Tiền Sử Bệnh">
                <Input.TextArea rows={3} placeholder="Mô tả chi tiết các triệu chứng" />
              </Form.Item>
              <Form.Item label="Khám Lâm Sàng">
                <Input.TextArea rows={3} placeholder="Kết quả khám lâm sàng" />
              </Form.Item>
              <Form.Item label="Chẩn Đoán">
                <Input.TextArea rows={2} placeholder="Chẩn đoán hoặc nhận định" />
              </Form.Item>
              <Form.Item label="Kế Hoạch Điều Trị">
                <Input.TextArea rows={2} placeholder="Kế hoạch điều trị và khuyến nghị" />
              </Form.Item>

              <Row gutter={16} style={{ marginTop: 24 }}>
                <Col>
                  <Button type="primary" htmlType="submit">Lưu Kết Quả Khám</Button>
                </Col>
                <Col>
                  <Link to="/dashboard/prescriptions">
                    <Button>Tạo Đơn Thuốc</Button>
                  </Link>
                </Col>
              </Row>
            </Form>
          </Card>
        </Col>
        <Col span={8}>
          <Card style={{ marginBottom: 24 }}>
            <Title level={5}>Tiền Sử Bệnh</Title>
            <Table
              columns={historyColumns}
              dataSource={historyData}
              pagination={false}
              size="small"
              bordered
            />
          </Card>
          <Card style={{ marginBottom: 24 }}>
            <Title level={5}>Dị Ứng</Title>
            <List
              dataSource={allergies}
              renderItem={item => <List.Item>{item}</List.Item>}
              size="small"
              bordered
            />
          </Card>
          <Card>
            <Title level={5}>Thuốc Đang Dùng</Title>
            <List
              dataSource={currentMedications}
              renderItem={item => <List.Item>{item}</List.Item>}
              size="small"
              bordered
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default MedicalExamination; 
import React, { useEffect } from 'react';
import { Card, Descriptions, Button, Form, Input, Select } from 'antd';
import { EditOutlined, SaveOutlined } from '@ant-design/icons';
import { ProfileInfoCardProps } from './types';

const { Option } = Select;

const ProfileInfoCard: React.FC<ProfileInfoCardProps> = ({ userInfo, isEditingProfile, setIsEditingProfile, setUserInfo, handleUpdateProfile }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (isEditingProfile && userInfo) {
      form.setFieldsValue(userInfo);
    }
  }, [isEditingProfile, userInfo, form]);

  if (!userInfo) return null;

  return (
    <Card
      title="Thông tin cá nhân"
      extra={
        <Button
          type={isEditingProfile ? 'primary' : 'default'}
          icon={isEditingProfile ? <SaveOutlined /> : <EditOutlined />}
          onClick={() => {
            if (isEditingProfile) {
              handleUpdateProfile();
            } else {
              setIsEditingProfile(true);
              form.setFieldsValue(userInfo);
            }
          }}
        >
          {isEditingProfile ? 'Lưu thay đổi' : 'Chỉnh sửa'}
        </Button>
      }
      style={{ marginBottom: 24 }}
    >
      {isEditingProfile ? (
        <Form
          form={form}
          layout="vertical"
          onValuesChange={(_, allValues) => setUserInfo({ ...userInfo, ...allValues })}
        >
          <div className="row g-4">
            <div className="col-md-6">
              <Form.Item label="Họ và tên" name="hoTen" rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}><Input /></Form.Item>
              <Form.Item label="Số điện thoại" name="soDienThoai" rules={[{ required: true, message: 'Vui lòng nhập số điện thoại' }]}><Input /></Form.Item>
              <Form.Item label="Email" name="email" rules={[{ required: true, message: 'Vui lòng nhập email' }]}><Input /></Form.Item>
              <Form.Item label="Địa chỉ" name="diaChi"><Input.TextArea rows={2} /></Form.Item>
            </div>
            <div className="col-md-6">
              <Form.Item label="Ngày sinh" name="ngaySinh" rules={[{ required: true, message: 'Vui lòng nhập ngày sinh' }]}><Input type="date" /></Form.Item>
              <Form.Item label="Giới tính" name="gioiTinh" rules={[{ required: true, message: 'Vui lòng chọn giới tính' }]}>
                <Select>
                  <Option value="Nam">Nam</Option>
                  <Option value="Nữ">Nữ</Option>
                  <Option value="Khác">Khác</Option>
                </Select>
              </Form.Item>
              <Form.Item label="Tiền sử bệnh" name="tienSuBenh"><Input.TextArea rows={2} /></Form.Item>
              <Form.Item label="Dị ứng" name="diUng"><Input.TextArea rows={2} /></Form.Item>
            </div>
          </div>
        </Form>
      ) : (
        <Descriptions column={2} bordered size="middle">
          <Descriptions.Item label="Họ và tên">{userInfo.hoTen}</Descriptions.Item>
          <Descriptions.Item label="Số điện thoại">{userInfo.soDienThoai}</Descriptions.Item>
          <Descriptions.Item label="Email">{userInfo.email}</Descriptions.Item>
          <Descriptions.Item label="Địa chỉ">{userInfo.diaChi}</Descriptions.Item>
          <Descriptions.Item label="Ngày sinh">{userInfo.ngaySinh}</Descriptions.Item>
          <Descriptions.Item label="Giới tính">{userInfo.gioiTinh}</Descriptions.Item>
          <Descriptions.Item label="Tiền sử bệnh">{userInfo.tienSuBenh || '-'}</Descriptions.Item>
          <Descriptions.Item label="Dị ứng">{userInfo.diUng || '-'}</Descriptions.Item>
        </Descriptions>
      )}
    </Card>
  );
};

export default ProfileInfoCard; 
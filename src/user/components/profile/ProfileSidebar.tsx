import React from 'react';
import { Layout, Menu, Avatar } from 'antd';
import { UserOutlined, CalendarOutlined, FileTextOutlined, CreditCardOutlined } from '@ant-design/icons';
import { ProfileSidebarProps } from './types';

const { Sider } = Layout;

const ProfileSidebar: React.FC<ProfileSidebarProps> = ({ userInfo, activeTab, setActiveTab }) => (
  <Sider width={250} style={{ background: '#fff', minHeight: '100vh', boxShadow: '2px 0 8px #f0f1f2' }}>
    <div style={{ textAlign: 'center', padding: '32px 0 16px 0' }}>
      <Avatar size={80} icon={<UserOutlined />} style={{ backgroundColor: '#1677ff', marginBottom: 12 }} />
      <div style={{ fontWeight: 600, fontSize: 18 }}>{userInfo.hoTen}</div>
      <div style={{ color: '#888', fontSize: 13 }}>{userInfo.email}</div>
    </div>
    <Menu
      mode="inline"
      selectedKeys={[activeTab]}
      onClick={({ key }) => setActiveTab(key as string)}
      style={{ borderRight: 0, fontSize: 16 }}
      items={[
        {
          key: 'profile',
          icon: <UserOutlined />,
          label: 'Thông tin cá nhân',
        },
        {
          key: 'appointments',
          icon: <CalendarOutlined />,
          label: 'Lịch khám',
        },
        {
          key: 'medicalRecords',
          icon: <FileTextOutlined />,
          label: 'Bệnh án',
        },
        {
          key: 'invoices',
          icon: <CreditCardOutlined />,
          label: 'Hóa đơn',
        },
      ]}
    />
  </Sider>
);

export default ProfileSidebar; 
import { useState } from 'react';
import { Edit, User, Phone, Mail, MapPin, Calendar, FileText } from 'lucide-react';
import { UserInfo } from '../../types';
import { ProfileField } from './ProfileField';

interface ProfileSectionProps {
  userInfo: UserInfo;
  onUserInfoChange: (userInfo: UserInfo) => void;
}

export const ProfileSection = ({ userInfo, onUserInfoChange }: ProfileSectionProps) => {
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    setIsEditing(false);
    // Here you would typically save to backend
  };

  const updateField = (field: keyof UserInfo, value: string) => {
    onUserInfoChange({
      ...userInfo,
      [field]: value
    });
  };

  return (
    <div className="card shadow-sm">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h3 className="card-title mb-0">Thông tin cá nhân</h3>
          <button
            onClick={() => isEditing ? handleSave() : setIsEditing(true)}
            className="btn btn-primary d-flex align-items-center"
          >
            <Edit size={16} className="me-2" />
            {isEditing ? 'Lưu thay đổi' : 'Chỉnh sửa'}
          </button>
        </div>

        <div className="row g-4">
          <div className="col-md-6">
            <ProfileField
              label="Họ và tên"
              value={userInfo.name}
              icon={<User size={16} className="text-muted" />}
              isEditing={isEditing}
              onChange={(value) => updateField('name', value)}
            />
            
            <ProfileField
              label="Số điện thoại"
              value={userInfo.phone}
              icon={<Phone size={16} className="text-muted" />}
              isEditing={isEditing}
              type="tel"
              onChange={(value) => updateField('phone', value)}
            />
            
            <ProfileField
              label="Email"
              value={userInfo.email}
              icon={<Mail size={16} className="text-muted" />}
              isEditing={isEditing}
              type="email"
              onChange={(value) => updateField('email', value)}
            />
            
            <ProfileField
              label="Địa chỉ"
              value={userInfo.address}
              icon={<MapPin size={16} className="text-muted" />}
              isEditing={isEditing}
              type="textarea"
              onChange={(value) => updateField('address', value)}
            />
          </div>

          <div className="col-md-6">
            <ProfileField
              label="Ngày sinh"
              value={userInfo.dateOfBirth}
              icon={<Calendar size={16} className="text-muted" />}
              isEditing={isEditing}
              type="date"
              onChange={(value) => updateField('dateOfBirth', value)}
            />
            
            <ProfileField
              label="Giới tính"
              value={userInfo.gender}
              icon={<User size={16} className="text-muted" />}
              isEditing={isEditing}
              type="select"
              options={[
                { value: 'Nam', label: 'Nam' },
                { value: 'Nữ', label: 'Nữ' },
                { value: 'Khác', label: 'Khác' }
              ]}
              onChange={(value) => updateField('gender', value)}
            />
            
            <ProfileField
              label="Liên hệ khẩn cấp"
              value={userInfo.emergencyContact}
              icon={<Phone size={16} className="text-muted" />}
              isEditing={isEditing}
              onChange={(value) => updateField('emergencyContact', value)}
            />
            
            <ProfileField
              label="Số BHYT"
              value={userInfo.insuranceNumber}
              icon={<FileText size={16} className="text-muted" />}
              isEditing={isEditing}
              onChange={(value) => updateField('insuranceNumber', value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
// Main UserProfile component
import { useState } from 'react';
import { UserInfo, Appointment } from '../types';

// Components - đã chuyển vào các thư mục con tương ứng
import {UserCard} from '../components/user/UserCard';
import {Navigation} from '../components/layout/Navigation';
import {ProfileSection} from '../components/user/ProfileSection';
import {AppointmentsSection} from '../components/appointment/AppointmentsSection';

const UserProfile = () => {
  const [activeTab, setActiveTab] = useState('profile');
  
  const [userInfo, setUserInfo] = useState<UserInfo>({
    name: "Nguyễn Văn An",
    phone: "0123-456-789",
    email: "nguyenvanan@gmail.com",
    address: "123 Đường Lê Lợi, Quận 1, TP.HCM",
    dateOfBirth: "15/03/1990",
    gender: "Nam",
    emergencyContact: "Nguyễn Thị Bình - 0987-654-321",
    insuranceNumber: "BH123456789"
  });

  const [appointments] = useState<Appointment[]>([
    {
      id: "1",
      doctorName: "BS. Trần Minh Hoàng",
      specialty: "Tim mạch",
      date: "2024-06-15",
      time: "09:00",
      status: "upcoming",
      location: "Phòng khám Tim mạch - Tầng 3",
      reason: "Khám định kỳ",
      notes: "Mang theo kết quả xét nghiệm máu"
    },
    // ... other appointments
  ]);

  return (
    <div className="bg-light" style={{minHeight: '100vh'}}>
      <div className="container-fluid py-4">
        <div className="row g-4">
          {/* Sidebar */}
          <div className="col-lg-3">
            <UserCard userInfo={userInfo} />
            <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
          </div>

          {/* Main Content */}
          <div className="col-lg-9">
            {activeTab === 'profile' && (
              <ProfileSection 
                userInfo={userInfo} 
                onUserInfoChange={setUserInfo} 
              />
            )}
            {activeTab === 'appointments' && (
              <AppointmentsSection appointments={appointments} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
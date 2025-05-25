import { Calendar, User } from 'lucide-react';

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const Navigation = ({ activeTab, onTabChange }: NavigationProps) => {
  return (
    <div className="card shadow-sm">
      <div className="card-body">
        <nav className="nav flex-column">
          <button
            onClick={() => onTabChange('profile')}
            className={`nav-link d-flex align-items-center py-3 px-3 mb-2 rounded ${
              activeTab === 'profile' ? 'bg-primary text-white' : 'text-dark'
            }`}
            style={{border: 'none'}}
          >
            <User size={20} className="me-3" />
            Thông tin cá nhân
          </button>
          <button
            onClick={() => onTabChange('appointments')}
            className={`nav-link d-flex align-items-center py-3 px-3 mb-2 rounded ${
              activeTab === 'appointments' ? 'bg-primary text-white' : 'text-dark'
            }`}
            style={{border: 'none'}}
          >
            <Calendar size={20} className="me-3" />
            Lịch khám
          </button>
        </nav>
      </div>
    </div>
  );
};

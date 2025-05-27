import { User } from 'lucide-react';
import { UserInfo } from '../../types';

interface UserCardProps {
  userInfo: UserInfo;
}

export const UserCard = ({ userInfo }: UserCardProps) => {
  return (
    <div className="card shadow-sm mb-4">
      <div className="card-body text-center">
        <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3" 
             style={{width: '80px', height: '80px'}}>
          <User size={40} className="text-white" />
        </div>
        <h5 className="card-title mb-1">{userInfo.name}</h5>
        <p className="card-text text-muted small">{userInfo.email}</p>
      </div>
    </div>
  );
};
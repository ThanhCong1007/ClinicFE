import { Appointment } from '../../types';

interface AppointmentStatsProps {
  appointments: Appointment[];
}

export const AppointmentStats = ({ appointments }: AppointmentStatsProps) => {
  const upcomingCount = appointments.filter(a => a.status === 'upcoming').length;
  const completedCount = appointments.filter(a => a.status === 'completed').length;
  const cancelledCount = appointments.filter(a => a.status === 'cancelled').length;

  return (
    <div className="row g-3">
      <div className="col-md-4">
        <div className="card bg-primary text-white">
          <div className="card-body">
            <h6 className="card-title">Lịch sắp tới</h6>
            <h2 className="card-text">{upcomingCount}</h2>
          </div>
        </div>
      </div>
      <div className="col-md-4">
        <div className="card bg-success text-white">
          <div className="card-body">
            <h6 className="card-title">Đã hoàn thành</h6>
            <h2 className="card-text">{completedCount}</h2>
          </div>
        </div>
      </div>
      <div className="col-md-4">
        <div className="card bg-danger text-white">
          <div className="card-body">
            <h6 className="card-title">Đã hủy</h6>
            <h2 className="card-text">{cancelledCount}</h2>
          </div>
        </div>
      </div>
    </div>
  );
};

import { Calendar } from 'lucide-react';
import { Appointment } from '../../types';
import { AppointmentStats } from './AppointmentStats';
import { AppointmentCard } from './AppointmentCard';

interface AppointmentsSectionProps {
  appointments: Appointment[];
}

export const AppointmentsSection = ({ appointments }: AppointmentsSectionProps) => {
  const upcomingAppointments = appointments.filter(apt => apt.status === 'upcoming');
  const pastAppointments = appointments.filter(apt => apt.status !== 'upcoming');

  return (
    <div>
      {/* Header */}
      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h3 className="card-title mb-0">Lịch khám của tôi</h3>
            <button className="btn btn-success d-flex align-items-center">
              <Calendar size={16} className="me-2" />
              Đặt lịch mới
            </button>
          </div>
          <AppointmentStats appointments={appointments} />
        </div>
      </div>

      {/* Upcoming Appointments */}
      {upcomingAppointments.length > 0 && (
        <div className="card shadow-sm mb-4">
          <div className="card-body">
            <h4 className="card-title mb-4">Lịch khám sắp tới</h4>
            {upcomingAppointments.map((appointment) => (
              <AppointmentCard 
                key={appointment.id} 
                appointment={appointment} 
                showActions={true}
              />
            ))}
          </div>
        </div>
      )}

      {/* Past Appointments */}
      {pastAppointments.length > 0 && (
        <div className="card shadow-sm">
          <div className="card-body">
            <h4 className="card-title mb-4">Lịch sử khám bệnh</h4>
            {pastAppointments.map((appointment) => (
              <AppointmentCard 
                key={appointment.id} 
                appointment={appointment} 
                showActions={false}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
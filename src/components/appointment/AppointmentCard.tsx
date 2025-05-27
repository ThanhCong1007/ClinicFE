import { Calendar, Clock, MapPin, Eye, Edit, Trash2 } from 'lucide-react';
import { Appointment } from '../../types';

interface AppointmentCardProps {
  appointment: Appointment;
  showActions?: boolean;
}

export const AppointmentCard = ({ appointment, showActions = true }: AppointmentCardProps) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'upcoming': return 'badge bg-primary';
      case 'completed': return 'badge bg-success';
      case 'cancelled': return 'badge bg-danger';
      default: return 'badge bg-secondary';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'upcoming': return 'Sắp tới';
      case 'completed': return 'Đã khám';
      case 'cancelled': return 'Đã hủy';
      default: return status;
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('vi-VN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className={`card mb-3 border ${appointment.status !== 'upcoming' ? 'opacity-75' : ''}`}>
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-start">
          <div className="flex-grow-1">
            <div className="d-flex align-items-center mb-2">
              <h5 className="mb-0 me-3">{appointment.doctorName}</h5>
              <span className={getStatusBadge(appointment.status)}>
                {getStatusText(appointment.status)}
              </span>
            </div>
            <p className="text-muted mb-2">{appointment.specialty}</p>
            <div className="row g-3 text-muted small mb-2">
              <div className="col-md-4 d-flex align-items-center">
                <Calendar size={16} className="me-2" />
                {formatDate(appointment.date)}
              </div>
              <div className="col-md-4 d-flex align-items-center">
                <Clock size={16} className="me-2" />
                {appointment.time}
              </div>
              <div className="col-md-4 d-flex align-items-center">
                <MapPin size={16} className="me-2" />
                {appointment.location}
              </div>
            </div>
            <p className="mb-1">
              <strong>Lý do khám:</strong> {appointment.reason}
            </p>
            {appointment.notes && (
              <p className="text-primary mb-0">
                <strong>Ghi chú:</strong> {appointment.notes}
              </p>
            )}
          </div>
          {showActions && (
            <div className="d-flex">
              <button className="btn btn-outline-primary btn-sm me-2">
                <Eye size={16} />
              </button>
              {appointment.status === 'upcoming' && (
                <>
                  <button className="btn btn-outline-success btn-sm me-2">
                    <Edit size={16} />
                  </button>
                  <button className="btn btn-outline-danger btn-sm">
                    <Trash2 size={16} />
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export interface UserInfo {
  name: string;
  phone: string;
  email: string;
  address: string;
  dateOfBirth: string;
  gender: string;
  emergencyContact: string;
  insuranceNumber: string;
}

export interface Appointment {
  id: string;
  doctorName: string;
  specialty: string;
  date: string;
  time: string;
  status: 'upcoming' | 'completed' | 'cancelled';
  location: string;
  reason: string;
  notes?: string;
}

import { Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Appointments from './pages/Appointments';
import Patients from './pages/Patients';
import Examination from './pages/Examination';

export default function DashboardLayout() {
  return (
    <div className="flex-grow-1">
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/appointments" element={<Appointments />} />
        <Route path="/patients" element={<Patients />} />
        <Route path="/examination" element={<Examination />} />
        <Route path="/examination/:maLichHen" element={<Examination />} />
      </Routes>
    </div>
  );
} 
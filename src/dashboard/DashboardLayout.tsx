import { Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Appointments from './pages/Appointments';
import PatientRecords from './pages/PatientRecords';
import Layout from './components/Layout';

function DashboardLayout() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="appointments" element={<Appointments />} />
        <Route path="patients" element={<PatientRecords />} />
      </Route>
    </Routes>
  );
}

export default DashboardLayout; 
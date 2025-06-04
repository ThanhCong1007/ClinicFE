import { useEffect, useState } from 'react';
import { getDoctorAppointments, getPatientMedicalRecords } from './Appointments';

interface MedicalRecord {
  maBenhAn: string;
  ngayTao: string;
  maLichHen: string;
  maBacSi: string;
  tenBacSi: string;
  maBenhNhan: string;
  tenBenhNhan: string;
  soDienThoai: string;
  lyDoKham: string;
  chanDoan: string;
  ghiChuDieuTri: string;
  ngayTaiKham: string | null;
}

interface PatientData {
  appointments: Array<{
    maBenhNhan: string;
    tenBenhNhan: string;
    soDienThoaiBenhNhan: string;
  }>;
  records: MedicalRecord[];
}

interface Patients {
  [key: string]: PatientData;
}

interface Appointment {
  maLichHen: number;
  maBenhNhan: number;
  tenBenhNhan: string;
  soDienThoaiBenhNhan: string;
  coBenhAn: boolean;
}

export default function Patients() {
  const [patients, setPatients] = useState<Patients>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userData = JSON.parse(localStorage.getItem('user') || '{}');
        const maBacSi = userData.maBacSi;
        
        if (!maBacSi) {
          throw new Error('Không tìm thấy thông tin bác sĩ');
        }

        // Get all appointments
        const appointments = await getDoctorAppointments(maBacSi);
        
        // Group appointments by patient
        const patientsMap: Patients = {};
        
        for (const appointment of appointments) {
          const maBenhNhan = appointment.maBenhNhan.toString();
          if (!patientsMap[maBenhNhan]) {
            patientsMap[maBenhNhan] = {
              appointments: [],
              records: []
            };
          }
          patientsMap[maBenhNhan].appointments.push({
            ...appointment,
            maBenhNhan: maBenhNhan
          });
          
          // If patient has medical records, fetch them
          if (appointment.coBenhAn) {
            const records = await getPatientMedicalRecords(appointment.maBenhNhan);
            const processedRecords = records.map(record => ({
              ...record,
              maBenhAn: record.maBenhAn.toString(),
              maLichHen: record.maLichHen?.toString() || '',
              maBacSi: record.maBacSi.toString(),
              maBenhNhan: record.maBenhNhan.toString()
            }));
            patientsMap[maBenhNhan].records = processedRecords;
          }
        }
        
        setPatients(patientsMap);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Có lỗi xảy ra khi tải dữ liệu');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredPatients = Object.entries(patients).filter(([_, data]) => {
    const patientName = data.appointments[0]?.tenBenhNhan.toLowerCase() || '';
    const searchLower = searchTerm.toLowerCase();
    return patientName.includes(searchLower);
  });

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger m-3" role="alert">
        {error}
      </div>
    );
  }

  return (
    <div className="container-fluid p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Danh sách bệnh nhân</h2>
        <div className="col-md-4">
          <input
            type="text"
            className="form-control"
            placeholder="Tìm kiếm bệnh nhân..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="row">
        {/* Left column - Patient list */}
        <div className="col-md-4">
          <div className="list-group">
            {filteredPatients.map(([maBenhNhan, data]) => {
              const patient = data.appointments[0];
              return (
                <button
                  key={maBenhNhan}
                  className={`list-group-item list-group-item-action d-flex justify-content-between align-items-center ${selectedPatient === maBenhNhan ? 'active' : ''}`}
                  onClick={() => setSelectedPatient(maBenhNhan)}
                >
                  <div>
                    <strong>{patient.tenBenhNhan}</strong>
                    <div className="text-muted small">{patient.soDienThoaiBenhNhan}</div>
                  </div>
                  <span className="badge bg-primary rounded-pill">
                    {data.records.length} bệnh án
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right column - Medical records */}
        <div className="col-md-8">
          {selectedPatient ? (
            <div>
              <h4 className="mb-4">Lịch sử khám bệnh</h4>
              {patients[selectedPatient].records.length === 0 ? (
                <div className="alert alert-info">
                  Chưa có bệnh án nào
                </div>
              ) : (
                <div className="row">
                  {patients[selectedPatient].records.map((record) => (
                    <div key={record.maBenhAn} className="col-md-6 mb-4">
                      <div className="card h-100">
                        <div className="card-header d-flex justify-content-between align-items-center">
                          <h5 className="mb-0">Ngày khám: {new Date(record.ngayTao).toLocaleDateString()}</h5>
                          <button
                            className="btn btn-primary btn-sm"
                            onClick={() => window.location.href = `/dashboard/records/${record.maBenhAn}`}
                          >
                            Chi tiết
                          </button>
                        </div>
                        <div className="card-body">
                          <p><strong>Lý do khám:</strong> {record.lyDoKham}</p>
                          <p><strong>Chẩn đoán:</strong> {record.chanDoan}</p>
                          <p><strong>Điều trị:</strong> {record.ghiChuDieuTri}</p>
                          <p><strong>Ngày tái khám:</strong> {record.ngayTaiKham || '-'}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="text-center text-muted mt-5">
              <i className="fas fa-user-md fa-3x mb-3"></i>
              <h4>Chọn bệnh nhân để xem lịch sử khám bệnh</h4>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 
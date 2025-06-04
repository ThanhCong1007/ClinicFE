import { useEffect, useState } from 'react';
import { getDoctorAppointments, getPatientMedicalRecords } from './Appointments';

interface MedicalRecord {
  maBenhAn: number;
  ngayTao: string;
  maLichHen: number | null;
  maBacSi: number;
  tenBacSi: string;
  maBenhNhan: number;
  tenBenhNhan: string;
  soDienThoai: string;
  lyDoKham: string;
  chanDoan: string;
  ghiChuDieuTri: string;
  ngayTaiKham: string | null;
}

interface Appointment {
  maLichHen: number;
  maBenhNhan: number;
  tenBenhNhan: string;
  soDienThoaiBenhNhan: string;
  coBenhAn: boolean;
}

export default function Patients() {
  const [patients, setPatients] = useState<{ [key: number]: { appointments: Appointment[], records: MedicalRecord[] } }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

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
        const patientsMap: { [key: number]: { appointments: Appointment[], records: MedicalRecord[] } } = {};
        
        for (const appointment of appointments) {
          if (!patientsMap[appointment.maBenhNhan]) {
            patientsMap[appointment.maBenhNhan] = {
              appointments: [],
              records: []
            };
          }
          patientsMap[appointment.maBenhNhan].appointments.push(appointment);
          
          // If patient has medical records, fetch them
          if (appointment.coBenhAn) {
            const records = await getPatientMedicalRecords(appointment.maBenhNhan);
            patientsMap[appointment.maBenhNhan].records = records;
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

      {filteredPatients.length === 0 ? (
        <div className="alert alert-info">
          Không tìm thấy bệnh nhân nào
        </div>
      ) : (
        <div className="accordion" id="patientsAccordion">
          {filteredPatients.map(([maBenhNhan, data]) => {
            const patient = data.appointments[0];
            return (
              <div className="accordion-item" key={maBenhNhan}>
                <h2 className="accordion-header">
                  <button
                    className="accordion-button collapsed"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target={`#patient${maBenhNhan}`}
                  >
                    <div className="d-flex justify-content-between align-items-center w-100 me-3">
                      <div>
                        <strong>{patient.tenBenhNhan}</strong>
                        <span className="ms-3 text-muted">{patient.soDienThoaiBenhNhan}</span>
                      </div>
                      <span className="badge bg-primary">
                        {data.records.length} bệnh án
                      </span>
                    </div>
                  </button>
                </h2>
                <div
                  id={`patient${maBenhNhan}`}
                  className="accordion-collapse collapse"
                  data-bs-parent="#patientsAccordion"
                >
                  <div className="accordion-body">
                    <h5 className="mb-3">Lịch sử khám bệnh</h5>
                    {data.records.length === 0 ? (
                      <div className="alert alert-info">
                        Chưa có bệnh án nào
                      </div>
                    ) : (
                      <div className="table-responsive">
                        <table className="table table-striped">
                          <thead>
                            <tr>
                              <th>Ngày khám</th>
                              <th>Lý do khám</th>
                              <th>Chẩn đoán</th>
                              <th>Điều trị</th>
                              <th>Ngày tái khám</th>
                              <th>Thao tác</th>
                            </tr>
                          </thead>
                          <tbody>
                            {data.records.map((record) => (
                              <tr key={record.maBenhAn}>
                                <td>{new Date(record.ngayTao).toLocaleDateString()}</td>
                                <td>{record.lyDoKham}</td>
                                <td>{record.chanDoan}</td>
                                <td>{record.ghiChuDieuTri}</td>
                                <td>{record.ngayTaiKham || '-'}</td>
                                <td>
                                  <button
                                    className="btn btn-primary btn-sm"
                                    onClick={() => window.location.href = `/dashboard/records/${record.maBenhAn}`}
                                  >
                                    Chi tiết
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
} 
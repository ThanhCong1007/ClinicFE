import { useEffect, useState, useCallback } from 'react';
import { getDoctorAppointments, getPatientMedicalRecords } from './Appointments';
import axios from 'axios';
import debounce from 'lodash/debounce';
import NotificationModal from '../components/NotificationModal';

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
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<string | null>(null);
  const [notification, setNotification] = useState<{show: boolean, title: string, message: string, type: 'success'|'error'|'info'}>({show: false, title: '', message: '', type: 'info'});

  const searchPatient = async (searchValue: string) => {
    try {
      setSearching(true);
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Không tìm thấy token xác thực');

      // If search value is a phone number (contains only digits)
      if (/^\d+$/.test(searchValue)) {
        try {
          const response = await axios.get(
            `http://localhost:8080/api/tham-kham/benh-nhan/sdt/${searchValue}`,
            {
              headers: {
                'Authorization': `Bearer ${token}`
              }
            }
          );
          
          if (response.data && Array.isArray(response.data)) {
            const patientsMap: Patients = {};
            
            // Process each patient in the array
            for (const patient of response.data) {
              if (patient.maBenhNhan) {
                // Fetch medical records for each patient
                try {
                  const records = await getPatientMedicalRecords(patient.maBenhNhan);
                  const processedRecords = records.map((record: MedicalRecord) => ({
                    ...record,
                    maBenhAn: record.maBenhAn.toString(),
                    maLichHen: record.maLichHen?.toString() || '',
                    maBacSi: record.maBacSi.toString(),
                    maBenhNhan: record.maBenhNhan.toString()
                  }));

                  patientsMap[patient.maBenhNhan] = {
                    appointments: [{
                      maBenhNhan: patient.maBenhNhan.toString(),
                      tenBenhNhan: patient.hoTen || '',
                      soDienThoaiBenhNhan: patient.soDienThoai || ''
                    }],
                    records: processedRecords
                  };
                } catch (recordError) {
                  console.error('Error fetching records for patient:', patient.maBenhNhan, recordError);
                  // Still add the patient even if we can't get their records
                  patientsMap[patient.maBenhNhan] = {
                    appointments: [{
                      maBenhNhan: patient.maBenhNhan.toString(),
                      tenBenhNhan: patient.hoTen || '',
                      soDienThoaiBenhNhan: patient.soDienThoai || ''
                    }],
                    records: []
                  };
                }
              }
            }
            
            setPatients(patientsMap);
            if (response.data.length === 0) {
              setNotification({show: true, title: 'Không tìm thấy', message: 'Không tìm thấy bệnh nhân với số điện thoại này', type: 'info'});
            }
          }
        } catch (apiError: any) {
          if (apiError.response?.status === 404) {
            setNotification({show: true, title: 'Không tìm thấy', message: 'Không tìm thấy bệnh nhân với số điện thoại này', type: 'info'});
            // Reset patients list to empty
            setPatients({});
          } else {
            setNotification({show: true, title: 'Lỗi', message: 'Có lỗi xảy ra khi tìm kiếm bệnh nhân. Vui lòng thử lại sau.', type: 'error'});
          }
          console.error('API Error:', apiError);
        }
      } else {
        // If search value is a name, fetch all patients and filter
        const userData = JSON.parse(localStorage.getItem('user') || '{}');
        const maBacSi = userData.maBacSi;
        
        if (!maBacSi) {
          alert('Không tìm thấy thông tin bác sĩ');
          return;
        }

        try {
          const appointments = await getDoctorAppointments(maBacSi);
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
            
            if (appointment.coBenhAn) {
              const records = await getPatientMedicalRecords(appointment.maBenhNhan);
              const processedRecords = records.map((record: MedicalRecord) => ({
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
          if (Object.keys(patientsMap).length === 0) {
            alert('Không tìm thấy bệnh nhân với tên này');
          }
        } catch (err) {
          alert('Có lỗi xảy ra khi tìm kiếm bệnh nhân. Vui lòng thử lại sau.');
          console.error('Search Error:', err);
        }
      }
    } catch (err) {
      alert('Có lỗi xảy ra khi tìm kiếm bệnh nhân. Vui lòng thử lại sau.');
      console.error('Search Error:', err);
    } finally {
      setSearching(false);
    }
  };

  // Create a debounced version of the search function
  const debouncedSearch = useCallback(
    debounce((value: string) => {
      if (value.length >= 3) {
        searchPatient(value);
      }
    }, 500),
    []
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userData = JSON.parse(localStorage.getItem('user') || '{}');
        const maBacSi = userData.maBacSi;
        
        if (!maBacSi) {
          throw new Error('Không tìm thấy thông tin bác sĩ');
        }

        const appointments = await getDoctorAppointments(maBacSi);
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
          
          if (appointment.coBenhAn) {
            const records = await getPatientMedicalRecords(appointment.maBenhNhan);
            const processedRecords = records.map((record: MedicalRecord) => ({
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
    const patientPhone = data.appointments[0]?.soDienThoaiBenhNhan || '';
    const searchLower = searchTerm.toLowerCase();
    
    // If search term is a phone number, only search by phone
    if (/^\d+$/.test(searchTerm)) {
      return patientPhone.includes(searchTerm);
    }
    // Otherwise search by name
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
        <div className="col-md-4 position-relative">
          <input
            type="text"
            className="form-control"
            placeholder="Tìm kiếm theo tên hoặc số điện thoại..."
            value={searchTerm}
            onChange={(e) => {
              const value = e.target.value;
              setSearchTerm(value);
              debouncedSearch(value);
            }}
          />
          {searching && (
            <div className="position-absolute end-0 top-50 translate-middle-y me-2">
              <div className="spinner-border spinner-border-sm text-primary" role="status">
                <span className="visually-hidden">Đang tìm kiếm...</span>
              </div>
            </div>
          )}
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
                          <button
                            className="btn btn-success btn-sm ms-2"
                            onClick={() => window.location.href = `/dashboard/examination?reexam=${record.maBenhAn}`}
                          >
                            Tái khám
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

      <NotificationModal
        show={notification.show}
        onClose={() => setNotification({...notification, show: false})}
        title={notification.title}
        message={notification.message}
        type={notification.type}
      />
    </div>
  );
} 
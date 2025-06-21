import { useEffect, useState, useCallback } from 'react';
import { getMedicalRecordsByDoctor } from '../services/api';
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
  diaChi?: string;
  ngaySinh?: string;
  diUng?: string;
}

interface PatientData {
  info: {
    maBenhNhan: string;
    tenBenhNhan: string;
    soDienThoaiBenhNhan: string;
  };
  records: MedicalRecord[];
}

interface Patients {
  [key: string]: PatientData;
}

export default function Patients() {
  const [allPatients, setAllPatients] = useState<Patients>({});
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<string | null>(null);
  const [notification, setNotification] = useState<{ show: boolean, title: string, message: string, type: 'success' | 'error' | 'info' }>({ show: false, title: '', message: '', type: 'info' });
  
  // Client-side pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const PATIENTS_PER_PAGE = 10;

  const processRecordsToPatients = (records: MedicalRecord[]) => {
    const patientsMap: Patients = {};
    for (const record of records) {
      const maBenhNhan = record.maBenhNhan?.toString() || '';
      if (!maBenhNhan) continue;
      if (!patientsMap[maBenhNhan]) {
        patientsMap[maBenhNhan] = {
          info: {
            maBenhNhan,
            tenBenhNhan: record.tenBenhNhan || '',
            soDienThoaiBenhNhan: record.soDienThoai || '',
          },
          records: []
        };
      }
      patientsMap[maBenhNhan].records.push(record);
    }
    return patientsMap;
  };
  
  const fetchAllMedicalRecords = useCallback(async (keyword: string) => {
    try {
      setSearching(true);
      setAllPatients({});
      setSelectedPatient(null);
      setCurrentPage(1);

      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      const maBacSi = userData.maBacSi;
      if (!maBacSi) {
        throw new Error('Không tìm thấy thông tin bác sĩ');
      }

      const initialResponse = await getMedicalRecordsByDoctor(maBacSi, 0, 100, keyword);
      if (!initialResponse || !initialResponse.data) {
        setAllPatients({});
        return;
      }
      
      let allRecords = initialResponse.data;
      const totalPagesFromApi = initialResponse.totalPages;

      if (totalPagesFromApi > 1) {
        const pageRequests = [];
        for (let page = 1; page < totalPagesFromApi; page++) {
          pageRequests.push(getMedicalRecordsByDoctor(maBacSi, page, 100, keyword));
        }
        const subsequentResponses = await Promise.all(pageRequests);
        subsequentResponses.forEach(response => {
          if (response && response.data) {
            allRecords = [...allRecords, ...response.data];
          }
        });
      }

      const patientsMap = processRecordsToPatients(allRecords);
      setAllPatients(patientsMap);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra khi tải dữ liệu');
      setAllPatients({});
    } finally {
      setSearching(false);
    }
  }, []);

  const debouncedSearch = useCallback(
    debounce((value: string) => {
      fetchAllMedicalRecords(value);
    }, 500),
    [fetchAllMedicalRecords]
  );

  useEffect(() => {
    setLoading(true);
    fetchAllMedicalRecords('').finally(() => setLoading(false));
  }, [fetchAllMedicalRecords]);

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
      setSelectedPatient(null);
    }
  };
  
  const patientEntries = Object.entries(allPatients);
  const totalPages = Math.ceil(patientEntries.length / PATIENTS_PER_PAGE);
  const startIndex = (currentPage - 1) * PATIENTS_PER_PAGE;
  const displayedPatientEntries = patientEntries.slice(startIndex, startIndex + PATIENTS_PER_PAGE);

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const pageNumbers = [];
    const maxPagesToShow = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return (
      <nav className="mt-auto py-3 d-flex justify-content-center">
        <ul className="pagination">
          <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
            <button className="page-link" onClick={() => handlePageChange(1)}>&laquo;</button>
          </li>
          <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
            <button className="page-link" onClick={() => handlePageChange(currentPage - 1)}>&lsaquo;</button>
          </li>
          {pageNumbers.map(number => (
            <li key={number} className={`page-item ${currentPage === number ? 'active' : ''}`}>
              <button className="page-link" onClick={() => handlePageChange(number)}>{number}</button>
            </li>
          ))}
          <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
            <button className="page-link" onClick={() => handlePageChange(currentPage + 1)}>&rsaquo;</button>
          </li>
          <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
            <button className="page-link" onClick={() => handlePageChange(totalPages)}>&raquo;</button>
          </li>
        </ul>
      </nav>
    );
  };
  
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
        <div className="col-md-4 d-flex flex-column" style={{ minHeight: 'calc(100vh - 250px)' }}>
          <div className="list-group">
            {displayedPatientEntries.map(([maBenhNhan, patient]) => (
              <button
                key={maBenhNhan}
                className={`list-group-item list-group-item-action d-flex justify-content-between align-items-center ${selectedPatient === maBenhNhan ? 'active' : ''}`}
                onClick={() => setSelectedPatient(maBenhNhan)}
              >
                <div>
                  <strong>{patient.info.tenBenhNhan}</strong>
                  <div className="text-muted small">SĐT: {patient.info.soDienThoaiBenhNhan}</div>
                </div>
                <span className="badge bg-primary rounded-pill">
                  {patient.records.length} bệnh án
                </span>
              </button>
            ))}
             {displayedPatientEntries.length === 0 && !loading && (
              <p className="text-center mt-3">Không có bệnh nhân nào khớp với tìm kiếm.</p>
            )}
          </div>
          {renderPagination()}
        </div>

        {/* Right column - Medical records */}
        <div className="col-md-8">
          {selectedPatient && allPatients[selectedPatient] ? (
            (() => {
              const patient = allPatients[selectedPatient];
              const latestRecord = patient.records.length > 0 ? patient.records[0] : null;

              const calculateAge = (birthDateString: string | null) => {
                if (!birthDateString) return 'Không rõ';
                const birthDate = new Date(birthDateString);
                const today = new Date();
                let age = today.getFullYear() - birthDate.getFullYear();
                const m = today.getMonth() - birthDate.getMonth();
                if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
                    age--;
                }
                return age;
              };

              return (
                <div className="card">
                  <div className="card-header">
                    <h4 className="mb-0">Thông tin chi tiết bệnh nhân</h4>
                  </div>
                  <div className="card-body">
                    <div className="row mb-3">
                      <div className="col-sm-4"><strong>Tên bệnh nhân:</strong></div>
                      <div className="col-sm-8">{patient.info.tenBenhNhan}</div>
                    </div>
                    <div className="row mb-3">
                      <div className="col-sm-4"><strong>Số điện thoại:</strong></div>
                      <div className="col-sm-8">{patient.info.soDienThoaiBenhNhan}</div>
                    </div>
                    {latestRecord && (
                      <>
                        <div className="row mb-3">
                          <div className="col-sm-4"><strong>Địa chỉ:</strong></div>
                          <div className="col-sm-8">{latestRecord.diaChi || 'Không rõ'}</div>
                        </div>
                        <div className="row mb-3">
                          <div className="col-sm-4"><strong>Năm sinh:</strong></div>
                          <div className="col-sm-8">{latestRecord.ngaySinh ? new Date(latestRecord.ngaySinh).toLocaleDateString('vi-VN') : 'Không rõ'}</div>
                        </div>
                        <div className="row mb-3">
                          <div className="col-sm-4"><strong>Tuổi:</strong></div>
                          <div className="col-sm-8">{calculateAge(latestRecord.ngaySinh || null)}</div>
                        </div>
                        <div className="row mb-3">
                            <div className="col-sm-4"><strong>Dị ứng:</strong></div>
                            <div className="col-sm-8">{latestRecord.diUng || 'Không có'}</div>
                        </div>
                        <div className="row mb-3">
                            <div className="col-sm-4"><strong>Chẩn đoán gần nhất:</strong></div>
                            <div className="col-sm-8">{latestRecord.chanDoan || 'Chưa có'}</div>
                        </div>
                      </>
                    )}
                    
                    <hr />
                    <h5 className="mt-4">Lịch sử bệnh án</h5>
                    {patient.records.length > 0 ? (
                        <div className="table-responsive">
                            <table className="table table-bordered table-hover">
                                <thead>
                                <tr>
                                    <th>Mã bệnh án</th>
                                    <th>Ngày khám</th>
                                    <th>Lý do khám</th>
                                    <th>Chẩn đoán</th>
                                    <th>Thao tác</th>
                                </tr>
                                </thead>
                                <tbody>
                                {patient.records.map((record) => (
                                    <tr key={record.maBenhAn}>
                                    <td>{record.maBenhAn}</td>
                                    <td>{new Date(record.ngayTao).toLocaleDateString()}</td>
                                    <td>{record.lyDoKham}</td>
                                    <td>{record.chanDoan}</td>
                                    <td>
                                        <button
                                        className="btn btn-primary btn-sm"
                                        onClick={() => window.open(`/dashboard/examination?reexam=${record.maBenhAn}`, '_blank')}
                                        >
                                        Xem chi tiết
                                        </button>
                                    </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p>Không có bệnh án nào.</p>
                    )}
                  </div>
                </div>
              );
            })()
          ) : (
            <div className="text-center mt-5">
              <p>Chọn một bệnh nhân từ danh sách để xem chi tiết bệnh án.</p>
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
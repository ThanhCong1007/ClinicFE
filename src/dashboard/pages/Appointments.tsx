import { useEffect, useState } from 'react';
import { Container, Row, Col, Form, Button, Card, Table, Modal } from 'react-bootstrap';
import { format } from 'date-fns';
import { Typeahead } from 'react-bootstrap-typeahead';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import Highlighter from 'react-highlight-words';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

interface Appointment {
  maLichHen: number;
  maBenhNhan: number;
  tenBenhNhan: string;
  soDienThoaiBenhNhan: string;
  maBacSi: number;
  tenBacSi: string;
  maDichVu: number;
  tenDichVu: string;
  ngayHen: string;
  gioBatDau: string;
  gioKetThuc: string;
  maTrangThai: number;
  tenTrangThai: string;
  ghiChuLichHen: string | null;
  lyDoHen: string | null;
  thoiGian: number;
  maBenhAn: number | null;
  lyDoKham: string | null;
  chanDoan: string | null;
  ghiChuDieuTri: string | null;
  ngayTaiKham: string | null;
  ngayTaoBenhAn: string | null;
  coBenhAn: boolean;
}

interface Prescription {
  maThuoc: number;
  tenThuoc: string;
  soLuong: number;
  donVi: string;
  cachDung: string;
  ghiChu: string;
  giaBan: number;
  tongTien: number;
  dotDungThuoc: string;
}

// API functions
export const getDoctorAppointments = async (maBacSi: number) => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('Không tìm thấy token xác thực');

  const response = await axios.get(
    `http://localhost:8080/api/tham-kham/bac-si/${maBacSi}/lich-hen-benh-an`,
    {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }
  );
  return response.data;
};

export const getAppointmentDetails = async (maLichHen: number) => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('Không tìm thấy token xác thực');

  const response = await axios.get(
    `http://localhost:8080/api/tham-kham/lich-hen/${maLichHen}/chi-tiet`,
    {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }
  );

  // Modify the response data to use real-time values
  const data = response.data;
  if (data) {
    const now = new Date();
    data.gioBatDau = format(now, 'HH:mm:ss');
    data.gioKetThuc = ''; // Clear end time initially
    data.thoiGian = 30; // Set default time to 30 minutes
  }
  
  return data;
};

export const getPatientMedicalRecords = async (maBenhNhan: number) => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('Không tìm thấy token xác thực');

  const response = await axios.get(
    `http://localhost:8080/api/tham-kham/benh-nhan/${maBenhNhan}/benh-an`,
    {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }
  );
  return response.data;
};

export const createMedicalExam = async (examData: any) => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('Không tìm thấy token xác thực');

  const response = await axios.post(
    'http://localhost:8080/api/tham-kham/kham',
    examData,
    {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    }
  );
  return response.data;
};

export const searchDrugsRxNav = async (text: string) => {
  try {
    // First, get approximate matches
    const approximateResponse = await axios.get(
      `https://rxnav.nlm.nih.gov/REST/approximateTerm.json?term=${encodeURIComponent(text)}`
    );

    const candidates = approximateResponse.data?.approximateGroup?.candidate || [];
    
    // Then, get detailed information for each candidate
    const drugDetails = await Promise.all(
      candidates.map(async (candidate: any) => {
        try {
          const propertiesResponse = await axios.get(
            `https://rxnav.nlm.nih.gov/REST/rxcui/${candidate.rxcui}/properties.json`
          );
          
          const properties = propertiesResponse.data?.properties || {};
          return {
            rxcui: candidate.rxcui,
            name: properties.name,
            synonym: properties.synonym,
            displayName: properties.displayName,
            score: candidate.score,
            rank: candidate.rank
          };
        } catch (error) {
          console.error(`Error fetching details for rxcui ${candidate.rxcui}:`, error);
          return null;
        }
      })
    );

    // Filter out any failed requests and sort by score
    return drugDetails
      .filter(drug => drug !== null)
      .sort((a, b) => (b?.score || 0) - (a?.score || 0));
  } catch (error) {
    console.error('Error searching drugs:', error);
    return [];
  }
};

// Add this CSS at the top of the file or in your CSS file
const drugCardStyle = {
  padding: '10px',
  marginBottom: '5px',
  border: '1px solid #dee2e6',
  borderRadius: '4px',
  backgroundColor: '#fff'
};

const drugHeaderStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '5px'
};

const drugInfoStyle = {
  fontSize: '0.9rem',
  color: '#6c757d'
};

export default function Appointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState('all');
  const [showExamModal, setShowExamModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [isWalkIn, setIsWalkIn] = useState(false);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [newPrescription, setNewPrescription] = useState<Prescription>({
    maThuoc: 0,
    tenThuoc: '',
    soLuong: 1,
    donVi: '',
    cachDung: '',
    ghiChu: '',
    giaBan: 0,
    tongTien: 0,
    dotDungThuoc: ''
  });

  const [medicalRecord, setMedicalRecord] = useState({
    lyDoKham: '',
    chanDoan: '',
    ghiChuDieuTri: '',
    ngayTaiKham: '',
    tienSuBenh: '',
    diUng: ''
  });

  const [drugOptions, setDrugOptions] = useState<any[]>([]);
  const [isSearchingDrug, setIsSearchingDrug] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const userData = JSON.parse(localStorage.getItem('user') || '{}');
        const maBacSi = userData.maBacSi;
        
        if (!maBacSi) {
          throw new Error('Không tìm thấy thông tin bác sĩ');
        }

        const data = await getDoctorAppointments(maBacSi);
        setAppointments(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Có lỗi xảy ra khi tải dữ liệu');
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  const handleStartExam = (appointment: Appointment | null, walkIn: boolean = false) => {
    if (walkIn) {
      const walkInAppointment: Appointment = {
        maLichHen: 0,
        maBenhNhan: 0,
        tenBenhNhan: '',
        soDienThoaiBenhNhan: '',
        maBacSi: 0,
        tenBacSi: '',
        maDichVu: 0,
        tenDichVu: 'Khám vãng lai',
        ngayHen: format(new Date(), 'yyyy-MM-dd'),
        gioBatDau: format(new Date(), 'HH:mm'),
        gioKetThuc: format(new Date(new Date().getTime() + 30 * 60000), 'HH:mm'),
        maTrangThai: 2,
        tenTrangThai: 'Đã xác nhận',
        ghiChuLichHen: 'Khám vãng lai',
        lyDoHen: null,
        thoiGian: 30,
        maBenhAn: null,
        lyDoKham: null,
        chanDoan: null,
        ghiChuDieuTri: null,
        ngayTaiKham: null,
        ngayTaoBenhAn: null,
        coBenhAn: false
      };
      setSelectedAppointment(walkInAppointment);
      setIsWalkIn(true);
    } else {
      setSelectedAppointment(appointment);
      setIsWalkIn(false);
    }
    setShowExamModal(true);
  };

  const handleAddPrescription = () => {
    if (newPrescription.tenThuoc && newPrescription.donVi && newPrescription.cachDung) {
      setPrescriptions([...prescriptions, newPrescription]);
      setNewPrescription({
        maThuoc: 0,
        tenThuoc: '',
        soLuong: 1,
        donVi: '',
        cachDung: '',
        ghiChu: '',
        giaBan: 0,
        tongTien: 0,
        dotDungThuoc: ''
      });
    }
  };

  const handleRemovePrescription = (index: number) => {
    setPrescriptions(prescriptions.filter((_, i) => i !== index));
  };

  const handleExamSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAppointment) return;

    try {
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      const now = new Date();

      // Transform prescriptions to match the new API structure
      const danhSachThuoc = prescriptions.map(pres => ({
        maThuoc: pres.maThuoc,
        tenThuoc: pres.tenThuoc,
        lieuDung: pres.cachDung,
        tanSuat: pres.dotDungThuoc,
        thoiDiem: '',
        thoiGianDieuTri: 7, // Default to 7 days
        soLuong: pres.soLuong,
        donViDung: pres.donVi,
        donGia: pres.giaBan,
        ghiChu: pres.ghiChu,
        lyDoDonThuoc: ''
      }));

      const examData = {
        maBenhNhan: selectedAppointment.maBenhNhan,
        hoTen: selectedAppointment.tenBenhNhan,
        soDienThoai: selectedAppointment.soDienThoaiBenhNhan,
        email: '',
        diaChi: '',
        ngaySinh: '',
        gioiTinh: '',
        tienSuBenh: medicalRecord.tienSuBenh,
        diUng: medicalRecord.diUng,
        maLichHen: isWalkIn ? null : selectedAppointment.maLichHen,
        maBacSi: userData.maBacSi,
        lyDoKham: medicalRecord.lyDoKham,
        chanDoan: medicalRecord.chanDoan,
        ghiChuDieuTri: medicalRecord.ghiChuDieuTri,
        ngayTaiKham: medicalRecord.ngayTaiKham,
        maDichVu: [selectedAppointment.maDichVu],
        danhSachThuoc: danhSachThuoc,
        ghiChuDonThuoc: '',
        ngayKham: format(now, "yyyy-MM-dd'T'HH:mm:ss.SSSSSS")
      };

      await createMedicalExam(examData);
      setShowExamModal(false);
      // Reset form
      setMedicalRecord({
        lyDoKham: '',
        chanDoan: '',
        ghiChuDieuTri: '',
        ngayTaiKham: '',
        tienSuBenh: '',
        diUng: ''
      });
      setPrescriptions([]);
      // Refresh appointments list
      const data = await getDoctorAppointments(userData.maBacSi);
      setAppointments(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra khi tạo bệnh án');
    }
  };

  const filteredAppointments = appointments.filter(appointment => {
    const appointmentDateStr = format(new Date(appointment.ngayHen), 'yyyy-MM-dd');
    const today = new Date();
    const todayStr = format(today, 'yyyy-MM-dd');

    switch (filter) {
      case 'today':
        return appointmentDateStr === todayStr;
      case 'upcoming':
        return appointmentDateStr > todayStr;
      case 'past':
        return appointmentDateStr < todayStr;
      default:
        return true;
    }
  });

  // Sắp xếp lịch hẹn
  const sortedAppointments = [...filteredAppointments].sort((a, b) => {
    // Ưu tiên trạng thái theo thứ tự: Đang thực hiện > Đã xác nhận > Đã đặt > Hoàn thành > Đã hủy
    const statusPriority = (status: number) => {
      switch (status) {
        case 3: // Đang thực hiện
          return 1;
        case 2: // Đã xác nhận
          return 2;
        case 1: // Đã đặt
          return 3;
        case 4: // Hoàn thành
          return 4;
        case 5: // Đã hủy
          return 5;
        default:
          return 6;
      }
    };

    const statusA = statusPriority(a.maTrangThai);
    const statusB = statusPriority(b.maTrangThai);

    if (statusA !== statusB) {
      return statusA - statusB;
    }

    // Nếu cùng trạng thái, sắp xếp theo ngày và giờ
    const dateA = new Date(`${a.ngayHen}T${a.gioBatDau}`);
    const dateB = new Date(`${b.ngayHen}T${b.gioBatDau}`);
    return dateA.getTime() - dateB.getTime();
  });

  // Lọc dữ liệu theo searchTerm
  const displayedAppointments = sortedAppointments.filter(appointment =>
    appointment.tenBenhNhan.toLowerCase().includes(searchTerm.toLowerCase()) ||
    appointment.soDienThoaiBenhNhan.includes(searchTerm) ||
    appointment.tenDichVu.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
    <Container fluid className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Danh sách lịch hẹn</h2>
        <div className="d-flex gap-2">
          <button 
            className="btn btn-success"
            onClick={() => navigate('/dashboard/examination')}
          >
            <i className="fas fa-user-plus me-2"></i>
            Khám bệnh
          </button>
          <div className="btn-group">
            <button 
              className={`btn ${filter === 'all' ? 'btn-primary' : 'btn-outline-primary'}`}
              onClick={() => setFilter('all')}
            >
              Tất cả
            </button>
            <button 
              className={`btn ${filter === 'today' ? 'btn-primary' : 'btn-outline-primary'}`}
              onClick={() => setFilter('today')}
            >
              Hôm nay
            </button>
            <button 
              className={`btn ${filter === 'upcoming' ? 'btn-primary' : 'btn-outline-primary'}`}
              onClick={() => setFilter('upcoming')}
            >
              Sắp tới
            </button>
            <button 
              className={`btn ${filter === 'past' ? 'btn-primary' : 'btn-outline-primary'}`}
              onClick={() => setFilter('past')}
            >
              Đã qua
            </button>
          </div>
        </div>
      </div>

      {/* Thêm ô input tìm kiếm phía trên bảng */}
      <div className="mb-3">
        <Form.Control
          type="text"
          placeholder="Tìm kiếm theo tên, số điện thoại, dịch vụ..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
      </div>

      {displayedAppointments.length === 0 ? (
        <div className="alert alert-info">
          Không có lịch hẹn nào
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped table-hover">
            <thead>
              <tr>
                <th>Ngày</th>
                <th>Thời gian</th>
                <th>Bệnh nhân</th>
                <th>Số điện thoại</th>
                <th>Dịch vụ</th>
                <th>Trạng thái</th>
                <th>Ghi chú</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {displayedAppointments.map((appointment) => (
                <tr key={appointment.maLichHen}>
                  <td>{appointment.ngayHen}</td>
                  <td>{`${appointment.gioBatDau} - ${appointment.gioKetThuc}`}</td>
                  <td>{appointment.tenBenhNhan}</td>
                  <td>{appointment.soDienThoaiBenhNhan}</td>
                  <td>{appointment.tenDichVu}</td>
                  <td>
                    <span className={`badge ${getStatusBadgeClass(appointment.maTrangThai)}`}>
                      {appointment.tenTrangThai}
                    </span>
                </td>
                  <td>{appointment.ghiChuLichHen || ' '}</td>
                  <td>
                    {!appointment.coBenhAn && (appointment.maTrangThai === 1 || appointment.maTrangThai === 2) && (
                      <button 
                        className="btn btn-success btn-sm"
                        onClick={() => navigate(`/dashboard/examination/${appointment.maLichHen}`)}
                      >
                        Khám bệnh
                      </button>
                    )}
                </td>
              </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Medical Examination Modal */}
      <Modal show={showExamModal} onHide={() => setShowExamModal(false)} size="xl" fullscreen="lg-down">
        <Modal.Header closeButton>
          <Modal.Title>Khám bệnh {isWalkIn ? 'vãng lai' : ''}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            {/* Left Column - Patient Info & Examination */}
            <Col md={7}>
              {/* Patient Information */}
              <Card className="mb-4">
                <Card.Header>
                  <h5 className="mb-0">Thông tin bệnh nhân</h5>
                </Card.Header>
                <Card.Body>
                  {isWalkIn ? (
                    <Row>
              <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Họ và tên</Form.Label>
                          <Form.Control
                            type="text"
                            value={selectedAppointment?.tenBenhNhan || ''}
                            onChange={(e) => setSelectedAppointment(prev => prev ? {...prev, tenBenhNhan: e.target.value} : null)}
                            required
                          />
                </Form.Group>
              </Col>
              <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Số điện thoại</Form.Label>
                          <Form.Control
                            type="text"
                            value={selectedAppointment?.soDienThoaiBenhNhan || ''}
                            onChange={(e) => setSelectedAppointment(prev => prev ? {...prev, soDienThoaiBenhNhan: e.target.value} : null)}
                            required
                          />
                </Form.Group>
              </Col>
                    </Row>
                  ) : (
                    <Row>
              <Col md={6}>
                        <p><strong>Họ và tên:</strong> {selectedAppointment?.tenBenhNhan}</p>
                        <p><strong>Số điện thoại:</strong> {selectedAppointment?.soDienThoaiBenhNhan}</p>
              </Col>
              <Col md={6}>
                        <p><strong>Dịch vụ:</strong> {selectedAppointment?.tenDichVu}</p>
                        <p><strong>Thời gian:</strong> {selectedAppointment?.gioBatDau} - {selectedAppointment?.gioKetThuc}</p>
                      </Col>
                    </Row>
                  )}
                </Card.Body>
              </Card>

              {/* Medical Record */}
              <Card className="mb-4">
                <Card.Header>
                  <h5 className="mb-0">Thông tin khám bệnh</h5>
                </Card.Header>
                <Card.Body>
                  <Row>
                    <Col md={12}>
                      <Form.Group className="mb-3">
                        <Form.Label>Lý do khám</Form.Label>
                        <Form.Control
                          type="text"
                          value={medicalRecord.lyDoKham}
                          onChange={(e) => setMedicalRecord({...medicalRecord, lyDoKham: e.target.value})}
                          required
                        />
                      </Form.Group>
                      <Form.Group className="mb-3">
                        <Form.Label>Tiền sử bệnh</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={3}
                          value={medicalRecord.tienSuBenh}
                          onChange={(e) => setMedicalRecord({...medicalRecord, tienSuBenh: e.target.value})}
                        />
                      </Form.Group>
                      <Form.Group className="mb-3">
                        <Form.Label>Dị ứng</Form.Label>
                        <Form.Control
                          type="text"
                          value={medicalRecord.diUng}
                          onChange={(e) => setMedicalRecord({...medicalRecord, diUng: e.target.value})}
                        />
                </Form.Group>
              </Col>
              <Col md={12}>
                      <Form.Group className="mb-3">
                        <Form.Label>Chẩn đoán</Form.Label>
                        <Form.Control
                          type="text"
                          value={medicalRecord.chanDoan}
                          onChange={(e) => setMedicalRecord({...medicalRecord, chanDoan: e.target.value})}
                          required
                        />
                      </Form.Group>
                      <Form.Group className="mb-3">
                        <Form.Label>Ghi chú điều trị</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={3}
                          value={medicalRecord.ghiChuDieuTri}
                          onChange={(e) => setMedicalRecord({...medicalRecord, ghiChuDieuTri: e.target.value})}
                          required
                        />
                      </Form.Group>
                      <Form.Group className="mb-3">
                        <Form.Label>Ngày tái khám</Form.Label>
                        <Form.Control
                          type="date"
                          value={medicalRecord.ngayTaiKham}
                          onChange={(e) => setMedicalRecord({...medicalRecord, ngayTaiKham: e.target.value})}
                        />
                </Form.Group>
              </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>

            {/* Right Column - Prescription */}
            <Col md={5}>
              <Card className="mb-4">
                <Card.Header className="d-flex justify-content-between align-items-center">
                  <h5 className="mb-0">Đơn thuốc</h5>
                  <Button 
                    variant="outline-primary" 
                    size="sm"
                    onClick={() => {
                      setNewPrescription({
                        maThuoc: 0,
                        tenThuoc: '',
                        soLuong: 1,
                        donVi: '',
                        cachDung: '',
                        ghiChu: '',
                        giaBan: 0,
                        tongTien: 0,
                        dotDungThuoc: ''
                      });
                    }}
                  >
                    <i className="fas fa-plus me-1"></i>
                    Thêm thuốc mới
                  </Button>
                </Card.Header>
                <Card.Body>
                  <div className="border rounded p-3 mb-3">
                    <h6 className="mb-3">Thêm thuốc mới</h6>
                    <Row>
              <Col md={12}>
                        <Form.Group className="mb-2">
                          <Form.Label>Tìm thuốc</Form.Label>
                          <Typeahead
                            id="drug-typeahead"
                            labelKey={(option: any) => option.name || option.synonym || option.displayName || ''}
                            isLoading={isSearchingDrug}
                            onInputChange={async (text) => {
                              if (text.length < 2) return;
                              setIsSearchingDrug(true);
                              const drugs = await searchDrugsRxNav(text);
                              setDrugOptions(drugs);
                              setIsSearchingDrug(false);
                            }}
                            onChange={(selected) => {
                              if (selected && selected[0]) {
                                const drug: any = selected[0];
                                setPrescriptions(prev => [
                                  ...prev,
                                  {
                                    maThuoc: drug.rxcui || '',
                                    tenThuoc: drug.name || drug.synonym || drug.displayName || '',
                                    soLuong: 1,
                                    donVi: 'viên',
                                    cachDung: '',
                                    ghiChu: '',
                                    giaBan: 0,
                                    tongTien: 0,
                                    dotDungThuoc: ''
                                  }
                                ]);
                              }
                            }}
                            options={drugOptions}
                            placeholder="Nhập tên thuốc..."
                            minLength={2}
                            renderMenuItemChildren={(option: any, props, idx) => (
                              <div style={drugCardStyle}>
                                <div style={drugHeaderStyle}>
                                  <div>
                                    <span className="fw-bold text-primary me-2">RxCUI: {option.rxcui}</span>
                                    <Highlighter
                                      searchWords={[props.text]}
                                      autoEscape={true}
                                      textToHighlight={option.name || option.synonym || option.displayName || ''}
                                      highlightClassName="bg-warning px-1"
                                    />
                                  </div>
                                  <div>
                                    <span className="badge bg-info me-2">Score: {option.score}</span>
                                    <span className="badge bg-secondary">Rank: {option.rank}</span>
                                  </div>
                                </div>
                                <div style={drugInfoStyle}>
                                  {option.synonym && (
                                    <div className="mb-1">
                                      <strong>Synonym:</strong> {option.synonym}
                                    </div>
                                  )}
                                  {option.displayName && (
                                    <div className="mb-1">
                                      <strong>Display Name:</strong> {option.displayName}
                                    </div>
                                  )}
                                  {option.source && (
                                    <div>
                                      <strong>Source:</strong> {option.source}
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                            clearButton
                          />
                </Form.Group>
                      </Col>
                    </Row>
                  </div>

                  {/* Bảng danh sách thuốc */}
                  <Table striped bordered hover responsive>
                    <thead>
                      <tr>
                        <th>STT</th>
                        <th>Mã thuốc</th>
                        <th>Tên thuốc</th>
                        <th>Đơn vị</th>
                        <th>Số lượng</th>
                        <th>Đợt dùng thuốc</th>
                        <th>Ghi chú</th>
                        <th>Giá bán</th>
                        <th>Tổng tiền</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {prescriptions.map((pres, idx) => (
                        <tr key={idx}>
                          <td>{idx + 1}</td>
                          <td>{pres.maThuoc}</td>
                          <td>{pres.tenThuoc}</td>
                          <td>
                            <Form.Control
                              type="text"
                              value={pres.donVi}
                              onChange={e => {
                                const newList = [...prescriptions];
                                newList[idx].donVi = e.target.value;
                                setPrescriptions(newList);
                              }}
                            />
                          </td>
                          <td>
                            <Form.Control
                              type="number"
                              min={1}
                              value={pres.soLuong}
                              onChange={e => {
                                const newList = [...prescriptions];
                                newList[idx].soLuong = parseInt(e.target.value) || 1;
                                newList[idx].tongTien = (newList[idx].soLuong * (newList[idx].giaBan || 0));
                                setPrescriptions(newList);
                              }}
                            />
                          </td>
                          <td>
                            <Form.Control
                              type="text"
                              value={pres.dotDungThuoc || ''}
                              onChange={e => {
                                const newList = [...prescriptions];
                                newList[idx].dotDungThuoc = e.target.value;
                                setPrescriptions(newList);
                              }}
                            />
                          </td>
                          <td>
                            <Form.Control
                              type="text"
                              value={pres.ghiChu || ''}
                              onChange={e => {
                                const newList = [...prescriptions];
                                newList[idx].ghiChu = e.target.value;
                                setPrescriptions(newList);
                              }}
                            />
                          </td>
                          <td>
                            <Form.Control
                              type="number"
                              min={0}
                              value={pres.giaBan || 0}
                              onChange={e => {
                                const newList = [...prescriptions];
                                newList[idx].giaBan = parseInt(e.target.value) || 0;
                                newList[idx].tongTien = (newList[idx].soLuong * newList[idx].giaBan);
                                setPrescriptions(newList);
                              }}
                            />
                          </td>
                          <td>{pres.tongTien?.toLocaleString() || 0}</td>
                          <td>
                            <Button variant="danger" size="sm" onClick={() => setPrescriptions(prescriptions.filter((_, i) => i !== idx))}>
                              <i className="fas fa-trash"></i>
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr>
                        <td colSpan={8} className="text-end fw-bold">Tổng tiền:</td>
                        <td colSpan={2} className="fw-bold text-danger">{prescriptions.reduce((sum, p) => sum + (p.tongTien || 0), 0).toLocaleString()}</td>
                      </tr>
                    </tfoot>
                  </Table>
                </Card.Body>
              </Card>
              </Col>
            </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowExamModal(false)}>
            Hủy
          </Button>
          <Button variant="primary" onClick={handleExamSubmit}>
            Lưu bệnh án
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

function getStatusBadgeClass(maTrangThai: number): string {
  switch (maTrangThai) {
    case 1: // Đã đặt
      return 'bg-primary'; // #3498db
    case 2: // Đã xác nhận
      return 'bg-success'; // #2ecc71
    case 3: // Đang thực hiện
      return 'bg-warning'; // #f39c12
    case 4: // Hoàn thành
      return 'bg-success'; // #27ae60
    case 5: // Đã hủy
      return 'bg-danger'; // #e74c3c
    default:
      return 'bg-secondary';
  }
} 
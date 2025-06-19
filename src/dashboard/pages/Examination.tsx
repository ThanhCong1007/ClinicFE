import { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Container, Row, Col, Form, Button, Card, Modal } from 'react-bootstrap';
import { format, parseISO, isValid } from 'date-fns';
import { getAppointmentDetails, createMedicalExam } from './Appointments';
import { DrugSearch } from '../components/DrugSearch';
import type { Drug } from '../components/DrugSearch';
import axios from 'axios';
import Select, { MultiValue, StylesConfig, ActionMeta } from 'react-select';
import NotificationModal from '../components/NotificationModal';

interface Appointment {
  maLichHen: number | null;
  maBenhNhan: number | null;
  hoTen: string;
  ngaySinh: string;
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
  lieuDung: string;
  tanSuat: string;
  thoiDiem: string;
  thoiGianDieuTri: number;
  soLuong: number;
  donViDung: string;
  ghiChu: string;
  lyDoDonThuoc: string;
}

interface Service {
  maDichVu: number;
  tenDichVu: string;
  moTa: string;
  gia: number;
}

interface MedicalExamData {
  maLichHen: number | null;
  maBacSi: number;
  maBenhNhan: number | null;
  hoTen: string;
  ngaySinh: string;
  soDienThoai: string;
  lyDoKham: string;
  chanDoan: string;
  ghiChuDieuTri: string;
  ngayTaiKham: string;
  tienSuBenh: string;
  diUng: string;
  danhSachDichVu?: { maDichVu: number; gia: number }[];
  danhSachThuoc?: Prescription[];
  ghiChuDonThuoc?: string;
}

export default function Examination() {
  const { maLichHen } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const reexamId = searchParams.get('reexam');
  const [isReexam, setIsReexam] = useState(!!reexamId);
  const [reexamLoading, setReexamLoading] = useState(false);
  const storageKey = `exam_${maLichHen || 'walk-in'}`;
  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [medicalRecord, setMedicalRecord] = useState({
    lyDoKham: '',
    chanDoan: '',
    ghiChuDieuTri: '',
    ngayTaiKham: '',
    tienSuBenh: '',
    diUng: ''
  });
  const [selectedDrugs, setSelectedDrugs] = useState<Drug[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [selectedServices, setSelectedServices] = useState<{maDichVu: number, tenDichVu: string, gia: number}[]>([]);
  const [showSuccess, setShowSuccess] = useState(false);

  // Lưu dữ liệu vào localStorage khi thay đổi
  useEffect(() => {
    if (!loading) {
      const dataToSave = {
        appointment,
        medicalRecord,
        selectedDrugs,
        selectedServices,
      };
      localStorage.setItem(storageKey, JSON.stringify(dataToSave));
    }
  }, [appointment, medicalRecord, selectedDrugs, selectedServices, loading, storageKey]);

  // Khôi phục dữ liệu từ localStorage nếu có
  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.appointment) setAppointment(parsed.appointment);
        if (parsed.medicalRecord) setMedicalRecord(parsed.medicalRecord);
        if (parsed.selectedDrugs) setSelectedDrugs(parsed.selectedDrugs);
        if (parsed.selectedServices) setSelectedServices(parsed.selectedServices);
      } catch {}
    }
  }, [storageKey]);

  useEffect(() => {
    const fetchAppointment = async () => {
      try {
        if (!maLichHen) {
          // Khám vãng lai: kiểm tra localStorage trước
          const saved = localStorage.getItem(storageKey);
          if (saved) {
            try {
              const parsed = JSON.parse(saved);
              if (parsed.appointment) {
                setAppointment(parsed.appointment);
                setLoading(false);
                return;
              }
            } catch {}
          }
          
          // Nếu không có dữ liệu trong localStorage, tạo form trống
          setAppointment({
            maLichHen: null,
            maBenhNhan: null,
            hoTen: '',
            ngaySinh: '',
            soDienThoaiBenhNhan: '',
            maBacSi: 0,
            tenBacSi: '',
            maDichVu: 0,
            tenDichVu: '',
            ngayHen: format(new Date(), 'yyyy-MM-dd'),
            gioBatDau: format(new Date(), 'HH:mm'),
            gioKetThuc: format(new Date(new Date().getTime() + 30 * 60000), 'HH:mm'),
            maTrangThai: 2,
            tenTrangThai: '',
            ghiChuLichHen: '',
            lyDoHen: null,
            thoiGian: 30,
            maBenhAn: null,
            lyDoKham: null,
            chanDoan: null,
            ghiChuDieuTri: null,
            ngayTaiKham: null,
            ngayTaoBenhAn: null,
            coBenhAn: false
          });
          setLoading(false);
          return;
        }
        const data = await getAppointmentDetails(parseInt(maLichHen));
        if (data) {
          setAppointment(data);
          // If there's existing medical record data, set it
          if (data.lyDoKham || data.chanDoan || data.ghiChuDieuTri || data.ngayTaiKham) {
            setMedicalRecord({
              lyDoKham: data.lyDoKham || '',
              chanDoan: data.chanDoan || '',
              ghiChuDieuTri: data.ghiChuDieuTri || '',
              ngayTaiKham: data.ngayTaiKham || '',
              tienSuBenh: '',
              diUng: ''
            });
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Có lỗi xảy ra khi tải dữ liệu');
      } finally {
        setLoading(false);
      }
    };

    fetchAppointment();
  }, [maLichHen]);

  // Fetch dịch vụ
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get('/api/public/dichvu');
        setServices(response.data);
      } catch (error) {
        setError('Không thể tải danh sách dịch vụ. Vui lòng thử lại sau.');
      }
    };
    fetchServices();
  }, []);

  // Nếu là tái khám, fetch chi tiết bệnh án
  useEffect(() => {
    if (reexamId) {
      setReexamLoading(true);
      const token = localStorage.getItem('token');
      axios.get(`/api/tham-kham/benh-an/${reexamId}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      })
        .then(res => {
          const data = res.data;
          setAppointment({
            maLichHen: data.maLichHen,
            maBenhNhan: data.maBenhNhan,
            hoTen: data.hoTen || data.tenBenhNhan || '',
            ngaySinh: data.ngaySinh || '',
            soDienThoaiBenhNhan: data.soDienThoai || '',
            maBacSi: data.maBacSi,
            tenBacSi: data.tenBacSi || '',
            maDichVu: 0,
            tenDichVu: '',
            ngayHen: '',
            gioBatDau: '',
            gioKetThuc: '',
            maTrangThai: 2,
            tenTrangThai: '',
            ghiChuLichHen: data.ghiChuLichHen || '',
            lyDoHen: null,
            thoiGian: 30,
            maBenhAn: data.maBenhAn,
            lyDoKham: data.lyDoKham || '',
            chanDoan: data.chanDoan || '',
            ghiChuDieuTri: data.ghiChuDieuTri || '',
            ngayTaiKham: data.ngayTaiKham || '',
            ngayTaoBenhAn: data.ngayTao || '',
            coBenhAn: true
          });
          setMedicalRecord({
            lyDoKham: data.lyDoKham || '',
            chanDoan: data.chanDoan || '',
            ghiChuDieuTri: data.ghiChuDieuTri || '',
            ngayTaiKham: data.ngayTaiKham || '',
            tienSuBenh: data.tienSuBenh || '',
            diUng: data.diUng || ''
          });
          setSelectedServices(Array.isArray(data.danhSachDichVu) ? data.danhSachDichVu.map((dv: any) => ({ maDichVu: dv.maDichVu, tenDichVu: dv.tenDichVu, gia: dv.gia })) : []);
          setSelectedDrugs(Array.isArray(data.danhSachThuoc) ? data.danhSachThuoc.map((thuoc: any) => ({
            maThuoc: thuoc.maThuoc,
            tenThuoc: thuoc.tenThuoc,
            hamLuong: thuoc.lieudung || thuoc.hamLuong || '',
            huongDanSuDung: thuoc.tanSuat || '',
            donViTinh: thuoc.donViDung || '',
            quantity: thuoc.soLuong || 1,
            notes: thuoc.ghiChu || ''
          })) : []);
        })
        .catch(() => setError('Không thể tải chi tiết bệnh án để tái khám'))
        .finally(() => setReexamLoading(false));
    }
  }, [reexamId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!appointment) return;

    // Đảm bảo có họ tên
    const hoTen = (appointment as any).hoTen || (appointment as any).tenBenhNhan || '';
    if (!hoTen.trim()) {
      setError('Họ tên là thông tin bắt buộc khi tạo bệnh nhân mới');
      return;
    }
    // Đảm bảo có ngày sinh
    if (!appointment.ngaySinh || !appointment.ngaySinh.trim()) {
      setError('Ngày sinh là thông tin bắt buộc khi tạo bệnh nhân mới');
      return;
    }
    // Format ngày sinh về yyyy-MM-dd
    let ngaySinhFormatted = appointment.ngaySinh;
    try {
      const parsed = parseISO(appointment.ngaySinh);
      if (isValid(parsed)) {
        ngaySinhFormatted = format(parsed, 'yyyy-MM-dd');
      }
    } catch {}

    try {
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      
      // Convert selected drugs to prescription format
      const danhSachThuoc = selectedDrugs.map(drug => ({
        maThuoc: drug.maThuoc,
        lieuDung: drug.hamLuong,
        tanSuat: drug.huongDanSuDung.split(',')[0] || '',
        thoiDiem: drug.huongDanSuDung.split(',')[1] || '',
        thoiGianDieuTri: 7, // Default to 7 days
        soLuong: drug.quantity || 1,
        donViDung: drug.donViTinh,
        ghiChu: drug.notes || '',
        lyDoDonThuoc: drug.huongDanSuDung
      }));

      const examData: MedicalExamData = {
        maLichHen: !appointment.maLichHen || appointment.maLichHen === 0 ? null : appointment.maLichHen,
        maBacSi: userData.maBacSi,
        maBenhNhan: !appointment.maBenhNhan ? null : appointment.maBenhNhan,
        hoTen,
        ngaySinh: ngaySinhFormatted,
        soDienThoai: appointment.soDienThoaiBenhNhan,
        ...medicalRecord,
        danhSachDichVu: selectedServices.map(s => ({ maDichVu: s.maDichVu, gia: s.gia })),
        danhSachThuoc,
        ghiChuDonThuoc: 'Bệnh nhân cần tuân thủ đúng liều lượng và thời gian dùng thuốc'
      };

      if (isReexam && appointment.maBenhAn) {
        // PUT cập nhật bệnh án
        await axios.put(`/api/tham-kham/benh-an/${appointment.maBenhAn}`, {
          ...examData,
          maBenhAn: appointment.maBenhAn,
          nguoiDung: userData.id || userData.maBacSi || null
        });
      } else {
        // POST tạo mới
        await createMedicalExam(examData);
      }
      localStorage.removeItem(storageKey);
      setShowSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra khi lưu bệnh án');
    }
  };

  // Khi thay đổi giá dịch vụ
  const handleServicePriceChange = (maDichVu: number, newPrice: number) => {
    setSelectedServices(prev => prev.map(s => s.maDichVu === maDichVu ? { ...s, gia: newPrice } : s));
  };

  if (loading || reexamLoading) {
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
      {/* Modal thông báo thành công/thất bại */}
      <NotificationModal
        show={showSuccess}
        onClose={() => { setShowSuccess(false); navigate('/dashboard/appointments'); }}
        title="Thành công"
        message="Bệnh án đã được lưu thành công!"
        type="success"
      />

      <h2 className="mb-4">Khám bệnh {maLichHen === 'walk-in' ? 'vãng lai' : ''}</h2>

      <Row>
        {/* Left Column - Patient Info & Examination */}
        <Col md={7}>
          {/* Patient Information */}
          <Card className="mb-4">
            <Card.Header>
              <h5 className="mb-0">Thông tin bệnh nhân</h5>
            </Card.Header>
            <Card.Body>
              {maLichHen ? (
                <Row>
                  <Col md={6}>
                    <p><strong>Họ và tên:</strong> {appointment?.hoTen}</p>
                    <p><strong>Số điện thoại:</strong> {appointment?.soDienThoaiBenhNhan}</p>
                  </Col>
                  <Col md={6}>
                    <p><strong>Dịch vụ:</strong> {appointment?.tenDichVu}</p>
                    <p><strong>Thời gian:</strong> {appointment?.gioBatDau}  {appointment?.gioKetThuc}</p>
                  </Col>
                </Row>
              ) : (
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Họ và tên</Form.Label>
                      <Form.Control
                        type="text"
                        value={appointment?.hoTen || ''}
                        onChange={e => setAppointment(prev => prev ? { ...prev, hoTen: e.target.value } : null)}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Số điện thoại</Form.Label>
                      <Form.Control
                        type="text"
                        value={appointment?.soDienThoaiBenhNhan || ''}
                        onChange={e => setAppointment(prev => prev ? { ...prev, soDienThoaiBenhNhan: e.target.value } : null)}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Ngày sinh</Form.Label>
                      <Form.Control
                        type="date"
                        value={appointment?.ngaySinh || ''}
                        onChange={e => setAppointment(prev => prev ? { ...prev, ngaySinh: e.target.value } : null)}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Dịch vụ</Form.Label>
                      <Select
                        isMulti
                        options={services.map(s => ({ value: s.maDichVu, label: s.tenDichVu }))}
                        value={selectedServices.map(s => ({ value: s.maDichVu, label: s.tenDichVu }))}
                        onChange={(options, _action: ActionMeta<{ value: number; label: string }>) => {
                          if (options && Array.isArray(options)) {
                            const newSelectedServices = options
                              .map(option => {
                                const service = services.find(s => s.maDichVu === option.value);
                                if (service) {
                                  // Giữ giá cũ nếu đã chọn trước đó, hoặc lấy giá mặc định
                                  const existingService = selectedServices.find(s => s.maDichVu === service.maDichVu);
                                  return {
                                    maDichVu: service.maDichVu,
                                    tenDichVu: service.tenDichVu,
                                    gia: existingService ? existingService.gia : service.gia
                                  };
                                }
                                return null;
                              })
                              .filter((x): x is { maDichVu: number; tenDichVu: string; gia: number } => Boolean(x));
                            setSelectedServices(newSelectedServices);
                          } else {
                            setSelectedServices([]);
                          }
                        }}
                        placeholder="Tìm và chọn dịch vụ..."
                        classNamePrefix="react-select"
                        styles={{ menu: (base: any) => ({ ...base, zIndex: 9999 }) } as StylesConfig<{ value: number; label: string }>}
                      />
                      {/* Hiển thị dịch vụ đã chọn và nhập giá */}
                      {selectedServices.length > 0 && (
                        <div style={{ marginTop: 12 }}>
                          {selectedServices.map(s => (
                            <div key={s.maDichVu} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                              <span style={{ minWidth: 120 }}>{s.tenDichVu}</span>
                              <Form.Control
                                type="number"
                                min={0}
                                value={s.gia}
                                onChange={e => handleServicePriceChange(s.maDichVu, Number(e.target.value))}
                                style={{ width: 100, padding: '2px 8px', fontSize: 14 }}
                              />
                              <span>VNĐ</span>
                            </div>
                          ))}
                          <div style={{ marginTop: 8, textAlign: 'right', fontWeight: 600, color: '#0d6efd', fontSize: 16 }}>
                            Tổng tiền dịch vụ: {selectedServices.reduce((sum, s) => sum + (s.gia || 0), 0).toLocaleString()} VNĐ
                          </div>
                        </div>
                      )}
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Thời gian</Form.Label>
                      <div style={{ padding: '0.375rem 0.75rem', border: '1px solid #ced4da', borderRadius: '0.375rem', background: '#f8f9fa', minHeight: '38px' }}>
                        {appointment ? `${appointment.gioBatDau} ` : ''}
                      </div>
                    </Form.Group>
                  </Col>
                  <Col md={12}>
                    <Form.Group className="mb-3">
                      <Form.Label>Ghi chú</Form.Label>
                      <Form.Control
                        type="text"
                        value={appointment?.ghiChuLichHen || ''}
                        onChange={e => setAppointment(prev => prev ? { ...prev, ghiChuLichHen: e.target.value } : null)}
                      />
                    </Form.Group>
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
            </Card.Header>
            <Card.Body>
              <DrugSearch onDrugsChange={setSelectedDrugs} storageKey={storageKey} />
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <div className="d-flex justify-content-end gap-2 mt-4">
        <Button variant="secondary" onClick={() => navigate('/dashboard/appointments')}>
          Hủy
        </Button>
        <Button variant="primary" type="submit" onClick={handleSubmit}>
          Lưu bệnh án
        </Button>
      </div>
    </Container>
  );
} 
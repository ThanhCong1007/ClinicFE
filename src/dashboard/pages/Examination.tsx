import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap';
import { format } from 'date-fns';
import { getAppointmentDetails, createMedicalExam } from './Appointments';
import { DrugSearch } from '../components/DrugSearch';
import type { Drug } from '../components/DrugSearch';

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
  lieuDung: string;
  tanSuat: string;
  thoiDiem: string;
  thoiGianDieuTri: number;
  soLuong: number;
  donViDung: string;
  ghiChu: string;
  lyDoDonThuoc: string;
}

interface MedicalExamData {
  maLichHen: number | null;
  maBacSi: number;
  maBenhNhan: number;
  tenBenhNhan: string;
  soDienThoai: string;
  lyDoKham: string;
  chanDoan: string;
  ghiChuDieuTri: string;
  ngayTaiKham: string;
  tienSuBenh: string;
  diUng: string;
  maDichVu?: number[];
  danhSachThuoc?: Prescription[];
  ghiChuDonThuoc?: string;
}

export default function Examination() {
  const { maLichHen } = useParams();
  const navigate = useNavigate();
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

  // Lưu dữ liệu vào localStorage khi thay đổi
  useEffect(() => {
    if (!loading) {
      const dataToSave = {
        appointment,
        medicalRecord,
        selectedDrugs,
      };
      localStorage.setItem(storageKey, JSON.stringify(dataToSave));
    }
  }, [appointment, medicalRecord, selectedDrugs, loading, storageKey]);

  // Khôi phục dữ liệu từ localStorage nếu có
  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.appointment) setAppointment(parsed.appointment);
        if (parsed.medicalRecord) setMedicalRecord(parsed.medicalRecord);
        if (parsed.selectedDrugs) setSelectedDrugs(parsed.selectedDrugs);
      } catch {}
    }
  }, [storageKey]);

  useEffect(() => {
    const fetchAppointment = async () => {
      try {
        if (!maLichHen) {
          // Khám vãng lai: form trống
          setAppointment({
            maLichHen: 0,
            maBenhNhan: 0,
            tenBenhNhan: '',
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!appointment) return;

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
        maLichHen: maLichHen === 'walk-in' ? null : appointment.maLichHen,
        maBacSi: userData.maBacSi,
        maBenhNhan: appointment.maBenhNhan,
        tenBenhNhan: appointment.tenBenhNhan,
        soDienThoai: appointment.soDienThoaiBenhNhan,
        ...medicalRecord,
        maDichVu: [appointment.maDichVu],
        danhSachThuoc,
        ghiChuDonThuoc: 'Bệnh nhân cần tuân thủ đúng liều lượng và thời gian dùng thuốc'
      };

      await createMedicalExam(examData);
      localStorage.removeItem(storageKey); // Xóa dữ liệu tạm khi lưu thành công
      navigate('/dashboard/appointments');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra khi tạo bệnh án');
    }
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
    <Container fluid className="py-4">
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
                    <p><strong>Họ và tên:</strong> {appointment?.tenBenhNhan}</p>
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
                        value={appointment?.tenBenhNhan || ''}
                        onChange={e => setAppointment(prev => prev ? { ...prev, tenBenhNhan: e.target.value } : null)}
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
                      <Form.Label>Dịch vụ</Form.Label>
                      <Form.Control
                        type="text"
                        value={appointment?.tenDichVu || ''}
                        onChange={e => setAppointment(prev => prev ? { ...prev, tenDichVu: e.target.value } : null)}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Thời gian</Form.Label>
                      <Form.Control
                        type="text"
                        value={appointment ? `${appointment.gioBatDau} - ${appointment.gioKetThuc}` : ''}
                        onChange={e => {
                          // Tách giờ bắt đầu và kết thúc nếu người dùng nhập lại
                          const [gioBatDau, gioKetThuc] = e.target.value.split('-').map(s => s.trim());
                          setAppointment(prev => prev ? { ...prev, gioBatDau: gioBatDau || '', gioKetThuc: gioKetThuc || '' } : null);
                        }}
                      />
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
              {!loading && (
                <DrugSearch onDrugsChange={setSelectedDrugs} initialSelectedDrugs={selectedDrugs} />
              )}
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
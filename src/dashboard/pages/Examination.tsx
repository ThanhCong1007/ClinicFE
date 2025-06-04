import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Form, Button, Card, Table } from 'react-bootstrap';
import { format } from 'date-fns';
import { Typeahead } from 'react-bootstrap-typeahead';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import Highlighter from 'react-highlight-words';
import { getAppointmentDetails, createMedicalExam, searchDrugsRxNav } from './Appointments';

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

export default function Examination() {
  const { maLichHen } = useParams();
  const navigate = useNavigate();
  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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
            coBenhAn: false
          });
          setLoading(false);
          return;
        }
        const data = await getAppointmentDetails(parseInt(maLichHen));
        if (data) {
          setAppointment({
            maLichHen: data.maLichHen,
            maBenhNhan: data.maBenhNhan,
            tenBenhNhan: data.tenBenhNhan,
            soDienThoaiBenhNhan: data.soDienThoaiBenhNhan,
            maBacSi: data.maBacSi,
            tenBacSi: data.tenBacSi,
            maDichVu: data.maDichVu,
            tenDichVu: data.tenDichVu,
            ngayHen: data.ngayHen,
            gioBatDau: data.gioBatDau,
            gioKetThuc: data.gioKetThuc,
            maTrangThai: data.maTrangThai,
            tenTrangThai: data.tenTrangThai,
            ghiChuLichHen: data.ghiChuLichHen,
            coBenhAn: data.coBenhAn
          });
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Có lỗi xảy ra khi tải dữ liệu');
      } finally {
        setLoading(false);
      }
    };

    fetchAppointment();
  }, [maLichHen]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!appointment) return;

    try {
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      const examData = {
        maLichHen: maLichHen === 'walk-in' ? null : appointment.maLichHen,
        maBacSi: userData.maBacSi,
        tenBacSi: userData.tenBacSi,
        maBenhNhan: appointment.maBenhNhan,
        tenBenhNhan: appointment.tenBenhNhan,
        soDienThoai: appointment.soDienThoaiBenhNhan,
        ...medicalRecord,
        donThuoc: prescriptions
      };

      await createMedicalExam(examData);
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
                    <p><strong>Thời gian:</strong> {appointment?.gioBatDau} - {appointment?.gioKetThuc}</p>
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
                        labelKey={(option: any) => option.name || option.rxcui || ''}
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
                                tenThuoc: drug.name || '',
                                soLuong: 1,
                                donVi: drug.doseFormName || 'viên',
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
                          <div className="d-flex flex-column">
                            <div>
                              <span className="fw-bold text-primary me-2">{option.rxcui}</span>
                              <Highlighter
                                searchWords={[props.text]}
                                autoEscape={true}
                                textToHighlight={option.name || ''}
                                highlightClassName="bg-warning px-1"
                              />
                              {option.doseFormName && <span className="ms-2 text-muted">{option.doseFormName}</span>}
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
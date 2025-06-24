import { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Row, Col, Form, Button, Card, Modal, Spin, Alert, Input, DatePicker, Select, notification, Descriptions, InputNumber } from 'antd';
import { format, parseISO, isValid } from 'date-fns';
import { getAppointmentDetails, createMedicalExam, fetchServices, getMedicalRecordById, updateMedicalRecord } from '../services/api';
import { DrugSearch } from '../components/DrugSearch';
import type { Drug } from '../components/DrugSearch';
import axios from 'axios';
import dayjs from 'dayjs';

const { Option } = Select;

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
  
  const [form] = Form.useForm();

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
          const saved = localStorage.getItem(storageKey);
          if (saved) {
            try {
              const parsed = JSON.parse(saved);
              if (parsed.appointment) {
                setAppointment(parsed.appointment);
                form.setFieldsValue(parsed.appointment);
                setLoading(false);
                return;
              }
            } catch {}
          }
          const newAppointment = {
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
          };
          setAppointment(newAppointment);
          form.setFieldsValue(newAppointment);
          setLoading(false);
          return;
        }
        const data = await getAppointmentDetails(parseInt(maLichHen));
        if (data) {
          setAppointment(data);
          form.setFieldsValue(data);
          if (data.lyDoKham || data.chanDoan || data.ghiChuDieuTri || data.ngayTaiKham) {
            const record = {
              lyDoKham: data.lyDoKham || '',
              chanDoan: data.chanDoan || '',
              ghiChuDieuTri: data.ghiChuDieuTri || '',
              ngayTaiKham: data.ngayTaiKham || '',
              tienSuBenh: '',
              diUng: ''
            };
            setMedicalRecord(record);
            form.setFieldsValue(record);
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Có lỗi xảy ra khi tải dữ liệu');
      } finally {
        setLoading(false);
      }
    };
    fetchAppointment();
  }, [maLichHen, form]);

  const fetchServicesList = async () => {
    try {
      const data = await fetchServices();
      setServices(data);
    } catch (error) {
      setError('Không thể tải danh sách dịch vụ. Vui lòng thử lại sau.');
    }
  };

  useEffect(() => {
    fetchServicesList();
  }, []);

  useEffect(() => {
    if (reexamId) {
      setReexamLoading(true);
      getMedicalRecordById(Number(reexamId))
        .then(data => {
          const reexamAppointment = {
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
          };
          setAppointment(reexamAppointment);
          const record = {
            lyDoKham: data.lyDoKham || '',
            chanDoan: data.chanDoan || '',
            ghiChuDieuTri: data.ghiChuDieuTri || '',
            ngayTaiKham: data.ngayTaiKham ? format(new Date(data.ngayTaiKham), 'yyyy-MM-dd') : '',
            tienSuBenh: data.tienSuBenh || '',
            diUng: data.diUng || ''
          };
          setMedicalRecord(record);
          form.setFieldsValue({ ...reexamAppointment, ...record });
        })
        .catch(err => setError(err.message))
        .finally(() => setReexamLoading(false));
    }
  }, [reexamId, form]);

  // Hàm lưu draft form + dịch vụ
  const saveDraft = (formValues: any, services: any) => {
    localStorage.setItem('draft_examination', JSON.stringify({ ...formValues, selectedServices: services }));
  };

  // Khi khôi phục draft, tách selectedServices khỏi draft và set lại state
  useEffect(() => {
    const draft = localStorage.getItem('draft_examination');
    if (draft) {
      try {
        const values = JSON.parse(draft);
        const { selectedServices: draftServices, ...formValues } = values;
        form.setFieldsValue(formValues);
        setSelectedServices(Array.isArray(draftServices) ? draftServices : []);
      } catch {}
    }
  }, [form]);

  const handleSubmit = async (values: any) => {
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    const examData: MedicalExamData = {
      maLichHen: isReexam ? null : (maLichHen ? parseInt(maLichHen) : null),
      maBacSi: userData.maBacSi,
      maBenhNhan: appointment?.maBenhNhan || null,
      hoTen: values.hoTen,
      ngaySinh: values.ngaySinh ? format(new Date(values.ngaySinh), 'yyyy-MM-dd') : '',
      soDienThoai: values.soDienThoaiBenhNhan,
      lyDoKham: values.lyDoKham,
      chanDoan: values.chanDoan,
      ghiChuDieuTri: values.ghiChuDieuTri,
      ngayTaiKham: values.ngayTaiKham ? format(new Date(values.ngayTaiKham), 'yyyy-MM-dd') : '',
      tienSuBenh: values.tienSuBenh,
      diUng: values.diUng,
      danhSachDichVu: selectedServices.map(s => ({ maDichVu: s.maDichVu, gia: s.gia })),
      danhSachThuoc: selectedDrugs.map(drug => ({
        maThuoc: drug.rxcui,
        lieuDung: '', 
        tanSuat: '', 
        thoiDiem: '', 
        thoiGianDieuTri: 7, 
        soLuong: 1, 
        donViDung: 'viên', 
        ghiChu: '', 
        lyDoDonThuoc: drug.name || ''
      })),
      ghiChuDonThuoc: ''
    };

    try {
      if (appointment?.maBenhAn) {
        await updateMedicalRecord(appointment.maBenhAn, examData);
        notification.success({ message: 'Thành công', description: 'Cập nhật bệnh án thành công!' });
      } else {
        await createMedicalExam(examData);
        notification.success({ message: 'Thành công', description: 'Tạo bệnh án thành công!' });
      }
      localStorage.removeItem('draft_examination'); // Xóa draft khi submit thành công
      localStorage.removeItem(storageKey);
      navigate('/dashboard/appointments');
    } catch (err) {
      notification.error({ message: 'Lỗi', description: err instanceof Error ? err.message : 'Có lỗi xảy ra' });
    }
  };
  
  const handleServicePriceChange = (maDichVu: number, newPrice: number) => {
    setSelectedServices(prev => 
      prev.map(s => s.maDichVu === maDichVu ? { ...s, gia: newPrice } : s)
    );
  };
  
  if (loading || reexamLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Spin size="large" tip="Đang tải dữ liệu..." />
      </div>
    );
  }

  if (error) {
    return <Alert message="Lỗi" description={error} type="error" showIcon style={{ margin: 24 }} />;
  }
  
  return (
    <div style={{ padding: 24 }}>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        onValuesChange={(_, allValues) => {
          saveDraft(allValues, selectedServices);
        }}
        initialValues={{...appointment, ...medicalRecord}}
      >
        <Row gutter={24}>
          <Col span={16}>
            <Card title={isReexam ? 'Tái khám' : (maLichHen ? 'Khám bệnh theo lịch hẹn' : 'Khám bệnh vãng lai')} style={{ marginBottom: 24 }}>
              {!maLichHen || isReexam ? (
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item name="hoTen" label="Họ và tên" rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}>
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item name="soDienThoaiBenhNhan" label="Số điện thoại" rules={[{ required: true, message: 'Vui lòng nhập số điện thoại' }]}>
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item name="ngaySinh" label="Ngày sinh">
                      <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
                    </Form.Item>
                  </Col>
                </Row>
              ) : (
                <Descriptions bordered column={2}>
                  <Descriptions.Item label="Họ và tên">{appointment?.hoTen}</Descriptions.Item>
                  <Descriptions.Item label="Số điện thoại">{appointment?.soDienThoaiBenhNhan}</Descriptions.Item>
                  <Descriptions.Item label="Ngày hẹn">{appointment?.ngayHen}</Descriptions.Item>
                  <Descriptions.Item label="Giờ hẹn">{appointment?.gioBatDau}</Descriptions.Item>
                  <Descriptions.Item label="Dịch vụ">{appointment?.tenDichVu}</Descriptions.Item>
                </Descriptions>
              )}
            </Card>

            <Card title="Thông tin khám bệnh" style={{ marginBottom: 24 }}>
              <Row gutter={16}>
                <Col span={24}>
                  <Form.Item name="lyDoKham" label="Lý do khám" rules={[{ required: true, message: 'Vui lòng nhập lý do khám' }]}>
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="tienSuBenh" label="Tiền sử bệnh">
                    <Input.TextArea rows={3} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="diUng" label="Dị ứng">
                    <Input.TextArea rows={3} />
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item name="chanDoan" label="Chẩn đoán" rules={[{ required: true, message: 'Vui lòng nhập chẩn đoán' }]}>
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item name="ghiChuDieuTri" label="Ghi chú điều trị" rules={[{ required: true, message: 'Vui lòng nhập ghi chú' }]}>
                    <Input.TextArea rows={4} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="ngayTaiKham" label="Ngày tái khám">
                    <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
                  </Form.Item>
                </Col>
              </Row>
            </Card>
          </Col>

          <Col span={8}>
            <Card title="Dịch vụ & Đơn thuốc" style={{ marginBottom: 24 }}>
              <Form.Item label="Dịch vụ">
                <Select
                  mode="multiple"
                  allowClear
                  style={{ width: '100%' }}
                  placeholder="Chọn dịch vụ"
                  value={selectedServices.map(s => s.maDichVu)}
                  onChange={(value: number[]) => {
                    const newServices = value.map(maDichVu => {
                      const existed = selectedServices.find(s => s.maDichVu === maDichVu);
                      const service = services.find(s => s.maDichVu === maDichVu);
                      return existed ? existed : (service ? { maDichVu: service.maDichVu, tenDichVu: service.tenDichVu, gia: service.gia } : null);
                    }).filter(Boolean) as {maDichVu: number, tenDichVu: string, gia: number}[];
                    setSelectedServices(newServices);
                    saveDraft(form.getFieldsValue(), newServices);
                  }}
                >
                  {services.map(service => (
                    <Option key={service.maDichVu} value={service.maDichVu}>{service.tenDichVu}</Option>
                  ))}
                </Select>
              </Form.Item>
              {/* Hiển thị danh sách dịch vụ đã chọn với tên và giá có thể chỉnh sửa */}
              {selectedServices.length > 0 && (
                <div style={{ marginTop: 12 }}>
                  {selectedServices.map(s => (
                    <div key={s.maDichVu} style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
                      <span style={{ flex: 1 }}>{s.tenDichVu}</span>
                      <InputNumber
                        min={0}
                        value={s.gia}
                        style={{ width: 120, marginLeft: 8, marginRight: 8 }}
                        onChange={val => {
                          handleServicePriceChange(s.maDichVu, val || 0);
                          // Lưu lại draft ngay khi đổi giá
                          saveDraft(form.getFieldsValue(), selectedServices.map(item =>
                            item.maDichVu === s.maDichVu ? { ...item, gia: val || 0 } : item
                          ));
                        }}
                        formatter={(v) => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        parser={(v) => Number(v ? v.replace(/\D/g, '') : 0)}
                      />
                      <span>VNĐ</span>
                    </div>
                  ))}
                </div>
              )}
              
              <h5 style={{ marginTop: 24 }}>Đơn thuốc</h5>
              <DrugSearch onDrugsChange={setSelectedDrugs} storageKey={storageKey} />
            </Card>
            
            <Row gutter={16}>
              <Col span={12}>
                <Button type="primary" htmlType="submit" block loading={loading}>
                  {appointment?.maBenhAn ? 'Cập nhật bệnh án' : 'Lưu bệnh án'}
                </Button>
              </Col>
              <Col span={12}>
                <Button block onClick={() => navigate('/dashboard/appointments')}>
                  Hủy
                </Button>
              </Col>
            </Row>
          </Col>
        </Row>
      </Form>
    </div>
  );
} 
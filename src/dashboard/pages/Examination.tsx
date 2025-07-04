import { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Row, Col, Form, Button, Card, Modal, Spin, Alert, Input, DatePicker, Select, notification, InputNumber } from 'antd';
import { format, parseISO, isValid } from 'date-fns';
import { getAppointmentDetails, createMedicalExam, fetchServices, getMedicalRecordById, updateMedicalRecord } from '../services/api';
import { DrugSearch } from '../components/DrugSearch';
import type { Drug } from '../components/DrugSearch';
import axios from 'axios';
import dayjs from 'dayjs';
import { remove as removeDiacritics } from 'diacritics';
import NotFound from '../../user/features/404';

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
  gioBatDau: string;
  gioKetThuc: string;
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
  const [selectedServices, setSelectedServices] = useState<{ maDichVu: number, tenDichVu: string, gia: number }[]>([]);
  const [examStartTime] = useState(format(new Date(), 'HH:mm:ss'));

  const [form] = Form.useForm();

  // Add state for available slots
  const [availableSlots, setAvailableSlots] = useState<any[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [slotError, setSlotError] = useState<string | null>(null);
  const [selectedReexamDate, setSelectedReexamDate] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  // Initialize form with empty values to prevent connection warning
  useEffect(() => {
    form.setFieldsValue({
      hoTen: '',
      soDienThoaiBenhNhan: '',
      ngaySinh: null,
      ngayHen: null,
      gioBatDau: examStartTime,
      lyDoKham: '',
      chanDoan: '',
      ghiChuDieuTri: '',
      ngayTaiKham: null,
      tienSuBenh: '',
      diUng: ''
    });
  }, [form, examStartTime]);

  // Thêm hàm chuẩn hóa dữ liệu
  function normalizeAppointmentData(data: any): Appointment {
    return {
      maLichHen: data.maLichHen ?? null,
      maBenhNhan: data.maBenhNhan ?? null,
      hoTen: data.hoTen || data.tenBenhNhan || '',
      ngaySinh: data.ngaySinh || data.ngaySinhBenhNhan || '',
      soDienThoaiBenhNhan: data.soDienThoaiBenhNhan || data.soDienThoai || '',
      maBacSi: data.maBacSi ?? 0,
      tenBacSi: data.tenBacSi || '',
      maDichVu: data.maDichVu ?? 0,
      tenDichVu: data.tenDichVu || '',
      ngayHen: data.ngayHen || '',
      gioBatDau: data.gioBatDau || '',
      gioKetThuc: data.gioKetThuc || '',
      maTrangThai: data.maTrangThai ?? 0,
      tenTrangThai: data.tenTrangThai || '',
      ghiChuLichHen: data.ghiChuLichHen || '',
      lyDoHen: data.lyDoHen || '',
      thoiGian: data.thoiGian ?? 0,
      maBenhAn: data.maBenhAn ?? null,
      lyDoKham: data.lyDoKham || '',
      chanDoan: data.chanDoan || '',
      ghiChuDieuTri: data.ghiChuDieuTri || '',
      ngayTaiKham: data.ngayTaiKham || '',
      ngayTaoBenhAn: data.ngayTaoBenhAn || '',
      coBenhAn: data.coBenhAn ?? false,
    };
  }

  // Ưu tiên lấy dữ liệu từ location.state
  useEffect(() => {
    let found = false;
    if (location.state && (location.state as any).appointment) {
      setAppointment(normalizeAppointmentData((location.state as any).appointment));
      found = true;
      setLoading(false);
    } else {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (parsed.appointment) {
            setAppointment(normalizeAppointmentData(parsed.appointment));
            found = true;
            setLoading(false);
          }
        } catch { }
      }
    }
    if (!found) {
      // Tạo appointment mặc định (khám vãng lai)
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
      setLoading(false);
    }
  }, [location.state, storageKey]);

  useEffect(() => {
    const fetchAppointment = async () => {
      try {
        if (!maLichHen) {
          const saved = localStorage.getItem(storageKey);
          if (saved) {
            try {
              const parsed = JSON.parse(saved);
              if (parsed.appointment) {
                setAppointment(normalizeAppointmentData(parsed.appointment));
                setLoading(false);
                return;
              }
            } catch { }
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
          setLoading(false);
          return;
        }
        const data = await getAppointmentDetails(parseInt(maLichHen));
        if (data) {
          setAppointment(normalizeAppointmentData(data));
          if (data.lyDoKham || data.chanDoan || data.ghiChuDieuTri || data.ngayTaiKham) {
            const record = {
              lyDoKham: data.lyDoKham || '',
              chanDoan: data.chanDoan || '',
              ghiChuDieuTri: data.ghiChuDieuTri || '',
              ngayTaiKham: data.ngayTaiKham || '',
              tienSuBenh: data.tienSuBenh || '',
              diUng: data.diUng || ''
            };
            setMedicalRecord(record);
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

  // Hàm chuyển đổi các trường ngày sang dayjs
  function normalizeDateFields(obj: any, fields: string[]) {
    const result = { ...obj };
    fields.forEach(field => {
      if (result[field] && typeof result[field] === 'string' && result[field] !== '') {
        try {
          const dayjsObj = dayjs(result[field]);
          if (dayjsObj.isValid()) {
            result[field] = dayjsObj;
          } else {
            result[field] = null;
          }
        } catch (error) {
          console.warn(`Invalid date format for field ${field}:`, result[field]);
          result[field] = null;
        }
      } else {
        result[field] = null;
      }
    });
    return result;
  }

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
            ngayHen: data.ngayHen || '',
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
          // Chuyển các trường ngày sang dayjs trước khi setFieldsValue
          const dateFields = ['ngaySinh', 'ngayTaiKham', 'ngayHen', 'ngayTaoBenhAn', 'ngayTao'];
          const formValues = normalizeDateFields({ ...reexamAppointment, ...record }, dateFields);
          form.setFieldsValue(formValues);
          if (Array.isArray(data.danhSachDichVu)) {
            setSelectedServices(data.danhSachDichVu.map((dv: any) => ({
              maDichVu: dv.maDichVu,
              tenDichVu: dv.tenDichVu || (services.find(s => s.maDichVu === dv.maDichVu)?.tenDichVu) || '',
              gia: dv.gia
            })));
          }
          if (Array.isArray(data.danhSachThuoc)) {
            setSelectedDrugs(data.danhSachThuoc);
          }
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
        // Chuyển các trường ngày sang dayjs trước khi setFieldsValue
        const dateFields = ['ngaySinh', 'ngayTaiKham', 'ngayHen', 'ngayTaoBenhAn', 'ngayTao'];
        const normalized = normalizeDateFields(formValues, dateFields);
        form.setFieldsValue(normalized);
        setSelectedServices(Array.isArray(draftServices) ? draftServices : []);
      } catch { }
    }
  }, [form]);

  const handleSubmit = async (values: any) => {
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    // Lấy khung giờ đã chọn
    const selectedSlotObj = availableSlots.find(slot => slot.gioBatDau === values.gioTaiKham);
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
        maThuoc: drug.maThuoc,
        lieuDung: '', 
        tanSuat: '', 
        thoiDiem: '', 
        thoiGianDieuTri: 7, 
        soLuong: 1, 
        donViDung: 'viên', 
        ghiChu: '', 
        lyDoDonThuoc: drug.tenThuoc || ''
      })),
      ghiChuDonThuoc: '',
      gioBatDau: values.gioTaiKham || '',
      gioKetThuc: selectedSlotObj?.gioKetThuc || '',
    };

    try {
      let createdRecord;
      if (appointment?.maBenhAn) {
        await updateMedicalRecord(appointment.maBenhAn, examData);
        notification.success({ message: 'Thành công', description: 'Cập nhật bệnh án thành công!' });
        createdRecord = { maBenhAn: appointment.maBenhAn };
      } else {
        const result = await createMedicalExam(examData);
        notification.success({ message: 'Thành công', description: 'Tạo bệnh án thành công!' });
        createdRecord = result;
      }
      localStorage.removeItem('draft_examination');
      localStorage.removeItem(storageKey);
      // Fetch full details from backend after creation
      if (createdRecord?.maBenhAn) {
        const detail = await getMedicalRecordById(createdRecord.maBenhAn);
        // You can use 'detail' for further logic or navigation if needed
        // For now, just navigate away
      }
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

  // Save appointment data to localStorage
  const saveAppointmentToStorage = (appointmentData: any, medicalRecordData: any) => {
    try {
      const dataToSave = {
        appointment: appointmentData,
        medicalRecord: medicalRecordData,
        selectedDrugs,
        selectedServices
      };
      localStorage.setItem(storageKey, JSON.stringify(dataToSave));
      console.log('Saved to localStorage:', dataToSave);
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  };

  // Save to localStorage when appointment or medicalRecord changes
  useEffect(() => {
    if (appointment) {
      saveAppointmentToStorage(appointment, medicalRecord);
    }
  }, [appointment, medicalRecord, selectedDrugs, selectedServices]);

  // Đảm bảo set form values dùng đúng field đã chuẩn hóa
  useEffect(() => {
    if (appointment && !loading) {
      const formValues = {
        hoTen: appointment.hoTen || '',
        soDienThoaiBenhNhan: appointment.soDienThoaiBenhNhan || '',
        ngaySinh: appointment.ngaySinh ? dayjs(appointment.ngaySinh) : null,
        ngayHen: appointment.ngayHen ? dayjs(appointment.ngayHen) : null,
        gioBatDau: examStartTime,
        lyDoKham: medicalRecord.lyDoKham || '',
        chanDoan: medicalRecord.chanDoan || '',
        ghiChuDieuTri: medicalRecord.ghiChuDieuTri || '',
        ngayTaiKham: medicalRecord.ngayTaiKham ? dayjs(medicalRecord.ngayTaiKham) : null,
        tienSuBenh: medicalRecord.tienSuBenh || '',
        diUng: medicalRecord.diUng || ''
      };
      form.setFieldsValue(formValues);
    }
  }, [appointment, medicalRecord, loading, form, examStartTime]);

  // Fetch available slots when doctor and re-exam date change
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    if (userData.maBacSi && selectedReexamDate) {
      setLoadingSlots(true);
      setSlotError(null);
      axios.get(`/api/public/bac-si/${userData.maBacSi}/lich-trong?ngayHen=${selectedReexamDate}`)
        .then(res => setAvailableSlots(res.data))
        .catch(() => setSlotError('Không thể tải khung giờ trống.'))
        .finally(() => setLoadingSlots(false));
    } else {
      setAvailableSlots([]);
    }
  }, [selectedReexamDate]);

  if (error === '404') {
    return <NotFound />;
  }

  if (loading || reexamLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div style={{ textAlign: 'center' }}>
          <Spin size="large" />
          <div style={{ marginTop: 16 }}>Đang tải dữ liệu...</div>
        </div>
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
        initialValues={{}}
      >
        <Row gutter={24}>
          <Col span={16}>
            <Card title={isReexam ? 'Tái khám' : (maLichHen ? 'Khám bệnh theo lịch hẹn' : 'Khám bệnh vãng lai')} style={{ marginBottom: 24 }}>
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
                <Col span={12}>
                  <Form.Item name="ngayHen" label="Ngày hẹn">
                    <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="gioBatDau" label="Giờ khám">
                    <Input
                      value={examStartTime}
                      readOnly
                      style={{ backgroundColor: '#f5f5f5' }}
                    />
                  </Form.Item>
                </Col>
                {/* <Col span={12}>
                  <div style={{ marginBottom: 24 }}>
                    <div style={{ fontWeight: 500, marginBottom: 8, color: 'rgba(0, 0, 0, 0.88)' }}>Dịch vụ</div>
                    <div style={{ padding: '4px 11px', minHeight: '32px', border: '1px solid #d9d9d9', borderRadius: '6px', backgroundColor: '#fafafa' }}>
                      {appointment?.tenDichVu || 'Chưa có dịch vụ'}
                    </div>
                  </div>
                </Col> */}
              </Row>
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
                    <DatePicker
                      style={{ width: '100%' }}
                      format="DD/MM/YYYY"
                      onChange={(date) => {
                        if (date && dayjs(date).isValid()) setSelectedReexamDate(dayjs(date).format('YYYY-MM-DD'));
                        else setSelectedReexamDate(null);
                        // Reset slot when date changes
                        setSelectedSlot(null);
                        form.setFieldsValue({ gioTaiKham: null });
                      }}
                    />
                  </Form.Item>
                  </Col>
                  <Col span={12}> 
                  {/* Box for selecting available slots */}
                  <Form.Item label="Khung giờ tái khám" name="gioTaiKham">
                    <Select
                      placeholder="Chọn khung giờ"
                      value={selectedSlot}
                      onChange={value => {
                        setSelectedSlot(value);
                        form.setFieldsValue({ gioTaiKham: value });
                      }}
                      disabled={loadingSlots || availableSlots.length === 0}
                      allowClear
                    >
                      {availableSlots.map((slot: any) => (
                        <Select.Option key={slot.gioBatDau} value={slot.gioBatDau}>
                          {slot.gioBatDau} - {slot.gioKetThuc}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                  {loadingSlots && <Spin size="small" />}
                  {slotError && <Alert type="error" message={slotError} />}
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
                  showSearch
                  filterOption={(input, option) => {
                    const label = option?.children || '';
                    // Loại bỏ dấu và so sánh không phân biệt hoa thường
                    const normalize = (str: string) => removeDiacritics(str).toLowerCase();
                    return normalize(label as string).includes(normalize(input));
                  }}
                  onChange={(value: number[]) => {
                    const newServices = value.map(maDichVu => {
                      const existed = selectedServices.find(s => s.maDichVu === maDichVu);
                      const service = services.find(s => s.maDichVu === maDichVu);
                      return existed ? existed : (service ? { maDichVu: service.maDichVu, tenDichVu: service.tenDichVu, gia: service.gia } : null);
                    }).filter(Boolean) as { maDichVu: number, tenDichVu: string, gia: number }[];
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
                  {/* Tổng tiền dịch vụ */}
                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 12, fontWeight: 600, fontSize: 16 }}>
                    Tổng tiền dịch vụ:&nbsp;
                    <span style={{ color: '#d4380d' }}>
                      {selectedServices.reduce((sum, s) => sum + (s.gia || 0), 0).toLocaleString('vi-VN')} VNĐ
                    </span>
                  </div>
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
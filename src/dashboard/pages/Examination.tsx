import { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Row, Col, Form, Button, Card, Modal, Spin, Alert, Input, DatePicker, Select, notification, InputNumber, Upload, message } from 'antd';
import { UploadOutlined, DeleteOutlined } from '@ant-design/icons';
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
  const maBenhAnFromState = location.state?.maBenhAn;
  const effectiveMaBenhAn = maBenhAnFromState || reexamId;
  const [isReexam, setIsReexam] = useState(!!reexamId);
  const [reexamLoading, setReexamLoading] = useState(false);
  const storageKey = `exam_${maLichHen || 'walk-in'}`;
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
  const [selectedImages, setSelectedImages] = useState<Array<{ file?: File, url?: string, mota: string }>>([]);

  // Tạo state riêng cho ảnh từ backend
  const [backendImages, setBackendImages] = useState<Array<{ url: string, mota: string }>>([]);

  // Xác định currentDraftId ưu tiên theo maLichHen, sau đó maBenhNhan, cuối cùng là walk-in
  const getCurrentDraftId = () => {
    if (location.state && (location.state as any).appointment) {
      const appt = (location.state as any).appointment;
      if (appt.maLichHen) return `lichhen_${appt.maLichHen}`;
      if (appt.maBenhNhan) return `benhnhan_${appt.maBenhNhan}`;
    }
    // Nếu không có, thử lấy từ localStorage draft_examination_* gần nhất
    const keys = Object.keys(localStorage).filter(k => k.startsWith('draft_examination_'));
    if (keys.length > 0) {
      const lastKey = keys[keys.length - 1];
      const match = lastKey.match(/draft_examination_(.+)$/);
      if (match) return match[1];
    }
    return 'walk-in';
  };

  // Cập nhật currentDraftId khi location.state thay đổi
  useEffect(() => {
    const newDraftId = getCurrentDraftId();
    setCurrentDraftId(newDraftId);
  }, [location.state]);

  const [currentDraftId, setCurrentDraftId] = useState(getCurrentDraftId());

  // Key cho localStorage
  const draftKey = useMemo(() => `draft_examination_${currentDraftId}`, [currentDraftId]);
  const imageDraftKey = useMemo(() => `draft_images_${currentDraftId}`, [currentDraftId]);

  // Initialize form with empty values to prevent connection warning
  useEffect(() => {
    form.setFieldsValue({
      hoTen: '',
      soDienThoaiBenhNhan: '',
      ngaySinh: null,
      gioiTinh: null,
      email: '',
      diaChi: '',
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

  // Khởi tạo appointment với dữ liệu từ location.state hoặc trống
  const getInitialAppointment = () => {
    if (location.state && (location.state as any).appointment) {
      return (location.state as any).appointment;
    }
    return {
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
  };
  const [appointment, setAppointment] = useState(getInitialAppointment());

  // Khôi phục dữ liệu từ localStorage khi currentDraftId thay đổi
  useEffect(() => {
    const draft = localStorage.getItem(draftKey);
    if (draft) {
      try {
        const parsed = JSON.parse(draft);
        console.log('Restoring draft data for:', currentDraftId, parsed);
        
        // Khôi phục appointment nếu không có từ location.state
        if (!(location.state && (location.state as any).appointment) && parsed.appointment) {
          setAppointment(parsed.appointment);
        }
        
        // Khôi phục selectedServices
        if (parsed.selectedServices) {
          setSelectedServices(parsed.selectedServices);
        }
        
        // Khôi phục selectedDrugs
        if (parsed.selectedDrugs) {
          setSelectedDrugs(parsed.selectedDrugs);
        }
        
        // Khôi phục form values
        const { selectedServices: draftServices, appointment: draftAppointment, selectedDrugs: draftDrugs, ...formValues } = parsed;
        const dateFields = ['ngaySinh', 'ngayTaiKham', 'ngayHen', 'ngayTaoBenhAn', 'ngayTao'];
        const normalized = normalizeDateFields(formValues, dateFields);
        form.setFieldsValue(normalized);
        
        // Khôi phục medicalRecord
        if (parsed.lyDoKham || parsed.chanDoan || parsed.ghiChuDieuTri || parsed.ngayTaiKham || parsed.tienSuBenh || parsed.diUng) {
          setMedicalRecord({
            lyDoKham: parsed.lyDoKham || '',
            chanDoan: parsed.chanDoan || '',
            ghiChuDieuTri: parsed.ghiChuDieuTri || '',
            ngayTaiKham: parsed.ngayTaiKham || '',
            tienSuBenh: parsed.tienSuBenh || '',
            diUng: parsed.diUng || ''
          });
        }
      } catch (error) {
        console.error('Error restoring draft data:', error);
      }
    } else {
      // Nếu không có draft, reset về trạng thái ban đầu
      console.log('No draft found for:', currentDraftId);
    }
  }, [currentDraftId, draftKey, form, location.state]);

  // Đảm bảo appointment từ location.state được ưu tiên
  useEffect(() => {
    if (location.state && (location.state as any).appointment) {
      const appt = (location.state as any).appointment;
      console.log('Setting appointment from location.state:', appt);
      setAppointment(appt);
      setLoading(false); // Đảm bảo loading kết thúc khi có dữ liệu từ location.state
    }
  }, [location.state]);

  useEffect(() => {
    const fetchAppointment = async () => {
      try {
        // Chỉ fetch từ API nếu có maLichHen và không có appointment từ location.state
        if (maLichHen && !(location.state && (location.state as any).appointment)) {
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
            if (Array.isArray(data.danhSachAnhBenhAn)) {
              setBackendImages(data.danhSachAnhBenhAn.map((img: any) => ({
                url: img.url,
                mota: img.moTa || ''
              })));
            } else {
              setBackendImages([]);
            }
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Có lỗi xảy ra khi tải dữ liệu');
      } finally {
        setLoading(false);
      }
    };
    fetchAppointment();
  }, [maLichHen, location.state]);

  // Đảm bảo loading state được set đúng khi không có dữ liệu cần fetch
  useEffect(() => {
    if (!maLichHen && !(location.state && (location.state as any).appointment)) {
      setLoading(false);
    }
  }, [maLichHen, location.state]);

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
    if (effectiveMaBenhAn) {
      setReexamLoading(true);
      getMedicalRecordById(Number(effectiveMaBenhAn))
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
          if (Array.isArray(data.danhSachAnhBenhAn)) {
            setBackendImages(data.danhSachAnhBenhAn.map((img: any) => ({
              url: img.url,
              mota: img.moTa || ''
            })));
          }
        })
        .catch(err => setError(err.message))
        .finally(() => setReexamLoading(false));
    }
  }, [effectiveMaBenhAn, form]);

  // Khôi phục selectedImages từ localStorage khi currentDraftId thay đổi
  useEffect(() => {
    const draft = localStorage.getItem(imageDraftKey);
    if (draft) {
      const arr = JSON.parse(draft);
      Promise.all(arr.map(async (img: any) => {
        const file = await base64ToFile(img.base64, img.name, img.type);
        return { file, mota: img.mota };
      })).then(setSelectedImages);
    } else {
      setSelectedImages([]);
    }
  }, [imageDraftKey]);

  // Lưu selectedImages vào localStorage khi thay đổi
  useEffect(() => {
    const saveImages = async () => {
      if (selectedImages.length === 0) {
        localStorage.removeItem(imageDraftKey);
        return;
      }
      const arr = await Promise.all(
        selectedImages
          .filter(img => img.file && img.file instanceof File)
          .map(async (img) => {
            const base64 = await fileToBase64(img.file as File);
            return { mota: img.mota, base64, name: img.file!.name, type: img.file!.type };
          })
      );
      localStorage.setItem(imageDraftKey, JSON.stringify(arr));
    };
    saveImages();
  }, [selectedImages, imageDraftKey]);

  // Lưu draft_examination cũng theo key draftKey
  const saveDraft = (formValues: any, services: any) => {
    const draftData = {
      ...formValues,
      appointment: appointment,
      selectedServices: services,
      selectedDrugs: selectedDrugs
    };
    console.log('Saving draft data for:', currentDraftId, draftData);
    localStorage.setItem(draftKey, JSON.stringify(draftData));
  };

  const handleSubmit = async (values: any) => {
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    // Lấy khung giờ đã chọn
    const selectedSlotObj = availableSlots.find(slot => slot.gioBatDau === values.gioTaiKham);
    
    // Khi submit, chỉ upload ảnh mới (có file)
    const filesToUpload = selectedImages
      .map(img => img.file)
      .filter((file): file is File => file instanceof File);
    const danhSachAnhBenhAn = selectedImages.map(img => ({ mota: img.mota }));
    const examData = {
      maBenhNhan: appointment?.maBenhNhan || null,
      maLichHen: isReexam ? null : (maLichHen ? parseInt(maLichHen) : null),
      maBacSi: userData.maBacSi,
      ngaySinh: values.ngaySinh ? format(new Date(values.ngaySinh), 'yyyy-MM-dd') : '',
      hoTen: values.hoTen,
      gioiTinh: values.gioiTinh || null,
      soDienThoai: values.soDienThoaiBenhNhan,
      email: values.email || '',
      diaChi: values.diaChi || '',
      lyDoKham: values.lyDoKham,
      chanDoan: values.chanDoan,
      ghiChuDieuTri: values.ghiChuDieuTri,
      ngayTaiKham: values.ngayTaiKham ? format(new Date(values.ngayTaiKham), 'yyyy-MM-dd') : '',
      gioBatDau: values.gioTaiKham || '',
      gioKetThuc: selectedSlotObj?.gioKetThuc || '',
      tienSuBenh: values.tienSuBenh,
      diUng: values.diUng,
      danhSachAnhBenhAn,
      danhSachDichVu: selectedServices.map(s => ({ maDichVu: s.maDichVu, gia: s.gia })),
      danhSachThuoc: selectedDrugs.map(drug => ({
        maThuoc: drug.maThuoc,
        lieuDung: '500',
        tanSuat: 'Kháng sinh fluoroquinolone',
        thoiDiem: '',
        thoiGianDieuTri: 7,
        soLuong: 1,
        donViDung: 'mg',
        ghiChu: '',
        lyDoDonThuoc: drug.tenThuoc || 'Kháng sinh fluoroquinolone'
      })),
      ghiChuDonThuoc: 'Bệnh nhân cần tuân thủ đúng liều lượng và thời gian dùng thuốc'
    };

    try {
      console.log('Submitting exam data:', examData);
      console.log('Selected images:', filesToUpload.length);
      
      let createdRecord;
      if (appointment?.maBenhAn) {
        await updateMedicalRecord(appointment.maBenhAn, examData);
        notification.success({ message: 'Thành công', description: 'Cập nhật bệnh án thành công!' });
        createdRecord = { maBenhAn: appointment.maBenhAn };
      } else {
        const result = await createMedicalExam(examData, filesToUpload);
        notification.success({ message: 'Thành công', description: 'Tạo bệnh án thành công!' });
        createdRecord = result;
      }
      
      localStorage.removeItem(imageDraftKey);
      localStorage.removeItem(storageKey);
      localStorage.removeItem(draftKey);
      
      // Fetch full details from backend after creation
      if (createdRecord?.maBenhAn) {
        const detail = await getMedicalRecordById(createdRecord.maBenhAn);
        // You can use 'detail' for further logic or navigation if needed
        // For now, just navigate away
      }
      navigate('/dashboard/appointments');
    } catch (err: any) {
      console.error('Submit error:', err);
      
      // Kiểm tra xem có phải lỗi token không
      if (err.message && err.message.includes('Phiên đăng nhập đã hết hạn')) {
        notification.error({ 
          message: 'Phiên đăng nhập hết hạn', 
          description: 'Vui lòng đăng nhập lại để tiếp tục' 
        });
        // Redirect về trang login
        navigate('/dashboard/signin');
        return;
      }
      
      // Các lỗi khác
      notification.error({ 
        message: 'Lỗi', 
        description: err instanceof Error ? err.message : 'Có lỗi xảy ra khi lưu bệnh án' 
      });
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
        gioiTinh: null, // Có thể lấy từ appointment nếu có
        email: '', // Có thể lấy từ appointment nếu có
        diaChi: '', // Có thể lấy từ appointment nếu có
        ngayHen: appointment.ngayHen ? dayjs(appointment.ngayHen) : null,
        gioBatDau: examStartTime,
        lyDoKham: medicalRecord.lyDoKham || '',
        chanDoan: medicalRecord.chanDoan || '',
        ghiChuDieuTri: medicalRecord.ghiChuDieuTri || '',
        ngayTaiKham: medicalRecord.ngayTaiKham ? dayjs(medicalRecord.ngayTaiKham) : null,
        tienSuBenh: medicalRecord.tienSuBenh || '',
        diUng: medicalRecord.diUng || ''
      };
      console.log('Setting form values from appointment/medicalRecord:', formValues);
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

  // Helper: convert File to base64
  function fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }
  // Helper: convert base64 to File
  function base64ToFile(base64: string, name: string, type: string): Promise<File> {
    return fetch(base64)
      .then(res => res.arrayBuffer())
      .then(buf => new File([buf], name, { type }));
  }

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

  // Trước khi render ảnh từ backendImages
  console.log('backendImages:', backendImages);

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
                  <Form.Item name="gioiTinh" label="Giới tính">
                    <Select placeholder="Chọn giới tính" allowClear>
                      <Option value="Nam">Nam</Option>
                      <Option value="Nữ">Nữ</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="email" label="Email">
                    <Input type="email" placeholder="example@email.com" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="diaChi" label="Địa chỉ">
                    <Input.TextArea rows={2} placeholder="Nhập địa chỉ" />
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
                <Col span={24}>
                  <Form.Item label="Ảnh bệnh án">
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(2, 340px)',
                        gap: 24,
                        alignItems: 'flex-start',
                        justifyContent: 'flex-start',
                        width: '100%',
                        maxWidth: 700
                      }}
                    >
                      {/* Ảnh từ backend */}
                      {backendImages.map((img, idx) => (
                        <div key={img.url + idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 320 }}>
                          <div style={{ position: 'relative', width: 320, height: 180, marginBottom: 4 }}>
                            <img
                              src={img.url}
                              alt={img.url}
                              style={{ width: 320, height: 180, objectFit: 'cover', borderRadius: 8, border: '1px solid #eee' }}
                            />
                          </div>
                          <Input
                            style={{ width: 320, fontSize: 14 }}
                            placeholder="Mô tả ảnh"
                            value={img.mota}
                            disabled
                          />
                        </div>
                      ))}
                      {/* Ảnh upload mới */}
                      {selectedImages.map((img, idx) => {
                        const key = img.file && img.file instanceof File && img.file.name ? img.file.name + idx : idx;
                        const src = img.file && img.file instanceof File ? URL.createObjectURL(img.file) : '';
                        const alt = img.file && img.file instanceof File && img.file.name ? img.file.name : '';
                        return (
                          <div key={key} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 320 }}>
                            <div style={{ position: 'relative', width: 320, height: 180, marginBottom: 4 }}>
                              <img
                                src={src}
                                alt={alt}
                                style={{ width: 320, height: 180, objectFit: 'cover', borderRadius: 8, border: '1px solid #eee' }}
                              />
                              <span
                                style={{ position: 'absolute', top: 2, right: 2, cursor: 'pointer', background: '#fff', borderRadius: '50%', padding: 2, border: '1px solid #ccc' }}
                                onClick={() => setSelectedImages(prev => prev.filter((_, i) => i !== idx))}
                                title="Xóa ảnh"
                              >
                                ×
                              </span>
                            </div>
                            <Input
                              style={{ width: 320, fontSize: 14 }}
                              placeholder="Nhập mô tả ảnh"
                              value={img.mota}
                              onChange={e => {
                                const value = e.target.value;
                                setSelectedImages(prev => prev.map((item, i) => i === idx ? { ...item, mota: value } : item));
                              }}
                              disabled={!!img.url}
                            />
                          </div>
                        );
                      })}
                      {/* Nút upload giữ nguyên logic */}
                      {selectedImages.filter(img => img.file && img.file instanceof File).length < 8 && (
                        <Upload
                          showUploadList={false}
                          beforeUpload={(file) => {
                            const isImage = file.type.startsWith('image/');
                            if (!isImage) {
                              message.error('Chỉ có thể upload file ảnh!');
                              return false;
                            }
                            const isLt5M = file.size / 1024 / 1024 < 5;
                            if (!isLt5M) {
                              message.error('Ảnh phải nhỏ hơn 5MB!');
                              return false;
                            }
                            setSelectedImages(prev => [...prev, { file, mota: '' }]);
                            return false;
                          }}
                          multiple
                        >
                          <div style={{ width: 320, height: 180, border: '1px dashed #d9d9d9', borderRadius: 8, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                            <UploadOutlined style={{ fontSize: 32, color: '#999' }} />
                            <div style={{ marginTop: 8, color: '#666', fontSize: 14 }}>Upload</div>
                          </div>
                        </Upload>
                      )}
                    </div>
                    <div style={{ fontSize: '12px', color: '#666', marginTop: 8 }}>
                      Có thể upload tối đa 8 ảnh, mỗi ảnh dưới 5MB
                    </div>
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
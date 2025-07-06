// Shared types for Profile components

// User Information
export interface UserInfo {
  maNguoiDung: number;
  tenDangNhap: string;
  email: string;
  hoTen: string;
  soDienThoai: string;
  ngaySinh: string;
  gioiTinh: string;
  diaChi: string;
  tienSuBenh?: string;
  diUng?: string;
  maBenhNhan: number;
}

// Appointment related types
export interface Appointment {
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
  ghiChu?: string;
  lydo?: string | null;
  thoiGian: number;
}

export interface Doctor {
  maBacSi: number;
  hoTen: string;
}

export interface TimeSlot {
  gioBatDau: string;
  gioKetThuc: string;
  daDat: boolean;
  trangThai: string;
}

export interface Service {
  MaDv: string;
  TenDv: string;
}

// Medical Record types
export interface MedicalRecord {
  maBenhAn: number;
  ngayTao: string;
  maBacSi: number;
  tenBacSi: string;
  maBenhNhan: number;
  tenBenhNhan: string;
  soDienThoai: string;
  hoTen: string;
  ngaySinh: string;
  gioiTinh: string | null;
  email: string;
  diaChi: string;
  tienSuBenh?: string;
  diUng?: string;
  lyDoKham?: string;
  chanDoan?: string;
  ghiChuDieuTri?: string;
  ngayTaiKham?: string | null;
}

export interface MedicalService {
  maDichVu: number;
  tenDichVu: string;
  moTa: string;
  gia: number;
}

export interface MedicalPrescription {
  maChiTiet: number;
  maThuoc: number;
  tenThuoc: string;
  hoatChat: string;
  hamLuong: string;
  dangBaoChe: string;
  lieudung: string;
  tanSuat: string;
  thoiDiem: string;
  thoiGianDieuTri: number;
  soLuong: number;
  donViDung: string;
  donGia: number;
  thanhTien: number;
  ghiChu: string;
  lyDoDonThuoc: string;
}

export interface MedicalRecordDetail extends MedicalRecord {
  danhSachDichVu?: MedicalService[];
  danhSachThuoc?: MedicalPrescription[];
  moTaChanDoan?: string;
  ghiChuDonThuoc?: string;
  danhSachAnhBenhAn?: Array<{
    maBenhAn: number;
    maAnh: number;
    url: string;
    moTa: string;
    file?: any;
  }>;
}

// Component Props types
export interface ProfileSidebarProps {
  userInfo: UserInfo;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export interface ProfileInfoCardProps {
  userInfo: UserInfo;
  isEditingProfile: boolean;
  setIsEditingProfile: (val: boolean) => void;
  setUserInfo: React.Dispatch<React.SetStateAction<UserInfo | null>>;
  handleUpdateProfile: () => void;
}

export interface ProfileAppointmentsProps {
  appointments: Appointment[];
  userInfo: UserInfo;
  showAppointmentDetail: boolean;
  setShowAppointmentDetail: (val: boolean) => void;
  selectedAppointment: Appointment | null;
  setSelectedAppointment: (apt: Appointment | null) => void;
  isEditing: boolean;
  setIsEditing: (val: boolean) => void;
  editFormData: any;
  setEditFormData: (data: any) => void;
  doctors: Doctor[];
  editAvailableSlots: TimeSlot[];
  editSlotsLoading: boolean;
  editSlotsError: string | null;
  fetchAppointmentDetail: (maLichHen: number) => void;
  handleEditClick: (apt: Appointment) => void;
  handleEditFormChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  handleEditSubmit: (e: React.FormEvent) => void;
  handleCancelAppointment: (apt: Appointment) => void;
  handleBack: () => void;
  navigate: any;
  dichvus: Service[];
  getStatusBadge: (status: string) => string;
  formatDate: (dateStr: string) => string;
}

export interface ProfileMedicalRecordsProps {
  maBenhNhan: number;
}

// Invoice types
export interface InvoiceItem {
  maMuc: number;
  maHoaDon: number;
  maBenhAnDichVu: number | null;
  moTa: string;
  soLuong: number;
  donGia: number;
  thanhTien: number;
  ngayTao: string;
}

export interface Invoice {
  maHoaDon: number;
  maBenhNhan: number;
  tenBenhNhan: string;
  soDienThoai: string;
  email: string;
  maLichHen: number | null;
  tongTien: number;
  thanhTien: number;
  ngayHoaDon: string;
  trangThai: string;
  nguoiTao: string | null;
  tenNguoiTao: string | null;
  ngayTao: string;
  chiTietHoaDon: InvoiceItem[];
}

export interface InvoiceDetail extends Invoice {} 
import { useState, useEffect } from 'react';
import { Calendar, User, Clock, Edit, Trash2, Eye, Phone, Mail, MapPin, Heart, FileText, Bell, Settings, LogOut, ArrowLeft } from 'lucide-react';
import { getUserProfile, updateUserProfile, getPatientAppointments, cancelAppointment, getAvailableTimeSlots, updateAppointment } from '../services/userService';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { useSpring, animated } from '@react-spring/web';
import ProfileSidebar from '../components/profile/ProfileSidebar';
import ProfileInfoCard from '../components/profile/ProfileInfoCard';
import ProfileAppointments from '../components/profile/ProfileAppointments';
import ProfileMedicalRecords from '../components/profile/ProfileMedicalRecords';
import ProfileInvoices from '../components/profile/ProfileInvoices';
import { UserInfo, Appointment, TimeSlot, Doctor, Service } from '../components/profile/types';

// Hàm chuẩn hóa userInfo
const normalizeUserInfo = (info: any): UserInfo => ({
  ...info,
  hoTen: info.hoTen || '',
  soDienThoai: info.soDienThoai || '',
  email: info.email || '',
  diaChi: info.diaChi || '',
  ngaySinh: info.ngaySinh || '',
  gioiTinh: info.gioiTinh || '',
  tienSuBenh: info.tienSuBenh || '',
  diUng: info.diUng || '',
});

const UserProfile = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [showAppointmentDetail, setShowAppointmentDetail] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState({
    maBenhNhan: 0,
    maBacSi: '',
    maDichVu: '',
    ngayHen: '',
    gioBatDau: '',
    gioKetThuc: '',
    maTrangThai: 1,
    ghiChu: ''
  });

  // State for doctors and available time slots for editing form
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [editAvailableSlots, setEditAvailableSlots] = useState<TimeSlot[]>([]);
  const [editSlotsLoading, setEditSlotsLoading] = useState(false);
  const [editSlotsError, setEditSlotsError] = useState<string | null>(null);

  // Dữ liệu dịch vụ tạm thời
  const dichvus: Service[] = [
    { MaDv: "1", TenDv: "Tẩy trắng răng" },
    { MaDv: "2", TenDv: "Niềng răng" },
    { MaDv: "3", TenDv: "Nhổ răng khôn" },
    { MaDv: "4", TenDv: "Trám răng" }
  ];

  const navigate = useNavigate();
  const location = useLocation();

  // Animation for the main content
  const springProps = useSpring({
    opacity: loading ? 0 : 1,
    transform: loading ? 'translateY(50px)' : 'translateY(0px)',
    config: { tension: 180, friction: 12 },
  });

  // Function to fetch appointments
  const fetchAppointments = async (patientId: number) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }
      const appointmentsData = await getPatientAppointments(token, patientId);
      setAppointments(appointmentsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch appointments');
    }
  };

  // Function to fetch appointment details
  const fetchAppointmentDetail = async (maLichHen: number) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await axios.get(`/api/appointments/${maLichHen}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setSelectedAppointment(response.data);
      setShowAppointmentDetail(true);
      setIsEditing(false);
    } catch (error) {
      console.error('Error fetching appointment details:', error);
      alert('Không thể tải thông tin chi tiết lịch hẹn');
    }
  };

  // Function to fetch doctors
  const fetchDoctors = async () => {
    try {
      const response = await axios.get('/api/public/bac-si');
      setDoctors(response.data);
    } catch (error) {
      console.error('Error fetching doctors:', error);
      // Optionally set an error state for doctors
    }
  };

  // Function to fetch available time slots for editing
  const fetchEditAvailableSlots = async (maBacSi: string, ngayHen: string) => {
    if (maBacSi && ngayHen) {
      try {
        setEditSlotsLoading(true);
        setEditSlotsError(null); // Clear previous errors
        const token = localStorage.getItem('token');
        if (!token) return;

        const slots = await getAvailableTimeSlots(token, parseInt(maBacSi), ngayHen);
        setEditAvailableSlots(slots);
      } catch (error) {
        console.error('Error fetching edit available slots:', error);
        setEditSlotsError('Không thể tải khung giờ trống. Vui lòng thử lại sau.');
        setEditAvailableSlots([]); // Clear slots on error
      } finally {
        setEditSlotsLoading(false);
      }
    } else {
      setEditAvailableSlots([]);
      setEditSlotsError(null);
    }
  };

  // Function to handle back button
  const handleBack = () => {
    setShowAppointmentDetail(false);
    setSelectedAppointment(null);
    setIsEditing(false);
    setEditAvailableSlots([]); // Clear slots when going back
    setEditSlotsError(null); // Clear errors when going back
  };

  useEffect(() => {
    if (location.state && location.state.activeTab) {
      setActiveTab(location.state.activeTab);
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No authentication token found');
        }

        const profileData = await getUserProfile(token);
        setUserInfo(normalizeUserInfo(profileData));

        if (profileData.maBenhNhan) {
          fetchAppointments(profileData.maBenhNhan);
        }
        fetchDoctors(); // Fetch doctors on initial load

      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Effect to fetch available slots when doctor or date changes in edit form
  useEffect(() => {
    if (isEditing) {
      fetchEditAvailableSlots(editFormData.maBacSi, editFormData.ngayHen);
    }
  }, [editFormData.maBacSi, editFormData.ngayHen, isEditing]);

  const handleUpdateProfile = async () => {
    if (window.confirm('Bạn có chắc chắn muốn lưu thay đổi thông tin cá nhân không?')) {
      try {
        const token = localStorage.getItem('token');
        if (!token || !userInfo) return;

        await updateUserProfile(token, userInfo);
        setIsEditingProfile(false);
        alert('Cập nhật thông tin cá nhân thành công!');
      } catch (err) {
        if (axios.isAxiosError(err) && err.response && err.response.data && err.response.data.message) {
          alert(`Lỗi cập nhật thông tin: ${err.response.data.message}`);
        } else {
          setError(err instanceof Error ? err.message : 'Failed to update profile');
        }
      }
    }
  };

  const handleCancelAppointment = async (appointment: Appointment) => {
    const reason = window.prompt('Vui lòng nhập lý do hủy lịch hẹn:');
    if (reason === null) return;
    
    if (window.confirm('Bạn có chắc chắn muốn hủy lịch hẹn này không?')) {
      try {
        const token = localStorage.getItem('token');
        if (!token || !userInfo) return;

        await cancelAppointment(token, { ...appointment, lydo: reason });
        if (userInfo.maBenhNhan) {
          fetchAppointments(userInfo.maBenhNhan);
        }
        alert('Lịch hẹn đã được hủy thành công.');
      } catch (err) {
        if (axios.isAxiosError(err) && err.response && err.response.data && err.response.data.message) {
          alert(`Lỗi hủy lịch hẹn: ${err.response.data.message}`);
        } else {
          setError(err instanceof Error ? err.message : 'Failed to cancel appointment');
        }
      }
    }
  };

  // Function to handle edit button click
  const handleEditClick = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    const initialFormData = {
      maBenhNhan: appointment.maBenhNhan,
      maBacSi: String(appointment.maBacSi),
      maDichVu: String(appointment.maDichVu),
      ngayHen: appointment.ngayHen,
      // Set initial time slot value for the dropdown
      gioBatDau: appointment.gioBatDau,
      gioKetThuc: appointment.gioKetThuc,
      maTrangThai: appointment.maTrangThai,
      ghiChu: appointment.ghiChu || ''
    };
    setEditFormData(initialFormData);
    setShowAppointmentDetail(true);
    setIsEditing(true);
    // Fetch available slots immediately when opening edit form
    // This will ensure the dropdown options are available when the initial value is set.
    fetchEditAvailableSlots(initialFormData.maBacSi, initialFormData.ngayHen);
  };

  // Function to handle form input changes
  const handleEditFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    let updatedFormData = { ...editFormData, [name]: value };

    // If changing date or doctor, reset time slot
    if (name === 'ngayHen' || name === 'maBacSi') {
        updatedFormData.gioBatDau = '';
        updatedFormData.gioKetThuc = '';
        // Clear available slots when doctor or date changes until new slots are fetched
        setEditAvailableSlots([]);
        setEditSlotsError(null);
        setEditSlotsLoading(false); // Reset loading state explicitly
    }

    // If changing time slot (from the dropdown), parse value
    if (name === 'gioKham') {
        const [start, end] = value.split('-');
        updatedFormData.gioBatDau = start || '';
        updatedFormData.gioKetThuc = end || '';
    }

    setEditFormData(updatedFormData);
  };

  // Function to check if form data has changed
  const hasFormDataChanged = (original: Appointment, edited: typeof editFormData) => {
    // Convert original maBacSi and maDichVu to string for comparison
    const originalMaBacSiStr = String(original.maBacSi);
    const originalMaDichVuStr = String(original.maDichVu);
    // Construct original and edited time slot strings for easy comparison
    const originalTimeSlotStr = `${original.gioBatDau}-${original.gioKetThuc}`;
    const editedTimeSlotStr = `${edited.gioBatDau}-${edited.gioKetThuc}`;

    return (
      originalMaDichVuStr !== edited.maDichVu ||
      originalMaBacSiStr !== edited.maBacSi ||
      original.ngayHen !== edited.ngayHen ||
      originalTimeSlotStr !== editedTimeSlotStr || // Compare combined time string
      original.ghiChu !== edited.ghiChu
    );
  };

  // Function to handle form submission
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAppointment) return;

    // Check if there are any changes
    if (!hasFormDataChanged(selectedAppointment, editFormData)) {
      setIsEditing(false);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      // Check available time slots only if time/date/doctor changed
      let selectedTimeSlot = null;
      const originalTimeSlot = `${selectedAppointment.gioBatDau}-${selectedAppointment.gioKetThuc}`;
      const newTimeSlot = `${editFormData.gioBatDau}-${editFormData.gioKetThuc}`;

      // Check if date, doctor, or time slot has changed
      if (editFormData.ngayHen !== selectedAppointment.ngayHen ||
          editFormData.maBacSi !== String(selectedAppointment.maBacSi) ||
          newTimeSlot !== originalTimeSlot) {

        const availableSlots = await getAvailableTimeSlots(token, parseInt(editFormData.maBacSi), editFormData.ngayHen);

        // Find the selected time slot in the newly fetched available slots
        selectedTimeSlot = availableSlots.find(
          (slot: TimeSlot) => 
            slot.gioBatDau === editFormData.gioBatDau && 
            slot.gioKetThuc === editFormData.gioKetThuc
        );

        // If the selected time slot is not found in the available slots or is already booked, show error
        if (!selectedTimeSlot || selectedTimeSlot.daDat) {
          alert('Khung giờ này không còn trống hoặc không hợp lệ. Vui lòng chọn khung giờ khác.');
          return;
        }
      } else {
         // If time/date/doctor didn't change, validate if the original slot is still a valid slot for the selected doctor and date
         // We still need to fetch to validate against the most current availability
         const availableSlots = await getAvailableTimeSlots(token, parseInt(editFormData.maBacSi), editFormData.ngayHen); 
         selectedTimeSlot = availableSlots.find(
          (slot: TimeSlot) => 
            slot.gioBatDau === editFormData.gioBatDau && 
            slot.gioKetThuc === editFormData.gioKetThuc
         );

         if (!selectedTimeSlot) {
           alert('Khung giờ ban đầu không còn hợp lệ với bác sĩ và ngày đã chọn. Vui lòng chọn khung giờ khác.');
           return;
         }
         // If selectedTimeSlot is found here, it means the original slot is still a valid offering,
         // regardless of its `daDat` status because the user is editing an existing booking.
      }

      // Prepare data for API
      const appointmentData = {
        maBenhNhan: selectedAppointment.maBenhNhan,
        maBacSi: parseInt(editFormData.maBacSi), // Ensure integer
        maDichVu: parseInt(editFormData.maDichVu), // Ensure integer
        ngayHen: editFormData.ngayHen,
        gioBatDau: editFormData.gioBatDau,
        gioKetThuc: editFormData.gioKetThuc,
        maTrangThai: 1,
        ghiChu: editFormData.ghiChu
      };

      await updateAppointment(token, selectedAppointment.maLichHen, appointmentData);

      // Refresh appointments after successful update
      if (userInfo?.maBenhNhan) {
        fetchAppointments(userInfo.maBenhNhan);
      }
      
      setIsEditing(false);
      alert('Cập nhật lịch hẹn thành công!');
    } catch (error) {
      console.error('Error updating appointment:', error);
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        alert(`Lỗi cập nhật lịch hẹn: ${error.response.data.message}`);
      } else {
        alert('Không thể cập nhật lịch hẹn. Vui lòng thử lại sau.');
      }
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Đã đặt': return 'badge bg-primary';
      case 'Đã hoàn thành': return 'badge bg-success';
      case 'Đã hủy': return 'badge bg-danger';
      default: return 'badge bg-secondary';
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    // Add one day to the date to account for timezone issues if the date string is YYYY-MM-DD
    // This is a common workaround for date inputs in React/JS
    const [year, month, day] = dateStr.split('-').map(Number);
    const correctedDate = new Date(year, month - 1, day);

    return correctedDate.toLocaleDateString('vi-VN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const upcomingAppointments = appointments.filter(apt => apt.maTrangThai === 1);
  const pastAppointments = appointments.filter(apt => apt.maTrangThai !== 1);

  if (loading) {
    return <div className="text-center p-5">Đang tải...</div>;
  }

  if (error) {
    return <div className="alert alert-danger m-3">{error}</div>;
  }

  if (!userInfo) {
    return <div className="alert alert-warning m-3">Không có dữ liệu người dùng</div>;
  }

  return (
    <>
      <div className="bg-light" style={{minHeight: '100vh'}}>
        <div className="container-fluid py-4">
          <div className="row g-4">
            {/* Sidebar */}
            <div className="col-lg-3">
              <ProfileSidebar 
                userInfo={userInfo} 
                activeTab={activeTab} 
                setActiveTab={setActiveTab} 
              />
            </div>

            {/* Main Content */}
            <animated.div className="col-lg-9" style={springProps}>
              {activeTab === 'profile' && userInfo && (
                <ProfileInfoCard
                  userInfo={userInfo}
                  isEditingProfile={isEditingProfile}
                  setIsEditingProfile={setIsEditingProfile}
                  setUserInfo={setUserInfo}
                  handleUpdateProfile={handleUpdateProfile}
                />
              )}

              {activeTab === 'appointments' && (
                <>
                  <ProfileAppointments
                    appointments={appointments}
                    userInfo={userInfo}
                    showAppointmentDetail={showAppointmentDetail}
                    setShowAppointmentDetail={setShowAppointmentDetail}
                    selectedAppointment={selectedAppointment}
                    setSelectedAppointment={setSelectedAppointment}
                    isEditing={isEditing}
                    setIsEditing={setIsEditing}
                    editFormData={editFormData}
                    setEditFormData={setEditFormData}
                    doctors={doctors}
                    editAvailableSlots={editAvailableSlots}
                    editSlotsLoading={editSlotsLoading}
                    editSlotsError={editSlotsError}
                    fetchAppointmentDetail={fetchAppointmentDetail}
                    handleEditClick={handleEditClick}
                    handleEditFormChange={handleEditFormChange}
                    handleEditSubmit={handleEditSubmit}
                    handleCancelAppointment={handleCancelAppointment}
                    handleBack={handleBack}
                    navigate={navigate}
                    dichvus={dichvus}
                    getStatusBadge={getStatusBadge}
                    formatDate={formatDate}
                  />
                </>
              )}

              {activeTab === 'medicalRecords' && userInfo?.maBenhNhan && (
                <ProfileMedicalRecords maBenhNhan={userInfo.maBenhNhan} />
              )}

              {activeTab === 'invoices' && userInfo?.maBenhNhan && (
                <ProfileInvoices maBenhNhan={userInfo.maBenhNhan} />
              )}
            </animated.div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserProfile;
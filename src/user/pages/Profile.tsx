import { useState, useEffect, useRef } from 'react';
import { getUserProfile, updateUserProfile, getPatientAppointments, cancelAppointment, getAvailableTimeSlots, updateAppointment } from '../services/userService';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { useSpring } from '@react-spring/web';
import { Modal, Form, Input, Button, Space, Typography, Divider, Card, Row, Col, Tag } from 'antd';
import { ExclamationCircleOutlined, CalendarOutlined, ClockCircleOutlined, UserOutlined, MedicineBoxOutlined } from '@ant-design/icons';
import ProfileSidebar from '../components/profile/ProfileSidebar';
import ProfileInfoCard from '../components/profile/ProfileInfoCard';
import ProfileAppointments from '../components/profile/ProfileAppointments';
import ProfileMedicalRecords from '../components/profile/ProfileMedicalRecords';
import ProfileInvoices from '../components/profile/ProfileInvoices';
import { UserInfo, Appointment, TimeSlot, Doctor, Service } from '../components/profile/types';
import { useNotification } from '../contexts/NotificationContext';

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
  const { showNotification } = useNotification();
  const hasShownNotification = useRef(false);

  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedAppointmentForCancel, setSelectedAppointmentForCancel] = useState<Appointment | null>(null);
  const [cancelReason, setCancelReason] = useState('');
  const [cancelLoading, setCancelLoading] = useState(false);
  const [cancelForm] = Form.useForm();
  
  const [showUpdateProfileModal, setShowUpdateProfileModal] = useState(false);
  const [updateProfileLoading, setUpdateProfileLoading] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const status = params.get('status');
    const orderNumber = params.get('orderNumber');
    const amount = params.get('amount');

    if (status && !hasShownNotification.current) {
      hasShownNotification.current = true;
      if (status === '00') {
        showNotification(
          'Thanh toán thành công!',
          `Hóa đơn ${orderNumber} với số tiền ${(Number(amount)/100).toLocaleString('vi-VN')}đ đã được thanh toán.`,
          'success'
        );
      } else {
        showNotification(
          'Thanh toán thất bại!',
          `Thanh toán cho hóa đơn ${orderNumber} đã thất bại. Vui lòng thử lại.`,
          'error'
        );
      }
      navigate(location.pathname, { replace: true });
    }
  }, [location, navigate, showNotification]);

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
      showNotification('Lỗi', 'Không thể tải thông tin chi tiết lịch hẹn', 'error');
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
    setShowUpdateProfileModal(true);
  };

  const handleUpdateProfileConfirm = async () => {
    try {
      setUpdateProfileLoading(true);
      const token = localStorage.getItem('token');
      if (!token || !userInfo) return;

      await updateUserProfile(token, userInfo);
      setIsEditingProfile(false);
      setShowUpdateProfileModal(false);
      showNotification('Thành công', 'Cập nhật thông tin cá nhân thành công!', 'success');
    } catch (err) {
      if (axios.isAxiosError(err) && err.response && err.response.data && err.response.data.message) {
        showNotification('Lỗi', `Lỗi cập nhật thông tin: ${err.response.data.message}`, 'error');
      } else {
        showNotification('Lỗi', 'Có lỗi xảy ra khi cập nhật thông tin. Vui lòng thử lại.', 'error');
      }
    } finally {
      setUpdateProfileLoading(false);
    }
  };

  const handleUpdateProfileModalClose = () => {
    setShowUpdateProfileModal(false);
  };

  const handleCancelAppointment = async (appointment: Appointment) => {
    setSelectedAppointmentForCancel(appointment);
    setCancelReason('');
    setShowCancelModal(true);
    cancelForm.resetFields();
  };

  const handleCancelConfirm = async () => {
    try {
      const values = await cancelForm.validateFields();
      setCancelLoading(true);
      
      const token = localStorage.getItem('token');
      if (!token || !userInfo || !selectedAppointmentForCancel) return;

      await cancelAppointment(token, { ...selectedAppointmentForCancel, lydo: values.reason });
      
      if (userInfo.maBenhNhan) {
        fetchAppointments(userInfo.maBenhNhan);
      }
      
      showNotification('Thành công', 'Lịch hẹn đã được hủy thành công.', 'success');
      setShowCancelModal(false);
      setSelectedAppointmentForCancel(null);
      setCancelReason('');
    } catch (err) {
      if (axios.isAxiosError(err) && err.response && err.response.data && err.response.data.message) {
        showNotification('Lỗi', `Lỗi hủy lịch hẹn: ${err.response.data.message}`, 'error');
      } else {
        showNotification('Lỗi', 'Có lỗi xảy ra khi hủy lịch hẹn. Vui lòng thử lại.', 'error');
      }
    } finally {
      setCancelLoading(false);
    }
  };

  const handleCancelModalClose = () => {
    setShowCancelModal(false);
    setSelectedAppointmentForCancel(null);
    setCancelReason('');
    cancelForm.resetFields();
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
          showNotification('Lỗi', 'Khung giờ này không còn trống hoặc không hợp lệ. Vui lòng chọn khung giờ khác.', 'error');
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
           showNotification('Lỗi', 'Khung giờ ban đầu không còn hợp lệ với bác sĩ và ngày đã chọn. Vui lòng chọn khung giờ khác.', 'error');
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
      showNotification('Thành công', 'Cập nhật lịch hẹn thành công!', 'success');
    } catch (error) {
      console.error('Error updating appointment:', error);
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        showNotification('Lỗi', `Lỗi cập nhật lịch hẹn: ${error.response.data.message}`, 'error');
      } else {
        showNotification('Lỗi', 'Không thể cập nhật lịch hẹn. Vui lòng thử lại sau.', 'error');
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
            <div className="col-lg-9">
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
            </div>
          </div>
        </div>
      </div>

             <Modal
         title={
           <div style={{ textAlign: 'center', padding: '16px 0' }}>
             <ExclamationCircleOutlined style={{ color: '#ff4d4f', fontSize: '24px', marginRight: '8px' }} />
             <span style={{ fontSize: '18px', fontWeight: 'bold' }}>Xác nhận hủy lịch hẹn</span>
           </div>
         }
         open={showCancelModal}
         onCancel={handleCancelModalClose}
         width={600}
         centered
         footer={[
           <Button key="back" size="large" onClick={handleCancelModalClose}>
             Không hủy
           </Button>,
           <Button
             key="submit"
             type="primary"
             danger
             size="large"
             loading={cancelLoading}
             onClick={handleCancelConfirm}
             icon={<ExclamationCircleOutlined />}
           >
             Xác nhận hủy
           </Button>,
         ]}
       >
         {selectedAppointmentForCancel && (
           <div>
             <div style={{ 
               background: '#fff2f0', 
               border: '1px solid #ffccc7', 
               borderRadius: '8px', 
               padding: '16px', 
               marginBottom: '20px' 
             }}>
               <Typography.Text strong style={{ color: '#cf1322' }}>
                 Bạn có chắc chắn muốn hủy lịch hẹn này không? Hành động này không thể hoàn tác.
               </Typography.Text>
             </div>

             <Card 
               size="small" 
               style={{ marginBottom: '20px', border: '1px solid #d9d9d9' }}
               title={
                 <div style={{ display: 'flex', alignItems: 'center' }}>
                   <CalendarOutlined style={{ marginRight: '8px', color: '#1890ff' }} />
                   <span>Thông tin lịch hẹn</span>
                 </div>
               }
             >
               <Row gutter={[16, 12]}>
                 <Col span={12}>
                   <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                     <UserOutlined style={{ marginRight: '8px', color: '#52c41a' }} />
                     <Typography.Text strong>Bác sĩ:</Typography.Text>
                   </div>
                   <Typography.Text>{selectedAppointmentForCancel.tenBacSi}</Typography.Text>
                 </Col>
                 <Col span={12}>
                   <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                     <MedicineBoxOutlined style={{ marginRight: '8px', color: '#722ed1' }} />
                     <Typography.Text strong>Dịch vụ:</Typography.Text>
                   </div>
                   <Typography.Text>{selectedAppointmentForCancel.tenDichVu}</Typography.Text>
                 </Col>
                 <Col span={12}>
                   <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                     <CalendarOutlined style={{ marginRight: '8px', color: '#fa8c16' }} />
                     <Typography.Text strong>Ngày hẹn:</Typography.Text>
                   </div>
                   <Typography.Text>{formatDate(selectedAppointmentForCancel.ngayHen)}</Typography.Text>
                 </Col>
                 <Col span={12}>
                   <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                     <ClockCircleOutlined style={{ marginRight: '8px', color: '#13c2c2' }} />
                     <Typography.Text strong>Giờ hẹn:</Typography.Text>
                   </div>
                   <Typography.Text>{selectedAppointmentForCancel.gioBatDau} - {selectedAppointmentForCancel.gioKetThuc}</Typography.Text>
                 </Col>
                 <Col span={24}>
                   <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                     {/* <Tag color="blue" style={{ marginRight: '8px' }}>Trạng thái</Tag> */}
                     <Typography.Text strong>Trạng thái:</Typography.Text>
                   </div>
                   <Tag color="blue">{selectedAppointmentForCancel.tenTrangThai}</Tag>
                 </Col>
               </Row>
             </Card>

             <Divider />

             <Form
               form={cancelForm}
               layout="vertical"
             >
               <Form.Item
                 name="reason"
                 label={
                   <div style={{ display: 'flex', alignItems: 'center' }}>
                     <ExclamationCircleOutlined style={{ marginRight: '8px', color: '#ff4d4f' }} />
                     <span>Lý do hủy lịch hẹn</span>
                   </div>
                 }
                 rules={[
                   { required: true, message: 'Vui lòng nhập lý do hủy lịch hẹn!' },
                   { min: 10, message: 'Lý do hủy phải có ít nhất 10 ký tự!' },
                   { max: 500, message: 'Lý do hủy không được quá 500 ký tự!' },
                 ]}
               >
                 <Input.TextArea
                   placeholder="Vui lòng nhập lý do hủy lịch hẹn (tối thiểu 10 ký tự)..."
                   rows={4}
                   value={cancelReason}
                   onChange={(e) => setCancelReason(e.target.value)}
                   showCount
                   maxLength={500}
                 />
               </Form.Item>
             </Form>
           </div>
         )}
       </Modal>

       {/* Modal xác nhận cập nhật thông tin cá nhân */}
       <Modal
         title={
           <div style={{ textAlign: 'center', padding: '16px 0' }}>
             <ExclamationCircleOutlined style={{ color: '#1890ff', fontSize: '24px', marginRight: '8px' }} />
             <span style={{ fontSize: '18px', fontWeight: 'bold' }}>Xác nhận cập nhật thông tin</span>
           </div>
         }
         open={showUpdateProfileModal}
         onCancel={handleUpdateProfileModalClose}
         width={500}
         centered
         footer={[
           <Button key="back" size="large" onClick={handleUpdateProfileModalClose}>
             Hủy
           </Button>,
           <Button
             key="submit"
             type="primary"
             size="large"
             loading={updateProfileLoading}
             onClick={handleUpdateProfileConfirm}
             icon={<ExclamationCircleOutlined />}
           >
             Xác nhận cập nhật
           </Button>,
         ]}
       >
         <div>
           <div style={{ 
             background: '#e6f7ff', 
             border: '1px solid #91d5ff', 
             borderRadius: '8px', 
             padding: '16px', 
             marginBottom: '20px' 
           }}>
             <Typography.Text strong style={{ color: '#1890ff' }}>
               Bạn có chắc chắn muốn lưu thay đổi thông tin cá nhân không?
             </Typography.Text>
           </div>

           <Card 
             size="small" 
             style={{ marginBottom: '20px', border: '1px solid #d9d9d9' }}
             title={
               <div style={{ display: 'flex', alignItems: 'center' }}>
                 <UserOutlined style={{ marginRight: '8px', color: '#52c41a' }} />
                 <span>Thông tin sẽ được cập nhật</span>
               </div>
             }
           >
             <Row gutter={[16, 12]}>
               <Col span={12}>
                 <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                   <UserOutlined style={{ marginRight: '8px', color: '#52c41a' }} />
                   <Typography.Text strong>Họ tên:</Typography.Text>
                 </div>
                 <Typography.Text>{userInfo?.hoTen}</Typography.Text>
               </Col>
               <Col span={12}>
                 <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                   <UserOutlined style={{ marginRight: '8px', color: '#52c41a' }} />
                   <Typography.Text strong>Số điện thoại:</Typography.Text>
                 </div>
                 <Typography.Text>{userInfo?.soDienThoai}</Typography.Text>
               </Col>
               <Col span={12}>
                 <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                   <UserOutlined style={{ marginRight: '8px', color: '#52c41a' }} />
                   <Typography.Text strong>Email:</Typography.Text>
                 </div>
                 <Typography.Text>{userInfo?.email}</Typography.Text>
               </Col>
               <Col span={12}>
                 <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                   <UserOutlined style={{ marginRight: '8px', color: '#52c41a' }} />
                   <Typography.Text strong>Địa chỉ:</Typography.Text>
                 </div>
                 <Typography.Text>{userInfo?.diaChi}</Typography.Text>
               </Col>
             </Row>
           </Card>

           <div style={{ 
             background: '#fff7e6', 
             border: '1px solid #ffd591', 
             borderRadius: '8px', 
             padding: '12px', 
             marginTop: '16px' 
           }}>
             <Typography.Text type="secondary" style={{ fontSize: '14px' }}>
               <ExclamationCircleOutlined style={{ marginRight: '8px', color: '#fa8c16' }} />
               Lưu ý: Thông tin cá nhân sẽ được cập nhật ngay lập tức sau khi xác nhận.
             </Typography.Text>
           </div>
         </div>
       </Modal>
    </>
  );
};

export default UserProfile;
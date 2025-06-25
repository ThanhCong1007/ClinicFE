import { Profiler, useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import '@fortawesome/fontawesome-free/css/all.min.css';

// Component layout
import Navbar from './components/layout/Navbar';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';

// Widgets
import Search from './components/widgets/Search';
import Carousel from './components/widgets/Carousel';
import Banner from './components/widgets/Banner';
import ChatWidget from './components/widgets/ChatWidget';

// Features
import About from './features/about/About';
import Team from './features/about/Team';
import Contact from './features/contact/Contact';
import Pricing from './features/pricing/Pricing';
import Login from './features/auth/Login';

// Layout/section
import Appointment from './layouts/Appointment';

// Pages
import UserProfile from './pages/Profile';
import GioiThieu from './pages/GioiThieu';
import ThongTinPhongKham from './pages/GioiThieu/ThongTinPhongKham';
import LienHe from './pages/LienHe/LienHe';
import PricingTable from './pages/BocRangSu/PricingTable';
import CosmeticPorcelainTeeth from './pages/BocRangSu/CosmeticPorcelainTeeth';
import NotFound from './features/404';

// Dashboard components
import DashboardLayout from './dashboard/DashboardLayout';

// Contexts
import { NotificationProvider, useNotification } from './contexts/NotificationContext';

// Services
import { setNotificationCallback } from './services/userService';

// import 'tailwindcss/tailwind.css';

// Component tạm thời cho trang chủ và các trang chưa có
function HomePage() {
  return (
    <>
      <Carousel />
      <Banner />
      <About />
      <Contact />
      <Pricing />
      <Team />
      <Appointment />
      <div className="container py-5">
      <h2 className="text-center mb-4">Phòng khám Nha khoa I-DENT 
        <p className="text-center mb-2">
          Chúng tôi cung cấp các dịch vụ nha khoa chất lượng cao với đội ngũ bác sĩ chuyên nghiệp
        </p>
        </h2> 
      </div>
    </>
  );
}

// Component tạm thời cho các trang chưa tạo
function PlaceholderPage({ title }: { title: string }) {
  return (
    <div className="container py-5">
      <h2 className="text-center mb-4">{title}</h2>
      <p className="text-center">Nội dung trang đang được xây dựng...</p>
    </div>
  );
}

// Protected Route Component
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const { showNotification } = useNotification();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuthorization = () => {
      const userData = localStorage.getItem('user');
      if (!userData) {
        navigate('/login');
        return;
      }

      try {
        const user = JSON.parse(userData);
        if (user.tenVaiTro !== 'BACSI') {
          showNotification(
            'Không có quyền truy cập',
            'Bạn không có quyền truy cập vào trang này!',
            'error',
            () => navigate('/')
          );
          return;
        }
        setIsAuthorized(true);
      } catch (error) {
        console.error('Error parsing user data:', error);
        navigate('/login');
        return;
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthorization();
  }, [navigate, showNotification]);

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return isAuthorized ? <>{children}</> : null;
}

function AppContent() {
  const { showNotification } = useNotification();
  const [loading, setLoading] = useState(true);
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    // Set up notification callback for userService
    setNotificationCallback(showNotification);

    // Xử lý spinner loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);

    // Xử lý back to top button
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setShowBackToTop(true);
      } else {
        setShowBackToTop(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [showNotification]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <div className="app">
      {/* Spinner */}
      {loading && (
        <div id="spinner" className="show bg-white position-fixed translate-middle w-100 vh-100 top-50 start-50 d-flex align-items-center justify-content-center">
          <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}></div>
        </div>
      )}

      <Navbar />
      <Routes>
        {/* Route chính */}
        <Route path="/trang-chu" element={<HomePage />} />
        <Route path="/" element={<Navigate to="/trang-chu" replace />} />

        {/* Dashboard routes */}
        <Route path="/dashboard/*" element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        } />

        {/* Routes cho phần Giới thiệu */}
        <Route path="/gioi-thieu/thong-tin-phong-kham" element={<ThongTinPhongKham />} />
        <Route path="/gioi-thieu/bac-si" element={<PlaceholderPage title="Đội ngũ bác sĩ" />} />

        {/* Routes cho phần Bọc răng sứ */}
        <Route path="/dich-vu/boc-rang-su" element={<CosmeticPorcelainTeeth />} />
        <Route path="/dich-vu/bang-gia-boc-rang-su" element={<PricingTable />} />
        <Route path="/dich-vu/dan-su-venner" element={<PlaceholderPage title="Dán sứ Venner" />} />

        {/* Routes cho phần Dịch vụ khác */}
        <Route path="/dich-vu/nieng-rang-tham-my" element={<PlaceholderPage title="Niềng răng thẩm mỹ" />} />
        <Route path="/dich-vu/tram-rang-tham-my" element={<PlaceholderPage title="Trám răng thẩm mỹ" />} />
        <Route path="/dich-vu/cao-voi-rang" element={<PlaceholderPage title="Cạo vôi răng" />} />

        {/* Routes cho các trang khác */}
        <Route path="/lien-he" element={<LienHe />} />
        <Route path="/dat-lich" element={<PlaceholderPage title="Đặt lịch hẹn" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/thong-tin-tai-khoan" element={<UserProfile />} />
        <Route path="*" element={<NotFound />} />
      </Routes>

      {/* Only show Footer for non-dashboard routes */}
      {!window.location.pathname.includes('/dashboard') && <Footer />}

      {/* Back to Top Button */}
      {!window.location.pathname.includes('/dashboard') && showBackToTop && (
        <button
          onClick={scrollToTop}
          className="btn btn-lg btn-primary btn-lg-square rounded back-to-top"
          style={{
            position: 'fixed',
            right: '30px',
            bottom: '30px',
            zIndex: 99,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <i className="fa fa-arrow-up"></i>
        </button>
      )}

      {/* Search Modal */}
      <div className="modal fade" id="searchModal" tabIndex={-1}>
        <div className="modal-dialog modal-fullscreen">
          <div className="modal-content" style={{ background: 'rgba(9, 30, 62, .7)' }}>
            <div className="modal-header border-0">
              <button type="button" className="btn bg-white btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body d-flex align-items-center justify-content-center">
              <div className="input-group" style={{ maxWidth: '600px' }}>
                <input type="text" className="form-control bg-transparent border-primary p-3" placeholder="Nhập từ khóa tìm kiếm" />
                <button className="btn btn-primary px-4"><i className="fa fa-search"></i></button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <NotificationProvider>
        <AppContent />
      </NotificationProvider>
      {/* <ChatWidget /> */}
    </Router>
  );
}

export default App;
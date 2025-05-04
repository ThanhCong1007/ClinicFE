import { useEffect, useState } from 'react';
import Search from './components/Search';
import Carousel from './components/Carousel';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import '@fortawesome/fontawesome-free/css/all.min.css'; // Thêm FontAwesome nếu cần
import Navbar from './components/Navbar';
import Banner from './components/Banner';
import Header from './components/Header';

function App() {
  const [loading, setLoading] = useState(true);
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
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
  }, []);

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
    {/* <Header /> */}
      {/* Navbar */}
      <Navbar />
      <Search />
      <Carousel />
      {/* Banner */}
      <Banner />

      {/* Nội dung trang web khác */}
      <div className="container py-5">
        <h2 className="text-center mb-4">Phòng khám nha khoa Công Cường</h2>
        <p className="text-center mb-5">
          Chúng tôi cung cấp các dịch vụ nha khoa chất lượng cao với đội ngũ bác sĩ chuyên nghiệp
        </p>

        {/* Thêm các section khác của trang */}
      </div>

      {/* Footer */}
      <div className="container-fluid bg-dark text-light py-5">
        <div className="container">
          <div className="row g-5">
            <div className="col-lg-4">
              <h3 className="text-white mb-4">Liên hệ</h3>
              <p className="mb-2"><i className="fa fa-map-marker-alt me-3"></i>123 Đường Lê Lợi, Quận 1, TP.HCM</p>
              <p className="mb-2"><i className="fa fa-phone-alt me-3"></i>+012 345 67890</p>
              <p className="mb-2"><i className="fa fa-envelope me-3"></i>info@phongkham.com</p>
            </div>
            <div className="col-lg-4">
              <h3 className="text-white mb-4">Liên kết nhanh</h3>
              <a className="btn btn-link text-light" href="/gioi-thieu">Giới thiệu</a>
              <a className="btn btn-link text-light" href="/dich-vu">Dịch vụ</a>
              <a className="btn btn-link text-light" href="/bac-si">Đội ngũ bác sĩ</a>
              <a className="btn btn-link text-light" href="/lien-he">Liên hệ</a>
            </div>
            <div className="col-lg-4">
              <h3 className="text-white mb-4">Theo dõi chúng tôi</h3>
              <div className="d-flex">
                <a className="btn btn-lg btn-primary btn-lg-square rounded me-2" href="#"><i className="fab fa-facebook-f"></i></a>
                <a className="btn btn-lg btn-primary btn-lg-square rounded me-2" href="#"><i className="fab fa-twitter"></i></a>
                <a className="btn btn-lg btn-primary btn-lg-square rounded" href="#"><i className="fab fa-instagram"></i></a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Back to Top Button */}
      {showBackToTop && (
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

export default App;
import { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Banner.css'; // Import CSS cho Banner

function Banner() {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    // Hiệu ứng đơn giản thay thế WOW.js - hiện các phần tử sau khi component được mount
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 300); // Hiển thị sau navbar
    
    return () => clearTimeout(timer);
  }, []);
  
  // Hiệu ứng cho phần tử bên trái
  const fadeInLeft = {
    transition: 'opacity 0.5s ease-in-out, transform 0.5s ease-in-out',
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
    transitionDelay: '0.1s'
  };

  // Hiệu ứng cho phần tử bên phải
  const fadeInRight = {
    transition: 'opacity 0.5s ease-in-out, transform 0.5s ease-in-out',
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
    transitionDelay: '0.3s'
  };

  return (
    <div className="container-fluid banner mb-5">
      <div className="container">
        <div className="row gx-0">
          <div className="col-lg-1">
            <div className="bg-dark d-flex flex-column p-5 invisible" style={{ height: 300 }}>
            </div>
          </div>
          
          <div className="col-lg-5" style={fadeInLeft}>
            <div className="bg-primary d-flex flex-column p-5" style={{ height: 300 }}>
              <h3 className="text-white mb-3">Khung giờ làm việc</h3>
              <div className="d-flex justify-content-between text-white mb-3">
                <h6 className="text-white mb-0"> Thứ 2 - Thứ 6 </h6>
                <p className="mb-0"> 8:00 - 22:00 </p>
              </div>
              <div className="d-flex justify-content-between text-white mb-3">
                <h6 className="text-white mb-0">Thứ 7</h6>
                <p className="mb-0"> 8:00 - 20:00 </p>
              </div>
              <div className="d-flex justify-content-between text-white mb-3">
                <h6 className="text-white mb-0">Chủ nhật</h6>
                <p className="mb-0"> 8:00 - 17:00 </p>
              </div>
              <a className="btn btn-light" href="/dat-lich">Đặt lịch</a>
            </div>
          </div>
          
          <div className="col-lg-5" style={fadeInRight}>
            <div className="bg-secondary d-flex flex-column px-5 py-3" style={{ height: 300 }}>
              <h3 className="text-white mt-3 mb-3">Ưu đãi lên đến <span className="fs-1 fw-bold">70%</span></h3>
              <p className="text-white">Giảm giá 20% tổng hóa đơn cho lần khám đầu tiên tại phòng khám.<br/>Hàng loạt ưu đãi khác lên đến 50% dành riêng cho khách hàng thân thiết.</p>
              <a href="/lien-he" className="btn btn-dark">Nhận ưu đãi ngay</a>
            </div>
          </div>
          
          <div className="col-lg-1">
            <div className="bg-dark d-flex flex-column p-5 invisible" style={{ height: 300 }}>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Banner;
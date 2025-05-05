import { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import './pricing.css';

function Pricing() {
  // Mẫu dữ liệu cho các dịch vụ nha khoa
  const [services] = useState([
    {
      id: 1,
      title: "Làm trắng răng",
      price: "800.000đ",
      image: "/img/price-1.jpg",
      features: [
        { text: "Thiết bị hiện đại", active: true },
        { text: "Bác sĩ chuyên nghiệp", active: true },
        { text: "Hỗ trợ 24/7", active: true }
      ]
    },
    {
      id: 2,
      title: "Niềng răng",
      price: "15.000.000đ",
      image: "/img/price-2.jpg",
      features: [
        { text: "Thiết bị hiện đại", active: true },
        { text: "Bác sĩ chuyên nghiệp", active: true },
        { text: "Bao gồm tái khám", active: true }
      ]
    },
    {
      id: 3,
      title: "Nhổ răng khôn",
      price: "1.200.000đ",
      image: "/img/price-3.jpg",
      features: [
        { text: "Thiết bị hiện đại", active: true },
        { text: "Bác sĩ chuyên nghiệp", active: true },
        { text: "Không đau, phục hồi nhanh", active: true }
      ]
    },
    // {
    //   id: 4,
    //   title: "Trám răng thẩm mỹ",
    //   price: "450.000đ",
    //   image: "/img/price-4.jpg",
    //   features: [
    //     { text: "Thiết bị hiện đại", active: true },
    //     { text: "Bác sĩ chuyên nghiệp", active: true },
    //     { text: "Chất liệu cao cấp", active: true }
    //   ]
    // }
  ]);

  return (
    <div className="pricing-section">
      <div className="container">
        <div className="row">
          {/* Phần tiêu đề */}
          <div className="col-lg-4 pricing-header">
            <h5 className="pricing-subtitle">CHI PHÍ</h5>
            <h1 className="pricing-title">
              Chúng tôi cung cấp cho bạn các dịch vụ với chi phí tốt nhất
            </h1>
            <p className="pricing-description">
              Phòng khám nha khoa của chúng tôi cung cấp các dịch vụ chất lượng cao với giá cả phải chăng. Đội ngũ bác sĩ chuyên nghiệp và trang thiết bị hiện đại sẽ mang đến cho bạn trải nghiệm điều trị tốt nhất.
            </p>
          </div>
          
          {/* Phần hiển thị dịch vụ */}
          <div className="col-lg-8">
            <div className="services-grid">
              {services.map((service) => (
                <div key={service.id} className="service-card">
                  <div className="service-image-container">
                    <img className="service-image" src={service.image} alt={service.title} />
                    <div className="service-price">
                      <span>{service.price}</span>
                    </div>
                  </div>
                  
                  <div className="service-content">
                    <h3 className="service-title">{service.title}</h3>
                    <div className="service-divider"></div>
                    
                    <div className="service-features">
                      {service.features.map((feature, index) => (
                        <div key={index} className="service-feature">
                          <span className="feature-text">{feature.text}</span>
                          {feature.active && <span className="feature-check">✓</span>}
                        </div>
                      ))}
                    </div>
                    
                    <a href="/dat-lich" className="service-button">Đặt hẹn</a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Pricing;
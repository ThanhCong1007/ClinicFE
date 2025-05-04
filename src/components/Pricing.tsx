import { useState } from 'react';

function Pricing() {
  // Mẫu dữ liệu giả cho các dịch vụ nha khoa
  const [dichvus] = useState([
    {
      id: 1,
      TenDv: "Làm trắng răng",
      DonGia: "800.000đ",
      Img: "/img/price-1.jpg",
      MoTa: "Hỗ trợ 24/7"
    },
    {
      id: 2,
      TenDv: "Niềng răng",
      DonGia: "15.000.000đ",
      Img: "/img/price-2.jpg",
      MoTa: "Bao gồm tái khám"
    },
    {
      id: 3,
      TenDv: "Nhổ răng khôn",
      DonGia: "1.200.000đ",
      Img: "/img/price-3.jpg",
      MoTa: "Không đau, phục hồi nhanh"
    },
    {
      id: 4,
      TenDv: "Trám răng thẩm mỹ",
      DonGia: "450.000đ",
      Img: "/img/price-1.jpg",
      MoTa: "Chất liệu cao cấp"
    }
  ]);

  return (
    <div className="container-fluid py-5">
      <div className="container">
        <div className="row g-5">
          <div className="col-lg-7">
            <div className="section-title mb-4">
              <h5 className="position-relative d-inline-block text-primary text-uppercase">Chi phí</h5>
              <h1 className="display-5 mb-0">Chúng tôi cung cấp cho bạn các dịch vụ với chi phí tốt nhất</h1>
            </div>
            <p className="mb-4">Phòng khám nha khoa của chúng tôi cung cấp các dịch vụ chất lượng cao với giá cả phải chăng. Đội ngũ bác sĩ chuyên nghiệp và trang thiết bị hiện đại sẽ mang đến cho bạn trải nghiệm điều trị tốt nhất.</p>
          </div>
        </div>
        
        <div className="row g-5 mb-5">
          <div className="col-lg-12">
            <div className="row g-5">
              {dichvus.map((dichvu) => (
                <div key={dichvu.id} className="col-md-3 price-item">
                  <div className="position-relative">
                    <img className="img-fluid rounded-top" src={dichvu.Img} alt={dichvu.TenDv} />
                    <div className="d-flex align-items-center justify-content-center bg-light rounded pt-2 px-3 position-absolute top-100 start-50 translate-middle" style={{zIndex: 2}}>
                      <h2 className="text-primary m-0">{dichvu.DonGia}</h2>
                    </div>
                  </div>
                  <div className="position-relative text-center bg-light border-bottom border-primary py-5 p-4">
                    <h4>{dichvu.TenDv}</h4>
                    <hr className="text-primary w-50 mx-auto mt-0" />
                    <div className="d-flex justify-content-between mb-3"><span>Thiết bị hiện đại</span><i className="fa fa-check text-primary pt-1"></i></div>
                    <div className="d-flex justify-content-between mb-3"><span>Bác sĩ chuyên nghiệp</span><i className="fa fa-check text-primary pt-1"></i></div>
                    <div className="d-flex justify-content-between mb-2"><span>{dichvu.MoTa}</span><i className="fa fa-check text-primary pt-1"></i></div>
                    <a href="appointment.html" className="btn btn-primary py-2 px-4 position-absolute top-100 start-50 translate-middle">Đặt hẹn</a>
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
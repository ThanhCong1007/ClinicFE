import React from 'react';

function Footer() {
  return (
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
  );
}
export default Footer;
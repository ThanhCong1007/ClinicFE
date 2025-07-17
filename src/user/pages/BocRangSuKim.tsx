import React from 'react';
import { motion } from 'framer-motion';
import './BocRangSuKim.css';

export default function BocRangSuKim() {
  return (
    <>
      {/* Hero Start */}
      <div className="container-fluid bg-primary py-5 hero-header mb-5">
        <div className="row py-3">
          <div className="col-12 text-center hero-text">
            <motion.h1
              className="display-3 text-white me-3"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              Bọc răng sứ
            </motion.h1>
            <i className="far fa-circle text-white px-5 py-0" style={{ fontSize: 22 }}></i>
            <motion.h1
              className="display-3 text-white ms-3 me-3"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Thẩm mỹ
            </motion.h1>
            <i className="far fa-circle text-white px-5 py-0" style={{ fontSize: 22 }}></i>
            <motion.h1
              className="display-3 text-white ms-3"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              An toàn
            </motion.h1>
          </div>
        </div>
      </div>
      {/* Hero End */}

      {/* Banner Section */}
      <motion.div
        className="container-fluid py-5"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <div className="container">
          <div className="row g-5">
            <div className="col-lg-6">
              <div className="position-relative h-100">
                <motion.img
                  className="position-absolute w-100 h-100 rounded"
                  src="/image/page-rang-su-tham-my/BocSu-01-768x548.webp"
                  alt="Bọc răng sứ thẩm mỹ"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                />
              </div>
            </div>
            <div className="col-lg-6">
              <div className="section-title mb-5">
                <h5 className="position-relative d-inline-block text-primary text-uppercase mt-5">Dịch vụ</h5>
                <h1 className="display-5 mb-3">Bọc răng sứ thẩm mỹ đẹp, an toàn</h1>
                <p className="mb-3" style={{ fontSize: 18 }}>
                  Bọc răng sứ thẩm mỹ là kỹ thuật phục hình cố định bằng vật liệu sứ có vai trò phục hồi chức năng ăn nhai, 
                  cải thiện thẩm mỹ giúp bạn tự tin với nụ cười rạng rỡ tự nhiên. Những thắc mắc về Bọc răng sứ có đau không? 
                  Có những loại răng sứ nào? Chi phí bọc răng sứ bao nhiêu?… sẽ được giải đáp trong bài viết bên dưới.
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Technology Section */}
      <motion.div
        className="container-fluid py-5"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="section-title mb-5">
                <h5 className="position-relative d-inline-block text-primary text-uppercase">Công nghệ</h5>
                <h1 className="display-5 mb-3">Ứng dụng thành công y tế thông minh vào nha khoa răng sứ thẩm mỹ</h1>
              </div>
              <p className="mb-4" style={{ fontSize: 18 }}>
                Trong lĩnh vực răng sứ thẩm mỹ, việc ứng dụng công nghệ y tế thông minh đã mở ra một kỷ nguyên mới trong điều trị 
                và phục hồi nụ cười cho bệnh nhân. Tại Nha Khoa Kim, công nghệ quét 3D tiên tiến được sử dụng để thu thập dữ liệu 
                chi tiết về kích thước và hình dạng của răng và hàm của bệnh nhân một cách chính xác, cho phép các bác sĩ nha khoa 
                thiết kế những chiếc răng sứ không chỉ vừa vặn hoàn hảo mà còn có tính thẩm mỹ cao.
              </p>
              <div className="row g-4">
                <div className="col-md-6">
                  <div className="d-flex align-items-center mb-3">
                    <i className="fas fa-check-circle text-primary me-3" style={{ fontSize: 20 }}></i>
                    <span style={{ fontSize: 16 }}>Công nghệ quét 3D, CAD/CAM, in 3D giúp thu thập dữ liệu chính xác về răng và hàm.</span>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="d-flex align-items-center mb-3">
                    <i className="fas fa-check-circle text-primary me-3" style={{ fontSize: 20 }}></i>
                    <span style={{ fontSize: 16 }}>Thiết kế răng sứ vừa vặn, thẩm mỹ cao, mô phỏng kết quả trước khi thực hiện.</span>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="d-flex align-items-center mb-3">
                    <i className="fas fa-check-circle text-primary me-3" style={{ fontSize: 20 }}></i>
                    <span style={{ fontSize: 16 }}>Sản xuất răng sứ ngay tại phòng khám, giảm thời gian chờ đợi.</span>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="d-flex align-items-center mb-3">
                    <i className="fas fa-check-circle text-primary me-3" style={{ fontSize: 20 }}></i>
                    <span style={{ fontSize: 16 }}>Tùy chỉnh màu sắc, hình dáng phù hợp với răng thật.</span>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="d-flex align-items-center mb-3">
                    <i className="fas fa-check-circle text-primary me-3" style={{ fontSize: 20 }}></i>
                    <span style={{ fontSize: 16 }}>Ứng dụng trí tuệ nhân tạo giúp bệnh nhân xem trước kết quả.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Advantages Section */}
      <motion.div
        className="container-fluid py-5"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="section-title mb-5">
                <h5 className="position-relative d-inline-block text-primary text-uppercase">Ưu điểm</h5>
                <h1 className="display-5 mb-3">Bốn ưu điểm của bọc răng sứ thẩm mỹ</h1>
              </div>
              <div className="row g-4">
                <div className="col-md-6 col-lg-3">
                  <div className="text-center p-4 border rounded">
                    <i className="fas fa-smile text-primary mb-3" style={{ fontSize: 40 }}></i>
                    <h5>Khắc phục tình trạng thẩm mỹ của răng</h5>
                  </div>
                </div>
                <div className="col-md-6 col-lg-3">
                  <div className="text-center p-4 border rounded">
                    <i className="fas fa-utensils text-primary mb-3" style={{ fontSize: 40 }}></i>
                    <h5>Khôi phục chức năng ăn nhai</h5>
                  </div>
                </div>
                <div className="col-md-6 col-lg-3">
                  <div className="text-center p-4 border rounded">
                    <i className="fas fa-clock text-primary mb-3" style={{ fontSize: 40 }}></i>
                    <h5>Thời gian bọc răng sứ nhanh</h5>
                  </div>
                </div>
                <div className="col-md-6 col-lg-3">
                  <div className="text-center p-4 border rounded">
                    <i className="fas fa-dollar-sign text-primary mb-3" style={{ fontSize: 40 }}></i>
                    <h5>Chi phí hợp lý, đa dạng</h5>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Process Section */}
      <motion.div
        className="container-fluid py-5"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="section-title mb-5">
                <h5 className="position-relative d-inline-block text-primary text-uppercase">Quy trình</h5>
                <h1 className="display-5 mb-3">Quy trình bọc răng sứ được thực hiện như thế nào?</h1>
              </div>
              <div className="row g-4">
                <div className="col-md-6 col-lg-4">
                  <div className="text-center p-4 border rounded">
                    <div className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: 60, height: 60 }}>
                      <span className="fw-bold">1</span>
                    </div>
                    <h5>Thăm khám, tư vấn và chụp phim kiểm tra tổng quát</h5>
                  </div>
                </div>
                <div className="col-md-6 col-lg-4">
                  <div className="text-center p-4 border rounded">
                    <div className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: 60, height: 60 }}>
                      <span className="fw-bold">2</span>
                    </div>
                    <h5>Lấy dấu răng bằng công nghệ quét 3D hiện đại</h5>
                  </div>
                </div>
                <div className="col-md-6 col-lg-4">
                  <div className="text-center p-4 border rounded">
                    <div className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: 60, height: 60 }}>
                      <span className="fw-bold">3</span>
                    </div>
                    <h5>Thiết kế răng sứ bằng phần mềm CAD/CAM, mô phỏng kết quả</h5>
                  </div>
                </div>
                <div className="col-md-6 col-lg-4">
                  <div className="text-center p-4 border rounded">
                    <div className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: 60, height: 60 }}>
                      <span className="fw-bold">4</span>
                    </div>
                    <h5>Chế tác răng sứ tại nhà máy đạt chuẩn quốc tế</h5>
                  </div>
                </div>
                <div className="col-md-6 col-lg-4">
                  <div className="text-center p-4 border rounded">
                    <div className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: 60, height: 60 }}>
                      <span className="fw-bold">5</span>
                    </div>
                    <h5>Gắn răng sứ và kiểm tra khớp cắn, hoàn thiện nụ cười</h5>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Products Section */}
      <motion.div
        className="container-fluid py-5"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="section-title mb-5">
                <h5 className="position-relative d-inline-block text-primary text-uppercase">Sản phẩm</h5>
                <h1 className="display-5 mb-3">Các loại sản phẩm răng sứ và giá bọc răng sứ thẩm mỹ</h1>
              </div>
              <div className="row g-4">
                <div className="col-md-4">
                  <div className="text-center p-4 border rounded">
                    <img 
                      src="/image/page-rang-su-tham-my/rang-su-tham-my-nha-khoa-kim-2.webp" 
                      alt="Răng sứ kim loại" 
                      className="img-fluid rounded mb-3"
                      style={{ maxHeight: 200 }}
                    />
                    <h5><strong>Răng sứ kim loại</strong></h5>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="text-center p-4 border rounded">
                    <img 
                      src="/image/page-rang-su-tham-my/Mau-rang-su-Nha-Khoa-Kim-scaled-768x478.webp" 
                      alt="Răng toàn sứ" 
                      className="img-fluid rounded mb-3"
                      style={{ maxHeight: 200 }}
                    />
                    <h5><strong>Răng toàn sứ</strong></h5>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="text-center p-4 border rounded">
                    <img 
                      src="/image/page-rang-su-tham-my/Zalo-RangSuTyleVang-01-scaled-768x432.webp" 
                      alt="Dán sứ Veneer" 
                      className="img-fluid rounded mb-3"
                      style={{ maxHeight: 200 }}
                    />
                    <h5><strong>Dán sứ Veneer</strong></h5>
                  </div>
                </div>
              </div>
              <div className="text-center mt-5">
                <h3>Bảng giá bọc răng sứ thẩm mỹ</h3>
                <p className="mb-4" style={{ fontSize: 18 }}>
                  Tham khảo bảng giá chi tiết tại{' '}
                  <a href="https://nhakhoakim.com/bang-gia.html" target="_blank" rel="noopener noreferrer" className="text-primary">
                    Bảng giá bọc răng sứ thẩm mỹ Nha Khoa Kim
                  </a>{' '}
                  hoặc liên hệ trực tiếp để được tư vấn.
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Notes Section */}
      <motion.div
        className="container-fluid py-5"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="section-title mb-5">
                <h5 className="position-relative d-inline-block text-primary text-uppercase">Lưu ý</h5>
                <h1 className="display-5 mb-3">Lưu ý khi làm răng sứ</h1>
              </div>
              <div className="row g-4">
                <div className="col-md-6">
                  <div className="d-flex align-items-center mb-3">
                    <i className="fas fa-shield-alt text-primary me-3" style={{ fontSize: 20 }}></i>
                    <span style={{ fontSize: 16 }}>Chọn phòng khám uy tín, đảm bảo vô trùng</span>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="d-flex align-items-center mb-3">
                    <i className="fas fa-user-md text-primary me-3" style={{ fontSize: 20 }}></i>
                    <span style={{ fontSize: 16 }}>Đội ngũ bác sĩ chuyên môn cao, nhiều kinh nghiệm</span>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="d-flex align-items-center mb-3">
                    <i className="fas fa-certificate text-primary me-3" style={{ fontSize: 20 }}></i>
                    <span style={{ fontSize: 16 }}>Sử dụng vật liệu răng sứ chất lượng, có nguồn gốc rõ ràng</span>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="d-flex align-items-center mb-3">
                    <i className="fas fa-cogs text-primary me-3" style={{ fontSize: 20 }}></i>
                    <span style={{ fontSize: 16 }}>Thực hiện đúng quy trình kỹ thuật</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Contact Section */}
      <motion.div
        className="container-fluid py-5 bg-primary"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.7 }}
      >
        <div className="container">
          <div className="row">
            <div className="col-lg-12 text-center">
              <div className="section-title mb-5">
                <h5 className="position-relative d-inline-block text-white text-uppercase">Liên hệ</h5>
                <h1 className="display-5 mb-3 text-white">Liên hệ tư vấn & đặt hẹn</h1>
              </div>
              <div className="row g-4 justify-content-center">
                <div className="col-md-6">
                  <div className="text-center">
                    <i className="fas fa-phone text-white mb-3" style={{ fontSize: 40 }}></i>
                    <h5 className="text-white">Hotline</h5>
                    <p className="text-white" style={{ fontSize: 18 }}>
                      <a href="tel:19006899" className="text-white text-decoration-none">1900 6899</a>
                    </p>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="text-center">
                    <i className="fas fa-map-marker-alt text-white mb-3" style={{ fontSize: 40 }}></i>
                    <h5 className="text-white">Địa chỉ</h5>
                    <p className="text-white" style={{ fontSize: 18 }}>
                      Xem hệ thống phòng khám trên website Nha Khoa Kim
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-5">
                <a 
                  className="btn btn-light btn-lg px-5" 
                  href="/lien-he" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  Đặt hẹn tư vấn ngay
                </a>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
} 
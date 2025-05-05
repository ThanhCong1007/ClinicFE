import React from 'react';
import { motion } from 'framer-motion';

const AboutSection = () => {
  return (
    <div className="container-fluid py-3">
      <div className="container">
        {/* Vision Section - Full Width */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="card shadow-sm border-0 p-4">
              <div className="row">
                <div className="col-lg-8">
                  <h5 className="position-relative d-inline-block text-primary text-uppercase">GIỚI THIỆU</h5>
                  <h1 className="display-5 mb-3 text-dark">Tầm nhìn</h1>
                  <p className="mb-3" style={{ fontSize: 18 }}>
                    "Trở thành sự lựa chọn hàng đầu về niềm tin, uy tín, chất lượng của bệnh nhân khi trồng răng Implant và dịch vụ nha khoa tại Việt Nam."
                  </p>
                </div>
                <div className="col-lg-4">
                  <div className="d-flex justify-content-center align-items-center h-100">
                    <motion.img 
                      src="/img/about-banner-1.svg" 
                      alt="Vision" 
                      className="w-100 rounded"
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mission Section - Full Width */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="card shadow-sm border-0 p-4">
              <div className="row">
                <div className="col-lg-8">
                  <h1 className="display-5 mb-3 text-dark">Sứ mệnh</h1>
                  <p className="mb-3" style={{ fontSize: 18 }}>
                    "Phòng khám Công Cường không chỉ mang đến cho khách hàng sự đảm bảo về sức khỏe răng hàm mặt, 
                    luôn ưu tiên trải nghiệm và sự tín nhiệm của khách hàng lên hàng đầu. Chúng tôi hướng đến sự gắn kết lâu dài 
                    và sự hài lòng tuyệt đối cho từng khách hàng, qua đó để góp phần tạo kiến tạo nên những trái tim hạnh phúc trọn vẹn cho cộng đồng."
                  </p>
                </div>
                <div className="col-lg-4">
                  <div className="d-flex justify-content-center align-items-center h-100">
                    <motion.div 
                      className="rounded p-4 bg-primary text-white text-center"
                      style={{ width: '100%' }}
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5 }}
                    >
                      <div className="rounded-circle bg-warning mx-auto mb-3 d-flex justify-content-center align-items-center" 
                           style={{ width: 120, height: 120, fontSize: 18, fontWeight: 'bold' }}>
                        BỆNH NHÂN
                      </div>
                      <div className="d-flex justify-content-between">
                        <div className="px-3">CHẤT LƯỢNG</div>
                        <div className="px-3">TẬN TÂM</div>
                        <div className="px-3">UY TÍN</div>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Story Section - Full Width */}
        <div className="row">
          <div className="col-12">
            <div className="card shadow-sm border-0 p-4">
              <h1 className="display-5 mb-4 text-dark">Câu chuyện của Công Cường</h1>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <p className="mb-3" style={{ fontSize: 18 }}>
                  "Với niềm đam mê và sự nhiệt huyết dành cho lĩnh vực Nha khoa, ngay từ khi còn theo học tại ĐH Y Dược TPHCM, 
                  Tiến sĩ – Bác sĩ Nguyễn Văn Công Cường đã thể hiện xuất sắc trong quá trình học tập và dành được học bổng nghiên cứu sinh tại Đại Học Aix- Marseille, nước Pháp."
                </p>
                
                <p className="mb-3" style={{ fontSize: 18 }}>
                  "Trong hơn 10 năm tu nghiệp tại Pháp và được tiếp cận với những công nghệ hiện đại nhất, 
                  Bác sĩ Nguyễn Văn Công Cường cảm thấy lo ngại trước những kỹ thuật nha khoa đã quá cũ và không bắt kịp sự tiến bộ 
                  của nền Nha khoa thế giới tại nước ta. Đồng thời, tại Việt Nam cũng thiếu đi những địa chỉ nha khoa uy tín và các phương án điều trị thích hợp dành cho người dân."
                </p>
                
                <p className="mb-3" style={{ fontSize: 18 }}>
                  "Trở thành 1 trong những Tiến Sĩ Y Khoa trẻ nhất Việt Nam sau khi bảo vệ thành công luận án tiến sĩ tại Pháp, 
                  với rất nhiều cơ hội để thành công tại nước ngoài. Tuy nhiên, bằng tình yêu quê hương, nhiệt huyết và mong muốn đóng góp phát triển cho ngành Nha khoa tại nước nhà, 
                  đặc biệt là trong lĩnh vực Cấy ghép Implant, Bác sĩ Công Cường đã quyết định từ bỏ tất cả để quay về Việt Nam và lập nghiệp."
                </p>
                
                <p className="mb-3" style={{ fontSize: 18 }}>
                  "Với những trăn trở và mong muốn đó, Bác sĩ Công Cường đã thành lập và phát triển nên Phòng khám Công Cường vào năm 2017. 
                  Sau hơn 5 năm đi vào hoạt động, với sự nỗ lực không ngừng của Tiến sĩ – Bác sĩ Nguyễn Văn Công Cường cùng với đội ngũ cộng sự Bác sĩ, phụ tá, nhân viên tại Phòng khám Công Cường
                  đã thực hiện thành công hơn 10.000 ca Implant, qua đó kiến tạo nụ cười hạnh phúc cho hàng ngàn bệnh nhân. Đưa Công Cường trở thành một địa chỉ nha khoa uy tín – chất lượng tại TP.HCM, 
                  là lựa chọn hàng đầu của các bệnh nhân trong và ngoài nước."
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutSection;
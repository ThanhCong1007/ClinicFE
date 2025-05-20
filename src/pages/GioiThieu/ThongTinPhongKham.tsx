import React from 'react';
import { motion } from 'framer-motion';
import './ThongTinPhongKham.css';
import Appointment from '../../layouts/Appointment';

const ThongTinPhongKham: React.FC = () => {
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
                            Uy tín
                        </motion.h1>
                        <i className="far fa-circle text-white px-5 py-0" style={{ fontSize: 22 }}></i>
                        <motion.h1
                            className="display-3 text-white ms-3 me-3"
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                        >
                            Tận tâm
                        </motion.h1>
                        <i className="far fa-circle text-white px-5 py-0" style={{ fontSize: 22 }}></i>
                        <motion.h1
                            className="display-3 text-white ms-3"
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5, delay: 0.4 }}
                        >
                            Chất lượng
                        </motion.h1>
                    </div>
                </div>
            </div>
            {/* Hero End */}

            {/* About Start - First Section: Tầm nhìn và Sứ mệnh */}
            <motion.div
                className="container-fluid py-5"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
            >
                <div className="container">
                    {/* Row with Tầm nhìn, Sứ mệnh and Image */}
                    <div className="row g-5">
                        <div className="col-lg-7">
                            <div className="section-title mb-5">
                                <h5 className="position-relative d-inline-block text-primary text-uppercase mt-5">Giới thiệu</h5>
                                <h1 className="display-5 mb-3">Tầm nhìn</h1>
                                <p className="mb-3" style={{ fontSize: 18 }}>
                                    "Trở thành sự lựa chọn hàng đầu về niềm tin, uy tín, chất lượng của bệnh nhân khi trồng răng Implant và dịch vụ nha khoa tại Việt Nam."
                                </p>
                            </div>
                            <div className="row g-5">
                                <div className="col-lg-12">
                                    <div className="section-title mt-2">
                                        <h1 className="display-5 mb-3">Sứ mệnh</h1>
                                        <p className="mb-3" style={{ fontSize: 18 }}>
                                            "Nha khoa I-DENT không chỉ mang đến cho khách hàng sự đảm bảo về sức khỏe răng hàm mặt,
                                            luôn ưu tiên trải nghiệm và sự tín nhiệm của khách hàng lên hàng đầu. Chúng tôi hướng đến sự gắn kết lâu dài
                                            và sự hài lòng tuyệt đối cho từng khách hàng, qua đó để góp phần tạo kiến tạo nên những trái tim hạnh phúc trọn vẹn cho cộng đồng."
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-5" style={{ height: 'auto' }}>
                            <div className="position-relative h-100">
                                <motion.img
                                    className="position-absolute w-100 h-100 rounded"
                                    src="/img/about-banner-1.svg"
                                    alt="About Banner"
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: 0.9 }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
            {/* First Section End */}

            {/* Second Section: Câu chuyện của Nha khoa I-DENT */}
            <motion.div
                className="container-fluid py-5 "
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
            >
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12"><h1 className="display-5 mb-4">Câu chuyện của Nha khoa I-DENT</h1>
                            <p className="mb-3" style={{ fontSize: 18 }}>
                                "Với niềm đam mê và sự nhiệt huyết dành cho lĩnh vực Nha khoa, ngay từ khi còn theo học tại ĐH Y Dược TPHCM,
                                Tiến sĩ – Bác sĩ Nguyễn Văn Công Cường đã thể hiện xuất sắc trong quá trình học tập và dành được học bổng nghiên cứu sinh tại Đại Học Aix- Marseille, nước Pháp."
                            </p>

                            <p className="mb-4" style={{ fontSize: 18 }}>
                                "Trong hơn 10 năm tu nghiệp tại Pháp và được tiếp cận với những công nghệ hiện đại nhất,
                                Bác sĩ Nguyễn Văn Công Cường cảm thấy lo ngại trước những kỹ thuật nha khoa đã quá cũ và không bắt kịp sự tiến bộ
                                của nền Nha khoa thế giới tại nước ta. Đồng thời, tại Việt Nam cũng thiếu đi những địa chỉ nha khoa uy tín và các phương án điều trị thích hợp dành cho người dân."
                            </p>

                            <p className="mb-4" style={{ fontSize: 18 }}>
                                "Trở thành 1 trong những Tiến Sĩ Y Khoa trẻ nhất Việt Nam sau khi bảo vệ thành công luận án tiến sĩ tại Pháp,
                                với rất nhiều cơ hội để thành công tại nước ngoài. Tuy nhiên, bằng tình yêu quê hương, nhiệt huyết và mong muốn đóng góp phát triển cho ngành Nha khoa tại nước nhà,
                                đặc biệt là trong lĩnh vực Cấy ghép Implant, Bác sĩ Công Cường đã quyết định từ bỏ tất cả để quay về Việt Nam và lập nghiệp."
                            </p>

                            <p className="mb-4" style={{ fontSize: 18 }}>
                                "Với những trăn trở và mong muốn đó, Bác sĩ Công Cường đã thành lập và phát triển nên Phòng khám Công Cường vào năm 2017.
                                Sau hơn 5 năm đi vào hoạt động, với sự nỗ lực không ngừng của Tiến sĩ – Bác sĩ Nguyễn Văn Công Cường cùng với đội ngũ cộng sự Bác sĩ, phụ tá, nhân viên tại Phòng khám Công Cường
                                đã thực hiện thành công hơn 10.000 ca Implant, qua đó kiến tạo nụ cười hạnh phúc cho hàng ngàn bệnh nhân. Đưa Công Cường trở thành một địa chỉ nha khoa uy tín – chất lượng tại TP.HCM,
                                là lựa chọn hàng đầu của các bệnh nhân trong và ngoài nước."
                            </p>
                        </div>
                    </div>
                </div>
            </motion.div>
            {/* Second Section End */}

            <Appointment />
           
            {/* Appointment End */}
        </>
    );
};

export default ThongTinPhongKham;
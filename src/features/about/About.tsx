import { motion } from "framer-motion";
import './About.css'; // Import CSS file for custom styles

function About() {
    return (
        <motion.div 
            className="container-fluid py-5"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
        >
            <div className="container">
                <div className="row g-5">
                    <div className="col-lg-7">
                        <div className="section-title mb-4">
                            <h5 className="position-relative d-inline-block text-primary text-uppercase">Giới thiệu</h5>
                            <h1 className="display-5 mb-0">Nha khoa I-DENT là lựa chọn phù hợp nhất cho sức khỏe răng miệng của bạn</h1>
                        </div>
                        <h4 className="text-body fst-italic mb-4">Hãy để chúng tôi loại bỏ nổi đau của bạn và mang đi một cách nhẹ nhàng nhất </h4>
                        <p className="mb-4">Với hơn 5 năm hoạt động, phòng khám đã phục vụ hơn 1500 khách hàng,
                            luôn nhận được phản hồi tích cực về sự hài lòng, trải nghiệm của khách hàng. Đạt được các chứng chỉ quốc tế và được công nhận bởi tổ chức y tế WHO</p>
                        <div className="row g-3">
                            <motion.div 
                                className="col-sm-6"
                                initial={{ opacity: 0, scale: 0.8 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.5, delay: 0.3 }}
                                viewport={{ once: true }}
                            >
                                <h5 className="mb-3"><i className="fa fa-check-circle text-primary me-3"></i>Chứng nhận quốc tế</h5>
                                <h5 className="mb-3"><i className="fa fa-check-circle text-primary me-3"></i>Đội ngũ nhân viên chuyên nghiệp</h5>
                            </motion.div>
                            <motion.div 
                                className="col-sm-6"
                                initial={{ opacity: 0, scale: 0.8 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.5, delay: 0.6 }}
                                viewport={{ once: true }}
                            >
                                <h5 className="mb-3"><i className="fa fa-check-circle text-primary me-3"></i>Khung giờ linh hoạt</h5>
                                <h5 className="mb-3"><i className="fa fa-check-circle text-primary me-3"></i>Các chuyên gia hàng đầu</h5>
                            </motion.div>
                        </div>
                        <motion.a 
                            href="/gioi-thieu/thong-tin-phong-kham" 
                            className="btn btn-primary py-3 px-5 mt-4"
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5, delay: 0.6 }}
                            viewport={{ once: true }}
                        >
                            Tìm hiểu thêm
                        </motion.a>
                    </div>
                    <div className="col-lg-5" style={{ minHeight: "500px" }}>
                        <div className="position-relative h-100">
                            <motion.img
                                className="position-absolute w-100 h-100 rounded"
                                initial={{ opacity: 0, scale: 0.8 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.5, delay: 0.9 }}
                                viewport={{ once: true }}
                                src="/img/about.jpg"
                                style={{ objectFit: "cover" }}
                                alt="Giới thiệu"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

export default About;
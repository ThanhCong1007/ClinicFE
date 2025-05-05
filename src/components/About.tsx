import './About.css'; // Import CSS file for custom styles   

function About() {
    return (
        <div className="container-fluid py-5 wow fadeInUp" data-wow-delay="0.1s">
            <div className="container">
                <div className="row g-5">
                    <div className="col-lg-7">
                        <div className="section-title mb-4">
                            <h5 className="position-relative d-inline-block text-primary text-uppercase">Giới thiệu</h5>
                            <h1 className="display-5 mb-0">Phòng khám Công Cường là lựa chọn phù hợp nhất cho sức khỏe răng miệng của bạn</h1>
                        </div>
                        <h4 className="text-body fst-italic mb-4">Hãy để chúng tôi loại bỏ nổi đau của bạn và mang đi một cách nhẹ nhàng nhất </h4>
                        <p className="mb-4">Với hơn 5 năm hoạt động, phòng khám đã phục vụ hơn 1500 khách hàng,
                            luôn nhận được phản hồi tích cực về sự hài lòng, trải nghiệm của khách hàng. Đạt được các chứng chỉ quốc tế và được công nhận bởi tổ chức y tế WHO</p>
                        <div className="row g-3">
                            <div className="col-sm-6 wow zoomIn" data-wow-delay="0.3s">
                                <h5 className="mb-3"><i className="fa fa-check-circle text-primary me-3"></i>Chứng nhận quốc tế</h5>
                                <h5 className="mb-3"><i className="fa fa-check-circle text-primary me-3"></i>Đội ngũ nhân viên chuyên nghiệp</h5>
                            </div>
                            <div className="col-sm-6 wow zoomIn" data-wow-delay="0.6s">
                                <h5 className="mb-3"><i className="fa fa-check-circle text-primary me-3"></i>Khung giờ linh hoạt</h5>
                                <h5 className="mb-3"><i className="fa fa-check-circle text-primary me-3"></i>Các chuyên gia hàng đầu</h5>
                            </div>
                        </div>
                        <a href="/gioi-thieu/thong-tin-phong-kham" className="btn btn-primary py-3 px-5 mt-4 wow zoomIn" data-wow-delay="0.6s">Tìm hiểu thêm</a>
                    </div>
                    <div className="col-lg-5" style={{ minHeight: "500px" }}>
                        <div className="position-relative h-100">
                            <img
                                className="position-absolute w-100 h-100 rounded wow zoomIn"
                                data-wow-delay="0.9s"
                                src="/img/about.jpg"
                                style={{ objectFit: "cover" }}
                                alt="Giới thiệu"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default About;

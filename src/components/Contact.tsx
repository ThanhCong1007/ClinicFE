function Contact() {
    return (
        <div className="container-fluid py-5">
            <div className="container">
                <div className="row g-5">
                    <div className="col-xl-4 col-lg-6 wow slideInUp" data-wow-delay="0.1s">
                        <div className="bg-light rounded h-100 p-5">
                            <div className="section-title">
                                <h5 className="position-relative d-inline-block text-primary text-uppercase">Liên hệ</h5>
                                <h1 className="display-6 mb-4">Hãy liên hệ với chúng tôi qua</h1>
                            </div>
                            <div className="d-flex align-items-center mb-2">
                                <i className="bi bi-geo-alt fs-1 text-primary me-3"></i>
                                <div className="text-start">
                                    <h5 className="mb-0">Phòng khám</h5>
                                    <span>123 Cao lỗ, TP.HCM</span>
                                </div>
                            </div>
                            <div className="d-flex align-items-center mb-2">
                                <i className="bi bi-envelope-open fs-1 text-primary me-3"></i>
                                <div className="text-start">
                                    <h5 className="mb-0">Email</h5>
                                    <span>ncc9173@gmail.com</span>
                                </div>
                            </div>
                            <div className="d-flex align-items-center">
                                <i className="bi bi-phone-vibrate fs-1 text-primary me-3"></i>
                                <div className="text-start">
                                    <h5 className="mb-0">Gọi cho chúng tôi</h5>
                                    <span>0842326539</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-xl-4 col-lg-6 wow slideInUp" data-wow-delay="0.3s">
                        <form>
                            <div className="row g-3">
                                <div className="col-12">
                                    <input type="text" className="form-control border-0 bg-light px-4" placeholder="Your Name" style={{ height: "55px" }} />
                                </div>
                                <div className="col-12">
                                    <input type="email" className="form-control border-0 bg-light px-4" placeholder="Your Email" style={{ height: "55px" }} />
                                </div>
                                <div className="col-12">
                                    <input type="text" className="form-control border-0 bg-light px-4" placeholder="Subject" style={{ height: "55px" }} />
                                </div>
                                <div className="col-12">
                                    <textarea className="form-control border-0 bg-light px-4 py-3" rows={5} placeholder="Message"></textarea>
                                </div>
                                <div className="col-12">
                                    <button className="btn btn-primary w-100 py-3" type="submit">Gửi tin nhắn</button>
                                </div>
                            </div>
                        </form>
                    </div>

                    <div className="col-xl-4 col-lg-12 wow slideInUp" data-wow-delay="0.6s">
                        <iframe
                            className="position-relative rounded w-100 h-100"
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d5267.37475352634!2d106.67162552475928!3d10.741666663592778!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752fab4fac6831%3A0x3321e11a642186fd!2zQuG7h25oIHZp4buHbiBRdeG6rW4gOA!5e1!3m2!1svi!2s!4v1734069565522!5m2!1svi!2s"
                            frameBorder="0"
                            style={{ minHeight: "400px", border: 0 }}
                            allowFullScreen
                            aria-hidden="false"
                            tabIndex={0}
                        ></iframe>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Contact;

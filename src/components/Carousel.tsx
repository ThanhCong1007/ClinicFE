import { useState, useEffect } from 'react';
import './Carousel.css'; // Import custom CSS for carousel
function Carousel() {
    // State to manage active slide
    const [activeSlide, setActiveSlide] = useState(0);
    const totalSlides = 2;
    
    // Function to go to next slide
    const nextSlide = () => {
        setActiveSlide((prev) => (prev + 1) % totalSlides);
    };
    
    // Function to go to previous slide
    const prevSlide = () => {
        setActiveSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
    };
    
    // Auto-rotate slides
    useEffect(() => {
        const interval = setInterval(() => {
            nextSlide();
        }, 5000); // Change slide every 5 seconds
        
        return () => clearInterval(interval);
    }, []);
    
    return (
        <div className="container-fluid p-0">
            <div 
                id="header-carousel" 
                className="carousel slide carousel-fade position-relative"
            >
                <div className="carousel-inner">
                    <div className={`carousel-item ${activeSlide === 0 ? 'active' : ''}`}>
                        <img className="w-100" src="/img/carousel-1.jpg" alt="Image" />
                        <div className="carousel-caption d-flex flex-column align-items-center justify-content-center">
                            <div className="p-3" style={{ maxWidth: "900px" }}>
                                <h5 className="text-white text-uppercase mb-3 animated slideInDown">
                                    Hãy giữ cho răng của bạn được khỏe mạnh
                                </h5>
                                <h1 className="display-1 text-white mb-md-4 animated zoomIn">
                                    Phòng khám Công Cường cung cấp các dịch vụ chăm sóc răng miệng tốt nhất
                                </h1>
                                <a href="#" className="btn btn-primary py-md-3 px-md-5 me-5 animated slideInLeft">
                                    Chi tiết thêm
                                </a>
                                <a href="/lien-he" className="btn btn-secondary py-md-3 px-md-5 ms-4 animated slideInRight">
                                    Nhận tư vấn
                                </a>
                            </div>
                        </div>
                    </div>

                    <div className={`carousel-item ${activeSlide === 1 ? 'active' : ''}`}>
                        <img className="w-100" src="/img/carousel-2.jpg" alt="Image" />
                        <div className="carousel-caption d-flex flex-column align-items-center justify-content-center">
                            <div className="p-3" style={{ maxWidth: "900px" }}>
                                <h5 className="text-white text-uppercase mb-3 animated slideInDown">
                                    <span className="me-3">Uy tín</span> -- <span className="ms-3 me-3">Chất lượng</span> --{" "}
                                    <span className="ms-3">Tận tâm</span>
                                </h5>
                                <h1 className="display-1 text-white mb-md-4 animated zoomIn">
                                    Là sự lựa chọn đáng tin cậy của +1500 khách hàng trong hơn 5 năm hoạt động
                                </h1>
                                <a
                                    href="/gioi-thieu/thong-tin-phong-kham"
                                    className="btn btn-primary py-md-3 px-md-5 animated slideInLeft"
                                >
                                    Chi tiết thêm
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                <button 
                    className="carousel-control-prev" 
                    type="button" 
                    onClick={prevSlide}
                    style={{ cursor: 'pointer' }}
                >
                    <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span className="visually-hidden">Previous</span>
                </button>
                <button 
                    className="carousel-control-next" 
                    type="button" 
                    onClick={nextSlide}
                    style={{ cursor: 'pointer' }}
                >
                    <span className="carousel-control-next-icon" aria-hidden="true"></span>
                    <span className="visually-hidden">Next</span>
                </button>
            </div>
            
            {/* Simple back to top button */}
            <BackToTop />
        </div>
    );
}

// Back to top button component
function BackToTop() {
    const [isVisible, setIsVisible] = useState(false);
    
    useEffect(() => {
        // Show button when page is scrolled down
        const toggleVisibility = () => {
            if (window.pageYOffset > 100) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };
        
        window.addEventListener('scroll', toggleVisibility);
        
        return () => window.removeEventListener('scroll', toggleVisibility);
    }, []);
    
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };
    
    return (
        <>
            {isVisible && (
                <button 
                    onClick={scrollToTop} 
                    className="btn btn-primary back-to-top"
                    style={{
                        position: 'fixed',
                        right: '30px',
                        bottom: '30px',
                        zIndex: 99,
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    <i className="bi bi-arrow-up"></i>
                </button>
            )}
        </>
    );
}

export default Carousel;
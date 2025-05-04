import { useState, useEffect, SetStateAction } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './Navbar.css';

function Navbar() {
    const [isVisible, setIsVisible] = useState(false);
    const [isSticky, setIsSticky] = useState(false);
    const [activeLink, setActiveLink] = useState('/trang-chu');
    
    useEffect(() => {
        // Hiệu ứng fadeIn
        const timer = setTimeout(() => {
            setIsVisible(true);
        }, 100);
        
        // Xử lý sticky navbar khi scroll với throttling
        let lastScrollTop = 0;
        let ticking = false;
        
        const handleScroll = () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    if (scrollTop > 40) {
                        if (!isSticky) setIsSticky(true);
                    } else {
                        if (isSticky) setIsSticky(false);
                    }
                    lastScrollTop = scrollTop;
                    ticking = false;
                });
                
                ticking = true;
            }
        };
        
        // Xác định trang hiện tại dựa trên URL
        const path = window.location.pathname;
        setActiveLink(path);
        
        window.addEventListener('scroll', handleScroll, { passive: true });
        
        return () => {
            clearTimeout(timer);
            window.removeEventListener('scroll', handleScroll);
        };
    }, [isSticky]);
    
    const handleNavLinkClick = (path: SetStateAction<string>) => {
        setActiveLink(path);
    };
    
    const fadeInStyle = {
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
        transition: 'opacity 0.6s ease-out, transform 0.6s ease-out'
    };

    return (
        <>
            <nav
                className={`navbar navbar-expand-lg navbar-light shadow-sm px-4 px-lg-5 py-3 ${isSticky ? 'sticky-top sticky-nav' : ''}`}
                style={fadeInStyle}
            >
                {/* Phần còn lại của navbar giữ nguyên */}
                <div className="container-fluid">
                    <a href="/trang-chu" className="navbar-brand d-flex align-items-center">
                        <div className="logo-icon me-2">
                            <i className="fa fa-tooth text-primary"></i>
                        </div>
                        <h1 className="m-0 brand-text">
                            <span className="text-primary">Phòng khám</span> Công Cường
                        </h1>
                    </a>
                    
                    <button
                        className="navbar-toggler"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#navbarCollapse"
                        aria-controls="navbarCollapse"
                        aria-expanded="false"
                        aria-label="Toggle navigation"
                    >
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    
                    <div className="collapse navbar-collapse" id="navbarCollapse">
                        <div className="navbar-nav mx-auto py-0">
                            <a 
                                href="/trang-chu" 
                                className={`nav-item nav-link ${activeLink === '/trang-chu' ? 'active' : ''}`}
                                onClick={() => handleNavLinkClick('/trang-chu')}
                            >
                                Trang chủ
                            </a>

                            <div className="nav-item dropdown">
                                <a 
                                    href="#" 
                                    className={`nav-link dropdown-toggle ${activeLink.includes('/gioi-thieu') ? 'active' : ''}`}
                                    data-bs-toggle="dropdown"
                                >
                                    Giới thiệu
                                </a>
                                <div className="dropdown-menu m-0 border-0 rounded-0 dropdown-animate">
                                    <a 
                                        href="/gioi-thieu/thong-tin-phong-kham" 
                                        className="dropdown-item"
                                        onClick={() => handleNavLinkClick('/gioi-thieu/thong-tin-phong-kham')}
                                    >
                                        <i className="fas fa-info-circle me-2 text-primary"></i>
                                        Thông tin phòng khám
                                    </a>
                                    <a 
                                        href="/gioi-thieu/bac-si" 
                                        className="dropdown-item"
                                        onClick={() => handleNavLinkClick('/gioi-thieu/bac-si')}
                                    >
                                        <i className="fas fa-user-md me-2 text-primary"></i>
                                        Đội ngũ bác sĩ
                                    </a>
                                </div>
                            </div>

                            {/* Phần menu dropdown khác giữ nguyên */}
                            <div className="nav-item dropdown">
                                <a 
                                    href="#" 
                                    className={`nav-link dropdown-toggle ${activeLink.includes('/dich-vu/boc-rang-su') ? 'active' : ''}`}
                                    data-bs-toggle="dropdown"
                                >
                                    Bọc răng sứ
                                </a>
                                <div className="dropdown-menu m-0 border-0 rounded-0 dropdown-animate">
                                    <a 
                                        href="/dich-vu/boc-rang-su" 
                                        className="dropdown-item"
                                        onClick={() => handleNavLinkClick('/dich-vu/boc-rang-su')}
                                    >
                                        <i className="fas fa-teeth me-2 text-primary"></i>
                                        Bọc răng sứ thẩm mỹ
                                    </a>
                                    <a 
                                        href="/dich-vu/bang-gia-boc-rang-su" 
                                        className="dropdown-item"
                                        onClick={() => handleNavLinkClick('/dich-vu/bang-gia-boc-rang-su')}
                                    >
                                        <i className="fas fa-tags me-2 text-primary"></i>
                                        Bảng giá bọc răng sứ
                                    </a>
                                    <a 
                                        href="/dich-vu/dan-su-venner" 
                                        className="dropdown-item"
                                        onClick={() => handleNavLinkClick('/dich-vu/dan-su-venner')}
                                    >
                                        <i className="fas fa-magic me-2 text-primary"></i>
                                        Dán sứ Venner
                                    </a>
                                </div>
                            </div>

                            <div className="nav-item dropdown">
                                <a 
                                    href="#" 
                                    className={`nav-link dropdown-toggle ${activeLink.includes('/dich-vu') && !activeLink.includes('/dich-vu/boc-rang-su') ? 'active' : ''}`}
                                    data-bs-toggle="dropdown"
                                >
                                    Dịch vụ khác
                                </a>
                                <div className="dropdown-menu m-0 border-0 rounded-0 dropdown-animate">
                                    <a 
                                        href="/dich-vu/nieng-rang-tham-my" 
                                        className="dropdown-item"
                                        onClick={() => handleNavLinkClick('/dich-vu/nieng-rang-tham-my')}
                                    >
                                        <i className="fas fa-smile me-2 text-primary"></i>
                                        Niềng răng thẩm mỹ
                                    </a>
                                    <a 
                                        href="/dich-vu/tram-rang-tham-my" 
                                        className="dropdown-item"
                                        onClick={() => handleNavLinkClick('/dich-vu/tram-rang-tham-my')}
                                    >
                                        <i className="fas fa-fill-drip me-2 text-primary"></i>
                                        Trám răng thẩm mỹ
                                    </a>
                                    <a 
                                        href="/dich-vu/cao-voi-rang" 
                                        className="dropdown-item"
                                        onClick={() => handleNavLinkClick('/dich-vu/cao-voi-rang')}
                                    >
                                        <i className="fas fa-brush me-2 text-primary"></i>
                                        Cạo vôi răng
                                    </a>
                                </div>
                            </div>

                            <a 
                                href="/lien-he" 
                                className={`nav-item nav-link ${activeLink === '/lien-he' ? 'active' : ''}`}
                                onClick={() => handleNavLinkClick('/lien-he')}
                            >
                                Liên hệ
                            </a>
                        </div>
                        
                        <div className="navbar-action d-flex align-items-center">
                            <button type="button" className="btn-search me-3" data-bs-toggle="modal" data-bs-target="#searchModal">
                                <i className="fa fa-search"></i>
                            </button>
                            
                            <a href="/dat-lich" className="btn btn-primary py-2 px-4 nav-btn">
                                <i className="far fa-calendar-alt me-2"></i>Đặt hẹn
                            </a>
                            
                            <a href="/dang-nhap" className="btn btn-secondary py-2 px-4 ms-3 nav-btn">
                                <i className="fas fa-user me-2"></i>Đăng nhập
                            </a>
                        </div>
                    </div>
                </div>
            </nav>
            
            {/* Modal tìm kiếm */}
            <div className="modal fade" id="searchModal" tabIndex={-1} aria-labelledby="searchModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="searchModalLabel">Tìm kiếm</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <div className="input-group">
                                <input type="text" className="form-control" placeholder="Tìm kiếm..." aria-label="Tìm kiếm" />
                                <button className="btn btn-primary" type="button">
                                    <i className="fa fa-search"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Thêm div chiếm chỗ để tránh nhảy layout khi navbar chuyển sang sticky */}
            {isSticky && <div style={{ height: '79px' }} />}
        </>
    );
}

export default Navbar;
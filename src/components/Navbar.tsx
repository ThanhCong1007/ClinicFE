import { useState, useEffect, SetStateAction } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
    const [isVisible, setIsVisible] = useState(false);
    const [isSticky, setIsSticky] = useState(false);
    const [activeLink, setActiveLink] = useState('/trang-chu');
    const location = useLocation();

    useEffect(() => {
        // Hiệu ứng fadeInUp (tương tự như wow.js)
        const timer = setTimeout(() => {
            setIsVisible(true);
        }, 100); // Tương đương với data-wow-delay="0.1s"

        // Xử lý sticky navbar khi scroll
        const handleScroll = () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            setIsSticky(scrollTop > 40);
        };

        // Gọi handleScroll ngay lập tức để khởi tạo trạng thái đúng
        handleScroll();

        // Theo dõi sự kiện scroll
        window.addEventListener('scroll', handleScroll, { passive: true });

        // Xác định trang hiện tại dựa trên URL
        setActiveLink(location.pathname);

        return () => {
            clearTimeout(timer);
            window.removeEventListener('scroll', handleScroll);
        };
    }, [location.pathname]);

    const handleNavLinkClick = (path: SetStateAction<string>) => {
        setActiveLink(path);
    };

    // Hiệu ứng fadeInUp tương tự wow.js
    const fadeInUpStyle = {
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(40px)',
        transition: 'opacity 0.8s ease-out, transform 0.8s ease-out'
    };

    return (
        <>
            <nav
                className={`navbar navbar-expand-lg bg-white navbar-light shadow-sm px-5 py-3 py-lg-0 ${isSticky ? 'sticky-top sticky-nav' : ''}`}
                style={fadeInUpStyle}
            >
                <Link to="/trang-chu" className="navbar-brand p-0">
                    <h1 className="m-0 text-primary"><i className="fa fa-tooth me-2"></i>Phòng khám Công Cường</h1>
                </Link>
                
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarCollapse"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>
                
                <div className="collapse navbar-collapse" id="navbarCollapse">
                    <div className="navbar-nav ms-auto py-0">
                        <Link 
                            to="/trang-chu"
                            className={`nav-item nav-link ${activeLink === '/trang-chu' ? 'active' : ''}`}
                            onClick={() => handleNavLinkClick('/trang-chu')}
                        >
                            Trang chủ
                        </Link>
                        
                        <div className="nav-item dropdown">
                            <Link 
                                to="#"
                                className={`nav-link dropdown-toggle ${activeLink.includes('/gioi-thieu') ? 'active' : ''}`}
                                data-bs-toggle="dropdown"
                            >
                                Giới thiệu
                            </Link>
                            <div className="dropdown-menu m-0">
                                <Link 
                                    to="/gioi-thieu/thong-tin-phong-kham"
                                    className="dropdown-item"
                                    onClick={() => handleNavLinkClick('/gioi-thieu/thong-tin-phong-kham')}
                                >
                                    Thông tin phòng khám
                                </Link>
                                <Link 
                                    to="/gioi-thieu/bac-si"
                                    className="dropdown-item"
                                    onClick={() => handleNavLinkClick('/gioi-thieu/bac-si')}
                                >
                                    Đội ngũ bác sĩ
                                </Link>
                            </div>
                        </div>
                        
                        <div className="nav-item dropdown">
                            <Link 
                                to="#"
                                className={`nav-link dropdown-toggle ${activeLink.includes('/dich-vu/boc-rang-su') ? 'active' : ''}`}
                                data-bs-toggle="dropdown"
                            >
                                Bọc răng sứ
                            </Link>
                            <div className="dropdown-menu m-0">
                                <Link 
                                    to="/dich-vu/boc-rang-su"
                                    className="dropdown-item"
                                    onClick={() => handleNavLinkClick('/dich-vu/boc-rang-su')}
                                >
                                    Bọc răng sứ thẩm mỹ
                                </Link>
                                <Link 
                                    to="/dich-vu/bang-gia-boc-rang-su"
                                    className="dropdown-item"
                                    onClick={() => handleNavLinkClick('/dich-vu/bang-gia-boc-rang-su')}
                                >
                                    Bảng giá bọc răng sứ
                                </Link>
                                <Link 
                                    to="/dich-vu/dan-su-venner"
                                    className="dropdown-item"
                                    onClick={() => handleNavLinkClick('/dich-vu/dan-su-venner')}
                                >
                                    Dán sứ Venner
                                </Link>
                            </div>
                        </div>
                        
                        <div className="nav-item dropdown">
                            <Link 
                                to="#"
                                className={`nav-link dropdown-toggle ${activeLink.includes('/dich-vu') && !activeLink.includes('/dich-vu/boc-rang-su') ? 'active' : ''}`}
                                data-bs-toggle="dropdown"
                            >
                                Dịch vụ khác
                            </Link>
                            <div className="dropdown-menu m-0">
                                <Link 
                                    to="/dich-vu/nieng-rang-tham-my"
                                    className="dropdown-item"
                                    onClick={() => handleNavLinkClick('/dich-vu/nieng-rang-tham-my')}
                                >
                                    Niềng răng thẩm mỹ
                                </Link>
                                <Link 
                                    to="/dich-vu/tram-rang-tham-my"
                                    className="dropdown-item"
                                    onClick={() => handleNavLinkClick('/dich-vu/tram-rang-tham-my')}
                                >
                                    Trám răng thẩm mỹ
                                </Link>
                                <Link 
                                    to="/dich-vu/cao-voi-rang"
                                    className="dropdown-item"
                                    onClick={() => handleNavLinkClick('/dich-vu/cao-voi-rang')}
                                >
                                    Cạo vôi răng
                                </Link>
                            </div>
                        </div>
                        
                        <Link 
                            to="/lien-he" 
                            className={`nav-item nav-link ${activeLink === '/lien-he' ? 'active' : ''}`}
                            onClick={() => handleNavLinkClick('/lien-he')}
                        >
                            Liên hệ
                        </Link>
                    </div>
                    
                    <button type="button" className="btn text-dark" data-bs-toggle="modal" data-bs-target="#searchModal">
                        <i className="fa fa-search"></i>
                    </button>
                    
                    <Link to="/dat-lich" className="btn btn-primary py-2 px-4 ms-3">
                        Đặt hẹn
                    </Link>
                    
                    <Link to="/dang-nhap" className="btn btn-secondary py-2 px-4 ms-3">
                        Đăng nhập
                    </Link>
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
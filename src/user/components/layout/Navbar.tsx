import { useState, useEffect, SetStateAction } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './Navbar.css';

interface User {
    id: number;
    fullName: string;
    email: string;
    avatar: string;
    tenVaiTro: string;
}

function Navbar() {
    const [isVisible, setIsVisible] = useState(false);
    const [isSticky, setIsSticky] = useState(false);
    const [activeLink, setActiveLink] = useState('/trang-chu');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const location = useLocation();
    const navigate = useNavigate();

    // Kiểm tra xem có đang ở dashboard không
    const isDashboard = location.pathname.startsWith('/dashboard');

    useEffect(() => {
        // Hiệu ứng fadeInUp (tương tự như wow.js)
        const timer = setTimeout(() => {
            setIsVisible(true);
        }, 100);

        // Xử lý sticky navbar khi scroll
        const handleScroll = () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            setIsSticky(scrollTop > 40);
        };

        // Kiểm tra người dùng đã đăng nhập chưa
        const checkUserLoggedIn = () => {
            const token = localStorage.getItem('token');
            const userData = localStorage.getItem('user');
            
            if (token && userData) {
                setIsLoggedIn(true);
                try {
                    setUser(JSON.parse(userData));
                } catch (error) {
                    console.error('Lỗi khi parse dữ liệu người dùng:', error);
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    setIsLoggedIn(false);
                }
            } else {
                setIsLoggedIn(false);
                setUser(null);
            }
        };

        handleScroll();
        checkUserLoggedIn();
        window.addEventListener('scroll', handleScroll, { passive: true });
        setActiveLink(location.pathname);

        return () => {
            clearTimeout(timer);
            window.removeEventListener('scroll', handleScroll);
        };
    }, [location.pathname]);

    const handleNavLinkClick = (path: SetStateAction<string>) => {
        setActiveLink(path);
    };

    // Kiểm tra URL thuộc về menu "Bọc răng sứ"
    const isBocRangSuActive = () => {
        const bocRangSuPaths = ['/dich-vu/boc-rang-su', '/dich-vu/bang-gia-boc-rang-su', '/dich-vu/dan-su-venner'];
        return bocRangSuPaths.some(path => location.pathname.includes(path));
    };


    // Xử lý đăng xuất
    const handleLogout = () => {
        localStorage.clear();
        setIsLoggedIn(false);
        setUser(null);
        window.location.href = '/login'; 
    };

    // Hiệu ứng fadeInUp
    const fadeInUpStyle = {
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(40px)',
        transition: 'opacity 0.8s ease-out, transform 0.8s ease-out'
    };

    // CSS cho avatar
    const avatarStyle = {
        width: '40px',
        height: '40px',
        borderRadius: '50%',
        objectFit: 'cover' as const,
        cursor: 'pointer'
    };
    
    // CSS cho dropdown menu
    const dropdownMenuStyle = {
        width: '220px',
        right: '0',
        left: 'auto',
        position: 'absolute' as const,
        transform: 'translate3d(10%, 38px, 0px)',
        willChange: 'transform',
        top: '0'
    };

    // Render Navbar cho Dashboard
    if (isDashboard) {
        return (
            <nav
                className={`navbar navbar-expand-lg bg-white navbar-light shadow-sm px-5 py-3 py-lg-0 ${isSticky ? 'sticky-top sticky-nav' : ''}`}
                style={fadeInUpStyle}
            >
                <Link to="/dashboard" className="navbar-brand p-0">
                    <h1 className="m-0 text-primary">
                        <i className="fa fa-tooth me-2"></i>
                        Nha khoa I-DENT
                    </h1>
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
                            to="/dashboard"
                            className={`nav-item nav-link ${activeLink === '/dashboard' ? 'active' : ''}`}
                            onClick={() => handleNavLinkClick('/dashboard')}
                        >
                            <i className="fas fa-home me-1"></i>
                            Trang Chủ
                        </Link>
                        <Link 
                            to="/dashboard/appointments"
                            className={`nav-item nav-link ${activeLink === '/dashboard/appointments' ? 'active' : ''}`}
                            onClick={() => handleNavLinkClick('/dashboard/appointments')}
                        >
                            <i className="fas fa-calendar-check me-1"></i>
                            Lịch Hẹn
                        </Link>
                        <Link 
                            to="/dashboard/patients"
                            className={`nav-item nav-link ${activeLink === '/dashboard/patients' ? 'active' : ''}`}
                            onClick={() => handleNavLinkClick('/dashboard/patients')}
                        >
                            <i className="fas fa-users me-1"></i>
                            Bệnh Nhân
                        </Link>
                        <button 
                            onClick={handleLogout}
                            className="nav-item nav-link"
                        >
                            <i className="fas fa-sign-out-alt me-1"></i>
                            Đăng Xuất
                        </button>
                    </div>
                </div>
            </nav>
        );
    }

    // Render Navbar cho trang chính
    return (
        <>
            <nav
                className={`navbar navbar-expand-lg bg-white navbar-light shadow-sm px-5 py-3 py-lg-0 ${isSticky ? 'sticky-top sticky-nav' : ''}`}
                style={fadeInUpStyle}
            >
                <Link to="/trang-chu" className="navbar-brand p-0">
                    <h1 className="m-0 text-primary"><i className="fa fa-tooth me-2"></i>Nha khoa I-DENT</h1>
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
                                className={`nav-link dropdown-toggle ${isBocRangSuActive() ? 'active' : ''}`}
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
                    
                    <Link to="/lien-he" className="btn btn-primary py-2 px-4 ms-3">
                        Đặt hẹn
                    </Link>
                    
                    {isLoggedIn && user ? (
                        <div className="dropdown ms-3 position-relative">
                            <img 
                                src={user.avatar || "/img/default-avatar.jpg"} 
                                alt="Avatar" 
                                style={avatarStyle}
                                className="dropdown-toggle"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                            />
                            <ul className="dropdown-menu" style={dropdownMenuStyle}>
                                <li>
                                    <Link to="/thong-tin-tai-khoan" className="dropdown-item">
                                        <i className="fa fa-user me-2"></i>Thông tin tài khoản
                                    </Link>
                                </li>
                                {user.tenVaiTro === "BACSI" && (
                                    <li>
                                        <Link to="/dashboard" className="dropdown-item">
                                            <i className="fa fa-stethoscope me-2"></i>Khám bệnh
                                        </Link>
                                    </li>
                                )}
                                <li>
                                    <Link to="/thong-tin-tai-khoan" state={{ activeTab: 'appointments' }} className="dropdown-item">
                                        <i className="fa fa-calendar me-2"></i>Lịch sử đặt hẹn
                                    </Link>
                                </li>
                                <li><hr className="dropdown-divider" /></li>
                                <li>
                                    <button onClick={handleLogout} className="dropdown-item text-danger">
                                        <i className="fa fa-sign-out-alt me-2"></i>Đăng xuất
                                    </button>
                                </li>
                            </ul>
                        </div>
                    ) : (
                        <Link to="/login" className="btn btn-secondary py-2 px-4 ms-3">
                            Đăng nhập
                        </Link>
                    )}
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
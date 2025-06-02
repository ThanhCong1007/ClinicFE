import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  return (
    <div className="templatemo-sidebar">
      <header className="templatemo-site-header">
        <div className="square"></div>
        <h1>Phòng Khám Bác Sĩ</h1>
      </header>
      <div className="profile-photo-container">
        <img src="/images/profile-photo.jpg" alt="Ảnh Bác Sĩ" className="img-responsive" />  
        <div className="profile-photo-overlay"></div>
      </div>      
      <form className="templatemo-search-form" role="search">
        <div className="input-group">
          <button type="submit" className="fa fa-search"></button>
          <input type="text" className="form-control" placeholder="Tìm kiếm bệnh nhân" name="srch-term" id="srch-term" />           
        </div>
      </form>
      <div className="mobile-menu-icon">
        <i className="fa fa-bars"></i>
      </div>
      <nav className="templatemo-left-nav">          
        <ul>
          <li>
            <NavLink to="/" end>
              <i className="fa fa-home fa-fw"></i>Bảng Điều Khiển
            </NavLink>
          </li>
          <li>
            <NavLink to="/appointments">
              <i className="fa fa-calendar fa-fw"></i>Lịch Hẹn
            </NavLink>
          </li>
          <li>
            <NavLink to="/patient-records">
              <i className="fa fa-folder fa-fw"></i>Hồ Sơ Bệnh Nhân
            </NavLink>
          </li>
          <li>
            <NavLink to="/medical-examination">
              <i className="fa fa-stethoscope fa-fw"></i>Khám Bệnh
            </NavLink>
          </li>
          <li>
            <NavLink to="/prescriptions">
              <i className="fa fa-file-text fa-fw"></i>Đơn Thuốc
            </NavLink>
          </li>
          <li>
            <NavLink to="/login">
              <i className="fa fa-eject fa-fw"></i>Đăng Xuất
            </NavLink>
          </li>
        </ul>  
      </nav>
    </div>
  );
};

export default Sidebar; 
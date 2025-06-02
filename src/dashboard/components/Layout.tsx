import { Outlet, Link } from 'react-router-dom';
import { Container, Nav, Offcanvas } from 'react-bootstrap';
import { useState } from 'react';

const Layout = () => {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <div className="d-flex flex-column min-vh-100">
      {/* Sidebar Offcanvas */}
      <Offcanvas show={show} onHide={handleClose} placement="start">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Menu</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Nav className="flex-column">
            <Nav.Link as={Link} to="/dashboard" onClick={handleClose}>
              <i className="fas fa-home me-2"></i>
              Trang Chủ
            </Nav.Link>
            <Nav.Link as={Link} to="/dashboard/appointments" onClick={handleClose}>
              <i className="fas fa-calendar-check me-2"></i>
              Lịch Hẹn
            </Nav.Link>
            <Nav.Link as={Link} to="/dashboard/patients" onClick={handleClose}>
              <i className="fas fa-users me-2"></i>
              Bệnh Nhân
            </Nav.Link>
            <Nav.Link as={Link} to="/dashboard/medical-records" onClick={handleClose}>
              <i className="fas fa-file-medical me-2"></i>
              Hồ Sơ Bệnh Án
            </Nav.Link>
            <Nav.Link as={Link} to="/dashboard/prescriptions" onClick={handleClose}>
              <i className="fas fa-prescription me-2"></i>
              Đơn Thuốc
            </Nav.Link>
          </Nav>
        </Offcanvas.Body>
      </Offcanvas>

      {/* Main Content */}
      <Container fluid className="flex-grow-1">
        <Outlet />
      </Container>

      {/* Footer */}
      <footer className="bg-light py-3 mt-auto">
        <Container>
          <div className="text-center">
            <p className="mb-0">© 2024 Phòng Khám Bác Sĩ. All rights reserved.</p>
          </div>
        </Container>
      </footer>
    </div>
  );
};

export default Layout; 
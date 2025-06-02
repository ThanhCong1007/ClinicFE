import React from 'react';
import { Container, Row, Col, Card, Table, Badge, Button } from 'react-bootstrap';

const Dashboard = () => {
  return (
    <Container fluid className="py-4">
      {/* Statistics Cards */}
      <Row className="g-4 mb-4">
        <Col md={3}>
          <Card className="h-100 border-0 shadow-sm">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-muted mb-2">Tổng Số Bệnh Nhân</h6>
                  <h3 className="mb-0">1,234</h3>
                </div>
                <div className="bg-primary bg-opacity-10 p-3 rounded">
                  <i className="fas fa-users text-primary fa-2x"></i>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="h-100 border-0 shadow-sm">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-muted mb-2">Lịch Hẹn Hôm Nay</h6>
                  <h3 className="mb-0">12</h3>
                </div>
                <div className="bg-success bg-opacity-10 p-3 rounded">
                  <i className="fas fa-calendar-check text-success fa-2x"></i>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="h-100 border-0 shadow-sm">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-muted mb-2">Bệnh Nhân Mới</h6>
                  <h3 className="mb-0">5</h3>
                </div>
                <div className="bg-info bg-opacity-10 p-3 rounded">
                  <i className="fas fa-user-plus text-info fa-2x"></i>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="h-100 border-0 shadow-sm">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-muted mb-2">Đơn Thuốc Đang Chờ</h6>
                  <h3 className="mb-0">8</h3>
                </div>
                <div className="bg-warning bg-opacity-10 p-3 rounded">
                  <i className="fas fa-prescription text-warning fa-2x"></i>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Today's Appointments */}
      <Card className="border-0 shadow-sm mb-4">
        <Card.Header className="bg-white">
          <h5 className="mb-0">Lịch Hẹn Hôm Nay</h5>
        </Card.Header>
        <Card.Body>
          <Table responsive hover>
            <thead>
              <tr>
                <th>Thời Gian</th>
                <th>Tên Bệnh Nhân</th>
                <th>Mục Đích</th>
                <th>Trạng Thái</th>
                <th>Thao Tác</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>09:00</td>
                <td>Nguyễn Văn A</td>
                <td>Khám Tổng Quát</td>
                <td>
                  <Badge bg="success">Đã Xác Nhận</Badge>
                </td>
                <td>
                  <Button variant="primary" size="sm" className="me-2">
                    <i className="fas fa-stethoscope me-1"></i>
                    Bắt Đầu Khám
                  </Button>
                  <Button variant="info" size="sm">
                    <i className="fas fa-eye me-1"></i>
                    Chi Tiết
                  </Button>
                </td>
              </tr>
              <tr>
                <td>10:30</td>
                <td>Trần Thị B</td>
                <td>Tái Khám</td>
                <td>
                  <Badge bg="warning" text="dark">Đang Chờ</Badge>
                </td>
                <td>
                  <Button variant="primary" size="sm" className="me-2">
                    <i className="fas fa-stethoscope me-1"></i>
                    Bắt Đầu Khám
                  </Button>
                  <Button variant="info" size="sm">
                    <i className="fas fa-eye me-1"></i>
                    Chi Tiết
                  </Button>
                </td>
              </tr>
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      {/* Recent Patients */}
      <Card className="border-0 shadow-sm">
        <Card.Header className="bg-white">
          <h5 className="mb-0">Bệnh Nhân Gần Đây</h5>
        </Card.Header>
        <Card.Body>
          <Table responsive hover>
            <thead>
              <tr>
                <th>Mã BN</th>
                <th>Họ và Tên</th>
                <th>Ngày Khám Cuối</th>
                <th>Thao Tác</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>BN001</td>
                <td>Lê Văn C</td>
                <td>15/03/2024</td>
                <td>
                  <Button variant="info" size="sm">
                    <i className="fas fa-file-medical me-1"></i>
                    Xem Hồ Sơ
                  </Button>
                </td>
              </tr>
              <tr>
                <td>BN002</td>
                <td>Phạm Thị D</td>
                <td>14/03/2024</td>
                <td>
                  <Button variant="info" size="sm">
                    <i className="fas fa-file-medical me-1"></i>
                    Xem Hồ Sơ
                  </Button>
                </td>
              </tr>
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Dashboard; 
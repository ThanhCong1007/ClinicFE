import React, { useState } from 'react';
import { Container, Row, Col, Card, Table, Badge, Button, Form, Modal } from 'react-bootstrap';

const Appointments = () => {
  const [showModal, setShowModal] = useState(false);

  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);

  return (
    <Container fluid className="py-4">
      <Row className="mb-4">
        <Col>
          <h4 className="mb-0">Quản Lý Lịch Hẹn</h4>
        </Col>
        <Col xs="auto">
          <Button variant="primary" onClick={handleShow}>
            <i className="fas fa-plus me-2"></i>
            Tạo Lịch Hẹn Mới
          </Button>
        </Col>
      </Row>

      {/* Filters */}
      <Card className="border-0 shadow-sm mb-4">
        <Card.Body>
          <Row className="g-3">
            <Col md={3}>
              <Form.Group>
                <Form.Label>Ngày</Form.Label>
                <Form.Control type="date" />
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group>
                <Form.Label>Trạng Thái</Form.Label>
                <Form.Select>
                  <option value="">Tất Cả</option>
                  <option value="confirmed">Đã Xác Nhận</option>
                  <option value="pending">Đang Chờ</option>
                  <option value="cancelled">Đã Hủy</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group>
                <Form.Label>Tìm Kiếm</Form.Label>
                <Form.Control type="text" placeholder="Tên bệnh nhân..." />
              </Form.Group>
            </Col>
            <Col md={3} className="d-flex align-items-end">
              <Button variant="secondary" className="w-100">
                <i className="fas fa-search me-2"></i>
                Tìm Kiếm
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Appointments Table */}
      <Card className="border-0 shadow-sm">
        <Card.Body>
          <Table responsive hover>
            <thead>
              <tr>
                <th>Thời Gian</th>
                <th>Tên Bệnh Nhân</th>
                <th>Số Điện Thoại</th>
                <th>Mục Đích</th>
                <th>Trạng Thái</th>
                <th>Thao Tác</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>09:00 - 15/03/2024</td>
                <td>Nguyễn Văn A</td>
                <td>0123456789</td>
                <td>Khám Tổng Quát</td>
                <td>
                  <Badge bg="success">Đã Xác Nhận</Badge>
                </td>
                <td>
                  <Button variant="primary" size="sm" className="me-2">
                    <i className="fas fa-stethoscope me-1"></i>
                    Bắt Đầu Khám
                  </Button>
                  <Button variant="info" size="sm" className="me-2">
                    <i className="fas fa-edit me-1"></i>
                    Sửa
                  </Button>
                  <Button variant="danger" size="sm">
                    <i className="fas fa-times me-1"></i>
                    Hủy
                  </Button>
                </td>
              </tr>
              <tr>
                <td>10:30 - 15/03/2024</td>
                <td>Trần Thị B</td>
                <td>0987654321</td>
                <td>Tái Khám</td>
                <td>
                  <Badge bg="warning" text="dark">Đang Chờ</Badge>
                </td>
                <td>
                  <Button variant="primary" size="sm" className="me-2">
                    <i className="fas fa-stethoscope me-1"></i>
                    Bắt Đầu Khám
                  </Button>
                  <Button variant="info" size="sm" className="me-2">
                    <i className="fas fa-edit me-1"></i>
                    Sửa
                  </Button>
                  <Button variant="danger" size="sm">
                    <i className="fas fa-times me-1"></i>
                    Hủy
                  </Button>
                </td>
              </tr>
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      {/* New Appointment Modal */}
      <Modal show={showModal} onHide={handleClose} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Tạo Lịch Hẹn Mới</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row className="g-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Tên Bệnh Nhân</Form.Label>
                  <Form.Control type="text" placeholder="Nhập tên bệnh nhân" />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Số Điện Thoại</Form.Label>
                  <Form.Control type="tel" placeholder="Nhập số điện thoại" />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Ngày Hẹn</Form.Label>
                  <Form.Control type="date" />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Giờ Hẹn</Form.Label>
                  <Form.Control type="time" />
                </Form.Group>
              </Col>
              <Col md={12}>
                <Form.Group>
                  <Form.Label>Mục Đích Khám</Form.Label>
                  <Form.Control as="textarea" rows={3} placeholder="Nhập mục đích khám" />
                </Form.Group>
              </Col>
              <Col md={12}>
                <Form.Group>
                  <Form.Label>Ghi Chú</Form.Label>
                  <Form.Control as="textarea" rows={2} placeholder="Nhập ghi chú (nếu có)" />
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Hủy
          </Button>
          <Button variant="primary" onClick={handleClose}>
            Tạo Lịch Hẹn
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Appointments; 
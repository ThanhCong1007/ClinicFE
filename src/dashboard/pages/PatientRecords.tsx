import React, { useState } from 'react';
import { Container, Row, Col, Card, Table, Button, Form, Modal, Badge } from 'react-bootstrap';

const PatientRecords = () => {
  const [showModal, setShowModal] = useState(false);

  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);

  return (
    <Container fluid className="py-4">
      <Row className="mb-4">
        <Col>
          <h4 className="mb-0">Quản Lý Hồ Sơ Bệnh Nhân</h4>
        </Col>
        <Col xs="auto">
          <Button variant="primary" onClick={handleShow}>
            <i className="fas fa-plus me-2"></i>
            Thêm Bệnh Nhân Mới
          </Button>
        </Col>
      </Row>

      {/* Search and Filters */}
      <Card className="border-0 shadow-sm mb-4">
        <Card.Body>
          <Row className="g-3">
            <Col md={3}>
              <Form.Group>
                <Form.Label>Tìm Kiếm</Form.Label>
                <Form.Control type="text" placeholder="Tên, số điện thoại..." />
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group>
                <Form.Label>Nhóm Máu</Form.Label>
                <Form.Select>
                  <option value="">Tất Cả</option>
                  <option value="A">A</option>
                  <option value="B">B</option>
                  <option value="AB">AB</option>
                  <option value="O">O</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group>
                <Form.Label>Độ Tuổi</Form.Label>
                <Form.Select>
                  <option value="">Tất Cả</option>
                  <option value="0-18">0-18</option>
                  <option value="19-30">19-30</option>
                  <option value="31-50">31-50</option>
                  <option value="51+">51+</option>
                </Form.Select>
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

      {/* Patients Table */}
      <Card className="border-0 shadow-sm">
        <Card.Body>
          <Table responsive hover>
            <thead>
              <tr>
                <th>Mã BN</th>
                <th>Họ và Tên</th>
                <th>Ngày Sinh</th>
                <th>Giới Tính</th>
                <th>Số Điện Thoại</th>
                <th>Nhóm Máu</th>
                <th>Lần Khám Cuối</th>
                <th>Thao Tác</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>BN001</td>
                <td>Nguyễn Văn A</td>
                <td>15/05/1985</td>
                <td>Nam</td>
                <td>0123456789</td>
                <td><Badge bg="danger">A</Badge></td>
                <td>15/03/2024</td>
                <td>
                  <Button variant="info" size="sm" className="me-2">
                    <i className="fas fa-file-medical me-1"></i>
                    Xem Hồ Sơ
                  </Button>
                  <Button variant="primary" size="sm" className="me-2">
                    <i className="fas fa-calendar-plus me-1"></i>
                    Tạo Lịch Hẹn
                  </Button>
                  <Button variant="warning" size="sm">
                    <i className="fas fa-edit me-1"></i>
                    Sửa
                  </Button>
                </td>
              </tr>
              <tr>
                <td>BN002</td>
                <td>Trần Thị B</td>
                <td>20/08/1990</td>
                <td>Nữ</td>
                <td>0987654321</td>
                <td><Badge bg="primary">O</Badge></td>
                <td>14/03/2024</td>
                <td>
                  <Button variant="info" size="sm" className="me-2">
                    <i className="fas fa-file-medical me-1"></i>
                    Xem Hồ Sơ
                  </Button>
                  <Button variant="primary" size="sm" className="me-2">
                    <i className="fas fa-calendar-plus me-1"></i>
                    Tạo Lịch Hẹn
                  </Button>
                  <Button variant="warning" size="sm">
                    <i className="fas fa-edit me-1"></i>
                    Sửa
                  </Button>
                </td>
              </tr>
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      {/* New Patient Modal */}
      <Modal show={showModal} onHide={handleClose} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Thêm Bệnh Nhân Mới</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row className="g-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Họ và Tên</Form.Label>
                  <Form.Control type="text" placeholder="Nhập họ và tên" />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Ngày Sinh</Form.Label>
                  <Form.Control type="date" />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Giới Tính</Form.Label>
                  <Form.Select>
                    <option value="">Chọn giới tính</option>
                    <option value="male">Nam</option>
                    <option value="female">Nữ</option>
                    <option value="other">Khác</option>
                  </Form.Select>
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
                  <Form.Label>Email</Form.Label>
                  <Form.Control type="email" placeholder="Nhập email" />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Nhóm Máu</Form.Label>
                  <Form.Select>
                    <option value="">Chọn nhóm máu</option>
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="AB">AB</option>
                    <option value="O">O</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={12}>
                <Form.Group>
                  <Form.Label>Địa Chỉ</Form.Label>
                  <Form.Control as="textarea" rows={2} placeholder="Nhập địa chỉ" />
                </Form.Group>
              </Col>
              <Col md={12}>
                <Form.Group>
                  <Form.Label>Tiền Sử Bệnh</Form.Label>
                  <Form.Control as="textarea" rows={3} placeholder="Nhập tiền sử bệnh (nếu có)" />
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
            Thêm Bệnh Nhân
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default PatientRecords; 
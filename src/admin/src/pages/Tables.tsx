import React, { useState, useEffect } from 'react';
import { adminApi, User, UsersResponse } from '../services/api';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import { useNotification } from '../../components/NotificationProvider';

type TabType = 'admin' | 'user' | 'doctor';

const Tables: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('admin');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    totalItems: 0,
    totalPages: 0,
    currentPage: 0,
  });
  const itemsPerPage = 10;

  const initialFormState = {
    tenDangNhap: '',
    matKhau: '',
    email: '',
    hoTen: '',
    soDienThoai: '',
    vaiTro: 'ADMIN',
    ngaySinh: '',
    gioiTinh: '',
    diaChi: '',
    tienSuBenh: '',
    diUng: '',
  };

  const FORM_STORAGE_KEY = 'admin_add_user_form';

  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(initialFormState);
  const [formError, setFormError] = useState<string | null>(null);
  const [formLoading, setFormLoading] = useState(false);

  const { showNotification, showConfirmDialog } = useNotification();

  // Load form from localStorage if exists
  useEffect(() => {
    const saved = localStorage.getItem(FORM_STORAGE_KEY);
    if (saved) {
      setForm(JSON.parse(saved));
    }
  }, [showModal]);

  // Save form to localStorage on change
  useEffect(() => {
    if (showModal) {
      localStorage.setItem(FORM_STORAGE_KEY, JSON.stringify(form));
    }
  }, [form, showModal]);

  const handleOpenModal = () => {
    setShowModal(true);
  };
  const handleCloseModal = () => {
    setShowModal(false);
    setForm(initialFormState);
    setFormError(null);
    localStorage.removeItem(FORM_STORAGE_KEY);
  };

  const handleFormChange = (e: React.ChangeEvent<any>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError(null);
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No token found');
      const res = await fetch('http://localhost:8080/api/admin/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token,
        },
        body: JSON.stringify({ ...form, vaiTro: form.vaiTro }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Registration failed');
      }
      handleCloseModal();
      showNotification('Thành công', 'Người dùng đã được tạo thành công!', 'success');
      fetchUsers();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      showNotification('Lỗi', err.message || 'Không thể tạo người dùng. Vui lòng thử lại.', 'error');
    } finally {
      setFormLoading(false);
    }
  };

  // Fetch users from API
  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await adminApi.getUsers();
      setUsers(response);
      // Bỏ setPagination vì không còn dữ liệu phân trang từ API
    } catch (err) {
      showNotification('Lỗi', 'Không thể tải danh sách người dùng. Vui lòng thử lại.', 'error');
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Filter users based on active tab and search term
  const getFilteredUsers = () => {
    let filteredByRole = users;

    // Filter by role based on active tab
    switch (activeTab) {
      case 'admin':
        filteredByRole = users.filter(user => user.tenVaiTro === 'ADMIN');
        break;
      case 'doctor':
        filteredByRole = users.filter(user => user.tenVaiTro === 'BACSI');
        break;
      case 'user':
        filteredByRole = users.filter(user => user.tenVaiTro === 'USER');
        break;
      default:
        filteredByRole = users;
    }

    // Apply search filter
    return filteredByRole.filter(user =>
      user.hoTen.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.tenDangNhap.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.soDienThoai.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const filteredUsers = getFilteredUsers();

  // Handle user deactivation
  const handleDeactivateUser = async (userId: number, userName: string) => {
    const confirmed = await showConfirmDialog({
      title: 'Xác nhận vô hiệu hóa',
      message: `Bạn có chắc chắn muốn vô hiệu hóa ${userName}?`,
      confirmText: 'Vô hiệu hóa',
      cancelText: 'Hủy'
    });
    if (confirmed) {
      try {
        const response = await adminApi.deactivateUser(userId);
        showNotification('Thành công', response.message, 'success');
        fetchUsers();
      } catch (err) {
        console.error('Error deactivating user:', err);
        showNotification('Lỗi', 'Không thể vô hiệu hóa người dùng. Vui lòng thử lại.', 'error');
      }
    }
  };

  // Handle user deletion
  const handleDeleteUser = async (userId: number, userName: string) => {
    const confirmed = await showConfirmDialog({
      title: 'Xác nhận xóa',
      message: `Bạn có chắc chắn muốn xóa ${userName}? Hành động này không thể hoàn tác.`,
      confirmText: 'Xóa',
      cancelText: 'Hủy'
    });
    if (confirmed) {
      try {
        await adminApi.deleteUser(userId);
        showNotification('Thành công', `Đã xóa người dùng ${userName}.`, 'success');
        fetchUsers();
      } catch (err) {
        console.error('Error deleting user:', err);
        showNotification('Lỗi', 'Không thể xóa người dùng. Vui lòng thử lại.', 'error');
      }
    }
  };

  // Calculate pagination for filtered results
  const totalFilteredPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentUsers = filteredUsers.slice(startIndex, endIndex);

  // Reset search and pagination when tab changes
  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    setSearchTerm('');
    setCurrentPage(1);
  };

  // Get tab-specific title and add button text
  const getTabInfo = () => {
    switch (activeTab) {
      case 'admin':
        return {
          title: 'Quản lý Quản trị viên',
          addButtonText: 'Thêm Quản trị viên',
          count: users.filter(u => u.tenVaiTro === 'ADMIN').length
        };
      case 'doctor':
        return {
          title: 'Quản lý Bác sĩ',
          addButtonText: 'Thêm Bác sĩ',
          count: users.filter(u => u.tenVaiTro === 'BACSI').length
        };
      case 'user':
        return {
          title: 'Quản lý Người dùng',
          addButtonText: 'Thêm Người dùng',
          count: users.filter(u => u.tenVaiTro === 'USER').length
        };
      default:
        return {
          title: 'Quản lý Người dùng',
          addButtonText: 'Thêm Người dùng',
          count: users.length
        };
    }
  };

  const tabInfo = getTabInfo();

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="row mb-4">
        <div className="col-12">
          <div className="card admin-card">
            <div className="card-header">
              <h5 className="mb-0">{tabInfo.title}</h5>
            </div>
            <div className="card-body">
              {error && (
                <></>
              )}

              {success && (
                <></>
              )}

              {/* Tabs */}
              <ul className="nav nav-tabs mb-3" id="userTabs" role="tablist">
                <li className="nav-item" role="presentation">
                  <button
                    className={`nav-link ${activeTab === 'admin' ? 'active' : ''}`}
                    onClick={() => handleTabChange('admin')}
                    type="button"
                  >
                    <i className="fas fa-user-shield me-2"></i>
                    Quản trị viên ({users.filter(u => u.tenVaiTro === 'ADMIN').length})
                  </button>
                </li>
                <li className="nav-item" role="presentation">
                  <button
                    className={`nav-link ${activeTab === 'doctor' ? 'active' : ''}`}
                    onClick={() => handleTabChange('doctor')}
                    type="button"
                  >
                    <i className="fas fa-user-md me-2"></i>
                    Bác sĩ ({users.filter(u => u.tenVaiTro === 'BACSI').length})
                  </button>
                </li>
                <li className="nav-item" role="presentation">
                  <button
                    className={`nav-link ${activeTab === 'user' ? 'active' : ''}`}
                    onClick={() => handleTabChange('user')}
                    type="button"
                  >
                    <i className="fas fa-users me-2"></i>
                    Người dùng ({users.filter(u => u.tenVaiTro === 'USER').length})
                  </button>
                </li>
              </ul>

              <div className="row mb-3">
                <div className="col-md-6">
                  <div className="input-group">
                    <span className="input-group-text">
                      <i className="fas fa-search"></i>
                    </span>
                    <input
                      type="text"
                      className="form-control"
                      placeholder={`Tìm kiếm ${activeTab === 'admin' ? 'quản trị viên' : activeTab === 'doctor' ? 'bác sĩ' : 'người dùng'} theo tên, tài khoản, email hoặc số điện thoại...`}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
                <div className="col-md-6 text-end">
                  <button className="btn btn-primary admin-btn-primary" onClick={handleOpenModal}>
                    <i className="fas fa-plus me-2"></i>
                    {tabInfo.addButtonText}
                  </button>
                </div>
              </div>

              <div className="table-responsive admin-table-responsive">
                <table className="table table-striped table-hover">
                  <thead>
                    <tr>
                      {/* <th>ID</th> */}
                      <th>Họ và tên</th>
                      <th>Tên đăng nhập</th>
                      <th>Email</th>
                      <th>Số điện thoại</th>
                      <th>Vai trò</th>
                      <th>Trạng thái</th>
                      {activeTab === 'doctor' && <th>Chuyên khoa</th>}
                      {activeTab === 'doctor' && <th>Kinh nghiệm</th>}
                      {activeTab === 'user' && <th>Tuổi</th>}
                      {activeTab === 'user' && <th>Giới tính</th>}
                      <th>Ngày tạo</th>
                      <th>Hành động</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentUsers.map((user) => (
                      <tr key={user.maNguoiDung}>
                        {/* <td>{user.maNguoiDung}</td> */}
                        <td>{user.hoTen}</td>
                        <td>{user.tenDangNhap}</td>
                        <td>{user.email}</td>
                        <td>{user.soDienThoai}</td>
                        <td>
                          <span className={`badge ${
                            user.tenVaiTro === 'ADMIN' ? 'bg-danger' :
                            user.tenVaiTro === 'BACSI' ? 'bg-primary' :
                            'bg-success'
                          }`}>
                            {user.tenVaiTro}
                          </span>
                        </td>
                        <td>
                          <span className={`badge ${user.trangThaiHoatDong ? 'bg-success' : 'bg-secondary'}`}>
                            {user.trangThaiHoatDong ? 'Đang hoạt động' : 'Ngưng hoạt động'}
                          </span>
                        </td>
                        {activeTab === 'doctor' && (
                          <td>{user.chuyenKhoa || 'Không có'}</td>
                        )}
                        {activeTab === 'doctor' && (
                          <td>{user.soNamKinhNghiem ? `${user.soNamKinhNghiem} năm` : 'Không có'}</td>
                        )}
                        {activeTab === 'user' && (
                          <td>{user.tuoi || 'Không có'}</td>
                        )}
                        {activeTab === 'user' && (
                          <td>{user.gioiTinh || 'Không có'}</td>
                        )}
                        <td>{new Date(user.ngayTao).toLocaleDateString()}</td>
                        <td>
                          <div className="btn-group" role="group">
                            <button 
                              className="btn btn-sm btn-outline-primary"
                              title="Chỉnh sửa"
                            >
                              <i className="fas fa-edit"></i>
                            </button>
                            {user.trangThaiHoatDong && user.tenVaiTro !== 'ADMIN' && (
                              <button 
                                className="btn btn-sm btn-outline-warning"
                                onClick={() => handleDeactivateUser(user.maNguoiDung, user.hoTen)}
                                title="Vô hiệu hóa người dùng"
                              >
                                <i className="fas fa-user-slash"></i>
                              </button>
                            )}
                            <button 
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => handleDeleteUser(user.maNguoiDung, user.hoTen)}
                              title="Xóa"
                            >
                              <i className="fas fa-trash"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {filteredUsers.length === 0 && !loading && (
                <div className="text-center py-4">
                  <p className="text-muted">Không tìm thấy {activeTab === 'admin' ? 'quản trị viên' : activeTab === 'doctor' ? 'bác sĩ' : 'người dùng'} nào.</p>
                </div>
              )}

              {/* Pagination */}
              {totalFilteredPages > 1 && (
                <div className="row">
                  <div className="col-md-6">
                    <p className="text-muted">
                      Đang hiển thị {startIndex + 1} - {Math.min(endIndex, filteredUsers.length)} trên tổng số {filteredUsers.length} người dùng
                    </p>
                  </div>
                  <div className="col-md-6">
                    <nav aria-label="Page navigation">
                      <ul className="pagination justify-content-end">
                        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                          <button
                            className="page-link"
                            onClick={() => setCurrentPage(currentPage - 1)}
                            disabled={currentPage === 1}
                          >
                            Trước
                          </button>
                        </li>
                        {Array.from({ length: totalFilteredPages }, (_, i) => i + 1).map((page) => (
                          <li key={page} className={`page-item ${currentPage === page ? 'active' : ''}`}>
                            <button
                              className="page-link"
                              onClick={() => setCurrentPage(page)}
                            >
                              {page}
                            </button>
                          </li>
                        ))}
                        <li className={`page-item ${currentPage === totalFilteredPages ? 'disabled' : ''}`}>
                          <button
                            className="page-link"
                            onClick={() => setCurrentPage(currentPage + 1)}
                            disabled={currentPage === totalFilteredPages}
                          >
                            Tiếp
                          </button>
                        </li>
                      </ul>
                    </nav>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Modal show={showModal} onHide={handleCloseModal} size="lg" centered>
        <Form onSubmit={handleSubmit}>
          <Modal.Header closeButton>
            <Modal.Title>Thêm mới {activeTab === 'admin' ? 'Quản trị viên' : activeTab === 'doctor' ? 'Bác sĩ' : 'Người dùng'}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {formError && <div className="alert alert-danger">{formError}</div>}
            <Row className="g-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Họ và tên</Form.Label>
                  <Form.Control name="hoTen" value={form.hoTen} onChange={handleFormChange} required placeholder="Nhập họ và tên" />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Tên đăng nhập</Form.Label>
                  <Form.Control name="tenDangNhap" value={form.tenDangNhap} onChange={handleFormChange} required placeholder="Nhập tên đăng nhập" />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Mật khẩu</Form.Label>
                  <Form.Control name="matKhau" type="password" value={form.matKhau} onChange={handleFormChange} required placeholder="Nhập mật khẩu" />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Email</Form.Label>
                  <Form.Control name="email" type="email" value={form.email} onChange={handleFormChange} required placeholder="Nhập email" />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Số điện thoại</Form.Label>
                  <Form.Control name="soDienThoai" value={form.soDienThoai} onChange={handleFormChange} required placeholder="Nhập số điện thoại" />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Vai trò</Form.Label>
                  <Form.Select name="vaiTro" value={form.vaiTro} onChange={handleFormChange} required>
                    <option value="ADMIN">Quản trị viên</option>
                    <option value="BACSI">Bác sĩ</option>
                    <option value="USER">Người dùng</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Ngày sinh</Form.Label>
                  <Form.Control name="ngaySinh" type="date" value={form.ngaySinh} onChange={handleFormChange} required />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Giới tính</Form.Label>
                  <Form.Select name="gioiTinh" value={form.gioiTinh} onChange={handleFormChange} required>
                    <option value="">Chọn giới tính</option>
                    <option value="Nam">Nam</option>
                    <option value="Nữ">Nữ</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={12}>
                <Form.Group>
                  <Form.Label>Địa chỉ</Form.Label>
                  <Form.Control name="diaChi" value={form.diaChi} onChange={handleFormChange} required placeholder="Nhập địa chỉ" />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Tiền sử bệnh</Form.Label>
                  <Form.Control name="tienSuBenh" value={form.tienSuBenh} onChange={handleFormChange} placeholder="Nhập tiền sử bệnh (nếu có)" />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Dị ứng</Form.Label>
                  <Form.Control name="diUng" value={form.diUng} onChange={handleFormChange} placeholder="Nhập dị ứng (nếu có)" />
                </Form.Group>
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal} disabled={formLoading}>Hủy</Button>
            <Button variant="primary" type="submit" disabled={formLoading}>{formLoading ? 'Đang lưu...' : 'Lưu'}</Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default Tables; 
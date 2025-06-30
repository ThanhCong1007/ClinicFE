import React, { useState, useEffect } from 'react';
import { adminApi, User, UsersResponse } from '../services/api';

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

  // Fetch users from API
  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response: UsersResponse = await adminApi.getUsers();
      setUsers(response.users);
      setPagination({
        totalItems: response.totalItems,
        totalPages: response.totalPages,
        currentPage: response.currentPage,
      });
    } catch (err) {
      setError('Failed to fetch users. Please try again.');
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
    if (window.confirm(`Are you sure you want to deactivate ${userName}?`)) {
      try {
        const response = await adminApi.deactivateUser(userId);
        setSuccess(response.message);
        // Refresh the users list
        fetchUsers();
        // Clear success message after 3 seconds
        setTimeout(() => setSuccess(null), 3000);
      } catch (err) {
        console.error('Error deactivating user:', err);
        setError('Failed to deactivate user. Please try again.');
        // Clear error message after 3 seconds
        setTimeout(() => setError(null), 3000);
      }
    }
  };

  // Handle user deletion
  const handleDeleteUser = async (userId: number, userName: string) => {
    if (window.confirm(`Are you sure you want to delete ${userName}? This action cannot be undone.`)) {
      try {
        await adminApi.deleteUser(userId);
        setSuccess(`User ${userName} has been deleted successfully.`);
        // Refresh the users list
        fetchUsers();
        // Clear success message after 3 seconds
        setTimeout(() => setSuccess(null), 3000);
      } catch (err) {
        console.error('Error deleting user:', err);
        setError('Failed to delete user. Please try again.');
        // Clear error message after 3 seconds
        setTimeout(() => setError(null), 3000);
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
          title: 'Admin Management',
          addButtonText: 'Add j Admin',
          count: users.filter(u => u.tenVaiTro === 'ADMIN').length
        };
      case 'doctor':
        return {
          title: 'Doctor Management',
          addButtonText: 'Add New Doctor',
          count: users.filter(u => u.tenVaiTro === 'BACSI').length
        };
      case 'user':
        return {
          title: 'User Management',
          addButtonText: 'Add New User',
          count: users.filter(u => u.tenVaiTro === 'USER').length
        };
      default:
        return {
          title: 'Users Management',
          addButtonText: 'Add New User',
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
                <div className="alert alert-danger alert-dismissible fade show" role="alert">
                  {error}
                  <button type="button" className="btn-close" onClick={() => setError(null)}></button>
                </div>
              )}

              {success && (
                <div className="alert alert-success alert-dismissible fade show" role="alert">
                  {success}
                  <button type="button" className="btn-close" onClick={() => setSuccess(null)}></button>
                </div>
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
                    Admins ({users.filter(u => u.tenVaiTro === 'ADMIN').length})
                  </button>
                </li>
                <li className="nav-item" role="presentation">
                  <button
                    className={`nav-link ${activeTab === 'doctor' ? 'active' : ''}`}
                    onClick={() => handleTabChange('doctor')}
                    type="button"
                  >
                    <i className="fas fa-user-md me-2"></i>
                    Doctors ({users.filter(u => u.tenVaiTro === 'BACSI').length})
                  </button>
                </li>
                <li className="nav-item" role="presentation">
                  <button
                    className={`nav-link ${activeTab === 'user' ? 'active' : ''}`}
                    onClick={() => handleTabChange('user')}
                    type="button"
                  >
                    <i className="fas fa-users me-2"></i>
                    Users ({users.filter(u => u.tenVaiTro === 'USER').length})
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
                      placeholder={`Search ${activeTab}s by name, username, email, or phone...`}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
                <div className="col-md-6 text-end">
                  <button className="btn btn-primary admin-btn-primary">
                    <i className="fas fa-plus me-2"></i>
                    {tabInfo.addButtonText}
                  </button>
                </div>
              </div>

              <div className="table-responsive admin-table-responsive">
                <table className="table table-striped table-hover">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Full Name</th>
                      <th>Username</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>Role</th>
                      <th>Status</th>
                      {activeTab === 'doctor' && <th>Specialty</th>}
                      {activeTab === 'doctor' && <th>Experience</th>}
                      {activeTab === 'user' && <th>Age</th>}
                      {activeTab === 'user' && <th>Gender</th>}
                      <th>Created Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentUsers.map((user) => (
                      <tr key={user.maNguoiDung}>
                        <td>{user.maNguoiDung}</td>
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
                            {user.trangThaiHoatDong ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        {activeTab === 'doctor' && (
                          <td>{user.chuyenKhoa || 'N/A'}</td>
                        )}
                        {activeTab === 'doctor' && (
                          <td>{user.soNamKinhNghiem ? `${user.soNamKinhNghiem} years` : 'N/A'}</td>
                        )}
                        {activeTab === 'user' && (
                          <td>{user.tuoi || 'N/A'}</td>
                        )}
                        {activeTab === 'user' && (
                          <td>{user.gioiTinh || 'N/A'}</td>
                        )}
                        <td>{new Date(user.ngayTao).toLocaleDateString()}</td>
                        <td>
                          <div className="btn-group" role="group">
                            <button 
                              className="btn btn-sm btn-outline-primary"
                              title="Edit"
                            >
                              <i className="fas fa-edit"></i>
                            </button>
                            {user.trangThaiHoatDong && user.tenVaiTro !== 'ADMIN' && (
                              <button 
                                className="btn btn-sm btn-outline-warning"
                                onClick={() => handleDeactivateUser(user.maNguoiDung, user.hoTen)}
                                title="Deactivate User"
                              >
                                <i className="fas fa-user-slash"></i>
                              </button>
                            )}
                            <button 
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => handleDeleteUser(user.maNguoiDung, user.hoTen)}
                              title="Delete"
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
                  <p className="text-muted">No {activeTab}s found.</p>
                </div>
              )}

              {/* Pagination */}
              {totalFilteredPages > 1 && (
                <div className="row">
                  <div className="col-md-6">
                    <p className="text-muted">
                      Showing {startIndex + 1} to {Math.min(endIndex, filteredUsers.length)} of {filteredUsers.length} entries
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
                            Previous
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
                            Next
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
    </div>
  );
};

export default Tables; 
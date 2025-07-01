import React, { useState, useEffect } from 'react';
import apiClient from '../services/api'; 

// TypeScript Interfaces based on the provided API response
interface ChiTietHoaDon {
    maMuc: number;
    maHoaDon: number;
    maBenhAnDichVu: number | null;
    moTa: string;
    soLuong: number;
    donGia: number;
    thanhTien: number;
    ngayTao: string;
}

interface HoaDon {
    maHoaDon: number;
    maBenhNhan: number;
    tenBenhNhan: string;
    soDienThoai: string;
    email: string | null;
    maLichHen: number | null;
    tongTien: number;
    thanhTien: number;
    ngayHoaDon: string;
    trangThai: string;
    nguoiTao: number;
    tenNguoiTao: string;
    ngayTao: string;
    chiTietHoaDon: ChiTietHoaDon[];
}

const ITEMS_PER_PAGE = 10;

interface UserGroup {
  maBenhNhan: number;
  tenBenhNhan: string;
  soDienThoai: string;
  email: string | null;
  invoices: HoaDon[];
}

const Billing: React.FC = () => {
  const [invoices, setInvoices] = useState<HoaDon[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'unpaid' | 'paid'>('unpaid');
  const [unpaidCurrentPage, setUnpaidCurrentPage] = useState(1);
  const [paidCurrentPage, setPaidCurrentPage] = useState(1);
  const [modalUser, setModalUser] = useState<UserGroup | null>(null);

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get<HoaDon[]>('/api/hoa-don/admin');
        setInvoices(response.data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch invoices. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchInvoices();
  }, []);

  // Group invoices by user for each tab
  const groupByUser = (data: HoaDon[]) => {
    const map = new Map<number, UserGroup>();
    data.forEach(inv => {
      if (!map.has(inv.maBenhNhan)) {
        map.set(inv.maBenhNhan, {
          maBenhNhan: inv.maBenhNhan,
          tenBenhNhan: inv.tenBenhNhan,
          soDienThoai: inv.soDienThoai,
          email: inv.email,
          invoices: [],
        });
      }
      map.get(inv.maBenhNhan)!.invoices.push(inv);
    });
    return Array.from(map.values());
  };

  const unpaidInvoices = invoices.filter(i => i.trangThai === 'CHUA_THANH_TOAN');
  const paidInvoices = invoices.filter(i => i.trangThai === 'DA_THANH_TOAN');
  const unpaidUsers = groupByUser(unpaidInvoices);
  const paidUsers = groupByUser(paidInvoices);

  // Pagination logic for users
  const getPaginatedUsers = (users: UserGroup[], currentPage: number) => {
    const totalPages = Math.ceil(users.length / ITEMS_PER_PAGE);
    const paginated = users.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);
    return { paginated, totalPages };
  };

  const { paginated: unpaidUsersPage, totalPages: unpaidTotalPages } = getPaginatedUsers(unpaidUsers, unpaidCurrentPage);
  const { paginated: paidUsersPage, totalPages: paidTotalPages } = getPaginatedUsers(paidUsers, paidCurrentPage);

  const handlePageChange = (page: number, type: 'unpaid' | 'paid') => {
    if (type === 'unpaid') setUnpaidCurrentPage(page);
    else setPaidCurrentPage(page);
  };

  // Helper to display status in Vietnamese
  const getStatusLabel = (status: string) => {
    if (status === 'DA_THANH_TOAN') return 'Đã thanh toán';
    if (status === 'CHUA_THANH_TOAN') return 'Chưa thanh toán';
    return status;
  };

  // Modal for user invoices
  const renderUserModal = () => {
    if (!modalUser) return null;
    return (
      <div className="modal show d-block" tabIndex={-1} style={{ background: 'rgba(0,0,0,0.3)' }}>
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Invoices for {modalUser.tenBenhNhan}</h5>
              <button type="button" className="btn-close" onClick={() => setModalUser(null)}></button>
            </div>
            <div className="modal-body">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>Invoice ID</th>
                    <th>Date</th>
                    <th>Amount</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {modalUser.invoices.map(inv => (
                    <tr key={inv.maHoaDon}>
                      <td>{inv.maHoaDon}</td>
                      <td>{new Date(inv.ngayHoaDon).toLocaleDateString()}</td>
                      <td>{inv.tongTien.toLocaleString('vi-VN')} VND</td>
                      <td>
                        <span className={`badge ${inv.trangThai === 'DA_THANH_TOAN' ? 'bg-success' : 'bg-warning'}`}>{getStatusLabel(inv.trangThai)}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setModalUser(null)}>Close</button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderUserTable = (users: UserGroup[], title: string, currentPage: number, totalPages: number, onPageChange: (page: number) => void) => (
    <div className="card admin-card" style={{ height: '675.19px' }}>
      <div className="card-header">
        <h6 className="mb-0">{title}</h6>
      </div>
      <div className="card-body">
        <div className="table-responsive admin-table-responsive">
          <table className="table table-hover">
            <thead>
              <tr>
                <th>Patient Name</th>
                <th>Phone</th>
                <th>Email</th>
                <th>Number of Invoices</th>
                <th>Total Amount</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.length > 0 ? (
                users.map(user => (
                  <tr key={user.maBenhNhan}>
                    <td>{user.tenBenhNhan}</td>
                    <td>{user.soDienThoai}</td>
                    <td>{user.email || '-'}</td>
                    <td>{user.invoices.length}</td>
                    <td>{user.invoices.reduce((sum, inv) => sum + inv.tongTien, 0).toLocaleString('vi-VN')} VND</td>
                    <td>
                      <button className="btn btn-sm btn-outline-primary" onClick={() => setModalUser(user)}>View Details</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="text-center">No users found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {totalPages > 1 && (
          <nav className="mt-3">
            <ul className="pagination justify-content-end">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <li key={page} className={`page-item ${currentPage === page ? 'active' : ''}`}>
                  <button className="page-link" onClick={() => onPageChange(page)}>{page}</button>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </div>
    </div>
  );

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div>
      <div className="row mb-4">
        <div className="col-12">
          <h4 className="mb-3">Invoices by User</h4>
        </div>
      </div>
      <ul className="nav nav-tabs mb-3">
        <li className="nav-item">
          <button className={`nav-link ${activeTab === 'unpaid' ? 'active' : ''}`} onClick={() => setActiveTab('unpaid')}>
            Unpaid
          </button>
        </li>
        <li className="nav-item">
          <button className={`nav-link ${activeTab === 'paid' ? 'active' : ''}`} onClick={() => setActiveTab('paid')}>
            Paid
          </button>
        </li>
      </ul>
      {activeTab === 'unpaid' && renderUserTable(unpaidUsersPage, 'Unpaid Users', unpaidCurrentPage, unpaidTotalPages, (page) => handlePageChange(page, 'unpaid'))}
      {activeTab === 'paid' && renderUserTable(paidUsersPage, 'Paid Users', paidCurrentPage, paidTotalPages, (page) => handlePageChange(page, 'paid'))}
      {renderUserModal()}
    </div>
  );
};

export default Billing; 
import { useEffect, useState, useCallback } from 'react';
import { getMedicalRecords } from '../services/api';
import debounce from 'lodash/debounce';
import { Row, Col, Input, List, Spin, Alert, Card, Empty, Pagination, Descriptions, Table, Button, Tag } from 'antd';
import { format } from 'date-fns';
import NotificationModal from '../../user/components/widgets/NotificationModal';
import { useNavigate } from 'react-router-dom';

interface MedicalRecord {
  nguoiDung: number;
  maBenhAn: number;
  ngayTao: string;
  maLichHen: number | null;
  maBacSi: number;
  tenBacSi: string;
  maBenhNhan: number;
  tenBenhNhan: string;
  soDienThoai: string;
  hoTen: string;
  ngaySinh: string;
  gioiTinh: string;
  email: string;
  diaChi: string;
  tienSuBenh: string;
  diUng: string;
  lyDoKham: string;
  chanDoan: string;
  ghiChuDieuTri: string;
  ngayTaiKham: string | null;
  editable: boolean;
}

interface PatientData {
  info: {
    maBenhNhan: string;
    tenBenhNhan: string;
    soDienThoaiBenhNhan: string;
  };
  records: MedicalRecord[];
}

interface Patients {
  [key: string]: PatientData;
}

export default function Patients() {
  const [allPatients, setAllPatients] = useState<Patients>({});
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<string | null>(null);
  const [notification, setNotification] = useState<{ show: boolean, title: string, message: string, type: 'success' | 'error' | 'info' }>({ show: false, title: '', message: '', type: 'info' });
  
  // Client-side pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const PATIENTS_PER_PAGE = 10;

  const navigate = useNavigate();

  const processRecordsToPatients = (records: MedicalRecord[]) => {
    const patientsMap: Patients = {};
    for (const record of records) {
      const maBenhNhan = record.maBenhNhan?.toString() || '';
      if (!maBenhNhan) continue;
      if (!patientsMap[maBenhNhan]) {
        patientsMap[maBenhNhan] = {
          info: {
            maBenhNhan,
            tenBenhNhan: record.tenBenhNhan || '',
            soDienThoaiBenhNhan: record.soDienThoai || '',
          },
          records: []
        };
      }
      patientsMap[maBenhNhan].records.push(record);
    }
    return patientsMap;
  };
  
  const fetchAllMedicalRecords = useCallback(async (keyword: string) => {
    try {
      setSearching(true);
      setAllPatients({});
      setSelectedPatient(null);
      setCurrentPage(1);

      const allRecords = await getMedicalRecords();
      if (!allRecords || !Array.isArray(allRecords)) {
        setAllPatients({});
        return;
      }

      // Filter records by keyword if provided
      let filteredRecords = allRecords;
      if (keyword.trim()) {
        filteredRecords = allRecords.filter(record => 
          record.tenBenhNhan.toLowerCase().includes(keyword.toLowerCase()) ||
          record.soDienThoai.includes(keyword)
        );
      }

      const patientsMap = processRecordsToPatients(filteredRecords);
      setAllPatients(patientsMap);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra khi tải dữ liệu');
      setAllPatients({});
    } finally {
      setSearching(false);
    }
  }, []);

  const debouncedSearch = useCallback(
    debounce((value: string) => {
      fetchAllMedicalRecords(value);
    }, 500),
    [fetchAllMedicalRecords]
  );

  useEffect(() => {
    setLoading(true);
    fetchAllMedicalRecords('').finally(() => setLoading(false));
  }, [fetchAllMedicalRecords]);

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
      setSelectedPatient(null);
    }
  };
  
  const patientEntries = Object.entries(allPatients);
  const totalPages = Math.ceil(patientEntries.length / PATIENTS_PER_PAGE);
  const startIndex = (currentPage - 1) * PATIENTS_PER_PAGE;
  const displayedPatientEntries = patientEntries.slice(startIndex, startIndex + PATIENTS_PER_PAGE);

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const pageNumbers = [];
    const maxPagesToShow = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return (
      <Pagination
        current={currentPage}
        total={patientEntries.length}
        pageSize={PATIENTS_PER_PAGE}
        onChange={handlePageChange}
        style={{ marginTop: 16, textAlign: 'center' }}
        showSizeChanger={false}
      />
    );
  };
  
  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: 24 }}>
        <Alert message="Lỗi" description={error} type="error" showIcon />
      </div>
    );
  }

  const recordColumns = [
    { title: 'Mã bệnh án', dataIndex: 'maBenhAn', key: 'maBenhAn' },
    { title: 'Ngày khám', dataIndex: 'ngayTao', key: 'ngayTao', render: (text: string) => format(new Date(text), 'dd/MM/yyyy') },
    { title: 'Lý do khám', dataIndex: 'lyDoKham', key: 'lyDoKham' },
    { title: 'Chẩn đoán', dataIndex: 'chanDoan', key: 'chanDoan' },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_: any, record: MedicalRecord) => (
        <Button
          type={record.editable ? "primary" : "default"}
          size="small"
          onClick={() => navigate('/dashboard/examination', { state: { maBenhAn: record.maBenhAn, editable: record.editable } })}
        >
          {record.editable ? 'Chỉnh sửa' : 'Xem chi tiết'}
        </Button>
      ),
    },
  ];

  const calculateAge = (birthDateString?: string) => {
    if (!birthDateString) return 'Không rõ';
    const birthDate = new Date(birthDateString);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
  };
  
  return (
    <div style={{ padding: 24 }}>
      <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
        <Col><h2>Danh sách bệnh nhân</h2></Col>
        <Col span={8}>
          <Input.Search
            placeholder="Tìm kiếm theo tên hoặc số điện thoại..."
            value={searchTerm}
            onChange={(e) => {
              const value = e.target.value;
              setSearchTerm(value);
              debouncedSearch(value);
            }}
            loading={searching}
            allowClear
          />
        </Col>
      </Row>

      <Row gutter={24}>
        <Col span={8} style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 200px)' }}>
          <List
            style={{ flex: 1, overflowY: 'auto' }}
            dataSource={displayedPatientEntries}
            renderItem={([maBenhNhan, patient]) => (
              <List.Item
                key={maBenhNhan}
                onClick={() => setSelectedPatient(maBenhNhan)}
                style={{
                  cursor: 'pointer',
                  backgroundColor: selectedPatient === maBenhNhan ? '#e6f7ff' : '#fff',
                }}
                actions={[<Tag color="blue">{patient.records.length} bệnh án</Tag>]}
              >
                <List.Item.Meta
                  title={<a>{patient.info.tenBenhNhan}</a>}
                  description={`SĐT: ${patient.info.soDienThoaiBenhNhan}`}
                />
              </List.Item>
            )}
            locale={{ emptyText: <Empty description="Không có bệnh nhân nào" /> }}
          />
          {renderPagination()}
        </Col>

        <Col span={16}>
          {selectedPatient && allPatients[selectedPatient] ? (
            (() => {
              const patient = allPatients[selectedPatient];
              const latestRecord = patient.records.length > 0 ? patient.records[0] : null;

              return (
                <Card title="Thông tin chi tiết bệnh nhân">
                  <Descriptions bordered column={2}>
                    <Descriptions.Item label="Tên bệnh nhân">{patient.info.tenBenhNhan}</Descriptions.Item>
                    <Descriptions.Item label="Số điện thoại">{patient.info.soDienThoaiBenhNhan}</Descriptions.Item>
                    {latestRecord && (
                      <>
                        <Descriptions.Item label="Địa chỉ">{latestRecord.diaChi || 'Không rõ'}</Descriptions.Item>
                        <Descriptions.Item label="Năm sinh">{latestRecord.ngaySinh ? new Date(latestRecord.ngaySinh).toLocaleDateString('vi-VN') : 'Không rõ'}</Descriptions.Item>
                        <Descriptions.Item label="Tuổi">{calculateAge(latestRecord.ngaySinh)}</Descriptions.Item>
                        <Descriptions.Item label="Giới tính">{latestRecord.gioiTinh || 'Không rõ'}</Descriptions.Item>
                        <Descriptions.Item label="Email">{latestRecord.email || 'Không có'}</Descriptions.Item>
                        <Descriptions.Item label="Tiền sử bệnh">{latestRecord.tienSuBenh || 'Không có'}</Descriptions.Item>
                        <Descriptions.Item label="Dị ứng">{latestRecord.diUng || 'Không có'}</Descriptions.Item>
                        <Descriptions.Item label="Chẩn đoán gần nhất" span={2}>{latestRecord.chanDoan || 'Chưa có'}</Descriptions.Item>
                      </>
                    )}
                  </Descriptions>
                  
                  <h5 style={{ marginTop: 24, marginBottom: 16 }}>Lịch sử bệnh án</h5>
                  <Table
                    columns={recordColumns}
                    dataSource={patient.records}
                    rowKey="maBenhAn"
                    pagination={{ pageSize: 5 }}
                    bordered
                    size="small"
                  />
                </Card>
              );
            })()
          ) : (
            <Card style={{ height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <Empty description="Chọn một bệnh nhân từ danh sách để xem chi tiết bệnh án." />
            </Card>
          )}
        </Col>
      </Row>

      <NotificationModal
        isOpen={notification.show}
        onClose={() => setNotification({...notification, show: false})}
        title={notification.title}
        message={notification.message}
        type={notification.type}
      />
    </div>
  );
} 
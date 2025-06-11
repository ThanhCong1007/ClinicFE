import { useEffect, useState, useRef } from 'react';
import { Search, Pill, AlertCircle, Clock, DollarSign } from 'lucide-react';
import { Form, Button, Card, Row, Col, InputGroup } from 'react-bootstrap';
import axios from 'axios';

interface Drug {
  maThuoc: number;
  maLoaiThuoc: number | null;
  tenThuoc: string;
  hoatChat: string;
  hamLuong: string;
  nhaSanXuat: string;
  nuocSanXuat: string;
  dangBaoChe: string;
  donViTinh: string;
  duongDung: string;
  huongDanSuDung: string;
  cachBaoQuan: string;
  phanLoaiDonThuoc: string;
  chongChiDinh: string;
  tacDungPhu: string;
  tuongTacThuoc: string;
  nhomThuocThaiKy: string;
  gia: number;
  soLuongTon: number;
  nguongCanhBao: number;
  trangThaiHoatDong: boolean;
  ngayTao: string;
  ngayCapNhat: string;
  quantity?: number;
  notes?: string;
}

export function DrugSearch() {
  const [drugs, setDrugs] = useState<Drug[]>([]);
  const [selectedDrugs, setSelectedDrugs] = useState<Drug[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const searchRef = useRef<HTMLInputElement>(null);

  // Fetch drugs from API
  useEffect(() => {
    const fetchDrugs = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/public/Thuoc');
        setDrugs(response.data);
      } catch (error) {
        console.error('Error fetching drugs:', error);
        setError('Không thể tải danh sách thuốc. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };

    fetchDrugs();
  }, []);

  // Filter drugs based on search term
  const filteredDrugs = drugs.filter(drug => 
    drug.tenThuoc.toLowerCase().includes(searchTerm.toLowerCase()) ||
    drug.hoatChat.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Add drug to selected list
  const selectDrug = (drug: Drug) => {
    const isAlreadySelected = selectedDrugs.some(selected => selected.maThuoc === drug.maThuoc);
    if (!isAlreadySelected) {
      setSelectedDrugs([...selectedDrugs, { ...drug, quantity: 1, notes: '' }]);
    }
    setSearchTerm('');
  };

  // Remove drug from selected list
  const removeDrug = (maThuoc: number) => {
    setSelectedDrugs(selectedDrugs.filter(drug => drug.maThuoc !== maThuoc));
  };

  // Update drug quantity
  const updateQuantity = (maThuoc: number, quantity: number) => {
    setSelectedDrugs(selectedDrugs.map(drug => 
      drug.maThuoc === maThuoc ? { ...drug, quantity } : drug
    ));
  };

  // Update drug notes
  const updateNotes = (maThuoc: number, notes: string) => {
    setSelectedDrugs(selectedDrugs.map(drug => 
      drug.maThuoc === maThuoc ? { ...drug, notes } : drug
    ));
  };

  return (
    <div className="container-fluid p-0">
      <Card className="mb-4">
        <Card.Header className="bg-white">
          <h5 className="mb-0 d-flex align-items-center">
            <Pill className="text-primary me-2" />
            Tìm kiếm và thêm thuốc
          </h5>
        </Card.Header>
        <Card.Body>
          {loading && <div>Đang tải danh sách thuốc...</div>}
          {error && <div className="alert alert-danger">{error}</div>}
          
          {/* Search form */}
          <div className="position-relative mb-4">
            <InputGroup>
              <InputGroup.Text>
                <Search size={16} />
              </InputGroup.Text>
              <Form.Control
                type="text"
                placeholder="Tìm kiếm thuốc..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                ref={searchRef}
              />
            </InputGroup>
          </div>

          {/* Drug list */}
          <div className="mb-4">
            {filteredDrugs.map((drug) => (
              <Card key={drug.maThuoc} className="mb-3">
                <Card.Body>
                  <div className="d-flex justify-content-between">
                    <div>
                      <h6 className="mb-1">{drug.tenThuoc}</h6>
                      <p className="mb-1 small text-muted">
                        {drug.hoatChat} {drug.hamLuong}{drug.donViTinh} - {drug.dangBaoChe}
                      </p>
                      <p className="mb-1 small">
                        <strong>Hãng:</strong> {drug.nhaSanXuat} ({drug.nuocSanXuat})
                      </p>
                      <p className="mb-1 small">
                        <strong>Giá:</strong> {drug.gia.toLocaleString()}đ
                      </p>
                      <p className="mb-1 small">
                        <strong>Hướng dẫn:</strong> {drug.huongDanSuDung}
                      </p>
                    </div>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => selectDrug(drug)}
                      disabled={selectedDrugs.some(d => d.maThuoc === drug.maThuoc)}
                    >
                      Thêm vào đơn
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            ))}
          </div>

          {/* Selected drugs list */}
          {selectedDrugs.length > 0 && (
            <div>
              <h6 className="mb-3">Thuốc đã chọn ({selectedDrugs.length})</h6>
              {selectedDrugs.map((drug) => (
                <Card key={drug.maThuoc} className="mb-3">
                  <Card.Body>
                    <div className="d-flex justify-content-between mb-3">
                      <div>
                        <h6 className="mb-1">{drug.tenThuoc}</h6>
                        <p className="mb-1 small text-muted">
                          {drug.hoatChat} {drug.hamLuong}{drug.donViTinh} - {drug.dangBaoChe}
                        </p>
                        <p className="mb-1 small">
                          <strong>Giá:</strong> {drug.gia.toLocaleString()}đ
                        </p>
                      </div>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => removeDrug(drug.maThuoc)}
                      >
                        Xóa
                      </Button>
                    </div>
                    <Row className="g-3">
                      <Col md={4}>
                        <Form.Group>
                          <Form.Label className="small">Số lượng</Form.Label>
                          <Form.Control
                            type="number"
                            min="1"
                            value={drug.quantity || 1}
                            onChange={(e) => updateQuantity(drug.maThuoc, parseInt(e.target.value) || 1)}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={8}>
                        <Form.Group>
                          <Form.Label className="small">Ghi chú</Form.Label>
                          <Form.Control
                            type="text"
                            value={drug.notes || ''}
                            onChange={(e) => updateNotes(drug.maThuoc, e.target.value)}
                            placeholder="Ghi chú cách dùng..."
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                    <div className="text-end mt-3">
                      <span className="h5 text-primary">
                        Tổng: {(drug.gia * (drug.quantity || 1)).toLocaleString()}đ
                      </span>
                    </div>
                  </Card.Body>
                </Card>
              ))}
              
              {/* Total amount */}
              <Card className="bg-light mb-4">
                <Card.Body>
                  <div className="text-end">
                    <h5 className="text-primary mb-0">
                      Tổng tiền đơn thuốc: {selectedDrugs.reduce((total, drug) => 
                        total + (drug.gia * (drug.quantity || 1)), 0).toLocaleString()}đ
                    </h5>
                  </div>
                </Card.Body>
              </Card>

              {/* Action buttons */}
              <div className="d-flex justify-content-end gap-2">
                <Button 
                  variant="outline-secondary"
                  onClick={() => setSelectedDrugs([])}
                >
                  Xóa tất cả
                </Button>
              </div>
            </div>
          )}
        </Card.Body>
      </Card>
    </div>
  );
} 
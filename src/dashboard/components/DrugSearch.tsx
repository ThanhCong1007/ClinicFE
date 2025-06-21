import { useEffect, useState, useRef } from 'react';
import { Search, Pill, AlertCircle, Clock, DollarSign } from 'lucide-react';
import { Form, Button, Card, Row, Col, InputGroup } from 'react-bootstrap';
import { fetchDrugs } from '../services/api';

export interface Drug {
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

interface DrugSearchProps {
  onDrugsChange?: (drugs: Drug[]) => void;
  storageKey?: string;
}

export function DrugSearch({ onDrugsChange, storageKey }: DrugSearchProps) {
  const [drugs, setDrugs] = useState<Drug[]>([]);
  const [selectedDrugs, setSelectedDrugs] = useState<Drug[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeSuggestion, setActiveSuggestion] = useState(-1);
  const searchRef = useRef<HTMLInputElement>(null);
  const suggestionRefs = useRef<Array<HTMLDivElement | null>>([]);

  // Fetch drugs from API
  useEffect(() => {
    const fetchDrugsList = async () => {
      try {
        setLoading(true);
        const drugs = await fetchDrugs();
        setDrugs(drugs);
      } catch (error) {
        console.error('Error fetching drugs:', error);
        setError('Không thể tải danh sách thuốc. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };

    fetchDrugsList();
  }, []);

  // Restore selected drugs from localStorage when component mounts
  useEffect(() => {
    if (storageKey) {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (parsed.selectedDrugs && drugs.length > 0) {
            // Map saved drugs to current drug list
            const restoredDrugs = parsed.selectedDrugs.map((savedDrug: Drug) => {
              // Find matching drug in current drug list
              const currentDrug = drugs.find(d => d.maThuoc === savedDrug.maThuoc);
              if (currentDrug) {
                return {
                  ...currentDrug,
                  quantity: savedDrug.quantity || 1,
                  notes: savedDrug.notes || ''
                };
              }
              return null;
            }).filter((drug: Drug | null): drug is Drug => drug !== null);

            setSelectedDrugs(restoredDrugs);
            onDrugsChange?.(restoredDrugs);
          }
        } catch (error) {
          console.error('Error parsing saved drugs:', error);
        }
      }
    }
  }, [storageKey, onDrugsChange, drugs]);

  // Filter drugs based on search term
  const filteredDrugs = drugs.filter(drug =>
    drug.tenThuoc.toLowerCase().includes(searchTerm.toLowerCase()) ||
    drug.hoatChat.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setActiveSuggestion(prev =>
          prev < filteredDrugs.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setActiveSuggestion(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (activeSuggestion >= 0) {
          selectDrug(filteredDrugs[activeSuggestion]);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setActiveSuggestion(-1);
        break;
    }
  };

  // Update selectedDrugs state and notify parent
  const updateSelectedDrugs = (newDrugs: Drug[]) => {
    setSelectedDrugs(newDrugs);
    onDrugsChange?.(newDrugs);
  };

  // Add drug to selected list
  const selectDrug = (drug: Drug) => {
    const isAlreadySelected = selectedDrugs.some(selected => selected.maThuoc === drug.maThuoc);
    if (!isAlreadySelected) {
      const newDrugs = [...selectedDrugs, { ...drug, quantity: 1, notes: '' }];
      updateSelectedDrugs(newDrugs);
    }
    setSearchTerm('');
    setShowSuggestions(false);
    setActiveSuggestion(-1);
  };

  // Remove drug from selected list
  const removeDrug = (maThuoc: number) => {
    const newDrugs = selectedDrugs.filter(drug => drug.maThuoc !== maThuoc);
    updateSelectedDrugs(newDrugs);
  };

  // Update drug quantity
  const updateQuantity = (maThuoc: number, quantity: number) => {
    const newDrugs = selectedDrugs.map(drug =>
      drug.maThuoc === maThuoc ? { ...drug, quantity: Math.max(1, quantity) } : drug
    );
    updateSelectedDrugs(newDrugs);
  };

  // Update drug notes
  const updateNotes = (maThuoc: number, notes: string) => {
    const newDrugs = selectedDrugs.map(drug =>
      drug.maThuoc === maThuoc ? { ...drug, notes } : drug
    );
    updateSelectedDrugs(newDrugs);
  };

  // Highlight text
  const highlightText = (text: string, highlight: string) => {
    if (!highlight) return text;
    const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
    return parts.map((part, index) =>
      part.toLowerCase() === highlight.toLowerCase() ?
        <span key={index} className="bg-yellow-200 font-medium">{part}</span> : part
    );
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

          {/* Form tìm kiếm */}
          <div className="position-relative mb-4">
            <InputGroup>
              <InputGroup.Text style={{ height: '42px', display: 'flex', alignItems: 'center', padding: '0 12px' }}>
                <Search className="text-muted" style={{ height: '24px', width: '24px' }} />
              </InputGroup.Text>
              <Form.Control
                ref={searchRef}
                type="text"
                placeholder="Tìm kiếm thuốc..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setShowSuggestions(e.target.value.length >= 2);
                }}
                onKeyDown={handleKeyDown}
                onFocus={() => searchTerm.length >= 2 && setShowSuggestions(true)}
                style={{ height: '42px', paddingTop: '10px', paddingBottom: '10px' }}
              />
            </InputGroup>
          </div>

          {/* Gợi ý */}
          {showSuggestions && filteredDrugs.length > 0 && (
            <div className="position-absolute w-100 mt-1 bg-white border rounded shadow-sm" style={{ zIndex: 1000, maxHeight: '400px', overflowY: 'auto' }}>
              {filteredDrugs.map((drug, index) => (
                <div
                  key={drug.maThuoc}
                  ref={(el) => {
                    suggestionRefs.current[index] = el;
                  }}
                  onClick={() => selectDrug(drug)}
                  className={`p-3 border-bottom cursor-pointer ${index === activeSuggestion ? 'bg-light' : 'hover-bg-light'
                    }`}
                >
                  <div className="d-flex justify-content-between">
                    <div className="flex-grow-1">
                      <div className="d-flex align-items-center mb-2">
                        <Pill className="text-primary me-2" />
                        <h6 className="mb-0 fw-semibold">
                          {highlightText(drug.tenThuoc, searchTerm)}
                        </h6>
                        <span className="badge bg-primary ms-2">
                          {highlightText(drug.hoatChat, searchTerm)}
                        </span>
                      </div>

                      <div className="row g-2 mb-2">
                        <div className="col-6">
                          <small className="text-muted">
                            <strong>Hãng:</strong> {highlightText(drug.nhaSanXuat, searchTerm)}
                          </small>
                        </div>
                        <div className="col-6">
                          <small className="text-success">
                            <DollarSign className="me-1" />
                            <strong>{drug.gia.toLocaleString()}đ/{drug.donViTinh}</strong>
                          </small>
                        </div>
                      </div>

                      <div className="small text-muted mb-1">
                        <strong>Chỉ định:</strong> {drug.huongDanSuDung}
                      </div>

                      {drug.chongChiDinh && (
                        <div className="small text-danger d-flex align-items-start">
                          <AlertCircle className="me-1 mt-1" />
                          <span><strong>Chống chỉ định:</strong> {drug.chongChiDinh}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {showSuggestions && filteredDrugs.length === 0 && searchTerm.length >= 2 && (
            <div className="position-absolute w-100 mt-1 bg-white border rounded shadow-sm p-3 text-center text-muted">
              Không tìm thấy thuốc phù hợp
            </div>
          )}

          {selectedDrugs.length > 0 && (
            <div>
              <h6 className="mb-3 d-flex align-items-center">
                <Clock className="text-success me-2" />
                Thuốc đã chọn ({selectedDrugs.length})
              </h6>

              <div className="mb-3">
                {selectedDrugs.map((drug) => (
                  <Card key={drug.maThuoc} className="mb-2 px-2 py-2">
                    <Card.Body className="p-2">
                      <Row className="align-items-center">
                        <Col xs={12} md={6}>
                          <div className="d-flex align-items-center">
                            <Pill className="text-primary me-2" />
                            <strong>{drug.tenThuoc}</strong>
                            <span className="badge bg-primary ms-2">{drug.hoatChat}</span>
                          </div>
                          <div className="small text-muted">
                            {drug.nhaSanXuat} - {drug.donViTinh}
                          </div>
                        </Col>

                        <Col xs={6} md={2}>
                          <Form.Control
                            size="sm"
                            type="number"
                            min="1"
                            value={drug.quantity || 1}
                            onChange={(e) => updateQuantity(drug.maThuoc, parseInt(e.target.value) || 1)}
                          />
                        </Col>

                        <Col xs={6} md={3}>
                          <Form.Control
                            size="sm"
                            type="text"
                            placeholder="Ghi chú"
                            value={drug.notes || ''}
                            onChange={(e) => updateNotes(drug.maThuoc, e.target.value)}
                          />
                        </Col>

                        <Col xs={12} md={1} className="text-end">
                          <Button
                            variant="link"
                            className="text-danger p-0"
                            onClick={() => removeDrug(drug.maThuoc)}
                          >
                            <svg className="bi" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                              <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
                            </svg>
                          </Button>
                        </Col>
                      </Row>

                      <div className="text-end mt-2 small text-primary">
                        Tổng: {(drug.gia * (drug.quantity || 1)).toLocaleString()}đ
                      </div>
                    </Card.Body>
                  </Card>
                ))}
              </div>

              <Card className="bg-light mb-3">
                <Card.Body className="py-2">
                  <div className="text-end">
                    <strong className="text-primary">
                      Tổng tiền: {selectedDrugs.reduce((total, drug) =>
                        total + (drug.gia * (drug.quantity || 1)), 0).toLocaleString()}đ
                    </strong>
                  </div>
                </Card.Body>
              </Card>

              <div className="d-flex justify-content-end">
                <Button
                  variant="outline-secondary"
                  size="sm"
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
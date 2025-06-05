import { useEffect, useState, useRef } from 'react';
import { Search, Pill, AlertCircle, Clock, DollarSign } from 'lucide-react';
import { Form, Button, Card, Row, Col, InputGroup } from 'react-bootstrap';

interface Drug {
  id: number;
  name: string;
  type: string;
  price: number;
  unit: string;
  manufacturer: string;
  indication: string;
  dosage: string;
  contraindication: string;
  quantity?: number;
  notes?: string;
}

// Base drug data without optional properties
interface BaseDrug {
  id: number;
  name: string;
  type: string;
  price: number;
  unit: string;
  manufacturer: string;
  indication: string;
  dosage: string;
  contraindication: string;
}

// Dữ liệu mẫu thuốc
const sampleDrugs: BaseDrug[] = [
  {
    id: 1,
    name: 'Paracetamol 500mg',
    type: 'Thuốc giảm đau, hạ sốt',
    price: 2500,
    unit: 'viên',
    manufacturer: 'Imexpharm',
    indication: 'Giảm đau, hạ sốt',
    dosage: '1-2 viên/lần, 3-4 lần/ngày',
    contraindication: 'Suy gan nặng'
  },
  {
    id: 2,
    name: 'Amoxicillin 500mg',
    type: 'Kháng sinh',
    price: 4200,
    unit: 'viên',
    manufacturer: 'Stada Vietnam',
    indication: 'Nhiễm khuẩn đường hô hấp',
    dosage: '1 viên x 3 lần/ngày',
    contraindication: 'Dị ứng Penicillin'
  },
  {
    id: 3,
    name: 'Vitamin C 1000mg',
    type: 'Vitamin',
    price: 1800,
    unit: 'viên sủi',
    manufacturer: 'Pharmacity',
    indication: 'Bổ sung vitamin C',
    dosage: '1 viên/ngày',
    contraindication: 'Sỏi thận'
  },
  {
    id: 4,
    name: 'Aspirin 100mg',
    type: 'Thuốc tim mạch',
    price: 3500,
    unit: 'viên',
    manufacturer: 'Bayer',
    indication: 'Phòng ngừa đột quỵ, nhồi máu cơ tim',
    dosage: '1 viên/ngày sau ăn',
    contraindication: 'Loét dạ dày'
  },
  {
    id: 5,
    name: 'Omeprazole 20mg',
    type: 'Thuốc dạ dày',
    price: 5200,
    unit: 'viên',
    manufacturer: 'Teva',
    indication: 'Điều trị loét dạ dày, trào ngược',
    dosage: '1 viên/ngày trước ăn sáng',
    contraindication: 'Dị ứng thành phần thuốc'
  },
  {
    id: 6,
    name: 'Ibuprofen 400mg',
    type: 'Thuốc chống viêm',
    price: 3200,
    unit: 'viên',
    manufacturer: 'Abbott',
    indication: 'Giảm đau, chống viêm',
    dosage: '1 viên x 2-3 lần/ngày',
    contraindication: 'Loét tiêu hóa'
  },
  {
    id: 7,
    name: 'Metformin 500mg',
    type: 'Thuốc tiểu đường',
    price: 2800,
    unit: 'viên',
    manufacturer: 'Merck',
    indication: 'Điều trị tiểu đường type 2',
    dosage: '1-2 viên x 2 lần/ngày',
    contraindication: 'Suy thận nặng'
  },
  {
    id: 8,
    name: 'Cetirizine 10mg',
    type: 'Thuốc chống dị ứng',
    price: 1500,
    unit: 'viên',
    manufacturer: 'Johnson & Johnson',
    indication: 'Điều trị dị ứng, mày đay',
    dosage: '1 viên/ngày',
    contraindication: 'Suy thận nặng'
  }
];

export function DrugSearch() {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState<BaseDrug[]>([]);
  const [selectedDrugs, setSelectedDrugs] = useState<Drug[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeSuggestion, setActiveSuggestion] = useState(-1);
  const searchRef = useRef<HTMLInputElement>(null);
  const suggestionRefs = useRef<Array<HTMLDivElement | null>>([]);

  // Tìm kiếm gợi ý
  useEffect(() => {
    if (searchTerm.length >= 2) {
      const filtered = sampleDrugs.filter(drug =>
        drug.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        drug.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        drug.manufacturer.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setSuggestions(filtered);
      setShowSuggestions(true);
      setActiveSuggestion(-1);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [searchTerm]);

  // Xử lý phím bấm
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setActiveSuggestion(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setActiveSuggestion(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (activeSuggestion >= 0) {
          selectDrug(suggestions[activeSuggestion]);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setActiveSuggestion(-1);
        break;
    }
  };

  // Chọn thuốc
  const selectDrug = (drug: BaseDrug) => {
    const isAlreadySelected = selectedDrugs.some(selected => selected.id === drug.id);
    if (!isAlreadySelected) {
      const newDrug: Drug = {
        ...drug,
        quantity: 1,
        notes: ''
      };
      setSelectedDrugs([...selectedDrugs, newDrug]);
    }
    setSearchTerm('');
    setShowSuggestions(false);
    setActiveSuggestion(-1);
  };

  // Xóa thuốc đã chọn
  const removeDrug = (drugId: number) => {
    setSelectedDrugs(selectedDrugs.filter(drug => drug.id !== drugId));
  };

  // Cập nhật số lượng
  const updateQuantity = (drugId: number, quantity: number) => {
    setSelectedDrugs(selectedDrugs.map(drug => 
      drug.id === drugId ? { ...drug, quantity: Math.max(1, quantity) } : drug
    ));
  };

  // Cập nhật ghi chú
  const updateNotes = (drugId: number, notes: string) => {
    setSelectedDrugs(selectedDrugs.map(drug => 
      drug.id === drugId ? { ...drug, notes } : drug
    ));
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
          {/* Form tìm kiếm */}
          <div className="position-relative mb-4">
            <InputGroup>
              <InputGroup.Text>
                <Search className="text-muted" />
              </InputGroup.Text>
              <Form.Control
                ref={searchRef}
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleKeyDown}
                onFocus={() => searchTerm.length >= 2 && setShowSuggestions(true)}
                placeholder="Nhập tên thuốc, loại thuốc hoặc hãng sản xuất..."
              />
            </InputGroup>

            {/* Gợi ý */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="position-absolute w-100 mt-1 bg-white border rounded shadow-sm" style={{ zIndex: 1000, maxHeight: '400px', overflowY: 'auto' }}>
                {suggestions.map((drug, index) => (
                  <div
                    key={drug.id}
                    ref={(el) => {
                      suggestionRefs.current[index] = el;
                    }}
                    onClick={() => selectDrug(drug)}
                    className={`p-3 border-bottom cursor-pointer ${
                      index === activeSuggestion ? 'bg-light' : 'hover-bg-light'
                    }`}
                  >
                    <div className="d-flex justify-content-between">
                      <div className="flex-grow-1">
                        <div className="d-flex align-items-center mb-2">
                          <Pill className="text-primary me-2" />
                          <h6 className="mb-0 fw-semibold">
                            {highlightText(drug.name, searchTerm)}
                          </h6>
                          <span className="badge bg-primary ms-2">
                            {highlightText(drug.type, searchTerm)}
                          </span>
                        </div>
                        
                        <div className="row g-2 mb-2">
                          <div className="col-6">
                            <small className="text-muted">
                              <strong>Hãng:</strong> {highlightText(drug.manufacturer, searchTerm)}
                            </small>
                          </div>
                          <div className="col-6">
                            <small className="text-success">
                              <DollarSign className="me-1" />
                              <strong>{drug.price.toLocaleString()}đ/{drug.unit}</strong>
                            </small>
                          </div>
                        </div>

                        <div className="small text-muted mb-1">
                          <strong>Chỉ định:</strong> {drug.indication}
                        </div>
                        
                        <div className="small text-muted mb-1">
                          <strong>Liều dùng:</strong> {drug.dosage}
                        </div>

                        {drug.contraindication && (
                          <div className="small text-danger d-flex align-items-start">
                            <AlertCircle className="me-1 mt-1" />
                            <span><strong>Chống chỉ định:</strong> {drug.contraindication}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {showSuggestions && suggestions.length === 0 && searchTerm.length >= 2 && (
              <div className="position-absolute w-100 mt-1 bg-white border rounded shadow-sm p-3 text-center text-muted">
                Không tìm thấy thuốc phù hợp
              </div>
            )}
          </div>

          {/* Danh sách thuốc đã chọn */}
          {selectedDrugs.length > 0 && (
            <div>
              <h6 className="mb-3 d-flex align-items-center">
                <Clock className="text-success me-2" />
                Thuốc đã chọn ({selectedDrugs.length})
              </h6>
              
              <div className="mb-4">
                {selectedDrugs.map((drug) => (
                  <Card key={drug.id} className="mb-3">
                    <Card.Body>
                      <div className="d-flex justify-content-between mb-3">
                        <div className="flex-grow-1">
                          <div className="d-flex align-items-center mb-2">
                            <Pill className="text-primary me-2" />
                            <h6 className="mb-0 fw-semibold">{drug.name}</h6>
                            <span className="badge bg-primary ms-2">{drug.type}</span>
                          </div>
                          
                          <div className="row g-3 mb-3">
                            <div className="col-md-4">
                              <small className="text-muted">
                                <strong>Hãng:</strong> {drug.manufacturer}
                              </small>
                            </div>
                            <div className="col-md-4">
                              <small className="text-success">
                                <strong>Giá:</strong> {drug.price.toLocaleString()}đ/{drug.unit}
                              </small>
                            </div>
                            <div className="col-md-4">
                              <small className="text-muted">
                                <strong>Liều dùng:</strong> {drug.dosage}
                              </small>
                            </div>
                          </div>
                        </div>
                        
                        <Button
                          variant="link"
                          className="text-danger p-0"
                          onClick={() => removeDrug(drug.id)}
                        >
                          <svg className="bi" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
                          </svg>
                        </Button>
                      </div>

                      <Row className="g-3">
                        <Col md={4}>
                          <Form.Group>
                            <Form.Label className="small">Số lượng</Form.Label>
                            <Form.Control
                              type="number"
                              min="1"
                              value={drug.quantity}
                              onChange={(e) => updateQuantity(drug.id, parseInt(e.target.value) || 1)}
                            />
                          </Form.Group>
                        </Col>
                        
                        <Col md={8}>
                          <Form.Group>
                            <Form.Label className="small">Ghi chú (cách dùng, liều lượng...)</Form.Label>
                            <Form.Control
                              type="text"
                              value={drug.notes}
                              onChange={(e) => updateNotes(drug.id, e.target.value)}
                              placeholder="VD: Uống sau ăn, ngày 2 lần..."
                            />
                          </Form.Group>
                        </Col>
                      </Row>

                      <div className="text-end mt-3">
                        <span className="h5 text-primary">
                          Tổng: {(drug.price * (drug.quantity || 1)).toLocaleString()}đ
                        </span>
                      </div>
                    </Card.Body>
                  </Card>
                ))}
              </div>

              {/* Tổng tiền */}
              <Card className="bg-light mb-4">
                <Card.Body>
                  <div className="text-end">
                    <h5 className="text-primary mb-0">
                      Tổng tiền đơn thuốc: {selectedDrugs.reduce((total, drug) => 
                        total + (drug.price * (drug.quantity || 1)), 0).toLocaleString()}đ
                    </h5>
                  </div>
                </Card.Body>
              </Card>

              {/* Nút hành động */}
              <div className="d-flex justify-content-end gap-2">
                <Button 
                  variant="outline-secondary"
                  onClick={() => setSelectedDrugs([])}
                >
                  Xóa tất cả
                </Button>
                <Button variant="primary">
                  Lưu đơn thuốc
                </Button>
              </div>
            </div>
          )}
        </Card.Body>
      </Card>
    </div>
  );
} 
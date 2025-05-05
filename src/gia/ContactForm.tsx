import React, { useState } from 'react';

interface FormData {
  name: string;
  phone: string;
  interests: {
    implant: boolean;
    niengRang: boolean;
    bocRang: boolean;
    benhLy: boolean;
  };
}

const ContactForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    phone: '',
    interests: {
      implant: false,
      niengRang: false,
      bocRang: false,
      benhLy: false
    }
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;

    if (type === 'checkbox') {
      setFormData({
        ...formData,
        interests: {
          ...formData.interests,
          [name]: checked
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Xử lý gửi form
  };

  const checkboxOptions = [
    { id: 'implant', label: 'Trồng răng Implant' },
    { id: 'niengRang', label: 'Niềng răng thẩm mỹ' },
    { id: 'bocRang', label: 'Bọc răng sứ thẩm mỹ' },
    { id: 'benhLy', label: 'Điều trị bệnh lý nha khoa' }
  ];

  return (
    <form onSubmit={handleSubmit}>
      <div className="px-2" style={{ background: "url(../img/banner-rang-su-5.png) no-repeat left top / cover", border: "2px solid rgb(9, 30, 62)", borderRadius: 25 }}>
        <div className="row gx-3 text-center bg-dark py-3 mb-5" style={{ borderTopLeftRadius: 25, borderTopRightRadius: 25, scale: 1.004 }}>
          <p className="text-center text-white m-0 mb-1" style={{ fontSize: 26 }}>NHẬN TƯ VẤN MIỄN PHÍ TỪ CHUYÊN GIA</p>
          <h4 className="text-center text-white m-0">ĐẶT LỊCH HẸN THĂM KHÁM NGAY</h4>
        </div>

        <div className="row g-2 px-5 mb-4">
          <div className="col-lg-12 px-5 mb-3">
            <input
              type="text"
              name="name"
              className="form-control mb-0"
              placeholder="Họ và tên"
              value={formData.name}
              onChange={handleInputChange}
              style={{ height: 35, borderRadius: 15 }}
            />
          </div>
          <div className="col-lg-12 px-5 mb-3">
            <input
              type="text"
              name="phone"
              className="form-control mb-0"
              placeholder="Số điện thoại"
              value={formData.phone}
              onChange={handleInputChange}
              style={{ height: 35, borderRadius: 15 }}
            />
          </div>

          <p className="text-dark-blue ms-5" style={{ fontSize: 18 }}>Vấn đề quan tâm</p>

          <div className="row g-1 px-2 mb-0">
            {checkboxOptions.slice(0, 2).map((option, index) => (
              <div className="col-lg-6 px-5" key={index}>
                <input
                  type="checkbox"
                  id={option.id}
                  name={option.id}
                  checked={formData.interests[option.id as keyof typeof formData.interests]}
                  onChange={handleInputChange}
                  style={{ scale: 1.3 }}
                />
                <label className="text-dark-blue ms-2" htmlFor={option.id} style={{ fontSize: 16 }}>
                  {option.label}
                </label>
              </div>
            ))}
          </div>

          <div className="row g-1 px-2">
            {checkboxOptions.slice(2, 4).map((option, index) => (
              <div className="col-lg-6 px-5" key={index}>
                <input
                  type="checkbox"
                  id={option.id}
                  name={option.id}
                  checked={formData.interests[option.id as keyof typeof formData.interests]}
                  onChange={handleInputChange}
                  style={{ scale: 1.3 }}
                />
                <label className="text-dark-blue ms-2" htmlFor={option.id} style={{ fontSize: 16 }}>
                  {option.label}
                </label>
              </div>
            ))}
          </div>
        </div>

        <div className="row g-2 px-5 pb-3">
          <div className="col-lg-12 px-5 mb-3 mt-4 text-center">
            <button type="submit" className="btn btn-dark py-2" style={{ width: "75%", borderRadius: 25 }}>
              ĐĂNG KÝ
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default ContactForm;
import { useState } from 'react';

export default function Team() {
  // Dữ liệu giả định cho danh sách bác sĩ
  const [doctors] = useState([
    {
      id: 1,
      HoTen: "PGS. TS. BS Lâm Việt Trung",
      HocVan: "Tiến sĩ Y khoa - Đại học Y Hà Nội",
      MoTa: "Chuyên gia phẫu thuật Implant với hơn 15 năm kinh nghiệm",
      Img: "/img/team-1.jpg"
    },
    {
      id: 2,
      HoTen: "TS. BS Nguyễn Thị Minh",
      HocVan: "Tiến sĩ Y khoa - Đại học Y Dược TP. HCM",
      MoTa: "Chuyên gia chỉnh nha và thẩm mỹ răng",
      Img: "/img/team-2.jpg"
    },
    {
      id: 3,
      HoTen: "BS. CKI Trần Văn Nam",
      HocVan: "Chuyên khoa I Răng Hàm Mặt",
      MoTa: "Chuyên gia điều trị nha khoa tổng quát",
      Img: "/img/team-3.jpg"
    },
    {
      id: 4,
      HoTen: "BS. CKII Lê Thị Hương",
      HocVan: "Chuyên khoa II Nha khoa - Đại học Y Dược Huế",
      MoTa: "Chuyên gia điều trị nội nha và thẩm mỹ răng sứ",
      Img: "/img/team-4.jpg"
    },
    {
      id: 5,
      HoTen: "ThS. BS Phạm Quốc Bảo",
      HocVan: "Thạc sĩ Răng Hàm Mặt - Đại học Y Dược TP.HCM",
      MoTa: "Chuyên gia phục hình răng và phẫu thuật nướu",
      Img: "/img/team-5.jpg"
    }
  ]);

  return (
    <div className="container-fluid py-5">
      <div className="container">
        <div className="row g-5 mb-3">
          <div className="section-title rounded h-100">
            <h5 className="position-relative d-inline-block text-primary text-uppercase">Đội ngũ bác sĩ</h5>
            <h1 className="display-6 mb-5">Các chuyên gia hàng đầu với nhiều năm kinh nghiệm</h1>
          </div>
        </div>
        
        {doctors.map((doctor) => (
          <div className="row g-5 mb-5 ms-5" key={doctor.id}>
            <div className="col-lg-4">
              <div className="team-item">
                <div className="position-relative" style={{ zIndex: 1 }}>
                  <img className="img-fluid w-100" src={doctor.Img} alt={doctor.HoTen} style={{ borderRadius: '15px' }} />
                </div>
              </div>
            </div>
            <div className="col-lg-7">
              <div className="team-item">
                <div className="position-relative">
                  <p className="mb-2 doctor-name">{doctor.HoTen}</p>
                  <ul>
                    {doctor.HocVan && <li className="mb-0 doctor-description">{doctor.HocVan}</li>}
                    {doctor.MoTa && <li className="mb-0 doctor-description">{doctor.MoTa}</li>}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
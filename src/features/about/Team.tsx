import React from 'react';
import './Team.css'; // We'll create this file for the CSS

interface Doctor {
  id: number;
  HoTen: string; // Full name
  HocVan?: string; // Education
  MoTa?: string; // Description
  Img: string; // Image path
}

const Team: React.FC = () => {
  // Sample data - in a real app this would come from an API or props
  const doctors: Doctor[] = [
    {
      id: 1,
      HoTen: "PGS. TS. BS Lâm Việt Trung",
      HocVan: "Tiến sĩ Y khoa, Chuyên khoa Răng hàm mặt",
      MoTa: "Hơn 20 năm kinh nghiệm trong lĩnh vực nha khoa",
      Img: "img/team-1.jpg"
    },
    {
      id: 2,
      HoTen: "TS. BS Nguyễn Thị Minh",
      HocVan: "Chuyên gia chỉnh nha quốc tế",
      MoTa: "Hơn 15 năm kinh nghiệm điều trị chỉnh nha",
      Img: "img/team-2.jpg"
    },
    {
      id: 3,
      HoTen: "TS. BS Nguyễn Thị Minh",
      HocVan: "Chuyên gia chỉnh nha quốc tế",
      MoTa: "Hơn 15 năm kinh nghiệm điều trị chỉnh nha",
      Img: "img/team-2.jpg"
    },
    // Add more doctors as needed
  ];

  return (
    <div className="container-fluid py-5">
      <div className="container">
        <div className="row align-items-start">
          {/* Cột trái: Tiêu đề và mô tả */}
          <div className="col-lg-4 mb-4">
            <div className="section-title slideInUp">
              <h5 className="position-relative d-inline-block text-primary text-uppercase">Đội ngũ bác sĩ</h5>
              <h1 className="display-6 mb-3">Các chuyên gia hàng đầu với nhiều năm kinh nghiệm</h1>
              <p className="text-muted">Đội ngũ bác sĩ chuyên môn cao, tận tâm và giàu kinh nghiệm, luôn sẵn sàng mang đến cho bạn dịch vụ chăm sóc sức khỏe tốt nhất.</p>
            </div>
          </div>
          {/* Cột phải: Grid các bác sĩ */}
          <div className="col-lg-8">
            <div className="row g-4">
              {doctors.map((doctor) => (
                <div className="col-md-6 col-lg-4" key={doctor.id}>
                  <div className="team-item h-100">
                    <div className="position-relative overflow-hidden">
                      <img
                        className="img-fluid w-100"
                        src={doctor.Img}
                        alt={doctor.HoTen}
                        style={{ height: '220px', objectFit: 'cover', borderRadius: '12px' }}
                      />
                    </div>
                    <div className="team-content p-3">
                      <h3 className="doctor-name" style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>{doctor.HoTen}</h3>
                      <ul className="list-unstyled mb-0">
                        {doctor.HocVan && (
                          <li className="doctor-description mb-1">
                            <i className="fas fa-graduation-cap me-2"></i>
                            {doctor.HocVan}
                          </li>
                        )}
                        {doctor.MoTa && (
                          <li className="doctor-description">
                            <i className="fas fa-user-md me-2"></i>
                            {doctor.MoTa}
                          </li>
                        )}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Team;
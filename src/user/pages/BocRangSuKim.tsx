import React, { useEffect, useRef } from 'react';
import './BocRangSuKim.css';

export default function BocRangSuKim() {
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const observer = new window.IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.15 }
    );
    sectionRefs.current.forEach((el) => {
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <div className="boc-rang-su-kim-wrapper">
      <section className="brs-banner">
        <img src="/image/page-rang-su-tham-my/BocSu-01-768x548.webp" alt="Bọc răng sứ thẩm mỹ" />
        <div className="brs-banner-title">
          <h1>Bọc răng sứ thẩm mỹ đẹp, an toàn và những điều bạn cần biết</h1>
          <p>Bọc răng sứ thẩm mỹ là kỹ thuật phục hình cố định bằng vật liệu sứ có vai trò phục hồi chức năng ăn nhai, cải thiện thẩm mỹ giúp bạn tự tin với nụ cười rạng rỡ tự nhiên. Những thắc mắc về Bọc răng sứ có đau không? Có những loại răng sứ nào? Chi phí bọc răng sứ bao nhiêu?… sẽ được giải đáp trong bài viết bên dưới.</p>
        </div>
      </section>
      <section className="brs-section" ref={el => { sectionRefs.current[0] = el; }}>
        <h2>Ứng dụng thành công y tế thông minh vào nha khoa răng sứ thẩm mỹ</h2>
        <p>Trong lĩnh vực răng sứ thẩm mỹ, việc ứng dụng công nghệ y tế thông minh đã mở ra một kỷ nguyên mới trong điều trị và phục hồi nụ cười cho bệnh nhân. Tại Nha Khoa Kim, công nghệ quét 3D tiên tiến được sử dụng để thu thập dữ liệu chi tiết về kích thước và hình dạng của răng và hàm của bệnh nhân một cách chính xác, cho phép các bác sĩ nha khoa thiết kế những chiếc răng sứ không chỉ vừa vặn hoàn hảo mà còn có tính thẩm mỹ cao.</p>
        <ul>
          <li>Công nghệ quét 3D, CAD/CAM, in 3D giúp thu thập dữ liệu chính xác về răng và hàm.</li>
          <li>Thiết kế răng sứ vừa vặn, thẩm mỹ cao, mô phỏng kết quả trước khi thực hiện.</li>
          <li>Sản xuất răng sứ ngay tại phòng khám, giảm thời gian chờ đợi.</li>
          <li>Tùy chỉnh màu sắc, hình dáng phù hợp với răng thật.</li>
          <li>Ứng dụng trí tuệ nhân tạo giúp bệnh nhân xem trước kết quả.</li>
        </ul>
      </section>
      <section className="brs-section" ref={el => { sectionRefs.current[1] = el; }}>
        <h2>Bốn ưu điểm của bọc răng sứ thẩm mỹ</h2>
        <ul>
          <li>Khắc phục tình trạng thẩm mỹ của răng</li>
          <li>Khôi phục chức năng ăn nhai</li>
          <li>Thời gian bọc răng sứ nhanh</li>
          <li>Chi phí hợp lý, đa dạng</li>
        </ul>
      </section>
      <section className="brs-section" ref={el => { sectionRefs.current[2] = el; }}>
        <h2>Quy trình bọc răng sứ được thực hiện như thế nào?</h2>
        <ol>
          <li>Thăm khám, tư vấn và chụp phim kiểm tra tổng quát.</li>
          <li>Lấy dấu răng bằng công nghệ quét 3D hiện đại.</li>
          <li>Thiết kế răng sứ bằng phần mềm CAD/CAM, mô phỏng kết quả.</li>
          <li>Chế tác răng sứ tại nhà máy đạt chuẩn quốc tế.</li>
          <li>Gắn răng sứ và kiểm tra khớp cắn, hoàn thiện nụ cười.</li>
        </ol>
      </section>
      <section className="brs-section" ref={el => { sectionRefs.current[3] = el; }}>
        <h2>Các loại sản phẩm răng sứ và giá bọc răng sứ thẩm mỹ tại Nha Khoa Kim</h2>
        <div className="brs-types row">
          <div className="col-12 col-md-4 text-center mb-3">
            <img src="/image/page-rang-su-tham-my/rang-su-tham-my-nha-khoa-kim-2.webp" alt="Răng sứ kim loại" />
            <div><strong>Răng sứ kim loại</strong></div>
          </div>
          <div className="col-12 col-md-4 text-center mb-3">
            <img src="/image/page-rang-su-tham-my/Mau-rang-su-Nha-Khoa-Kim-scaled-768x478.webp" alt="Răng toàn sứ" />
            <div><strong>Răng toàn sứ</strong></div>
          </div>
          <div className="col-12 col-md-4 text-center mb-3">
            <img src="/image/page-rang-su-tham-my/Zalo-RangSuTyleVang-01-scaled-768x432.webp" alt="Dán sứ Veneer" />
            <div><strong>Dán sứ Veneer</strong></div>
          </div>
        </div>
        <div className="brs-price mt-4">
          <h3>Bảng giá bọc răng sứ thẩm mỹ</h3>
          <p>Tham khảo bảng giá chi tiết tại <a href="https://nhakhoakim.com/bang-gia.html" target="_blank" rel="noopener noreferrer">Bảng giá bọc răng sứ thẩm mỹ Nha Khoa Kim</a> hoặc liên hệ trực tiếp để được tư vấn.</p>
        </div>
      </section>
      <section className="brs-section" ref={el => { sectionRefs.current[4] = el; }}>
        <h2>Lưu ý khi làm răng sứ</h2>
        <ul>
          <li>Chọn phòng khám uy tín, đảm bảo vô trùng.</li>
          <li>Đội ngũ bác sĩ chuyên môn cao, nhiều kinh nghiệm.</li>
          <li>Sử dụng vật liệu răng sứ chất lượng, có nguồn gốc rõ ràng.</li>
          <li>Thực hiện đúng quy trình kỹ thuật.</li>
        </ul>
      </section>
      <section className="brs-section brs-contact" ref={el => { sectionRefs.current[5] = el; }}>
        <h2>Liên hệ tư vấn & đặt hẹn</h2>
        <p>Hotline: <a href="tel:19006899">1900 6899</a></p>
        <p>Địa chỉ: Xem hệ thống phòng khám trên website Nha Khoa Kim</p>
        <a className="btn btn-primary" href="/lien-he" target="_blank" rel="noopener noreferrer">Đặt hẹn tư vấn ngay</a>
      </section>
    </div>
  );
} 
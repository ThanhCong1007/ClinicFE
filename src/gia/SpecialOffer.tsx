import React from 'react';

const SpecialOffer: React.FC = () => {
  return (
    <div className="section-title px-5 mb-3">
      <div className="py-3 px-4" style={{ border: "2px dashed rgb(0, 88, 153)" }}>
        <p className="mb-3" style={{ fontSize: 18 }}>
          <span style={{ color: "red" }}>Đặc biệt</span>: Nhằm giúp Cô Chú, Anh Chị giảm thiểu gánh nặng tài chính,
          Nha khoa I-DENT có hỗ trợ thanh toán trả góp 0% lãi suất thông qua thẻ tín dụng của hơn
          23 ngân hàng.
        </p>
        <ul>
          <li className="text-dark-blue mb-2" style={{ fontSize: 18, fontWeight: 600 }}>
            Điều kiện: Trả góp với chủ tài khoản sở hữu thẻ tín dụng của các ngân hàng sau:
            Vietcombank, VP Bank, Sacombank, Techcombank, ACB, HSBC…
          </li>
          <li className="text-dark-blue" style={{ fontSize: 18, fontWeight: 600 }}>
            Yêu cầu: Hạn mức thẻ tín dụng trên 20 triệu.
            Quý khách sẽ linh hoạt chi trả trong vòng 3–6–12–24 tháng. Quy trình đơn giản và
            được hướng dẫn cụ thể khi khách hàng đến Nha khoa I-DENT.
          </li>
        </ul>
      </div>
    </div>
  );
};

export default SpecialOffer;
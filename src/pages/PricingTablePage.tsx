// File: App.tsx hoặc PricingTablePage.tsx
import { useState } from 'react';
// import PricingHeader from '../gia/PricingHeader';
// import PricingSection from '../gia/PricingSection';
import TextContentSection from '../gia/TextContentSection';
import PaymentProcess from '../gia/PaymentProcess';
import ContactForm from '../gia/ContactForm';
import SpecialOffer from '../gia/SpecialOffer';
import './PricingTable.css';

function PricingTablePage() {
  return (
    <div className="container-fluid py-3 mt-5 mb-4 wow fadeInUp" data-wow-delay="0.1s"
      style={{ visibility: "visible", animationDelay: "0.1s", animationName: "fadeInUp" }}>
      <div className="container">
        <div className="row g-5 mb-3 px-5">
          {/* Header */}
          <div className="row g-5 mb-5 px-5">
            <div className="col-lg-12 px-5">
              <div className="section-title text-center px-5">
                <h4 className="position-relative d-inline-block text-dark-blue text-uppercase mt-3 display-7">
                  Bảng Giá Bọc Răng Sứ Trọn Gói Mới Nhất Hiện Nay
                </h4>
              </div>
            </div>
          </div>

          {/* Intro section */}
          <div className="row g-5 mb-2 px-5">
            <div className="col-lg-12 px-5">
              <TextContentSection 
                title="1. Bảng giá bọc răng sứ mới nhất tại Phòng khám Công Cường"
                content="Giá bọc răng sứ tại phòng khám Công Cường dao động từ 1.000.000 – 14.000.000 VNĐ/1 cái. Mức giá trên là giá trọn gói, đã bao gồm chi phí khám, tư vấn và chụp phim CT, không phát sinh thêm bất kỳ chi phí nào khác."
              />
            </div>
          </div>

          {/* Price tables */}
          <div className="row g-5 mb-5 px-5">
            <div className="col-lg-12 px-5">
              {/* <PricingSection /> */}
            </div>
          </div>
          
          <div className="col-lg-12 px-5">
            <TextContentSection 
              title="2. Các loại răng sứ chính hiện nay"
              content="Trường hợp bệnh nhân lắp răng sứ từ 16 cái trở lên sẽ được giảm 30% (nha khoa I-Dent cam kết không phát sinh bất kỳ chi phí nào). Ngoài ra, tất cả các dịch vụ thăm khám tổng quát, chụp phim CT và tư vấn là hoàn toàn miễn phí 100%."
            />

            <div className="section-title mb-3 px-5">
              <div className="bg-light py-3 px-3">
                <p className="m-0 ps-4" style={{ fontSize: 18 }}>
                  Ví dụ: Trường hợp Bệnh nhân bọc 16 răng sứ và chọn loại răng sứ toàn sứ Multilayer CERCON HT giá 6.500.000VNĐ/răng
                </p>
                <p className="m-0 ps-4" style={{ fontSize: 18 }}>
                  Chi phí trọn gói là: 16 x 6.500.000 = 104.000.000VNĐ, giảm 30% còn 72.800.000VNĐ.
                </p>
              </div>
            </div>

            <TextContentSection 
              title="3. Bảng giá răng sứ tại Nha khoa I-DENT"
              content={`Tại Nha khoa I-DENT, bảng giá răng sứ được áp dụng cho tất cả các phương án điều trị có sử dụng răng sứ như: Bọc răng sứ, làm cầu răng sứ và phục hình răng sứ trên Implant. Hàng tháng Nha khoa sẽ có nhiều chương trình khuyến mãi bọc răng sứ giảm giá lên đến 20% tùy loại răng sứ.
              
              Trước khi khách hàng quyết định trồng răng sứ, I-DENT sẽ thăm khám, chụp phim và tư vấn hoàn toàn miễn phí. Dựa trên tư vấn của bác sĩ, khách hàng sẽ chọn loại răng sứ và số lượng răng cần bọc để có thể tính được tổng mức phí cần chi trả.`}
            />

            {/* Types of porcelain teeth */}
            <TextContentSection 
              title="2. Các loại răng sứ chính hiện nay"
              content={`Hiện nay có 3 loại răng sứ chính đang được sử dụng rộng rãi trên thị trường. Giá trồng răng sứ của từng loại sẽ có mức chênh lệch nhất định và có sự khác biệt giữa các nha khoa răng sứ.
              
              3 loại răng sứ chính hiện nay là:`}
            />

            <TextContentSection 
              title="2.1 Răng sứ kim loại"
              content={`Răng sứ kim loại có phần khung sườn phía trong được làm bằng kim loại và phủ 1 lớp sứ mỏng bên ngoài.`}
              extraContent={
                <>
                  <ul className="mb-3">
                    <li style={{ fontSize: 18 }}>
                      Ưu điểm: Chi phí hợp lý, thời gian sử dụng lâu dài, tính thẩm mỹ khá cao và đảm bảo được khả năng ăn nhai tốt.
                    </li>
                    <li style={{ fontSize: 18 }}>
                      Khuyết điểm: Sau một thời gian dài sử dụng, răng sứ kim loại dễ gây đen viền nướu và làm mất thẩm mỹ.
                    </li>
                  </ul>
                  <p className="mb-3" style={{ fontSize: 18 }}>
                    Có các loại răng sứ kim loại phổ biến như: Răng sứ Ceramco 3 (Mỹ), răng sứ Titan,…
                    Mức giá bọc răng sứ kim loại dao động từ 1.000.000 – 2.5000.000 VNĐ/răng.
                  </p>
                  <div className="position-relative px-5 pic-box">
                    <img className="position-absolut rounded" src="/img/banner-rang-su-1.png" alt="Răng sứ kim loại" />
                  </div>
                </>
              }
            />

            <TextContentSection 
              title="2.2 Răng sứ không kim loại (Răng toàn sứ)"
              content={`Răng sứ toàn sứ được tạo thành từ sứ nguyên khối, với độ trong và cứng chắc hơn so với răng sứ kim loại.`}
              extraContent={
                <>
                  <ul className="mb-3">
                    <li style={{ fontSize: 18 }}>
                      Ưu điểm: Răng toàn sứ có độ bền và tính thẩm mỹ cao, không gây đen viền nướu sau một thời gian sử dụng và tuổi thọ 1 chiếc răng toàn sứ có thể lên đến 20 năm.
                    </li>
                    <li style={{ fontSize: 18 }}>
                      Khuyết điểm: Chi phí cao hơn so với răng sứ kim loại.
                    </li>
                  </ul>
                  <p className="mb-3" style={{ fontSize: 18 }}>
                    Có các loại răng sứ không kim loại phổ biến hiện nay như: Zirconia, DDBio HT, Cercon HT, Nacera PEARL, Nacera 9 MAX,...
                  </p>
                  <div className="position-relative px-5 py-3 pic-box">
                    <img className="position-absolut rounded" src="/img/banner-rang-su-2.png" alt="Răng sứ toàn sứ" />
                  </div>
                </>
              }
            />

            <TextContentSection 
              title="2.3 Mặt dán sứ"
              content={`Mặt dán sứ được xem là phương pháp làm răng sứ thẩm mỹ hiện đại nhất hiện nay. Với kỹ thuật này, bác sĩ sẽ sử dụng một lớp sứ mỏng (0,3mm – 0,6mm) dán ở mặt ngoài của răng, giúp phục hình thẩm mỹ cho răng thưa, răng xỉn màu ố vàng....`}
              extraContent={
                <ul className="mb-3">
                  <li style={{ fontSize: 18 }}>
                    Ưu điểm: Bảo tồn răng thật tối đa do răng không bị mài quá nhiều. Bên cạnh đó, mặt dán sứ có màu sắc tự nhiên, không gây cộm, cấn khi sử dụng.
                  </li>
                  <li style={{ fontSize: 18 }}>
                    Khuyết điểm: Không giải quyết được các tình trạng răng hô, vẩu, hoặc răng đã bị xô lệch nặng.
                  </li>
                </ul>
              }
            />

            <TextContentSection 
              title="3. Phương thức thanh toán khi bọc răng sứ tại Nha khoa I-Dent"
              content="Khi bọc răng sứ tại Nha khoa I-DENT. Cô Chú, Anh Chị sẽ được chia làm 2 đợt thanh toán như sau:"
              extraContent={<PaymentProcess />}
            />
          </div>
          <div className="row g-5 mb-5 px-5">
            <SpecialOffer />
          </div>
          <div className="col-lg-12 px-5">
            <div className="px-5 mb-3">
              <ContactForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PricingTablePage;
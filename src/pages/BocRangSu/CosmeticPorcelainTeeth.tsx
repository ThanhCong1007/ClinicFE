import { motion } from "framer-motion";
import Appointment from "../../layouts/Appointment";
import { priceData, PriceItemType, indicationsData } from "./data";

function CosmeticPorcelainTeeth() {
  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.8 } }
  };

  const zoomIn = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: { scale: 1, opacity: 1, transition: { duration: 0.6 } }
  };

  // Price item component
  const PriceItem = ({ item }: { item: PriceItemType }) => (
    <motion.div
      className="price-item"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={zoomIn}
    >
      <div className="price-header bg-dark">
        <p className="text-center text-white m-0">{item.type}</p>
        <h4 className="text-center text-white m-0">{item.name}</h4>
      </div>
      <div className="price-body pt-3">
        <p className="text-center m-0">({item.warranty})</p>
        <div className="position-relative mt-2 image-border">
          <img className="position-absolut rounded" src={item.image} alt={item.name} />
        </div>
        <h2 className="text-center mb-0 mt-3">{item.price}</h2>
      </div>
      <div className="price-footer">
        <a href="/boc-rang-su" className="btn btn-dark py-2 px-4" style={{ borderRadius: "20px" }}>
          Tư vấn ngay
        </a>
      </div>
    </motion.div>
  );

  // Indication item component
  const IndicationItem = ({ data }: { data: any }) => (
    <div className="col-lg-5 py-4 m-2" style={{ border: "1px solid rgb(0, 88, 153)", borderRadius: "15px" }}>
      <div className="row g-5 mb-3">
        <div className="col-lg-12">
          <div className="section-title text-center">
            <motion.img
              className="position-absolut rounded"
              src={data.image}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={zoomIn}
              alt="Dental indication"
            />
          </div>
        </div>
      </div>
      <div className="row g-5">
        <div className="col-lg-12">
          <div className="section-title text-center">
            <motion.img
              className="position-absolut rounded mb-3"
              src="/img/ico_check.svg"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={zoomIn}
              alt="Check icon"
            />
            <p className="text-dark-blue" style={{ fontSize: "16px", scale: "1.1" }}>
              {data.text}
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div>
      {/* Banner Section */}
      <div className="container-fluid p-0">
        <div id="header-carousel" className="carousel slide carousel-fade">
          <div className="carousel-inner">
            <div className="carousel-item active">
              <img className="w-100" src="/img/banner-rang-su.png" alt="Porcelain teeth banner" />
            </div>
          </div>
        </div>
      </div>

      {/* Introduction Section */}
      <motion.div
        className="container-fluid py-3 mt-3 mb-4"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={fadeIn}
      >
        <div className="container">
          <div className="row g-5 mb-3">
            <div className="col-lg-12">
              <div className="section-title text-center">
                <h4 className="position-relative d-inline-block text-dark-blue text-uppercase mt-3 display-7">
                  BỌC RĂNG SỨ LÀ GÌ? CÓ TỐT KHÔNG? GIÁ BỌC RĂNG SỨ BAO NHIÊU?
                </h4>
                <div className="section-title bg-light px-3 py-3 mb-3 mt-3">
                  <p style={{ fontSize: "18px" }}>
                    Bọc răng sứ đang là phương án làm đẹp răng được đông đảo nhiều người
                    thực hiện. Nhờ những ưu điểm vượt bậc, bọc răng sứ giúp khắc phục các khuyết điểm của răng
                    cũ, mang lại một nụ cười trắng sáng, hàm răng mới đều đẹp tự nhiên, giúp người làm răng sứ
                    tự tin hơn trong giao tiếp, cuộc sống hằng ngày. Vậy thực chất bọc răng sứ là gì? Bọc răng
                    sứ có tốt như quảng cáo không? Chi phí (giá) bọc răng sứ bao nhiêu? Hãy cùng tìm hiểu với
                    Nha khoa I-DENT.
                  </p>
                </div>
              </div>
            </div>
            <div className="row g-5">
              <div className="col-lg-3">
                <motion.img
                  className="position-absolut rounded"
                  src="/img/boc-rang-su-1.png"
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.3 }}
                  variants={zoomIn}
                  alt="Porcelain teeth"
                />
              </div>
              <div className="col-lg-7">
                <div className="row g-5">
                  <div className="col-lg-12">
                    <div className="section-title">
                      <h4 className="display-7 text-dark-blue mb-3">BỌC RĂNG SỨ LÀ GÌ?</h4>
                      <p style={{ fontSize: "18px" }}>
                        Bọc răng sứ thẩm mỹ là phương pháp phục hình bằng vật liệu
                        sứ giúp phục hồi chức năng và cải thiện thẩm mỹ, giúp mang lại dáng răng đều, đẹp,
                        màu sắc tự nhiên như răng thật. Trong đó, Bác sĩ sẽ tiến hành mài nhẹ răng hư để làm
                        cùi răng, sau đó lắp mão răng sứ lên trên. Phần mão sứ này sẽ có độ trong và màu sắc
                        trắng sáng tự nhiên như răng thật. Bên cạnh việc cải thiện thẩm mỹ, phương án bọc
                        răng sứ còn giúp bảo vệ răng thật trước những loại vi khuẩn gây hại cho răng.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Who Should Get Porcelain Teeth Section */}
      <motion.div
        className="container-fluid py-3 mb-5"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={fadeIn}
        style={{ backgroundColor: "rgb(245, 245, 245)" }}
      >
        <div className="container mt-3">

          <div className="row g-5">
            <div className="row g-5 mb-3">
              <div className="col-lg-12">
                <div className="section-title text-center mt-5">
                  <h4 className="position-relative d-inline-block text-dark-blue text-uppercase display-7 mb-4">
                    AI NÊN BỌC RĂNG SỨ?
                  </h4>
                  <p style={{ fontSize: "18px", marginTop: "15px" }}>
                    Với sự phát triển của công nghệ nha khoa, bọc răng sứ thẩm mỹ
                    không chỉ đem lại một hàm răng trắng sáng tự nhiên. Mà còn giúp bạn khắc phục được các
                    nhược điểm của răng như:
                  </p>
                </div>
              </div>
            </div>
            <div className="col-lg-6 mb-3">
              <div className="section-title text-center">
                <motion.img
                  className="position-absolut rounded"
                  src="/img/boc-rang-su-2.png"
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.3 }}
                  variants={zoomIn}
                  alt="Who should get porcelain teeth"
                />
              </div>
            </div>
            <div className="col-lg-6">
              <div className="row g-4 mb-4">
                {indicationsData.map((item, index) => (
                  <IndicationItem key={index} data={item} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Teeth Shapes Section */}
      <motion.div
        className="container-fluid py-3 mt-3 mb-2"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={fadeIn}
      >
        <div className="container">
          <div className="row g-5">
            <div className="col-lg-12">
              <div className="section-title text-center">
                <h4 className="position-relative d-inline-block text-dark-blue text-uppercase display-7">
                  CÁC DÁNG RĂNG SỨ ĐƯỢC LỰA CHỌN NHIỀU TẠI Nha khoa I-DENT
                </h4>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Teeth Shapes Image */}
      <div className="container-fluid p-0 mb-5">
        <motion.img
          className="rounded w-100"
          src="/img/boc-rang-su-4.png"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={zoomIn}
          alt="Porcelain teeth shapes"
        />
      </div>

      {/* Price Section Introduction */}
      <motion.div
        className="container-fluid py-3"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={fadeIn}
      >
        <div className="container">

          <div className="row g-5">
            <div className="section-title text-center">
              <h4 className="position-relative d-inline-block text-dark-blue text-uppercase display-7">
                BỌC RĂNG SỨ GIÁ BAO NHIÊU?
              </h4>
            </div>
            <div className="row g-5">
              <div className="col-lg-12">
                <div className="section-title">
                  <p style={{ fontSize: "18px" }}>
                    Làm răng sứ thẩm mỹ giá bao nhiêu là thông tin luôn thu hút
                    sự chú ý của nhiều người. Dưới đây là bảng giá mới nhất của các loại răng sứ tại
                    Nha khoa I-DENT bạn có thể tham khảo.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Price Section */}
      <motion.div
        className="price-section m-0"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={fadeIn}
      >
        <div className="price-container">
          <div className="price-row">
            {priceData.map((priceItem, index) => (
              <PriceItem key={index} item={priceItem} />
            ))}
          </div>
        </div>
      </motion.div>

      {/* Price Notes */}
      <motion.div
        className="container-fluid py-3 mar-top mb-0"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={fadeIn}
      >
        <div className="container">
          <div className="row g-5 mb-3">
            <div className="col-lg-12">
              <div className="row g-5">
                <div className="col-lg-12">
                  <div className="section-title">
                    <p style={{ fontSize: "18px" }}>
                      Bảng giá trên đây là giá trọn gói cho 1 răng sứ, bao gồm chi
                      phí thăm khám, tư vấn và chụp phim CT, cam kết không phát sinh thêm bất kỳ chi phí
                      nào khác trong quá trình điều trị. Tại Nha khoa I-DENT, 100% răng sứ cao cấp
                      chính hãng được nhập khẩu trực tiếp từ Đức và Hoa Kỳ để đảm bảo kết quả tốt nhất cho
                      khách hàng. Ngoài ra, khách hàng còn được hỗ trợ bọc răng sứ trả góp với lãi suất
                      0%.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Contact Form */}
      <Appointment />
    </div>
  );
}

export default CosmeticPorcelainTeeth;
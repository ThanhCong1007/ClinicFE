import { motion } from 'framer-motion';
import './Appointment.css';

function Appointment() {
  // Dữ liệu dịch vụ trực tiếp
  const dichvus = [
    { MaDv: "DV01", TenDv: "Tẩy trắng răng" },
    { MaDv: "DV02", TenDv: "Niềng răng" },
    { MaDv: "DV03", TenDv: "Nhổ răng khôn" },
    { MaDv: "DV04", TenDv: "Trám răng" }
  ];

  // Dữ liệu bác sĩ trực tiếp
  const doctors = [
    { MaBs: "BS01", HoTen: "BS. Nguyễn Văn A" },
    { MaBs: "BS02", HoTen: "BS. Trần Thị B" },
    { MaBs: "BS03", HoTen: "BS. Lê Văn C" }
  ];

  // Dữ liệu giờ làm việc trực tiếp
  const glvlist = [
    { MaGio: "G01", KhungGio: "08:00 - 09:00" },
    { MaGio: "G02", KhungGio: "09:00 - 10:00" },
    { MaGio: "G03", KhungGio: "10:00 - 11:00" },
    { MaGio: "G04", KhungGio: "14:00 - 15:00" },
    { MaGio: "G05", KhungGio: "15:00 - 16:00" },
    { MaGio: "G06", KhungGio: "16:00 - 17:00" }
  ];

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    alert("Đặt lịch khám thành công!");
  };

  // Framer Motion variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  const leftColumnVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: { 
      opacity: 1, 
      x: 0, 
      transition: { duration: 0.6, delay: 0.1 }
    }
  };

  const formVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      transition: { duration: 0.6, delay: 0.3 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.4 }
    }
  };

  return (
    <motion.div
      className="container-fluid bg-primary bg-appointment my-5"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="container">
        <div className="row gx-5">
          <motion.div 
            className="col-lg-6 py-5"
            variants={leftColumnVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="py-5">
              <h1 className="display-5 text-white mb-4">Nha sĩ với nhiều năm
                kinh nghiệm và chứng nhận quốc tế</h1>
              <p className="text-white mb-0">Eirmod sed tempor lorem ut dolores.
                Aliquyam sit sadipscing kasd ipsum. Dolor ea et dolore et at sea
                ea at dolor, justo ipsum duo rebum sea invidunt voluptua. Eos
                vero eos vero ea et dolore eirmod et. Dolores diam duo invidunt
                lorem. Elitr ut dolores magna sit. Sea dolore sanctus sed et.
                Takimata takimata sanctus sed.</p>
            </div>
          </motion.div>
          <div className="col-lg-6">
            <motion.div
              className="appointment-form h-100 d-flex flex-column justify-content-center text-center p-5"
              variants={formVariants}
              initial="hidden"
              animate="visible"
            >
              <h1 className="text-white mb-4">Cung cấp thông tin để nhận tư vấn</h1>
              <form onSubmit={handleSubmit}>
                <div className="row g-3">
                  <motion.div 
                    className="col-12 col-sm-6"
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    transition={{ delay: 0.1 }}
                  >
                    <select className="form-select bg-light border-0"
                      style={{height: "55px"}}>
                      <option selected>Lựa chọn dịch vụ</option>
                      {dichvus.map((dichvu) => (
                        <option key={dichvu.MaDv} value={dichvu.MaDv}>
                          {dichvu.TenDv}
                        </option>
                      ))}
                    </select>
                  </motion.div>
                  <motion.div 
                    className="col-12 col-sm-6"
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    transition={{ delay: 0.2 }}
                  >
                    <select className="form-select bg-light border-0"
                      style={{height: "55px"}}>
                      <option selected>Chọn Bác sĩ</option>
                      {doctors.map((doctor) => (
                        <option key={doctor.MaBs} value={doctor.MaBs}>
                          {doctor.HoTen}
                        </option>
                      ))}
                    </select>
                  </motion.div>
                  <motion.div 
                    className="col-12 col-sm-6"
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    transition={{ delay: 0.3 }}
                  >
                    <input type="text" className="form-control bg-light border-0"
                      placeholder="Họ và tên" style={{height: "55px"}} />
                  </motion.div>
                  <motion.div 
                    className="col-12 col-sm-6"
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    transition={{ delay: 0.4 }}
                  >
                    <input type="email" className="form-control bg-light border-0"
                      placeholder="Email" style={{height: "55px"}} />
                  </motion.div>
                  <motion.div 
                    className="col-12 col-sm-6"
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    transition={{ delay: 0.5 }}
                  >
                    <div className="date" id="date1" data-target-input="nearest">
                      <input type="text"
                        className="form-control bg-light border-0 datetimepicker-input"
                        placeholder="Ngày khám"
                        data-target="#date1" data-toggle="datetimepicker"
                        style={{height: "55px"}} />
                    </div>
                  </motion.div>
                  <motion.div 
                    className="col-12 col-sm-6"
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    transition={{ delay: 0.6 }}
                  >
                    <select className="form-select bg-light border-0"
                      style={{height: "55px"}}>
                      <option selected>Chọn khung giờ</option>
                      {glvlist.map((giolamviec) => (
                        <option key={giolamviec.MaGio} value={giolamviec.MaGio}>
                          {giolamviec.KhungGio}
                        </option>
                      ))}
                    </select>
                  </motion.div>
                  <motion.div 
                    className="col-12"
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    transition={{ delay: 0.7 }}
                  >
                    <textarea className="form-control bg-light border-0"
                      placeholder="Ghi chú"></textarea>
                  </motion.div>
                  <motion.div 
                    className="col-12"
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    transition={{ delay: 0.8 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <button className="btn btn-dark w-100 py-3" type="submit">Nhận tư vấn</button>
                  </motion.div>
                </div>
              </form>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default Appointment;
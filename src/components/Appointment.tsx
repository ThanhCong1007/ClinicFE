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
  
    return (
      <div
        className="container-fluid bg-primary bg-appointment my-5 wow fadeInUp"
        data-wow-delay="0.1s">
        <div className="container">
          <div className="row gx-5">
            <div className="col-lg-6 py-5">
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
            </div>
            <div className="col-lg-6">
              <div
                className="appointment-form h-100 d-flex flex-column justify-content-center text-center p-5 wow zoomIn"
                data-wow-delay="0.6s">
                <h1 className="text-white mb-4">Cung cấp thông tin để nhận tư vấn</h1>
                <form onSubmit={handleSubmit}>
                  <div className="row g-3">
                    <div className="col-12 col-sm-6">
                      <select className="form-select bg-light border-0"
                        style={{height: "55px"}}>
                        <option selected>Lựa chọn dịch vụ</option>
                        {dichvus.map((dichvu) => (
                          <option key={dichvu.MaDv} value={dichvu.MaDv}>
                            {dichvu.TenDv}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="col-12 col-sm-6">
                      <select className="form-select bg-light border-0"
                        style={{height: "55px"}}>
                        <option selected>Chọn Bác sĩ</option>
                        {doctors.map((doctor) => (
                          <option key={doctor.MaBs} value={doctor.MaBs}>
                            {doctor.HoTen}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="col-12 col-sm-6">
                      <input type="text" className="form-control bg-light border-0"
                        placeholder="Họ và tên" style={{height: "55px"}} />
                    </div>
                    <div className="col-12 col-sm-6">
                      <input type="email" className="form-control bg-light border-0"
                        placeholder="Email" style={{height: "55px"}} />
                    </div>
                    <div className="col-12 col-sm-6">
                      <div className="date" id="date1" data-target-input="nearest">
                        <input type="text"
                          className="form-control bg-light border-0 datetimepicker-input"
                          placeholder="Ngày khám"
                          data-target="#date1" data-toggle="datetimepicker"
                          style={{height: "55px"}} />
                      </div>
                    </div>
                    <div className="col-12 col-sm-6">
                      <select className="form-select bg-light border-0"
                        style={{height: "55px"}}>
                        <option selected>Chọn khung giờ</option>
                        {glvlist.map((giolamviec) => (
                          <option key={giolamviec.MaGio} value={giolamviec.MaGio}>
                            {giolamviec.KhungGio}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="col-12">
                      <textarea className="form-control bg-light border-0"
                        placeholder="Ghi chú"></textarea>
                    </div>
                    <div className="col-12">
                      <button className="btn btn-dark w-100 py-3" type="submit">Nhận tư vấn</button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  export default Appointment;
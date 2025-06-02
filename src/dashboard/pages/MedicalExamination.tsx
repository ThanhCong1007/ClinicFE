import { Link } from 'react-router-dom';

const MedicalExamination = () => {
  return (
    <div className="templatemo-flex-row flex-content-row">
      <div className="templatemo-content-widget white-bg col-2">
        <i className="fa fa-times"></i>
        <div className="square"></div>
        <h2 className="templatemo-inline-block">Thông Tin Bệnh Nhân</h2>
        <div className="row">
          <div className="col-md-6">
            <div className="form-group">
              <label>Mã Bệnh Nhân</label>
              <input type="text" className="form-control" value="BN001" readOnly />
            </div>
          </div>
          <div className="col-md-6">
            <div className="form-group">
              <label>Tên</label>
              <input type="text" className="form-control" value="Nguyễn Văn A" readOnly />
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-6">
            <div className="form-group">
              <label>Tuổi</label>
              <input type="text" className="form-control" value="45" readOnly />
            </div>
          </div>
          <div className="col-md-6">
            <div className="form-group">
              <label>Giới Tính</label>
              <input type="text" className="form-control" value="Nam" readOnly />
            </div>
          </div>
        </div>
        <hr />
        <h3>Dấu Hiệu Sinh Tồn</h3>
        <div className="row">
          <div className="col-md-3">
            <div className="form-group">
              <label>Huyết Áp</label>
              <input type="text" className="form-control" placeholder="ví dụ: 120/80" />
            </div>
          </div>
          <div className="col-md-3">
            <div className="form-group">
              <label>Nhịp Tim</label>
              <input type="text" className="form-control" placeholder="lần/phút" />
            </div>
          </div>
          <div className="col-md-3">
            <div className="form-group">
              <label>Nhiệt Độ</label>
              <input type="text" className="form-control" placeholder="°C" />
            </div>
          </div>
          <div className="col-md-3">
            <div className="form-group">
              <label>Cân Nặng</label>
              <input type="text" className="form-control" placeholder="kg" />
            </div>
          </div>
        </div>
        <hr />
        <h3>Ghi Chú Khám Bệnh</h3>
        <div className="form-group">
          <label>Lý Do Khám</label>
          <textarea className="form-control" rows={2} placeholder="Lý do chính bệnh nhân đến khám"></textarea>
        </div>
        <div className="form-group">
          <label>Tiền Sử Bệnh</label>
          <textarea className="form-control" rows={3} placeholder="Mô tả chi tiết các triệu chứng"></textarea>
        </div>
        <div className="form-group">
          <label>Khám Lâm Sàng</label>
          <textarea className="form-control" rows={3} placeholder="Kết quả khám lâm sàng"></textarea>
        </div>
        <div className="form-group">
          <label>Chẩn Đoán</label>
          <textarea className="form-control" rows={2} placeholder="Chẩn đoán hoặc nhận định"></textarea>
        </div>
        <div className="form-group">
          <label>Kế Hoạch Điều Trị</label>
          <textarea className="form-control" rows={2} placeholder="Kế hoạch điều trị và khuyến nghị"></textarea>
        </div>
        <div className="form-group">
          <button type="submit" className="templatemo-blue-button">Lưu Kết Quả Khám</button>
          <Link to="/prescriptions" className="btn btn-success">Tạo Đơn Thuốc</Link>
        </div>
      </div>
      <div className="templatemo-content-widget white-bg col-1">
        <i className="fa fa-times"></i>
        <h2 className="text-uppercase">Tiền Sử Bệnh</h2>
        <div className="table-responsive">
          <table className="table table-striped table-bordered">
            <thead>
              <tr>
                <td>Ngày</td>
                <td>Chẩn Đoán</td>
                <td>Điều Trị</td>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>2024-03-15</td>
                <td>Cao Huyết Áp</td>
                <td>Kê đơn thuốc</td>
              </tr>
              <tr>
                <td>2024-02-28</td>
                <td>Cảm Cúm</td>
                <td>Nghỉ ngơi và uống nhiều nước</td>
              </tr>
            </tbody>
          </table>
        </div>
        <h3>Dị Ứng</h3>
        <ul className="list-group">
          <li className="list-group-item">Penicillin</li>
          <li className="list-group-item">Sulfa</li>
        </ul>
        <h3>Thuốc Đang Dùng</h3>
        <ul className="list-group">
          <li className="list-group-item">Lisinopril 10mg mỗi ngày</li>
          <li className="list-group-item">Aspirin 81mg mỗi ngày</li>
        </ul>
      </div>
    </div>
  );
};

export default MedicalExamination; 
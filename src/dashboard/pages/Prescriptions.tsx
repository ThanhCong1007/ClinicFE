import { Link } from 'react-router-dom';

const Prescriptions = () => {
  return (
    <div className="templatemo-flex-row flex-content-row">
      <div className="templatemo-content-widget white-bg col-2">
        <i className="fa fa-times"></i>
        <div className="square"></div>
        <h2 className="templatemo-inline-block">Tạo Đơn Thuốc Mới</h2>
        <form className="templatemo-login-form">
          <div className="row">
            <div className="col-md-6">
              <div className="form-group">
                <label>Mã Bệnh Nhân</label>
                <input type="text" className="form-control" value="BN001" readOnly />
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group">
                <label>Tên Bệnh Nhân</label>
                <input type="text" className="form-control" value="Nguyễn Văn A" readOnly />
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-6">
              <div className="form-group">
                <label>Ngày</label>
                <input type="date" className="form-control" defaultValue="2024-03-20" />
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group">
                <label>Bác Sĩ</label>
                <input type="text" className="form-control" value="Bs. Vũ" readOnly />
              </div>
            </div>
          </div>
          <div className="table-responsive">
            <table className="table table-striped table-bordered">
              <thead>
                <tr>
                  <td>Tên Thuốc</td>
                  <td>Liều Dùng</td>
                  <td>Tần Suất</td>
                  <td>Thời Gian</td>
                  <td>Ghi Chú</td>
                  <td>Thao Tác</td>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <select className="form-control">
                      <option>Paracetamol 500mg</option>
                      <option>Amoxicillin 500mg</option>
                      <option>Omeprazole 20mg</option>
                    </select>
                  </td>
                  <td>
                    <input type="text" className="form-control" placeholder="ví dụ: 1 viên" />
                  </td>
                  <td>
                    <select className="form-control">
                      <option>1 lần/ngày</option>
                      <option>2 lần/ngày</option>
                      <option>3 lần/ngày</option>
                    </select>
                  </td>
                  <td>
                    <input type="text" className="form-control" placeholder="ví dụ: 7 ngày" />
                  </td>
                  <td>
                    <input type="text" className="form-control" placeholder="Ghi chú" />
                  </td>
                  <td>
                    <button type="button" className="btn btn-danger btn-sm">Xóa</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="form-group">
            <button type="button" className="btn btn-info">Thêm Thuốc</button>
          </div>
          <div className="form-group">
            <label>Hướng Dẫn Sử Dụng</label>
            <textarea className="form-control" rows={3} placeholder="Hướng dẫn chi tiết cho bệnh nhân"></textarea>
          </div>
          <div className="form-group">
            <button type="submit" className="templatemo-blue-button">Lưu Đơn Thuốc</button>
            <button type="button" className="btn btn-success">In Đơn Thuốc</button>
          </div>
        </form>
      </div>
      <div className="templatemo-content-widget white-bg col-1">
        <i className="fa fa-times"></i>
        <h2 className="text-uppercase">Đơn Thuốc Gần Đây</h2>
        <div className="table-responsive">
          <table className="table table-striped table-bordered">
            <thead>
              <tr>
                <td>Ngày</td>
                <td>Bệnh Nhân</td>
                <td>Thuốc</td>
                <td>Thao Tác</td>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>2024-03-15</td>
                <td>Nguyễn Văn A</td>
                <td>Paracetamol, Amoxicillin</td>
                <td>
                  <Link to="#" className="btn btn-info btn-sm">Xem</Link>
                  <Link to="#" className="btn btn-success btn-sm">In</Link>
                </td>
              </tr>
              <tr>
                <td>2024-03-14</td>
                <td>Trần Thị B</td>
                <td>Omeprazole, Metformin</td>
                <td>
                  <Link to="#" className="btn btn-info btn-sm">Xem</Link>
                  <Link to="#" className="btn btn-success btn-sm">In</Link>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <h3>Thuốc Thường Dùng</h3>
        <ul className="list-group">
          <li className="list-group-item">
            <strong>Paracetamol 500mg</strong>
            <p>Thuốc giảm đau, hạ sốt</p>
          </li>
          <li className="list-group-item">
            <strong>Amoxicillin 500mg</strong>
            <p>Kháng sinh điều trị nhiễm khuẩn</p>
          </li>
          <li className="list-group-item">
            <strong>Omeprazole 20mg</strong>
            <p>Thuốc điều trị viêm loét dạ dày</p>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Prescriptions; 
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Login.css';
import { useNotification } from '../../contexts/NotificationContext';

export default function Login() {
  const [isSignIn, setIsSignIn] = useState(true); // true for login, false for signup
  const navigate = useNavigate();
  const [redirectPath, setRedirectPath] = useState('/');
  const { showNotification } = useNotification();

  // Lấy redirect path nếu có
  useEffect(() => {
    const savedRedirectPath = localStorage.getItem('redirectAfterLogin');
    if (savedRedirectPath) {
      setRedirectPath(savedRedirectPath);
    }
  }, []);

  const toggleForm = () => {
    setIsSignIn(!isSignIn);
  };

  const handleLogin = async (e:any) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const loginData = {
      tenDangNhap: formData.get("tenDangNhap"),
      matKhau: formData.get("matKhau")
    };

    try {
      // Bước 1: Đăng nhập để lấy token
      const response = await axios.post("/api/auth/login", loginData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      // Lưu token vào localStorage
      const token = response.data.token;
      localStorage.setItem('token', token);

      // Bước 2: Lấy thông tin profile người dùng
      try {
        const profileResponse = await axios.get("/api/user/profile", {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        // Kiểm tra và lưu profile
        if (profileResponse.data) {
          console.log('Profile data:', profileResponse.data); // Debug log
          // Lưu toàn bộ thông tin profile vào localStorage
          localStorage.setItem('user', JSON.stringify(profileResponse.data));
          
          // Lưu thêm các thông tin quan trọng riêng lẻ để dễ truy cập
          localStorage.setItem('maNguoiDung', profileResponse.data.maNguoiDung);
          localStorage.setItem('maBenhNhan', profileResponse.data.maBenhNhan);
          localStorage.setItem('maBacSi', profileResponse.data.maBacSi);
          localStorage.setItem('tenDangNhap', profileResponse.data.tenDangNhap);
          localStorage.setItem('hoTen', profileResponse.data.hoTen);
        } else {
          console.error('No profile data received');
          throw new Error('Không nhận được thông tin profile');
        }
      } catch (profileError) {
        console.error('Error fetching profile:', profileError);
        throw new Error('Không thể lấy thông tin profile');
      }

      // Set a flag to indicate that we redirected from login
      localStorage.setItem('redirectedFromLogin', 'true');

      // Đăng nhập thành công, hiển thị thông báo
      showNotification('Thành công', 'Đăng nhập thành công!', 'success');
      
      // Check if there's a redirect path saved and redirect to it
      const redirectTo = localStorage.getItem('redirectAfterLogin') || '/';
      const scrollPosition = localStorage.getItem('scrollPosition');
      if (redirectTo !== '/') {
        localStorage.removeItem('redirectAfterLogin');
      }
      if (scrollPosition) {
        localStorage.removeItem('scrollPosition');
      }
      
      // Navigate to the specified path
      navigate(redirectTo);
      setTimeout(() => {
        if (scrollPosition) {
          window.scrollTo(0, parseInt(scrollPosition, 10));
        }
      }, 100);
    } catch (error:any) {
      console.error('Lỗi đăng nhập:', error);
      
      // Hiển thị thông báo lỗi trong cửa sổ popup
      if (error.response && error.response.data && error.response.data.message) {
        showNotification('Lỗi', `Đăng nhập thất bại: ${error.response.data.message}`, 'error');
      } else {
        showNotification('Lỗi', 'Thông tin đăng nhập không chính xác', 'error');
      }
    }
  };

  const handleRegister = async (e:any) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    // Kiểm tra xác nhận mật khẩu
    const matKhau = formData.get("matKhau");
    const xacNhanMatKhau = formData.get("xacNhanMatKhau");
    
    if (matKhau !== xacNhanMatKhau) {
      showNotification('Lỗi', 'Mật khẩu xác nhận không khớp với mật khẩu!', 'error');
      return;
    }
    
    // Kiểm tra độ dài mật khẩu
    if (!matKhau || typeof matKhau !== 'string' || matKhau.length < 6) {
      showNotification('Lỗi', 'Mật khẩu phải có ít nhất 6 ký tự!', 'error');
      return;
    }

    // Chuẩn bị dữ liệu theo đúng định dạng API yêu cầu
    const data = {
      tenDangNhap: formData.get("tenDangNhap"),
      matKhau: matKhau,
      email: formData.get("email"),
      hoTen: formData.get("hoTen"),
      soDienThoai: formData.get("soDienThoai"),
      ngaySinh: formData.get("ngaySinh"),
    };

    try {
      console.log("Dữ liệu gửi đi:", data);
      const response = await axios.post("/api/auth/register", data, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      showNotification('Thành công', response.data.message || "Đăng ký thành công!", 'success');
      // Chuyển về form đăng nhập sau khi đăng ký thành công
      setIsSignIn(true);
    } catch (error:any) {
      console.error("Chi tiết lỗi đăng ký:", error);
      
      if (error.response) {
        console.log("Response status:", error.response.status);
        console.log("Response data:", error.response.data);
        
        if (error.response.data) {
          if (error.response.data.message) {
            showNotification('Lỗi', `Đăng ký thất bại: ${error.response.data.message}`, 'error');
          } else if (error.response.data.errors && error.response.data.errors.length > 0) {
            // Hiển thị lỗi validation chi tiết nếu có
            const errorMessages = error.response.data.errors.map((err:any) => err.defaultMessage).join('\n');
            showNotification('Lỗi', `Đăng ký thất bại:\n${errorMessages}`, 'error');
          } else {
            showNotification('Lỗi', `Đăng ký thất bại. Mã lỗi: ${error.response.status}`, 'error');
          }
        } else {
          showNotification('Lỗi', `Đăng ký thất bại. Mã lỗi: ${error.response.status}`, 'error');
        }
      } else if (error.request) {
        showNotification('Lỗi', "Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối của bạn.", 'error');
      } else {
        showNotification('Lỗi', "Đã có lỗi xảy ra trong quá trình đăng ký.", 'error');
      }
    }
  };

  return (
    <>
      {isSignIn ? (
        // Login Form
        <div className="login-section">
          <div className="container">
            <div className="login-form p-5" style={{ border: '2px solid rgb(9, 30, 62)' }}>
              <div className="row-gx-5">
                <h1 className="m-0 text-primary"><i className="fa fa-tooth me-2 mb-3"></i>Đăng nhập</h1>
                
                {/* Hiển thị thông báo khi đến từ trang đặt lịch */}
                {redirectPath !== '/' && (
                  <div className="alert alert-info mt-3" role="alert">
                    Vui lòng đăng nhập để tiếp tục đặt lịch khám
                  </div>
                )}
                
                <div className="col-lg-12">
                  <form onSubmit={handleLogin}>
                    <input
                      type="text"
                      name="tenDangNhap"
                      className="form-control"
                      placeholder="Tài khoản"
                      style={{ height: '55px', borderRadius: '15px' }}
                      required
                    />
                    <input
                      type="password"
                      name="matKhau"
                      className="form-control mt-3"
                      placeholder="Mật khẩu"
                      style={{ height: '55px', borderRadius: '15px' }}
                      required
                    />
                    <div className="d-flex justify-content-between mt-1" style={{ fontSize: '16px', fontStyle: 'italic', transform: 'translateY(7%)' }}>
                      <a href="#" onClick={(e) => { e.preventDefault(); toggleForm(); }} className="m-0 text-dark px-1">Chưa có tài khoản ?</a>
                      <a href="#" className="m-0 text-dark px-1">Quên mật khẩu</a>
                    </div>
                    <button
                      className="btn btn-dark w-100 py-3"
                      type="submit"
                      style={{ borderRadius: '15px', transform: 'translateY(30%)' }}
                    >
                      Đăng nhập
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        // Register Form
        <div className="login-section">
          <div className="container">
            <div className="login-form p-5" style={{ border: '2px solid rgb(9, 30, 62)' }}>
              <div className="row-gx-5">
                <h1 className="m-0 text-dark">
                  <i className="fa fa-tooth me-2 mb-3"></i>Đăng ký
                </h1>
                <div className="col-lg-12">
                  <form onSubmit={handleRegister}>
                    {/* Họ và tên */}
                    <input
                      type="text"
                      name="hoTen"
                      className="form-control mt-3"
                      placeholder="Họ và tên"
                      style={{ height: '55px', borderRadius: '15px' }}
                      required
                    />
                    {/* Tên đăng nhập */}
                    <input
                      type="text"
                      name="tenDangNhap"
                      className="form-control mt-3"
                      placeholder="Tên đăng nhập"
                      style={{ height: '55px', borderRadius: '15px' }}
                      required
                    />
                    {/* Email */}
                    <input
                      type="email"
                      name="email"
                      className="form-control mt-3"
                      placeholder="Email"
                      style={{ height: '55px', borderRadius: '15px' }}
                      required
                    />
                    {/* Số điện thoại */}
                    <input
                      type="tel"
                      name="soDienThoai"
                      className="form-control mt-3"
                      placeholder="Số điện thoại"
                      pattern="[0-9]{10}"
                      style={{ height: '55px', borderRadius: '15px' }}
                      required
                    />
                    {/* Ngày sinh */}
                    <input
                      type="date"
                      name="ngaySinh"
                      className="form-control mt-3"
                      placeholder="Ngày sinh"
                      style={{ height: '55px', borderRadius: '15px' }}
                      required
                    />
                    {/* Mật khẩu */}
                    <input
                      type="password"
                      name="matKhau"
                      className="form-control mt-3"
                      placeholder="Mật khẩu"
                      style={{ height: '55px', borderRadius: '15px' }}
                      required
                    />
                    {/* Xác nhận mật khẩu */}
                    <input
                      type="password"
                      name="xacNhanMatKhau"
                      className="form-control mt-3"
                      placeholder="Xác nhận mật khẩu"
                      style={{ height: '55px', borderRadius: '15px' }}
                      required
                    />

                    {/* Đã có tài khoản */}
                    <div
                      className="d-flex justify-content-start mt-1"
                      style={{ fontSize: '16px', fontStyle: 'italic', transform: 'translateY(7%)' }}
                    >
                      <a
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          toggleForm(); // chuyển qua form đăng nhập
                        }}
                        className="m-0 text-dark px-1"
                      >
                        Đã có tài khoản
                      </a>
                    </div>

                    {/* Nút đăng ký */}
                    <button
                      className="btn btn-dark w-100 py-3"
                      type="submit"
                      style={{ borderRadius: '15px', transform: 'translateY(30%)' }}
                    >
                      Đăng ký
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
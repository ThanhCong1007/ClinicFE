import { useState } from 'react';
import './Login.css';

export default function Login() {
  const [isSignIn, setIsSignIn] = useState(true); // true for login, false for signup
  const [loginResult, setLoginResult] = useState('0'); // '0' means no notification
  const [notification, setNotification] = useState('');
  
  const toggleForm = () => {
    setIsSignIn(!isSignIn);
  };

  const handleLogin = (e: RegisterEvent): void => {
    e.preventDefault();
    // Implement login logic here
    // For demo, we can toggle loginResult to show notification
    // setLoginResult('1');
    // setNotification('Thông tin đăng nhập không chính xác');
  };

  interface RegisterEvent extends React.FormEvent<HTMLFormElement> {}

  const handleRegister = (e: RegisterEvent): void => {
    e.preventDefault();
    // Implement register logic here
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
                <div className="col-lg-12">
                  <form onSubmit={handleLogin}>
                    <input 
                      type="text" 
                      className="form-control" 
                      placeholder="Tài khoản" 
                      style={{ height: '55px', borderRadius: '15px' }}
                    />
                    <input 
                      type="password" 
                      className="form-control mt-3" 
                      placeholder="Mật khẩu" 
                      style={{ height: '55px', borderRadius: '15px' }}
                    />
                    <div className="d-flex justify-content-between mt-1" style={{ fontSize: '16px', fontStyle: 'italic', transform: 'translateY(7%)' }}>
                      <a href="#" onClick={(e) => { e.preventDefault(); toggleForm(); }} className="m-0 text-dark px-1">Chưa có tài khoản ?</a>
                      <a href="#" className="m-0 text-dark px-1">Quên mật khẩu</a>
                    </div>
                    {loginResult === '0' ? (
                      <button 
                        className="btn btn-dark w-100 py-3" 
                        type="submit" 
                        style={{ borderRadius: '15px', transform: 'translateY(30%)' }}
                      >
                        Đăng nhập
                      </button>
                    ) : (
                      <div>
                        <button 
                          className="btn btn-dark w-100 py-3" 
                          type="submit" 
                          style={{ borderRadius: '15px', transform: 'translateY(20%)' }}
                        >
                          Đăng nhập
                        </button>
                        <p 
                          className="m-0 text-center" 
                          style={{ fontSize: '22px', fontWeight: '700', color: 'red', transform: 'translateY(80%)' }}
                        >
                          {notification}
                        </p>
                      </div>
                    )}
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
                <h1 className="m-0 text-dark"><i className="fa fa-tooth me-2 mb-3"></i>Đăng ký</h1>
                <div className="col-lg-12">
                  <form onSubmit={handleRegister}>
                    <input 
                      type="text" 
                      className="form-control mt-3" 
                      placeholder="Họ và tên" 
                      style={{ height: '55px', borderRadius: '15px' }} 
                    />
                    <input 
                      type="number" 
                      className="form-control mt-3" 
                      placeholder="Số điện thoại" 
                      style={{ height: '55px', borderRadius: '15px' }} 
                    />
                    <input 
                      type="password" 
                      className="form-control mt-3" 
                      placeholder="Mật khẩu" 
                      style={{ height: '55px', borderRadius: '15px' }} 
                    />
                    <input 
                      type="password" 
                      className="form-control mt-3" 
                      placeholder="Xác nhận mật khẩu" 
                      style={{ height: '55px', borderRadius: '15px' }} 
                    />
                    <div className="d-flex justify-content-start mt-1" style={{ fontSize: '16px', fontStyle: 'italic', transform: 'translateY(7%)' }}>
                      <a href="#" onClick={(e) => { e.preventDefault(); toggleForm(); }} className="m-0 text-dark px-1">Đã có tài khoản</a>
                    </div>
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

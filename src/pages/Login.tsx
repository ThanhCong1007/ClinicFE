import { useState } from 'react';

export default function Login() {
  const [isSignIn, setIsSignIn] = useState(true); // true for login, false for signup
  
  const toggleForm = () => {
    setIsSignIn(!isSignIn);
  };
  
  return (
    <div className="bg-gray-100 min-h-screen py-10">
      {isSignIn ? (
        // Đăng nhập (Login) Form
        <div className="login-section">
          <div className="container max-w-md mx-auto">
            <div className="login-form p-5 bg-white rounded-lg shadow-md" style={{ border: '2px solid rgb(9, 30, 62)' }}>
              <div>
                <h1 className="m-0 text-2xl font-bold text-gray-800 mb-4">
                  <i className="fa fa-tooth mr-2"></i>Đăng nhập
                </h1>
                <div>
                  <div>
                    <input 
                      type="text" 
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" 
                      placeholder="Tài khoản" 
                    />
                    <input 
                      type="password" 
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl mt-3 focus:outline-none focus:ring-2 focus:ring-blue-500" 
                      placeholder="Mật khẩu" 
                    />
                    <div className="flex justify-between mt-2 text-sm italic">
                      <button 
                        type="button" 
                        onClick={toggleForm}
                        className="text-gray-800 hover:text-blue-700"
                      >
                        Chưa có tài khoản?
                      </button>
                      <button className="text-gray-800 hover:text-blue-700">Quên mật khẩu</button>
                    </div>
                    <button 
                      className="w-full bg-gray-800 text-white py-3 rounded-xl mt-6 hover:bg-gray-700 transition-colors" 
                      type="button"
                    >
                      Đăng nhập
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        // Đăng ký (Register) Form
        <div className="login-section">
          <div className="container max-w-md mx-auto">
            <div className="login-form p-5 bg-white rounded-lg shadow-md" style={{ border: '2px solid rgb(9, 30, 62)' }}>
              <div>
                <h1 className="m-0 text-2xl font-bold text-gray-800 mb-4">
                  <i className="fa fa-tooth mr-2"></i>Đăng ký
                </h1>
                <div>
                  <div>
                    <input 
                      type="text" 
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" 
                      placeholder="Họ và tên" 
                    />
                    <input 
                      type="number" 
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl mt-3 focus:outline-none focus:ring-2 focus:ring-blue-500" 
                      placeholder="Số điện thoại" 
                    />
                    <input 
                      type="password" 
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl mt-3 focus:outline-none focus:ring-2 focus:ring-blue-500" 
                      placeholder="Mật khẩu" 
                    />
                    <input 
                      type="password" 
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl mt-3 focus:outline-none focus:ring-2 focus:ring-blue-500" 
                      placeholder="Xác nhận mật khẩu" 
                    />
                    <div className="flex justify-start mt-2 text-sm italic">
                      <button 
                        type="button" 
                        onClick={toggleForm}
                        className="text-gray-800 hover:text-blue-700"
                      >
                        Đã có tài khoản
                      </button>
                    </div>
                    <button 
                      className="w-full bg-gray-800 text-white py-3 rounded-xl mt-6 hover:bg-gray-700 transition-colors" 
                      type="button"
                    >
                      Đăng ký
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

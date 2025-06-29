import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const SignIn: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Sign in data:', formData);
    // Handle sign in logic here
  };

  return (
    <div className="container-fluid">
      <div className="row justify-content-center align-items-center min-vh-100">
        <div className="col-md-6 col-lg-4">
          <div className="card shadow-lg admin-card">
            <div className="card-body p-5">
              <div className="text-center mb-4">
                <h4 className="fw-bold">Sign In</h4>
                <p className="text-muted">Enter your email and password to sign in</p>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">Email</label>
                  <div className="input-group">
                    <span className="input-group-text">
                      <i className="fas fa-envelope"></i>
                    </span>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label htmlFor="password" className="form-label">Password</label>
                  <div className="input-group">
                    <span className="input-group-text">
                      <i className="fas fa-lock"></i>
                    </span>
                    <input
                      type="password"
                      className="form-control"
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Enter your password"
                      required
                    />
                  </div>
                </div>

                <div className="mb-3 form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="rememberMe"
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleChange}
                  />
                  <label className="form-check-label" htmlFor="rememberMe">
                    Remember me
                  </label>
                </div>

                <button type="submit" className="btn btn-primary admin-btn-primary w-100 mb-3">
                  Sign In
                </button>

                <div className="text-center">
                  <p className="mb-0">
                    Don't have an account?{' '}
                    <Link to="/admin/sign-up" className="text-decoration-none">
                      Sign up
                    </Link>
                  </p>
                </div>
              </form>

              <hr className="my-4" />

              <div className="text-center">
                <p className="text-muted mb-3">Or sign in with</p>
                <div className="d-grid gap-2">
                  <button className="btn btn-outline-secondary">
                    <i className="fab fa-google me-2"></i>
                    Sign in with Google
                  </button>
                  <button className="btn btn-outline-secondary">
                    <i className="fab fa-facebook me-2"></i>
                    Sign in with Facebook
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn; 
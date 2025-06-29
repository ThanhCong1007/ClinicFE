import React, { useState } from 'react';

const Profile: React.FC = () => {
  const [activeTab, setActiveTab] = useState('profile');

  const profileData = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    bio: 'Full-stack developer with 5+ years of experience in React, Node.js, and cloud technologies.',
    avatar: '/image/profile-avatar.jpg'
  };

  return (
    <div>
      <div className="row">
        <div className="col-lg-4 mb-4">
          <div className="card admin-card">
            <div className="card-body text-center">
              <img
                src={profileData.avatar}
                alt="Profile"
                className="rounded-circle mb-3"
                style={{ width: '120px', height: '120px', objectFit: 'cover' }}
              />
              <h5 className="card-title">{profileData.name}</h5>
              <p className="text-muted">Full Stack Developer</p>
              <div className="d-grid gap-2">
                <button className="btn btn-primary admin-btn-primary">
                  <i className="fas fa-edit me-2"></i>
                  Edit Profile
                </button>
                <button className="btn btn-outline-secondary">
                  <i className="fas fa-download me-2"></i>
                  Download CV
                </button>
              </div>
            </div>
          </div>

          <div className="card admin-card mt-4">
            <div className="card-body">
              <h6 className="card-title">Contact Information</h6>
              <ul className="list-unstyled">
                <li className="mb-2">
                  <i className="fas fa-envelope text-muted me-2"></i>
                  {profileData.email}
                </li>
                <li className="mb-2">
                  <i className="fas fa-phone text-muted me-2"></i>
                  {profileData.phone}
                </li>
                <li className="mb-2">
                  <i className="fas fa-map-marker-alt text-muted me-2"></i>
                  {profileData.location}
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="col-lg-8">
          <div className="card admin-card">
            <div className="card-header">
              <ul className="nav nav-tabs card-header-tabs">
                <li className="nav-item">
                  <button
                    className={`nav-link ${activeTab === 'profile' ? 'active' : ''}`}
                    onClick={() => setActiveTab('profile')}
                  >
                    Profile
                  </button>
                </li>
                <li className="nav-item">
                  <button
                    className={`nav-link ${activeTab === 'projects' ? 'active' : ''}`}
                    onClick={() => setActiveTab('projects')}
                  >
                    Projects
                  </button>
                </li>
                <li className="nav-item">
                  <button
                    className={`nav-link ${activeTab === 'settings' ? 'active' : ''}`}
                    onClick={() => setActiveTab('settings')}
                  >
                    Settings
                  </button>
                </li>
              </ul>
            </div>
            <div className="card-body">
              {activeTab === 'profile' && (
                <div>
                  <h6>About</h6>
                  <p className="text-muted">{profileData.bio}</p>
                  
                  <h6 className="mt-4">Skills</h6>
                  <div className="row">
                    <div className="col-md-6">
                      <div className="mb-3">
                        <div className="d-flex justify-content-between">
                          <span>React</span>
                          <span>90%</span>
                        </div>
                        <div className="progress">
                          <div className="progress-bar" style={{ width: '90%' }}></div>
                        </div>
                      </div>
                      <div className="mb-3">
                        <div className="d-flex justify-content-between">
                          <span>Node.js</span>
                          <span>85%</span>
                        </div>
                        <div className="progress">
                          <div className="progress-bar" style={{ width: '85%' }}></div>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <div className="d-flex justify-content-between">
                          <span>TypeScript</span>
                          <span>80%</span>
                        </div>
                        <div className="progress">
                          <div className="progress-bar" style={{ width: '80%' }}></div>
                        </div>
                      </div>
                      <div className="mb-3">
                        <div className="d-flex justify-content-between">
                          <span>AWS</span>
                          <span>75%</span>
                        </div>
                        <div className="progress">
                          <div className="progress-bar" style={{ width: '75%' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'projects' && (
                <div>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <div className="card admin-card">
                        <div className="card-body">
                          <h6>E-commerce Platform</h6>
                          <p className="text-muted small">React, Node.js, MongoDB</p>
                          <div className="d-flex justify-content-between align-items-center">
                            <span className="badge bg-success">Completed</span>
                            <small className="text-muted">2023</small>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6 mb-3">
                      <div className="card admin-card">
                        <div className="card-body">
                          <h6>Task Management App</h6>
                          <p className="text-muted small">React, Firebase</p>
                          <div className="d-flex justify-content-between align-items-center">
                            <span className="badge bg-warning">In Progress</span>
                            <small className="text-muted">2024</small>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'settings' && (
                <div>
                  <form>
                    <div className="mb-3">
                      <label className="form-label">Email Notifications</label>
                      <div className="form-check">
                        <input className="form-check-input" type="checkbox" id="emailNotif" defaultChecked />
                        <label className="form-check-label" htmlFor="emailNotif">
                          Receive email notifications
                        </label>
                      </div>
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Privacy</label>
                      <div className="form-check">
                        <input className="form-check-input" type="checkbox" id="publicProfile" />
                        <label className="form-check-label" htmlFor="publicProfile">
                          Make profile public
                        </label>
                      </div>
                    </div>
                    <button type="submit" className="btn btn-primary admin-btn-primary">
                      Save Changes
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile; 
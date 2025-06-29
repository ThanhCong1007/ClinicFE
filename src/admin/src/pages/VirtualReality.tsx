import React, { useState } from 'react';

const VirtualReality: React.FC = () => {
  const [selectedScene, setSelectedScene] = useState('office');

  const scenes = [
    {
      id: 'office',
      name: 'Virtual Office',
      description: 'Experience a modern virtual office environment',
      image: '/image/vr-office.jpg',
      features: ['3D Environment', 'Interactive Objects', 'Real-time Collaboration']
    },
    {
      id: 'meeting',
      name: 'Virtual Meeting Room',
      description: 'Host meetings in immersive virtual spaces',
      image: '/image/vr-meeting.jpg',
      features: ['Video Conferencing', 'Screen Sharing', 'Whiteboard Tools']
    },
    {
      id: 'training',
      name: 'Training Simulator',
      description: 'Learn and practice in virtual training environments',
      image: '/image/vr-training.jpg',
      features: ['Interactive Tutorials', 'Progress Tracking', 'Skill Assessment']
    }
  ];

  const vrStats = [
    { label: 'Active Sessions', value: '1,234', change: '+12%', positive: true },
    { label: 'Total Users', value: '5,678', change: '+8%', positive: true },
    { label: 'Session Duration', value: '45 min', change: '+5%', positive: true },
    { label: 'Satisfaction Rate', value: '94%', change: '+2%', positive: true }
  ];

  return (
    <div>
      <div className="row mb-4">
        <div className="col-12">
          <h4 className="mb-3">Virtual Reality Dashboard</h4>
        </div>
      </div>

      {/* VR Stats */}
      <div className="row mb-4">
        {vrStats.map((stat, index) => (
          <div key={index} className="col-lg-3 col-md-6 mb-3">
            <div className="card admin-card">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="text-muted mb-1">{stat.label}</h6>
                    <h4 className="mb-0">{stat.value}</h4>
                  </div>
                  <div className={`text-end ${stat.positive ? 'text-success' : 'text-danger'}`}>
                    <i className={`fas fa-arrow-${stat.positive ? 'up' : 'down'} mb-1`}></i>
                    <div className="small">{stat.change}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* VR Scenes */}
      <div className="row mb-4">
        <div className="col-12">
          <h6 className="mb-3">Available VR Scenes</h6>
        </div>
        {scenes.map((scene) => (
          <div key={scene.id} className="col-lg-4 mb-3">
            <div className={`card h-100 admin-card ${selectedScene === scene.id ? 'border-primary' : ''}`}>
              <div className="card-body">
                <div className="text-center mb-3">
                  <div 
                    className="bg-light rounded mb-3"
                    style={{ 
                      height: '200px', 
                      backgroundImage: `url(${scene.image})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center'
                    }}
                  ></div>
                  <h5 className="card-title">{scene.name}</h5>
                  <p className="text-muted">{scene.description}</p>
                </div>
                <ul className="list-unstyled">
                  {scene.features.map((feature, index) => (
                    <li key={index} className="mb-2">
                      <i className="fas fa-check text-success me-2"></i>
                      {feature}
                    </li>
                  ))}
                </ul>
                <button
                  className={`btn w-100 ${selectedScene === scene.id ? 'btn-primary admin-btn-primary' : 'btn-outline-primary'}`}
                  onClick={() => setSelectedScene(scene.id)}
                >
                  {selectedScene === scene.id ? 'Active Scene' : 'Launch Scene'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* VR Controls */}
      <div className="row mb-4">
        <div className="col-lg-8">
          <div className="card admin-card">
            <div className="card-header">
              <h6 className="mb-0">VR Environment Controls</h6>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Environment</label>
                  <select className="form-select">
                    <option>Office Space</option>
                    <option>Meeting Room</option>
                    <option>Training Center</option>
                    <option>Custom Environment</option>
                  </select>
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Lighting</label>
                  <select className="form-select">
                    <option>Natural Light</option>
                    <option>Artificial Light</option>
                    <option>Mixed Lighting</option>
                    <option>Custom</option>
                  </select>
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Audio</label>
                  <select className="form-select">
                    <option>Ambient Office</option>
                    <option>Silent</option>
                    <option>Background Music</option>
                    <option>Custom Audio</option>
                  </select>
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Quality</label>
                  <select className="form-select">
                    <option>High Quality</option>
                    <option>Medium Quality</option>
                    <option>Low Quality</option>
                  </select>
                </div>
              </div>
              <div className="d-flex gap-2">
                <button className="btn btn-primary admin-btn-primary">
                  <i className="fas fa-play me-2"></i>
                  Start VR Session
                </button>
                <button className="btn btn-outline-secondary">
                  <i className="fas fa-cog me-2"></i>
                  Advanced Settings
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="card admin-card">
            <div className="card-header">
              <h6 className="mb-0">Quick Actions</h6>
            </div>
            <div className="card-body">
              <div className="d-grid gap-2">
                <button className="btn btn-outline-primary">
                  <i className="fas fa-users me-2"></i>
                  Invite Participants
                </button>
                <button className="btn btn-outline-success">
                  <i className="fas fa-save me-2"></i>
                  Save Environment
                </button>
                <button className="btn btn-outline-info">
                  <i className="fas fa-share me-2"></i>
                  Share Session
                </button>
                <button className="btn btn-outline-warning">
                  <i className="fas fa-camera me-2"></i>
                  Take Screenshot
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Sessions */}
      <div className="row">
        <div className="col-12">
          <div className="card admin-card">
            <div className="card-header">
              <h6 className="mb-0">Recent VR Sessions</h6>
            </div>
            <div className="card-body">
              <div className="table-responsive admin-table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>Session Name</th>
                      <th>Participants</th>
                      <th>Duration</th>
                      <th>Date</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Team Meeting VR</td>
                      <td>8 participants</td>
                      <td>45 minutes</td>
                      <td>2024-01-15</td>
                      <td><span className="badge bg-success">Completed</span></td>
                    </tr>
                    <tr>
                      <td>Training Session</td>
                      <td>12 participants</td>
                      <td>90 minutes</td>
                      <td>2024-01-14</td>
                      <td><span className="badge bg-warning">In Progress</span></td>
                    </tr>
                    <tr>
                      <td>Client Presentation</td>
                      <td>5 participants</td>
                      <td>30 minutes</td>
                      <td>2024-01-13</td>
                      <td><span className="badge bg-success">Completed</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VirtualReality; 
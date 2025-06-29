import React from 'react';

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  changeType: 'positive' | 'negative';
  icon: string;
  iconColor: string;
  changeText: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  change,
  changeType,
  icon,
  iconColor,
  changeText
}) => {
  return (
    <div className="col-xl-3 col-md-6 mb-4">
      <div className="card admin-stat-card h-100">
        <div className="card-body">
          <div className="row align-items-center">
            <div className="col-8">
              <h6 className="text-uppercase mb-1 opacity-75 small">{title}</h6>
              <h4 className="mb-2 fw-bold">{value}</h4>
              <p className="mb-0 small opacity-75">
                <span className={`fw-bold ${changeType === 'positive' ? 'text-success' : 'text-danger'}`}>
                  {change}
                </span>
                {' '}{changeText}
              </p>
            </div>
            <div className="col-4 text-end">
              <div className={`icon ${iconColor}`}>
                <i className={icon}></i>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatCard; 
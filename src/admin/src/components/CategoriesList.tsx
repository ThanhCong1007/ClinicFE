import React from 'react';

interface Category {
  id: number;
  icon: string;
  title: string;
  description: string;
  color: string;
}

const CategoriesList: React.FC = () => {
  const categories: Category[] = [
    {
      id: 1,
      icon: 'fas fa-mobile-alt',
      title: 'Devices',
      description: '250 in stock, 346+ sold',
      color: 'bg-primary'
    },
    {
      id: 2,
      icon: 'fas fa-tag',
      title: 'Tickets',
      description: '123 closed, 15 open',
      color: 'bg-warning'
    },
    {
      id: 3,
      icon: 'fas fa-box',
      title: 'Error logs',
      description: '1 is active, 40 closed',
      color: 'bg-danger'
    },
    {
      id: 4,
      icon: 'fas fa-smile',
      title: 'Happy users',
      description: '+ 430',
      color: 'bg-success'
    }
  ];

  return (
    <div className="card admin-card">
      <div className="card-header bg-transparent border-0">
        <h6 className="mb-0">Categories</h6>
      </div>
      <div className="card-body">
        <ul className="list-group list-group-flush">
          {categories.map((category) => (
            <li key={category.id} className="list-group-item border-0 px-0">
              <div className="d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center">
                  <div className={`${category.color} text-white rounded p-2 me-3`}>
                    <i className={category.icon}></i>
                  </div>
                  <div>
                    <h6 className="mb-1">{category.title}</h6>
                    <span className="text-muted small">{category.description}</span>
                  </div>
                </div>
                <button className="btn btn-link text-muted p-0">
                  <i className="fas fa-chevron-right"></i>
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CategoriesList; 
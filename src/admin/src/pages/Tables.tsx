import React, { useState } from 'react';

interface TableData {
  id: number;
  name: string;
  position: string;
  office: string;
  age: number;
  startDate: string;
  salary: string;
}

const Tables: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const tableData: TableData[] = [
    {
      id: 1,
      name: 'Airi Satou',
      position: 'Accountant',
      office: 'Tokyo',
      age: 33,
      startDate: '2008/11/28',
      salary: '$162,700'
    },
    {
      id: 2,
      name: 'Angelica Ramos',
      position: 'Chief Executive Officer (CEO)',
      office: 'London',
      age: 47,
      startDate: '2009/10/09',
      salary: '$1,200,000'
    },
    {
      id: 3,
      name: 'Ashton Cox',
      position: 'Junior Technical Author',
      office: 'San Francisco',
      age: 66,
      startDate: '2009/01/12',
      salary: '$86,000'
    },
    {
      id: 4,
      name: 'Bradley Greer',
      position: 'Software Engineer',
      office: 'London',
      age: 41,
      startDate: '2012/10/13',
      salary: '$132,000'
    },
    {
      id: 5,
      name: 'Brenden Wagner',
      position: 'Software Engineer',
      office: 'San Francisco',
      age: 28,
      startDate: '2011/06/07',
      salary: '$206,850'
    }
  ];

  const filteredData = tableData.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.office.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = filteredData.slice(startIndex, endIndex);

  return (
    <div>
      <div className="row mb-4">
        <div className="col-12">
          <div className="card admin-card">
            <div className="card-header">
              <h5 className="mb-0">Authors Table</h5>
            </div>
            <div className="card-body">
              <div className="row mb-3">
                <div className="col-md-6">
                  <div className="input-group">
                    <span className="input-group-text">
                      <i className="fas fa-search"></i>
                    </span>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Search..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
                <div className="col-md-6 text-end">
                  <button className="btn btn-primary admin-btn-primary">
                    <i className="fas fa-plus me-2"></i>
                    Add New
                  </button>
                </div>
              </div>

              <div className="table-responsive admin-table-responsive">
                <table className="table table-striped table-hover">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Position</th>
                      <th>Office</th>
                      <th>Age</th>
                      <th>Start Date</th>
                      <th>Salary</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentData.map((item) => (
                      <tr key={item.id}>
                        <td>{item.name}</td>
                        <td>{item.position}</td>
                        <td>{item.office}</td>
                        <td>{item.age}</td>
                        <td>{item.startDate}</td>
                        <td>{item.salary}</td>
                        <td>
                          <div className="btn-group" role="group">
                            <button className="btn btn-sm btn-outline-primary">
                              <i className="fas fa-edit"></i>
                            </button>
                            <button className="btn btn-sm btn-outline-danger">
                              <i className="fas fa-trash"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="row">
                <div className="col-md-6">
                  <p className="text-muted">
                    Showing {startIndex + 1} to {Math.min(endIndex, filteredData.length)} of {filteredData.length} entries
                  </p>
                </div>
                <div className="col-md-6">
                  <nav aria-label="Page navigation">
                    <ul className="pagination justify-content-end">
                      <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                        <button
                          className="page-link"
                          onClick={() => setCurrentPage(currentPage - 1)}
                          disabled={currentPage === 1}
                        >
                          Previous
                        </button>
                      </li>
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <li key={page} className={`page-item ${currentPage === page ? 'active' : ''}`}>
                          <button
                            className="page-link"
                            onClick={() => setCurrentPage(page)}
                          >
                            {page}
                          </button>
                        </li>
                      ))}
                      <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                        <button
                          className="page-link"
                          onClick={() => setCurrentPage(currentPage + 1)}
                          disabled={currentPage === totalPages}
                        >
                          Next
                        </button>
                      </li>
                    </ul>
                  </nav>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tables; 
import React from 'react';

interface SalesData {
  id: number;
  country: string;
  flag: string;
  sales: number;
  value: string;
  bounce: string;
}

const SalesTable: React.FC = () => {
  const salesData: SalesData[] = [
    {
      id: 1,
      country: 'United States',
      flag: '/public/image/flags/US.png',
      sales: 2500,
      value: '$230,900',
      bounce: '29.9%'
    },
    {
      id: 2,
      country: 'Germany',
      flag: '/public/image/flags/DE.png',
      sales: 3900,
      value: '$440,000',
      bounce: '40.22%'
    },
    {
      id: 3,
      country: 'Great Britain',
      flag: '/public/image/flags/GB.png',
      sales: 1400,
      value: '$190,700',
      bounce: '23.44%'
    },
    {
      id: 4,
      country: 'Brasil',
      flag: '/public/image/flags/BR.png',
      sales: 562,
      value: '$143,960',
      bounce: '32.14%'
    }
  ];

  return (
    <div className="card">
      <div className="card-header bg-transparent border-0">
        <div className="d-flex justify-content-between align-items-center">
          <h6 className="mb-0">Sales by Country</h6>
        </div>
      </div>
      <div className="card-body p-0">
        <div className="table-responsive admin-table-responsive">
          <table className="table table-hover mb-0">
            <thead className="table-light">
              <tr>
                <th className="border-0">Country</th>
                <th className="border-0 text-center">Sales</th>
                <th className="border-0 text-center">Value</th>
                <th className="border-0 text-center">Bounce</th>
              </tr>
            </thead>
            <tbody>
              {salesData.map((item) => (
                <tr key={item.id}>
                  <td className="border-0">
                    <div className="d-flex align-items-center">
                      <img
                        src={item.flag}
                        alt={`${item.country} flag`}
                        className="me-3"
                        style={{ width: '24px', height: '16px' }}
                      />
                      <div>
                        <p className="mb-0 small text-muted">Country:</p>
                        <h6 className="mb-0">{item.country}</h6>
                      </div>
                    </div>
                  </td>
                  <td className="border-0 text-center">
                    <div>
                      <p className="mb-0 small text-muted">Sales:</p>
                      <h6 className="mb-0">{item.sales.toLocaleString()}</h6>
                    </div>
                  </td>
                  <td className="border-0 text-center">
                    <div>
                      <p className="mb-0 small text-muted">Value:</p>
                      <h6 className="mb-0">{item.value}</h6>
                    </div>
                  </td>
                  <td className="border-0 text-center">
                    <div>
                      <p className="mb-0 small text-muted">Bounce:</p>
                      <h6 className="mb-0">{item.bounce}</h6>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SalesTable; 
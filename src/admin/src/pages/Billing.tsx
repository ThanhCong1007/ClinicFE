import React, { useState } from 'react';

const Billing: React.FC = () => {
  const [selectedPlan, setSelectedPlan] = useState('pro');

  const plans = [
    {
      id: 'free',
      name: 'Free',
      price: '$0',
      period: 'month',
      features: [
        '1 project',
        '1,000 API calls',
        'Basic support',
        'Community access'
      ],
      popular: false
    },
    {
      id: 'pro',
      name: 'Pro',
      price: '$29',
      period: 'month',
      features: [
        '10 projects',
        '50,000 API calls',
        'Priority support',
        'Advanced analytics',
        'Custom integrations'
      ],
      popular: true
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: '$99',
      period: 'month',
      features: [
        'Unlimited projects',
        'Unlimited API calls',
        '24/7 support',
        'Advanced analytics',
        'Custom integrations',
        'Dedicated account manager'
      ],
      popular: false
    }
  ];

  const billingHistory = [
    {
      id: 1,
      date: '2024-01-15',
      amount: '$29.00',
      status: 'Paid',
      description: 'Pro Plan - January 2024'
    },
    {
      id: 2,
      date: '2023-12-15',
      amount: '$29.00',
      status: 'Paid',
      description: 'Pro Plan - December 2023'
    },
    {
      id: 3,
      date: '2023-11-15',
      amount: '$29.00',
      status: 'Paid',
      description: 'Pro Plan - November 2023'
    }
  ];

  return (
    <div>
      <div className="row mb-4">
        <div className="col-12">
          <h4 className="mb-3">Billing & Subscription</h4>
        </div>
      </div>

      {/* Current Plan */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card admin-card">
            <div className="card-header">
              <h6 className="mb-0">Current Plan</h6>
            </div>
            <div className="card-body">
              <div className="row align-items-center">
                <div className="col-md-8">
                  <h5 className="mb-1">Pro Plan</h5>
                  <p className="text-muted mb-0">$29/month - Next billing date: February 15, 2024</p>
                </div>
                <div className="col-md-4 text-end">
                  <button className="btn btn-outline-primary me-2">
                    Change Plan
                  </button>
                  <button className="btn btn-outline-danger">
                    Cancel Subscription
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Plans */}
      <div className="row mb-4">
        <div className="col-12">
          <h6 className="mb-3">Available Plans</h6>
        </div>
        {plans.map((plan) => (
          <div key={plan.id} className="col-lg-4 mb-3">
            <div className={`card h-100 admin-card ${selectedPlan === plan.id ? 'border-primary' : ''}`}>
              {plan.popular && (
                <div className="card-header bg-primary text-white text-center">
                  <span className="badge bg-light text-primary">Most Popular</span>
                </div>
              )}
              <div className="card-body text-center">
                <h5 className="card-title">{plan.name}</h5>
                <div className="mb-3">
                  <span className="display-6">{plan.price}</span>
                  <span className="text-muted">/{plan.period}</span>
                </div>
                <ul className="list-unstyled">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="mb-2">
                      <i className="fas fa-check text-success me-2"></i>
                      {feature}
                    </li>
                  ))}
                </ul>
                <button
                  className={`btn w-100 ${selectedPlan === plan.id ? 'btn-primary admin-btn-primary' : 'btn-outline-primary'}`}
                  onClick={() => setSelectedPlan(plan.id)}
                >
                  {selectedPlan === plan.id ? 'Current Plan' : 'Select Plan'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Payment Method */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card admin-card">
            <div className="card-header">
              <h6 className="mb-0">Payment Method</h6>
            </div>
            <div className="card-body">
              <div className="row align-items-center">
                <div className="col-md-8">
                  <div className="d-flex align-items-center">
                    <i className="fab fa-cc-visa fa-2x text-primary me-3"></i>
                    <div>
                      <h6 className="mb-1">Visa ending in 4242</h6>
                      <p className="text-muted mb-0">Expires 12/25</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-4 text-end">
                  <button className="btn btn-outline-primary">
                    Update Payment Method
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Billing History */}
      <div className="row">
        <div className="col-12">
          <div className="card admin-card">
            <div className="card-header">
              <h6 className="mb-0">Billing History</h6>
            </div>
            <div className="card-body">
              <div className="table-responsive admin-table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Description</th>
                      <th>Amount</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {billingHistory.map((item) => (
                      <tr key={item.id}>
                        <td>{item.date}</td>
                        <td>{item.description}</td>
                        <td>{item.amount}</td>
                        <td>
                          <span className="badge bg-success">{item.status}</span>
                        </td>
                        <td>
                          <button className="btn btn-sm btn-outline-primary">
                            <i className="fas fa-download"></i>
                          </button>
                        </td>
                      </tr>
                    ))}
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

export default Billing; 
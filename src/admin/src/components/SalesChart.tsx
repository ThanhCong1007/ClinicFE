import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const SalesChart: React.FC = () => {
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Sales Overview',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  const data = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Sales',
        data: [65, 59, 80, 81, 56, 55, 40, 45, 60, 70, 85, 90],
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        tension: 0.4,
      },
      {
        label: 'Revenue',
        data: [28, 48, 40, 19, 86, 27, 90, 65, 70, 80, 95, 100],
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        tension: 0.4,
      },
    ],
  };

  return (
    <div className="card admin-chart-container">
      <div className="card-header bg-transparent border-0">
        <h6 className="mb-0">Sales Overview</h6>
        <p className="mb-0 text-muted small">
          <i className="fas fa-arrow-up text-success me-1"></i>
          <span className="fw-semibold">4% more</span> in 2021
        </p>
      </div>
      <div className="card-body">
        <Line options={options} data={data} />
      </div>
    </div>
  );
};

export default SalesChart; 
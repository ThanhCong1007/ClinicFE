import React from 'react';
import StatCard from '../components/StatCard';
import SalesChart from '../components/SalesChart';
import Carousel from '../components/Carousel';
import SalesTable from '../components/SalesTable';
import CategoriesList from '../components/CategoriesList';

const Dashboard: React.FC = () => {
  const stats = [
    {
      title: "Today's Money",
      value: "$53,000",
      change: "+55%",
      changeType: "positive" as const,
      icon: "fas fa-coins",
      iconColor: "bg-primary",
      changeText: "since yesterday"
    },
    {
      title: "Today's Users",
      value: "2,300",
      change: "+3%",
      changeType: "positive" as const,
      icon: "fas fa-globe",
      iconColor: "bg-danger",
      changeText: "since last week"
    },
    {
      title: "New Clients",
      value: "+3,462",
      change: "-2%",
      changeType: "negative" as const,
      icon: "fas fa-graduation-cap",
      iconColor: "bg-success",
      changeText: "since last quarter"
    },
    {
      title: "Sales",
      value: "$103,430",
      change: "+5%",
      changeType: "positive" as const,
      icon: "fas fa-shopping-cart",
      iconColor: "bg-warning",
      changeText: "than last month"
    }
  ];

  return (
    <div>
      {/* Stats Cards */}
      {/* <div className="row mb-4">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div> */}

      {/* Charts and Carousel Row */}
      <div className="row mb-4">
        {/* <div className="col-lg-8 mb-4"> */}
          <SalesChart />
        {/* </div> */}
        {/* <div className="col-lg-4 mb-4">
          <Carousel />
        </div> */}
      </div>

      {/* Tables and Categories Row */}
      <div className="row">
        {/* <div className="col-lg-8 mb-4"> */}
          <SalesTable />
        {/* </div>
        <div className="col-lg-4 mb-4">
          <CategoriesList />
        </div> */}
      </div>

    </div>
  );
};

export default Dashboard; 
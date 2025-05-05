import React from 'react';

interface SectionTitleProps {
  title: string;
  className?: string;
}

const SectionTitle: React.FC<SectionTitleProps> = ({ title, className = "" }) => (
  <div className="row g-2 m-0 px-5">
    <div className={`col-lg-12 m-0 py-3 ${className}`} style={{ border: "1px solid rgb(6, 163, 218)" }}>
      <div className="section-title text-center">
        <p className="text-primary m-0" style={{ fontSize: 22, fontWeight: 700 }}>{title}</p>
      </div>
    </div>
  </div>
);

export default SectionTitle;
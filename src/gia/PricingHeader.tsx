import React from 'react';

const TableHeader: React.FC = () => (
    <>
      <div className="row g-2 m-0 px-5">
        <div className="col-lg-12 pt-3 pb-5 m-0 px-5 bg-dark">
          <div className="section-title text-center">
            <p className="text-white m-0" style={{ fontSize: 22, fontWeight: 700 }}>
              BẢNG GIÁ BỌC RĂNG SỨ MỚI NHẤT 2024
            </p>
          </div>
        </div>
      </div>
      <div className="row g-2 m-0 px-5">
        <div className="col-lg-6 m-0 py-3 px-5 bg-primary">
          <div className="section-title text-center">
            <p className="text-white m-0" style={{ fontSize: 22, fontWeight: 700 }}>LOẠI RĂNG</p>
          </div>
        </div>
        <div className="col-lg-6 m-0 py-3 px-5 bg-primary">
          <div className="section-title text-center">
            <p className="text-white m-0" style={{ fontSize: 22, fontWeight: 700 }}>CHI PHÍ</p>
          </div>
        </div>
      </div>
    </>
  );
  
  export default TableHeader;
  
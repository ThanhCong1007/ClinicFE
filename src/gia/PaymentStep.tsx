import React from 'react';

interface PaymentStepProps {
  step: number;
  text: string;
  image: string;
}

const PaymentStep: React.FC<PaymentStepProps> = ({ step, text, image }) => (
  <div className="row g-5 ps-5 mb-5">
    <div className="col-lg-3 ps-5 me-5">
      <div className="position-relative ps-5">
        <img className="position-absolut rounded" src={image} alt={`Payment step ${step}`} />
      </div>
    </div>
    <div className="col-lg-7 ps-5 ms-5 payment-step">
      <div className="row ps-5 g-5" style={{ width: "100%" }}>
        <div className="col-lg-12 ps-5" style={{ width: "90%" }}>
          <div className="section-title text-center">
            <h3 className="display-7 text-white py-3 m-0 px-5 bg-dark" style={{ width: "100%" }}>ĐỢT {step}</h3>
            <div className="col-lg-12 m-0 py-3 px-5" style={{ border: "1px solid rgb(9, 30, 62)" }}>
              <div className="section-title text-center">
                <p className="text-dark m-0" style={{ fontSize: 18, fontWeight: 600 }}>{text}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default PaymentStep;
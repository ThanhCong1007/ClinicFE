import React from 'react';
import PaymentStep from './PaymentStep';

const PaymentProcess: React.FC = () => {
  return (
    <>
      <PaymentStep
        step={1}
        text="Thanh toán vào ngày mài cùi lấy dấu."
        image="/img/banner-rang-su-3.png"
      />
      <PaymentStep
        step={2}
        text="Thanh toán sau khi thử sứ và hoàn tất quy trình bọc răng sứ."
        image="/img/banner-rang-su-4.png"
      />
    </>
  );
};

export default PaymentProcess;
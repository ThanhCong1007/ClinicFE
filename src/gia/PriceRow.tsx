import React from 'react';

interface PriceItem {
  name: string;
  price: string;
  warranty: string;
  isJaw?: boolean;
}

interface PriceRowProps {
  item: PriceItem;
  unit?: string;
}

const PriceRow: React.FC<PriceRowProps> = ({ item, unit = "VND/Răng" }) => {
  const priceUnit = item.isJaw ? "VND/Hàm" : unit;

  return (
    <div className="row g-2 m-0 px-5">
      <div className="col-lg-5 m-0 px-3 price-title" style={{ border: "1px solid rgb(6, 163, 218)" }}>
        <div className="section-title">
          <p className="text-dark m-0" style={{ fontSize: 20 }}>{item.name}</p>
        </div>
      </div>
      <div className="col-lg-7 m-0 py-3" style={{ border: "1px solid rgb(6, 163, 218)" }}>
        <div className="section-title price-price">
          <p className="text-primary m-0" style={{ fontSize: 20, fontWeight: 700 }}>
            {item.price.includes("Giảm") ? item.price : `${item.price} ${priceUnit}`}
          </p>
          {item.warranty && (
            <p className="text-dark m-0" style={{ fontSize: 20 }}>
              {item.warranty.startsWith("(") ? item.warranty : `(Bảo hành ${item.warranty})`}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PriceRow;
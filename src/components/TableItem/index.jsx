import React from 'react';
import Link from 'next/link';

const TableItem = (props) => {
  const { _id, photo, name, numberOfSeats, setup, status } = props;
  const isDisabled = setup === "Có sẵn" || status === "Đã đặt";

  return (
    <div className="best-p1">
      <img src={photo} alt="img" />
      <div className="best-p1-txt">
        <div className="name-of-p">
          <p className="product-name">{name}</p>
        </div>
        <div className="name-of-p">
          <p className="product-name1">Số ghế: {numberOfSeats}</p>
        </div>
        <div className="name-of-p">
          <p className="product-name1">Setup: {setup}</p>
        </div>
        <div className="name-of-p">
          <p className="product-name1">Trạng thái: {status}</p>
        </div>
        <div className="buy-now1">
          {isDisabled ? (
            <button className="disabled-button" disabled>
              Đặt bàn
            </button>
          ) : (
            <Link
              href={{
                pathname: '/booking',
                query: {
                  table: JSON.stringify({ 
                    _id,
                    photo,
                    name,
                    numberOfSeats,
                    setup,
                    status
                  })
                }
              }}
              passHref
            >
              <button>
                Đặt bàn
              </button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default TableItem;

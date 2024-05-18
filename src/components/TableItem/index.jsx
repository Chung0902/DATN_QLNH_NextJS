import React, { useState } from "react";
import { BsFillCartPlusFill } from "react-icons/bs";
import { useRouter } from "next/router";
import { Spin } from "antd";

const TableItem = (props) => {
  const router = useRouter();
  const { _id, photo, name, numberOfSeats, setup, status } = props;
  const isDisabled = setup === "Có sẵn" || status === "Đã đặt";

  const handleBookTable = () => {
    if (!isDisabled) {
      router.push({
        pathname: '/booking',
        query: {
          table: JSON.stringify({ // Chuyển đổi đối tượng thành chuỗi JSON
            _id,
            photo,
            name,
            numberOfSeats,
            setup,
            status
          })
        }
      });
    }
  };

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
          <button
            className={isDisabled ? "disabled-button" : ""}
            disabled={isDisabled}
            onClick={handleBookTable}
          >
            Đặt bàn
          </button>
        </div>
      </div>
    </div>
  );
};

export default TableItem;

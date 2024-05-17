import React, { useState } from "react";
import { BsFillCartPlusFill } from "react-icons/bs";
import { useRouter } from "next/router";
import { Spin } from "antd";

const ProductItem = (props) => {
  const router = useRouter();
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
        <button className={isDisabled ? "disabled-button" : ""} disabled={isDisabled} >Đặt bàn</button>
        </div>
      </div>
    </div>
  );
};

export default ProductItem;

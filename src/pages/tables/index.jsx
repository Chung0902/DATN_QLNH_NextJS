import React, { useCallback, useEffect, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { Breadcrumb } from "antd";
import jwt_decode from "jwt-decode";
import { useRouter } from "next/router";

import axiosClient from "@/libraries/axiosClient";
import HeadMeta from "@/components/HeadMeta";
import Header from "@/layout/Header";
import Footer from "@/layout/Footer";
import TableItem from "@/components/TableItem";
import styles from "./TableDetail.module.css";
import { getTokenFromLocalStorage } from "../../utils/tokenUtils";
import useCartStore from "@/stores/cartStore";



const Tables = ({ tables }) => {
  const [customerId, setCustomerId] = useState(null);
  const { addToCart, fetchCartData1 } = useCartStore();
  const router = useRouter();


  // useEffect(() => {
  //   // Lấy token từ localStorage
  //   const token = getTokenFromLocalStorage();

  //   if (token) {
  //     try {
  //       // Giải mã token để lấy thông tin customerId
  //       const decodedToken = jwt_decode(token);
  //       const { _id: customerId } = decodedToken;
  //       setCustomerId(customerId);
  //       fetchCartData1(customerId);
  //     } catch (error) {
  //       console.error("Error decoding token:", error);
  //       setCustomerId(null);
  //     }
  //   }
  // }, []);

// const handleAddToCart = async (_id, stock) => { // Thêm tham số stock vào hàm
//   const token = getTokenFromLocalStorage();
//   const productId = _id;
//   if (stock < 1) { // Kiểm tra nếu stock nhỏ hơn 1
//     alert("Sản phẩm không còn trong kho. Vui lòng chọn sản phẩm khác.");
//     return; // Dừng thực hiện hàm nếu stock nhỏ hơn 1
//   }
//   if (token) {
//     try {
//       const response = await axiosClient.post(
//         `/user/cart`,
//         {
//           customerId,
//           productId,
//           quantity: 1,
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );
//       addToCart(productId);
//       fetchCartData1(customerId)

//     } catch (error) {
//       console.error("Error checking login:", error);
//     }
//   } else {
//     router.push("/login");
//   }
// };
  return (
    <>
      <HeadMeta title="All Tables" />
      <Header />
      <Breadcrumb
      style={{marginTop:"12px",fontSize:"18px"}}
      className="container"
        items={[
          {
            title: <Link href={`/`}>HomePage</Link> ,
          },
          {
            title: "Tables"
          }
        ]}
      />
      <section style={{ paddingBottom: "100px" }} id="sellers">
        <div className="seller container">
          <span className="abc">
            <h3 className={styles.h3}>Tất cả bàn ăn</h3>
          </span>
          {tables.length > 0 ? (
            <div className="best-seller">
              {tables.map((p) => (
                <Link key={p._id} href={`/tables/${p._id}`}>
                  <TableItem
                    _id = {p._id}
                    photo={p.photo}
                    name={p.name}
                    numberOfSeats={p.numberOfSeats}
                    setup={p.setup}
                    status={p.status}
                    // handleAddToCart={() => handleAddToCart(p._id, p.stock)} 
                  />
                </Link>
              ))}
            </div>
          ) : (
            <small>Không có bàn ăn</small>
          )}
        </div>
      </section>
      <Footer />
    </>
  );
};

export default Tables;

// getServerSideProps - Server-Side Rendering
export async function getServerSideProps() {
  try {
    const response = await axiosClient.get("/user/tables");

    return {
      props: {
        tables: response.data.payload,
      },
    };
  } catch (error) {
    return {
      notFound: true,
    };
  }
}



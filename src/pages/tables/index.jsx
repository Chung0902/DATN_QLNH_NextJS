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
                <Link key={p._id} href={''}>
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



import React, { useCallback, useEffect, useState } from "react";
import ProductItem from "../ProductItem";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import { useRouter } from "next/router";

import { getTokenFromLocalStorage } from "../../utils/tokenUtils";
import axiosClient from "../../libraries/axiosClient.js";
import jwt_decode from "jwt-decode";
import useCartStore from "@/stores/cartStore";



const FlashSale = ({ flashsale }) => {
  const [customerId, setCustomerId] = useState(null);
  const { addToCart, fetchCartData1 } = useCartStore();
  const [isMobile, setIsMobile] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    handleResize(); // Call it once on the client side
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const slidesPerView = isMobile ? 2 : 4;



  useEffect(() => {
    // Lấy token từ localStorage
    const token = getTokenFromLocalStorage();

    if (token) {
      try {
        // Giải mã token để lấy thông tin customerId
        const decodedToken = jwt_decode(token);
        const { _id: customerId } = decodedToken;
        setCustomerId(customerId);
        fetchCartData1(customerId);
      } catch (error) {
        console.error("Error decoding token:", error);
        setCustomerId(null);
      }
    }
  }, []);

  const handleAddToCart = async (_id, stock) => { // Thêm tham số stock vào hàm
    const token = getTokenFromLocalStorage();
    const productId = _id;
    if (stock < 1) { // Kiểm tra nếu stock nhỏ hơn 1
      alert("Sản phẩm không còn trong kho. Vui lòng chọn sản phẩm khác.");
      return; // Dừng thực hiện hàm nếu stock nhỏ hơn 1
    }
    if (token) {
      try {
        const response = await axiosClient.post(
          `/user/cart`,
          {
            customerId,
            productId,
            quantity: 1,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        addToCart(productId);    
        fetchCartData1(customerId)
      } catch (error) {
        console.error("Error checking login:", error);
      }
    } else {
      // Nếu không có token, chuyển hướng đến trang đăng nhập
      router.push("/login");
    }
  };
  
  return (
    <div style={{marginTop:"50px"}} className="container">
      <section id="sellers">
        <div className="seller">
          <div className="p-flex">
            <h4 className="hh4">Giảm giá</h4>
            <div className="viewall">
            <Link href={`/flashSale`}>Xem tất cả <code>&gt;</code></Link>
            </div>
          </div>
          {flashsale.length > 0 ? (
            <div  style={{marginTop:'30px'}} className="best-seller">
              <Swiper
                spaceBetween={0}
                slidesPerView={slidesPerView}
                modules={[Navigation, Pagination]}
                navigation
                /*    pagination={{ clickable: true }} */
                onSlideChange={() => console.log("slide change")}
                onSwiper={(swiper) => console.log(swiper)}
              >
                {flashsale.map((p) => (
                  <SwiperSlide key={p._id}>
                    <Link href={`/products/${p._id}`}>
                      <ProductItem
                        _id={p._id}
                        photo={p.photo}
                        name={p.name}
                        price={p.price}
                        discountedPrice={p.discountedPrice}
                        stock= {p.stock}
                        handleAddToCart={() => handleAddToCart(p._id, p.stock)} 
                        discount={
                          <div className="home-product-item__sale-off">
                            <span className="home-product-item__sale-off-percent">
                              {p.discount}%
                            </span>
                            <span className="home-product-item__sale-off-label">
                              GIẢM
                            </span>
                          </div>
                        }
                      />
                    </Link>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          ) : (
            <small>Không có sản phẩm</small>
          )}
        </div>
      </section>
      {
        <section className="section section-ads img-df ">
          <img
            src="https://phuchaisan.com/wp-content/uploads/2022/03/tom-hum-alaska-banner.jpg"
            alt=""
          />
        </section>
      }
    </div>
  );
};

export default FlashSale;


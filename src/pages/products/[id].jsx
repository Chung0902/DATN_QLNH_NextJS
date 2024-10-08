import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Breadcrumb } from "antd";
import { BsFillCartPlusFill } from "react-icons/bs";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import jwt_decode from "jwt-decode";
import { Img } from 'react-image'

import axiosClient from "../../libraries/axiosClient.js";
import HeadMeta from "@/components/HeadMeta/index.jsx";
import Header from "@/layout/Header/index.jsx";
import Footer from "@/layout/Footer/index.jsx";
import styles from "./ProductDetail.module.css";
import ProductItem from "@/components/ProductItem/index.jsx";
import { useRouter } from "next/router";
import useCartStore from "@/stores/cartStore";
import { getTokenFromLocalStorage,removeTokenFromLocalStorage } from "../../utils/tokenUtils";
import moment from 'moment';
import { notification } from "antd";


const ProductDetail = (props) => {
  const { product } = props;
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [mainPhoto, setMainPhoto] = useState(product.photo);
  const [customerId, setCustomerId] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const { addToCart, fetchCartData1 } = useCartStore();
  const [isMobile, setIsMobile] = useState(false);
  const router = useRouter();
  const [reviews, setReviews] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const reviewsPerPage = 5;

  const [selectedRating, setSelectedRating] = useState(0);
  const [comment, setComment] = useState("");

  const isAbsoluteUrl = (url) => {
    return url.startsWith('http://') || url.startsWith('https://');
  };
  
  const getImageSrc = (avatar) => {
    return isAbsoluteUrl(avatar) ? avatar : `${process.env.NEXT_PUBLIC_BASE_URL}/${avatar}`;
  };

  

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    handleResize(); 
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const slidesPerView = isMobile ? 4 : 5;


 // Giải mã token để lấy thông tin customerId 
  useEffect(() => {
    const token = getTokenFromLocalStorage();

    if (token) {
      try {
        const decodedToken = jwt_decode(token);
        const { _id: customerId } = decodedToken;
        setCustomerId(customerId);
      } catch (error) {
        console.error("Error decoding token:", error);
        setCustomerId(null);
      }
    }
  }, []);

  //Thay đổi ảnh Main khi hover vào ảnh phụ
  const changeMainImage = (photo) => {
    setMainPhoto(photo);
  };

  //Gọi Api so sánh name với sản phẩm đang xem để lọc ra sản phẩm tương tự
  useEffect(() => {
    const fetchSearchResults = async () => {
      try {
        const response = await axiosClient.get(
          `/questions/productSimilar?name=${product.name}`
        );
        const searchResults = response.data.payload;
        setSearchResults(searchResults);
      } catch (error) {
        console.error("Error searching products:", error);
      }
    };
    fetchSearchResults();
  }, []);

  //Khi không hover vào ảnh phụ nữa thì sẽ trả ảnh Main lần đầu lại cho nó
  const resetMainImage = () => {
    setMainPhoto(product.photo);
  };

  //Thay đổi ảnh Main khi click sang spham khác
  useEffect(() => {
    setMainPhoto(product.photo);
  }, [product]);



  useEffect(() => {
    const checkLoggedIn = async () => {
      const token = getTokenFromLocalStorage();

      if (token) {
        try {
          const response = await axiosClient.get("/user/orders", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          if (response.data.payload) {
            setIsLoggedIn(true);
          } else {
            setIsLoggedIn(false);
          }
        } catch (error) {
          console.error("Error checking login:", error);
          setIsLoggedIn(false);
        }
      } else {
        setIsLoggedIn(false);
      }
    };

    checkLoggedIn();
  }, []);

  // Gọi API lấy danh sách đánh giá
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axiosClient.get(`/questions/pipeline/${product._id}`);
        setReviews(response.data.payload.reviews);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };

    fetchReviews();
  }, [product._id]);


  const handleQuantityChange = (event) => {
    setQuantity(event.target.value);
  };

  const handleAddToCart = async () => {
    const productId = router.query.id;
    if (isLoggedIn) {
      const token = getTokenFromLocalStorage();
  
      if (product.stock < 1) {
        alert("Sản phẩm không còn đủ số lượng trong kho.");
        return;
      }  
      
      try {
        
        const response = await axiosClient.post(
          `/user/cart`,
          {
            customerId,
            productId,
            quantity,
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
        console.error("Error adding to cart:", error);
      }
    } else {
      router.push("/login"); // Chuyển hướng đến trang đăng nhập
    }
  };

  

  const handleBuyNow = () => {
    if (isLoggedIn) {
      const totalPrice = quantity * product.discountedPrice;
      const totalPriceQueryParam = totalPrice.toString();
      
      const productArray = [{...product, quantity}];
  
      const productJson = JSON.stringify(productArray);
    
      router.push(`/checkout?products=${encodeURIComponent(productJson)}
      &totalPrice=${encodeURIComponent(totalPriceQueryParam)}`);
    } else {
      router.push("/login"); // Chuyển hướng đến trang đăng nhập
    }
  };

  const indexOfLastReview = currentPage * reviewsPerPage;
  const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
  const currentReviews = reviews.slice(indexOfFirstReview, indexOfLastReview);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  
  const handleAddReview = async () => {
    if (!selectedRating || !comment) {
      alert("Vui lòng chọn số sao và nhập bình luận.");
      return;
    }
  
    const token = getTokenFromLocalStorage();
    if (token) {
      try {
        const response = await axiosClient.post(
          '/user/reviews',
          {
            productId: product._id,
            rating: selectedRating,
            comment: comment,
            customerId: customerId,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.data.success) {
          // Xóa nội dung bình luận và đặt lại số sao đã chọn
          setSelectedRating(0);
          setComment("");

           // Hiển thị thông báo thành công
           alert('Gửi đánh giá thành công!');
  
          // Gọi lại hàm fetchReviews để tải danh sách bình luận mới nhất
          fetchReviews();

        }
      } catch (error) {
        console.error("Error submitting review:", error);
        alert("Có lỗi xảy ra khi gửi đánh giá. Vui lòng thử lại sau.");
      }
    } else {
      router.push("/login");
    }
  };
  
  
  
  return (
    <>
      <HeadMeta title="Product Detail" />
      <Header />
      <Breadcrumb
      style={{marginTop:"12px",fontSize:"18px"}}
      className="container"
        items={[
          {
            title: <Link href={`/`}>Trang chủ</Link> ,
          },
          {
            title: <Link href={`/products`}>Món ăn</Link>,
          },
          {
            title: `${product.name}`,
          },
        ]}
      />
      {product && (
        <div className={`${styles.wrapper} container`}>
          <div className={styles.image}>
            <div className={styles.mainImage}>
              <img src={mainPhoto} alt="" />
            </div>

            <div className={styles.subImage}>
              <Swiper
                spaceBetween={0}
                slidesPerView={slidesPerView}
                modules={[Navigation, Pagination]}
                navigation
                /*    pagination={{ clickable: true }} */
                onSlideChange={() => console.log("slide change")}
                onSwiper={(swiper) => console.log(swiper)}
              >
                {product.subphoto.map((photo, index) => (
                  <SwiperSlide key={index}>
                    <img
                      src={photo}
                      alt=""
                      onMouseOver={() => changeMainImage(photo)}
                      onMouseOut={resetMainImage}
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>
          <div className={styles.information}>
            <div className={styles.namePhoduct}>{product.name}</div>
            <div className={styles.description}>{product.description}</div>
            <div className={styles.price}>
              <p>{product.discountedPrice.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</p>
              <del>{product.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</del>
            </div>
            <div className={styles.quantity}>
              Số lượng:
              <input
                onChange={handleQuantityChange}
                type="number"
                min={1}
                max={product.stock}
                value={quantity}
              />
              <div>
                <p>{product.stock == null? 0 : (product.stock)}</p>
                Phần ăn 
              </div>
            </div>
            <div className={styles.buyNow}>
              <div>
                <button onClick={handleAddToCart}>
                  <BsFillCartPlusFill
                    style={{
                      fontSize: "20px",
                      marginRight: "5px",
                      marginBottom: "3px",
                    }}
                  />
                  <p >
                    Add to Cart
                  </p>
                </button>
                </div>
                <div>
                <button onClick={handleBuyNow}>
                  <p>
                    Buy Now
                  </p>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <section style={{ paddingBottom: "80px", marginTop: "50px" }} id="reviews">
        <div className="seller container">
          <span className="abc">
            <h3 className={styles.h3}>Đánh giá món ăn</h3>
          </span>
          {currentReviews.length > 0 ? (
            <div className={styles.reviewsList}>
              {currentReviews.map((review, index) => (
                <div key={index} className={styles.reviewItem}>
                  <div className={styles.reviewHeader}>
                    <Img
                      src={getImageSrc(review.customerAvatar)}
                      alt={review.customerName}
                      className={styles.avatar}
                    />
                    <div>
                      <div className={styles.customerName}>{review.customerName}</div>
                      <div className={styles.rating}>
                        {"★".repeat(review.rating)}
                        {"☆".repeat(5 - review.rating)}
                      </div>
                    </div>
                  </div>
                  <div className={styles.createdAt}>{moment(review.createdAt).format('DD/MM/YYYY HH:mm')}</div>
                  <div className={styles.reviewComment}>{review.comment}</div>
                </div>
              ))}
            </div>
          ) : (
            <p>Chưa có đánh giá nào.</p>
          )}
          <div className={styles.pagination}>
            <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
              {"<"}
            </button>
            {Array.from({ length: Math.ceil(reviews.length / reviewsPerPage) }).map((_, index) => (
              <button
                key={index}
                onClick={() => handlePageChange(index + 1)}
                className={currentPage === index + 1 ? styles.active : ""}
              >
                {index + 1}
              </button>
            ))}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === Math.ceil(reviews.length / reviewsPerPage)}
            >
              {">"}
            </button>
          </div>
          <div className={styles.addReview}>
            <h3>Thêm đánh giá của bạn</h3>
            <div className={styles.rating}>
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  className={selectedRating >= star ? styles.selectedStar : ""}
                  onClick={() => setSelectedRating(star)}
                >
                  ★
                </span>
              ))}
            </div>
            <textarea
              placeholder="Viết bình luận của bạn..."
              value={comment}
              className={styles.textarea}
              onChange={(e) => setComment(e.target.value)}
            />
            <div  className={styles.button}>
              <button onClick={handleAddReview}>Gửi đánh giá</button>
            </div>
        
        </div>
        </div>
       
      </section>

      <section style={{ paddingBottom: "80px", marginTop: "50px" }} id="sellers">
        <div className="seller container">
          <span className="abc">
            <h3 className={styles.h3}>Món ăn tương tự</h3>
          </span>
          {searchResults && searchResults.length > 0 ? (
            <div className="best-seller">
              {searchResults.map((p) => {
                if (p._id !== product._id) {
                  return (
                    <Link key={p._id} href={`/products/${p._id}`}>
                      <ProductItem
                        _id={p._id}
                        photo={p.photo}
                        name={p.name}
                        price={p.price}
                        discountedPrice={p.discountedPrice}
                        handleAddToCart={handleAddToCart}
                      />
                    </Link>
                  );
                } else {
                  return null; // Bỏ qua sản phẩm đang xem
                }
              })}
            </div>
          ) : (
            <small>Không có món ăn tương tự</small>
          )}
        </div>
      </section>


      <Footer />
    </>
  );
};

export default ProductDetail;

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: "blocking",
  };
}

export async function getStaticProps(req) {
  try {
    const { params } = req;
    const response = await axiosClient.get(`/user/products/${params.id}`);
    return {
      props: {
        product: response.data.payload,
      },

      revalidate: 3,
    };
  } catch (error) {
    return {
      notFound: true,
    };
  }
}

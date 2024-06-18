import React, { useState, useEffect } from 'react';
import styles from './CustomerReviews.module.css';
import axiosClient from "../../libraries/axiosClient.js";
import { Img } from 'react-image';

const CustomerReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const reviewsPerPage = 4;

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axiosClient.get('/questions/pipeline1');
        setReviews(response.data.payload || []);
      } catch (error) {
        console.error('Error fetching reviews:', error);
        setReviews([]);
      }
    };
    fetchReviews();
  }, []);

  const indexOfLastReview = currentPage * reviewsPerPage;
  const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
  const currentReviews = reviews.slice(indexOfFirstReview, indexOfLastReview);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const isAbsoluteUrl = (url) => /^(http|https):\/\//.test(url);

  const getImageSrc = (avatar) => {
    if (isAbsoluteUrl(avatar)) {
      return avatar;
    }
    return `${process.env.NEXT_PUBLIC_BASE_URL}/${avatar}`;
  };

  const renderPagination = () => {
    const totalPages = Math.ceil(reviews.length / reviewsPerPage);
    const pageNumbers = [];

    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(
        <button
          key={i}
          onClick={() => paginate(i)}
          className={`${styles.pageButton} ${currentPage === i ? styles.active : ''}`}
        >
          {i}
        </button>
      );
    }

    return (
      <div className={styles.pagination}>
        <button
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
          className={styles.prevNextButton}
        >
          Trước đó
        </button>
        {pageNumbers}
        <button
          onClick={() => paginate(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={styles.prevNextButton}
        >
          Kế tiếp
        </button>
      </div>
    );
  };

  return (
    <div className={styles.container}>
      <h4 className={styles.h4}>Đánh giá của khách hàng</h4>
      <div className={styles.reviewsContainer}>
        {currentReviews.length > 0 ? (
          currentReviews.map((testimonial, index) => (
            <div className={styles.testimonial} key={index}>
              <div className={`${styles.avatarContainer} ${styles[`avatar-${index}`]}`}>
                <Img
                  src={getImageSrc(testimonial.customerAvatar)}
                  alt={testimonial.customerName}
                  className={styles.avatar}
                  loader={<div>Loading...</div>}
                  unloader={<img src="/path/to/default/avatar.png" alt="default avatar" />}
                />
              </div>
              <div className={styles.quoteContainer}>
                <p className={styles.quote}>{testimonial.comment}</p>
              </div>
            </div>
          ))
        ) : (
          <p>No reviews available.</p>
        )}
      </div>
      {renderPagination()}
    </div>
  );
};

export default CustomerReviews;
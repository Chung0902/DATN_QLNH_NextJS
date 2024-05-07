import React from 'react'
import styles from './Elementor.module.css'

const Elementor = () => {
  return (
    <div className={styles.wrapper}>
        <div className={styles.wrapperItem1}>
            <img src="https://template.web30s.com.vn/webshop_39/images/slide_2.png" alt="skincare" />
            {/* <div className={styles.title}>
                <p>HẢI SẢN</p>
                <h3>Tươi sống</h3>
            </div>
            <button>Khám phá</button> */}
        </div>
        <div className={styles.wrapperItem2}>
            <img src="https://nhahanghungtruongsa.vn/wp-content/uploads/2022/08/hdmh.jpg" alt="makeup" />
            {/* <div className={styles.title}>
                <p>CHẤT LƯỢNG</p>
                <h3>Hàng đầu</h3>
            </div>
            <button>Khám phá</button> */}
        </div>
    </div>
  )
}

export default Elementor
import Image from 'next/image';
import React from 'react';
import {FaBattleNet} from "react-icons/fa";
import Link from "next/link";

function Footer(props) {
  return (
    <footer className="footer-section">
    <div className="container">
      <div className="footer-cta pt-5 pb-5">
        <div className="row">
          <div className="col-xl-4 col-md-4 mb-30">
            <div className="single-cta">
              <i className="fas fa-map-marker-alt" />
              <div className="cta-text">
                <h4>Địa chỉ </h4>
                <span>139 Võ Nguyên Giáp, Đà Nẵng</span>
              </div>
            </div>
          </div>
          <div className="col-xl-4 col-md-4 mb-30">
            <div className="single-cta">
              <i className="fas fa-phone" />
              <div className="cta-text">
                <h4> Gọi cho chúng tôi</h4>
                <span>0774569874</span>
              </div>
            </div>
          </div>
          <div className="col-xl-4 col-md-4 mb-30">
            <div className="single-cta">
              <i className="far fa-envelope-open" />
              <div className="cta-text">
                <h4>Email</h4>
                <span>elysian@gmail.com</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="footer-content pt-5 pb-5">
        <div className="row">
          <div className="col-xl-4 col-lg-4 mb-50">
            <div className="footer-widget">
              <div className="footer-logo">
              <Link href="/" className="navbar-brand">
              <FaBattleNet /> Elysian 
            </Link>
              </div>
              <div className="footer-text">
                <p>
                Nhà hàng hải sản của chúng tôi là điểm đến lý tưởng cho 
                    những ai đam mê hương vị tươi ngon từ biển cả. Với không 
                    gian ấm cúng và đa dạng món ăn, chúng tôi tự hào mang đến 
                    cho quý khách trải nghiệm ẩm thực độc đáo và đầy hấp dẫn. 
                    Hãy đến và khám phá thế giới hải sản tươi ngon tại nhà hàng của chúng tôi!
                </p>
              </div>
              <div className="footer-social-icon">
                <span>Theo dõi chúng tôi</span>
                <a href="#">
                  <i className="fab fa-facebook-f facebook-bg" />
                </a>
                <a href="#">
                  <i className="fab fa-twitter twitter-bg" />
                </a>
                <a href="#">
                  <i className="fab fa-google-plus-g google-bg" />
                </a>
              </div>
            </div>
          </div>
          <div className="col-xl-4 col-lg-4 col-md-6 mb-30">
            <div className="footer-widget">
              <div className="footer-widget-heading">
                <h3>Liên kết hữu ích</h3>
              </div>
              <ul>
                <li>
                  <a href="#">Trang chủ</a>
                </li>
                <li>
                  <a href="#">Giới thiệu</a>
                </li>
                <li>
                  <a href="#">Dịch vụ</a>
                </li>
                <li>
                  <a href="#">Danh mục</a>
                </li>
                <li>
                  <a href="#">Liên hệ</a>
                </li>
                <li>
                  <a href="#">Về chúng tôi</a>
                </li>
                <li>
                  <a href="#">Dịch vụ của chúng tôi</a>
                </li>
                <li>
                  <a href="#">Đội ngũ chuyên gia</a>
                </li>
                <li>
                  <a href="#">Liên hệ với chúng tôi</a>
                </li>
                <li>
                  <a href="#">Tin tức mới nhất</a>
                </li>
              </ul>

            </div>
          </div>
          <div className="col-xl-4 col-lg-4 col-md-6 mb-50">
            <div className="footer-widget">
              <div className="footer-widget-heading">
                <h3>Đặt mua</h3>
              </div>
              <div className="footer-text mb-25">
                <p>
                Đừng bỏ lỡ việc đăng ký các nguồn cấp dữ liệu mới của chúng tôi, vui lòng điền vào biểu mẫu bên dưới.
                </p>
              </div>
              <div className="subscribe-form">
                <form action="#">
                  <input type="text" placeholder="Địa chỉ Email" />
                  <button>
                    <i className="fab fa-telegram-plane" />
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div className="copyright-area">
      <div className="container">
        <div className="row">
          <div className="col-xl-6 col-lg-6 text-center text-lg-left">
            <div className="copyright-text">
              <p>
                Nguyễn Thị Chung © 0902_QLNH
                {/* <a href="https://codepen.io/anupkumar92/">Anup</a> */}
              </p>
            </div>
          </div>
          {/* <div className="col-xl-6 col-lg-6 d-none d-lg-block text-right">
            <div className="footer-menu">
              <ul>
                <li>
                  <a href="#">Home</a>
                </li>
                <li>
                  <a href="#">Terms</a>
                </li>
                <li>
                  <a href="#">Privacy</a>
                </li>
                <li>
                  <a href="#">Policy</a>
                </li>
                <li>
                  <a href="#">Contact</a>
                </li>
              </ul>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  </footer>  
  );
}

export default Footer;
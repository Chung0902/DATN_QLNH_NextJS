import Image from 'next/image';
import React from 'react';
import Link from 'next/link';
import ProductGallery from '../../components/ProductGallery';
import { FaRocketchat, FaCommentDots, FaCommentsDollar } from "react-icons/fa";


function Main({ suppliers }) {
    return (
        <main className='body-content'>
            <div className="container" >
                <section className="section section-one md-flex-column">
                    <aside className="categories">
                        <h2 className="cat-title">NHÀ CUNG CẤP</h2>
                        {suppliers.length > 0 ? (
                            <ul className="side-menu">
                                {suppliers.map((supplier, index) => (
                                    <li key={supplier._id}><a href="#">{supplier.name}</a></li>
                                ))}
                            </ul>
                        ) : (
                            <span>Không có nhà cung cấp nào</span>
                        )}

                        <div className="btn btn-sale">Huge Sale -
                            <strong>70%</strong>
                            Off</div>
                    </aside>
                    <div className="banner-main">
                        <div className="owl-carousel owl-theme">
                            <div className="item">
                                <ProductGallery />
                            </div>
                        </div>
                    </div>
                </section>
                <section className="section section-two md-flex-column">
                    <div className="info-box">
                        <div className="icon"><FaRocketchat /></div>

                        <div className="info-content">
                            <h4>MIỄN PHÍ VẬN CHUYỂN & TRẢ LẠI</h4>
                            <p>Miễn phí vận chuyển cho tất cả các đơn hàng giá trị cao</p>
                        </div>
                    </div>
                    <div className="info-box">
                        <div className="icon"><FaCommentsDollar /></div>

                        <div className="info-content">
                            <h4>ĐẢM BẢO HOÀN TIỀN</h4>
                            <p>Đảm bảo hoàn lại tiền 100%</p>
                        </div>
                    </div>
                    <div className="info-box">
                        <div className="icon"><FaCommentDots /></div>

                        <div className="info-content">
                            <h4>HỖ TRỢ TRỰC TUYẾN 24/7</h4>
                            <p>Trả lời các thắc mắc của khách hàng</p>
                        </div>
                    </div>
                </section>
            </div>
        </main>
    );
}

export default Main;
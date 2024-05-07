// Banner.js

import React, { useState, useEffect } from 'react';

const Banner = () => {
  const [showBanner, setShowBanner] = useState(false);

  const handleBannerClose = () => {
    setShowBanner(false);
    sessionStorage.setItem('bannerDisplayed', 'true');
  };

  useEffect(() => {
    const bannerDisplayed = sessionStorage.getItem('bannerDisplayed');
    if (!bannerDisplayed) {
      setShowBanner(true);
    }
  }, []);

  if (!showBanner) {
    return null;
  }

  return (
    <div className="banner">
      <img src="https://nhahangvuonganh.vn/wp-content/uploads/2020/10/banner-cua-PHS-2-900x900px-FILEminimizer-cua-hoang-de-giam-gia.jpg" alt="Product Banner" />
      <button className="close-button" onClick={handleBannerClose}>
        x
      </button>
    </div>
  );
};

export default Banner;

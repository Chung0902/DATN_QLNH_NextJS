import React from "react";
import styles from "./VideoNewProducts.module.css";

const VideoNewProducts = () => {
  return (
    <div style={{ padding: "80px 0px" }} className="container">
      <h3 className={styles.h3}>Món ăn sắp ra mắt</h3>
      <iframe
        className={styles.iframe}
        style={{ paddingTop: "30px" }}
        width="100%"
        height="600px"
        src="https://www.youtube.com/embed/0Eb0t2NEOxs"
        title="YouTube video player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      ></iframe>
    </div>
  );
};

export default VideoNewProducts;

import React from "react";
import { Spinner } from "react-bootstrap";
import styles from "../styles/Asset.module.css"; 

const LoadingAsset = ({ isLoading, imageSrc, caption }) => {
  return (
    <div className={`${styles.assetContainer} p-4`}>
      {isLoading && <Spinner animation="border" />}
      {imageSrc && <img src={imageSrc} alt={caption} />}
      {caption && <p className="mt-4">{caption}</p>}
    </div>
  );
};

export default LoadingAsset;
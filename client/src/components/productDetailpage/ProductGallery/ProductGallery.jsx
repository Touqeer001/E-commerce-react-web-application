import { useState } from "react";
import "./ProductGallery.css";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

const ProductGallery = ({ images = [], productName }) => {
  const [open, setOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  return (
    <>
      <div className="product-gallery">
        {images.map((image, index) => {
          const imageUrl = image.startsWith("http")
            ? image
            : `http://localhost:5000${image}`;

          return (
            <div className="gallery-item" key={index}>
              <img
                src={imageUrl}
                alt={`${productName}-${index}`}
                onClick={() => {
                  setCurrentIndex(index);
                  setOpen(true);
                }}
              />
            </div>
          );
        })}
      </div>
      <Lightbox
        open={open}
        close={() => setOpen(false)}
        index={currentIndex}
        slides={images.map((img) => ({ src: img }))}
      />
    </>
  );
};

export default ProductGallery;

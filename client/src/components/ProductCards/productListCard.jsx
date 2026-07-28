import { Link } from "react-router-dom";
import { FaStar, FaHeart } from "react-icons/fa";
import "./productListCard.css";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import useWishlist from "../../hooks/useWishlist";

const ProductListCard = ({ product }) => {
  const { addItem, wishlist, actionLoading } = useWishlist();
  const isWishlisted = wishlist.items.some((item) => String(item.productId) === String(product.id));
  const discount =
    product.discountPrice && product.discountPrice > product.price
      ? Math.round(
          ((product.discountPrice - product.price) / product.discountPrice) *
            100,
        )
      : 0;



  return (
    <div className="product-card">
      <div className="image-wrapper">
        <Link
          to={`/product/${product.id}`}
          state={{ product }}
          className="product-image"
        >
          <Swiper
            slidesPerView={1}
            navigation
            loop
            modules={[Navigation]}
            className="product-swiper"
          >
            {product.images?.map((image, index) => (
              <SwiperSlide key={index}>
                <img src={image} alt={product.name} />
              </SwiperSlide>
            ))}
          </Swiper>
        </Link>

        <button className={`wishlist-btn ${isWishlisted ? "active" : ""}`} onClick={() => !isWishlisted && addItem(product)} disabled={actionLoading || isWishlisted} aria-label={isWishlisted ? "In wishlist" : "Add to wishlist"}>
          <FaHeart />
        </button>

        {/* Hover Size Panel */}

        <div className="size-overlay">
          <span className="size-heading">SELECT SIZE</span>

          <div className="size-list">
            {product.size?.map((size) => (
              <button key={size} className="size-btn">
                {size}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="product-info">
        <p className="product-brand">{product.brand}</p>

        <Link
          to={`/product/${product.id}`}
          state={{ product }}
          className="product-title"
        >
          {product.name}
        </Link>

        <div className="rating-row">
          <FaStar />
          <span>{product.rating}</span>
        </div>

        <div className="price-row">
          <span className="sale-price">₹{product.price}</span>

          {product.discountPrice > product.price && (
            <>
              <span className="original-price">₹{product.discountPrice}</span>

              <span className="discount">{discount}% OFF</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductListCard;

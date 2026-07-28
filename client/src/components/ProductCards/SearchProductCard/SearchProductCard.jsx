import { Link } from "react-router-dom";
import { FaHeart } from "react-icons/fa";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";

import "./SearchProductCard.css";

const SearchProductCard = ({ product }) => {
  return (
    <div className="search-product-card">
      <div className="search-image-wrapper">

        {product.stock <= 5 && (
          <span className="stock-badge">
            Only Few Left
          </span>
        )}

        <button className="wishlist-btn">
          <FaHeart />
        </button>

        <Swiper
          slidesPerView={1}
          navigation
          modules={[Navigation]}
          className="search-swiper"
        >
          <SwiperSlide>
            <Link to={`/product/${product.id}`}>
              <img
                src={product.image}
                alt={product.name}
              />
            </Link>
          </SwiperSlide>
        </Swiper>

        {product.size?.length > 0 && (
          <div className="search-size-overlay">
            <span className="size-heading">
              SELECT SIZE
            </span>

            <div className="size-list">
              {product.size.map((size) => (
                <button
                  key={size}
                  className="size-btns"
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        )}

      </div>

      <div className="search-card-content">

        <Link
          to={`/product/${product.id}`}
          className="product-names"
        >
          {product.name}
        </Link>

        <div className="price-row">
          <span className="price">
            ₹{product.price}
          </span>

          {product.discountPrice && (
            <span className="old-price">
              ₹{product.discountPrice}
            </span>
          )}
        </div>

        {product.colors?.length > 0 && (
          <div className="colors">
            {product.colors.map((color, index) => (
              <span
                key={index}
                className="color-dot"
                style={{
                  backgroundColor: color,
                }}
              />
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default SearchProductCard;
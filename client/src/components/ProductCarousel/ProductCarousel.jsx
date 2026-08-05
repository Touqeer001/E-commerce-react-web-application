import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "./ProductCarousel.css";

import ProductListCard from "../ProductCards/productListCard";
import { getAllProducts } from "../../Services/api";

function ProductCarousel() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getAllProducts();
        setProducts(response.data.products ?? response.data ?? []);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="product-section">
      <h2>Trending Products</h2>

      <Swiper
        spaceBetween={20}
        breakpoints={{
          0: {
            slidesPerView: 1.2,
            slidesPerGroup: 1,
            spaceBetween: 12,
          },
          480: {
            slidesPerView: 2,
            slidesPerGroup: 2,
            spaceBetween: 15,
          },
          768: {
            slidesPerView: 3,
            slidesPerGroup: 3,
            spaceBetween: 18,
          },
          1024: {
            slidesPerView: 4,
            slidesPerGroup: 4,
            spaceBetween: 20,
          },
          1280: {
            slidesPerView: 5,
            slidesPerGroup: 5,
            spaceBetween: 20,
          },
        }}
      >
        {products.map((product) => (
          <SwiperSlide key={product.id}>
            <ProductListCard product={product} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}

export default ProductCarousel;
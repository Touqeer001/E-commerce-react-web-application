import { useState } from "react";
import { FaHeart, FaShoppingCart } from "react-icons/fa";
import "./ProductInfo.css";
import useCart from "../../../hooks/useCart";
import useWishlist from "../../../hooks/useWishlist";

const ProductInfo = ({ product }) => {
  const [selectedSize, setSelectedSize] = useState(
    product?.size?.[0] || ""
  );
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(
    product?.images?.[0] || ""
  );

  const { addToCart, actionLoading } = useCart();
  const { addItem, wishlist, actionLoading: wishlistLoading } = useWishlist();

  if (!product) return null;

  const increaseQty = () => {
    setQuantity((prev) => prev + 1);
  };

  const decreaseQty = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const handleAddToCart = () => {
    addToCart({
      productId: product.id,
      quantity,
      size: selectedSize,
      color: product.color,
    });
  };
  const isWishlisted = wishlist.items.some((item) => String(item.productId) === String(product.id));

  const discount =
    product.oldPrice &&
    Math.round(
      ((product.oldPrice - product.price) / product.oldPrice) * 100
    );

  return (
    <div className="product-info">
      {/* Category */}

      <p className="product-category">
        {product.category} / {product.subCategory}
      </p>

      {/* Name */}

      <h1 className="product-name">{product.name}</h1>

      {/* Price */}

      <div className="price-section">
        <span className="current-price">
          ₹{product.price}
        </span>

        {product.oldPrice && (
          <>
            <span className="old-price">
              ₹{product.oldPrice}
            </span>

            <span className="discount-badge">
              Save {discount}%
            </span>
          </>
        )}
      </div>

      <p className="tax-text">
        Incl. of all taxes
      </p>

      {/* Color */}

      <div className="info-block">
        <h4>
          COLOR : <span>{product.color}</span>
        </h4>

        <div className="color-variants">
          {product.images?.map((img, index) => (
            <div
              key={index}
              className={`variant-card ${selectedImage === img ? "active" : ""
                }`}
              onClick={() => setSelectedImage(img)}
            >
              <img src={img} alt={`${product.name}-${index}`} />
            </div>
          ))}
        </div>
      </div>

      {/* Size */}

      <div className="size-header">
        <h4>SIZE</h4>



      </div>

      <div className="size-list">
        {product.size?.map((size) => (
          <button
            key={size}
            type="button"
            className={`size-btn ${selectedSize === size ? "active" : ""
              }`}
            onClick={() => setSelectedSize(size)}
          >
            {size}
          </button>
        ))}
      </div>

      {/* Quantity */}

      <div className="quantity-section">
        <h4>QUANTITY</h4>

        <div className="quantity-box">
          <button
            type="button"
            onClick={decreaseQty}
          >
            −
          </button>

          <span>{quantity}</span>

          <button
            type="button"
            onClick={increaseQty}
          >
            +
          </button>
        </div>
      </div>

      {/* Cart */}

      <button
        className="cart-button"
        onClick={handleAddToCart}
        disabled={actionLoading}
        type="button"
      >
        <FaShoppingCart />
        {actionLoading ? "ADDING..." : "ADD TO CART"}
      </button>
      <button className="cart-button wishlist-product-button" onClick={() => !isWishlisted && addItem(product)} disabled={wishlistLoading || isWishlisted} type="button">
        <FaHeart /> {isWishlisted ? "SAVED TO WISHLIST" : "ADD TO WISHLIST"}
      </button>

      {/* Accordions */}

      <details open>
        <summary>DESCRIPTION</summary>

        <p>
          {product.description ||
            "Premium quality kids wear crafted with soft fabric for everyday comfort."}
        </p>
      </details>

      <details>
        <summary>SIZE GUIDE</summary>

        <p>
          Choose your child's regular size. If you're between
          sizes, we recommend selecting the next size up.
        </p>
      </details>

      <details>
        <summary>SUPPLIER INFORMATION</summary>

        <p>
          <strong>Brand:</strong>{" "}
          {product.brand || "Kids Wear"}
        </p>

        <p>
          <strong>Country of Origin:</strong> India
        </p>
      </details>
    </div>
  );
};

export default ProductInfo;

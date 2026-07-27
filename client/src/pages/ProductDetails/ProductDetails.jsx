import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";

import "./ProductDetails.css";

import Breadcrumb from "../../components/Breadcrumb/Breadcrumb";
import { getLocalProductById, getProductById } from "../../Services/api";
import ProductGallery from "../../components/productDetailpage/ProductGallery/ProductGallery";
import ProductInfo from "../../components/productDetailpage/ProductInfo/ProductInfo";
import ProductCarousel from "../../components/ProductCarousel/ProductCarousel";

const ProductDetails = () => {
  const { id } = useParams();
  const { state } = useLocation();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const productFromListing = state?.product;

    // The PLP has already loaded this object, so render it immediately after
    // navigation instead of depending on a second request to populate the PDP.
    if (productFromListing && String(productFromListing.id) === String(id)) {
      setProduct(productFromListing);
      setLoading(false);
      return;
    }

    const fetchProduct = async () => {
      setLoading(true);

      try {
        const response = await getProductById(id);
        setProduct(response.data.product ?? response.data);
      } catch (mockApiError) {
        // Wishlist IDs come from the local mock backend, just like Cart. If a
        // matching product is not present in the external MockAPI, load the
        // local product instead so its PDP remains available.
        try {
          const response = await getLocalProductById(id);
          setProduct(response.data.product ?? response.data);
        } catch (localApiError) {
          console.error("Error fetching product:", mockApiError, localApiError);
          setProduct(null);
        }
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id, state]);

  if (loading) {
    return <h2>Loading...</h2>;
  }

  if (!product) {
    return <h2>Product Not Found</h2>;
  }

  return (
    <div className="product-details-page">
      <Breadcrumb productName={product.name} />

      <div className="pdp-container">
    <ProductGallery
        images={product.images}
        productName={product.name}
    />

    <ProductInfo
        product={product}
    />
</div>

      <ProductCarousel />
    </div>
  );
};

export default ProductDetails;

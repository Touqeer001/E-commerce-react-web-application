import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";

import "./ProductListing.css";

import { getAllProducts } from "../../Services/api";

import Breadcrumb from "../../components/Breadcrumb/Breadcrumb";
import SortDropdown from "../../components/SortDropdown/SortDropdown";
import ProductGrid from "../../components/ProductGrid/ProductGrid";
import Pagination from "../../components/Pagination/Pagination";
import HeroCarousel from "../../components/HeroCarousel/HeroCarousel";

const ProductListing = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchParams] = useSearchParams();
  const selectedCategory = searchParams.get("category");

  const [filters] = useState({
    category: [],
    ageGroup: [],
    size: [],
    color: [],
    price: 5000,
  });

  const [sortBy, setSortBy] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const productsPerPage = 12;

  // Fetch Products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getAllProducts();
        setProducts(response.data.products);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Reset pagination when category changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory]);

  // Filter + Sort
  const filteredProducts = useMemo(() => {
    let updatedProducts = [...products];

    // Filter by category from URL
    // Filter by category from URL
    if (selectedCategory && selectedCategory.toLowerCase() !== "all") {
      updatedProducts = updatedProducts.filter(
        (product) =>
          product.category.toLowerCase() === selectedCategory.toLowerCase(),
      );
    }

    // Sidebar Category Filter
    if (filters.category.length > 0) {
      updatedProducts = updatedProducts.filter((product) =>
        filters.category.includes(product.category),
      );
    }

    // Age Group
    if (filters.ageGroup.length > 0) {
      updatedProducts = updatedProducts.filter((product) =>
        filters.ageGroup.includes(product.ageGroup),
      );
    }

    // Size
    if (filters.size.length > 0) {
      updatedProducts = updatedProducts.filter((product) =>
        product.size.some((size) => filters.size.includes(size)),
      );
    }

    // Color
    if (filters.color.length > 0) {
      updatedProducts = updatedProducts.filter((product) =>
        filters.color.includes(product.color),
      );
    }

    // Price
    updatedProducts = updatedProducts.filter(
      (product) => product.price <= filters.price,
    );

    // Sorting
    switch (sortBy) {
      case "lowToHigh":
        updatedProducts.sort((a, b) => a.price - b.price);
        break;

      case "highToLow":
        updatedProducts.sort((a, b) => b.price - a.price);
        break;

      case "rating":
        updatedProducts.sort((a, b) => b.rating - a.rating);
        break;

      default:
        break;
    }

    return updatedProducts;
  }, [products, filters, sortBy, selectedCategory]);

  // Pagination
  const lastIndex = currentPage * productsPerPage;
  const firstIndex = lastIndex - productsPerPage;
  const currentProducts = filteredProducts.slice(firstIndex, lastIndex);

  return (
    <div className="plp-container">
      <Breadcrumb />

      <HeroCarousel
        title={selectedCategory || "ALL PRODUCTS"}
        subtitle="Discover Premium Styles for Every Little Trendsetter"
        image="https://images.pexels.com/photos/3662667/pexels-photo-3662667.jpeg"
      />

      <div className="plp-header">
        <div>
          <h2>{selectedCategory || "All Products"}</h2>
          <p>{filteredProducts.length} Products Found</p>
        </div>

        <SortDropdown sortBy={sortBy} setSortBy={setSortBy} />
      </div>

      <div className="plp-content">
        <main className="plp-products">
          {loading ? (
            <div className="loading">Loading Products...</div>
          ) : filteredProducts.length === 0 ? (
            <div className="loading">No products found.</div>
          ) : (
            <>
              <ProductGrid products={currentProducts} />

              <Pagination
                totalProducts={filteredProducts.length}
                productsPerPage={productsPerPage}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
              />
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default ProductListing;

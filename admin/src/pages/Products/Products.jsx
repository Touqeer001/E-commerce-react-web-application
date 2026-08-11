import { Link } from "react-router-dom";
import useProducts from "../../hooks/useProducts";
import PageHeader from "../../components/Layout/PageHeader";
import ProductFilters from "../../components/Products/ProductFilters";
import ProductTable from "../../components/Products/ProductTable";

export default function Products() {
  const {
    products,
    categories,
    search,
    setSearch,
    categoryId,
    setCategoryId,
    remove,
  } = useProducts();
  return (
    <>
      <PageHeader title="Products">
        <Link className="button" to="/products/new">
          + Add product
        </Link>
      </PageHeader>
      <ProductFilters
        search={search}
        onSearch={setSearch}
        categories={categories}
        categoryId={categoryId}
        onCategoryChange={setCategoryId}
      />
      <ProductTable products={products} onDelete={remove} />
    </>
  );
}

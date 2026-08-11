import Table from "../Common/Table";
import ProductRow from "./ProductRow";
import "./Products.css";

const COLUMNS = [
  { key: "image", label: "Image" },
  { key: "name", label: "Product" },
  { key: "category", label: "Category" },
  { key: "price", label: "Price" },
  { key: "stock", label: "Stock" },
  { key: "actions", label: "Actions" },
];

export default function ProductTable({ products, onDelete }) {
  return (
    <Table
      columns={COLUMNS}
      rows={products}
      emptyText="No products found."
      renderRow={(product) => (
        <ProductRow
          key={product.id}
          product={product}
          onDelete={onDelete}
        />
      )}
    />
  );
}

import Table from "../Common/Table";

const COLUMNS = [
  { key: "name", label: "Product" },
  { key: "category", label: "Category" },
  { key: "stock", label: "In stock" },
];

export default function LowStockProducts({ products }) {
  // return <Table title="Low stock products" columns={COLUMNS} rows={products} />;
}

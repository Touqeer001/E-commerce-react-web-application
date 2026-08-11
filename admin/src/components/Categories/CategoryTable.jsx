import Table from "../Common/Table";
import "./Categories.css";

const COLUMNS = [
  { key: "name", label: "Name" },
  { key: "product_count", label: "Products" },
];

export default function CategoryTable({ categories }) {
  return <Table title="All categories" columns={COLUMNS} rows={categories} />;
}

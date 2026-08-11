import Table from "../Common/Table";
import InventoryRow from "./InventoryRow";
import "./Inventory.css";

const COLUMNS = [
  { key: "name", label: "Product" },
  { key: "category", label: "Category" },
  { key: "stock", label: "In stock" },
];

export default function InventoryTable({ items }) {
  return (
    <Table
      title="Stock"
      columns={COLUMNS}
      rows={items}
      renderRow={(item) => <InventoryRow key={item.id} item={item} />}
    />
  );
}

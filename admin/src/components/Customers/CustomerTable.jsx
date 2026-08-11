import Table from "../Common/Table";
import CustomerRow from "./CustomerRow";
import "./Customers.css";

const COLUMNS = [
  { key: "name", label: "Customer" },
  { key: "email", label: "Email" },
  { key: "order_count", label: "Orders" },
  { key: "lifetime_value", label: "Lifetime value" },
];

export default function CustomerTable({ customers }) {
  return (
    <Table
      title="Customer directory"
      columns={COLUMNS}
      rows={customers}
      renderRow={(customer) => (
        <CustomerRow key={customer.id} customer={customer} />
      )}
    />
  );
}

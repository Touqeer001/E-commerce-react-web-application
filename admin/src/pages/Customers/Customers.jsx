import useCustomers from "../../hooks/useCustomers";
import CustomerTable from "../../components/Customers/CustomerTable";

export default function Customers() {
  const { customers } = useCustomers();
  return (
    <>
      <h1>Customers</h1>
      <CustomerTable customers={customers} />
    </>
  );
}

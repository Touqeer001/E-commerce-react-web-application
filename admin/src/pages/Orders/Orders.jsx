import useOrders from "../../hooks/useOrders";
import OrderTable from "../../components/Orders/OrderTable";

export default function Orders() {
  const { orders, update } = useOrders();
  return (
    <>
      <h1>Orders</h1>
      <OrderTable orders={orders} onStatusChange={update} />
    </>
  );
}

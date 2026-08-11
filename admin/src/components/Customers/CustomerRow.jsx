const cell = (value) => value || "—";

export default function CustomerRow({ customer }) {
  return (
    <tr>
      <td>{cell(customer.name)}</td>
      <td>{cell(customer.email)}</td>
      <td>{cell(customer.order_count)}</td>
      <td>{cell(customer.lifetime_value)}</td>
    </tr>
  );
}

const cell = (value) => value || "—";

export default function InventoryRow({ item }) {
  return (
    <tr>
      <td>{cell(item.name)}</td>
      <td>{cell(item.category)}</td>
      <td>{cell(item.stock)}</td>
    </tr>
  );
}

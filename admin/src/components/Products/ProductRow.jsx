import { Link } from "react-router-dom";
import Button from "../Common/Button";

export default function ProductRow({ product, onDelete }) {
  return (
    <tr>
      <td>
        {product.image && (
          <img
            className="thumb"
            src={
              product.image.startsWith("/")
                ? `${import.meta.env.VITE_API_URL}${product.image}`
                : product.image
            }
            alt=""
          />
        )}
      </td>
      <td>{product.name}</td>
      <td>{product.category || "-"}</td>
      <td>Rs. {product.price}</td>
      <td className={product.stock <= 10 ? "low" : ""}>{product.stock}</td>
      <td>
        <Link className="link" to={`/products/${product.id}/edit`}>
          Edit
        </Link>
        <Button variant="danger" onClick={() => onDelete(product.id)}>
          Delete
        </Button>
      </td>
    </tr>
  );
}

import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import PageHeader from "../../components/Layout/PageHeader";
import ProductForm from "../../components/Products/ProductForm";
import {
  createProduct,
  getProduct,
  updateProduct,
} from "../../services/productService";
import { listCategories } from "../../services/categoryService";
import { notifyError } from "../../utils/notify";

export default function ProductEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState();
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    listCategories()
      .then((r) => setCategories(r.data.data))
      .catch(notifyError);
  }, []);

  useEffect(() => {
    if (id)
      getProduct(id)
        .then((r) => setProduct(r.data.data))
        .catch(notifyError);
  }, [id]);

  const save = async (data) => {
    try {
      const body = new FormData();
      Object.entries(data).forEach(
        ([key, value]) => key !== "images" && body.append(key, value ?? ""),
      );
      Array.from(data.images || []).forEach((file) =>
        body.append("images", file),
      );
      id
        ? await updateProduct(id, body)
        : await createProduct(body);
      toast.success("Product saved");
      navigate("/products");
    } catch (e) {
      notifyError(e);
    }
  };

  return (
    <>
      <PageHeader title={id ? "Edit product" : "Add product"}>
        <Link className="link" to="/products">
          Back to products
        </Link>
      </PageHeader>
      <ProductForm
        key={product?.id || "new"}
        product={product}
        categories={categories}
        isEdit={!!id}
        onSubmit={save}
        onCancel={() => navigate("/products")}
      />
    </>
  );
}

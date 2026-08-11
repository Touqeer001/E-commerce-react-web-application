import { useEffect, useState } from "react";
import { listCategories } from "../services/categoryService";
import {
  deleteProduct,
  listProducts,
} from "../services/productService";
import { notifyError, notifySuccess } from "../utils/notify";

export default function useProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState("");

  const load = () =>
    listProducts({ search, categoryId })
      .then((r) => setProducts(r.data.data))
      .catch(notifyError);

  useEffect(() => {
    listCategories()
      .then((r) => setCategories(r.data.data))
      .catch(notifyError);
  }, []);

  useEffect(() => {
    load();
  }, [search, categoryId]);

  const remove = async (id) => {
    if (confirm("Delete this product?"))
      try {
        await deleteProduct(id);
        notifySuccess("Product deleted");
        load();
      } catch (e) {
        notifyError(e);
      }
  };

  return {
    products,
    categories,
    search,
    setSearch,
    categoryId,
    setCategoryId,
    load,
    remove,
  };
}

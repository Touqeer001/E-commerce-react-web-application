import { useEffect, useState } from "react";
import {
  createCategory,
  deleteCategory,
  listCategories,
  updateCategory,
} from "../services/categoryService";
import { notifyError, notifySuccess } from "../utils/notify";

export default function useCategories() {
  const [categories, setCategories] = useState([]);
  const [editing, setEditing] = useState(null);

  const load = () =>
    listCategories()
      .then((r) => setCategories(r.data.data))
      .catch(notifyError);

  useEffect(() => {
    load();
  }, []);

  const save = async (data) => {
    try {
      editing
        ? await updateCategory(editing.id, data)
        : await createCategory(data);
      notifySuccess("Category saved");
      setEditing(null);
      load();
      return true;
    } catch (e) {
      notifyError(e);
      return false;
    }
  };

  const remove = async (id) => {
    if (confirm("Delete this category?"))
      try {
        await deleteCategory(id);
        notifySuccess("Category deleted");
        load();
      } catch (e) {
        notifyError(e);
      }
  };

  return { categories, editing, setEditing, load, save, remove };
}

import useCategories from "../../hooks/useCategories";
import CategoryForm from "../../components/Categories/CategoryForm";
import CategoryTable from "../../components/Categories/CategoryTable";

export default function Categories() {
  const { categories, editing, setEditing, save } = useCategories();
  return (
    <>
      <h1>Categories</h1>
      <div className="grid">
        <CategoryForm
          editing={editing}
          onCancel={() => setEditing(null)}
          onSubmit={save}
        />
        <CategoryTable categories={categories} />
      </div>
    </>
  );
}

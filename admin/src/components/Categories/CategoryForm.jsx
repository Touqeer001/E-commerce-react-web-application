import { useForm } from "react-hook-form";
import Button from "../Common/Button";

export default function CategoryForm({ editing, onCancel, onSubmit }) {
  const { register, handleSubmit, reset } = useForm();
  const submit = async (data) => {
    if (await onSubmit(data)) reset();
  };
  return (
    <article className="panel">
      <h2>{editing ? "Edit category" : "Add category"}</h2>
      <form className="form" onSubmit={handleSubmit(submit)}>
        <input
          placeholder="Category name"
          {...register("name", { required: true })}
        />
        <input placeholder="Image URL (optional)" {...register("image")} />
        <Button type="submit">Save category</Button>
        {editing && (
          <Button
            type="button"
            variant="secondary"
            onClick={() => {
              onCancel?.();
              reset();
            }}
          >
            Cancel
          </Button>
        )}
      </form>
    </article>
  );
}

import { useForm } from "react-hook-form";
import Button from "../Common/Button";

export default function ProductForm({
  product,
  categories,
  isEdit,
  onSubmit,
  onCancel,
}) {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm({ defaultValues: product || { price: 0, stock: 0 } });
  return (
    <article className="panel editor">
      <form className="form" onSubmit={handleSubmit(onSubmit)}>
        <label>
          Name
          <input
            placeholder="Product name"
            {...register("name", { required: true })}
          />
        </label>
        <label>
          Description
          <textarea
            placeholder="Product description"
            {...register("description")}
          />
        </label>
        <div className="two">
          <label>
            Price
            <input
              type="number"
              min="0"
              step="0.01"
              {...register("price", { required: true })}
            />
          </label>
          <label>
            Stock
            <input
              type="number"
              min="0"
              {...register("stock", { required: true })}
            />
          </label>
        </div>
        <label>
          Category
          <select {...register("category_id")}>
            <option value="">No category</option>
            {categories.map((x) => (
              <option key={x.id} value={x.id}>
                {x.name}
              </option>
            ))}
          </select>
        </label>
        <div className="two">
          <label>
            Sub category
            <input {...register("sub_category")} />
          </label>
          <label>
            Age group
            <input {...register("age_group")} />
          </label>
        </div>
        {isEdit && (
          <label className="check">
            <input type="checkbox" {...register("replaceImages")} /> Replace
            existing images
          </label>
        )}
        <label>
          Product images (up to 6)
          <input
            type="file"
            accept="image/*"
            multiple
            {...register("images")}
          />
        </label>
        <div>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save product"}
          </Button>
          <Button type="button" variant="secondary" className="gap" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </form>
    </article>
  );
}

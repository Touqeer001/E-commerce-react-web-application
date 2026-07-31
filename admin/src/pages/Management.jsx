import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../services/api";
import { Table } from "./Dashboard";
import "./styles/Management.css";

const error = (e) => toast.error(e.response?.data?.message || "Request failed");
const ORDER_STATUSES = ["Pending", "Confirmed", "Packed", "Shipped", "Delivered", "Cancelled"];
const loadCategories = (setRows) =>
  api
    .get("/categories")
    .then((r) => setRows(r.data.data))
    .catch(error);

export function Categories() {
  const [rows, setRows] = useState([]),
    [editing, setEditing] = useState(null);
  const { register, handleSubmit, reset } = useForm();
  const load = () => loadCategories(setRows);
  useEffect(() => {
    load();
  }, []);
  const save = async (data) => {
    try {
      editing
        ? await api.put(`/categories/${editing.id}`, data)
        : await api.post("/categories", data);
      toast.success("Category saved");
      setEditing(null);
      reset();
      load();
    } catch (e) {
      error(e);
    }
  };
  const remove = async (id) => {
    if (confirm("Delete this category?"))
      try {
        await api.delete(`/categories/${id}`);
        toast.success("Category deleted");
        load();
      } catch (e) {
        error(e);
      }
  };
  return (
    <>
      <h1>Categories</h1>
      <div className="grid">
        <article className="panel">
          <h2>{editing ? "Edit category" : "Add category"}</h2>
          <form className="form" onSubmit={handleSubmit(save)}>
            <input
              placeholder="Category name"
              {...register("name", { required: true })}
            />
            <input placeholder="Image URL (optional)" {...register("image")} />
            <button>Save category</button>
            {editing && (
              <button
                className="secondary"
                type="button"
                onClick={() => {
                  setEditing(null);
                  reset();
                }}
              >
                Cancel
              </button>
            )}
          </form>
        </article>
        <Table
          title="All categories"
          rows={rows}
          cols={[
            ["name", "Name"],
            ["product_count", "Products"],
          ]}
        />
      </div>
    </>
  );
}

export function Products() {
  const [rows, setRows] = useState([]),
    [categories, setCategories] = useState([]),
    [search, setSearch] = useState(""),
    [categoryId, setCategoryId] = useState("");
  const load = () =>
    api
      .get("/products", { params: { search, categoryId } })
      .then((r) => setRows(r.data.data))
      .catch(error);
  useEffect(() => {
    loadCategories(setCategories);
  }, []);
  useEffect(() => {
    load();
  }, [search, categoryId]);
  const remove = async (id) => {
    if (confirm("Delete this product?"))
      try {
        await api.delete(`/products/${id}`);
        toast.success("Product deleted");
        load();
      } catch (e) {
        error(e);
      }
  };
  return (
    <>
      <div className="pagehead">
        <h1>Products</h1>
        <Link className="button" to="/products/new">
          + Add product
        </Link>
      </div>
      <div className="toolbar">
        <input
          placeholder="Search products"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
        >
          <option value="">All categories</option>
          {categories.map((x) => (
            <option key={x.id} value={x.id}>
              {x.name}
            </option>
          ))}
        </select>
      </div>
      <article className="panel">
        <div className="table">
          <table>
            <thead>
              <tr>
                <th>Image</th>
                <th>Product</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.length ? (
                rows.map((row) => (
                  <tr key={row.id}>
                    <td>
                      {row.image && (
                        <img
                          className="thumb"
                          src={
                            row.image.startsWith("/")
                              ? `http://localhost:5000${row.image}`
                              : row.image
                          }
                          alt=""
                        />
                      )}
                    </td>
                    <td>{row.name}</td>
                    <td>{row.category || "-"}</td>
                    <td>Rs. {row.price}</td>
                    <td className={row.stock <= 10 ? "low" : ""}>
                      {row.stock}
                    </td>
                    <td>
                      <Link className="link" to={`/products/${row.id}/edit`}>
                        Edit
                      </Link>
                      <button
                        className="link danger"
                        onClick={() => remove(row.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6">No products found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </article>
    </>
  );
}

export function ProductEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm({ defaultValues: { price: 0, stock: 0 } });
  useEffect(() => {
    loadCategories(setCategories);
    if (id)
      api
        .get(`/products/${id}`)
        .then((r) => reset(r.data.data))
        .catch(error);
  }, [id, reset]);
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
        ? await api.put(`/products/${id}`, body)
        : await api.post("/products", body);
      toast.success("Product saved");
      navigate("/products");
    } catch (e) {
      error(e);
    }
  };
  return (
    <>
      <div className="pagehead">
        <h1>{id ? "Edit product" : "Add product"}</h1>
        <Link className="link" to="/products">
          Back to products
        </Link>
      </div>
      <article className="panel editor">
        <form className="form" onSubmit={handleSubmit(save)}>
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
          {id && (
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
            <button disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save product"}
            </button>
            <button
              type="button"
              className="secondary gap"
              onClick={() => navigate("/products")}
            >
              Cancel
            </button>
          </div>
        </form>
      </article>
    </>
  );
}

export function Orders() {
  const [rows, setRows] = useState([]);
  const load = () =>
    api
      .get("/orders")
      .then((r) => setRows(r.data.data))
      .catch(error);
  useEffect(() => {
    load();
  }, []);
  const update = async (id, status) => {
    try {
      await api.patch(`/orders/${id}/status`, { status });
      toast.success("Order updated");
      load();
    } catch (e) {
      error(e);
    }
  };
  return (
    <>
      <h1>Orders</h1>
      <Table
        title="Orders"
        rows={rows}
        cols={[
          ["id", "Order"],
          ["customer_name", "Customer"],
          ["total", "Total"],
          [
            "order_status",
            "Status",
            (row) => (
              <select
                className="order-status-select"
                aria-label={`Update status for order ${row.id}`}
                value={row.order_status || "Pending"}
                onChange={(event) => update(row.id, event.target.value)}
              >
                {ORDER_STATUSES.map((status) => <option key={status} value={status}>{status}</option>)}
              </select>
            ),
          ],
        ]}
      />
    </>
  );
}
export function Customers() {
  const [rows, setRows] = useState([]);
  useEffect(() => {
    api
      .get("/customers")
      .then((r) => setRows(r.data.data))
      .catch(error);
  }, []);
  return (
    <>
      <h1>Customers</h1>
      <Table
        title="Customer directory"
        rows={rows}
        cols={[
          ["name", "Customer"],
          ["email", "Email"],
          ["order_count", "Orders"],
          ["lifetime_value", "Lifetime value"],
        ]}
      />
    </>
  );
}
export function Inventory() {
  const [rows, setRows] = useState([]);
  const load = () =>
    api
      .get("/products")
      .then((r) => setRows(r.data.data))
      .catch(error);
  useEffect(() => {
    load();
  }, []);
  return (
    <>
      <h1>Inventory</h1>
      <Table
        title="Stock"
        rows={rows}
        cols={[
          ["name", "Product"],
          ["category", "Category"],
          ["stock", "In stock"],
        ]}
      />
    </>
  );
}
export function Profile() {
  const { register, handleSubmit, reset } = useForm();
  const save = async (data) => {
    try {
      await api.put("/auth/password", data);
      toast.success("Password updated");
      reset();
    } catch (e) {
      error(e);
    }
  };
  return (
    <>
      <h1>Profile</h1>
      <article className="panel editor">
        <h2>Change password</h2>
        <form className="form" onSubmit={handleSubmit(save)}>
          <input
            type="password"
            placeholder="Current password"
            {...register("currentPassword", { required: true })}
          />
          <input
            type="password"
            placeholder="New password (minimum 8 characters)"
            {...register("newPassword", { required: true, minLength: 8 })}
          />
          <button>Update password</button>
        </form>
      </article>
    </>
  );
}
export function Settings() {
  return (
    <>
      <h1>Settings</h1>
      <article className="panel">
        <h2>Permissions</h2>
        <p>
          Editors can maintain products, inventory and orders. Admins also
          manage categories. Only Super Admins can delete categories.
        </p>
      </article>
    </>
  );
}

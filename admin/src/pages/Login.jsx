import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAdminAuth } from "../context/AdminAuthContext";
import Button from "../components/Common/Button";
export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();
  const { login } = useAdminAuth();
  const navigate = useNavigate();
  const submit = async (values) => {
    try {
      await login(values);
      navigate("/");
    } catch (e) {
      toast.error(e.response?.data?.message || "Unable to sign in");
    }
  };
  return (
    <div className="login">
      <form onSubmit={handleSubmit(submit)}>
        <h1>Admin sign in</h1>
        <p>Manage your store securely.</p>
        <label>
          Email
          <input
            autoFocus
            type="email"
            {...register("email", { required: "Email is required" })}
          />
          {errors.email && <i>{errors.email.message}</i>}
        </label>
        <label>
          Password
          <input
            type="password"
            {...register("password", { required: "Password is required" })}
          />
          {errors.password && <i>{errors.password.message}</i>}
        </label>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Signing in…" : "Sign in"}
        </Button>
      </form>
    </div>
  );
}

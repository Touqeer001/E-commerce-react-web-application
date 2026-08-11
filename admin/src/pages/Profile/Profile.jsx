import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import api from "../../services/api";
import Card from "../../components/Common/Card";
import Button from "../../components/Common/Button";
import { notifyError } from "../../utils/notify";

export default function Profile() {
  const { register, handleSubmit, reset } = useForm();
  const save = async (data) => {
    try {
      await api.put("/auth/password", data);
      toast.success("Password updated");
      reset();
    } catch (e) {
      notifyError(e);
    }
  };
  return (
    <>
      <h1>Profile</h1>
      <Card className="panel editor" title="Change password">
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
          <Button type="submit">Update password</Button>
        </form>
      </Card>
    </>
  );
}

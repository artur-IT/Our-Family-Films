import { useRouter } from "next/navigation";
import styles from "./PanelLogin.module.css";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";

export const PanelLogin = () => {
  const router = useRouter();
  const { register, handleSubmit } = useForm();

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    // console.log("Login attempt with:", data);
    if (data.username === "ad") {
      document.cookie = "auth=true; path=/";
      router.push("/admin");
    }
  };

  return (
    <div className={styles.loginPanel}>
      <h2>Login</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.formGroup}>
          <label htmlFor="username">Username:</label>
          <input type="text" id="username" {...register("username", { required: true })} />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="password">Password:</label>
          <input type="password" id="password" {...register("password", { required: true })} />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

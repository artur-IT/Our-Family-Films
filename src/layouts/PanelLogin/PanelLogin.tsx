import { useRouter } from "next/navigation";
import styles from "./PanelLogin.module.css";
import { FieldValues, set, SubmitHandler, useForm } from "react-hook-form";
import { useLoginState } from "@/context/LoginStateContext";
import { useEditMode } from "@/context/EditMovieContext";

export const PanelLogin = () => {
  const { checkUser } = useEditMode();
  const router = useRouter();
  const { isLoggedIn, setIsLoggedIn } = useLoginState();
  const { register, handleSubmit } = useForm();

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    // console.log("Login attempt with:", data);
    if (data.username === "ad") {
      document.cookie = "auth=true; path=/";
      router.push("/admin");
      setIsLoggedIn(!isLoggedIn);
      checkUser(data.username);
    }

    if (data.username === "us") {
      document.cookie = "auth=true; path=/";
      router.push("/user");
      setIsLoggedIn(!isLoggedIn);
      checkUser(data.username);
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

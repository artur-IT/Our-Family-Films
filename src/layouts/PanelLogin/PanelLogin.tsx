import { useRouter } from "next/navigation";
import styles from "./PanelLogin.module.css";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { useLoginState } from "@/context/LoginStateContext";
import { useEditMode } from "@/context/EditMovieContext";

interface User {
  username: string;
  password: string;
}
export const PanelLogin = () => {
  const { checkUser } = useEditMode();
  const router = useRouter();
  const { isLoggedIn, setIsLoggedIn, users } = useLoginState();
  const { register, handleSubmit } = useForm();

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    const foundUser = users.find((user: User) => user.username === data.username && user.password === data.password);

    if (foundUser) {
      setIsLoggedIn(!isLoggedIn);
      checkUser(foundUser.username);
      document.cookie = "auth=true; path=/";

      if (foundUser.username === "ar") {
        await router.push("/admin");
      } else {
        await router.push("/user");
      }
    } else {
      alert("Nieprawidłowe dane logowania!");
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

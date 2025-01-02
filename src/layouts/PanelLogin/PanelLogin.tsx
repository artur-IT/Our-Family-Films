import { useRouter } from "next/navigation";
import styles from "./PanelLogin.module.css";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { useLoginState } from "@/context/LoginStateContext";
import { useEditMode } from "@/context/EditMovieContext";
import { useContext } from "react";

export const PanelLogin = () => {
  const { checkUser } = useEditMode();
  const router = useRouter();
  const { isLoggedIn, setIsLoggedIn, users } = useLoginState();
  const { register, handleSubmit } = useForm();

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    // console.log("Users from PanelLogin: ", users);
    const foundUser = users.find(
      (user: { username: string; password: string }) => user.username === data.username && user.password === data.password
    );

    if (foundUser) {
      document.cookie = "auth=true; path=/";

      if (foundUser.username === "ar") {
        router.push("/admin");
      } else {
        router.push("/user");
      }

      setIsLoggedIn(!isLoggedIn);
      checkUser(foundUser.username);
    } else {
      alert("Nieprawidłowe dane logowania!");
    }

    // if (data.username === "ad") {
    //   document.cookie = "auth=true; path=/";
    //   router.push("/admin");
    //   setIsLoggedIn(!isLoggedIn);
    //   checkUser(data.username);
    // }

    // if (data.username === "us") {
    //   document.cookie = "auth=true; path=/";
    //   router.push("/user");
    //   setIsLoggedIn(!isLoggedIn);
    //   checkUser(data.username);
    // }
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

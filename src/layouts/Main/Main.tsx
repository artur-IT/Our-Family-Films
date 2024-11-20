import style from "./Main.module.css";

export const Main = ({ children }: { children: React.ReactNode }) => {
  return <div className={style.main}>{children}</div>;
};

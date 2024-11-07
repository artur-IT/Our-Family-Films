import style from "./Main.module.css";

interface MainProps {
  children: React.ReactNode;
}

export const Main: React.FC<MainProps> = ({ children }) => {
  return (
    <div className={style.main}>
      <p>Main</p>
      {children}
    </div>
  );
};

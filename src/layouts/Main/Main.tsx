interface MainProps {
  children: React.ReactNode;
}

export const Main: React.FC<MainProps> = ({ children }) => {
  return (
    <div>
      <h1>Main</h1>
      {children}
    </div>
  );
};

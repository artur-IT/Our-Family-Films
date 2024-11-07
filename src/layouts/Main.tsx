interface MainProps {
  children: React.ReactNode;
}

export const Main: React.FC<MainProps> = ({ children }) => {
  console.log("z Maina: " + children);
  return (
    <div>
      <h1>Main</h1>
    </div>
  );
};

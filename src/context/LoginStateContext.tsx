import { createContext, useContext, useState } from "react";

// Login state context -if user is logged in or not
const LoginStateContext = createContext({
  isLoggedIn: false,
  setIsLoggedIn: (value: boolean) => {},
});

export const LoginProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return <LoginStateContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>{children}</LoginStateContext.Provider>;
};

export const useLoginState = () => useContext(LoginStateContext);

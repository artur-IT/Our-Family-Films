import { Header } from "./layouts/Header/Header";
import { Main } from "./layouts/Main/Main";
import { Shelf } from "./components/Shelf/Shelf";
import { Footer } from "./layouts/Footer/Footer";

import { useState } from "react";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <>
      <Header onLogin={() => setIsLoggedIn(!isLoggedIn)} />
      <Main>
        <Shelf isLoggedIn={isLoggedIn} />
      </Main>
      <Footer />
    </>
  );
}

export default App;

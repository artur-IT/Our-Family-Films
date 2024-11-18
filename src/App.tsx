import { Header } from "./layouts/Header/Header";
import { Main } from "./layouts/Main/Main";
import { Shelf } from "./components/Shelf/Shelf";
import { Footer } from "./layouts/Footer/Footer";

import { useEffect, useState } from "react";
// import { PanelLogin } from "./layouts/PanelLogin/PanelLogin";
// import { MovieEdit } from "./components/MovieEdit/MovieEdit";
import MovieAdd from "./components/MovieAdd/MovieAdd";
// import connectToDatabase from "../src/api/dbConnection.js";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  // get articles from MongoDB
  // const getPosts = () => {
  //   return (
  //     fetch("http://localhost:3000/api/getArticles")
  //       .then((response) => {
  //         // console.log(response);
  //         return response.json();
  //       })
  //       .catch((error) => console.error("Błąd:", error))
  //   );
  // };
  // useEffect(() => {
  //   getPosts();
  // }, []);

  return (
    <>
      <Header onLogin={() => setIsLoggedIn(!isLoggedIn)} />
      <Main>
        <Shelf isLoggedIn={isLoggedIn} />
        {/* {isLoggedIn && <PanelLogin />} */}
        {isLoggedIn && <MovieAdd setLoginIn={setIsLoggedIn} />}
      </Main>
      <Footer />
    </>
  );
}

export default App;

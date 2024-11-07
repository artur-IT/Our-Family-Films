import { Footer } from "./components/Footer/Footer";
import { Shelf } from "./components/Shelf/Shelf";
import { Header } from "./layouts/Header/Header";
import { Main } from "./layouts/Main/Main";

function App() {
  return (
    <>
      <h1>Typescript + React</h1>
      <Header />
      <Main>
        <Shelf></Shelf>
      </Main>
      <Footer />
    </>
  );
}

export default App;

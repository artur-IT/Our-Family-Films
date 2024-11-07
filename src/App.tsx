import { Footer } from "./components/Footer";
import { Shelf } from "./components/Shelf";
import { Header } from "./layouts/Header";
import { Main } from "./layouts/Main";

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

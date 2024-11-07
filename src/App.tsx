import { Footer } from "./layouts/Footer/Footer";
import { Shelf } from "./components/Shelf/Shelf";
import { Header } from "./layouts/Header/Header";
import { Main } from "./layouts/Main/Main";

function App() {
  return (
    <>
      <Header />
      <Main>
        <Shelf></Shelf>
      </Main>
      <Footer />
    </>
  );
}

export default App;

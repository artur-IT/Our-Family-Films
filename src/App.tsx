import { Footer } from "./layouts/Footer/Footer";
import { Shelf } from "./components/Shelf/Shelf";
import { Header } from "./layouts/Header/Header";
import { Main } from "./layouts/Main/Main";
import { PanelAdmin } from "./layouts/PanelAdmin/PanelAdmin";

function App() {
  return (
    <>
      <Header />
      <Main>
        <Shelf />
        <PanelAdmin />
      </Main>
      <Footer />
    </>
  );
}

export default App;

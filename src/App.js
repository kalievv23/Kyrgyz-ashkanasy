import { useState } from "react";
import "./App.css";
import Modal from "./components/basket/Modal";
import Header from "./components/layout/Header";
import Main from "./components/layout/Main";
import BaskedFood from "./components/basket/BaskedFood";
import TotalAmount from "./components/basket/TotalAmount";
import { OrderProvider } from "./components/store/OrderBusket";
import Forma from "./components/form/Forma";

function App() {
    <span>commit - 3</span>
  const [state, setState] = useState(false);
  const openModalHAndle = () => {
    setState(true);
  };
  const closeModalHAndle = () => {
    setState(false);
  };

  const body = document.querySelector("body");
  if (state) {
    body.style.overflow = "hidden";
  } else {
    body.style.overflow = "auto";
  }

  const [form, setForm] = useState(false)

  return (
    <div className="App">
      <OrderProvider>
          <Header openBusket={openModalHAndle} />
          <Main />
          {state && (
            <Modal top="150px" left="380px" onclose={closeModalHAndle}>
              {!form && <BaskedFood />}
              {!form && <TotalAmount setState={setState} onclose={closeModalHAndle} />}
              {form && <Forma />}
            </Modal>
          )}
      </OrderProvider>
    </div>
  );
}

export default App;

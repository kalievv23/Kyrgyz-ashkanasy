import { createContext, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const OrderBusketContext = createContext({});

export const OrderProvider = ({ children }) => {
  const [items, setItems] = useState([]);

  const [transitionBusket, setTransitionBusket] = useState(false);

  const busketAnimation = (typeAnimation) => {
    setTransitionBusket(typeAnimation);
    setTimeout(() => {
      setTransitionBusket(false);
    }, 300);
  };

  const [buttonDisabled, setButtonDisabled] = useState(false);

  const saveNewData = (data) => {
    const find = items.find((el) => {
      return el.id === data.id;
    });
    if (!find) {
      setItems((prevItems) => [...prevItems, data]);
      showToast({
        type: "success",
        text: <h3>{`${data.amount} ${data.title} to basket!`}</h3>,
        positionToast: "bottom-left",
        typeAnimation: "success",
        isLoading: false,
      });
      return;
    }
    if (find) {
      const newData = items.map((el) => {
        if (el.id === data.id) {
          el.amount + data.amount <= 10
            ? (el.amount = el.amount + data.amount) &&
              showToast({
                type: "success",
                text: (
                  <h3>{`${data.amount} ${data.title} added to basket!`}</h3>
                ),
                positionToast: "bottom-left",
                typeAnimation: "success",
                isLoading: false,
              })
            : showToast({
                type: "error",
                text: <h4>{"Max orders: " + `10 ${el.title}!`}</h4>,
                typeAnimation: "error",
                isLoading: true,
              });
        }
        return el;
      });
      setItems(newData);
    }
  };

  /////////////////////  MODAL ARE YOU SURE  ///////////////////

  const [modalAreYouSure, setModalAreYouSure] = useState({
    item: {},
    isLoading: false,
  });

  ///////////////////     COUNTER IN BASKET     /////////////////

  const counterPlus = (data_id) => {
    setItems((prevItems) => {
      return prevItems.map((item) => {
        if (item.id === data_id) {
          return {
            ...item,
            amount:
              item.amount < 10
                ? item.amount + 1
                : showToast({
                    type: "error",
                    text: (
                      <h4>
                        {"Max orders: " + `${item.amount} ${item.title}!`}
                      </h4>
                    ),
                  }) || item.amount,
          };
        } else {
          return item;
        }
      });
    });
  };

  const counterMinus = (data_id) => {
    setItems((prevItems) => {
      return prevItems.map((item) => {
        if (item.id === data_id) {
          if (item.amount != 1)
            showToast({
              type: "success",
              text: <h3> {`${item.title} deleted from basket!`} </h3>,
              positionToast: "bottom-left",
            });
          return {
            ...item,
            amount:
              item.amount > 1
                ? item.amount - 1
                : setModalAreYouSure({
                    item: item,
                    isLoading: true,
                  }) || item.amount,
          };
        } else {
          return item;
        }
      });
    });
  };

  const [positionToastt, setPositionToast] = useState({
    position: "",
    hideProgressBar: undefined,
  });

  console.log(buttonDisabled);

  const showToast = ({
    type,
    text,
    positionToast,
    hideProgressBar,
    typeAnimation,
    isLoading,
  }) => {
    setButtonDisabled(isLoading);
    busketAnimation(typeAnimation);
    setPositionToast({
      position: positionToast,
      hideProgressBar,
    });
    switch (type) {
      case "success":
        toast.success(text);
        break;
      case "error":
        toast.error(text);
        break;
      default:
        toast(text);
        break;
    }
  };

  const basket = {
    items: items,
    setItems,
    saveNewData,
    counterPlus,
    counterMinus,
    modalAreYouSure,
    setModalAreYouSure,
    showToast,
    transitionBusket,
    setTransitionBusket,
    buttonDisabled,
  };

  return (
    <OrderBusketContext.Provider value={basket}>
      {children}
      <ToastContainer
        position={positionToastt.position || "top-center"}
        autoClose={500}
        hideProgressBar={
          positionToastt.hideProgressBar === "yes" ? false : true
        }
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss={true}
        draggable
        pauseOnHover={true}
      />
    </OrderBusketContext.Provider>
  );
};

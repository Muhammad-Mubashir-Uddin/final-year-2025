import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [alertMessage, setAlertMessage] = useState("");

  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  // Auto-dismiss alert after 2.5 seconds
  useEffect(() => {
    if (alertMessage) {
      const timer = setTimeout(() => setAlertMessage("") , 2500);
      return () => clearTimeout(timer);
    }
  }, [alertMessage]);

  const addToCart = (item) => {
    setCartItems((prev) => {
      const existing = prev.find((i) => i.menuItemId === item.menuItemId);
      if (existing) {
        setAlertMessage(`${item.name} quantity increased in cart!`);
        return prev.map((i) =>
          i.menuItemId === item.menuItemId
            ? { ...i, quantity: i.quantity + 1 }
            : i 
        );
      }
      setAlertMessage(`${item.name} added to cart!`);
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const updateQuantity = (menuItemId, quantity) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.menuItemId === menuItemId
          ? { ...item, quantity: Math.max(1, quantity) }
          : item
      )
    );
  };

  const removeFromCart = (menuItemId) => {
    setCartItems((prev) =>
      prev.filter((item) => item.menuItemId !== menuItemId)
    );
  };

  const clearCart = () => setCartItems([]);

  // For badge
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  // For alert/notification
  const clearAlert = () => setAlertMessage("");

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        cartCount,
        alertMessage,
        clearAlert,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

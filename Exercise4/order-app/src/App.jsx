import React, { useState } from 'react';
import ProductList from './components/ProductList';
import Cart from './components/Cart';

const App = () => {
  const [cart, setCart] = useState([]);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderHistory, setOrderHistory] = useState([]);

  const handleAddToCart = (product) => {
    setCart((prevCart) => {
      const existingProductIndex = prevCart.findIndex(
        (item) => item.product._id === product._id
      );

      if (existingProductIndex !== -1) {
        const updatedCart = [...prevCart];
        updatedCart[existingProductIndex].quantity += 0.5;
        return updatedCart;
      } else {
        return [...prevCart, { product, quantity: 1 }];
      }
    });
  };

  const handlePlaceOrder = () => {
    const orderDetails = {
      items: cart,
      totalAmount: cart.reduce(
        (total, item) => total + item.quantity * item.product.price,
        0
      ).toFixed(2),
      date: new Date().toLocaleString(),
    };

    setOrderHistory([...orderHistory, orderDetails]);

    setOrderPlaced(true);
    setCart([]);
  };

  const handleResetOrder = () => {
    setOrderPlaced(false);
  };

  return (
    <div className="App">
      <ProductList onAddToCart={handleAddToCart} cart={cart} setCart={setCart} />

      {orderPlaced ? (
        <div>
          <h2>Twoje zamówienie zostało złożone!</h2>
          <button onClick={handleResetOrder}>Powróć do sklepu</button>
        </div>
      ) : (
        <Cart cart={cart} setCart={setCart} onPlaceOrder={handlePlaceOrder} />
      )}

      <h2>Twoje zamówienia</h2>
      {orderHistory.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Data zamówienia</th>
              <th>Łączna wartość</th>
              <th>Produkty</th>
            </tr>
          </thead>
          <tbody>
            {orderHistory.map((order, index) => (
              <tr key={index}>
                <td>{order.date}</td>
                <td>{order.totalAmount} zł</td>
                <td>
                  <ul>
                    {order.items.map((item) => (
                      <li key={item.product._id}>
                        {item.product.name} - {item.quantity} szt.
                      </li>
                    ))}
                  </ul>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>Brak zamówień.</p>
      )}
    </div>
  );
};

export default App;

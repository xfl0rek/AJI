import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductList from '../components/ProductList';
import Cart from '../components/Cart';

const MainPage = ({ onLogout }) => {
  const [cart, setCart] = useState([]);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderHistory, setOrderHistory] = useState([]);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const token = localStorage.getItem('token');
      console.log(token);
      if (!token) {
        onLogout();
        return;
      }

      try {
        const response = await axios.get('http://localhost:5000/api/products', {
          headers: {'Authorization': `Bearer ${token}`}
        });
        setProducts(response.data);
      } catch (error) {
        console.error('Błąd przy pobieraniu produktów', error);
        if (error.response && error.response.status === 401) {
          onLogout();
        }
      }
    };

    fetchProducts();
  }, [onLogout]);

  const handleAddToCart = (product) => {
    setCart((prevCart) => {
      const existingProductIndex = prevCart.findIndex(
        (item) => item.product._id === product._id
      );

      if (existingProductIndex !== -1) {
        const updatedCart = [...prevCart];
        updatedCart[existingProductIndex].quantity += 1;
        return updatedCart;
      } else {
        return [...prevCart, { product, quantity: 1 }];
      }
    });
  };

  const handlePlaceOrder = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      onLogout();
      return;
    }

    const orderDetails = {
      items: cart,
      totalAmount: cart.reduce(
        (total, item) => total + item.quantity * item.product.price,
        0
      ).toFixed(2),
    };

    try {
      const response = await axios.post('http://localhost:5000/api/orders', orderDetails, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.status === 201) {
        setOrderPlaced(true);
        setCart([]);
      }
    } catch (error) {
      console.error('Błąd przy składaniu zamówienia', error);
      if (error.response && error.response.status === 401) {
        onLogout(); // Przekieruj do strony logowania, jeśli token jest nieautoryzowany
      }
    }
  };

  return (
    <div className="MainPage">
      <header>
        <h1>Sklep Internetowy</h1>
        <button onClick={onLogout}>Wyloguj się</button>
      </header>
      <ProductList onAddToCart={handleAddToCart} cart={cart} setCart={setCart} />

      {orderPlaced ? (
        <div>
          <h2>Twoje zamówienie zostało złożone!</h2>
          <button onClick={() => setOrderPlaced(false)}>Powróć do sklepu</button>
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

export default MainPage;

import { useState, useEffect } from 'react';
import axios from 'axios';
import ProductList from '../components/ProductList';
import Cart from '../components/Cart';
import { createOrder, getOrders } from '../api';

const MainPage = ({ onLogout }) => {
  const [cart, setCart] = useState([]);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderHistory, setOrderHistory] = useState([]);
  const [products, setProducts] = useState([]);
  const [userRole, setUserRole] = useState(null);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUserRole = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        onLogout();
        return;
      }

      const username = localStorage.getItem('login');
      if (!username) {
        onLogout();
        return;
      }

      try {
        const response = await axios.get(`http://localhost:5000/api/users/${username}`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        const role = response.data.role;
        setUserRole(role);
        setUserData(response.data);
      } catch (error) {
        console.error('Błąd przy pobieraniu danych użytkownika:', error);
        if (error.response && error.response.status === 401) {
          onLogout();
        }
      }
    };

    fetchUserRole();
  }, [onLogout]);

  useEffect(() => {
    const fetchProducts = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        onLogout();
        return;
      }

      try {
        const response = await axios.get('http://localhost:5000/api/products', {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        setProducts(response.data);
      } catch (error) {
        console.error('Błąd przy pobieraniu produktów:', error);
        if (error.response && error.response.status === 401) {
          onLogout();
        }
      }
    };

    fetchProducts();
  }, [onLogout]);

  useEffect(() => {
    const fetchOrderHistory = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        onLogout();
        return;
      }

      try {
        const orders = await getOrders(token);
        setOrderHistory(orders);
      } catch (error) {
        console.error('Błąd przy pobieraniu historii zamówień:', error);
        alert('Nie udało się pobrać historii zamówień.');
      }
    };

    fetchOrderHistory();
  }, [onLogout, orderPlaced]);

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

  const handlePlaceOrder = async (userData) => {
    const token = localStorage.getItem('token');
    if (!token) {
      onLogout();
      return;
    }

    const orderDetails = {
      ...userData,
      status: "UNCONFIRMED",
      items: cart.map((item) => ({
        product: item.product._id,
        quantity: item.quantity,
      })),
    };

    try {
      await createOrder(orderDetails, token);
      alert('Zamówienie zostało złożone');
      setCart([]);
      setOrderPlaced(true);
    } catch (error) {
      console.error('Błąd przy składaniu zamówienia:', error);
      alert('Nie udało się złożyć zamówienia.');
    }
  };

  if (userRole === null) {
    return <div>Ładowanie...</div>;
  }

  return (
      <div className="MainPage">
        <header>
          <h1>Sklep Internetowy</h1>
          <button onClick={onLogout}>Wyloguj się</button>
        </header>

        {userRole === 'KLIENT' ? (
            <>
              <ProductList onAddToCart={handleAddToCart} cart={cart} setCart={setCart} />
              {orderPlaced ? (
                  <div>
                    <h2>Twoje zamówienie zostało złożone!</h2>
                    <button onClick={() => setOrderPlaced(false)}>Powróć do sklepu</button>
                  </div>
              ) : (
                  <Cart cart={cart} setCart={setCart} onPlaceOrder={handlePlaceOrder} />
              )}
            </>
        ) : userRole === 'PRACOWNIK' ? (
            <div>
              <h2>Panel Pracownika</h2>
              <h3>Lista użytkowników:</h3>
              <ul>
                {orderHistory.map((order, index) => (
                    <li key={index}>
                      Zamówienie: {order._id} - {order.totalAmount} zł
                    </li>
                ))}
              </ul>
            </div>
        ) : (
            <div>Brak uprawnień.</div>
        )}
      </div>
  );
};

export default MainPage;

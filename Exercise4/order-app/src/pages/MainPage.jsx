import { useState, useEffect } from 'react';
import axios from 'axios';
import ProductList from '../components/ProductList';
import Cart from '../components/Cart';
import { createOrder, updateProduct } from '../api';
import OrderList from "../components/OrderList.jsx";
import { Navigate, useNavigate } from 'react-router-dom';
import ClientOrderList from "../components/ClientOrderList.jsx";

const MainPage = ({ onLogout }) => {
  const [cart, setCart] = useState([]);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderHistory, setOrderHistory] = useState([]);
  const [products, setProducts] = useState([]);
  const [userRole, setUserRole] = useState(null);
  const [userData, setUserData] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  
  // Użycie hooka useNavigate do nawigacji w obrębie strony
  const navigate = useNavigate();

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

  const handleEditProduct = (product) => {
    setEditingProduct(product);
  };

  const handleSaveProduct = async (product) => {
    const token = localStorage.getItem('token');
    if (!token) {
      onLogout();
      return;
    }

    try {
      await updateProduct(product._id, product, token);
      setProducts((prevProducts) =>
        prevProducts.map((p) => (p._id === product._id ? product : p))
      );
      setEditingProduct(null);
    } catch (error) {
      console.error('Błąd przy zapisywaniu produktu:', error);
      alert('Nie udało się zapisać produktu.');
    }
  };

  if (userRole === null) {
    return <div>Ładowanie...</div>;
  }

  if (!localStorage.getItem('token')) {
    return <Navigate to="/" />;
  }

  return (
    <div className="MainPage">
      <header>
        <h1>Sklep Internetowy</h1>
        <button onClick={onLogout}>Wyloguj się</button>
      </header>

      {userRole === 'KLIENT' ? (
        <>
          <ProductList
            onAddToCart={handleAddToCart}
            cart={cart}
            setCart={setCart}
            isEditable={false}
          />
          {orderPlaced ? (
            <div>
              <h2>Twoje zamówienie zostało złożone!</h2>
              <button onClick={() => setOrderPlaced(false)}>Powróć do sklepu</button>
            </div>
          ) : (
            <Cart cart={cart} setCart={setCart} onPlaceOrder={handlePlaceOrder} />
          )}
          <ClientOrderList token={localStorage.getItem('token')} />
        </>
      ) : userRole === 'PRACOWNIK' ? (
        <div>
          <h2>Panel Pracownika</h2>
          <button onClick={() => navigate('/initDB')}>Inicjalizuj bazę danych</button>
          <ProductList
            cart={cart}
            setCart={setCart}
            isEditable={true}
            onEditProduct={handleEditProduct}
          />
          {editingProduct && (
            <div className="edit-product-form">
              <h3>Edytuj Produkt</h3>
              <input
                type="text"
                value={editingProduct.name}
                onChange={(e) =>
                  setEditingProduct({ ...editingProduct, name: e.target.value })
                }
                placeholder="Nazwa produktu"
              />
              <input
                type="text"
                value={editingProduct.description}
                onChange={(e) =>
                  setEditingProduct({ ...editingProduct, description: e.target.value })
                }
                placeholder="Opis produktu"
              />
              <input
                type="number"
                value={editingProduct.price}
                onChange={(e) =>
                  setEditingProduct({ ...editingProduct, price: parseFloat(e.target.value) })
                }
                placeholder="Cena produktu"
              />
              <button onClick={() => handleSaveProduct(editingProduct)}>Zapisz</button>
              <button onClick={() => setEditingProduct(null)}>Anuluj</button>
            </div>
          )}
          <OrderList token={localStorage.getItem('token')} />
        </div>
      ) : (
        <div>Brak uprawnień.</div>
      )}
    </div>
  );
};

export default MainPage;

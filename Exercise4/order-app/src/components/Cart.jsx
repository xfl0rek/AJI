import { useState } from 'react';
import { createOrder } from '../api';
import '../App.css';

const Cart = ({ cart, setCart, onPlaceOrder }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [isFormValid, setIsFormValid] = useState(true);

  const removeFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item.product._id !== productId));
  };

  const handleQuantityChange = (productId, delta) => {
    setCart((prevCart) => {
      return prevCart.map((item) => {
        if (item.product._id === productId) {
          const newQuantity = item.quantity + delta;
          if (newQuantity > 0) {
            return { ...item, quantity: newQuantity };
          }
        }
        return item;
      });
    });
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.product.price * item.quantity, 0).toFixed(2);
  };

  const validateForm = () => {
    if (username && email && phone) {
      setIsFormValid(true);
      return true;
    }
    setIsFormValid(false);
    return false;
  };

  const handleSubmitOrder = () => {
    if (!validateForm()) return;
  
    const userData = {
      username,
      email,
      phone,
    };
  
    onPlaceOrder(userData);
  };
  

  return (
    <div>
      <h2>Twój koszyk</h2>
      {cart.length === 0 ? (
        <p>Twój koszyk jest pusty</p>
      ) : (
        <table className="cart-table">
          <thead>
            <tr>
              <th>Produkt</th>
              <th>Ilość</th>
              <th>Cena</th>
              <th>Akcja</th>
            </tr>
          </thead>
          <tbody>
            {cart.map((item) => (
              <tr key={item.product._id}>
                <td>{item.product.name}</td>
                <td>
                  <button onClick={() => handleQuantityChange(item.product._id, -1)}>-</button>
                  {item.quantity}
                  <button onClick={() => handleQuantityChange(item.product._id, 1)}>+</button>
                </td>
                <td>{(item.product.price * item.quantity).toFixed(2)} zł</td>
                <td>
                  <button onClick={() => removeFromCart(item.product._id)}>Usuń</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <div className="cart-total">
        <p>Łączna cena: {calculateTotal()} zł</p>
      </div>

      {cart.length > 0 && (
        <div className="order-form">
          <h3>Podaj dane do zamówienia</h3>
          <form className="form">
            <div className="form-group">
              <label>Imię:</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Wpisz swoje imię"
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label>Email:</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Wpisz swój email"
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label>Telefon:</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Wpisz swój numer telefonu"
                className="form-input"
              />
            </div>
            {!isFormValid && <p style={{ color: 'red' }}>Wszystkie pola są wymagane!</p>}
          </form>
          <button onClick={handleSubmitOrder} disabled={cart.length === 0 || !isFormValid} className="submit-btn">
            Złóż zamówienie
          </button>
        </div>
      )}
    </div>
  );
};

export default Cart;

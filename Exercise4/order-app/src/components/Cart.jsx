import { useState } from 'react';
import '../App.css';

const Cart = ({ cart, setCart, onPlaceOrder }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [isFormValid, setIsFormValid] = useState(true);
  const [formErrors, setFormErrors] = useState({
    username: '',
    email: '',
    phone: '',
  });

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
    const errors = { username: '', email: '', phone: '' };
    let isValid = true;

    // Validate username: must be 2 to 50 letters
    const usernameRegex = /^[A-Za-z]{2,50}$/;
    if (!usernameRegex.test(username)) {
      errors.username = 'Imię musi zawierać od 2 do 50 liter.';
      isValid = false;
    }

    // Validate email: must be a valid email
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      errors.email = 'Podaj poprawny email (np. cos@cos.com).';
      isValid = false;
    }

    // Validate phone: must be 9 digits only
    const phoneRegex = /^[0-9]{9}$/;
    if (!phoneRegex.test(phone)) {
      errors.phone = 'Telefon musi składać się z 9 cyfr.';
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
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
              {formErrors.username && <p style={{ color: 'red' }}>{formErrors.username}</p>}
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
              {formErrors.email && <p style={{ color: 'red' }}>{formErrors.email}</p>}
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
              {formErrors.phone && <p style={{ color: 'red' }}>{formErrors.phone}</p>}
            </div>
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

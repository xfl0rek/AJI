import React, { useState } from 'react';
import ProductList from './components/ProductList';
//import Cart from './components/Cart';
import 'bootstrap/dist/css/bootstrap.min.css';

const App = () => {
  // const [cart, setCart] = useState([]);

  // const addToCart = (product) => {
  //   const existingProduct = cart.find((item) => item.id === product.id);
  //   if (existingProduct) {
  //     setCart(cart.map((item) => 
  //       item.id === product.id 
  //       ? { ...item, quantity: item.quantity + 1 } 
  //       : item
  //     ));
  //   } else {
  //     setCart([...cart, { ...product, quantity: 1 }]);
  //   }
  // };

  // const updateQuantity = (product, action, value) => {
  //   if (action === 'decrease' && product.quantity > 1) {
  //     setCart(cart.map((item) =>
  //       item.id === product.id ? { ...item, quantity: item.quantity - 1 } : item
  //     ));
  //   } else if (action === 'increase') {
  //     setCart(cart.map((item) =>
  //       item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
  //     ));
  //   } else if (action === 'update') {
  //     const newQuantity = Math.max(1, parseInt(value));
  //     setCart(cart.map((item) =>
  //       item.id === product.id ? { ...item, quantity: newQuantity } : item
  //     ));
  //   }
  // };

  // const removeFromCart = (product) => {
  //   setCart(cart.filter((item) => item.id !== product.id));
  // };

  return (
    // <div className="App">
    //   <ProductList addToCart={addToCart} />
    //   <Cart cartItems={cart} updateQuantity={updateQuantity} removeFromCart={removeFromCart} />
    // </div>

    <div className = "App">
      <ProductList></ProductList>
    </div>
  );
};

export default App;
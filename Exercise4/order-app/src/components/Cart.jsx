// import React from 'react';

// const Cart = ({ cartItems, updateQuantity, removeFromCart }) => {
//   const getTotalPrice = () => {
//     return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
//   };

//   return (
//     <div className="container mt-4">
//       <h2>Twój Koszyk</h2>
//       <table className="table">
//         <thead>
//           <tr>
//             <th>Nazwa</th>
//             <th>Ilość</th>
//             <th>Cena</th>
//             <th>Akcje</th>
//           </tr>
//         </thead>
//         <tbody>
//           {cartItems.map((item) => (
//             <tr key={item.id}>
//               <td>{item.name}</td>
//               <td>
//                 <button className="btn btn-secondary" onClick={() => updateQuantity(item, 'decrease')}>-</button>
//                 <input
//                   type="number"
//                   value={item.quantity}
//                   onChange={(e) => updateQuantity(item, 'update', e.target.value)}
//                   min="1"
//                   className="mx-2"
//                 />
//                 <button className="btn btn-secondary" onClick={() => updateQuantity(item, 'increase')}>+</button>
//               </td>
//               <td>{item.price * item.quantity} PLN</td>
//               <td>
//                 <button className="btn btn-danger" onClick={() => removeFromCart(item)}>
//                   Usuń
//                 </button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//       <h4>Łączna cena: {getTotalPrice()} PLN</h4>
//     </div>
//   );
// };

// export default Cart;
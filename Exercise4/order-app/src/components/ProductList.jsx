import React, { useState, useEffect } from 'react';
import { getProducts } from '../api';

const ProductList = ({ addToCart }) => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts();
        setProducts(data);
      } catch (error) {
        console.error('Nie udało się pobrać produktów:', error);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="container mt-4">
      <h2>Lista Produktów</h2>
      <table className="table">
        <thead>
          <tr>
            <th>Nazwa</th>
            <th>Opis</th>
            <th>Cena</th>
            <th>Akcje</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td>{product.name}</td>
              <td>{product.description}</td>
              <td>{product.price} PLN</td>
              <td>
                <button className="btn btn-primary" onClick={() => addToCart(product)}>
                  Kup
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductList;
import React, { useState, useEffect } from 'react';
import { getProducts, getCategories } from '../api';
import '../App.css';

const ProductList = ({ cart, setCart }) => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchName, setSearchName] = useState('');
  const [searchDescription, setSearchDescription] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productsData = await getProducts();
        const categoriesData = await getCategories();
        setProducts(productsData);
        setCategories(categoriesData);
        setFilteredProducts(productsData);
      } catch (error) {
        console.error('Nie udało się pobrać produktów lub kategorii:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [searchName, searchDescription, selectedCategory, products]);

  const mapCategoryToName = (categoryId) => {
    const categoryIdString = categoryId ? categoryId._id.toString() : '';
    const category = categories.find((cat) => cat._id === categoryIdString);
    return category ? category.name : 'Nieznana kategoria';
  };

  const filterProducts = () => {
    const filtered = products.filter((product) => {
      const matchesName = product.name.toLowerCase().includes(searchName.toLowerCase());
      const matchesDescription = product.description.toLowerCase().includes(searchDescription.toLowerCase());

      const categoryId = product.category && product.category._id ? product.category._id.toString() : product.category.toString();

      const matchesCategory = selectedCategory ? categoryId === selectedCategory : true;

      return matchesName && matchesDescription && matchesCategory;
    });

    setFilteredProducts(filtered);
  };

  const handleSearchNameChange = (e) => {
    setSearchName(e.target.value);
    filterProducts();
  };

  const handleSearchDescriptionChange = (e) => {
    setSearchDescription(e.target.value);
    filterProducts();
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    filterProducts();
  };

  const addToCart = (product) => {
    setCart((prevCart) => {
      const existingProductIndex = prevCart.findIndex((item) => item.product._id === product._id);

      if (existingProductIndex !== -1) {
        const updatedCart = [...prevCart];
        updatedCart[existingProductIndex].quantity += 0.5;
        return updatedCart;
      } else {
        return [...prevCart, { product, quantity: 1 }];
      }
    });
  };

  return (
    <div>
      <div className="filters">
        <input
          type="text"
          placeholder="Wyszukaj po nazwie"
          value={searchName}
          onChange={handleSearchNameChange}
        />

        <input
          type="text"
          placeholder="Wyszukaj po opisie"
          value={searchDescription}
          onChange={handleSearchDescriptionChange}
        />

        <select value={selectedCategory} onChange={handleCategoryChange}>
          <option value="">Wybierz kategorię</option>
          {categories.map((category) => (
            <option key={category._id} value={category._id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <table className="products-table">
        <thead>
          <tr>
            <th>Nazwa</th>
            <th>Opis</th>
            <th>Cena</th>
            <th>Kategoria</th>
            <th>Akcja</th>
          </tr>
        </thead>
        <tbody>
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <tr key={product._id}>
                <td>{product.name}</td>
                <td>{product.description}</td>
                <td>{product.price.toFixed(2)} zł</td>
                <td>{mapCategoryToName(product.category)}</td>
                <td>
                  <button onClick={() => addToCart(product)}>Dodaj do koszyka</button>
                </td>
              </tr>
            ))
          ) : (
            <tr className="empty-result">
              <td colSpan="5">Brak wyników</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ProductList;
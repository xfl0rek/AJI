import { useState, useEffect } from 'react';
import { getProducts, getCategories, updateProduct, optimizeDescriptionApi } from '../api';
import '../App.css';

const ProductList = ({ cart, setCart, isEditable }) => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchName, setSearchName] = useState('');
  const [searchDescription, setSearchDescription] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [editProduct, setEditProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const productsData = await getProducts();
      const categoriesData = await getCategories();
      console.log('Dane produktów:', productsData);
      console.log('Dane kategorii:', categoriesData);
      setProducts(productsData);
      setCategories(categoriesData);
      setFilteredProducts(productsData);
    } catch (error) {
      console.error('Nie udało się pobrać produktów lub kategorii:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (!loading) {
      filterProducts();
    }
  }, [searchName, searchDescription, selectedCategory, products, loading]);

  const mapCategoryToName = (categoryId) => {
    if (!categoryId || !categoryId._id) {
      return 'Nieznana kategoria';
    }

    const category = categories.find((cat) => cat._id.toString() === categoryId._id.toString());
    return category ? category.name : 'Nieznana kategoria';
  };

  const filterProducts = () => {
    const filtered = products.filter((product) => {
      const matchesName = product.name.toLowerCase().includes(searchName.toLowerCase());
      const matchesDescription = product.description.toLowerCase().includes(searchDescription.toLowerCase());

      const categoryId = product.category ? (product.category._id || product.category.toString()) : '';

      const matchesCategory = selectedCategory ? categoryId === selectedCategory : true;

      return matchesName && matchesDescription && matchesCategory;
    });

    setFilteredProducts(filtered);
  };

  const handleSearchNameChange = (e) => {
    setSearchName(e.target.value);
  };

  const handleSearchDescriptionChange = (e) => {
    setSearchDescription(e.target.value);
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
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

  const startEditProduct = (product) => setEditProduct({ ...product });
  const cancelEditProduct = () => setEditProduct(null);

  const handleInputChange = (field, value) => {
    if (field === 'category') {
      setEditProduct((prev) => ({
        ...prev,
        [field]: value ? { _id: value } : null,
      }));
    } else if (field === 'price') {
      if (value >= 0) {
        setEditProduct((prev) => ({
          ...prev,
          [field]: parseFloat(value),
        }));
      } else {
        alert('Cena musi być dodatnia!');
      }
    } else {
      setEditProduct((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  const saveProductChanges = async () => {
    try {
      console.log('Edycja produktu:', editProduct);
      const updatedProduct = await updateProduct(editProduct);

      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product._id === updatedProduct._id ? updatedProduct : product
        )
      );
      setFilteredProducts((prevFilteredProducts) =>
        prevFilteredProducts.map((product) =>
          product._id === updatedProduct._id ? updatedProduct : product
        )
      );

      alert('Produkt został zaktualizowany.');

      await fetchData();

      setEditProduct(null);
    } catch (error) {
      console.error('Nie udało się zaktualizować produktu:', error);
      alert('Wystąpił problem z aktualizacją produktu.');
    }
  };

  const optimizeDescription = async () => {
    if (!editProduct) return;
  
    try {
      const optimizedDescription = await optimizeDescriptionApi(editProduct);
      setEditProduct((prev) => ({
        ...prev,
        description: optimizedDescription,
      }));
  
      alert('Opis został zoptymalizowany!');
    } catch (error) {
      console.error('Błąd przy optymalizacji opisu:', error);
      alert('Nie udało się zoptymalizować opisu.');
    }
  };
  

  if (loading) {
    return <div>Ładowanie danych...</div>;
  }

  return (
    <div>
      {/* UI do filtrowania produktów */}
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

        <select
          value={selectedCategory}
          onChange={handleCategoryChange}
        >
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
                  {isEditable ? (
                    <button onClick={() => startEditProduct(product)}>Edytuj</button>
                  ) : (
                    <button onClick={() => addToCart(product)}>Dodaj do koszyka</button>
                  )}
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

      {editProduct && (
        <div className="edit-product">
          <h2>Edytuj produkt</h2>
          <label>
            Nazwa:
            <input
              type="text"
              value={editProduct.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
            />
          </label>
          <label>
            Opis:
            <textarea
              value={editProduct.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
            />
          </label>
          <button onClick={optimizeDescription}>Optymalizuj opis</button>
          <label>
            Cena:
            <input
              type="number"
              value={editProduct.price}
              onChange={(e) => handleInputChange('price', parseFloat(e.target.value))}
            />
          </label>
          <label>
            Kategoria:
            <select
              value={editProduct.category?._id || ''}
              onChange={(e) => handleInputChange('category', e.target.value)}
            >
              <option value="">Wybierz kategorię</option>
              {categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>
          </label>
          <button onClick={saveProductChanges}>Zapisz</button>
          <button onClick={cancelEditProduct}>Anuluj</button>
        </div>
      )}
    </div>
  );
};

export default ProductList;

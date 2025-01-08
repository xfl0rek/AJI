import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  timeout: 5000,
});

const getToken = () => localStorage.getItem('token');

const addAuthHeader = () => {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const getProducts = async () => {
  try {
    const response = await api.get('/products', {
      headers: addAuthHeader(),
    });
    return response.data;
  } catch (error) {
    console.error('Błąd podczas pobierania produktów:', error.message);
    throw error;
  }
};

export const getCategories = async () => {
  try {
    const response = await api.get('/categories', {
      headers: addAuthHeader(),
    });
    return response.data;
  } catch (error) {
    console.error('Błąd podczas pobierania kategorii:', error.message);
    throw error;
  }
};

export const getOrders = async (token) => {
  try {
    const response = await api.get('/orders', {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error('Błąd podczas pobierania zamówień:', error.message);
    throw new Error('Nie udało się pobrać zamówień. Spróbuj ponownie później.');
  }
};

export const updateOrderStatus = async (orderId, statusId) => {
  try {
    const response = await api.patch(`/orders/${orderId}`, statusId, {
      headers: addAuthHeader(),
    });
    return response.data;
  } catch (error) {
    console.error(`Błąd podczas aktualizacji zamówienia o ID ${orderId}:`, error.message);
    throw error;
  }
};

export const createOrder = async (orderData, token) => {
  try {
    const response = await axios.post('http://localhost:5000/api/orders', orderData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error('Błąd przy tworzeniu zamówienia:', error.message);
    throw error;
  }
};

export const getOrderStatuses = async (token) => {
  try {
    const response = await axios.get('http://localhost:5000/api/statuses/', {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Błąd przy pobieraniu statusów zamówień:', error.message);
    throw error;
  }
};

export const updateProduct = async (product) => {
  try {
    const response = await api.put(
      `/products/${product._id}`,
      { ...product, category: product.category ? product.category._id : null },
      {
        headers: addAuthHeader(),
      }
    );
    return response.data;
  } catch (error) {
    console.error(`Błąd podczas aktualizacji produktu ${product._id}:`, error.message);
    throw error;
  }
};

export const optimizeDescriptionApi = async (product) => {
  try {
    const response = await api.put(
      `/products/optimize-description/${product._id}`,
      { description: product.description },
      {
        headers: addAuthHeader(),
      }
    );
    return response.data.optimizedDescription;
  } catch (error) {
    console.error('Błąd przy optymalizacji opisu:', error.message);
    throw error;
  }
};


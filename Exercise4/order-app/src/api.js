import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  timeout: 5000,
});

const getToken = () => {
  return localStorage.getItem('token');
};

const addAuthHeader = () => {
  const token = getToken();
  if (token) {
    return {
      Authorization: `Bearer ${token}`,
    };
  }
  return {};
};

export const getProducts = async () => {
  try {
    const response = await api.get('/products', {
      headers: addAuthHeader(),
    });
    return response.data;
  } catch (error) {
    console.error('Błąd podczas pobierania produktów:', error);
    throw error;
  }
};

export const getCategories = async () => {
  try {
    const response = await api.get('/categories', {
      headers: addAuthHeader(), // Dodanie nagłówka autoryzacji
    });
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error('Błąd podczas pobierania kategorii:', error);
    throw error;
  }
};

export const getOrders = async () => {
  try {
    const response = await api.get('/orders', {
      headers: addAuthHeader(),
    });
    return response.data;
  } catch (error) {
    console.error('Błąd podczas pobierania zamówień:', error);
    throw error;
  }
};

export const updateOrderStatus = async (orderId, status) => {
  try {
    const response = await api.patch(`/orders/${orderId}`, { status }, {
      headers: addAuthHeader(),
    });
    return response.data;
  } catch (error) {
    console.error(`Błąd podczas aktualizacji zamówienia ${orderId}:`, error);
    throw error;
  }
};

export const createOrder = async (orderData) => {
  try {
    console.log("Dane wysyłane do serwera:", orderData);
    const response = await api.post('/orders', orderData, {
      headers: addAuthHeader(),
    });
    return response.data;
  } catch (error) {
    console.error("Błąd podczas składania zamówienia:", error);
    throw error;
  }
};

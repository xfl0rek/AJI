import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  timeout: 5000,
});

export const getProducts = async () => {
  try {
    const response = await api.get('/products');
    return response.data;
  } catch (error) {
    console.error('Błąd podczas pobierania produktów:', error);
    throw error;
  }
};

export const getCategories = async () => {
  try {
    const response = await api.get('/categories');
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error('Błąd podczas pobierania kategorii:', error);
    throw error;
  }
};

export const getOrders = async () => {
  try {
    const response = await axios.get('/orders');
    return response.data;
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw error;
  }
};

export const updateOrderStatus = async (orderId, status) => {
  try {
    const response = await axios.patch('/orders/${orderId}', { status });
    return response.data; // Zwraca zaktualizowane zamówienie
  } catch (error) {
    console.error(`Error updating order ${orderId}:`, error);
    throw error;
  }
};

export async function createOrder(orderData) {
  try {
      console.log("Dane wysyłane do serwera:", orderData);
      const response = await axios.post('http://localhost:5000/api/orders', orderData);
      return response.data;
  } catch (error) {
      console.error("Błąd podczas składania zamówienia:", error);
      throw error;
  }
}



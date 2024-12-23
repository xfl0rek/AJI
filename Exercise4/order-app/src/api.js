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

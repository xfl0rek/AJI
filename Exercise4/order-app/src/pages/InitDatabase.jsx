import React, { useState } from 'react';

const InitDatabase = () => {
  const [file, setFile] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile && selectedFile.type === 'application/json') {
      setFile(selectedFile);
      setErrorMessage('');
    } else {
      setErrorMessage('Proszę wybrać plik JSON.');
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!file) {
      setErrorMessage('Proszę wybrać plik JSON.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    setIsLoading(true);
    setErrorMessage('');

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/init', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        alert(`Baza danych została zainicjalizowana. Dodano ${data.productsAdded} produktów.`);
      } else {
        alert(data.message || 'Wystąpił błąd przy inicjalizacji bazy danych.');
      }
    } catch (error) {
      alert('Wystąpił błąd: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h1>Inicjalizacja Bazy Danych</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="file">Wybierz plik JSON:</label>
        <input
          type="file"
          id="file"
          accept=".json"
          onChange={handleFileChange}
        />
        {errorMessage && <div style={{ color: 'red' }}>{errorMessage}</div>}
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Trwa ładowanie...' : 'Zainicjalizuj bazę danych'}
        </button>
      </form>
    </div>
  );
};

export default InitDatabase;
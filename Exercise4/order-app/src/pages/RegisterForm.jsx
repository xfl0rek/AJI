import React, { useState } from 'react';

const RegisterForm = () => {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ login, password, role: 'KLIENT' }),
      });
      if (response.ok) {
        setError(null);
        console.log('Rejestracja udana!');
      } else {
        const errorData = await response.json();
        console.error('Błąd rejestracji:', errorData);
        setError(errorData.message || 'Błąd rejestracji');
      }
    } catch (error) {
      console.error('Błąd rejestracji:', error);
      setError('Błąd rejestracji');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Nazwa użytkownika:
        <input type="text" value={login} onChange={(event) => setLogin(event.target.value)} />
      </label>
      <label>
        Hasło:
        <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
      </label>
      <button type="submit">Zarejestruj się</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </form>
  );
};

export default RegisterForm;

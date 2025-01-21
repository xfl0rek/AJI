import { useState } from 'react';

const LoginForm = ({ onLogin }) => {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ login, password }),
      });
      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.token);
        localStorage.setItem('login', login);
        console.log('Token saved:', data.token);
        onLogin();
      } else {
        setError('Błąd logowania');
      }
    } catch (error) {
      setError('Błąd logowania');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <div className="form-field">
        <label htmlFor="login">Nazwa użytkownika:</label>
        <input
          id="login"
          type="text"
          value={login}
          onChange={(event) => setLogin(event.target.value)}
          className="form-input"
          required
        />
      </div>
      <div className="form-field">
        <label htmlFor="password">Hasło:</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="form-input"
          required
        />
      </div>
      <button type="submit" className="submit-button">Zaloguj się</button>
      {error && <p className="error-message">{error}</p>}
    </form>
  );
};

export default LoginForm;

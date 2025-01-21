import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const RegisterForm = () => {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('KLIENT');
  const [error, setError] = useState(null);
  const [formErrors, setFormErrors] = useState({
    login: '',
    password: '',
    confirmPassword: '',
  });
  const navigate = useNavigate();

  const validateForm = () => {
    const errors = { login: '', password: '', confirmPassword: '' };
    let isValid = true;

    if (login.length < 2 || login.length > 50) {
      errors.login = 'Login musi mieć od 2 do 50 znaków.';
      isValid = false;
    }

    const passwordRegex = /^(?=.*[A-Z]).{4,}$/;
    if (!passwordRegex.test(password)) {
      errors.password = 'Hasło musi mieć co najmniej 4 znaki i jedną dużą literę.';
      isValid = false;
    }

    if (password !== confirmPassword) {
      errors.confirmPassword = 'Hasła muszą być identyczne.';
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateForm()) return;

    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ login, password, role }),
      });

      if (response.ok) {
        setError(null);
        setLogin('');
        setPassword('');
        setConfirmPassword('');
        setRole('KLIENT');
        navigate('/registerSuccess');
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Błąd rejestracji');
      }
    } catch (error) {
      setError('Błąd rejestracji');
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
        {formErrors.login && <p style={{ color: 'red' }}>{formErrors.login}</p>}
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
        {formErrors.password && <p style={{ color: 'red' }}>{formErrors.password}</p>}
      </div>
      <div className="form-field">
        <label htmlFor="confirmPassword">Potwierdź hasło:</label>
        <input
          id="confirmPassword"
          type="password"
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
          className="form-input"
          required
        />
        {formErrors.confirmPassword && <p style={{ color: 'red' }}>{formErrors.confirmPassword}</p>}
      </div>
      <div className="form-field">
        <label htmlFor="role">Rola:</label>
        <select
          id="role"
          value={role}
          onChange={(event) => setRole(event.target.value)}
          className="form-input"
        >
          <option value="KLIENT">KLIENT</option>
          <option value="PRACOWNIK">PRACOWNIK</option>
        </select>
      </div>
      <button type="submit" className="submit-button">Zarejestruj się</button>
      {error && <p className="error-message">{error}</p>}
    </form>
  );
};

export default RegisterForm;

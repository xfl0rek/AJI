import React from 'react';
import { useNavigate } from 'react-router-dom';

const RegisterSuccess = () => {
  const navigate = useNavigate();

  const handleRedirectToLogin = () => {
    navigate('/login');
  };

  return (
    <div className="register-success">
      <h1>Rejestracja zakończona sukcesem!</h1>
      <p>Twoje konto zostało pomyślnie utworzone. Teraz możesz się zalogować.</p>
      <button onClick={handleRedirectToLogin}>Zaloguj się</button>
    </div>
  );
};

export default RegisterSuccess;

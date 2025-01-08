import React, { useState } from 'react';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

const WelcomePage = ({ onLogin }) => {
  const [showLogin, setShowLogin] = useState(true);

  const toggleForm = () => {
    setShowLogin((prev) => !prev);
  };

  return (
    <div className="welcome-page">
      <h2>Witaj na stronie</h2>
      
      {showLogin ? (
        <div>
          <h3>Logowanie</h3>
          <LoginForm onLogin={onLogin} />
          <p>
            Nie masz konta?{' '}
            <button onClick={toggleForm}>Zarejestruj się</button>
          </p>
        </div>
      ) : (
        <div>
          <h3>Rejestracja</h3>
          <RegisterForm />
          <p>
            Masz już konto?{' '}
            <button onClick={toggleForm}>Zaloguj się</button>
          </p>
        </div>
      )}
    </div>
  );
};

export default WelcomePage;

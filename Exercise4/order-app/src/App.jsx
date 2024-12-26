import React, { useState } from 'react';
import LoginPage from './pages/LoginForm';
import RegisterPage from './pages/RegisterForm';
import MainPage from './pages/MainPage';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  return (
    <div>
      {isLoggedIn ? (
        <MainPage onLogout={handleLogout} />
      ) : (
        <div>
          <LoginPage onLogin={handleLogin} />
          <RegisterPage />
        </div>
      )}
    </div>
  );
};

export default App;

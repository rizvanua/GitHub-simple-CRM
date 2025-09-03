import React, { useState, useEffect } from 'react';
import LoginForm from '../components/LoginForm';
import RegisterForm from '../components/RegisterForm';

interface AuthPageProps {
  mode?: 'login' | 'register';
}

const AuthPage: React.FC<AuthPageProps> = ({ mode = 'login' }) => {
  const [isLogin, setIsLogin] = useState(mode === 'login');

  useEffect(() => {
    setIsLogin(mode === 'login');
  }, [mode]);

  return (
    <div>
      {isLogin ? (
        <LoginForm onSwitchToRegister={() => setIsLogin(false)} />
      ) : (
        <RegisterForm onSwitchToLogin={() => setIsLogin(true)} />
      )}
    </div>
  );
};

export default AuthPage;

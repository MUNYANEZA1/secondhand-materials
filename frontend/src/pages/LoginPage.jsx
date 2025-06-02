import React from 'react';
import Login from '../components/auth/Login';

const LoginPage = () => {
  return (
    <div className="max-w-md mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6 text-center">Login to Your Account</h1>
      <Login />
    </div>
  );
};

export default LoginPage;

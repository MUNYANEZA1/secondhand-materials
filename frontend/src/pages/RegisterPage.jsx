import React from 'react';
import Register from '../components/auth/Register';

const RegisterPage = () => {
  return (
    <div className="max-w-md mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6 text-center">Create an Account</h1>
      <Register />
    </div>
  );
};

export default RegisterPage;

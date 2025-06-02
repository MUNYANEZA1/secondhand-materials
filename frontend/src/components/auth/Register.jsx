import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useForm } from '../../hooks/useForm';
import { useNotification } from '../../hooks/useNotification';
import { validateForm } from '../../utils/validators';
import ErrorMessage from '../common/ErrorMessage';
import LoadingSpinner from '../common/LoadingSpinner';

const Register = () => {
  const { register } = useAuth();
  const { addNotification } = useNotification();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  
  const { 
    values, 
    errors, 
    isSubmitting, 
    setErrors, 
    setIsSubmitting, 
    handleChange 
  } = useForm({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phoneNumber: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    const formErrors = validateForm(values, [
      { name: 'firstName', required: true, label: 'First Name' },
      { name: 'lastName', required: true, label: 'Last Name' },
      { name: 'email', type: 'email', required: true, label: 'Email' },
      { name: 'password', type: 'password', required: true, label: 'Password' },
      { name: 'phoneNumber', required: false, label: 'Phone Number' }
    ]);
    
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }
    
    setIsSubmitting(true);
    setError('');
    
    try {
      const result = await register(values);
      
      if (result.success) {
        addNotification('Registration successful!', 'success');
        navigate('/');
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('An error occurred during registration. Please try again.');
      console.error('Registration error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center mb-6">Create an Account</h2>
      
      {error && <ErrorMessage message={error} />}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="firstName" className="form-label">First Name</label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={values.firstName}
              onChange={handleChange}
              className={`form-input ${errors.firstName ? 'border-red-500' : ''}`}
              placeholder="First Name"
            />
            {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
          </div>
          
          <div>
            <label htmlFor="lastName" className="form-label">Last Name</label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={values.lastName}
              onChange={handleChange}
              className={`form-input ${errors.lastName ? 'border-red-500' : ''}`}
              placeholder="Last Name"
            />
            {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
          </div>
        </div>
        
        <div>
          <label htmlFor="email" className="form-label">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={values.email}
            onChange={handleChange}
            className={`form-input ${errors.email ? 'border-red-500' : ''}`}
            placeholder="Enter your email"
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
        </div>
        
        <div>
          <label htmlFor="password" className="form-label">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={values.password}
            onChange={handleChange}
            className={`form-input ${errors.password ? 'border-red-500' : ''}`}
            placeholder="Enter your password"
          />
          {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
          <p className="text-gray-500 text-xs mt-1">Password must be at least 6 characters long</p>
        </div>
        
        <div>
          <label htmlFor="phoneNumber" className="form-label">Phone Number (Optional)</label>
          <input
            type="tel"
            id="phoneNumber"
            name="phoneNumber"
            value={values.phoneNumber}
            onChange={handleChange}
            className={`form-input ${errors.phoneNumber ? 'border-red-500' : ''}`}
            placeholder="Enter your phone number"
          />
          {errors.phoneNumber && <p className="text-red-500 text-sm mt-1">{errors.phoneNumber}</p>}
        </div>
        
        <button
          type="submit"
          className="btn btn-primary w-full"
          disabled={isSubmitting}
        >
          {isSubmitting ? <LoadingSpinner size="small" text="" /> : 'Register'}
        </button>
      </form>
      
      <div className="mt-6 text-center">
        <p>
          Already have an account?{' '}
          <Link to="/login" className="text-primary hover:underline">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;

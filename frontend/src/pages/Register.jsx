import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from '../services/api';

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    phone: '',
  });

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
    setServerError('');
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email';
    }

    if (!formData.password) {
      newErrors.password = 'Required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Min 6 chars';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    setSuccessMsg('');

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const response = await registerUser({
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
        password: formData.password,
        phone: formData.phone.trim(),
      });

      if (response.success || response.customer) {
        setSuccessMsg('Account created. Redirecting...');
        setTimeout(() => {
          navigate('/login');
        }, 1500);
      } else {
        setServerError(response.message || 'Registration failed.');
      }
    } catch (err) {
      setServerError(
        err.response?.data?.message || 'Registration failed.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <h2 className="auth-title">Create Account</h2>

      {serverError && <div className="alert alert-error" id="register-error">{serverError}</div>}
      {successMsg && <div className="alert alert-success" id="register-success">{successMsg}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="fullName">Full Name</label>
          <input
            id="fullName"
            name="fullName"
            type="text"
            value={formData.fullName}
            onChange={handleChange}
            placeholder="Enter your full name"
          />
          {errors.fullName && <span className="field-error">{errors.fullName}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
          />
          {errors.email && <span className="field-error">{errors.email}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your password"
          />
          {errors.password && <span className="field-error">{errors.password}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="phone">Phone</label>
          <input
            id="phone"
            name="phone"
            type="text"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Enter your phone number"
          />
          {errors.phone && <span className="field-error">{errors.phone}</span>}
        </div>

        <button type="submit" disabled={loading} className="btn-black" id="register-btn">
          {loading ? 'Creating...' : 'Register'}
        </button>
      </form>

      <div className="auth-footer">
        <p>
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;

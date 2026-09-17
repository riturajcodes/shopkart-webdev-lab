import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser } from '../services/api';

const Login = ({ setUser }) => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrorMsg('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formData.email.trim() || !formData.password) {
      setErrorMsg('Please enter both email and password.');
      return;
    }

    setLoading(true);

    try {
      const response = await loginUser({
        email: formData.email.trim(),
        password: formData.password,
      });

      if (response.success || response.customer) {
        if (setUser && response.customer) {
          setUser(response.customer);
        }
        navigate('/home');
      } else {
        setErrorMsg('Invalid Credentials');
      }
    } catch (err) {
      console.error('Login error:', err);
      setErrorMsg('Invalid Credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <h2 className="auth-title">Sign In</h2>

      {errorMsg && <div className="alert alert-error" id="login-error">{errorMsg}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="login-email">Email</label>
          <input
            id="login-email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="login-password">Password</label>
          <input
            id="login-password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your password"
            required
          />
        </div>

        <button type="submit" disabled={loading} className="btn-black" id="login-btn">
          {loading ? 'Signing In...' : 'Sign In'}
        </button>
      </form>

      <div className="auth-footer">
        <p>
          New to ShopKart? <Link to="/register">Create an account</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;

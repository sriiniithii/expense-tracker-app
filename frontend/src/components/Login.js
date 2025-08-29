import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Login = ({ setIsAuthenticated }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', formData);
      
      // Save token and user info
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      setIsAuthenticated(true);
    } catch (error) {
      setError(error.response?.data?.message || 'Login failed');
    }
    
    setLoading(false);
  };

  return (
    <div className="auth-container">
      <div className="auth-form">
        <h2>Login to FinSight</h2>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Password:</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          
          <button type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        
        <p>
          Don't have an account? <Link to="/register">Register here</Link>
        </p>
            <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '0.9rem', color: '#666' }}>
      © Developed by <strong>Srinithi Jaikumar</strong>
    </div>
      </div>

    </div>
  );
};

export default Login;
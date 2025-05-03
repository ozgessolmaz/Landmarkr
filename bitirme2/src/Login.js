import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import { useAuth } from './context/AuthContext';
import { GoogleLogin } from '@react-oauth/google'; 


const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://api.landmarkr.shop/api/user/login', formData);
      if (response.data.token) {
        login(response.data.token);
        navigate('/seyahat');
      } else {
        setError(response.data.message || 'Giriş başarısız');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Giriş başarısız. Lütfen bilgilerinizi kontrol edin.');
    }
  };

  const handleGoogleLoginSuccess = async (credentialResponse) => {
    try {
      const decoded = jwtDecode(credentialResponse.credential);
      console.log(decoded);

      const response = await axios.post('https://api.landmarkr.shop/api/user/google-login', {
        code: credentialResponse.credential,
      });

      if (response.status === 200) {
        const token = response.data.token;
        login(token);
        navigate("/seyahat");
      }
    } catch (error) {
      console.error("Google login error:", error);
      setErrorMessage("Google ile giriş başarısız!");
    }
  };

  return (
    <div className="login-page">
      <nav className="navbar">
        <div className="nav-left">
          <span className="logo">LandMarkr</span>
        </div>
        <div className="nav-right">
          <button className="nav-button" onClick={() => navigate('/')}>Ana Sayfa</button>
          <button className="nav-button" onClick={() => navigate('/register')}>Kayıt Ol</button>
        </div>
      </nav>

      <div className="login-container">
        <div className="login-header">
          <h1 className="login-title">Landmarkr</h1>
          <p className="login-subtitle">Hesabınıza giriş yapın</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">E-posta</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="E-posta adresiniz"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Şifre</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Şifreniz"
              required
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="login-button">Giriş Yap</button>
        </form>

        <div className="divider">
          <span>veya</span>
        </div>

        <div className="google-login">
          <GoogleLogin
            onSuccess={handleGoogleLoginSuccess}
            onError={() => setErrorMessage("Google ile giriş başarısız!")}
            useOneTap
          />
          {errorMessage && <div className="error-message">{errorMessage}</div>}
        </div>

        <div className="login-footer">
          <p>
            Hesabınız yok mu?{' '}
            <span className="register-link" onClick={() => navigate('/register')}>
              Kayıt Ol
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;

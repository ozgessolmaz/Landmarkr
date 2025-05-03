import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Register.css';
import axios from 'axios';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    ad: '',
    email: '',
    password: '',
    confirmPassword: '',
    soyad: ''
  });
  const [error, setError] = useState('');
  const [passwordStrength, setPasswordStrength] = useState({
    hasMinLength: false,
    hasUpperCase: false,
    hasLowerCase: false,
    hasNumber: false,
    hasSpecialChar: false
  });

  const checkPasswordStrength = (password) => {
    setPasswordStrength({
      hasMinLength: password.length >= 8,
      hasUpperCase: /[A-Z]/.test(password),
      hasLowerCase: /[a-z]/.test(password),
      hasNumber: /[0-9]/.test(password),
      hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (name === 'password') {
      checkPasswordStrength(value);
    }
  };

  const isPasswordValid = () => {
    return Object.values(passwordStrength).every(condition => condition === true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isPasswordValid()) {
      setError('Lütfen güçlü bir şifre oluşturun.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Şifreler eşleşmiyor');
      return;
    }

    try {
      const response = await axios.post('https://api.landmarkr.shop/api/user/register', {
        ad: formData.ad,
        soyad: formData.soyad,
        email: formData.email,
        password: formData.password

      });
      
      if (response.status === 201) {
        alert('Hesap başarıyla oluşturuldu!');
        navigate('/login');
      } else {
        setError(response.data.message || 'Kayıt başarısız');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Kayıt başarısız. Lütfen tekrar deneyin.');
    }
  };

  return (
    <div className="register-page">
      <nav className="navbar">
        <div className="nav-left">
          <span className="logo">LandMarkr</span>
        </div>
        <div className="nav-right">
          <button className="nav-button" onClick={() => navigate('/')}>Ana Sayfa</button>
          <button className="nav-button" onClick={() => navigate('/login')}>Giriş Yap</button>
        </div>
      </nav>

      <div className="register-container">
        <div className="register-header">
          <h1 className="register-title">LandMarkr</h1>
          <p className="register-subtitle">Yeni hesap oluşturun</p>
        </div>

        <form className="register-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Ad </label>
            <input
              type="text"
              id="ad"
              name="ad"
              value={formData.ad}
              onChange={handleChange}
              placeholder="Adınız"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="name">Soyad</label>
            <input
              type="text"
              id="soyad"
              name="soyad"
              value={formData.soyad}
              onChange={handleChange}
              placeholder="Soyadınız"
              required
            />
          </div>
          

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
            <div className="password-strength">
              <p className="strength-title">Şifre gereksinimleri:</p>
              <ul className="strength-list">
                <li className={passwordStrength.hasMinLength ? 'valid' : ''}>
                  En az 8 karakter
                </li>
                <li className={passwordStrength.hasUpperCase ? 'valid' : ''}>
                  En az 1 büyük harf
                </li>
                <li className={passwordStrength.hasLowerCase ? 'valid' : ''}>
                  En az 1 küçük harf
                </li>
                <li className={passwordStrength.hasNumber ? 'valid' : ''}>
                  En az 1 rakam
                </li>
                <li className={passwordStrength.hasSpecialChar ? 'valid' : ''}>
                  En az 1 özel karakter (!@#$%^&*)
                </li>
              </ul>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Şifre Tekrar</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Şifrenizi tekrar girin"
              required
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="register-button">Kayıt Ol</button>
        </form>

        <div className="register-footer">
          <p>
            Zaten hesabınız var mı?{' '}
            <span className="login-link" onClick={() => navigate('/login')}>
              Giriş Yap
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import './LoginForm.css';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../AuthProvider'; 

const LoginForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [passwordError, setPasswordError] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth(); 

  const validatePassword = (inputPassword) => {
    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*.,;:]).{8,}$/;
    const isValid = passwordPattern.test(inputPassword);
    setIsPasswordValid(isValid);
    if (isValid) {
      setPasswordError('');
    } else {
      setPasswordError('Şifre en az 8 karakter, bir büyük harf, bir küçük harf ve bir rakam içermelidir!');
    }
  };

  const validateEmail = (inputEmail) => {
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return emailPattern.test(inputEmail);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (e.target.name === "password") {
      validatePassword(e.target.value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    if (!validateEmail(formData.email) || !isPasswordValid) {
      setErrorMessage('Geçersiz e-posta veya şifre!');
      return;
    }
    try {
      const response = await axios.post('https://api.landmarkr.shop/api/user/login', {
        email: formData.email,
        password: formData.password,
      });
      if (response.status === 200) {
        const token = response.data.token;
        login(token);
        alert('Giriş başarılı!');
        navigate('/seyahat');
      }
    } catch (error) {
      setErrorMessage(error.response?.data || 'Giriş başarısız! Lütfen bilgilerinizi kontrol edin.');
    }
  };

  const handleGoogleLoginSuccess = async (credentialResponse) => {
    try {
      const decoded = jwtDecode(credentialResponse.credential);
      console.log(decoded);

      const response = await axios.post('https://api.landmarkr.shop/api/user/google-login', {
        token: credentialResponse.credential,
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
    <div className='login-form-container'>
      <div className="wrap">
        <form onSubmit={handleSubmit}>
          <h1>Giriş Yap</h1>
          {errorMessage && <div className="error-message">{errorMessage}</div>}
          <div className="inputbox">
            <input
              type="email"
              name="email"
              placeholder="E-mail"
              required
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          <div className="inputbox">
            <input
              type="password"
              name="password"
              placeholder="Şifre"
              required
              value={formData.password}
              onChange={handleChange}
            />
          </div>
          {passwordError && <div className="password-error">{passwordError}</div>}
          <div className="rememberforgot">
            <label>
              <input type="checkbox" /> Beni Hatırla
            </label>
            <a href="#">Şifreni mi unuttun?</a>
          </div>
          <button type="submit"><h2>Giriş</h2></button>
          <div className="Or">ya da</div>
          <div className="google-login">
            <GoogleLogin 
              clientId="key"
              onSuccess={handleGoogleLoginSuccess}
              onError={() => setErrorMessage("Google ile giriş başarısız!")}
              auto_select={true}
              useOneTap={true}  
            />
          </div>
          <div className="registerlink">
            <p>
              Hesabın yok mu? <a href="/register">Kayıt ol</a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;

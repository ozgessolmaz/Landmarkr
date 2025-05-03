/*
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Register.css';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({
    ad: '',
    soyad: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [generatedPassword, setGeneratedPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const validatePassword = (inputPassword) => {
    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*.,;:]).{8,}$/;
    const isValid = passwordPattern.test(inputPassword);
    setIsPasswordValid(isValid);
    setPasswordError(isValid ? '' : 'Şifre en az 8 karakter, bir büyük harf, bir küçük harf, bir rakam ve özel karakter içermelidir!');
  };

 
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });

    if (e.target.name === "password") {
      validatePassword(e.target.value);
    }
  };

  
  const generateStrongPassword = () => {
    const length = 12;
    const upperCaseChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lowerCaseChars = "abcdefghijklmnopqrstuvwxyz";
    const digitChars = "0123456789";
    const specialChars = "@#$%^&*.,;:";

    let newPassword = '';
    newPassword += upperCaseChars.charAt(Math.floor(Math.random() * upperCaseChars.length));
    newPassword += lowerCaseChars.charAt(Math.floor(Math.random() * lowerCaseChars.length));
    newPassword += digitChars.charAt(Math.floor(Math.random() * digitChars.length));
    newPassword += specialChars.charAt(Math.floor(Math.random() * specialChars.length));

    const allChars = upperCaseChars + lowerCaseChars + digitChars + specialChars;
    for (let i = newPassword.length; i < length; i++) {
      newPassword += allChars.charAt(Math.floor(Math.random() * allChars.length));
    }

    newPassword = newPassword.split('').sort(() => 0.5 - Math.random()).join('');

    setGeneratedPassword(newPassword);
    setFormData({ ...formData, password: newPassword, confirmPassword: newPassword });
    setIsPasswordValid(true);
  };

 
  useEffect(() => {
    if (formData.password) {
      validatePassword(formData.password);
    }
  }, [formData.password]);

 
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (formData.password !== formData.confirmPassword) {
      setErrorMessage('Şifreler uyuşmuyor!');
      return;
    }

    if (!isPasswordValid) {
      setErrorMessage('Geçersiz şifre! Lütfen kurallara uygun bir şifre girin.');
      return;
    }

    try {
      const response = await axios.post('https://api.landmarkr.shop/api/user/register', {
        ad: formData.ad,
        soyad: formData.soyad,
        email: formData.email,
        password: formData.password,
      });

      if (response.status === 201) {
        alert('Hesap başarıyla oluşturuldu!');
        navigate('/login');
      }
    } catch (error) {
      setErrorMessage(error.response?.data || 'Kayıt sırasında hata oluştu!');
    }
  };

  return (
    <div className='register-container'>
      <div className='wrapper'>
        <form onSubmit={handleSubmit}>
          <h1>Hesap Oluştur!</h1>

          {errorMessage && <div className="error-message">{errorMessage}</div>}

          <div className="input-box">
            <h3>Ad</h3>
            <input type="text" name="ad" required value={formData.ad} onChange={handleChange} />
          </div>

          <div className="input-box">
            <h3>Soyad</h3>
            <input type="text" name="soyad" required value={formData.soyad} onChange={handleChange} />
          </div>

          <div className="input-box">
            <h3>E-posta Adresi</h3>
            <input type="email" name="email" required value={formData.email} onChange={handleChange} />
          </div>

          <div className="input-box">
            <h3>Parola</h3>
            <input type="password" name="password" required value={formData.password} onChange={handleChange} />
          </div>

          <div className="input-box">
            <h3>Parola Tekrar</h3>
            <input type="password" name="confirmPassword" required value={formData.confirmPassword} onChange={handleChange} />
          </div>

          {passwordError && <div className="password-error">{passwordError}</div>}

          <div className="generated-password">
            <button type="button" onClick={generateStrongPassword}>
              Güçlü Şifre Oluştur
            </button>
            {generatedPassword && <p>Oluşturulan Şifre: <strong>{generatedPassword}</strong></p>}
          </div>

          <div className="Hesap">
            <button type="submit">Hesap Oluştur</button>
          </div>

          <div className="login-link">
            <p>Hesabın var mı? <a href="/login">Giriş yapın</a></p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;

*/
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './HomePage.css';
import About from './Components/About';

const HomePage = () => {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="home-page">
      <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
        <div className="logo">LandMarkr</div>
        <div className="nav-links">
          <a href="#about">Hakkımızda</a>
          <a href="#contact">İletişim</a>
        </div>
        <div className="nav-buttons">
          <button onClick={() => navigate('/login')} className="nav-button">Giriş Yap</button>
          <button onClick={() => navigate('/register')} className="nav-button primary">Hemen Katıl</button>
        </div>
      </nav>

      <div className="hero-section">
        <div className="hero-overlay" />
        <div className="hero-content">
          <h1>Hayalindeki Yolculuğa <span>Hemen Başla</span></h1>
          <p>&#128509; &#128507; &#128745; Dünyanın en etkileyici yerleri oluşturmaya başla &#128745; &#128507; &#128509;<br />
          </p>
          <div className="buttons">
            <button onClick={() => navigate('/login')}>Hemen Keşfet</button>
            <button onClick={() => navigate('/register')} className="primary">Kayıt Ol</button>
          </div>
        </div>
      </div>

      <div className="features-section">
        <div className="feature">
          <i className="fas fa-map-marked-alt"></i>
          <h3>Kişiselleştirilmiş Favori Listesi</h3>
          <p>İlgi alanlarınıza özel bir favori listesi oluşturun ve tatilinizi kişiselleştirin!</p>
        </div>
        <div className="feature">
          <i className="fas fa-calendar-check"></i>
          <h3>İstediğiniz Yerdeki Otelleri Bulma</h3>
          <p>Hayalinizdeki tatili birkaç tıklama ile bulup hemen planlamaya başlayın!</p>
        </div>
        <div className="feature">
          <i className="fas fa-star"></i>
          <h3>Güvenilir Değerlendirmeler</h3>
          <p>Güvenilir değerlendirmelerle en popüler mekanları keşfedin!</p>
        </div>
      </div>

      <div id="about">
        <About />
      </div>

      <footer className="footer" id="contact">
        <div className="footer-content">
          <div className="footer-section">
            <h4>LandMarkr</h4>
            <p>Hayalinizdeki yolculuğa çıkmanız için buradayız.</p>
            <div className="social-icons">
              <a href="#" aria-label="Facebook"><i className="fab fa-facebook-f" /></a>
              <a href="#" aria-label="Instagram"><i className="fab fa-instagram" /></a>
              <a href="#" aria-label="Twitter"><i className="fab fa-twitter" /></a>
            </div>
          </div>
          <div className="footer-section">
            <h4>Hızlı Bağlantılar</h4>
            <a href="#about">Hakkımızda</a>
            <a href="#contact">İletişim</a>
          </div>
          <div className="footer-section">
            <h4>İletişim </h4>
            <p><i className="fas fa-envelope"></i> info@landmarkr.com</p>
            <p><i className="fas fa-map-marker-alt"></i> İstanbul, Türkiye</p>
            <p><i className="fas fa-phone"></i> +90 212 123 45 67</p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2025 LandMarkr. Tüm Hakları Saklıdır.</p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;

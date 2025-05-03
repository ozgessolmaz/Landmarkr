import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Favorites.css';
import jsPDF from 'jspdf';

const Favorites = () => {
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const storedFavorites = JSON.parse(localStorage.getItem('favorites')) || [];
    setFavorites(storedFavorites);
  }, []);

  const removeFromFavorites = (destinationId) => {
    const updatedFavorites = favorites.filter(dest => dest.id !== destinationId);
    setFavorites(updatedFavorites);
    localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
  };

  const cleanText = (text) => {
    if (!text) return '';
    return text
      .replace(/ş/g, 's')
      .replace(/Ş/g, 'S')
      .replace(/ğ/g, 'g')
      .replace(/Ğ/g, 'G')
      .replace(/ü/g, 'u')
      .replace(/Ü/g, 'U')
      .replace(/ö/g, 'o')
      .replace(/Ö/g, 'O')
      .replace(/ç/g, 'c')
      .replace(/Ç/g, 'C')
      .replace(/ı/g, 'i')
      .replace(/İ/g, 'I');
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text(cleanText('Favori Rotalarim'), 10, 10);

    if (favorites.length === 0) {
      doc.text(cleanText('Favori yok.'), 10, 20);
    } else {
      favorites.forEach((dest, index) => {
        const y = 20 + index * 40;
        doc.setFontSize(14);
        doc.text(cleanText(`${index + 1}. ${dest.name}`), 10, y);
        if (dest.description) doc.text(cleanText(`Aciklama: ${dest.description}`), 10, y + 6);
        if (dest.rating) doc.text(cleanText(`Puan: ${dest.rating}`), 10, y + 12);
        if (dest.price) doc.text(cleanText(`Fiyat: ${dest.price}`), 10, y + 18);
        if (dest.duration) doc.text(cleanText(`Sure: ${dest.duration}`), 10, y + 24);
      });
    }

    doc.save('favoriler.pdf');
  };

  return (
    <div className="favorites-page">
      <nav className="navbar">
        <div className="nav-left">
          <span className="logo">Landmarkr</span>
        </div>
        <div className="nav-right">
          <button className="nav-button">Favorilerim</button>
          <button className="nav-button" onClick={() => navigate('/')}>Ana Sayfa</button>
          <button className="nav-button" onClick={() => navigate('/seyahat')}>Seyahat</button>
          <button className="nav-button" onClick={generatePDF}>PDF Olarak İndir</button>
        </div>
      </nav>

      <div className="favorites-container">
        <div className="favorites-header"></div>
        <div className="favorites-content">
          {favorites.length > 0 ? (
            <div className="favorites-grid">
              {favorites.map((destination) => (
                <div key={destination.id} className="favorite-card">
                  {destination.image && (
                    <img src={destination.image} alt={destination.name} className="favorite-image" />
                  )}
                  <div className="favorite-info">
                    <h3>{destination.name}</h3>
                    <p className="favorite-description">{destination.description}</p>
                    <div className="favorite-details">
                      <span>⭐ {destination.rating}</span>
                      <span>💰 {destination.price}</span>
                      <span>⏱️ {destination.duration}</span>
                    </div>
                    {destination.reviews && (
                      <div className="favorite-reviews">
                        <p>{destination.reviews}</p>
                      </div>
                    )}
                    {destination.distance && (
                      <div className="favorite-distance">
                        <p>{destination.distance}</p>
                      </div>
                    )}
                    {destination.website && destination.website !== 'Website bilgisi yok' && (
                      <div className="favorite-website">
                        <a href={destination.website} target="_blank" rel="noopener noreferrer">Website</a>
                      </div>
                    )}
                    {destination.phone && destination.phone !== 'Telefon bilgisi yok' && (
                      <div className="favorite-phone">
                        <p>📞 {destination.phone}</p>
                      </div>
                    )}
                    {destination.opening_hours && (
                      <div className="favorite-hours">
                        <h4>Çalışma Saatleri:</h4>
                        <ul>
                          {destination.opening_hours.map((hour, index) => (
                            <li key={index}>{hour}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {destination.types && destination.types.length > 0 && (
                      <div className="favorite-types">
                        <h4>Özellikler:</h4>
                        <ul>
                          {destination.types.map((type, index) => (
                            <li key={index}>{type}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    <button 
                      className="remove-favorite"
                      onClick={() => removeFromFavorites(destination.id)}
                    >
                      Favorilerden Çıkar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-favorites">
              <p>Henüz favori rotanız bulunmamaktadır.</p>
              <button className="explore-button" onClick={() => navigate('/seyahat')}>
                Rotaları Keşfet
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Favorites;

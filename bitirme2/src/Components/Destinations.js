import React, { useState } from 'react';
import './Destinations.css';

const Destinations = () => {
  const [destinations, setDestinations] = useState([
    {
      id: 1,
      name: 'Kapadokya',
      location: 'Nevşehir',
      description: 'Eşsiz peri bacaları ve balon turları ile ünlü doğa harikası.',
      image: 'https://images.unsplash.com/photo-1582972236019-e3d10d879b1d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
      rating: 4.8,
      price: '₺1500',
      duration: '3 gün',
      season: 'Tüm yıl',
      activities: ['Balon turu', 'ATV safari', 'Yürüyüş turları'],
      status: 'active'
    },
    {
      id: 2,
      name: 'Pamukkale',
      location: 'Denizli',
      description: 'Beyaz travertenleri ve antik havuzları ile ünlü doğal güzellik.',
      image: 'https://images.unsplash.com/photo-1591703291603-2150887a3db5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
      rating: 4.7,
      price: '₺1200',
      duration: '2 gün',
      season: 'Tüm yıl',
      activities: ['Traverten turu', 'Antik havuz', 'Hierapolis gezisi'],
      status: 'active'
    }
  ]);

  const [newDestination, setNewDestination] = useState({
    name: '',
    location: '',
    description: '',
    image: '',
    price: '',
    duration: '',
    season: '',
    activities: []
  });

  const handleAddDestination = () => {
    const destination = {
      ...newDestination,
      id: destinations.length + 1,
      rating: 0,
      status: 'active'
    };
    setDestinations([...destinations, destination]);
    setNewDestination({
      name: '',
      location: '',
      description: '',
      image: '',
      price: '',
      duration: '',
      season: '',
      activities: []
    });
  };

  const handleDeleteDestination = (id) => {
    setDestinations(destinations.filter(dest => dest.id !== id));
  };

  return (
    <div className="destinations-container">
      <div className="destinations-header">
        <h2>Destinasyon Yönetimi</h2>
        <button className="add-destination-btn" onClick={handleAddDestination}>
          Yeni Destinasyon Ekle
        </button>
      </div>

      <div className="destinations-form">
        <div className="form-group">
          <input
            type="text"
            placeholder="Destinasyon Adı"
            value={newDestination.name}
            onChange={(e) => setNewDestination({...newDestination, name: e.target.value})}
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            placeholder="Konum"
            value={newDestination.location}
            onChange={(e) => setNewDestination({...newDestination, location: e.target.value})}
          />
        </div>
        <div className="form-group">
          <textarea
            placeholder="Açıklama"
            value={newDestination.description}
            onChange={(e) => setNewDestination({...newDestination, description: e.target.value})}
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            placeholder="Resim URL"
            value={newDestination.image}
            onChange={(e) => setNewDestination({...newDestination, image: e.target.value})}
          />
        </div>
        <div className="form-row">
          <div className="form-group">
            <input
              type="text"
              placeholder="Fiyat"
              value={newDestination.price}
              onChange={(e) => setNewDestination({...newDestination, price: e.target.value})}
            />
          </div>
          <div className="form-group">
            <input
              type="text"
              placeholder="Süre"
              value={newDestination.duration}
              onChange={(e) => setNewDestination({...newDestination, duration: e.target.value})}
            />
          </div>
          <div className="form-group">
            <input
              type="text"
              placeholder="Sezon"
              value={newDestination.season}
              onChange={(e) => setNewDestination({...newDestination, season: e.target.value})}
            />
          </div>
        </div>
      </div>

      <div className="destinations-list">
        {destinations.map(destination => (
          <div key={destination.id} className="destination-card">
            <div className="destination-image">
              <img src={destination.image} alt={destination.name} />
            </div>
            <div className="destination-info">
            <h3>{destination.name}</h3>
              <p className="location">{destination.location}</p>
              <p className="description">{destination.description}</p>
              <div className="destination-details">
                <span>Fiyat: {destination.price}</span>
                <span>Süre: {destination.duration}</span>
                <span>Sezon: {destination.season}</span>
              </div>
              <div className="destination-actions">
                <button className="edit-btn">Düzenle</button>
                <button 
                  className="delete-btn"
                  onClick={() => handleDeleteDestination(destination.id)}
                >
                  Sil
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Destinations;

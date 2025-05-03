/*import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminPage.css';

const AdminPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('map');
  const [destinations, setDestinations] = useState([]);
  const [newDestination, setNewDestination] = useState({
    name: '',
    location: '',
    description: '',
    image: '',
    rating: 0,
    price: '',
    duration: '',
    season: '',
    activities: [],
    status: 'active'
  });
  const [selectedLocation, setSelectedLocation] = useState(null);

  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const markersRef = useRef([]);
  const apiKey = 'key';

  // Google Maps API'sini yükle
  useEffect(() => {
    const loadGoogleMaps = () => {
      return new Promise((resolve, reject) => {
        if (window.google && window.google.maps) {
          resolve(window.google);
        } else {
          const existingScript = document.querySelector('script[src*="maps.googleapis.com"]');
          if (existingScript) {
            existingScript.onload = () => resolve(window.google);
            return;
          }

          const script = document.createElement('script');
          script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}`;
          script.async = true;
          script.defer = true;
          script.onload = () => resolve(window.google);
          script.onerror = reject;
          document.head.appendChild(script);
        }
      });
    };

    const initMap = async () => {
      try {
        if (!mapRef.current) return;

        await loadGoogleMaps();

        const map = new window.google.maps.Map(mapRef.current, {
          center: { lat: 39, lng: 35 },
          zoom: 6,
        });
        mapInstance.current = map;

        map.addListener('click', (e) => {
          const location = {
            lat: e.latLng.lat(),
            lng: e.latLng.lng()
          };
          setSelectedLocation(location);

          markersRef.current.forEach(m => m.setMap(null));

          const marker = new window.google.maps.Marker({
            position: location,
            map,
            draggable: true,
          });

          marker.addListener('dragend', (e) => {
            const newLocation = {
              lat: e.latLng.lat(),
              lng: e.latLng.lng()
            };
            setSelectedLocation(newLocation);
          });

          markersRef.current = [marker];
        });

        destinations.forEach(dest => {
          const marker = new window.google.maps.Marker({
            position: dest.coordinates,
            map,
            title: dest.name,
            icon: {
              url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png"
            }
          });

          const infoWindow = new window.google.maps.InfoWindow({
            content: `
              <div style="padding: 10px;">
                <h3>${dest.name}</h3>
                <p>${dest.location}</p>
                <p>Fiyat: ${dest.price}</p>
                <p>Süre: ${dest.duration}</p>
              </div>
            `
          });

          marker.addListener('click', () => {
            infoWindow.open(map, marker);
          });

          markersRef.current.push(marker);
        });

      } catch (error) {
        console.error('Harita yüklenirken hata:', error);
      }
    };

    if (activeTab === 'map') {
      initMap();
    }

    return () => {
      markersRef.current.forEach(marker => marker.setMap(null));
      markersRef.current = [];
    };
  }, [activeTab, destinations]);

  const handleAddDestination = () => {
    if (!selectedLocation) return;

    const newDest = {
      ...newDestination,
      coordinates: selectedLocation,
      id: Date.now()
    };

    setDestinations([...destinations, newDest]);
    setNewDestination({
      name: '',
      location: '',
      description: '',
      image: '',
      rating: 0,
      price: '',
      duration: '',
      season: '',
      activities: [],
      status: 'active'
    });
    setSelectedLocation(null);
  };

  return (
    <div className="admin-page">
      <div className="admin-sidebar">
        <div className="admin-logo">LandMarkr Admin</div>
        <nav className="admin-nav">
          <button className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}>Dashboard</button>
          <button className={`nav-item ${activeTab === 'map' ? 'active' : ''}`} onClick={() => setActiveTab('map')}>Harita Yönetimi</button>
          <button className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`} onClick={() => setActiveTab('settings')}>Ayarlar</button>
        </nav>
      </div>

      <div className="admin-content">
        <header className="admin-header">
          <h1>Admin Paneli</h1>
          <button className="logout-btn" onClick={() => navigate('/')}>Çıkış Yap</button>
        </header>

        {activeTab === 'map' && (
          <div className="map-management">
            <div className="map-container" ref={mapRef} style={{ height: '500px' }}></div>
            <div className="map-controls">
              <h3>Yeni Destinasyon Ekle</h3>
              <div className="form-group">
                <label>Destinasyon Adı</label>
                <input type="text" value={newDestination.name} onChange={(e) => setNewDestination({ ...newDestination, name: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Konum</label>
                <input type="text" value={newDestination.location} onChange={(e) => setNewDestination({ ...newDestination, location: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Açıklama</label>
                <textarea value={newDestination.description} onChange={(e) => setNewDestination({ ...newDestination, description: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Fiyat</label>
                <input type="text" value={newDestination.price} onChange={(e) => setNewDestination({ ...newDestination, price: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Süre</label>
                <input type="text" value={newDestination.duration} onChange={(e) => setNewDestination({ ...newDestination, duration: e.target.value })} />
              </div>
              <button className="save-btn" onClick={handleAddDestination} disabled={!selectedLocation}>Destinasyon Ekle</button>
            </div>
          </div>
        )}

        {activeTab === 'dashboard' && (
          <div className="dashboard">
            <div className="stats-grid">
              <div className="stat-card">
                <h3>Toplam Destinasyon</h3>
                <p>{destinations.length}</p>
              </div>
              <div className="stat-card">
                <h3>Aktif Destinasyonlar</h3>
                <p>{destinations.filter(d => d.status === 'active').length}</p>
              </div>
              <div className="stat-card">
                <h3>Ortalama Puan</h3>
                <p>{(destinations.reduce((sum, dest) => sum + dest.rating, 0) / destinations.length || 0).toFixed(1)}</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="settings">
            <h2>Site Ayarları</h2>
            <div className="settings-form">
              <div className="form-group">
                <label>Site Başlığı</label>
                <input type="text" placeholder="LandMarkr" />
              </div>
              <div className="form-group">
                <label>Site Açıklaması</label>
                <textarea placeholder="Site açıklaması..."></textarea>
              </div>
              <button className="save-btn">Kaydet</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPage;
*/
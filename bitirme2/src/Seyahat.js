/* global google */
import React, { useState, useEffect, useRef } from 'react';
import './Seyahat.css';
import { useNavigate } from 'react-router-dom'; 


const transitHubs = {
  Train: { lat: 40.976, lng: 28.817 },
  Bus: { lat: 41.005, lng: 28.976 },
};

const Seyahat = () => {
  const navigate = useNavigate(); 
  const [yerler] = useState([]);        
  const [setFavoriler] = useState([]); 
  const [cityInput, setCityInput] = useState('');
  const [popularPlaces, setPopularPlaces] = useState([]);
  const [accommodations, setAccommodations] = useState([]);
  const [transportType, setTransportType] = useState('Train');
  const [favorites] = useState([]);

  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const markerInstance = useRef(null);
  const directionsServiceRef = useRef(null);
  const directionsRendererRef = useRef(null);

  const apiKey = 'key';

  useEffect(() => {
    const initMap = () => {
      const initialCoords = { lat: 39, lng: 35 };
      const map = new google.maps.Map(mapRef.current, {
        center: initialCoords,
        zoom: 5,
      });
      mapInstance.current = map;

      markerInstance.current = new google.maps.Marker({
        position: initialCoords,
        map: map,
      });

      directionsServiceRef.current = new google.maps.DirectionsService();
      directionsRendererRef.current = new google.maps.DirectionsRenderer();
      directionsRendererRef.current.setMap(map);
    };

    if (window.google && window.google.maps) {
      initMap();
    } else {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.addEventListener('load', initMap);
      document.head.appendChild(script);
    }
  }, [apiKey]);

  const calculateDistances = (hubCoords, places) => {
    const service = new google.maps.DistanceMatrixService();
    const origins = [hubCoords];
    const destinations = places.map(place => place.geometry.location);

    service.getDistanceMatrix(
      {
        origins,
        destinations,
        travelMode: google.maps.TravelMode.DRIVING,
        unitSystem: google.maps.UnitSystem.METRIC,
      },
      (response, status) => {
        if (status === google.maps.DistanceMatrixStatus.OK) {
          const distances = response.rows[0].elements;
          const updatedPlaces = places.map((place, index) => ({
            ...place,
            distanceText: distances[index].distance ? distances[index].distance.text : 'Bilinmiyor',
          }));
          setPopularPlaces(updatedPlaces);
        } else {
          console.error('Mesafe hesaplama hatası: ', status);
        }
      }
    );
  };

  const fetchAccommodations = (location) => {
    const service = new google.maps.places.PlacesService(mapInstance.current);
    service.nearbySearch(
      {
        location: location,
        radius: 5000,
        type: 'lodging',
      },
      (results, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
          setAccommodations(results);
        } else {
          console.error('Konaklama bulunamadı: ', status);
        }
      }
    );
  };

  const fetchPlaceDetails = (places) => {
    const service = new google.maps.places.PlacesService(mapInstance.current);
    places.forEach((place, index) => {
      service.getDetails({ placeId: place.place_id, fields: ['photos', 'rating', 'reviews'] }, (details, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
          setPopularPlaces(prev => {
            const updated = [...prev];
            updated[index] = { ...updated[index], ...details };
            return [...updated];
          });
        }
      });
    });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!cityInput.trim()) {
      alert('Lütfen bir şehir veya adres giriniz!');
      return;
    }
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ address: cityInput }, (results, status) => {
      if (status === 'OK' && results[0]) {
        const location = results[0].geometry.location;
        mapInstance.current.panTo(location);
        mapInstance.current.setZoom(12);
        markerInstance.current.setPosition(location);
        markerInstance.current.setAnimation(google.maps.Animation.BOUNCE);
        setTimeout(() => {
          markerInstance.current.setAnimation(null);
        }, 1500);

        const service = new google.maps.places.PlacesService(mapInstance.current);
        service.textSearch(
          {
            query: `popüler yerler ${cityInput}`,
            location: location,
            radius: 5000,
          },
          (results, status) => {
            if (status === google.maps.places.PlacesServiceStatus.OK) {
              const hubCoords = (transportType === 'Car') ? location : transitHubs[transportType];
              calculateDistances(hubCoords, results);
              setPopularPlaces(results);
              fetchPlaceDetails(results);
              fetchAccommodations(location);
            } else {
              alert(`Popüler yerler bulunamadı. Hata: ${status}`);
            }
          }
        );
      } else {
        alert(`Aradığınız konum bulunamadı. Hata: ${status}`);
      }
    });
  };

  const handlePlaceClick = (place) => {
    const destination = place.geometry.location;
    calculateRoute(destination);
  };

  const calculateRoute = (destination) => {
    if (!destination || !markerInstance.current) return;
    const origin = markerInstance.current.getPosition();
    const request = {
      origin,
      destination,
      travelMode: google.maps.TravelMode.DRIVING,
    };
    directionsServiceRef.current.route(request, (result, status) => {
      if (status === google.maps.DirectionsStatus.OK) {
        directionsRendererRef.current.setDirections(result);
      } else {
        console.error('Rota oluşturma hatası: ', status);
      }
    });
  };

  const handleAddToFavorites = (place) => {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    const newFavorite = {
      id: place.place_id,
      name: place.name,
      description: place.formatted_address || place.vicinity || 'Adres yok',
      image: place.photos && place.photos.length > 0 ? place.photos[0].getUrl({ maxWidth: 200, maxHeight: 150 }) : '',
      rating: place.rating || '0',
      price: 'Belirtilmemiş',
      duration: 'Belirtilmemiş',
      reviews: place.reviews && place.reviews.length > 0 ? place.reviews[0].text : 'Henüz yorum yapılmamış',
      distance: place.distanceText || 'Mesafe bilinmiyor',
      location: {
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng()
      },
      website: place.website || 'Website bilgisi yok',
      phone: place.formatted_phone_number || 'Telefon bilgisi yok',
      opening_hours: place.opening_hours ? place.opening_hours.weekday_text : ['Çalışma saatleri bilinmiyor'],
      types: place.types || [],
      vicinity: place.vicinity || 'Yakın çevre bilgisi yok'
    };

    if (!favorites.some(fav => fav.id === newFavorite.id)) {
      favorites.push(newFavorite);
      localStorage.setItem('favorites', JSON.stringify(favorites));
      alert(`${place.name} favorilere eklendi!`);
      navigate('/favorites');
    } else {
      alert('Bu yer zaten favorilerde!');
    }
  };
  const favorileriGetir = async () => {
    try {
      const res = await fetch('/api/favorites');
      const data = await res.json();
      setFavoriler(data);
    } catch (err) {
      console.error('Favoriler alınamadı:', err);
    }
  };

  useEffect(() => {
    favorileriGetir();
  }, []);

  const favoriyeEkle = async (yer) => {
    try {
      const res = await fetch('/api/favorites', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          placeId: yer.place_id,
          name: yer.name,
          address: yer.formatted_address || yer.vicinity || 'Adres yok',
        }),
      });

      if (res.ok) {
        alert(`${yer.name} favorilere eklendi!`);
        favorileriGetir(); 
      } else {
        alert('Ekleme başarısız.');
      }
    } catch (error) {
      console.error('Favoriye ekleme hatası:', error);
    }
  };
  
 

  return (
    <div className="page-container">
      <div ref={mapRef} className="map-container"></div>

      <div className="search-overlay">
        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            placeholder="Şehir veya adres giriniz..."
            value={cityInput}
            onChange={(e) => setCityInput(e.target.value)}
            className="input-field"
          />
          <div className="transport-mode-select">
            <label htmlFor="transportMode">Ulaşım Şekli:</label>
            <select
              id="transportMode"
              value={transportType}
              onChange={(e) => setTransportType(e.target.value)}
            >
              <option value="Train">Tren</option>
              <option value="Bus">Otobüs</option>
              <option value="Car">Araba</option>
            </select>
          </div>
          <button type="submit" className="search-btn">ARA</button>
        </form>
        {yerler.length > 0 && (
    <div className="places-list-overlay">
      <h2>Keşfedilecek Yerler</h2>
      <ul>
        {yerler.map((yer) => (
          <li key={yer.place_id}>
            {yer.name} - {yer.formatted_address}
            <button onClick={() => favoriyeEkle(yer)}>Favoriye Ekle</button>
          </li>
        ))}
      </ul>
    </div>
  )}

  {favorites.length > 0 && (
    <div className="favorites-list-overlay">
      <h2>Favori Yerler</h2>
      <ul>
        {favorites.map((fav, index) => (
          <li key={index}>
            <strong>{fav.name}</strong><br />
            {fav.formatted_address || fav.vicinity}
          </li>
        ))}
      </ul>
    </div>
  )}

 
        <button
          className="favorites-button"
          onClick={() => navigate('/favorites')}
          style={{ marginTop: '10px' }}
        >
          ⭐ Favorileri Gör
        </button>
      </div>

      {popularPlaces.length > 0 && (
        <div className="places-list-overlay">
          <h2>Popüler Yerler</h2>
          <ul>
            {popularPlaces.map((place, index) => (
              <li key={index} onClick={() => handlePlaceClick(place)}>
                <strong>{place.name}</strong><br />
                {place.photos && place.photos.length > 0 && (
                  <img
                    src={place.photos[0].getUrl({ maxWidth: 200, maxHeight: 150 })}
                    alt={place.name}
                    style={{ marginTop: '5px', borderRadius: '8px' }}
                  />
                )}
                <div>{place.formatted_address || place.vicinity}</div>
                {place.rating && <div>Puan: {place.rating} ⭐</div>}
                {place.reviews && place.reviews.length > 0 && (
                  <div style={{ marginTop: '5px' }}>
                    <em>"{place.reviews[0].text}"</em>
                  </div>
                )}
                {place.distanceText && <div>{place.distanceText} uzaklıkta</div>}

                <button onClick={(e) => {
                  e.stopPropagation();
                  handleAddToFavorites(place);
                }}>
                  ⭐ Favorilere Ekle
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {accommodations.length > 0 && (
        <div className="accommodations-list-overlay">
          <h2>Konaklama Önerileri</h2>
          <ul>
            {accommodations.map((hotel, index) => (
              <li key={index}>
                <strong>{hotel.name}</strong>
              </li>
            ))}
          </ul>
        </div>
      )}

      {favorites.length > 0 && (
        <div className="favorites-list-overlay">
          <h2>Favori Yerler</h2>
          <ul>
            {favorites.map((fav, index) => (
              <li key={index}>
                <strong>{fav.name}</strong><br />
                {fav.formatted_address || fav.vicinity}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Seyahat;

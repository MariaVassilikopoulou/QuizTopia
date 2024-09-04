import { useState, useEffect } from 'react';
import leaflet from 'leaflet';
import 'leaflet/dist/leaflet.css';
import '../Map/MapComponent.css';

const MapComponent = ({ questions, onMapClick }) => {
  const [position, setPosition] = useState(null);
  const [map, setMap] = useState(null);

  const getPosition = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        setPosition(position.coords);
      });
    }
  };

  useEffect(() => {
    getPosition();
  }, []);

  useEffect(() => {
    if (position && !map) {
      const myMap = leaflet.map('map').setView([position.latitude, position.longitude], 15);

      leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(myMap);

      setMap(myMap);

      myMap.on('click', (event) => {
        const { lat, lng } = event.latlng;
        onMapClick({ latitude: lat.toString(), longitude: lng.toString() });

        const marker = leaflet.marker([lat, lng]).addTo(myMap);
        marker.bindPopup('Click to add question').openPopup();
      });
    }

    if (map) {
      map.setView([position.latitude, position.longitude]);
    }
  }, [position, map, onMapClick]);

  useEffect(() => {
    if (map) {
      questions.forEach((question) => {
        if (question.location && question.location.latitude && question.location.longitude) {
          const marker = leaflet.marker([
            parseFloat(question.location.latitude),
            parseFloat(question.location.longitude)
          ]).addTo(map);

          marker.bindPopup(`<strong>${question.question}</strong><br/>${question.answer}`);
        }
      });
    }
  }, [questions, map]);

  return (
    <div>
      <section id="map" style={{ height: '400px' }}></section>
    </div>
  );
};

export default MapComponent;
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
    if (position) {
      if (!map) {
        const myMap = leaflet.map('map').setView([position.latitude, position.longitude], 15);

        leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19,
          attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        }).addTo(myMap);

        setMap(myMap);

        myMap.on('click', (event) => {
          const { lat, lng } = event.latlng;
          onMapClick({ latitude: lat.toString(), longitude: lng.toString() });

          // Add marker and popup at clicked position
          const marker = leaflet.marker([lat, lng]).addTo(myMap);
          marker.bindPopup('Click to add question').openPopup();
        });

        // Add markers for existing questions
        questions.forEach((question) => {
          if (question.coords) {
            const { latitude, longitude } = question.coords;
            leaflet.marker([parseFloat(latitude), parseFloat(longitude)]).addTo(myMap)
              .bindPopup(`<strong>${question.text}</strong><br/>${question.answer}`);
          }
        });
      } else {
        map.setView([position.latitude, position.longitude]);
      }
    }
  }, [position, map, questions, onMapClick]);

  useEffect(() => {
    getPosition();
  }, []);

  return (
    <div>
      <section id="map" style={{ height: '400px' }}></section>
    </div>
  );
};

export default MapComponent;

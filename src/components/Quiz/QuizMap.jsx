import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { getQuizDetails } from '../../utils/api'; // Import the getQuizDetails function

function QuizMap({ userId, quizId, onMapClick }) {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mapCenter, setMapCenter] = useState([59.3293, 18.0686]); // Default center

  useEffect(() => {
   
    const fetchQuizDetails = async () => {
      try {
        const token = sessionStorage.getItem('authToken');
        if (!token) {
          throw new Error('No authentication token found');
        }
        const quizData = await getQuizDetails(userId, quizId, token); 
        console.log('Fetched quiz data:', quizData); 
        setQuestions(quizData.quiz.questions || []); 

        // Update map center based on the first question's location
        if (quizData.quiz.questions && quizData.quiz.questions.length > 0) {
          const firstQuestion = quizData.quiz.questions[0];
          const { latitude, longitude } = firstQuestion.location;
          if (latitude && longitude) {
            setMapCenter([parseFloat(latitude), parseFloat(longitude)]);
          }
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchQuizDetails();
  }, [userId, quizId]);

  if (loading) {
    return <div>Loading questions...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }


  const MapClickHandler = () => {
    useMapEvents({
      click: (e) => {
        const { lat, lng } = e.latlng;
        onMapClick({ latitude: lat.toString(), longitude: lng.toString() });
      },
    });
    return null;
  };

  return (
    <MapContainer center={mapCenter} zoom={13} style={{ height: '100vh', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <MapClickHandler />
      {questions.map((q, index) => (
        q.location && q.location.latitude && q.location.longitude ? (
          <Marker
            key={index}
            position={[parseFloat(q.location.latitude), parseFloat(q.location.longitude)]}
          >
            <Popup>
              <strong>{q.question}</strong>
              <p>{q.answer}</p>
            </Popup>
          </Marker>
        ) : null
      ))}
    </MapContainer>
  );
}

export default QuizMap;




/*import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useParams } from 'react-router-dom'; // For getting URL params

function QuizMap({ onMapClick }) {
  const { quizId } = useParams(); // Get quizId from URL parameters
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mapCenter, setMapCenter] = useState([59.3293, 18.0686]); // Default center (Stockholm)

  useEffect(() => {
    // Mock data for testing
    const mockQuestions = [
      {
        question: 'What is the capital of France?',
        answer: 'Paris',
        location: { latitude: '48.8566', longitude: '2.3522' } // Coordinates for Paris
      }
    ];

    setQuestions(mockQuestions);
    setMapCenter([48.8566, 2.3522]); // Set map center to Paris for testing
    setLoading(false);
  }, [quizId]);

  if (loading) {
    return <div>Loading questions...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  // Component to handle map clicks
  const MapClickHandler = () => {
    useMapEvents({
      click: (e) => {
        const { lat, lng } = e.latlng;
        onMapClick({ latitude: lat.toString(), longitude: lng.toString() });
      }
    });
    return null;
  };

  return (
    <MapContainer center={mapCenter} zoom={13} style={{ height: '100vh', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <MapClickHandler />
      {questions.map((q, index) => (
        <Marker
          key={index}
          position={[parseFloat(q.location.latitude), parseFloat(q.location.longitude)]}
        >
          <Popup>
            <strong>{q.question}</strong>
            <p>{q.answer}</p>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}

export default QuizMap;*/




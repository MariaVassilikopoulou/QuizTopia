import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { getQuizDetails } from '../../utils/api'; // Import your API functions

function QuizMap() {
  const { quizId } = useParams();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mapCenter, setMapCenter] = useState([59.3293, 18.0686]); // Default center (Stockholm)

  useEffect(() => {
    const fetchQuizDetails = async () => {
      const token = sessionStorage.getItem('token');
      const userId = sessionStorage.getItem('userId');

      if (!token || !userId) {
        console.error("No authentication token or user ID found");
        setError('No authentication token or user ID found');
        setLoading(false);
        return;
      }

      try {
        const quizData = await getQuizDetails(userId, quizId);

        if (quizData.success && quizData.quiz) {
          const questions = quizData.quiz.questions || [];
          setQuestions(questions);

          if (questions.length > 0) {
            const firstQuestion = questions[0];
            const { latitude, longitude } = firstQuestion.location || {};
            if (latitude && longitude) {
              setMapCenter([parseFloat(latitude), parseFloat(longitude)]);
            }
          }
        } else {
          throw new Error('Invalid quiz data received');
        }
      } catch (err) {
        console.error("Failed to fetch quiz details:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchQuizDetails();
  }, [quizId]);

  if (loading) {
    return <div>Loading questions...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <MapContainer center={mapCenter} zoom={13} style={{ height: '100vh', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
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

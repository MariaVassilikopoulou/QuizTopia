import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

function QuizMap() {
  const { quizId, userId } = useParams();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mapCenter, setMapCenter] = useState([57.7089, 11.9746])

  useEffect(() => {
    const fetchQuizDetails = async () => {
      const token = sessionStorage.getItem("token");
  
      if (!token || !userId || !quizId) {
        console.error("Missing required parameters");
        setLoading(false); 
        return;
      }

      try {
        const url = `https://fk7zu3f4gj.execute-api.eu-north-1.amazonaws.com/quiz/${userId}/${quizId}`; 
        const response = await fetch(url, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch quiz details");
        }

        const quizData = await response.json();
        setQuestions(quizData.quiz.questions || []);
      } catch (error) {
        console.error("Error fetching quiz details:", error);
        setError(error.message); 
      } finally {
        setLoading(false); 
      }
    };

    fetchQuizDetails();
  }, [quizId, userId]); 

  if (loading) {
    return <div>Loading questions...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <MapContainer center={mapCenter} zoom={10} style={{ height: '100vh', width: '100%' }}>
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

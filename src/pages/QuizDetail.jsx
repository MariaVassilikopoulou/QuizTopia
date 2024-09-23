import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect} from "react";
import MapComponent from "../components/Map/MapComponent";
import {  getQuizDetails, addQuestionToQuiz } from "../utils/api";

function QuizDetail() {
  const { quizId } = useParams();
  const [questions, setQuestions] = useState([]);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [userId, setUserId] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


const navigate= useNavigate();

  const addQuestionHandler = async () => {
    if (!latitude || !longitude) {
      alert("Please click on the map to select a location.");
      return;
    }

    if (!question || !answer) {
      alert("Please enter both a question and an answer.");
      return;
    }

    const token = sessionStorage.getItem("token");
    const currentUserId = sessionStorage.getItem("userId");

    if (!token || !currentUserId) {
      console.error("Missing token or userId when adding question.");
      return;
    }

    let newQuestion = {
      name: quizId,
      question: question,
      answer: answer,
      location: {
        longitude: longitude,
        latitude: latitude,
      },
    };

    try {
      const data = await addQuestionToQuiz(newQuestion, token);
      console.log("Response:", data);

      setQuestions((prevQuestions) => [
        ...prevQuestions,
        {
          question: question,
          answer: answer,
          location: { latitude, longitude },
        },
      ]);
      setQuestion("");
      setAnswer("");
    } catch (error) {
      console.error("Failed to add question:", error);
    }
  };

  useEffect(() => {
    const fetchQuizDetails = async () => {
      const token = sessionStorage.getItem("token");
      const userId = sessionStorage.getItem("userId");

      if (!token || !userId) {
        console.error("No token or userId found in session storage.");
        setError("No token or userId found");
        setLoading(false);
        return;
      }

     try {
       const quizData = await getQuizDetails(userId, quizId);
     
        setQuestions(quizData.quiz.questions || []);
        setUserId(userId);
        setQuestion("");
        setAnswer("");
      } catch (err) {
        console.error("Failed to fetch quiz details:", err);
      }
    };

   
fetchQuizDetails();
}, [quizId]);



  const handleMapClick = (coords) => {
    setLatitude(coords.latitude);
    setLongitude(coords.longitude);
  };

  const handleNavigateToQuizes= ()=>{
    navigate("/quizes");
  };
  return (
    <div className="detail-page">
      
      <div className="quiz-details">
        <input 
          className="form-input"
          type="text"
          placeholder="Question"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />
        <input
        className="form-input"
          type="text"
          placeholder="Answer"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
        />
        <button className="submit-btn" onClick={addQuestionHandler}>Add question</button>
        <button  className="submit-btn" onClick={handleNavigateToQuizes}>Quizes</button>
      </div>
      
      <div className="themap">
      <MapComponent questions={questions} onMapClick={handleMapClick} />
      </div>
    
    </div>
  );
}

export default QuizDetail;

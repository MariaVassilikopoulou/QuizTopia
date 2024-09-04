import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import MapComponent from "../components/Map/MapComponent";
import { getQuizDetails, addQuestionToQuiz } from "../utils/api";

function QuizDetail() {
  const { quizId } = useParams();
  const [questions, setQuestions] = useState([]);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [userId, setUserId] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");

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
      const storedUserId = sessionStorage.getItem("userId");

      if (!token || !storedUserId) {
        console.error("No token or userId found in session storage.");
        return;
      }

      try {
        const quizData = await getQuizDetails(storedUserId, quizId);
        setQuestions(quizData.quiz.questions || []);
        setUserId(storedUserId);
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

  return (
    <div>
      <h1>Quiz Details</h1>
      <div>
        <input
          type="text"
          placeholder="Question"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />
        <input
          type="text"
          placeholder="Answer"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
        />
        <button onClick={addQuestionHandler}>Add question</button>
      </div>
      <MapComponent questions={questions} onMapClick={handleMapClick} />
    </div>
  );
}

export default QuizDetail;

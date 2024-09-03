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
  const [latitude, setLatitude]= useState("");
  const [longitude, setLongitude]= useState("");
  // const [loading, setLoading] = useState(true);
  // const [error, setError] = useState(null);

  // to do: add longitude and latitude
  /*const addQuestionHandler = async () => {
    let newQuestion = {
      name: quizId,
      question: question,
      answer: answer,
      location: {
        longitude: longitude,
        latitude: latitude,
      },
    };
    console.log(newQuestion);
    const token = sessionStorage.getItem("token");
    const data = await addQuestionToQuiz(newQuestion, token);
    console.log(data);
    sessionStorage.setItem("userId", userId);
    setUserId(data.quiz.Attributes.userId);
  };

  useEffect(() => {
    const fetchQuizDetails = async () => {
      console.log(quizId);
      console.log(userId);

      try {
        const token = sessionStorage.getItem("token");
        if (!token) {
          return;
        }

        if (!userId) {
          return;
        }

        const quizData = await getQuizDetails(userId, quizId);
        setQuestions(quizData.quiz.Attributes.questions || []);
        setQuestion("");
        setAnswer("");
      } catch (err) {
        console.error("Failed to fetch quiz details:", err);
      }
      
    };

    fetchQuizDetails();
  }, [userId]);



  const handleMapClick = (coords) => {
   setLatitude(latitude);
   setLatitude(longitude);
  };*/

  const addQuestionHandler = async () => {
    if (!latitude || !longitude) {
      alert("Please click on the map to select a location.");
      return;
    }

    if (!question || !answer) {
      alert("Please enter both a question and an answer.");
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

    console.log("Adding Question:", newQuestion);
    
    const token = sessionStorage.getItem("token");
    try {
      const data = await addQuestionToQuiz(newQuestion, token);
      console.log("Response:", data);

      setQuestions((prevQuestions) => [
        ...prevQuestions,
        {
          text: question,
          answer: answer,
          coords: { latitude, longitude },
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
      console.log("Fetching Quiz Details for:", quizId);

      try {
        const token = sessionStorage.getItem("token");
        if (!token) {
          console.error("No token found in session storage.");
          return;
        }

        const quizData = await getQuizDetails(userId, quizId);
        setQuestions(quizData.quiz.Attributes.questions || []);
        setQuestion("");
        setAnswer("");
      } catch (err) {
        console.error("Failed to fetch quiz details:", err);
      }
    };

    if (userId) {
      fetchQuizDetails();
    }
  }, [userId]);

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
        {/* <button onClick={handleSaveQuestion}>Save Question</button> */}
      </div>
      {/* Render the MapComponent with questions and callback to handle map clicks */}
      <MapComponent questions={questions} onMapClick={handleMapClick} />
    </div>
  );

}
export default QuizDetail;

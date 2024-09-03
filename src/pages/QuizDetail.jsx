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
  // const [loading, setLoading] = useState(true);
  // const [error, setError] = useState(null);

  // to do: add longitude and latitude
  const addQuestionHandler = async () => {
    let newQuestion = {
      name: quizId,
      question: question,
      answer: answer,
      location: {
        longitude: "",
        latitude: "",
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

  // const handleSaveQuestion = async () => {

  //   const newQuestion = {
  //     question: question,
  //     answer: answer,
  //     location: { latitude: '', longitude: '' },
  //   };

  //   try {
  //     const token = sessionStorage.getItem('token');
  //     const userId = sessionStorage.getItem('userId');
  //     if (!token) {
  //       throw new Error('No authentication token found');
  //     }

  //     if (!userId) {
  //       throw new Error('No user ID found');
  //     }

  //     await addQuestionToQuiz(newQuestion, token);
  //     const updatedQuiz = await getQuizDetails(userId, quizId, token);
  //     setQuestions(updatedQuiz.quiz?.questions || []);
  //     setQuestion('');
  //     setAnswer('');
  //   } catch (err) {
  //     console.error('Error saving question:', err);
  //     setError(err.message);
  //   }
  // };

  const handleMapClick = (coords) => {
    const index = questions.findIndex(
      (q) => q.location.latitude === "" && q.location.longitude === ""
    );
    if (index !== -1) {
      const updatedQuestions = [...questions];
      updatedQuestions[index] = {
        ...updatedQuestions[index],
        location: coords,
      };
      setQuestions(updatedQuestions);
      console.log(questions);
    }
  };

  // if (loading) {
  //   return <div>Loading quiz details...</div>;
  // }

  // if (error) {
  //   return <div>Error: {error}</div>;
  // }

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

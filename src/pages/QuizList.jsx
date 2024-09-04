import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchQuizzes } from '../utils/api'; // Ensure this function is updated to match your API

function QuizList() {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuizzesData = async () => {
      try {
        const data = await fetchQuizzes(); // Call the API function to fetch quizzes
        if (data.success) {
          setQuizzes(data.quizzes || []);
        } else {
          throw new Error('API response error');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchQuizzesData();
  }, []);

  const handleShowQuiz = (quizId) => {
    navigate(`/quiz/${quizId}`);
  };

  if (loading) {
    return <div>Loading quizzes...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1>All Quizzes</h1>
      <ul>
        {quizzes.map((quiz) => (
          <li key={quiz.quizId}>
            <strong>{quiz.quizId || 'Unnamed Quiz'}</strong> - Created by {quiz.username || 'Unknown User'}
            <button onClick={() => handleShowQuiz(quiz.quizId)}>Show Quiz</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default QuizList;

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchQuizzes } from '../utils/api'; 

function QuizList() {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuizzesData = async () => {
      try {
        const quizData = await fetchQuizzes(); 
        setQuizzes(quizData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
   
    fetchQuizzesData();
  }, []);

  const handleShowQuiz = (userId, quizId) => {
    console.log("Showing quiz for user:", userId, "Quiz ID:", quizId);
    navigate(`/quiz/${userId}/${quizId}`);
  };

  if (loading) {
    return <div>Loading quizzes...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    
    <div className="page-container">
   
        <article >
      
      <ul className="quiz-grid" >
    
        {quizzes.map((quiz) => (
          
          <li className="quiz-item create-account-form" key={quiz.quizId}>
          <h3>Quiz</h3>
          <strong >Name:{quiz.quizId || 'Unnamed Quiz'}</strong>
          <strong style={{ padding: '23px' }}> 
           By: {quiz.username || 'Unknown User'}
           </strong>
            <button className="submit-btn" onClick={() => handleShowQuiz(quiz.userId, quiz.quizId)}>Show Quiz</button>
          </li>
        ))}
      </ul>
      </article>
      </div>
  );
}

export default QuizList;

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // To navigate to the quiz detail page

const BASE_URL = 'https://fk7zu3f4gj.execute-api.eu-north-1.amazonaws.com';

function QuizList() {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); 

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const token = sessionStorage.getItem('token'); // Retrieve token from local storage
        if (!token) {
          throw new Error('No authentication token found');
        }

        // Fetch userId
       /* const userIdResponse = await fetch(`${BASE_URL}/account`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });
        if (!userIdResponse.ok) {
          throw new Error('Failed to fetch user details');
        }
        const userIdData = await userIdResponse.json();
        const userId = userIdData.account.userId;*/
        
        // Fetch quizzes
        const response = await fetch(`${BASE_URL}/quiz`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch quizzes');
        }
        const data = await response.json();
        console.log('Fetched quizzes:', data);

        if (data.success && Array.isArray(data.quizzes)) {
          setQuizzes(data.quizzes);
        } else {
          throw new Error('Unexpected API response structure');
        }
      } catch (err) {
        console.error('Error fetching quizzes:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, []);


  const handleShowQuiz = (quizId) => {
    // Navigate to the quiz detail page with the quizId
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

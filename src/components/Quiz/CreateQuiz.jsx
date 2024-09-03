import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createQuiz } from "../../utils/api"; 

function CreateQuiz() {
  const [quizName, setQuizName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setQuizName(e.target.value);
  };

  
  const handleCreateQuiz = async () => {
    if (!quizName) {
      alert("Quiz name cannot be empty");
      return;
    }

    setLoading(true);
    setError(null);

    const token = sessionStorage.getItem('token');
    
    if (!token) {
      alert('You need to be logged in to create a quiz. Please log in again.');
      navigate('/login');
      return;
    }

    try {
      const response = await createQuiz({ name: quizName }, token);

      if (response.success) {
        const newQuizId = response.quizId;
        navigate(`/details/${newQuizId}`);
      } else {
        throw new Error(response.message || 'Failed to create quiz');
      }
    } catch (err) {
      setError(err.message);
      console.error('Error creating quiz:', err);
    } finally {
      setLoading(false);
    }

    setQuizName('');
  };

  return (
    <div>
      <h2>Create a New Quiz</h2>
      <input
        type="text"
        placeholder="Name your Quiz"
        value={quizName}
        onChange={handleInputChange}
        disabled={loading}  
      />
      <button onClick={handleCreateQuiz} disabled={loading}>
        {loading ? 'Creating...' : 'Create Quiz'}
      </button>

      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
    </div>
  );
}

export default CreateQuiz;

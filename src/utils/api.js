

export const fetchQuizzes = async () => {
  try {
    const response = await fetch('https://fk7zu3f4gj.execute-api.eu-north-1.amazonaws.com/quiz');
    if (!response.ok) {
      throw new Error('Failed to fetch quizzes');
    }
    const data = await response.json();
    console.log('Fetched quizzes:', data);
    return data;
  } catch (error) {
    console.error('Error fetching quizzes:', error);
    throw error;
  }
};


export async function login(username, password) {
  try {
    const response = await fetch('https://fk7zu3f4gj.execute-api.eu-north-1.amazonaws.com/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      throw new Error('Login request failed');
    }

    const data = await response.json();
    if (data.success && data.token) {
      sessionStorage.setItem('token', data.token); 
      const userId = await fetchUserId(data.token); 
      sessionStorage.setItem('userId', userId); 
      return { token: data.token, userId };
    } else {
      throw new Error('Failed to login');
    }
  } catch (error) {
    console.error('Error logging in:', error);
    throw error;
  }
}


// Create quiz function
export const createQuiz = async (quizData, token) => {
  try {
    const response = await fetch('https://fk7zu3f4gj.execute-api.eu-north-1.amazonaws.com/quiz', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(quizData),
    });
    console.log('Raw response:', response);
    console.log('Response status:', response.status);
    console.log('Response headers:', response.headers);
    if (!response.ok) {
      const responseBody = await response.text();
      console.error('Error response from server:', responseBody);
      throw new Error('Failed to create quiz');
    }

    const data = await response.json();
    console.log('Quiz created successfully:', data);
    return data;
  } catch (error) {
    console.error('Error creating quiz:', error);
    throw error;
  }
};


export const fetchUserId = async (token) => {
  try {
    const response = await fetch('https://a1voqdpubd.execute-api.eu-north-1.amazonaws.com/account', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch user details');
    }

    const data = await response.json();
    if (data.success && data.account && data.account.userId) {
      return data.account.userId;
    } else {
      throw new Error('Failed to fetch user ID');
    }
  } catch (error) {
    console.error('Error fetching user ID:', error);
    throw error;
  }
}


export const getQuizDetails = async (userId, quizId) => {
  console.log(`Fetching quiz details with userId: ${userId}, quizId: ${quizId}`);
  try {
    const token = sessionStorage.getItem("token");
    if (!token) {
      throw new Error('No token found in session storage.');
    }

  
    const response = await fetch(`https://fk7zu3f4gj.execute-api.eu-north-1.amazonaws.com/quiz/${userId}/${quizId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      const responseBody = await response.text();
      console.error('Error response from server:', responseBody);
      throw new Error('Failed to fetch quiz details');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching quiz details:', error);
    throw error;
  }
};



// Add question to quiz function
export const addQuestionToQuiz = async (questionData, token) => {
  try {
    const response = await fetch('https://fk7zu3f4gj.execute-api.eu-north-1.amazonaws.com/quiz/question', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(questionData),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to add question');
    }

    return data;
  } catch (error) {
    console.error('Error adding question:', error);
    throw error;
  }
}

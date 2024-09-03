import { useState } from "react";

export default function CreateAccount() {
   
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null); 
    
    const handleSubmit = async (event) => {
        event.preventDefault(); 

        const userData = { username, password };
        
        try {
           
            const response = await fetch('https://a1voqdpubd.execute-api.eu-north-1.amazonaws.com/auth/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData) 
            });

           
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Something went wrong'); 
            }

            
            const data = await response.json();
            console.log('Account created successfully:', data);
            setError(null);
        } catch (error) {
            console.error('Error creating account:', error);
      setError(error.message);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <label>
                Användarnamn:
                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)} 
                />
            </label>
            <label>
                Lösenord:
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)} 
                />
            </label>
            <button type="submit">Create Account</button>

            {error && <p style={{ color: 'red' }}>{error}</p>}
        </form>
    );
}

import { useState } from "react";

import "../../App.css"
export default function CreateAccount() {
   
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null); 
    const [successful, setSuccessful]= useState(null);

    const handleSubmit = async (event) => {
        event.preventDefault(); 


       
        const userData = { username, password };
        
        try {
           
            const response = await fetch('https://fk7zu3f4gj.execute-api.eu-north-1.amazonaws.com/auth/signup', {
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
            setSuccessful("Account successfully created!");
            setUsername(''); 
            setPassword('');
        } catch (error) {
            console.error('Error creating account:', error);
      setError(error.message);
      setSuccessful(null);
        }
    };

    return (
        <div className="page-container">
        <article>
        <form onSubmit={handleSubmit} className="create-account-form">
        <label className="form-label">
           
            <input
            placeholder="Username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)} 
                className="form-input"
            />
        </label>
        <label className="form-label">
          
            <input
            placeholder="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)} 
                className="form-input"
            />
        </label>
        <button type="submit" className="submit-btn">Create Account</button>

        {error && <p className="error-text">{error}</p>}
        {successful && <p className="error-text">{successful}</p>}
    </form>
    </article>
    </div>
);
}
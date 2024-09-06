import { jwtDecode } from 'jwt-decode';

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import SecretTunnel from "./SecretTunnel"; 

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loggedIn, setLoggedIn] = useState(false); 
    const navigate = useNavigate(); 
    const [loginError, setLoginError] = useState('');
   
    const handleSubmit = async (event) => {
        event.preventDefault();
        const userData = { username, password };
        const API_URL = "https://a1voqdpubd.execute-api.eu-north-1.amazonaws.com/auth/login";
        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            });
            if (!response.ok) {
                throw new Error('Login request failed');
            }
            const data = await response.json();
            console.log("Login API response data:", data);

            const decodedToken = jwtDecode(data.token);
            const userId = decodedToken.id; 

            sessionStorage.setItem('token', data.token);
            sessionStorage.setItem('userId', userId);

            console.log("Logged in userId:", userId);
            setLoggedIn(true); 
            navigate('/create'); 
        } catch (error) {
            setLoginError('Login failed. Please check your credentials.');
            console.error(error);
        }
    }

    return (
        <div className="page-container">
        <article>
            <form onSubmit={handleSubmit} className="create-account-form">
                <label className="form-label" >
                   
                    <input
                    placeholder='Username'
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                     className="form-input"

                    />
                </label>
                <label className="form-label">
                  
                    <input
                    placeholder='Password'
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="form-input"
                    />
                </label>
                <button type="submit" className="submit-btn">Logga in</button>
            </form>
            {loggedIn && <SecretTunnel />}
            {loginError && <p className="error-text">{loginError}</p>}
        </article>
        </div>
    );
}

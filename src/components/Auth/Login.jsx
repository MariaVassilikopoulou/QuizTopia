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
            sessionStorage.setItem('token', data.token);
            sessionStorage.setItem('userId', userData.username);
            setLoggedIn(true); 
            navigate('/create'); 
        } catch (error) {
            setLoginError('Login failed. Please check your credentials.');
            console.error(error);
        }
    }

    return (
        <article>
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
                <button type="submit">Logga in</button>
            </form>
            {loggedIn && <SecretTunnel />}
            {loginError && <p>{loginError}</p>}
        </article>
    );
}

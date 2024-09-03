import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function SecretTunnel({ children }) {
    const [loggedIn, setLoggedIn] = useState(false);
    const [username, setUsername] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const checkToken = async () => {
            const token = sessionStorage.getItem('token') || '';
            if (token.length > 0) {
                try {
                    const response = await fetch('https://a1voqdpubd.execute-api.eu-north-1.amazonaws.com/account', {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        }
                    });
                    const data = await response.json();
                    if  (data.success && data.account && data.account.username) {
                        setLoggedIn(true);
                        setUsername(data.account.username);
                    } else {
                        setLoggedIn(false);
                        navigate('/'); 
                    }
                } catch (error) {
                    console.error('Error checking token:', error);
                    setLoggedIn(false);
                    navigate('/');
                }
            } else {
                setLoggedIn(false);
                navigate('/'); 
            }
        };
        checkToken();
    }, [navigate]);

    return (
        <>
            {loggedIn ? children : <p>Du är inte inloggad</p>}
        </>
    );
}

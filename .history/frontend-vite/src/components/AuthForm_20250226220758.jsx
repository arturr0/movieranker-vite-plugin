import React, { useState } from 'react';

const AuthForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);

    const handleFormSubmit = async (event, endpoint) => {
        event.preventDefault();

        console.log(`Attempting to ${endpoint} with email:`, email);
        if (email.trim() === '' || password.trim() === '') return;

        try {
            const response = await fetch(`http://localhost:3000/auth/${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            console.log(`Response status: ${response.status}`);

            const data = await response.json();
            console.log('Server response:', data);

            if (!response.ok) {
                setError(data.error || `${endpoint} failed!`);
                return;
            }

            if (data.token) {
                console.log('Token received:', data.token);
                localStorage.setItem('jwt', data.token);

                if (endpoint === 'login') {
                    window.location.href = '/movies';
                } else {
                    alert('Account created successfully! Please log in.');
                    setEmail('');
                    setPassword('');
                }
            } else {
                setError('Unexpected response. No token received.');
            }
        } catch (error) {
            console.error('Error during authentication:', error);
            setError('An error occurred. Check the console.');
        }
    };

    return (
        <div>
            <h2>Login or Sign Up</h2>
            <form>
                <div>
                    <label>Email:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="button" onClick={(e) => handleFormSubmit(e, 'login')}>
                    Log In
                </button>
                <button type="button" onClick={(e) => handleFormSubmit(e, 'register')}>
                    Sign Up
                </button>
                {error && <p style={{ color: 'red' }}>{error}</p>}
            </form>
        </div>
    );
};

export default AuthForm;

// src/App.jsx
import React from 'react';
import AuthForm from './components/AuthForm';

function App() {
    return (
        <div>
            <h1>Authentication</h1>
            {/* Pass 'login' or 'register' based on which form you need */}
            <AuthForm endpoint="login" />
            {/* Or for sign up */}
            {/* <AuthForm endpoint="register" /> */}
        </div>
    );
}

export default App;

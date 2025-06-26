// src/App.jsx
import React from 'react';
import AuthForm from './components/AuthForm';
import Movies from './components/Movies';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
    return (
        <Router>
            <div>
                <h1>Welcome to Vite App with React Router</h1>
                <Routes>
                    <Route path="/" element={<AuthForm />} />
                    <Route path="/movies" element={<Movies />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;

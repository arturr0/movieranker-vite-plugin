// src/App.jsx
import React from 'react';
import AuthForm from './components/AuthForm';
import Movies from './components/AuthForm';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
    return (
<Router>
            <div>
                <Routes>
                    <Route path="/" element={<AuthForm />} />
                    <Route path="/movies" element={<Movies />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;

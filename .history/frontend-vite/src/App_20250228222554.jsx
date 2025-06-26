import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import AuthForm from './components/AuthForm';
import Movies from './components/Movies';

const App = () => {
  return (
    <Router>
      <link rel="stylesheet" href="/styles/auth.css" />
      <Routes>
        <Route path="/" element={<AuthForm />} />
        <Route path="/movies" element={<Movies />} />
      </Routes>
    </Router>
  );
};

export default App;

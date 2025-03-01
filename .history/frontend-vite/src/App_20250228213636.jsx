import React, { useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import AuthForm from "./components/AuthForm";
import Movies from "./components/Movies";

//import "./styles/global.css"; // Global styles (this will apply to all routes)

const App = () => {
  return (
    <Router>
      <RouteHandler />
    </Router>
  );
};

const RouteHandler = () => {
  const location = useLocation();

  // Dynamically change CSS based on the route
  useEffect(() => {
    // Clear existing link tags
    const existingLinkTags = document.querySelectorAll('link[rel="stylesheet"]');
    existingLinkTags.forEach((link) => {
      link.parentElement.removeChild(link);
    });

    let cssFile = "";
    // Define CSS files for specific routes
    if (location.pathname === "/") {
      cssFile = "auth.css"; // CSS for AuthForm route
    } else if (location.pathname === "/movies") {
      cssFile = "movies.css"; // CSS for Movies route
    }

    if (cssFile) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = `/styles/${cssFile}`; // Ensure this path is correct to your CSS file
      document.head.appendChild(link);
    }
  }, [location]);

  return (
    <div className="app-container">
      <Routes>
        <Route path="/" element={<AuthForm />} />
        <Route path="/movies" element={<Movies />} />
      </Routes>
    </div>
  );
};

export default App;

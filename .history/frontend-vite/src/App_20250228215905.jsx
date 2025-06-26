import React, { useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import AuthForm from "./components/AuthForm";

// Dynamically import the Movies component
const Movies = React.lazy(() => import("./components/Movies"));

const App = () => {
  useEffect(() => {
    // Dynamically apply the correct CSS for each page based on the URL
    const currentPath = window.location.pathname;

    if (currentPath === "/movies") {
      // Apply the movies CSS when on the /movies page
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = "/styles/movies.css"; // Your path to movies CSS file
      document.head.appendChild(link);
    } else {
      // Apply the auth page CSS when on the root or login/signup page
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = "/styles/auth.css"; // Your path to auth CSS file
      document.head.appendChild(link);
    }

    // Cleanup by removing the link when leaving the page
    return () => {
      const links = document.querySelectorAll('link[rel="stylesheet"]');
      links.forEach((link) => link.remove());
    };
  }, []); // Empty dependency array ensures it runs only once

  return (
    <Router>
      <Routes>
        <Route path="/" element={<AuthForm />} />
        <Route
          path="/movies"
          element={
            <React.Suspense fallback={<div>Loading...</div>}>
              <Movies />
            </React.Suspense>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;

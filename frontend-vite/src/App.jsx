import React, { useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import AuthForm from "./components/AuthForm";
import Movies from "./components/Movies";

const App = () => {
  return (
    <Router>
      <BodyClassUpdater />
      <Routes>
        <Route path="/" element={<AuthForm />} />
        <Route path="/movies" element={<Movies />} />
      </Routes>
    </Router>
  );
};

// Component to update body class
const BodyClassUpdater = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === "/") {
      document.body.classList.add("auth-bg");
      document.body.classList.remove("no-bg");
    } else {
      document.body.classList.add("no-bg");
      document.body.classList.remove("auth-bg");
    }
  }, [location]);

  return null;
};

export default App;

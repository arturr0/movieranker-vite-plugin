import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Movies = () => {
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("jwt");

    if (!token) {
      navigate("/"); // Redirect to login if no token
      return;
    }

    fetch("http://localhost:5000/movies/protected", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (res.status === 401 || res.status === 403) {
          navigate("/"); // Redirect if unauthorized
        }
        return res.json();
      })
      .then((data) => {
        if (data.message) {
          setMessage(data.message);
        }
      })
      .catch((err) => {
        console.error("Error:", err);
        navigate("/"); // Redirect on error
      });
  }, [navigate]);

  return (
    <div>
      <h1>
        <span className="fontawesome-star"></span> <span>Movie Ranker</span>{" "}
        <span className="fontawesome-star"></span>
      </h1>
      {message && <p className="movieText">{message}</p>}
    </div>
  );
};

export default Movies;

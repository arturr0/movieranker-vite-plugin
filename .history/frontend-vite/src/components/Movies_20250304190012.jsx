// src/components/Movies.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SearchContent from "./SearchContent";
import RateContainer from "./RateContainer";

const Movies = () => {
  const [message, setMessage] = useState(null);
  const [moviesRanks, setMoviesRanks] = useState([]);
  const [peopleRanks, setPeopleRanks] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("jwt");

    if (!token) {
      navigate("/"); // Redirect to login if no token
      return;
    }

    fetch("http://localhost:3000/movies/protected", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (res.status === 401 || res.status === 403) {
          navigate("/"); // Redirect if unauthorized
        }
        return res.json();
      })
      .then((data) => {
        if (data.user) {
          setMessage(data.user);
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
        <i className="icon-cancel-outline" style="display: none; text-shadow: none;"></i>
      </h1>
      <div className="mainContent">
        <SearchContent
          message={message}
          setMoviesRanks={setMoviesRanks}
          setPeopleRanks={setPeopleRanks}
        />
        <RateContainer moviesRanks={moviesRanks} peopleRanks={peopleRanks} />
      </div>
    </div>
  );
};

export default Movies;

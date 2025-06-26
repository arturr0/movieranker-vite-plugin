// src/components/Movies.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SearchContent from "./SearchContent";
import RateContainer from "./RateContainer";

const Movies = () => {
  const [message, setMessage] = useState(null);
  const [moviesRanks, setMoviesRanks] = useState([]);
  const [peopleRanks, setPeopleRanks] = useState([]);
  const [searchMoviesFunc, setSearchMoviesFunc] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("jwt");
    if (!token) {
      navigate("/");
      return;
    }

    fetch("http://localhost:3000/movies/protected", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          setMessage(data.user);
        }
      })
      .catch(() => navigate("/"));
  }, [navigate]);

  return (
    <>
      <h1>Movie Ranker</h1>
      <div className="mainContent">
        <SearchContent
          message={message}
          setMoviesRanks={setMoviesRanks}
          setPeopleRanks={setPeopleRanks}
          onSearchMovies={setSearchMoviesFunc} // Pass function to state
        />
        <RateContainer 
          moviesRanks={moviesRanks} 
          peopleRanks={peopleRanks} 
          searchMovies={searchMoviesFunc} // Pass it to RateContainer
        />
      </div>
    </>
  );
};


export default Movies;

import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import SearchContent from "./SearchContent";
import RateContainer from "./RateContainer";

const Movies = () => {
  const [message, setMessage] = useState(null);
  const [moviesRanks, setMoviesRanks] = useState([]);
  const [peopleRanks, setPeopleRanks] = useState([]);
  const [selectedMovieId, setSelectedMovieId] = useState(null);
  const navigate = useNavigate();
  const searchContentRef = useRef();

  useEffect(() => {
    const token = localStorage.getItem("jwt");
    if (!token) {
      navigate("/");
      return;
    }

    fetch("http://localhost:3000/movies/protected", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (res.status === 401 || res.status === 403) {
          navigate("/");
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
        navigate("/");
      });
  }, [navigate]);

  const handleSearchMovies = () => {
    if (searchContentRef.current) {
      searchContentRef.current.searchMovies();
    }
  };

  const handleImageClick = (id) => {
    setSelectedMovieId(id);
  };

  const handleCancelClick = () => {
    setSelectedMovieId(null);
  };

  return (
    <>
      <h1>
        <span className="fontawesome-star"></span> <span>Movie Ranker</span>{" "}
        <span className="fontawesome-star"></span>
        <i
          className="icon-cancel-outline"
          style={{ display: selectedMovieId ? "block" : "none", cursor: "pointer" }}
          onClick={handleCancelClick}
        ></i>
      </h1>
      <div className="mainContent">
        <div style={{ display: selectedMovieId ? "none" : "block" }}>
          <SearchContent
            ref={searchContentRef}
            message={message}
            setMoviesRanks={setMoviesRanks}
            setPeopleRanks={setPeopleRanks}
            onImageClick={handleImageClick}
          />
        </div>
        <div style={{ display: selectedMovieId ? "block" : "none" }}>
          <RateContainer
            message={message}
            moviesRanks={moviesRanks}
            peopleRanks={peopleRanks}
            searchMovies={handleSearchMovies}
            movieId={selectedMovieId}
          />
        </div>
      </div>
    </>
  );
};

export default Movies;

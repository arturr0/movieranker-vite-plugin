import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import SearchContent from "./SearchContent";
import RateContainer from "./RateContainer";

const Movies = () => {
  const [message, setMessage] = useState(null);
  const [moviesRanks, setMoviesRanks] = useState([]);
  const [peopleRanks, setPeopleRanks] = useState([]);
  const [selectedMovieId, setSelectedMovieId] = useState(null);
  const [showRateContainer, setShowRateContainer] = useState(false);
  const navigate = useNavigate();
  const searchContentRef = useRef();

  // Fetch user data
  React.useEffect(() => {
    const token = localStorage.getItem("jwt");
    if (!token) return navigate("/");

    fetch("http://localhost:3000/movies/protected", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (res.status === 401 || res.status === 403) navigate("/");
        return res.json();
      })
      .then((data) => {
        if (data.user) setMessage(data.user);
      })
      .catch(() => navigate("/"));
  }, [navigate]);

  const handleSearchMovies = () => {
    if (searchContentRef.current) {
      searchContentRef.current.searchMovies();
    }
  };

  const [selectedMovie, setSelectedMovie] = useState(null); // Store full movie details

  const handleSelectMovie = (id, type, title, poster) => {
    setSelectedMovie({ id, type, title, poster }); // Store all necessary details
    setShowRateContainer(true);
  };

  const handleCloseRateContainer = () => {
    setShowRateContainer(false);
    setSelectedMovieId(null);
  };

  return (
    <>
      <h1>
        <span className="fontawesome-star"></span> 
        <span>Movie Ranker</span> 
        <span className="fontawesome-star"></span>
        <i 
          className="icon-cancel-outline" 
          style={{ display: showRateContainer ? "block" : "none", cursor: "pointer" }}
          onClick={handleCloseRateContainer}
        ></i>
      </h1>
      <div className="mainContent">
      <SearchContent
        ref={searchContentRef}
        message={message}
        setMoviesRanks={setMoviesRanks}
        setPeopleRanks={setPeopleRanks}
        onSelectMovie={handleSelectMovie} // Pass the updated function
        isVisible={!showRateContainer}
      />
      {showRateContainer && (
        <RateContainer
          message={message}
          moviesRanks={moviesRanks}
          peopleRanks={peopleRanks}
          searchMovies={handleSearchMovies}
          movieId={selectedMovie?.id}
          movieType={selectedMovie?.type}   // ✅ Pass type
          movieTitle={selectedMovie?.title}
          moviePoster={selectedMovie?.poster}
        />
      )}
      </div>
    </>
  );
};

export default Movies;

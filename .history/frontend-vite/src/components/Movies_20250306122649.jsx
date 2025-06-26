import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import SearchContent from "./SearchContent";
import RateContainer from "./RateContainer";

const Movies = () => {
  const [message, setMessage] = useState(null);
  const [moviesRanks, setMoviesRanks] = useState([]);
  const [peopleRanks, setPeopleRanks] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [showRateContainer, setShowRateContainer] = useState(false);
  const navigate = useNavigate();
  const searchContentRef = useRef();
  const [lastQuery, setLastQuery] = useState({});

  useEffect(() => {
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
        if (data.user) setMessage(data.user); // Set the message properly
      })
      .catch(() => navigate("/"));
  }, [navigate]);

  const handleSearchMovies = () => {
    if (searchContentRef.current) {
      searchContentRef.current.searchMovies();
    }
  };

  const handleSelectMovie = (id, type, title, poster, avg, votes) => {
    setSelectedMovie({ id, type, title, poster, avg, votes }); 
    setShowRateContainer(true);
  };

  const handleCloseRateContainer = () => {
    setShowRateContainer(false);
    setSelectedMovie(null);
  };

  return (
    <>
      <h1>Movie Ranker</h1>
      <div className="mainContent">
        <SearchContent
          ref={searchContentRef}
          message={message}  // Ensure the message is passed here
          setMoviesRanks={setMoviesRanks}
          setPeopleRanks={setPeopleRanks}
          onSelectMovie={handleSelectMovie}
          isVisible={!showRateContainer}
        />
        {showRateContainer && (
          <RateContainer
            message={message}
            lastQuery={lastQuery}
            moviesRanks={moviesRanks}
            peopleRanks={peopleRanks}
            searchMovies={handleSearchMovies}
            movieId={selectedMovie?.id}
            movieType={selectedMovie?.type}
            movieTitle={selectedMovie?.title}
            moviePoster={selectedMovie?.poster}
            movieVotes={selectedMovie?.votes}
            movieAvg={selectedMovie?.avg}
          />
        )}
      </div>
    </>
  );
};


export default Movies;
import React, { useState, useRef, useEffect } from "react";
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
  const [lastQuery, setLastQuery] = useState(null);

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
  const [sseData, setSseData] = useState(null); // Store SSE updates

  useEffect(() => {
    const eventSource = new EventSource("/movies/updates");

    eventSource.onopen = () => {
      console.log("Connection to server opened.");
    };

    eventSource.onerror = (error) => {
      console.error("Error in EventSource connection:", error);
    };

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("sse", data);
      setSseData(data); // Update the state with new SSE data
    };

    return () => {
      console.log("Closing SSE connection");
      eventSource.close();
    };
  }, []);
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
      <SearchContent 
        message={message}
        setMoviesRanks={setMoviesRanks}
        setPeopleRanks={setPeopleRanks}
        onSelectMovie={handleSelectMovie}
        isVisible={!showRateContainer}
        setLastQuery={setLastQuery}
        lastQuery={lastQuery}  // Pass lastQuery as a prop
      />
      {showRateContainer && selectedMovie && (
        <RateContainer
          message={message}
          moviesRanks={moviesRanks}
          peopleRanks={peopleRanks}
          searchMovies={handleSearchMovies}
          movieTitle={selectedMovie.title}
          moviePoster={selectedMovie.poster}
          movieAvg={selectedMovie.avg}
          movieVotes={selectedMovie.votes}
          movieID={selectedMovie.id}
          movieType={selectedMovie.type}
          lastQuery={lastQuery} // <-- Pass lastQuery to RateContainer
        />
      )}
    </>
  );
};


export default Movies;
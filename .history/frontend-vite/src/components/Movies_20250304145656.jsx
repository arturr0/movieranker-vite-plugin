import React, { useEffect, useState, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import SearchContent from "./SearchContent";
import RateContainer from "./RateContainer";

const Movies = () => {
  const [message, setMessage] = useState(null);
  const [moviesRanks, setMoviesRanks] = useState([]);
  const [peopleRanks, setPeopleRanks] = useState([]);
  const [error, setError] = useState(null);

  const queryRef = useRef("");
  const typeRef = useRef("movie");
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

  const processRanks = (items, type, newMoviesRanks, newPeopleRanks) => {
    items.forEach((item) => {
      if (item.ratings) {
        item.ratings.forEach((rank) => {
          const rankedItem =
            type === "movie"
              ? new Movie(
                  item.id,
                  item.title,
                  rank.rating,
                  rank.userEmail,
                  rank.comment,
                  rank.id
                )
              : new Person(
                  item.id,
                  item.name,
                  rank.rating,
                  rank.userEmail,
                  rank.comment,
                  rank.id
                );
          type === "movie"
            ? newMoviesRanks.push(rankedItem)
            : newPeopleRanks.push(rankedItem);
        });
      }
    });
  };

  const searchMovies = useCallback(async () => {
    if (!queryRef.current.trim()) return;

    setError(null);

    try {
      const response = await fetch(
        `/movies/search?query=${encodeURIComponent(queryRef.current)}&type=${typeRef.current}`
      );

      const data = await response.json();
      console.log(data);

      if (Number(data.querySenderID) === message?.id) {
        lastQuery = {
          type: data.queryType,
          text: data.queryText,
          id: Number(data.querySenderID),
        };
      }

      const newMoviesRanks = [];
      const newPeopleRanks = [];

      processRanks(data.movies || [], "movie", newMoviesRanks, newPeopleRanks);
      processRanks(data.people || [], "people", newMoviesRanks, newPeopleRanks);

      setMoviesRanks(newMoviesRanks);
      setPeopleRanks(newPeopleRanks);
    } catch (error) {
      console.error("Error fetching movies:", error);
      setError("Failed to load results. Please try again.");
    }
  }, [message]);

  return (
    <div>
      <h1>
        <span className="fontawesome-star"></span> <span>Movie Ranker</span>{" "}
        <span className="fontawesome-star"></span>
      </h1>
      <div className="mainContent">
        {/* Pass searchMovies function as a prop */}
        <SearchContent 
          message={message} 
          searchMovies={searchMovies} 
          queryRef={queryRef}
          typeRef={typeRef}
        />
        <RateContainer 
          moviesRanks={moviesRanks} 
          peopleRanks={peopleRanks} 
        />
      </div>
    </div>
  );
};

export default Movies;

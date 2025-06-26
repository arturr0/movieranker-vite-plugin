import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import SearchContent from "./SearchContent";
import RateContainer from "./RateContainer";

const Movies = () => {
  const [message, setMessage] = useState(null);
  const [moviesRanks, setMoviesRanks] = useState([]);
  const [peopleRanks, setPeopleRanks] = useState([]);
  const [showSearchContent, setShowSearchContent] = useState(true);  // state to manage visibility
  const navigate = useNavigate();
  const searchContentRef = useRef();

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

  // Function to call searchMovies from SearchContent
  const handleSearchMovies = () => {
    if (searchContentRef.current) {
      searchContentRef.current.searchMovies();
    }
  };

  // Toggle visibility of components
  const toggleVisibility = (imgId) => {
    setShowSearchContent(false);  // Hide SearchContent
    const rateContainer = document.querySelector(".rateContainer");
    const icon = document.querySelector(".icon-cancel-outline");
    
    if (rateContainer && icon) {
      rateContainer.style.display = "block";
      icon.style.display = "block";
      icon.setAttribute("data-img-id", imgId);  // Send img id to RateContainer
    }
  };

  const handleIconClick = () => {
    setShowSearchContent(true);  // Show SearchContent again
    const rateContainer = document.querySelector(".rateContainer");
    const icon = document.querySelector(".icon-cancel-outline");
    
    if (rateContainer && icon) {
      rateContainer.style.display = "none";
      icon.style.display = "none";
    }
  };

  return (
    <>
      <h1>
        <span className="fontawesome-star"></span> <span>Movie Ranker</span>{" "}
        <span className="fontawesome-star"></span>
        <i
          className="icon-cancel-outline"
          style={{ display: "none", textShadow: "none" }}
          onClick={handleIconClick}
        ></i>
      </h1>
      <div className="mainContent">
        {showSearchContent && (
          <SearchContent
            ref={searchContentRef}
            message={message}
            setMoviesRanks={setMoviesRanks}
            setPeopleRanks={setPeopleRanks}
            toggleVisibility={toggleVisibility}  // Pass toggle function to SearchContent
          />
        )}
        <RateContainer
          message={message}
          moviesRanks={moviesRanks}
          peopleRanks={peopleRanks}
          searchMovies={handleSearchMovies}
        />
      </div>
    </>
  );
};

export default Movies;

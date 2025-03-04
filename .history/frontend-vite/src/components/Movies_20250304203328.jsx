import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import SearchContent from "./SearchContent";
import RateContainer from "./RateContainer";

const Movies = () => {
  const [message, setMessage] = useState(null);
  const [moviesRanks, setMoviesRanks] = useState([]);
  const [peopleRanks, setPeopleRanks] = useState([]);
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

  return (
    <>
      <h1>
        <span className="fontawesome-star"></span> <span>Movie Ranker</span>{" "}
        <span className="fontawesome-star"></span>
        <i className="icon-cancel-outline" style={{ display: "none", textShadow: "none" }}></i>
      </h1>
      <div className="mainContent">
        <SearchContent
          ref={searchContentRef}
          message={message}
          setMoviesRanks={setMoviesRanks}
          setPeopleRanks={setPeopleRanks}
        />
        <RateContainer moviesRanks={moviesRanks} peopleRanks={peopleRanks} />
      </div>
    </>
  );
};

export default Movies;

import React, { useEffect, useState } from "react";

const Movies = () => {
  const [setMovies] = useState([]);

  useEffect(() => {
    const fetchMovies = async () => {
      const token = localStorage.getItem("jwt");

      if (!token) {
        window.location.href = "/";
        return;
      }

      try {
        const response = await fetch("http://localhost:3000/movies/protected", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) return;

        const data = await response.json();
        setMovies(data); // Save movies in state
      } catch (error) {
        console.error("Error during fetch:", error);
      }
    };

    fetchMovies();
  }, []);

  return (
    <div>
      <h1>
        <span className="fontawesome-star"></span> <span>Movie Ranker</span>{" "}
        <span className="fontawesome-star"></span>
      </h1>
      <p className="movieText">Movies</p>
    </div>
  );
};

export default Movies;

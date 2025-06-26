import React, { useState } from "react";

const SearchContent = ({ userData }) => {
  const [query, setQuery] = useState("");
  const [type, setSearchType] = useState("title");
  const [results, setResults] = useState([]); // Store fetched results
  const [error, setError] = useState(null); // Store error messages

  const handleSearchChange = (event) => {
    setQuery(event.target.value);
  };

  const handleRadioChange = (event) => {
    setSearchType(event.target.value);
  };

  const searchMovies = async () => {
    if (!query.trim()) return; // Prevent empty searches

    const controller = new AbortController();
    setError(null); // Clear previous errors

    try {
      console.log("Searching:", query, type);

      const response = await fetch(`/movies/search?query=${query}&type=${type}&id=${userData.user.id}`, {
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error("Failed to fetch movies");
      }

      const data = await response.json();
      console.log("Movies Data:", data);
      setResults(data); // Update state with results
    } catch (error) {
      if (error.name !== "AbortError") {
        console.error("Error fetching movies:", error);
        setError("Failed to load movies. Please try again.");
      }
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      searchMovies();
    }
  };

  return (
    <div className="searchContent">
      <div className="searchDiv">
        <div className="searchContainer">
          <input
            type="text"
            className="searchQuery"
            placeholder="Enter search query"
            value={query}
            onChange={handleSearchChange}
            onKeyDown={handleKeyDown} // Hit Enter to search
          />
          <i className="icon-search-1 magnifier" onClick={searchMovies}></i>
        </div>
      </div>
      <div className="searchTypes" style={{ display: "flex" }}>
        <label style={{ display: "flex" }}>
          <input
            type="radio"
            name="type"
            value="title"
            className="movie"
            checked={type === "title"}
            onChange={handleRadioChange}
          />
          Movie
        </label>
        <label style={{ display: "flex", marginLeft: "20px" }}>
          <input
            type="radio"
            name="type"
            value="actor"
            className="person"
            checked={type === "actor"}
            onChange={handleRadioChange}
          />
          Cast & Crew
        </label>
      </div>
      <div className="resultContainer">
        {error && <p className="error">{error}</p>}
        <div className="results">
          {results.length > 0 ? (
            results.map((movie, index) => <p key={index}>{movie.title || movie.name}</p>)
          ) : (
            <p>No results found</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchContent;

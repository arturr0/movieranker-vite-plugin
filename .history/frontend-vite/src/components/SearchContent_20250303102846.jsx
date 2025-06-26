import React, { useState } from "react";

const SearchContent = ({ userData }) => {
  const [query, setQuery] = useState("");
  const [type, setSearchType] = useState("title");
  const [results, setResults] = useState([]);
  const [error, setError] = useState(null);

  const handleSearchChange = (event) => {
    setQuery(event.target.value);
  };

  const handleRadioChange = (event) => {
    setSearchType(event.target.value);
  };

  const searchMovies = async () => {
    if (!query.trim()) return; // Prevent empty searches

    if (!userData?.user?.id) {
      console.error("User ID is missing");
      setError("User authentication error. Please log in.");
      return;
    }

    setError(null);

    try {
      console.log("Fetching movies:", { query, type, userId: userData.user.id });

      const response = await fetch(`/movies/search?query=${encodeURIComponent(query)}&type=${type}&id=${userData.user.id}`);

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Invalid JSON response from server");
      }

      const data = await response.json();

      if (!data || typeof data !== "object") {
        throw new Error("Empty or invalid data received");
      }

      console.log("Movies Data:", data);
      setResults(Array.isArray(data) ? data : []); // Ensure it's an array
    } catch (error) {
      console.error("Error fetching movies:", error);
      setError("Failed to load movies. Please try again.");
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
            onKeyDown={handleKeyDown}
          />
          <i className="icon-search-1 magnifier" onClick={searchMovies}></i>
        </div>
      </div>
      <div className="searchTypes" style={{ display: "flex" }}>
        <label style={{ display: "flex" }}>
          <input type="radio" name="type" value="title" checked={type === "title"} onChange={handleRadioChange} />
          Movie
        </label>
        <label style={{ display: "flex", marginLeft: "20px" }}>
          <input type="radio" name="type" value="actor" checked={type === "actor"} onChange={handleRadioChange} />
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

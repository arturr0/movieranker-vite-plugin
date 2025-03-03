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

      const response = await fetch(`/movies/search?query=${encodeURIComponent(query)}&type=${type}`);


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
      <div className="results">
        {results && (results.movies || results.people) ? (
          (type === "title" ? results.movies : results.people)?.map((item, index) => (
            <p key={index}>{item.title || item.name}</p>
          ))
        ) : (
          <p>No results found</p>
        )}
      </div>
    </div>
  );
};

export default SearchContent;

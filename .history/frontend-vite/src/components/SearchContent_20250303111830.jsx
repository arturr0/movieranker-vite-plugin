import React, { useState } from "react";

const SearchContent = () => {
  const [query, setQuery] = useState("");
  const [type, setSearchType] = useState("title"); // Stores search type (movie or actor)
  const [results, setResults] = useState({ title: [], actor: [] }); // Store results separately for each type
  const [error, setError] = useState(null);

  const handleSearchChange = (event) => {
    setQuery(event.target.value);
  };

  const handleRadioChange = (event) => {
    setSearchType(event.target.value); // Change search type without triggering a fetch
  };

  const searchMovies = async () => {
    if (!query.trim()) return;

    setError(null);

    try {
      console.log("Searching:", query, type);
      const response = await fetch(
        `/movies/search?query=${encodeURIComponent(query)}&type=${type}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch movies");
      }

      const data = await response.json();
      console.log("Movies Data:", data);

      // Update the results based on the current search type
      setResults((prevResults) => ({
        ...prevResults,
        [type]: data.movies || data.people || [], // Update only the relevant results array
      }));
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
            onKeyDown={handleKeyDown} // Trigger search when Enter is pressed
          />
          <i className="icon-search-1 magnifier" onClick={searchMovies}></i> {/* Trigger search when clicked */}
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
            onChange={handleRadioChange} // Change search type without triggering a fetch
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
            onChange={handleRadioChange} // Change search type without triggering a fetch
          />
          Cast & Crew
        </label>
      </div>
      <div className="resultContainer">
        {error && <p className="error">{error}</p>}
        <div className="results">
          {/* Render results based on the current search type */}
          {results[type].length > 0 ? (
            results[type].map((item, index) => (
              <p key={index}>{item.title || item.name}</p>
            ))
          ) : (
            <p>No results found</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchContent;

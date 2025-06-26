import React, { useState, useCallback } from "react";

const SearchContent = () => {
  const [query, setQuery] = useState(""); // The search query
  const [type, setSearchType] = useState("title"); // The type of search (title or actor)
  const [results, setResults] = useState({ title: [], actor: [] }); // Store results for each search type
  const [error, setError] = useState(null); // Store errors if any

  // This function will fetch data when either magnifier clicked or Enter key pressed
  const searchMovies = useCallback(async () => {
    if (!query.trim()) return; // Don't search if query is empty

    setError(null); // Reset error state

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

      // Store results based on the selected search type (title or actor)
      setResults((prevResults) => ({
        ...prevResults,
        [type]: data.movies || data.people || [], // Update results only for the current type
      }));
    } catch (error) {
      console.error("Error fetching movies:", error);
      setError("Failed to load movies. Please try again.");
    }
  }, [query, type]); // Add query and type as dependencies

  // Trigger search when Enter key is pressed
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      searchMovies();
    }
  };

  // Update the query value when the user types
  const handleSearchChange = (event) => {
    setQuery(event.target.value); // Update query when user types
  };

  // Update the search type when the user changes the radio button
  const handleRadioChange = (event) => {
    setSearchType(event.target.value); // Change search type without triggering a fetch
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
            onChange={handleSearchChange} // Update query on input change
            onKeyDown={handleKeyDown} // Trigger search when Enter key is pressed
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
          {/* Display results based on the current search type */}
          {results[type]?.length > 0 ? (
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

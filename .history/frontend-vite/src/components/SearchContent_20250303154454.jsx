import React, { useState, useCallback } from "react";

const SearchContent = () => {
  const [query, setQuery] = useState(""); // The search query
  const [type, setSearchType] = useState("title"); // The type of search (title or actor)
  const [results, setResults] = useState([]); // Store results
  const [queryType, setQueryType] = useState(""); // Store query type
  const [error, setError] = useState(null); // Store errors if any

  // Function to search movies or people
  const searchMovies = useCallback(async () => {
    if (!query.trim()) return; // Don't search if query is empty

    setError(null); // Reset error state

    try {
      console.log("Searching:", query, type);
      const response = await fetch(
        `/movies/search?query=${encodeURIComponent(query)}&type=${type}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }

      const data = await response.json();
      console.log("Fetched Data:", data);

      setQueryType(data.queryType); // Store the search type
      setResults(data.movies || data.people || []); // Store results
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Failed to load results. Please try again.");
    }
  }, [query, type]);

  // Trigger search when Enter key is pressed
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      searchMovies();
    }
  };

  // Update the query value when the user types
  const handleSearchChange = (event) => {
    setQuery(event.target.value);
  };

  // Update the search type when the user changes the radio button
  const handleRadioChange = (event) => {
    setSearchType(event.target.value);
  };

  // Trigger search when the magnifier icon is clicked
  const handleSearchClick = () => {
    searchMovies();
  };

  // Function to create an item element (movie or person)
  const createItemElement = (item, type) => {
    return (
      <div className="item" key={item.id}>
        <p className="title">
          {type === "movie"
            ? `${item.title} ${item.year !== "N/A" ? `(${item.year})` : ""}`
            : item.name}
        </p>
        <div
          className="img"
          style={{
            backgroundImage: `url(${type === "movie" ? item.poster : item.profile})`,
          }}
        ></div>
        {item.ratings && <div className="rating">{createRatingElement(item.ratings)}</div>}
      </div>
    );
  };

  // Function to create a rating element
  const createRatingElement = (ratings) => {
    const avgRating =
      ratings.length > 0
        ? Math.round(ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length)
        : "No rating yet";

    return (
      <div className="ratedStars">
        {[...Array(5)].map((_, i) => (
          <span key={i} style={{ color: i < avgRating ? "gold" : "gray" }}>
            ★
          </span>
        ))}
      </div>
    );
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
          <i className="icon-search-1 magnifier" onClick={handleSearchClick}></i>
        </div>
      </div>

      <div className="searchTypes" style={{ display: "flex" }}>
        <label style={{ display: "flex" }}>
          <input
            type="radio"
            name="type"
            value="title"
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
            results.map((item) => createItemElement(item, queryType))
          ) : (
            <p>No results found</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchContent;

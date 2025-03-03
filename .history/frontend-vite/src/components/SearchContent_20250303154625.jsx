import React, { useState, useCallback } from "react";

const SearchContent = () => {
  const [query, setQuery] = useState(""); // The search query
  const [type, setSearchType] = useState("title"); // "title" (movies) or "actor" (people)
  const [results, setResults] = useState([]); // Stores fetched data
  const [queryType, setQueryType] = useState(""); // Tracks the response type
  const [error, setError] = useState(null); // Handles errors

  // Fetch data from API based on search type
  const searchMovies = useCallback(async () => {
    if (!query.trim()) return; // Prevent empty searches

    setError(null); // Clear previous errors

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

      setQueryType(data.queryType); // Store the search type from response
      setResults(data.movies || data.people || []); // Set results dynamically
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Failed to load results. Please try again.");
    }
  }, [query, type]);

  // Handle Enter key press for search
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      searchMovies();
    }
  };

  // Update search input
  const handleSearchChange = (event) => {
    setQuery(event.target.value);
  };

  // Change search type (Movie or Actor)
  const handleRadioChange = (event) => {
    setSearchType(event.target.value);
  };

  // Trigger search on click
  const handleSearchClick = () => {
    searchMovies();
  };

  // Function to render a movie or actor item
  const createItemElement = (item) => {
    if (queryType === "title") {
      // Movie results
      return (
        <div className="item" key={item.id}>
          <p className="title">
            {item.title} {item.year !== "N/A" ? `(${item.year})` : ""}
          </p>
          <div
            className="img"
            style={{ backgroundImage: `url(${item.poster})` }}
          ></div>
          {item.ratings && <div className="rating">{createRatingElement(item.ratings)}</div>}
        </div>
      );
    } else if (queryType === "actor") {
      // People results (Actors, Directors, etc.)
      return (
        <div className="item" key={item.id}>
          <p className="title">{item.name}</p>
          <div
            className="img"
            style={{ backgroundImage: `url(${item.profile})` }}
          ></div>
        </div>
      );
    }
    return null;
  };

  // Create rating stars
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
            results.map((item) => createItemElement(item))
          ) : (
            <p>No results found</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchContent;

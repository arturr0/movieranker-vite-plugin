import React, { useState, useCallback } from "react";

const SearchContent = () => {
  const [query, setQuery] = useState("");
  const [type, setSearchType] = useState("title");
  const [results, setResults] = useState([]);
  const [error, setError] = useState(null);

  const searchMovies = useCallback(async () => {
    if (!query.trim()) return;

    setError(null);
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
      setResults(data.results || []);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Failed to load results. Please try again.");
    }
  }, [query, type]);

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      searchMovies();
    }
  };

  const handleSearchChange = (event) => {
    setQuery(event.target.value);
  };

  const handleRadioChange = (event) => {
    setSearchType(event.target.value);
  };

  const handleSearchClick = () => {
    searchMovies();
  };

  const createRatingElement = (avgRating) => {
    return (
      <div className="ratedStars">
        {[...Array(5)].map((_, i) => (
          <span key={i} style={{ color: i < avgRating ? "gold" : "gray" }}>
            &#9733;
          </span>
        ))}
      </div>
    );
  };

  const createItemElement = (item, type) => {
    const voteCount = item.ratings ? item.ratings.length : 0;
    const voteText = voteCount === 1 ? "1 vote" : `${voteCount} votes`;
    const avgRating =
      item.ratings && item.ratings.length
        ? Math.round(
            item.ratings.reduce((sum, r) => sum + r.rating, 0) / item.ratings.length
          )
        : "No rating yet";

    return (
      <div className="item" key={item.id}>
        <p className="title">
          {type === "movie"
            ? `${item.title}${item.year !== "N/A" ? ` (${item.year})` : ""}`
            : item.name}
        </p>
        <div
          className="img"
          style={{ backgroundImage: `url(${type === "movie" ? item.poster : item.profile})` }}
        ></div>
        <p className="votesNo">{voteText}</p>
        {createRatingElement(avgRating)}
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
            results.map((item) => createItemElement(item, type))
          ) : (
            <p>No results found</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchContent;

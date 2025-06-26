import React, { useState, useEffect } from "react";

const SearchContent = ({ userData }) => {
  const [query, setQuery] = useState("");
  const [type, setSearchType] = useState("title");
  const [results, setResults] = useState([]); // Store fetched results

  const handleSearchChange = (event) => {
    setQuery(event.target.value);
  };

  const handleRadioChange = (event) => {
    setSearchType(event.target.value);
  };

  const searchMovies = async (controller) => {
    if (!query) return; // Prevent empty searches

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
      }
    }
  };

  useEffect(() => {
    const controller = new AbortController();

    if (query.trim() !== "") {
      searchMovies(controller);
    }

    return () => controller.abort(); // Cleanup on re-render
  }, [query, type]);

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
          />
          <i className="icon-search-1 magnifier" onClick={() => searchMovies(new AbortController())}></i>
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

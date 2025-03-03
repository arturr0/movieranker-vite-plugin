import React, { useState, useEffect } from "react";

const SearchContent = () => {
  const [query, setQuery] = useState("");
  const [type, setSearchType] = useState("title"); // Default to "title"

  const handleSearchChange = (event) => {
    setQuery(event.target.value);
  };

  const handleRadioChange = (event) => {
    setSearchType(event.target.value);
  };

  useEffect(() => {
    const searchMovies = async () => {
      console.log(query, type);
      const response = await fetch(`/movies/search?query=${query}&type=${type}&id=${userData.user.id}`, {
				signal: controller.signal, // Attach abort signal
			});
			
			const data = await response.json();
			
			console.log('Movies Data:', data);
    };

    
  }, []);
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
        <div className="results">
          <p>Search Query: {query}</p>
          <p>Search Type: {type}</p>
        </div>
      </div>
    </div>
  );
};

export default SearchContent;

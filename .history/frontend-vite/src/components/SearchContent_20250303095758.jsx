import React, { useState } from "react";

const SearchContent = () => {
  const [query, setQuery] = useState("");
  const [searchType, setSearchType] = useState("title"); // Default to "title"

  const handleSearchChange = (event) => {
    setQuery(event.target.value);
  };

  const handleRadioChange = (event) => {
    setSearchType(event.target.value);
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
          />
          <i className="icon-search-1 magnifier"></i>
        </div>
      </div>
      <div className="searchTypes" style={{ display: "flex" }}>
        <label style={{ display: "flex" }}>
          <input
            type="radio"
            name="searchType"
            value="title"
            className="movie"
            checked={searchType === "title"}
            onChange={handleRadioChange}
          />
          Movie
        </label>
        <label style={{ display: "flex", marginLeft: "20px" }}>
          <input
            type="radio"
            name="searchType"
            value="actor"
            className="person"
            checked={searchType === "actor"}
            onChange={handleRadioChange}
          />
          Cast & Crew
        </label>
      </div>
      <div className="resultContainer">
        <div className="results">
          <p>Search Query: {query}</p>
          <p>Search Type: {searchType}</p>
        </div>
      </div>
    </div>
  );
};

export default SearchContent;

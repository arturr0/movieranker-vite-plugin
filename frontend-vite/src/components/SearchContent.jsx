// src/components/SearchContent.js
import React from "react";

const SearchContent = () => {
  return (
    <div className="searchContent">
      <div className="searchDiv">
        <div className="searchContainer">
          <input type="text" className="searchQuery" placeholder="Enter search query" />
          <i className="icon-search-1 magnifier"></i>
        </div>
      </div>
      <div className="searchTypes" style={{ display: "flex" }}>
        <label style={{ display: "flex" }}>
          <input type="radio" name="searchType" value="title" className="movie" defaultChecked />
          Movie
        </label>
        <label style={{ display: "flex", marginLeft: "20px" }}>
          <input type="radio" name="searchType" value="actor" className="person" />
          Cast & Crew
        </label>
      </div>
      <div className="resultContainer">
        <div className="results"></div>
      </div>
    </div>
  );
};

export default SearchContent;

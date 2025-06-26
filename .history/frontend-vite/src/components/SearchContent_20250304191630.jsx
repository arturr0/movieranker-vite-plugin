import React, { useState, useEffect, useCallback, useRef } from "react";

let lastQuery = {};
const moviesRanks = [];
const peopleRanks = [];

class Item {
  constructor(id, title, rank, rankerName, post, dbID) {
    this.id = id;
    this.title = title;
    this.rank = rank;
    this.rankerName = rankerName;
    this.post = post;
    this.dbID = dbID;
  }
}

class Movie extends Item { }
class Person extends Item { }

const SearchContent = ({ message, setMoviesRanks, setPeopleRanks, onSearchMovies }) => {
  console.log("test ", message);

  const [query, setQuery] = useState("");
  const [type, setSearchType] = useState("title");
  const [results, setResults] = useState([]);
  const [error, setError] = useState(null);

  const queryRef = useRef(query);
  const typeRef = useRef(type);

  useEffect(() => {
    console.log("Message changed: ", message);
  }, [message]);

  const searchMovies = useCallback(async () => {
    if (!queryRef.current.trim()) return;
    
    setError(null);
    
    try {
      console.log("Search Type:", typeRef.current);
      const response = await fetch(
        `/movies/search?query=${encodeURIComponent(queryRef.current)}&type=${typeRef.current}`
      );
      const data = await response.json();
      console.log("Movies Data:", data);
      
      // Updating rankings
      moviesRanks.length = 0;
      peopleRanks.length = 0;
      
      if (data.movies) {
        data.movies.forEach(({ id, title, ratings }) => {
          moviesRanks.push(new Movie(id, title, ...ratings));
        });
      }

      if (data.people) {
        data.people.forEach(({ id, name, ratings }) => {
          peopleRanks.push(new Person(id, name, ...ratings));
        });
      }

      setMoviesRanks([...moviesRanks]);
      setPeopleRanks([...peopleRanks]);

      // Pass searchMovies function to the parent
      if (onSearchMovies) {
        onSearchMovies(searchMovies);
      }

    } catch (error) {
      console.error("Error fetching movies:", error);
      setError("Failed to load results.");
    }
  }, [message]);

  const handleSearchChange = (event) => {
    queryRef.current = event.target.value;
  };

  const handleRadioChange = (event) => {
    typeRef.current = event.target.value;
  };

  const handleSearchClick = () => {
    searchMovies();
  };

  const createItemElement = (item, type) => {
    const title = type === "movie"
      ? `${item.title}${item.year !== "N/A" ? ` (${item.year})` : ""}`
      : item.name;

    const avgRating =
      item.ratings && item.ratings.length
        ? Math.round(item.ratings.reduce((sum, r) => sum + r.rating, 0) / item.ratings.length)
        : "No rating yet";

    const voteCount = item.ratings ? item.ratings.length : 0;
    const voteText = voteCount === 1 ? "1 vote" : `${voteCount} votes`;

    return (
      <div key={item.id} className="item">
        <p className="titles" data-title={title}>{title}</p>
        <div className="img" style={{ backgroundImage: `url(${type === 'movie' ? item.poster : item.profile})` }} id={item.id}></div>
        <p className="votesNo">{voteText}</p>
        {createRatingElement(avgRating)}
      </div>
    );
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

  return (
    <div className="searchContent">
      <div className="searchDiv">
        <div className="searchContainer">
          <input
            type="text"
            className="searchQuery"
            placeholder="Enter search query"
            defaultValue={query}
            onChange={handleSearchChange}
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
            defaultChecked={type === "title"}
            onChange={handleRadioChange}
          />
          Movie
        </label>
        <label style={{ display: "flex", marginLeft: "20px" }}>
          <input
            type="radio"
            name="type"
            value="actor"
            defaultChecked={type === "actor"}
            onChange={handleRadioChange}
          />
          Cast & Crew
        </label>
      </div>

      <div className="resultContainer">
        {error && <p className="error">{error}</p>}
        <div className="results">
          {results.length > 0 ? results.map((item, index) => <div key={index}>{item}</div>) : <p>No results found</p>}
        </div>
      </div>
    </div>
  );
};

export default SearchContent;
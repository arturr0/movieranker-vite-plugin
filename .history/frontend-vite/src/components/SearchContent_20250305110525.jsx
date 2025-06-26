import React, { useState, useEffect, useCallback, useRef, forwardRef, useImperativeHandle } from "react";

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

class Movie extends Item {}
class Person extends Item {}

const SearchContent = forwardRef(({ message, setMoviesRanks, setPeopleRanks, onSelectMovie, isVisible }, ref) => {
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

      if (Number(data.querySenderID) === message.id) {
        lastQuery = {
          type: data.queryType,
          text: data.queryText,
          id: Number(data.querySenderID),
        };
      }

      moviesRanks.length = 0;
      peopleRanks.length = 0;
      const resultItems = [];

      const processItems = (items, type, resultArray, rankArray, RankClass) => {
        items?.forEach((item) => {
          if (!(type === "movie" ? item.poster : item.profile)) return;

          resultArray.push(createItemElement(item, type));

          item.ratings?.forEach(({ rating, userEmail, comment, id }) => {
            rankArray.push(new RankClass(item.id, item[type === "movie" ? "title" : "name"], rating, userEmail, comment, id));
          });
        });
      };

      if (data.movies) {
        processItems(data.movies, "movie", resultItems, moviesRanks, Movie);
      } else if (data.people) {
        processItems(data.people, "person", resultItems, peopleRanks, Person);
      } else {
        setError("No results found.");
      }

      setMoviesRanks([...moviesRanks]);
      setPeopleRanks([...peopleRanks]);
      setResults(resultItems);
    } catch (error) {
      console.error("Error fetching movies:", error);
      setError("Failed to load results. Please try again.");
    }
  }, [message]);

  useImperativeHandle(ref, () => ({ searchMovies }));

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
        <div className="img" style={{ backgroundImage: `url(${type === 'movie' ? item.poster : item.profile})` }} id={item.id} onClick={() => onSelectMovie(item.id)}></div>
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
    <div className="searchContent" style={{ display: isVisible ? "block" : "none" }}>
      <div className="searchDiv">
        <div className="searchContainer">
          <input
            type="text"
            className="searchQuery"
            placeholder="Enter search query"
            defaultValue={query}
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
});

export default SearchContent;


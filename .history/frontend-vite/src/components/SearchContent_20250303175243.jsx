import React, { useState, useEffect, useCallback } from "react";

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

const SearchContent = ({ message }) => {
  console.log("test ", message);

  const [query, setQuery] = useState(""); // The search query
  const [type, setSearchType] = useState("title"); // "title" (movies) or "actor" (people)
  const [results, setResults] = useState([]); // Stores fetched data
  const [queryType, setQueryType] = useState(""); // Tracks the response type
  const [error, setError] = useState(null); // Handles errors
  const [isLoading, setIsLoading] = useState(false); // Tracks loading state

  // Log message only when it changes
  useEffect(() => {
    console.log("Message changed: ", message);
  }, [message]); // Logs when 'message' is updated

  // Cancel previous request and create a new one
  const controller = new AbortController();

  // Handle search function
  const searchMovies = useCallback(async () => {
    if (!query.trim()) return;

    setError(null); // Clear previous errors
    setIsLoading(true); // Set loading state to true

    try {
      console.log("Search Type:", type);

      const response = await fetch(
        `/movies/search?query=${encodeURIComponent(query)}&type=${type}`,
        {
          signal: controller.signal,
        }
      );

      const data = await response.json();
      console.log("Movies Data:", data);

      // Update lastQuery state
      if (Number(data.querySenderID) === message.id) {
        lastQuery = {
          type: data.queryType,
          text: data.queryText,
          id: Number(data.querySenderID),
        };
      }
      console.log(lastQuery);

      // Rank movies and people and store them in respective arrays
      const newMoviesRanks = [];
      const newPeopleRanks = [];
      const resultItems = [];

      if (data.movies) {
        data.movies.forEach((movie) => {
          if (!movie.poster) return;
          resultItems.push(createItemElement(movie, "movie", newMoviesRanks));
        });
      } else if (data.people) {
        data.people.forEach((person) => {
          if (!person.profile) return;
          resultItems.push(createItemElement(person, "person", newPeopleRanks));
        });
      } else {
        setError("No results found.");
      }

      setResults(resultItems);
      moviesRanks.length = 0;
      peopleRanks.length = 0;

      // Store the ranked items
      newMoviesRanks.forEach((rankedItem) => moviesRanks.push(rankedItem));
      newPeopleRanks.forEach((rankedItem) => peopleRanks.push(rankedItem));
    } catch (error) {
      if (error.name === "AbortError") {
        console.log("Previous request aborted");
      } else {
        console.error("Error fetching movies:", error);
        setError("Failed to load results. Please try again.");
      }
    } finally {
      setIsLoading(false); // Set loading state to false after request completion
    }
  }, [query, type, message.id]); // useCallback to memoize the searchMovies function

  // Handle input change
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

  // Create the item element for movies or people using JSX instead of document.createElement
  const createItemElement = (item, type, ranksArray) => {
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
        <p className="title" data-title={title}>{title}</p>
        <div className="img" style={{ backgroundImage: `url(${type === 'movie' ? item.poster : item.profile})` }}></div>
        <p className="votesNo">{voteText}</p>
        {createRatingElement(avgRating)}
      </div>
    );
  };

  // Create rating stars based on average rating
  const createRatingElement = (avgRating) => {
    const ratingElement = [];
    for (let i = 0; i < 5; i++) {
      const starStyle = { color: i < avgRating ? "gold" : "gray" };
      ratingElement.push(<span key={i} style={starStyle}>&#9733;</span>);
    }
    return <div className="ratedStars">{ratingElement}</div>;
  };

  // Handle item click (for showing detailed information or additional actions)
  const handleItemClick = (item, type, avgRating, voteText) => {
    console.log(item, type, avgRating, voteText);
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
          <i
            className="icon-search-1 magnifier"
            onClick={handleSearchClick}
          ></i>
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
        {isLoading && <p>Loading...</p>} {/* Show loading indicator while fetching */}
        {error && <p className="error">{error}</p>}
        <div className="results">
          {results.length > 0 ? (
            results.map((item, index) => (
              <div key={index}>{item}</div>
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

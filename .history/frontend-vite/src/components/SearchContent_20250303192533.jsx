import React, { useState, useEffect, useCallback } from "react";

// Define lastQuery as a simple object to store the last search parameters
let lastQuery = {};
const moviesRanks = [];
const peopleRanks = [];

// Define Item class as a base for both movies and people
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

// Create a new AbortController to manage the fetch cancellation
const controller = new AbortController();

const SearchContent = ({ message }) => {
  console.log("Message:", message);

  // State hooks for query, type, results, error, etc.
  const [query, setQuery] = useState(""); // The search query
  const [type, setSearchType] = useState("title"); // Search type: "title" or "actor"
  const [results, setResults] = useState([]); // Array to store search results
  const [error, setError] = useState(null); // Handle any search errors

  // Define searchMovies as a callback to be called on search action
  const searchMovies = useCallback(async () => {
    if (!query.trim()) return;

    setError(null); // Clear any previous errors

    try {
      console.log("Search Type:", type);

      // Fetch data based on search query and type
      const response = await fetch(
        `/movies/search?query=${encodeURIComponent(query)}&type=${type}`,
        {
          signal: controller.signal, // Use the controller for aborting
        }
      );

      const data = await response.json();
      console.log("Movies Data:", data);

      // Update lastQuery with the received data
      if (Number(data.querySenderID) === message.id) {
        lastQuery = {
          type: data.queryType,
          text: data.queryText,
          id: Number(data.querySenderID),
        };
      }
      console.log(lastQuery);

      // Rank movies and people and store them in their respective arrays
      const newMoviesRanks = [];
      const newPeopleRanks = [];
      const resultItems = [];

      // Process movie data
      if (data.movies) {
        data.movies.forEach((movie) => {
          if (!movie.poster) return;
          resultItems.push(createItemElement(movie, "movie", newMoviesRanks));
        });
      }

      // Process people data
      if (data.people) {
        data.people.forEach((person) => {
          if (!person.profile) return;
          resultItems.push(createItemElement(person, "person", newPeopleRanks));
        });
      }

      // If no results, set error message
      if (resultItems.length === 0) {
        setError("No results found.");
      }

      // Update state with the new results
      setResults(resultItems);

      // Clear old rankings and store the new ones
      moviesRanks.length = 0;
      peopleRanks.length = 0;
      newMoviesRanks.forEach((rankedItem) => moviesRanks.push(rankedItem));
      newPeopleRanks.forEach((rankedItem) => peopleRanks.push(rankedItem));

    } catch (error) {
      if (error.name === "AbortError") {
        console.log("Previous request aborted");
      } else {
        console.error("Error fetching data:", error);
        setError("Failed to load results. Please try again.");
      }
    }
  }, [query, type, message.id]); // Dependencies for useCallback

  // Handle input change for search query
  const handleSearchChange = (event) => {
    setQuery(event.target.value);
  };

  // Handle radio change for search type (movie or actor)
  const handleRadioChange = (event) => {
    setSearchType(event.target.value);
  };

  // Trigger search on click (button press)
  const handleSearchClick = () => {
    searchMovies();
  };

  // Create JSX for individual movie or person item
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

  // Create JSX for rating stars based on average rating
  const createRatingElement = (avgRating) => {
    const ratingElement = [];
    for (let i = 0; i < 5; i++) {
      const starStyle = { color: i < avgRating ? "gold" : "gray" };
      ratingElement.push(<span key={i} style={starStyle}>&#9733;</span>);
    }
    return <div className="ratedStars">{ratingElement}</div>;
  };

  // Handle item click for showing more details or actions
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

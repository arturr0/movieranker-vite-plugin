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

const controller = new AbortController();

const searchMovies = useCallback(async () => {
  if (!query.trim()) return;

  setError(null); // Clear previous errors

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

    if (Number(data.querySenderID) === message.id) {
      lastQuery = {
        type: data.queryType,
        text: data.queryText,
        id: Number(data.querySenderID),
      };
    }
    console.log(lastQuery);

    // Clear previous results and ranks
    const resultItems = [];
    moviesRanks.length = 0;
    peopleRanks.length = 0;

    // Process movies
    if (data.movies) {
      data.movies.forEach((movie) => {
        if (!movie.poster) return;
        resultItems.push(createItemElement(movie, "movie"));
        
        // Rank the movie and push to the moviesRanks array
        movie.ratings.forEach((rank) => {
          const rankedMovie = new Movie(movie.id, movie.title, rank.rating, rank.userEmail, rank.comment, rank.id);
          moviesRanks.push(rankedMovie);
        });
      });
    }

    // Process people
    if (data.people) {
      data.people.forEach((person) => {
        if (!person.profile) return;
        resultItems.push(createItemElement(person, "person"));
        
        // Rank the person and push to the peopleRanks array
        person.ratings.forEach((rank) => {
          const rankedPerson = new Person(person.id, person.name, rank.rating, rank.userEmail, rank.comment, rank.id);
          peopleRanks.push(rankedPerson);
        });
      });
    } else {
      setError("No results found.");
    }

    // Set results for rendering
    setResults(resultItems);

  } catch (error) {
    if (error.name === "AbortError") {
      console.log("Previous request aborted");
    } else {
      console.error("Error fetching movies:", error);
      setError("Failed to load results. Please try again.");
    }
  }
}, [query, type]);

const handleSearchChange = (event) => {
  setQuery(event.target.value);
};

const handleRadioChange = (event) => {
  setSearchType(event.target.value);
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
      <p className="title" data-title={title}>{title}</p>
      <div className="img" style={{ backgroundImage: `url(${type === 'movie' ? item.poster : item.profile})` }}></div>
      <p className="votesNo">{voteText}</p>
      {createRatingElement(avgRating)}
    </div>
  );
};

const createRatingElement = (avgRating) => {
  const ratingElement = [];
  for (let i = 0; i < 5; i++) {
    const starStyle = { color: i < avgRating ? "gold" : "gray" };
    ratingElement.push(<span key={i} style={starStyle}>&#9733;</span>);
  }
  return <div className="ratedStars">{ratingElement}</div>;
};

const handleItemClick = (item, type, avgRating, voteText) => {
  console.log(item, type, avgRating, voteText);
};

const SearchContent = ({ message }) => {
  const [query, setQuery] = useState("");
  const [type, setSearchType] = useState("title");
  const [results, setResults] = useState([]);
  const [error, setError] = useState(null);

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

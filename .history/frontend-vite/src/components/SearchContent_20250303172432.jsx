import React, { useState, useCallback } from "react";

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

const SearchContent = ({ test }) => {
  console.log("test", test)
  const [query, setQuery] = useState(""); // The search query
  const [type, setSearchType] = useState("title"); // "title" (movies) or "actor" (people)
  const [results, setResults] = useState([]); // Stores fetched data
  const [queryType, setQueryType] = useState(""); // Tracks the response type
  const [error, setError] = useState(null); // Handles errors

  // Cancel previous request and create a new one
  const controller = new AbortController();

  // Handle search function
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

      // Update lastQuery state
      if (Number(data.querySenderID) === userData.user.id) {
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
    }
  }, [query, type]);

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

  // Create the item element for movies or people
  const createItemElement = (item, type, ranksArray) => {
    const itemElement = document.createElement("div");
    itemElement.classList.add("item");

    const title = type === "movie"
      ? `${item.title}${item.year !== "N/A" ? ` (${item.year})` : ""}`
      : item.name;

    itemElement.innerHTML = `
      <p class="title" data-title="${title}">${title}</p>
      <div class="img" style="background-image: url(${type === 'movie' ? item.poster : item.profile});"></div>
    `;

    // Handling ratings
    if (item.ratings) {
      item.ratings.forEach((rank) => {
        const rankedItem = type === "movie"
          ? new Movie(item.id, item.title, rank.rating, rank.userEmail, rank.comment, rank.id)
          : new Person(item.id, item.name, rank.rating, rank.userEmail, rank.comment, rank.id);

        ranksArray.push(rankedItem);
      });
    }

    const voteCount = item.ratings ? item.ratings.length : 0;
    const voteText = voteCount === 1 ? "1 vote" : `${voteCount} votes`;
    const avgRating =
      item.ratings && item.ratings.length
        ? Math.round(item.ratings.reduce((sum, r) => sum + r.rating, 0) / item.ratings.length)
        : "No rating yet";

    const votesElement = document.createElement("p");
    votesElement.classList.add("votesNo");
    votesElement.textContent = voteText;

    const ratingElement = createRatingElement(avgRating);

    itemElement.appendChild(votesElement);
    itemElement.appendChild(ratingElement);

    itemElement.querySelector(".img").addEventListener("click", () =>
      handleItemClick(item, type, avgRating, voteText)
    );

    return itemElement;
  };

  // Create rating stars based on average rating
  const createRatingElement = (avgRating) => {
    const ratingElement = document.createElement("div");
    ratingElement.classList.add("ratedStars");

    for (let i = 0; i < 5; i++) {
      const star = document.createElement("span");
      star.style.color = i < avgRating ? "gold" : "gray";
      star.innerHTML = "&#9733;";
      ratingElement.appendChild(star);
    }

    return ratingElement;
  };

  // Handle item click (for showing detailed information or additional actions)
  const handleItemClick = (item, type, avgRating, voteText) => {
    // You can expand this to show more detailed information
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

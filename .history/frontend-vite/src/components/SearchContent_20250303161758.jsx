import React, { useState, useEffect, useCallback } from "react";

const SearchContent = ({ userData }) => {
  const [query, setQuery] = useState("");
  const [type, setType] = useState("title"); // 'title' for movies, 'actor' for people
  const [results, setResults] = useState([]);
  const [queryType, setQueryType] = useState("");
  const [currentQuery, setCurrentQuery] = useState({});
  const [moviesRanks, setMoviesRanks] = useState([]);
  const [peopleRanks, setPeopleRanks] = useState([]);
  const [error, setError] = useState(null);
  let controller = new AbortController();

  const searchMovies = useCallback(async () => {
    if (!query.trim()) return;
    controller.abort(); // Cancel previous request
    controller = new AbortController(); // New request controller
    setError(null);

    try {
      console.log("Search Type:", type);
      const response = await fetch(
        `/movies/search?query=${encodeURIComponent(query)}&type=${type}&id=${userData.user.id}`,
        { signal: controller.signal }
      );
      
      if (!response.ok) throw new Error("Failed to fetch data");
      
      const data = await response.json();
      console.log("Movies Data:", data);
      
      if (Number(data.querySenderID) === userData.user.id) {
        setCurrentQuery({
          type: data.queryType,
          text: data.queryText,
          id: Number(data.querySenderID),
        });
      }

      setQueryType(data.queryType);
      setMoviesRanks([]);
      setPeopleRanks([]);
      
      if (data.movies) {
        setResults(data.movies);
      } else if (data.people) {
        setResults(data.people);
      } else {
        alert("No results found.");
      }
    } catch (error) {
      if (error.name === "AbortError") {
        console.log("Previous request aborted");
      } else {
        console.error("Error fetching movies:", error);
        setError("Failed to load results. Please try again.");
      }
    }
  }, [query, type, userData.user.id]);

  const createRatingElement = (avgRating) => (
    <div className="ratedStars">
      {[...Array(5)].map((_, i) => (
        <span key={i} style={{ color: i < avgRating ? "gold" : "gray" }}>★</span>
      ))}
    </div>
  );

  const createItemElement = (item) => {
    const isMovie = queryType === "title";
    const imageUrl = isMovie ? item.poster : item.profile;
    const title = isMovie ? `${item.title} (${item.year !== "N/A" ? item.year : ""})` : item.name;
    
    if (!imageUrl) return null;

    let ranks = isMovie ? [...moviesRanks] : [...peopleRanks];
    if (item.ratings) {
      item.ratings.forEach((rank) => {
        ranks.push({
          id: item.id,
          name: title,
          rating: rank.rating,
          userEmail: rank.userEmail,
          comment: rank.comment,
          rankId: rank.id,
        });
      });
    }
    isMovie ? setMoviesRanks(ranks) : setPeopleRanks(ranks);

    const voteCount = item.ratings ? item.ratings.length : 0;
    const voteText = voteCount === 1 ? "1 vote" : `${voteCount} votes`;
    const avgRating =
      item.ratings && item.ratings.length
        ? Math.round(item.ratings.reduce((sum, r) => sum + r.rating, 0) / item.ratings.length)
        : "No rating yet";

    return (
      <div className="item" key={item.id}>
        <p className="title">{title}</p>
        <div className="img" style={{ backgroundImage: `url(${imageUrl})` }}></div>
        <p className="votesNo">{voteText}</p>
        {createRatingElement(avgRating)}
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
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && searchMovies()}
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
            checked={type === "title"}
            onChange={() => setType("title")}
          />
          Movie
        </label>
        <label style={{ display: "flex", marginLeft: "20px" }}>
          <input
            type="radio"
            name="type"
            value="actor"
            checked={type === "actor"}
            onChange={() => setType("actor")}
          />
          Cast & Crew
        </label>
      </div>

      <div className="resultContainer">
        {error && <p className="error">{error}</p>}
        <div className="results">
          {results.length > 0 ? results.map((item) => createItemElement(item)) : <p>No results found</p>}
        </div>
      </div>
    </div>
  );
};

export default SearchContent;

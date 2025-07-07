import React, { useState, useEffect, useCallback, useRef, forwardRef } from "react";

class RankItem {
  constructor(id, title, rank, rankerName, post, dbID) {
    Object.assign(this, { id, title, rank, rankerName, post, dbID });
  }
}

const SearchContent = forwardRef(({ 
  sseData, message, setMoviesRanks, setPeopleRanks, onSelectMovie, isVisible, setLastQuery 
}, ref) => {
  const [query, setQuery] = useState("");
  const [type, setType] = useState("title");
  const [results, setResults] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const queryRef = useRef(query);
  const typeRef = useRef(type);
  const ranksRef = useRef({ movies: [], people: [] });

  useEffect(() => { queryRef.current = query }, [query]);
  useEffect(() => { typeRef.current = type }, [type]);

  const search = useCallback(async () => {
    if (!queryRef.current.trim()) return;
    
    setError(null);
    setResults([]);
    setLoading(true);
    ranksRef.current = { movies: [], people: [] };

    try {
      const res = await fetch(`/movies/search?query=${encodeURIComponent(queryRef.current)}&type=${typeRef.current}&id=${message.id}`);
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      
      const data = await res.json();
      if (Number(data.querySenderID) === message.id) {
        setLastQuery({ type: data.queryType, text: data.queryText, id: Number(data.querySenderID) });
      }

      const items = [];
      const process = (arr, itemType, Class) => {
        arr?.forEach(item => {
          if (!item[itemType === "movie" ? "poster" : "profile"]) return;
          
          items.push(renderItem(item, itemType));
          
          item.ratings?.forEach(r => {
            ranksRef.current[itemType === "movie" ? "movies" : "people"].push(
              new Class(item.id, item[itemType === "movie" ? "title" : "name"], r.rating, r.userEmail, r.comment, r.id)
            );
          });
        });
      };

      if (data.movies) process(data.movies, "movie", RankItem);
      if (data.people) process(data.people, "person", RankItem);

      setMoviesRanks([...ranksRef.current.movies]);
      setPeopleRanks([...ranksRef.current.people]);
      setResults(items);
    } catch (err) {
      setError(err.message.includes("Failed to fetch") ? "Network error" : "Failed to load results");
    } finally {
      setLoading(false);
    }
  }, [message.id, setLastQuery, setMoviesRanks, setPeopleRanks]);

  useEffect(() => {
    if (sseData?.id === message.id) search();
  }, [sseData, message.id, search]);

  useImperativeHandle(ref, () => ({ searchMovies: search }));

  const renderItem = (item, itemType) => {
    const title = `${item[itemType === "movie" ? "title" : "name"]}${item.year && item.year !== "N/A" ? ` (${item.year})` : ""}`;
    const avgRating = item.ratings?.length ? Math.round(item.ratings.reduce((s, r) => s + r.rating, 0) / item.ratings.length) : 0;
    const votes = item.ratings?.length || 0;

    return (
      <div key={`${item.id}-${itemType}`} className="item">
        <p className="titles">{title}</p>
        <div 
          className="img" 
          style={{ backgroundImage: `url(${item[itemType === "movie" ? "poster" : "profile"]})` }}
          onClick={() => onSelectMovie(item.id, itemType, title, item[itemType === "movie" ? "poster" : "profile"], avgRating, `${votes} vote${votes !== 1 ? "s" : ""}`)}
        />
        <p className="votesNo">{votes} vote{votes !== 1 ? "s" : ""}</p>
        <div className="ratedStars">
          {[...Array(5)].map((_, i) => <span key={i} style={{ color: i < avgRating ? "gold" : "gray" }}>★</span>)}
        </div>
      </div>
    );
  };

  return (
    <div className="searchContent" style={{ display: isVisible ? "block" : "none" }}>
      <div className="searchDiv">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && search()}
          placeholder="Enter search query"
        />
        <i className="icon-search-1 magnifier" onClick={search} />
      </div>

      <div className="searchTypes">
        {["title", "actor"].map((t) => (
          <label key={t}>
            <input
              type="radio"
              name="type"
              value={t}
              checked={type === t}
              onChange={() => setType(t)}
            />
            {t === "title" ? "Movie" : "Cast & Crew"}
          </label>
        ))}
      </div>

      <div className="resultContainer">
        {loading ? <div className="loader" /> : error ? (
          <p className="error">{error}</p>
        ) : (
          <div className="results">{results}</div>
        )}
      </div>
    </div>
  );
});

export default SearchContent;

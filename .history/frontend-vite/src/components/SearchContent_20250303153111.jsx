import { useState, useEffect } from "react";

const RatingStars = ({ avgRating }) => {
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

const Item = ({ item, type }) => {
  if (!item) return null;

  const avgRating = item.ratings?.length
    ? Math.round(item.ratings.reduce((sum, r) => sum + r.rating, 0) / item.ratings.length)
    : 0;

  return (
    <div className="item">
      <p className="title">
        {type === "movie" ? `${item.title} (${item.year || "N/A"})` : item.name}
      </p>
      <div
        className="img"
        style={{ backgroundImage: `url(${type === "movie" ? item.poster : item.profile})` }}
      ></div>
      <p className="votesNo">{item.ratings?.length || 0} votes</p>
      <RatingStars avgRating={avgRating} />
    </div>
  );
};

const SearchContent = ({ query, type }) => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query) return;
    
    setLoading(true);
    fetch(`/search?query=${query}&type=${type}`)
      .then((res) => res.json())
      .then((data) => {
        setResults(data.results);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [query, type]);

  return (
    <div className="searchContent">
      {loading && <p>Loading...</p>}
      <div className="results">
        {
          results.map((item, index) => <Item key={index} item={item} type={type} />)
        }
      </div>
    </div>
  );
};

export default SearchContent;

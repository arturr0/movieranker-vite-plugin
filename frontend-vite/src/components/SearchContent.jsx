import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  forwardRef,
  useImperativeHandle,
  memo
} from "react";

// Memoized display components
const VotesDisplay = memo(({ count }) => {
  const voteText = count === 1 ? "1 vote" : `${count} votes`;
  return <p className="votesNo">{voteText}</p>;
});

const StarsDisplay = memo(({ rating }) => {
  return (
    <div className="ratedStars">
      {[...Array(5)].map((_, i) => (
        <span key={i} style={{ color: i < rating ? "gold" : "gray" }}>
          ★
        </span>
      ))}
    </div>
  );
});

const MovieItem = memo(({ item, type, onSelectMovie }) => {
  const title =
    type === "movie"
      ? `${item.title}${item.year !== "N/A" ? ` (${item.year})` : ""}`
      : item.name;

  const avgRating = item.ratings?.length
    ? Math.round(
        item.ratings.reduce((sum, r) => sum + r.rating, 0) / item.ratings.length
      )
    : 0;

  const voteCount = item.ratings?.length || 0;

  return (
    <div className="item">
      <p className="titles" data-title={title}>
        {title}
      </p>
      <div
        className="img"
        style={{
          backgroundImage: `url(${
            type === "movie" ? item.poster : item.profile
          })`,
        }}
        onClick={() =>
          onSelectMovie(
            item.id,
            type,
            title,
            type === "movie" ? item.poster : item.profile,
            avgRating,
            voteCount === 1 ? "1 vote" : `${voteCount} votes`
          )
        }
      ></div>
      <VotesDisplay count={voteCount} />
      <StarsDisplay rating={avgRating} />
    </div>
  );
});

const SearchContent = forwardRef((props, ref) => {
  const {
    sseData,
    message,
    setMoviesRanks,
    setPeopleRanks,
    onSelectMovie,
    isVisible,
    setLastQuery,
    lastQuery,
  } = props;

  const [query, setQuery] = useState("");
  const [type, setSearchType] = useState("title");
  const [items, setItems] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const queryRef = useRef(query);
  const typeRef = useRef(type);
  const itemsRef = useRef(items);
  const moviesRanks = useRef([]);
  const peopleRanks = useRef([]);

  // Update items ref when items change
  useEffect(() => {
    itemsRef.current = items;
  }, [items]);

  // SSE data handler - now only updates specific items
  useEffect(() => {
    if (!sseData) return;

    if (sseData.type === 'ratingUpdate') {
      const updatedItem = sseData.payload;
      setItems(prevItems => {
        return prevItems.map(item => {
          if (item.id === updatedItem.id) {
            return {
              ...item,
              ratings: updatedItem.ratings
            };
          }
          return item;
        });
      });
    } else {
      searchMovies();
    }
  }, [sseData, searchMovies]);

  const searchMovies = useCallback(async () => {
    if (!queryRef.current.trim()) return;

    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch(
        `/movies/search?query=${encodeURIComponent(
          queryRef.current
        )}&type=${typeRef.current}&id=${message.id}`
      );

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();

      if (Number(data.querySenderID) === message.id) {
        setLastQuery({
          type: data.queryType,
          text: data.queryText,
          id: Number(data.querySenderID),
        });
      }

      moviesRanks.current = [];
      peopleRanks.current = [];
      const newItems = [];

      const processItems = (items, type, rankArray, RankClass) => {
        items?.forEach((item) => {
          if (!(type === "movie" ? item.poster : item.profile)) return;

          newItems.push(item);

          item.ratings?.forEach(({ rating, userEmail, comment, id }) => {
            rankArray.push({
              id: item.id,
              title: item[type === "movie" ? "title" : "name"],
              rank: rating,
              rankerName: userEmail,
              post: comment,
              dbID: id
            });
          });
        });
      };

      if (data.movies) {
        processItems(data.movies, "movie", moviesRanks.current, "Movie");
      } else if (data.people) {
        processItems(data.people, "person", peopleRanks.current, "Person");
      }

      setItems(newItems);
      setMoviesRanks([...moviesRanks.current]);
      setPeopleRanks([...peopleRanks.current]);
    } catch (error) {
      console.error("Error fetching movies:", error);
      setError(
        error.message.includes("Failed to fetch")
          ? "Network error. Please check your connection."
          : "Failed to load results. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  }, [message, setLastQuery, setMoviesRanks, setPeopleRanks]);

  useImperativeHandle(ref, () => ({ searchMovies }));

  const handleSearchChange = (event) => {
    setQuery(event.target.value);
    queryRef.current = event.target.value;
  };

  const handleRadioChange = (event) => {
    setSearchType(event.target.value);
    typeRef.current = event.target.value;
  };

  return (
    <div className="searchContent" style={{ display: isVisible ? "block" : "none" }}>
      {/* Search UI remains the same */}
      <div className="searchDiv">
        <div className="searchContainer">
          <input
            type="text"
            className="searchQuery"
            placeholder="Enter search query"
            value={query}
            onChange={handleSearchChange}
            onKeyPress={(e) => e.key === "Enter" && searchMovies()}
          />
          <i
            className="icon-search-1 magnifier"
            onClick={searchMovies}
            style={{ cursor: "pointer" }}
          ></i>
        </div>
      </div>

      <div className="searchTypes" style={{ display: "flex" }}>
        <label style={{ display: "flex", alignItems: "center" }}>
          <input
            type="radio"
            name="type"
            value="title"
            checked={type === "title"}
            onChange={handleRadioChange}
            style={{ marginRight: "5px" }}
          />
          Movie
        </label>
        <label style={{ display: "flex", alignItems: "center", marginLeft: "20px" }}>
          <input
            type="radio"
            name="type"
            value="actor"
            checked={type === "actor"}
            onChange={handleRadioChange}
            style={{ marginRight: "5px" }}
          />
          Cast & Crew
        </label>
      </div>

      <div className="resultContainer">
        {isLoading ? (
          <div className="loader"></div>
        ) : error ? (
          <p className="error">{error}</p>
        ) : (
          <div className="results">
            {items.map(item => (
              <MovieItem
                key={`${item.id}-${item.ratings?.length || 0}`}
                item={item}
                type={type === "movie" ? "movie" : "person"}
                onSelectMovie={onSelectMovie}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
});

export default SearchContent;

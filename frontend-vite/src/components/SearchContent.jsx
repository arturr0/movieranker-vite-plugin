import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  forwardRef,
  useImperativeHandle,
  memo
} from "react";

// Define Item classes outside the component to prevent re-creation
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
          &#9733;
        </span>
      ))}
    </div>
  );
});

// Main component
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

  // State management
  const [query, setQuery] = useState("");
  const [type, setSearchType] = useState("title");
  const [results, setResults] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [itemsData, setItemsData] = useState({});

  // Refs for stable references
  const queryRef = useRef(query);
  const typeRef = useRef(type);
  const moviesRanks = useRef([]);
  const peopleRanks = useRef([]);

  // Debug effects
  useEffect(() => {
    console.log("Message changed: ", message);
  }, [message]);

  useEffect(() => {
    console.log("Last Query Updated:", lastQuery);
  }, [lastQuery]);

  // Item creation helper
  const createItemElement = useCallback((item, type) => {
    const title =
      type === "movie"
        ? `${item.title}${item.year !== "N/A" ? ` (${item.year})` : ""}`
        : item.name;

    const avgRating = item.ratings?.length
      ? Math.round(
          item.ratings.reduce((sum, r) => sum + r.rating, 0) /
            item.ratings.length
        )
      : 0;

    const voteCount = item.ratings?.length || 0;

    return (
      <div key={`${item.id}-${voteCount}-${avgRating}`} className="item">
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
          id={item.id}
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
  }, [onSelectMovie]);

  // Rating update handler
  const updateItemRatings = useCallback((updatedItem) => {
    setItemsData(prev => {
      const newData = {...prev};
      if (newData[updatedItem.id]) {
        newData[updatedItem.id].ratings = updatedItem.ratings;
      }
      return newData;
    });
  }, []);

  // SSE data handler
  useEffect(() => {
    if (sseData) {
      if (sseData.type === 'ratingUpdate') {
        updateItemRatings(sseData.payload);
      } else {
        searchMovies();
      }
    }
  }, [sseData, searchMovies, updateItemRatings]);

  // Search function
  const searchMovies = useCallback(async () => {
    if (!queryRef.current.trim()) return;

    setError(null);
    setResults([]);
    setIsLoading(true);

    try {
      const response = await fetch(
        `/movies/search?query=${encodeURIComponent(
          queryRef.current
        )}&type=${typeRef.current}&id=${message.id}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (Number(data.querySenderID) === message.id) {
        setLastQuery({
          type: data.queryType,
          text: data.queryText,
          id: Number(data.querySenderID),
        });
      }

      // Clear previous ranks
      moviesRanks.current = [];
      peopleRanks.current = [];
      const resultItems = [];
      const newItemsData = {};

      const processItems = (items, type, resultArray, rankArray, RankClass) => {
        items?.forEach((item) => {
          if (!(type === "movie" ? item.poster : item.profile)) return;

          newItemsData[item.id] = item;
          resultArray.push(createItemElement(item, type));

          item.ratings?.forEach(({ rating, userEmail, comment, id }) => {
            rankArray.push(
              new RankClass(
                item.id,
                item[type === "movie" ? "title" : "name"],
                rating,
                userEmail,
                comment,
                id
              )
            );
          });
        });
      };

      if (data.movies) {
        processItems(data.movies, "movie", resultItems, moviesRanks.current, Movie);
      } else if (data.people) {
        processItems(data.people, "person", resultItems, peopleRanks.current, Person);
      }

      setItemsData(newItemsData);
      setMoviesRanks([...moviesRanks.current]);
      setPeopleRanks([...peopleRanks.current]);
      setResults(resultItems);
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
  }, [message, setLastQuery, createItemElement, setMoviesRanks, setPeopleRanks]);

  // Update results when itemsData changes
  useEffect(() => {
    if (Object.keys(itemsData).length > 0) {
      const resultItems = [];
      
      Object.values(itemsData).forEach(item => {
        const itemType = item.title ? "movie" : "person";
        resultItems.push(createItemElement(item, itemType));
      });

      setResults(resultItems);
    }
  }, [itemsData, createItemElement]);

  // Expose searchMovies via ref
  useImperativeHandle(ref, () => ({ searchMovies }));

  // Event handlers
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
        <label
          style={{
            display: "flex",
            alignItems: "center",
            marginLeft: "20px",
          }}
        >
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
          <div className="results">{results}</div>
        )}
      </div>
    </div>
  );
});

export default SearchContent;

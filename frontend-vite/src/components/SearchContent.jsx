import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  forwardRef,
  useImperativeHandle,
} from "react";

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

const SearchContent = forwardRef(
  (
    {
      sseData,
      message,
      setMoviesRanks,
      setPeopleRanks,
      onSelectMovie,
      isVisible,
      setLastQuery,
      lastQuery,
    },
    ref
  ) => {
    const [query, setQuery] = useState("");
    const [type, setSearchType] = useState("title");
    const [results, setResults] = useState([]);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const queryRef = useRef(query);
    const typeRef = useRef(type);

    const searchMovies = useCallback(async () => {
      if (!queryRef.current.trim()) return;

      setError(null);
      setResults([]);
      setIsLoading(true);

      try {
        const response = await fetch(
          `/movies/search?query=${encodeURIComponent(queryRef.current)}&type=${typeRef.current}&id=${message.id}`
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

        moviesRanks.length = 0;
        peopleRanks.length = 0;
        const resultItems = [];

        const processItems = (items, type, resultArray, rankArray, RankClass) => {
          items?.forEach((item) => {
            if (!(type === "movie" ? item.poster : item.profile)) return;

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
          processItems(data.movies, "movie", resultItems, moviesRanks, Movie);
        } else if (data.people) {
          processItems(data.people, "person", resultItems, peopleRanks, Person);
        }

        setMoviesRanks([...moviesRanks]);
        setPeopleRanks([...peopleRanks]);
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
    }, [message, setLastQuery, setMoviesRanks, setPeopleRanks]);

    // Use this for search manually
    useImperativeHandle(ref, () => ({ searchMovies }));

    const handleSearchChange = (event) => {
      setQuery(event.target.value);
      queryRef.current = event.target.value;
    };

    const handleRadioChange = (event) => {
      setSearchType(event.target.value);
      typeRef.current = event.target.value;
    };

    const createItemElement = (item, type) => {
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
      const voteText = voteCount === 1 ? "1 vote" : `${voteCount} votes`;

      return (
        <div key={item.id} className="item">
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
                voteText
              )
            }
          ></div>
          <p className="votesNo" id={`votes-${item.id}`}>
            {voteText}
          </p>
          {createRatingElement(avgRating, item.id)}
        </div>
      );
    };

    const createRatingElement = (avgRating, id) => {
      return (
        <div className="ratedStars" id={`rating-${id}`}>
          {[...Array(5)].map((_, i) => (
            <span key={i} style={{ color: i < avgRating ? "gold" : "gray" }}>
              &#9733;
            </span>
          ))}
        </div>
      );
    };

    // Update vote info on SSE event
    const updateVoteInfo = (data) => {
      const ranks = data.type === "movie" ? moviesRanks : peopleRanks;

      // Push new rank
      ranks.push(
        new (data.type === "movie" ? Movie : Person)(
          data.id,
          data.title,
          data.rank,
          data.userEmail,
          data.comment,
          data.dbID
        )
      );

      // Update stars
      const stars = document.querySelectorAll(`#rating-${data.id} span`);
      stars.forEach((star, index) => {
        star.style.color = index < data.rank ? "gold" : "gray";
      });

      // Update vote count
      const voteCountElem = document.getElementById(`votes-${data.id}`);
      if (voteCountElem) {
        const totalVotes = ranks.filter((r) => r.id === data.id).length;
        voteCountElem.textContent =
          totalVotes + (totalVotes === 1 ? " vote" : " votes");
      }
    };

    // When new vote arrives
    useEffect(() => {
      if (sseData) {
        updateVoteInfo(sseData);
      }
    }, [sseData]);

    return (
      <div
        className="searchContent"
        style={{ display: isVisible ? "block" : "none" }}
      >
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
            style={{ display: "flex", alignItems: "center", marginLeft: "20px" }}
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
            <div className="results">
              {results.length > 0 &&
                results.map((item, index) => <div key={index}>{item}</div>)}
            </div>
          )}
        </div>
      </div>
    );
  }
);

export default SearchContent;

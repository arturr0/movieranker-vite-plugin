import React, { useEffect, useState } from "react";

const RateContainer = ({ message, movieId, movieType, movieTitle, moviePoster, movieAvg, movieVotes, lastQuery }) => {
  const [selectedRating, setSelectedRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [postContent, setPostContent] = useState("");

  useEffect(() => {
    console.log("Rate message changed: ", message);
  }, [message]);
  useEffect(() => {
    console.log("Rate lastQuery changed: ", lastQuery);
  }, [lastQuery]);

  useEffect(() => {
    console.log("Selected movie ID:", movieId);
    console.log("Selected movie type:", movieType);
    console.log("Selected movie title:", movieTitle);
    console.log("Selected movie poster:", moviePoster);
    console.log("Selected movie votes:", movieVotes);
    console.log("Selected movie avg:", movieAvg);
    setSelectedRating(0);
    setHoverRating(0);
    setPostContent("");
  }, [movieId, movieType, movieTitle, moviePoster, movieVotes, movieAvg]);

  const rateItem = async (type, id, title, rating, post) => {
    const token = localStorage.getItem("jwt");

    if (rating && !isNaN(rating) && rating >= 1 && rating <= 5) {
      try {
        const response = await fetch("http://localhost:3000/movies/rate", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            type,      // 'movie' or 'person'
						id,        // TMDB ID of the movie/person
						title,     // Title or name of the movie/person
						rating,  // Rating from user
						post,
						// queryType: lastQuery.type,    // ✅ Include search query type
						// queryText: lastQuery.text,    // ✅ Include search query text
						// querySenderID: lastQuery.id,
						// userName: message.email,
          }),
        });

        if (!response.ok) throw new Error("Failed to submit rating");

        console.log("Rating submitted successfully!");
      } catch (error) {
        console.error("Error rating item:", error);
      }
    } else {
      alert("Invalid rating! Please provide a number between 1 and 5.");
    }
  };

  return (
    <div className="ranks">
      <div className="rateContainer">
        <div className="ratedTitle">{movieTitle}</div>
        <div className="ratedContainer">
          <div className="ratedInfo">
            <img className="rankImg" src={moviePoster} alt="" />
            <p className="votesInfo">{movieVotes}</p>
            <div className="starsInfo">
              {[...Array(5)].map((_, i) => (
                <span key={i} className={i < movieAvg ? "filled" : ""}>
                  &#9733;
                </span>
              ))}
            </div>
          </div>
          <div className="myPost">
            <div className="myRank"></div>
            <div className="postInput">
              <textarea
                className="writePost"
                type="text"
                placeholder="Leave a comment..."
                value={postContent}
                onChange={(e) => setPostContent(e.target.value)}
              ></textarea>
              <div className="stars">
                {[1, 2, 3, 4, 5].map((value) => (
                  <span
                    key={value}
                    className={`star ${value <= (hoverRating || selectedRating) ? "filled" : ""}`}
                    onMouseEnter={() => setHoverRating(value)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => setSelectedRating(value)}
                  >
                    &#9733;
                  </span>
                ))}
              </div>
              <button
                className="sendPost"
                onClick={() => rateItem(movieType, movieId, movieTitle, selectedRating, postContent)}
              >
                SEND POST
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RateContainer;

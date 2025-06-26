import React, { useEffect, useState } from "react";

const RateContainer = ({ message, moviesRanks, peopleRanks, searchMovies, movieId, movieType, movieTitle, moviePoster, movieAvg, movieVotes }) => {
  const [selectedRating, setSelectedRating] = useState(0);

  useEffect(() => {
    console.log("Message changed: ", message);
  }, [message]);

  useEffect(() => {
    console.log("Selected movie ID:", movieId);
    console.log("Selected movie type:", movieType);
    console.log("Selected movie title:", movieTitle);
    console.log("Selected movie poster:", moviePoster);
    console.log("Selected movie votes:", movieVotes);
    console.log("Selected movie avg:", movieAvg);
    setSelectedRating(0); // Reset rating every time movie changes
  }, [movieId, movieType, movieTitle, moviePoster, movieVotes, movieAvg]);

  const handleMouseOver = (index) => {
    setSelectedRating(index + 1);
  };

  const handleMouseLeave = () => {
    setSelectedRating(0);
  };

  const handleClick = (index) => {
    setSelectedRating(index + 1);
    console.log(`Selected Rating: ${index + 1} stars`);
  };

  return (
    <div className="ranks">
      <div className="rateContainer">
        <div className="ratedTitle"> {movieTitle} </div>
        <div className="ratedContainer">
          <div className="ratedInfo">
            <img className="rankImg" src={moviePoster} alt="" />
            <p className="votesInfo">{movieVotes}</p>
            <div className="starsInfo">
              {[...Array(5)].map((_, i) => (
                <span key={i} style={{ color: i < movieAvg ? "gold" : "gray" }}>
                  &#9733;
                </span>
              ))}
            </div>
          </div>
          <div className="myPost">
            <div className="myRank"></div>
            <div className="postInput">
              <textarea className="writePost" type="text" placeholder="Leave a comment..."></textarea>
              <div className="stars">
                {[...Array(5)].map((_, index) => (
                  <span
                    key={index}
                    className={`star ${index < selectedRating ? "filled" : ""}`}
                    onMouseOver={() => handleMouseOver(index)}
                    onMouseLeave={handleMouseLeave}
                    onClick={() => handleClick(index)}
                  >
                    &#9733;
                  </span>
                ))}
              </div>
              <button className="sendPost">SEND POST</button>
            </div>
          </div>
          <div className="posts">
            {(movieType === "movie" ? moviesRanks : peopleRanks)
              .filter((item) => item.id === movieId)
              .map((post) => (
                <div className="post" key={post.rankerName}>
                  <p className="userName">{
                    message.id === post.rankerName ? "Your post" : post.rankerName
                  }</p>
                  <p className="userPost">{post.post}</p>
                  <div className="userRank">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} style={{ color: i < movieAvg ? "gold" : "gray" }}>
                        &#9733;
                      </span>
                    ))}
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RateContainer;

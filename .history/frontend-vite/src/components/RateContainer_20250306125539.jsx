import React, { useEffect, useState } from "react";

const RateContainer = ({ message, movieTitle, moviePoster, movieAvg, movieVotes, lastQuery }) => {
  const [selectedRating, setSelectedRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);

  useEffect(() => {
    console.log("Message changed rate:", message);  // Log to ensure message is available
  }, [message]);
  console.log("Last Query changed:", lastQuery);


  useEffect(() => {
    setSelectedRating(0);
    setHoverRating(0);
  }, [movieTitle]);

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
              <button className="sendPost">SEND POST</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RateContainer;
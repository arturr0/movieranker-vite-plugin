import React, { useEffect } from "react";

const RateContainer = ({ message, moviesRanks, peopleRanks, searchMovies, movieId, movieType, movieTitle, moviePoster, movieAvg, movieVotes }) => {
  useEffect(() => {
      console.log("Message changed: ", message);
  }, [message]);
  useEffect(() => {
    console.log("Selected movie ID:", movieId);
    console.log("Selected movie type:", movieType); // ✅ Log movie type
    console.log("Selected movie title:", movieTitle);
    console.log("Selected movie poster:", moviePoster);
    console.log("Selected movie poster:", movieVotes);
    console.log("Selected movie poster:", movieAvg);
  }, [movieId, movieType, movieTitle, moviePoster, movieVotes, movieAvg]);
  // Function inside RateContainer that calls searchMovies
  const handleSearch = () => {
    console.log("Calling searchMovies from handleSearch...");
    if (searchMovies) {
      searchMovies();
    }
  };

  // useEffect(() => {
  //   handleSearch(); // Call handleSearch when RateContainer mounts
  // }, []);

  console.log("rate", moviesRanks, peopleRanks);

  return (
    <div className="ranks">
      <div className="rateContainer">
        <div className="title"> { movieTitle } </div>
        <div className="ratedContainer">
          <div className="ratedInfo">
            <img className="rankImg" src={ moviePoster } alt="" />
            <p className="votesInfo">{ movieVotes }</p>
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
                {[1, 2, 3, 4, 5].map((value) => (
                  <span key={value} className="star" data-value={value}>
                    &#9733;
                  </span>
                ))}
              </div>
              <button className="sendPost">SEND POST</button> {/* Trigger handleSearch */}
            </div>
          </div>
          <div className="posts"></div>
        </div>
      </div>
    </div>
  );
};

export default RateContainer;
const RateContainer = ({ moviesRanks, peopleRanks, searchMovies }) => {
  
  useEffect(() => {
    console.log("Calling searchMovies from RateContainer useEffect...");
    if (searchMovies) {
      searchMovies();
    }
  }, []); // Call it only once when the component mounts

  console.log("rate", moviesRanks, peopleRanks);
  
  return (
    <div className="ranks">
      <div className="rateContainer">
        <div className="title"></div>
        <div className="ratedContainer">
          <div className="ratedInfo">
            <img className="rankImg" src="" alt="" />
            <p className="votesInfo"></p>
            <div className="starsInfo"></div>
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
            </div>
          </div>
          <div className="posts"></div>
        </div>
      </div>
    </div>
  );
};

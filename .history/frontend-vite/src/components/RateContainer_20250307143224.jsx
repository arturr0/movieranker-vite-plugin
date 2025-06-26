import React, { useEffect, useState } from "react";

const RateContainer = ({ 
  sseData, 
  message, 
  moviesRanks, 
  peopleRanks, 
  movieID, 
  movieType, 
  movieTitle, 
  moviePoster, 
  movieAvg, 
  movieVotes, 
  lastQuery 
}) => {
  const [selectedRating, setSelectedRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [writePost, setWritePost] = useState(""); // Store the comment
  const [posts, setPosts] = useState(movieType === "movie" ? moviesRanks : peopleRanks);
  const [votes, setVotes] = useState(movieVotes);
  const [avgRating, setAvgRating] = useState(movieAvg);

  console.log("moviesRanks", moviesRanks);

  useEffect(() => {
    if (sseData) {
      console.log("New SSE data in RateContainer:", sseData);
      
      // Determine the correct data source (moviesRanks or peopleRanks)
      const sourceRanks = sseData.type === "movie" ? moviesRanks : peopleRanks;

      // Find posts related to the updated movie/person
      const updatedPosts = sourceRanks.filter(post => post.id === sseData.id);
      
      setPosts(updatedPosts);
    }
  }, [sseData, moviesRanks, peopleRanks]); // Update when SSE data or ranks change

  useEffect(() => {
    console.log("Message changed rate:", message);
  }, [message]);

  useEffect(() => {
    console.log("Last Query changed:", lastQuery);
  }, [lastQuery]);

  useEffect(() => {
    setSelectedRating(0);
    setHoverRating(0);
  }, [movieTitle]);

  useEffect(() => {
    const newVotesNo = posts.length;
    const newVotes = newVotesNo === 1 ? "1 vote" : `${newVotesNo} votes`;
    setVotes(newVotes);

    const newAvg = newVotesNo > 0 
      ? Math.round(posts.reduce((sum, post) => sum + post.rating, 0) / newVotesNo) 
      : 0;
      
    setAvgRating(newAvg);
  }, [posts]);

  async function rateItem(type, id, title) {
    const token = localStorage.getItem("jwt");

    if (selectedRating >= 1 && selectedRating <= 5) {
      try {
        const response = await fetch("http://localhost:3000/movies/rate", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            type,
            id,
            title,
            rating: selectedRating,
            post: writePost,
            queryType: lastQuery?.type,
            queryText: lastQuery?.text,
            querySenderID: lastQuery?.id,
            userName: message?.email,
          }),
        });

        const data = await response.json();
        console.log("Response:", data);
      } catch (error) {
        console.error("Error rating item:", error);
      }
    } else {
      alert("Invalid rating! Please provide a number between 1 and 5.");
    }
  }

  return (
    <div className="ranks">
      <div className="rateContainer">
        <div className="ratedTitle">{movieTitle}</div>
        <div className="ratedContainer">
          <div className="ratedInfo">
            <img className="rankImg" src={moviePoster} alt="" />
            <p className="votesInfo">{votes}</p>
            <div className="starsInfo">
              {[...Array(5)].map((_, i) => (
                <span key={i} className={i < avgRating ? "filled" : ""}>
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
                value={writePost}
                onChange={(e) => setWritePost(e.target.value)}
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
              <button className="sendPost" onClick={() => rateItem(movieType, movieID, movieTitle)}>
                SEND POST
              </button>
            </div>
          </div>
          <div className="posts">
            {posts.map(post => (
              <div className="post" key={post.rankerName}>
                <p className="userName">
                  {message.id === post.rankerName ? "Your post" : post.rankerName}
                </p>
                <p className="userPost">{post.post}</p>
                <div className="userRank">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} style={{ color: i < post.rating ? "gold" : "gray" }}>
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

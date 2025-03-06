import React, { useEffect, useState } from "react";

const RateContainer = ({ message, moviesRanks, peopleRanks, movieID, movieType, movieTitle, moviePoster, movieAvg, movieVotes, lastQuery }) => {
  const [selectedRating, setSelectedRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  useEffect(() => {
    console.log("Message changed rate:", message);  // Log to ensure message is available
  }, [message]);
  useEffect(() => {
    console.log("Last Query changed:", lastQuery);
  }, [lastQuery]);

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
  const [writePost, setWritePost] = useState(""); // Store the comment

  async function rateItem(type, id, title, rating) {
    const token = localStorage.getItem('jwt');
    
    if (selectedRating && !isNaN(selectedRating) && selectedRating >= 1 && selectedRating <= 5) {
        try {
            const response = await fetch(`http://localhost:3000/movies/rate`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    type,
                    id,
                    title,
                    rating: selectedRating,  // Use passed rating instead of missing selectedRating
                    post: writePost,  // Ensure correct selection
                    queryType: lastQuery?.type,    
                    queryText: lastQuery?.text,    
                    querySenderID: lastQuery?.id,
                    userName: message?.email, 
                }),
            });

            const data = await response.json();
            console.log('Response:', data);

        } catch (error) {
            console.error('Error rating item:', error);
        }
    } else {
        alert('Invalid rating! Please provide a number between 1 and 5.');
    }
}

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
                value={writePost} // Controlled component
                onChange={(e) => setWritePost(e.target.value)} // Update state
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
              <button className="sendPost" onClick={() => rateItem(movieType, movieID, movieTitle)}>SEND POST</button>
            </div>
          </div>
          <div className="posts">
            {(movieType === 'movie' ? moviesRanks : peopleRanks)
              .filter(item => item.id === movieID)
              .map(post => <div className="post" key={post.rankerName}>
                <p className="userName">{
                    message.id === post.rankerName ? 'Your post' : post.rankerName
                  }
                </p>
                <p className="userPost">{post.post}</p>
                <div className="userRank">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} style={{ color: i < movieAvg ? "gold" : "gray" }}>
                      &#9733;
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RateContainer;
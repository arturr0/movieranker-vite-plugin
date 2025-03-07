import React, { useEffect, useState } from "react";

const RateContainer = ({ sseData, message, moviesRanks, peopleRanks, movieID, movieType, movieTitle, moviePoster, movieAvg, movieVotes, lastQuery }) => {
  const [selectedRating, setSelectedRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  useEffect(() => {
    if (sseData) {
      console.log("New SSE data in RateContainer:", sseData);
      // Perform any actions based on SSE updates
    }
  }, [sseData]);
  
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

const ranks = movieType === 'movie' ? moviesRanks : peopleRanks;
const movieRanks = ranks.filter(rank => rank.id === movieID);
const totalVotes = movieRanks.length;
const averageRank = totalVotes > 0 ? Math.round(movieRanks.reduce((sum, r) => sum + r.rank, 0) / totalVotes) : 0;

return (
  <div className="ranks">
    <div className="rateContainer">
      <div className="ratedTitle">{movieTitle}</div>
      <div className="ratedContainer">
        <RankedInfo moviePoster={moviePoster} totalVotes={totalVotes} averageRank={averageRank} />
        <UserPostInput 
          writePost={writePost} 
          setWritePost={setWritePost} 
          hoverRating={hoverRating} 
          setHoverRating={setHoverRating} 
          selectedRating={selectedRating} 
          setSelectedRating={setSelectedRating} 
          rateItem={() => rateItem(movieType, movieID, movieTitle)} 
        />
        <UserPosts movieRanks={movieRanks} message={message} />
      </div>
    </div>
  </div>
);
};

const RankedInfo = ({ moviePoster, totalVotes, averageRank }) => (
  <div className="ratedInfo">
    <img className="rankImg" src={moviePoster} alt="" />
    <p className="votesInfo">{totalVotes === 1 ? "1 vote" : `${totalVotes} votes`}</p>
    <Stars rating={averageRank} />
  </div>
);

const Stars = ({ rating }) => (
  <div className="starsInfo">
    {[...Array(5)].map((_, i) => (
      <span key={i} className={i < rating ? "filled" : ""}>
        &#9733;
      </span>
    ))}
  </div>
);

const UserPostInput = ({ writePost, setWritePost, hoverRating, setHoverRating, selectedRating, setSelectedRating, rateItem }) => (
  <div className="myPost">
    <div className="myRank"></div>
    <div className="postInput">
      <textarea
        className="writePost"
        placeholder="Leave a comment..."
        value={writePost}
        onChange={(e) => setWritePost(e.target.value)}
      ></textarea>
      <RatingStars 
        hoverRating={hoverRating} 
        setHoverRating={setHoverRating} 
        selectedRating={selectedRating} 
        setSelectedRating={setSelectedRating} 
      />
      <button className="sendPost" onClick={rateItem}>SEND POST</button>
    </div>
  </div>
);

const RatingStars = ({ hoverRating, setHoverRating, selectedRating, setSelectedRating }) => (
  <div className="stars">
    {[1, 2, 3, 4, 5].map(value => (
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
);

const UserPosts = ({ movieRanks, message }) => (
  <div className="posts">
    {movieRanks.map(post => (
      <div className="post" key={post.rankerName}>
        <p className="userName">{message.id === post.rankerName ? 'Your post' : post.rankerName}</p>
        <p className="userPost">{post.post}</p>
        <Stars rating={post.rank} />
      </div>
    ))}
  </div>
);

export default RateContainer;
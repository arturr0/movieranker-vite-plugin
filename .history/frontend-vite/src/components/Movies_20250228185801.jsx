import React, { useEffect } from 'react';
import "../styles/movies.css";
// import "../styles/fontello.css";
//import "../styles/auth.css"; // Other styles


const Movies = () => {
  useEffect(() => {
    // Dynamically load the movies.css only when the Movies component is rendered
    import('../styles/movies.css');
  }, []);
  return (
    <p>Movies</p>
  );
};

export default Movies;

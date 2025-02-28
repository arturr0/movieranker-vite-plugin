import React from "react";
// import "../styles/movies.css";
// import "../styles/fontello.css";
//import "../styles/auth.css"; // Other styles


const Movies = () => {
  useEffect(() => {
    // Dynamically import the CSS for the Home page
    import('../styles/movies.css'); // Assuming Home.css is in the same folder
  }, []);
  return (
    <p>Movies</p>
  );
};

export default Movies;

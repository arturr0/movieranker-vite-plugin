import React, { useState, useEffect } from 'react';
//import styles from "../styles/test.module.css";
// import "../styles/fontello.css";
//import "../styles/auth.css"; // Other styles


const Movies = () => {
  const [styles, setStyles] = useState(null);

  useEffect(() => {
    import("../styles/test.module.css").then((module) => setStyles(module.default));
  }, []);

  if (!styles) return null; // Avoid flickering before styles load
  return <p className={styles.movieText}>Movies</p>;
};

export default Movies;

import React, { useState, useEffect } from 'react';

const Movies = () => {
  const [styles, setStyles] = useState(null);

  useEffect(() => {
    // Dynamically import the CSS specific to the movies page
    import("../styles/movies.module.css").then((module) => setStyles(module.default));
  }, []);

  if (!styles) return null; // Avoid flickering before styles load

  return <p className={styles.movieText}>Movies</p>;
};

export default Movies;
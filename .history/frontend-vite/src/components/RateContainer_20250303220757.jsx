// src/components/RateContainer.js
import React from "react";

const RateContainer = ({ moviesRanks, peopleRanks }) => {
  return (
    <div className="ranks">
      <div className="rateContainer">
        <h2>Movie Rankings</h2>
        {moviesRanks.map((movie) => (
          <div key={movie.id} className="rankedItem">
            <p>{movie.title} - Rank: {movie.rank}</p>
          </div>
        ))}

        <h2>People Rankings</h2>
        {peopleRanks.map((person) => (
          <div key={person.id} className="rankedItem">
            <p>{person.title} - Rank: {person.rank}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RateContainer;

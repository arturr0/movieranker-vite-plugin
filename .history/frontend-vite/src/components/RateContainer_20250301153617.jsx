// src/components/RateContainer.js
import React from "react";

const RateContainer = () => {
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
              <button className="sendPost">SEND POST</button>
            </div>
          </div>
          <div className="posts"></div>
        </div>
      </div>
    </div>
  );
};

export default RateContainer;

import React, { useEffect } from 'react';
// import "../styles/movies.css";
// import "../styles/fontello.css";
import "../styles/auth.css"; // Other styles
import Three from "./Three";

const AuthForm = () => {
  useEffect(() => {
    // Dynamically load the movies.css only when the Movies component is rendered
    import('../styles/movies.css');
  }, []);
  const handleFormSubmit = async (event, endpoint) => {
    event.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    if (email.trim() === "" || password.trim() === "") return;

    try {
      const response = await fetch(`http://localhost:3000/auth/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Login failed!");
        return;
      }

      if (data.token) {
        localStorage.setItem("jwt", data.token);
        if (endpoint === "login") {
          window.location.href = "/movies";
        } else {
          alert("Account created successfully! Please log in.");
          document.getElementById("title").textContent = "Log in";
        }
      }
    } catch (error) {
      console.error("Error during authentication:", error);
      alert("An error occurred. Check the console.");
    }
  };

  return (
    <div id="box">
      <div id="threejs-container">
        <Three />
      </div>
      <h1>
        <span className="fontawesome-star"></span> <span>Movie Ranker</span>{" "}
        <span className="fontawesome-star"></span>
      </h1>
      <div id="title">Log in or sign up</div>
      <div id="authDiv">
        <form id="auth-form">
          <input type="email" id="email" placeholder="Email" required />
          <input type="password" id="password" placeholder="Password" required />
        </form>
        <div id="buttons">
          <button type="button" onClick={(e) => handleFormSubmit(e, "register")}>
            Create Account
          </button>
          <button id="loginButton" onClick={(e) => handleFormSubmit(e, "login")}>
            Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;

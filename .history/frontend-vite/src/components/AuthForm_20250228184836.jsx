import React, { useEffect, useState } from "react";
import Three from "./Three";

const AuthForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Preload and dynamically import the CSS for authentication form
  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "preload";
    link.href = "../styles/auth.css"; // Ensure the path is correct for your project
    link.as = "style";
    document.head.appendChild(link);

    // Dynamically import the CSS
    import("../styles/auth.css");

    // Cleanup
    return () => {
      document.head.removeChild(link);
    };
  }, []);

  const handleFormSubmit = async (event, endpoint) => {
    event.preventDefault();

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
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
          />
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
          />
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

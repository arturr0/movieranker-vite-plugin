// AuthForm.jsx
import React, { useRef } from "react";
import Three from "./Three";

const AuthForm = () => {
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const titleRef = useRef(null);

  const handleFormSubmit = async (event, endpoint) => {
    event.preventDefault();
    const email = emailRef.current.value;
    const password = passwordRef.current.value;

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
          if (titleRef.current) {
            titleRef.current.textContent = "Log in";
          }
        }
      }
    } catch (error) {
      console.error("Error during authentication:", error);
      alert("An error occurred. Check the console.");
    }
  };

  return (
    <div className="auth-box">
      <div className="threejs-container">
        <Three />
      </div>
      <h1>Movie Ranker</h1>
      <div ref={titleRef} className="title">
        Log in or sign up
      </div>
      <div className="authForm">
        <form>
          <input ref={emailRef} type="email" placeholder="Email" required />
          <input ref={passwordRef} type="password" placeholder="Password" required />
        </form>
        <div className="buttons">
          <button onClick={(e) => handleFormSubmit(e, "register")}>Create Account</button>
          <button onClick={(e) => handleFormSubmit(e, "login")}>Login</button>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;

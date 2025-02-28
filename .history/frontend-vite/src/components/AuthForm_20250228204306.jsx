import React, { useRef } from "react";
//import styles from "../styles/auth.module.css"; // ✅ Correct Import
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
    <div className={styles.box}>
      <div className={styles["threejs-container"]}>
        <Three />
      </div>
      <h1>
        <span className={styles["fontawesome-star"]}></span> <span>Movie Ranker</span>{" "}
        <span className={styles["fontawesome-star"]}></span>
      </h1>
      <div ref={titleRef} className={styles.title}>
        Log in or sign up
      </div>
      <div className={styles.authDiv}>
        <form className={styles.authForm}>
          <input ref={emailRef} type="email" className={styles.email} placeholder="Email" required />
          <input ref={passwordRef} type="password" className={styles.password} placeholder="Password" required />
        </form>
        <div className={styles.buttons}>
          <button type="button" onClick={(e) => handleFormSubmit(e, "register")}>
            Create Account
          </button>
          <button className={styles.loginButton} onClick={(e) => handleFormSubmit(e, "login")}>
            Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;

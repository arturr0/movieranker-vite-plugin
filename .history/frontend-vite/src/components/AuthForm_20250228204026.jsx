import React, { useRef, useState, useEffect } from "react";
import Three from "./Three";

const AuthForm = () => {
  const [styles, setStyles] = useState(null);
  const fallbackStyles = {
    box: { padding: '20px', textAlign: 'center' },
    title: { fontSize: '24px', marginBottom: '20px' },
    authDiv: { display: 'flex', flexDirection: 'column', alignItems: 'center' },
    email: { padding: '10px', margin: '10px' },
    password: { padding: '10px', margin: '10px' },
    buttons: { display: 'flex', justifyContent: 'space-between', width: '100%' },
    loginButton: { background: 'blue', color: 'white' }
  };

  useEffect(() => {
    import("../styles/auth.module.css")
      .then((module) => setStyles(module.default))
      .catch((error) => console.error("Failed to load styles:", error));
  }, []);

  if (!styles) {
    return (
      <div style={fallbackStyles.box}>
        <div className="loading-spinner">Loading...</div>
      </div>
    );
  }

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
    <div className={styles.box || fallbackStyles.box}>
      <div className={styles["threejs-container"] || ''}>
        <Three />
      </div>
      <h1>
        <span className={styles["fontawesome-star"] || ''}></span> <span>Movie Ranker</span>
        <span className={styles["fontawesome-star"] || ''}></span>
      </h1>
      <div ref={titleRef} className={styles.title || fallbackStyles.title}>
        Log in or sign up
      </div>
      <div className={styles.authDiv || fallbackStyles.authDiv}>
        <form className={styles.authForm || ''}>
          <input ref={emailRef} type="email" className={styles.email || fallbackStyles.email} placeholder="Email" required />
          <input ref={passwordRef} type="password" className={styles.password || fallbackStyles.password} placeholder="Password" required />
        </form>
        <div className={styles.buttons || fallbackStyles.buttons}>
          <button type="button" onClick={(e) => handleFormSubmit(e, "register")}>
            Create Account
          </button>
          <button className={styles.loginButton || fallbackStyles.loginButton} onClick={(e) => handleFormSubmit(e, "login")}>
            Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;

import React from "react";
import { BrowserRouter as Router, Route, Switch, Link } from "react-router-dom";
import AuthForm from "./AuthForm";
import Movies from "./Movies";

const App = () => {
  return (
    <Router>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/auth">Login</Link>
        <Link to="/movies">Movies</Link>
      </nav>

      <Switch>
        <Route path="/" component={AuthForm} />
        <Route path="/movies" component={Movies} />
      </Switch>
    </Router>
  );
};

export default App;

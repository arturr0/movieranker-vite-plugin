import React from "react";
import { BrowserRouter as Router, Route, Switch, Link } from "react-router-dom";
import AuthForm from "./components/AuthForm";
import Movies from "./components/Movies";

const App = () => {
  return (
    <Router>
      <Switch>
        <Route path="/" component={AuthForm} />
        <Route path="/movies" component={Movies} />
      </Switch>
    </Router>
  );
};

export default App;

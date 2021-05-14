import React from 'react';
import { Switch, Route } from 'react-router';
import 'global.css';

const App = () => {
  return (
    <Switch>
      <Route exact path="/" component={<h1>hi!</h1>} />
    </Switch>
  );
};

export default App;

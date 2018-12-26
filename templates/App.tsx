module.exports = `import React, { Component } from 'react'
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import AuthedRoute from './core/AuthedRoute';

class App extends Component {
  render = () => (
    <Router>
      <Switch>
        <Route path='/login' component={() => <span>Unprotected</span>} />
        <AuthedRoute path='/' component={() => <span>Protected</span>} />
      </Switch>
    </Router>
  )
}

export default App;
`
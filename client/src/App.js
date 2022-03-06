import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import SignIn from './pages/signIn';
import SignUp from './pages/signUp';
import Dashboard from './pages/dashboard';
import {PrivateRoute} from './helpers/privateRoute';
import * as React from 'react';
import {authenticationService} from  './services/authenticationService';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      currentUser: null
    };
  }

  componentDidMount() {
    authenticationService.currentUser.subscribe(currentUser => this.setState({
        currentUser: currentUser,
    }));
  }

  render() {
    const {currentUser} = this.state;

    return (
      <div className="App">
        <Router>
          <Switch>
            <Route path="/signin" component={SignIn}/>
            <Route path="/signup" component={SignUp}/>
            <PrivateRoute path="/" component={Dashboard}/>
          </Switch>
        </Router>
      </div>
    );
  }
}

export default App;

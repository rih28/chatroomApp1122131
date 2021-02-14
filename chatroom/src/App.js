import Login from './components/Login'
import Chatroom from './components/Chatroom'
import {
  Route,
  BrowserRouter as Router,
  Switch
} from "react-router-dom";

function App() {
  return (
    <div>
      <Router>
        <Switch>
          <Route exact path="/" component={Login} />
          <Route exact path="/chatroom" component={Chatroom} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;

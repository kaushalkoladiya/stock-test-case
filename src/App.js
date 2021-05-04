import { Provider } from "react-redux";

import { BrowserRouter, Switch, Route } from "react-router-dom";
import Navbar from "./components/NavBar/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import store from "./redux/store";

import AuthRouter from "./util/AuthRouter";

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Navbar />
        <div className="container">
          <Switch>
            <Route path="/" exact component={Home} />
            <AuthRouter path="/login" exact component={Login} />
            <AuthRouter path="/signup" exact component={Signup} />
            {/* <Route path="/user/:username" exact component={User} />
      <Route path="/user/:username/post/:postId" exact component={User} /> */}
          </Switch>
        </div>
      </BrowserRouter>
    </Provider>
  );
}

export default App;

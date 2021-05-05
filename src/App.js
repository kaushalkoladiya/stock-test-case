import { useLazyQuery } from "@apollo/client";
import gql from "graphql-tag";
import { useEffect } from "react";
import { Provider } from "react-redux";

import { BrowserRouter, Switch, Route } from "react-router-dom";
import Navbar from "./components/NavBar/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import store from "./redux/store";
import { setUnauthenticated, setUserData } from "./redux/user/action";

import AuthRouter from "./util/AuthRouter";

const GET_ME_QUERY = gql`
  {
    getMe {
      _id
      email
      balance
    }
  }
`;

function App() {
  const dispatch = store.dispatch;
  const [executeQuery] = useLazyQuery(GET_ME_QUERY, {
    onCompleted: (data) => {
      dispatch(setUserData(data.getMe));
    },
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      executeQuery();
    } else {
      store.dispatch(setUnauthenticated());
    }
  }, []);

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

import React from "react";
//Stylesheet
import "./App.css";
//Components
import HomePage from "./pages/homepage/homepage.component.jsx";
import ShopPage from "./pages/shop-page/shop-page.component.jsx";
import Header from "./components/header/header.component";
import SignInUp from "./pages/sign-in-up-page/sign-in-up.component";
import CheckoutPage from "./pages/checkout-page/checkout-page.component";
//Routing
import { Route, Switch, Redirect } from "react-router-dom";
//Firebase Auth
import { auth, createUserProfileDocument } from "./firebase/firebase.utils.js";
//Redux connect
import { connect } from "react-redux";
//Actions
import { SET_CURRENT_USER } from "./redux/user/user.actions.js";

class App extends React.Component {
  unsubscribeFromAuth = null;

  componentWillUnmount() {
    this.unsubscribeFromAuth();
  }

  componentDidMount() {
    const { setCurrentUser } = this.props;
    this.unsubscribeFromAuth = auth.onAuthStateChanged(async (userAuth) => {
      if (userAuth) {
        const userRef = await createUserProfileDocument(userAuth);

        userRef.onSnapshot((snapShot) => {
          setCurrentUser({
            id: snapShot.id,
            ...snapShot.data(),
          });
        });
      } else setCurrentUser(userAuth);
    });
  }

  render() {
    const { currentUser } = this.props;
    return (
      <div>
        <Header />
        <Switch>
          <Route
            path="/signin"
            exact={true}
            render={() => {
              return currentUser ? <Redirect to="/" /> : <SignInUp />;
            }}
          />
          <Route path="/shop" exact={true} component={ShopPage} />
          <Route path="/checkout" exact={true} component={CheckoutPage} />
          <Route path="/" component={HomePage} />
        </Switch>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    currentUser: state.user.currentUser,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setCurrentUser: (user) => {
      dispatch({ type: SET_CURRENT_USER, payload: user });
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);

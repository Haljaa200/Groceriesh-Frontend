import React, { Component } from "react";
import { Route, Redirect, Switch } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Items from "./components/items";
import ItemForm from "./components/itemForm";
import Orders from "./components/orders";
import OrderDetails from "./components/orderDetails";
import CategoryForm from "./components/categoryForm";
import NotFound from "./components/notFound";
import NavBar from "./components/navBar";
import LoginForm from "./components/loginForm";
import RegisterForm from "./components/registerForm";
import Logout from "./components/logout";
import ProtectedRoute from "./components/common/protectedRoute";
import auth from "./services/authService";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";

class App extends Component {
  state = {};

  componentDidMount() {
    const user = auth.getCurrentUser();
    this.setState({ user });
  }

  render() {
    const { user } = this.state;
    let homeRoute = "/login";
    if (user) homeRoute = "/items";

    return (
      <React.Fragment>
        <ToastContainer />
        <NavBar user={user} />
        <main className="container">
          <Switch>
            <Route path="/register" component={RegisterForm} />
            <Route path="/login" component={LoginForm} />
            <Route path="/logout" component={Logout} />
            <ProtectedRoute path="/items/:id" component={ItemForm} />
            <ProtectedRoute
              path="/items"
              render={props => <Items {...props} user={this.state.user} />}
            />
            <ProtectedRoute path="/orders/:id" component={OrderDetails} />
            <ProtectedRoute path="/orders" component={Orders} />
            <ProtectedRoute path="/category/:id" component={CategoryForm} />
            <Route path="/not-found" component={NotFound} />
            <Redirect from="/" exact to={homeRoute} />
            <Redirect to="/not-found" />
          </Switch>
        </main>
      </React.Fragment>
    );
  }
}

export default App;

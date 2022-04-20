import React from "react";
import Joi from "joi-browser";
import Form from "./common/form";
import * as userService from "../services/userService";
import auth from "../services/authService";

class RegisterForm extends Form {
  state = {
    data: { email: "", password: "", store_name: "", owner_name: "", phone: "", store_phone: "", address: "", latitude: 0.0, longitude: 0.0 },
    errors: {}
  };

  schema = {
    email: Joi.string().required().email().label("email"),
    password: Joi.string().required().min(5).label("Password"),
    store_name: Joi.string().required().label("Store Name"),
    owner_name: Joi.string().required().label("Owner Name"),
    phone: Joi.string().required().label("Phone Number"),
    store_phone: Joi.string().required().label("Store Phone"),
    address: Joi.string().required().label("Address"),
    latitude: Joi.number(),
    longitude: Joi.number()
  };

  defaultLocation = { lat: 10, lng: 106 };

  doSubmit = async () => {
    try {
      const response = await userService.register(this.state.data);
      auth.loginWithJwt(response.data.data.token);
      window.location = "/";
    } catch (ex) {
      if (ex.response && ex.response.status === 400) {
        const errors = { ...this.state.errors };
        errors.email = ex.response.data.data.message;
        this.setState({ errors });
      }
    }
  };

  render() {
    return (
      <div>
        <h1>Register</h1>
        <form onSubmit={this.handleSubmit}>
          {this.renderInput("email", "Email")}
          {this.renderInput("password", "Password", "password")}
          {this.renderInput("store_name", "Store Name")}
          {this.renderInput("owner_name", "Owner Name")}
          {this.renderInput("phone", "Phone Number", "tel")}
          {this.renderInput("store_phone", "Store Phone", "tel")}
          {this.renderInput("address", "Address")}
          {this.renderMap(this.defaultLocation)}
          {this.renderButton("Register", "10px")}
        </form>
      </div>
    );
  }
}

export default RegisterForm;

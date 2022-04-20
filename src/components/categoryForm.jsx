import React from "react";
import Joi from "joi-browser";
import Form from "./common/form";
import { saveCategory } from "../services/categoiesService";

class CategoryForm extends Form {
  state = {
    data: {
      name: "",
    },
    errors: {}
  };

  schema = {
    _id: Joi.string(),
    name: Joi.string()
      .required()
      .label("Name"),
  };

  doSubmit = async () => {
    await saveCategory(this.state.data);
    this.props.history.push("/items");
  };

  render() {
    return (
      <div>
        <h1>Category Form</h1>
        <form onSubmit={this.handleSubmit}>
          {this.renderInput("name", "Name")}
          {this.renderButton("Save")}
        </form>
      </div>
    );
  }
}

export default CategoryForm;

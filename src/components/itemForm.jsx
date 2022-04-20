import React from "react";
import Joi from "joi-browser";
import Form from "./common/form";
import { getItem, saveItem } from "../services/itemsService";
import { getCategories } from "../services/categoiesService";

class ItemForm extends Form {
  state = {
    data: {
      category_id: "",
      name: "",
      price: 0.0,
      unit: "",
      description: "",
    },
    categories: [],
    errors: {}
  };

  schema = {
    _id: Joi.string(),
    name: Joi.string()
      .required()
      .label("Name"),
    category_id: Joi.string()
      .required()
      .label("Category"),
    price: Joi.number()
      .required()
      .min(0)
      .label("Price"),
    unit: Joi.string()
      .required()
      .label("Unit"),
    description: Joi.string()
      .required()
      .label("Description"),
  };

  async populateCategories() {
    const { data } = await getCategories();
    const categories = data.data.categories;
    this.setState({ categories });
  }

  async populateItem() {
    try {
      const itemId = this.props.match.params.id;
      if (itemId === "new") return;

      const { data: item } = await getItem(itemId);
      this.setState({ data: this.mapToViewModel(item.data.item) });
    } catch (ex) {
      if (ex.response && ex.response.status === 404)
        this.props.history.replace("/not-found");
    }
  }

  async componentDidMount() {
    await this.populateCategories();
    await this.populateItem();
  }

  mapToViewModel(item) {
    return {
      _id: item._id,
      name: item.name,
      category_id: item.category_id,
      price: item.price,
      unit: item.unit,
      description: item.description
    };
  }

  doSubmit = async () => {
    await saveItem(this.state.data);
    this.props.history.push("/items");
  };

  render() {
    return (
      <div>
        <h1>Item Form</h1>
        <form onSubmit={this.handleSubmit}>
          {this.renderInput("name", "Name")}
          {this.renderSelect("category_id", "Category", this.state.categories)}
          {this.renderInput("price", "Price", "number")}
          {this.renderInput("unit", "Unit")}
          {this.renderInput("description", "Description")}
          {this.renderButton("Save")}
        </form>
      </div>
    );
  }
}

export default ItemForm;

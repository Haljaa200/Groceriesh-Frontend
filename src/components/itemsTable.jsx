import React, { Component } from "react";
import auth from "../services/authService";
import { Link } from "react-router-dom";
import Table from "./common/table";

class ItemsTable extends Component {
  columns = [
    {
      path: "name",
      label: "Name",
      content: item => <Link to={`/items/${item._id}`}>{item.name}</Link>
    },
    { path: "price", label: "Price" },
    { path: "description", label: "Description" },
    { path: "unit", label: "Unit" }
  ];

  deleteColumn = {
    key: "delete",
    content: item => (
      <button
        onClick={() => this.props.onDelete(item)}
        className="btn btn-danger btn-sm"
      >
        Delete
      </button>
    )
  };

  constructor() {
    super();
    const user = auth.getCurrentUser();
    if (user) this.columns.push(this.deleteColumn);
  }

  render() {
    const { items, onSort, sortColumn } = this.props;

    return (
      <Table
        columns={this.columns}
        data={items}
        sortColumn={sortColumn}
        onSort={onSort}
      />
    );
  }
}

export default ItemsTable;

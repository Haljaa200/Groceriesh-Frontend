import React, { Component } from "react";
import { Link } from "react-router-dom";
import Table from "./common/table";

class OrdersTable extends Component {
  columns = [
    {
      path: "delivery_time_planned",
      label: "Time to Deliver",
      content: order => <Link to={`/orders/${order._id}`}>{new Date(order.delivery_time_planned).toString()}</Link>
    },
    { path: "total_price", label: "Total Price" },
    { path: "delivery_address", label: "Delivery Address" },
  ];

  render() {
    const { orders, onSort, sortColumn } = this.props;

    return (
      <Table
        columns={this.columns}
        data={orders}
        sortColumn={sortColumn}
        onSort={onSort}
      />
    );
  }
}

export default OrdersTable;

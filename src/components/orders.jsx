import React, { Component } from "react";
import OrdersTable from "./ordersTable";
import Pagination from "./common/pagination";
import { getOrders } from "../services/ordersService";
import { paginate } from "../utils/paginate";
import _ from "lodash";
import SearchBox from "./searchBox";

class Orders extends Component {
  state = {
    orders: [],
    currentPage: 1,
    pageSize: 4,
    searchQuery: "",
    sortColumn: { path: "delivery_time_planned", order: "asc" }
  };

  async componentDidMount() {
    const { data: orders } = await getOrders();
    this.setState({ orders: orders.data.orders });
  }

  handlePageChange = page => {
    this.setState({ currentPage: page });
  };

  handleSearch = query => {
    this.setState({ searchQuery: query, currentPage: 1 });
  };

  handleSort = sortColumn => {
    this.setState({ sortColumn });
  };

  getPagedData = () => {
    const {
      pageSize,
      currentPage,
      sortColumn,
      searchQuery,
      orders: allOrders
    } = this.state;

    let filtered = allOrders;
    if (searchQuery)
      filtered = allOrders.filter(i =>
        i.name.toLowerCase().startsWith(searchQuery.toLowerCase())
      );

    const sorted = _.orderBy(filtered, [sortColumn.path], [sortColumn.order]);

    const orders = paginate(sorted, currentPage, pageSize);

    return { totalCount: filtered.length, data: orders };
  };

  render() {
    const { length: count } = this.state.orders;
    const { pageSize, currentPage, sortColumn, searchQuery } = this.state;

    if (count === 0) return (
        <div className="col">
          <p>There are no orders in the database.</p>
        </div>
    )

    const { totalCount, data: orders } = this.getPagedData();

    return (
      <div className="row">
        
        <div className="col">
          <p>Showing {totalCount} orders in the database.</p>
          <SearchBox value={searchQuery} onChange={this.handleSearch} />
          <OrdersTable
            orders={orders}
            sortColumn={sortColumn}
            onSort={this.handleSort}
          />
          <Pagination
            itemsCount={totalCount}
            pageSize={pageSize}
            currentPage={currentPage}
            onPageChange={this.handlePageChange}
          />
        </div>
      </div>
    );
  }
}

export default Orders;

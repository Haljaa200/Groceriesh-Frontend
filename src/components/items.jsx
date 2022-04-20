import React, { Component } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import ItemsTable from "./itemsTable";
import ListGroup from "./common/listGroup";
import Pagination from "./common/pagination";
import { getItems, deleteItem } from "../services/itemsService";
import { getCategories } from "../services/categoiesService";
import { paginate } from "../utils/paginate";
import _ from "lodash";
import SearchBox from "./searchBox";

class Items extends Component {
  state = {
    items: [],
    categories: [],
    currentPage: 1,
    pageSize: 4,
    searchQuery: "",
    selectedCategory: null,
    sortColumn: { path: "name", order: "asc" }
  };

  async componentDidMount() {
    const { data } = await getCategories();
    const categories = [{ _id: "", name: "All Categories" }, ...data.data.categories];

    const { data: items } = await getItems();
    this.setState({ items: items.data.items, categories });
  }

  handleDelete = async item => {
    const originalItems = this.state.items;
    const items = originalItems.filter(i => i._id !== item._id);
    this.setState({ items });

    try {
      await deleteItem(item._id);
    } catch (ex) {
      if (ex.response && ex.response.status === 404)
        toast.error("This item has already been deleted.");

      this.setState({ items: originalItems });
    }
  };


  handlePageChange = page => {
    this.setState({ currentPage: page });
  };

  handleCategorySelect = genre => {
    this.setState({ selectedCategory: genre, searchQuery: "", currentPage: 1 });
  };

  handleSearch = query => {
    this.setState({ searchQuery: query, selectedCategory: null, currentPage: 1 });
  };

  handleSort = sortColumn => {
    this.setState({ sortColumn });
  };

  getPagedData = () => {
    const {
      pageSize,
      currentPage,
      sortColumn,
      selectedCategory,
      searchQuery,
      items: allItems
    } = this.state;

    let filtered = allItems;
    if (searchQuery)
      filtered = allItems.filter(i =>
        i.name.toLowerCase().startsWith(searchQuery.toLowerCase())
      );
    else if (selectedCategory && selectedCategory._id)
      filtered = allItems.filter(i => i.category_id === selectedCategory._id);

    const sorted = _.orderBy(filtered, [sortColumn.path], [sortColumn.order]);

    const items = paginate(sorted, currentPage, pageSize);

    return { totalCount: filtered.length, data: items };
  };

  render() {
    const { length: count } = this.state.items;
    const { pageSize, currentPage, sortColumn, searchQuery } = this.state;
    const { user } = this.props;

    if (count === 0) return (
      <div className="row">
        <div className="col-3">
          <ListGroup
            items={this.state.categories}
            selectedItem={this.state.selectedCategory}
            onItemSelect={this.handleCategorySelect}
          />
        </div>
        <div className="col">
          <div className="row" style={{ marginBottom: 20 }}>
              {user && (
                <Link
                  to="/category/new"
                  className="btn btn-primary"
                  style={{ marginRight: 10 }}
                >
                  New Category
                </Link>
              )} 
              {user && (
                <Link
                  to="/items/new"
                  className="btn btn-primary"
                >
                  New Item
                </Link>
              )}          
          </div>
          <p>There are no items in the database.</p>
        </div>
      </div>
    )

    const { totalCount, data: items } = this.getPagedData();

    return (
      <div className="row">
        <div className="col-3">
          <ListGroup
            items={this.state.categories}
            selectedItem={this.state.selectedCategory}
            onItemSelect={this.handleCategorySelect}
          />
        </div>
        <div className="col">
          <div className="row" style={{ marginBottom: 20 }}>
              {user && (
                <Link
                  to="/category/new"
                  className="btn btn-primary"
                  style={{ marginRight: 10 }}
                >
                  New Category
                </Link>
              )} 
              {user && (
                <Link
                  to="/items/new"
                  className="btn btn-primary"
                >
                  New Item
                </Link>
              )}           
          </div>
          <p>Showing {totalCount} items in the database.</p>
          <SearchBox value={searchQuery} onChange={this.handleSearch} />
          <ItemsTable
            items={items}
            sortColumn={sortColumn}
            onDelete={this.handleDelete}
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

export default Items;

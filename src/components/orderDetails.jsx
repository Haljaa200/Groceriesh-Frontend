import React from "react";
import Form from "./common/form";
import { getOrder, deliverOrder } from "../services/ordersService";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationPin } from "@fortawesome/free-solid-svg-icons";
import GoogleMap from "google-map-react";

class OrderDetails extends Form {
  state = {
    data: {
      _id: "",
      delivery_latitude: 0.0,
      delivery_longitude: 0.0,
      delivery_address: "",
      items: [],
      total_price: 0.0,
      delivery_time_planned: 0,
      notes: "",
    },
    errors: {},
    mapZoom: 17,
    showMap: null,
  };

  async populateOrder() {
    try {
      const orderId = this.props.match.params.id;
      const { data: order } = await getOrder(orderId);
      this.setState({ data: this.mapToViewModel(order.data.order), showMap: true });
    } catch (ex) {
      if (ex.response && ex.response.status === 404)
        this.props.history.replace("/not-found");
    }
  }

  async componentDidMount() {
    await this.populateOrder();
  }

  mapToViewModel(order) {
    return {
      _id: order._id,
      delivery_latitude: order.delivery_latitude,
      delivery_longitude: order.delivery_longitude,
      delivery_address: order.delivery_address,
      items: order.items,
      total_price: order.total_price,
      delivery_time_planned: order.delivery_time_planned,
      notes: order.notes,
    };
  }

  onDeliver = async () => {
    await deliverOrder(this.state.data._id, this.state.delivery_time_planned);
    this.props.history.push("/orders");
  };

  render() {
    return (
      <div className="row">
        <div className="col">
          <h1>Order Details</h1>
          <h5>Deliver to {this.state.data.delivery_address}</h5>
          <h5>Time to Deliver: { new Date(this.state.data.delivery_time_planned).toString() }</h5>
          <h5>Notes: {this.state.data.notes}</h5>
          <ul className="list-group" style={{marginTop: "30px"}}>
            {this.state.data.items.map(item => (
              <li
                key={item["name"]}
                className="list-group-item"
              >
                {`${item["name"]}, Price: ${item["price"]}       (Quantity: ${item["quantity"]})`}
              </li>
            ))}
          </ul>

          <h5 style={{marginTop: "30px", marginBottom: "30px"}}>Total Price: {this.state.data.total_price}</h5>

          <button
            onClick={this.onDeliver}
            className="btn btn-primary"
          >
            Deliver
          </button>
        </div>

        { this.state.showMap && (
          <div className="col" style={{ height: '50vh' }}>
            <GoogleMap
              bootstrapURLKeys={{ key: 'AIzaSyCBgPe7SxxGV3gE8PTSBgozl-TUn57S2Og' }}
              defaultCenter={{ lat: this.state.data.delivery_latitude, lng: this.state.data.delivery_longitude }}
              defaultZoom={this.state.mapZoom}
            >
              <FontAwesomeIcon
                icon={faLocationPin}
                size="4x"
                lat={this.state.data.delivery_latitude}
                lng={this.state.data.delivery_longitude}
                text="Delivery Location"
              />
            </GoogleMap>
          </div>
        )}

      </div>
    );
  }
}

export default OrderDetails;

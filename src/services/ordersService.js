import http from "./httpService";

export function getOrders() {
  return http.get(process.env.REACT_APP_API_URL + "/orders");
}

export function getOrder(id) {
  return http.get(process.env.REACT_APP_API_URL + `/orders/${id}`);
}

export function deliverOrder(id, deliveryTime) {
  return http.post(process.env.REACT_APP_API_URL + `/deliver_order/${id}`, { delivery_time: deliveryTime });
}

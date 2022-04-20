import http from "./httpService";

const apiEndpoint = process.env.REACT_APP_API_URL + "/register";

export function register(user) {
  return http.post(apiEndpoint, {
    email: user.email,
    password: user.password,
    store_name: user.store_name,
    owner_name: user.owner_name,
    phone: user.phone,
    store_phone: user.store_phone,
    address: user.address,
    latitude: user.latitude,
    longitude: user.longitude
  });
}

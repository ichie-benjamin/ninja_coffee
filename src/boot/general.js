import axios from "axios";
import store from "../store/store";

export function login(credentials) {
  return new Promise((res, rej) => {
    axios.post('/auth/login', credentials)
      .then((response) => {
        setAuthorization(response.data.access_token);
        res(response.data);
      })
      .catch((err) =>{
        rej("Wrong email or password");
      })
  })
}



export function setAuthorization(token) {
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`
}

export function initialize(store) {
  if (store.state.currentUser) {
    setAuthorization(store.state.currentUser.token);
  }
}




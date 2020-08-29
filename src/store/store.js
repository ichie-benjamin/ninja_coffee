import { firebaseDb, firebaseAuth } from "boot/firebase";

// import {getLocalUser} from "../router";
import { LocalStorage } from 'quasar'
// const user = getLocalUser();
const state = {
  currentUser: {},
  products:[],
  orders:[],
  stores:[],
  authError: null,
}
const mutations = {
  setUserDetail(state, payload){
    state.currentUser = payload
  },
  remove_product(state,id){
    let index = state.carts.findIndex( (cart) => {
      return cart.id == id
    });
    if(index !== -1) {
      state.carts.splice(index, 1);
      axios.post("/cart/delete", {'id':id})
        .then();
    }
  },

  updateStores(state, payload) {
    state.stores = payload;
  },

  updateOrders(state, payload) {
    state.orders = payload;
  },

  updateProducts(state, payload) {
    state.products = payload;
  },

  login(state) {
    state.loading = true;
    state.authError = null;
  },
  regSuccess(state, payload){
    state.reg_success = payload
  },
  loginSuccess(state, payload) {
    state.authError = null;
    state.isLoggedIn = true;
    state.loading = false;
    state.currentUser = Object.assign({}, payload.user, {token: payload.access_token});
    LocalStorage.set("user", JSON.stringify(state.currentUser));
  },
  logout(state) {
    LocalStorage.remove("user");
    state.isLoggedIn = false;
    state.carts = [],
    state.currentUser = null;
  },
  loginFailed(state, payload) {
    state.loading = false;
    state.authError = payload.error;
  },}
const getters = {

  currentUser(state) {
    return state.currentUser;
  },

  authError(state) {
    return state.authError;
  },
  reg_success(state) {
    return state.reg_success;
  },
}
const actions = {
  loginUser({commit}) {
    commit("login");
  },


  getStores(context) {
    let stores = [];
    firebaseDb.collection("users").where("is_admin", "==", false).get().then
    ((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        stores.push(doc.data());
      });
      context.commit('updateStores', stores);
    });
  },
  getOrders(context) {
    let orders = [];
    firebaseDb.collection("orders").get().then
    ((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        orders.push(doc.data());
      });
      context.commit('updateOrders', orders);
    });
  },
  getProducts(context) {
    let products = [];
    firebaseDb.collection("products").orderBy('date').get().then
    ((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        products.push(doc.data());
      });
      context.commit('updateProducts', products);
    });
  },

  handleAuthStateChanged({ commit }){
    firebaseAuth.onAuthStateChanged(user => {
      if (user) {
        // User is signed in.
        let userId = firebaseAuth.currentUser.uid
        firebaseDb.collection("users").doc(userId).get().then(function(doc) {
            let userDetail = doc.data();
            commit('setUserDetail', {
              name:userDetail.name,
              email:userDetail.email,
              is_admin: userDetail.is_admin,
              userId:userId,
            })
        });
        this.$router.push('/')
      } else {
        // No user is signed in.
        // commit('setUserDetail',{})
        this.$router.push('/login')
      }
    });
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}

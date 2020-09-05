import { firebaseDb, firebaseAuth } from "boot/firebase";

// import {getLocalUser} from "../router";
import { LocalStorage } from 'quasar'
// const user = getLocalUser();
const state = {
  currentUser: {},
  products:[],
  orders:[],
  stores:[],
  stocks:[],
  carts:[],
  authError: null,
}
const mutations = {
  setUserDetail(state, payload){
    state.currentUser = payload
  },

  updateStores(state, payload) {
    state.stores = payload;
  },

  updateOrders(state, payload) {
    state.orders = payload;
  },

  updateStocks(state, payload) {
    state.stocks = payload;
  },

  updateCarts(state, payload) {
    state.carts = payload;
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
  getCarts(context){
    let carts = [];
    firebaseDb.collection("carts").doc(state.currentUser.userId).collection('details').get().then
    ((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        carts.push(doc.data());
      });
      context.commit('updateCarts', carts);
    });
  },
  getStocks(context) {
    let user = state.currentUser;
    let stocks = [];
      firebaseDb.collection("items").where('store_id', '==', user.userId).get().then
      ((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          stocks.push(doc.data());
        });
        context.commit('updateStocks', stocks);
      });
  },

  getOrders(context) {
    let orders = [];
    let user = state.currentUser;
    if(user.is_admin){
      firebaseDb.collection("orders").get().then
      ((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          let item = {}
          item.id = doc.id;
          item.date = doc.data().date;
          item.qty = doc.data().qty;
          item.stock = doc.data().stock;
          item.store = doc.data().store;
          item.user_id = doc.data().user_id;
          item.fulfilled = doc.data().fulfilled;
          orders.push(item);
        });
        context.commit('updateOrders', orders);
      })
    }else {
      firebaseDb.collection("orders").where('user_id', '==', user.userId).get().then
      ((queryOrder) => {
        queryOrder.forEach((doc) => {
          let item = {}
          item.id = doc.id;
          item.date = doc.data().date;
          item.qty = doc.data().qty;
          item.stock = doc.data().stock;
          item.store = doc.data().store;
          item.user_id = doc.data().user_id;
          item.fulfilled = doc.data().fulfilled;
          orders.push(item);
        });
        context.commit('updateOrders', orders);
      })
    }

  },
  getProducts(context) {
    let products = [];
    firebaseDb.collection("products").orderBy("name", "asc").get().then
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

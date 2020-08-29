import Login from "../pages/auth/Login";
import Register from "pages/auth/Register";
import AddProduct from "pages/product/Add";
import AdminIndex from "pages/admin/Index";
import ProductIndex from "pages/product/Index";
import StoreIndex from "pages/Store/Index";
import Orders from "pages/admin/Orders";


import {VueRouter} from "vue-router";
import {firebaseAuth} from "boot/firebase";
import AddStock from "pages/admin/AddStock";
import AddShop from "pages/admin/AddShop";

const routes = [
  {
    path: '/',
    component: () => import('layouts/AdminLayout.vue'),
    children: [
      { path: '', component: AdminIndex, meta: { requiresAuth: true, name : 'Dashboard'} }
    ]
  },
  {
    path: '/admin',
    component: () => import('layouts/AdminLayout.vue'),
    children: [
      { path: '', component: AdminIndex, meta: { requiresAuth: true}  },
      { path: 'stores', component: StoreIndex, meta: { requiresAuth: true, name: 'Stores'}  },
      { path: 'orders', component: Orders, meta: { requiresAuth: true, name: 'Orders'}  },
      { path: 'add/stock', component: AddStock, meta: { requiresAuth: true, name: 'Add Stock'}  },
      { path: 'add/store', component: AddShop, meta: { requiresAuth: true, name: 'Add Store'}  },
    ]
  },
  {
    path: '/product',
    component: () => import('layouts/AdminLayout'),
    children: [
      { path: '', component: ProductIndex, meta: { requiresAuth: true, name:'Products'} },
      { path: 'add', component: AddProduct, meta: { requiresAuth: true, name:'Add Product'}  }
    ]
  },

  {
    path: '/',
    component: () => import('layouts/Login.vue'),
    children: [
      {path: '/login', component: Login, meta: {
          requiresGuest: true,
          name: "Login"
        }},
      {path: '/register', component: Register, meta: {
          requiresGuest: true,
          name: "Register"
        }},
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '*',
    component: () => import('pages/Error404.vue')
  }
]


export default routes


// let router = new VueRouter({routes})
//

// router.beforeEach((to, from, next) => {
//   if(to.matched.some(record => record.meta.requiresAuth)){
//     //check if not Logged in
//     if(!firebaseAuth.currentUser){
//       //Go to login page
//       next({
//         path:'/login',
//         query:{
//           redirect: to.fullPath
//         }
//       })
//     }else {
//       //proceed to route
//       next();
//     }
//   }else if(to.matched.some(record => record.meta.requiresGuest)){
//     if(firebaseAuth.currentUser){
//       //Go to page
//       next({
//         path:'/',
//         query:{
//           redirect: to.fullPath
//         }
//       })
//     }else {
//       //proceed to route
//       next();
//     }
//   }else {
//     //proceed to route
//     next();
//   }
// })


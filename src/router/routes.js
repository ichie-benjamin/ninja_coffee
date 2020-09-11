import Login from "../pages/auth/Login";
import Register from "pages/auth/Register";
import AddProduct from "pages/product/Add";
import AdminIndex from "pages/admin/Index";
import ProductIndex from "pages/product/Index";
import StoreIndex from "pages/Store/Index";
import Orders from "pages/admin/Orders";

import AddStock from "pages/admin/AddStock";
import AddShop from "pages/admin/AddShop";
import UpdateStock from "pages/admin/UpdateStock";
import StockOverview from "pages/admin/StockOverview";
import Carts from "pages/admin/Carts";
import OrderDetails from "pages/admin/OrderDetails";

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
      { path: 'cart', component: Carts, meta: { requiresAuth: true, name: 'Cart'}  },
      { path: 'add/stock', component: AddStock, meta: { requiresAuth: true, name: 'Add Stock'}  },
      { path: 'update/stock', component: UpdateStock, meta: { requiresAuth: true, name: 'Update Stock'}  },
      { path: 'stock/overview', component: StockOverview, meta: { requiresAuth: true, name: 'Stock Overview'}  },
      { path: 'add/store', component: AddShop, meta: { requiresAuth: true, name: 'Add Store'}  },
      {path: '/order/:id/:ref', component: OrderDetails, meta: {name: "Order Details"}},
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

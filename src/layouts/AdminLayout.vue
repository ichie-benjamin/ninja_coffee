<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated class="bg-info bg-main no-shadow text-main">
      <q-toolbar>
        <q-btn
          flat
          v-if="title != 'Dashboard'"
          v-go-back.single
          dense
          round
          @click="logout"
          icon="arrow_back"
          aria-label="Logout"
        />
        <q-toolbar-title class="text-center">
          {{ title }}
        </q-toolbar-title>
        <q-btn
          flat
          dense
          round
          @click="logout"
          icon="login"
          aria-label="Logout"
        />

      </q-toolbar>
    </q-header>

    <q-footer elevated bordere class="bg-info text-main no-shadow">
      <q-tabs v-if="currentUser.is_admin" dense no-caps class="text-black">
        <q-route-tab
          v-for="nav in admin_navs"
          :key="nav.label"
          :to="nav.to"
          :icon="nav.icon"
          :class="nav.is_center ? 'center' : ''"
          :label="nav.is_center ? '' : nav.label"
        >
        </q-route-tab>
      </q-tabs>
      <q-tabs v-else dense no-caps class="text-black">
        <q-route-tab
          v-for="nav in user_navs"
          :key="nav.label"
          :to="nav.to"
          :icon="nav.icon"
          :class="nav.is_center ? 'center' : ''"
          :label="nav.is_center ? '' : nav.label"
        >
          <q-badge v-if="nav.label === 'Cart' && carts.length > 0" color="red" floating>{{ carts.length }}</q-badge>
        </q-route-tab>
      </q-tabs>
    </q-footer>


    <q-page-container class="bg-info- bg-main">
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>

import {firebaseAuth} from "boot/firebase";
import {mapState} from "vuex";

export default {
  name: 'AdminLayout',
  data () {
    return {
      leftDrawerOpen: false,
      admin_navs: [
        {
          label: "Product",
          icon: "add",
          is_center:0,
          // to: "/home"
          to:'/product/add'
        },
        {
          label: "Categories",
          icon: "view_module",
          is_center:1,
          is_:false,
          to: "/"
        },
        {
          label: "Orders",
          icon: "contact_support",
          is_center:0,
          to: "/admin/orders"
        }
      ],
      user_navs: [
        {
          label: "Buy Stock",
          icon: "add",
          is_center:0,
          // to: "/home"
          to:'/product'
        },
        {
          label: "Categories",
          icon: "view_module",
          is_center:1,
          is_:false,
          to: "/"
        },
        {
          label: "Cart",
          icon: "shopping_cart",
          is_center:0,
          to: "/admin/cart"
        }
      ]

    }
  },
  methods:{
    logout(){
      firebaseAuth.signOut().then(()=>{
        this.$router.push('/login');
      })
    }
  },
  computed:{
    ...mapState('store', ['carts', 'currentUser']),
    title() {
      let currentPath = this.$route.fullPath;
      if (currentPath == '/') return 'Dashboard'
      else return this.$route.meta.name
    },
    ...mapState('store', ['currentUser']),
  }
}
</script>

<style lang="scss">
.center {
  .q-tab__icon{
    margin-bottom: -20px;
  }
  color: red;
  .q-tab__icon{
    font-size: 45px!important;
    background: black;
    padding: 15px;
    border-radius: 50%;
    margin-bottom: 5px;
  }
}
</style>

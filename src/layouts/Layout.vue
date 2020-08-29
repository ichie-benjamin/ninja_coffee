<template>
  <q-layout view="lHh Lpr lFf">
    <q-footer elevated bordere class="bg-info text-white">
      <q-tabs dense no-caps class="text-black">
        <q-route-tab
          v-for="nav in navs"
          :key="nav.label"
          :to="nav.to"
          :icon="nav.icon"
          :class="nav.is_center ? 'center' : ''"
          :label="nav.is_center ? '' : nav.label"
        >
        </q-route-tab>
      </q-tabs>
    </q-footer>
    <q-page-container class="bg-info">
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<!--:label="nav.label"-->
<script>

export default {
  name: 'Layout',
  data () {
    return {
      navs: [
        {
          label: "Home",
          icon: "home",
          is_center:0,
          // to: "/home"
          to:'/'
        },
        {
          label: "Categories",
          icon: "view_module",
          is_center:1,
          to: "/"
        },
        {
          label: "Orders",
          icon: "contact_support",
          is_center:0,
          to: "/orders"
        }
      ]
    }
  }
}
</script>

<style lang="scss">
.center {
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

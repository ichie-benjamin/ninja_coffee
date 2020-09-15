<template>
  <q-page class="flex flex-center">
    <div v-if="currentUser.is_admin" class="row q-pa-lg q-gutter-md justify-around">
      <div class="col-12">
        <q-item-label>Stock:</q-item-label>

      </div>
      <div class="col-4 box justify-between" @click="goto('/admin/add/stock')">
        <q-icon name="add_shopping_cart" size="34px" />
        <q-item-label class="q-mt-sm">Add</q-item-label>
      </div>
      <div class="col-4 box" @click="goto('/admin/check/stores')">
        <q-icon name="local_grocery_store" size="34px" />
        <q-item-label class="q-mt-sm">Check</q-item-label>
      </div>
      <div class="col-4 box" @click="goto('/admin/stores')">
        <q-icon name="remove_shopping_cart" size="34px" />
        <q-item-label class="q-mt-sm">Shop</q-item-label>
      </div>

      <q-separator class="q-mt-lg q-mb-lg" color="dark" />

      <div class="col-12">
        <q-item-label>Product:</q-item-label>

      </div>
      <div class="col-4 box" @click="goto('/product/add')">
        <q-icon name="add_shopping_cart" size="34px" />
        <q-item-label class="q-mt-sm">Add</q-item-label>
      </div>
      <div class="col-4 box" @click="goto('/admin/add/stock')">
        <q-icon name="local_grocery_store" size="34px" />
        <q-item-label class="q-mt-sm">Edit</q-item-label>
      </div>
      <div class="col-4 box" @click="goto('/product')">
        <q-icon name="remove_shopping_cart" size="34px" />
        <q-item-label class="q-mt-sm">Remove</q-item-label>
      </div>

      <q-separator class="q-mt-lg q-mb-lg" color="dark" />

      <div class="col-12">
        <q-item-label>Shop:</q-item-label>

      </div>
      <div class="col-4 box" @click="goto('/admin/add/store')">
        <q-icon name="add_business" size="34px" />
        <q-item-label class="q-mt-sm">Add</q-item-label>
      </div>
      <div class="col-4 box" @click="goto('/admin/stores')">
        <q-icon name="store" size="34px" />
        <q-item-label class="q-mt-sm">Edit</q-item-label>
      </div>
      <div class="col-4 box" @click="goto('/admin/stores')">
        <q-icon name="storefront" size="34px" />
        <q-item-label class="q-mt-sm">Remove</q-item-label>
      </div>

      <q-separator class="q-mt-lg q-mb-lg" color="dark" />

      <div class="col-12">
        <q-item-label>Others:</q-item-label>
      </div>
      <div class="col-4 box" @click="goto('/admin/orders')">
        <q-icon name="fact_check" size="34px" />
        <q-item-label class="q-mt-sm">Orders</q-item-label>
      </div>
      <div class="col-4 box" @click="goto('/profile')">
        <q-icon name="person_pin" size="34px" />
        <q-item-label class="q-mt-sm">Profile</q-item-label>
      </div>

      <div class="col-4 box1">

      </div>
    </div>
    <div v-if="!currentUser.is_admin" class="row q-pa-lg q-gutter-md justify-around">
      <div class="col-12">
        <q-item-label>DASHBOARD :</q-item-label>
      </div>
      <div class="col-4 box" style="width: 100%!important;" @click="goto('/product')">

          <q-icon name="add_shopping_cart" size="34px" />
          <q-item-label class="q-mt-sm">Add</q-item-label>

      </div>
      <div class="col-4 box" style="width: 100%!important;" @click="goto('/admin/update/stock')">

          <q-icon name="local_grocery_store" size="34px" />
          <q-item-label class="q-mt-sm">Update Stock</q-item-label>

      </div>
      <div class="col-4 box" style="width: 100%!important;" @click="goto('admin/stock/overview')">

          <q-icon name="storefront" size="34px" />
          <q-item-label class="q-mt-sm">Stock Overview</q-item-label>

      </div>
      <div class="col-4 box" style="width: 100%!important;" @click="goto('/profile')">

          <q-icon name="person_pin" size="34px" />
          <q-item-label class="q-mt-sm">Update Account</q-item-label>

      </div>
<!--      <div class="col-4 box1">-->

<!--      </div>-->
<!--      <div class="col-4 box1">-->

<!--      </div>-->
<!--   -->
    </div>
  </q-page>
</template>

<script>
import {mapState} from "vuex";

export default {
  name: "Index",
  methods : {
    goto(link){
      this.$router.push(link);
    },
  },
  computed:{
    ...mapState('store', ['currentUser']),
  }
}
</script>

<style scoped lang="scss">
.box{
  background-color: #1D1D1D;
  border-radius: 20px;
  padding-top: 20px;
  padding-bottom: 20px;
  text-align: center;
  height: 100%;
  width: 27%;
  position: relative;
  color: white;
}
.box1 {
  //background-color: #1D1D1D;
  border-radius: 20px;
  padding-top: 20px;
  padding-bottom: 20px;
  text-align: center;
  height: 100%;
  width: 27%;
  position: relative;
  color: white;
}
</style>

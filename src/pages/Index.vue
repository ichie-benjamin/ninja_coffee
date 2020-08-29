<template>
  <q-page class="flex flex-center">
    <img
      alt="Quasar logo"
      src="~assets/quasar-logo-full.svg"
    >
  </q-page>
</template>

<script>
import {mapActions, mapState} from "vuex";

export default {
  name: 'PageIndex',
  created() {
    this.getProducts();
  },
  methods : {
    ...mapActions('store', ['getProducts']),
  },
  computed : {
    ...mapState('store', ['products']),
  }
}
</script>

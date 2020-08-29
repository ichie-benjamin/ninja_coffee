<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container  class="bg-info text-black">
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
export default {
  name: 'MyLayout',

  data () {
    return {
    }
  },
  computed:{
    title() {
      let currentPath = this.$route.fullPath;
      if (currentPath == '/') return 'Afiaanyi'
      else return this.$route.meta.name
    },
  }
}
</script>

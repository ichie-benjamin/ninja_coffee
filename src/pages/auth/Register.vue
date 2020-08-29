<template>
    <q-page class="flex q-pa-md flex-center">
      <div class="column full-width q-mt-mb ">
        <q-tab-panel name="register">
          <login-register :tab="tab" />
        </q-tab-panel>
      </div>
    </q-page>
</template>

<script>
    export default {
        name: "Register",
      data(){
          return {
            tab: 'register'
          }
      },
      mounted() {
        this.$store.commit("store/regSuccess", null);
      },
      components: {
        'login-register' : require('../../components/LoginRegister.vue').default
      }
    }
</script>

<style scoped>

</style>

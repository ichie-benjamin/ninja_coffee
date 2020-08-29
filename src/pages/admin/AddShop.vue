<template>
  <q-page class="flex flex-center">
    <div class="q-pa-md">
      <div class="q-gutter-md text-black" style="width: 90vw">
        <q-form @submit.prevent="submit" class="q-gutter-md">
          <q-input  v-model="form.name" clearable label="Store Name : " />

          <q-item-label>Login Details</q-item-label>

          <q-input  v-model="form.email" type="email" clearable label="Email Address : " />
          <q-input  v-model="form.password" type="password" clearable label="Password : " />
<!--          <q-input class="q-mt-md" v-model="form.low_amount"  clearable type="number" label="Low Amount : " />-->
<!--          <q-input v-model="form.good_amount" clearable type="number" label="Good Amount : " />-->
<!--          <q-input v-model="form.volume" clearable type="number" label="Volume : " />-->
<!--          <q-input class="q-pb-md" v-model="form.type" clearable label="Type : " />-->


          <div>
            <q-btn label="Add Store" class="full-width no-border q-mt-md" unelevated padding="13px 10px" type="submit" color="warning"/>
          </div>
        </q-form>
      </div>
    </div>
  </q-page>
</template>

<script>
import {firebaseAuth, firebaseDb, secondaryApp} from "boot/firebase";
import {mapActions, mapState} from "vuex";

export default {
  name: "AddShop",
  data(){
    return {
      form:{
        name:'',
        password:'',
        email:'',
      }
    }
  },
  created(){

  },
  methods:{
    submit(){
      secondaryApp.auth().createUserWithEmailAndPassword(this.form.email, this.form.password)
        .then((response) => {
            let userId = secondaryApp.auth().currentUser.uid;
            firebaseDb.collection("users").doc(userId).set({name: this.form.name, email: this.form.email,is_admin: false}).then(()=>{
              this.form.email = '';
              this.form.name = "";
            })
            secondaryApp.auth().signOut();
            alert('Store Added');
            this.$q.loading.hide();
            this.loading = false;
            this.$router.push('/admin/stores');
          },
          err => {
            alert(err.message)
            this.loading = false;
            this.$q.loading.hide();
            this.has_error = true;
          })

    }
  },
  computed:{
  }
}
</script>

<style scoped lang="scss">
.no-border {
  border-radius: 0;
}
</style>

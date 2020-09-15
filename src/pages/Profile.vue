<template>
  <q-page class="flex flex-center">
    <q-avatar size="20rem" icon="person_pin" />

    <div class="q-mt-0" style="margin-bottom: 200px">
      <q-btn @click="updateEmail()" label="Update Store" class="full-width no-border" unelevated padding="13px 10px" type="submit" color="warning"/>
      <q-btn @click="updatePs()" label="Update Login" class="full-width no-border q-mt-md" unelevated padding="13px 10px" type="submit" color="black"/>
    </div>

    <q-dialog v-model="prompt" persistent>

      <q-card style="min-width: 350px" >
        <q-btn color="negative" flat icon="close" v-close-popup />

        <q-form @submit.prevent="update" class="q-gutter-md">

          <q-card-section>
            <q-input  v-model="form.name" clearable label="Store Name : " />

            <q-item-label class="q-mt-md">Login Details</q-item-label>

            <q-input  v-model="form.email" type="email" label="Email Address : " />
<!--            <q-input  v-model="form.password" type="password" disable label="Password : " />-->
          </q-card-section>

          <q-card-actions>
            <q-btn label="Update" class="full-width no-border q-mt-md" unelevated padding="13px 10px" type="submit" color="black"/>

          </q-card-actions>

        </q-form>
        <q-separator />
      </q-card>
    </q-dialog>

    <q-dialog v-model="promptPass" persistent>

      <q-card style="min-width: 350px" >
        <q-btn color="negative" flat icon="close" v-close-popup />

        <q-form @submit.prevent="updatePass" class="q-gutter-md">

          <q-card-section>

            <q-item-label class="q-mt-md">Update Login Details</q-item-label>

            <q-input  v-model="form.email" disable type="email" label="Email Address : " />
            <q-input  v-model="form.password" :rules="[val => !!val || 'Your password cant be empty']" type="password" label="Password : " />
          </q-card-section>

          <q-card-actions>
            <q-btn label="Update" class="full-width no-border q-mt-md" unelevated padding="13px 10px" type="submit" color="black"/>
          </q-card-actions>

        </q-form>
        <q-separator />
      </q-card>
    </q-dialog>



  </q-page>

</template>

<script>
import {mapActions, mapState} from "vuex";
import {firebaseAuth, firebaseDb} from "boot/firebase";

export default {
name: "Profile",
  data(){
    return {
      text : '',
      prompt:false,
      promptPass:false,
      form:{
        name:'',
        password:'',
        email:'',
      }
    }
  },
  methods:{
    ...mapActions('store',['handleAuthStateChanged']),
  updateEmail(){
    this.form.email = this.currentUser.email;
    this.form.name = this.currentUser.name;
    this.form.id = this.currentUser.userId;
    this.form.is_admin = this.currentUser.is_admin;
    this.prompt = true
  },
    updatePs(){
    this.form.email = this.currentUser.email;
    this.promptPass = true
  },
    update(){
      let  user = firebaseAuth.currentUser;

      this.$q.loading.show();
      firebaseDb.collection("users").doc(this.form.id).set({
        name: this.form.name,
        email: this.form.email,
        is_admin: this.form.is_admin,
      }).then(()=>{


        if(this.currentUser.email !== this.form.email){

          user.updateEmail(this.form.email).then(() => {
            // Update successful.
            this.$q.loading.hide();

            this.$q.notify({
              message: 'Email successfully updated',
              color: 'secondary'
            });
            this.prompt = false;
            this.updated();
            this.handleAuthStateChanged();
          }).catch(error => {
            // An error happened.
            this.$q.notify({
              message: error.message,
              color: 'red'
            });
            this.prompt = false
            this.$q.loading.hide();
          });


        }else {
          this.$q.loading.hide();

          this.$q.notify({
            message: 'Store successfully updated',
            color: 'secondary'
          });
          this.updated();
          this.prompt = false;
        }
      });
    },
    updatePass(){
      let  user = firebaseAuth.currentUser;

      this.$q.loading.show();
      user.updatePassword(this.form.password).then(() => {
        // Update successful.
        this.$q.loading.hide();

        this.$q.notify({
          message: 'Password successfully updated',
          color: 'secondary'
        });
        this.promptPass = false;
      }).catch(error => {
        // An error happened.
        this.$q.notify({
          message: error.message,
          color: 'red'
        });
        this.$q.loading.hide();
        this.promptPass = false
      });
    },

    updated(){
      this.$store.commit("store/setUserDetail",{
        name:this.form.name,
        email:this.form.email,
        is_admin: this.currentUser.is_admin,
        userId:this.currentUser.userId,
      });
    }
  },
  computed:{
    ...mapState('store', ['currentUser']),

  }
}
</script>

<style scoped>

</style>

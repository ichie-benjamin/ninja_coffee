<template>
  <div>
  <q-form @submit="submitForm" class=" q-mt-xl">

    <div class="text-center q-mb-md text-bold text-accent" v-if="authError">
      {{ authError }}
    </div>


    <q-input
      v-if="activeTab == 'register'"
      v-model="formData.name"
      :rules="[val => !!val || 'Store name is required']"
      :error="has_error && errors.name ? true : false"
      class="q-mb-md"
      label="Store Name">
      <template  v-slot:append>
        <q-icon v-show="formData.name.length > 0" name="cancel" @click.stop="formData.name = ''" class="cursor-pointer" />
      </template>
      <template v-slot:error>
        {{ errors.name[0] }}
      </template>
    </q-input>

    <q-item-label class="text-bold">Login Details</q-item-label>

    <q-input v-if="activeTab == 'register'"
      v-model="formData.email"
      class="q-mb-md"
      :error="has_error && errors.email ? true : false"
      type="text" :rules="[val => !!val || 'Email Address is required']"
      label="Email">
      <template v-slot:append>
        <q-icon v-show="formData.email.length > 0" name="cancel" @click.stop="formData.email = ''" class="cursor-pointer" />
      </template>
      <template v-slot:error>
        {{ errors.email[0] }}
      </template>
    </q-input>



    <div  v-if="activeTab == 'login'">


      <q-input
        v-model="formData.email"
        class="q-mb-md"
        :error="has_error && errors.email ? true : false"
        type="type"
        label="Email : ">
        <template  v-slot:append>
          <q-icon v-show="formData.email.length > 0" name="cancel" @click.stop="formData.email = ''" class="cursor-pointer" />
        </template>
        <template v-slot:error>
          {{ errors.email[0] }}
        </template>
      </q-input>
    </div>

    <q-input
      v-model="formData.password"
      class="q-mb-md"
      :type="type"
      :error="has_error && errors.password ? true : false"
      label="Enter Your Password">
      <template  v-slot:append>
        <q-icon v-show="formData.password.length > 0 && type === 'password'" name="remove_red_eye" @click.stop="type = 'text'" class="cursor-pointer" />
        <q-icon v-show="formData.password.length > 0 && type === 'text'" name="cancel" @click.stop="formData.password = ''" class="cursor-pointer" />
      </template>
      <template v-slot:error>
        {{ errors.password[0] }}
      </template>
    </q-input>

    <q-input
      v-if="activeTab == 'register'"
      v-model="formData.password_confirmation"
      class="q-mb-md"
      type="text"
      label="Confirm Password" />

    <div class="row q-mb-md q-mt-lg" v-if="activeTab == 'register'">
      I Agree to <router-link to="/agreement">Terms & Condition</router-link>
    </div>

    <div class="row q-mt-md">
      <q-space />
      <q-btn class="col" rounded v-if="activeTab == 'register'"
             :loading="loading"
        color="black"
        type="submit"
        :label="activeTab" />
    </div>
    <div class="column">
      <q-item-label class="text-center q-ma-sm">OR</q-item-label>
      <q-space />

      <q-btn class="col" rounded v-if="activeTab == 'register'"
             color="warning"
             to="/login"
             label="Already have an account ? Login" />

    </div>
  </q-form>
  </div>
</template>

<script>

  import { mapActions, mapState } from 'vuex'
  import {login} from '../boot/general'
  import {firebaseAuth, firebaseDb} from "boot/firebase";

  export default {
    props: ['tab'],

    data() {
      return {
        activeTab : this.tab,
        type:'text',
        loading:false,
        voice:true,
        agreed:1,
        formData: {
          name: '',
          login:'',
          password_confirmation: '',
          email: '',
          password: ''
        },
        errors:{},
        has_error: false,
      }
    },
    mounted() {
    },
    methods: {
      ...mapActions('store', ['loginUser','loginFailed']),

      submitForm() {
        this.loading = true;
        this.errors = {};
        this.has_error = false;
          this.$q.loading.show();
          // this.registerUser(this.formData)
        firebaseAuth.createUserWithEmailAndPassword(this.formData.email, this.formData.password)
            .then((response) => {
              let userId = firebaseAuth.currentUser.uid;
                firebaseDb.collection("users").doc(userId).set({
                  name: this.formData.name,
                  email: this.formData.email,
                  is_admin: 0,
                })
                this.$q.notify({
                  message: 'Store successfully created',
                  color: 'secondary'
                });
                this.$q.loading.hide();
                this.$router.push('/');
                this.loading = false;
              },
            err => {
              alert(err.message)
              this.loading = false;
              this.$q.loading.hide();
              this.has_error = true;
            })

      },
    },
    computed: {
      ...mapState('store', ['authError','currentUser']),
      link(){
        return this.$route.fullPath
      }
    },
    watch : {

    },
  }
</script>

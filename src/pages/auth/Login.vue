<template>
  <q-page class="flex q-pa-md flex-center">
    <div class="column full-width q-mt-md ">
      <div class="column items-center q-mb-md">

        <!--        <img class="items-center" src="~assets/foodex_logo.png" height="60px" width="60" />-->
      </div>
      <q-tab-panel name="register">

        <q-form @submit="submitForm">

<!--          <div v-if="reg_success.length < 3">-->
<!--            <q-item-label class="text-center q-mb-md" style="font-weight: lighter; font-size: 1.5em;">Welcome back!</q-item-label>-->
<!--          </div>-->

          <div class="text-center q-mb-md text-bold text-accent" v-if="authError">
            {{ authError }}
          </div>
          <div class="text-center q-mb-md text-bold text-info" v-if="reg_success">
            {{ reg_success }}
          </div>



          <q-input
            v-model="formData.email"
            class="q-mb-md"
            :error="has_error && errors.email ? true : false"
            type="text"
            :hint="formData.email.length > 0 ? 'say email to reenter email address' : '' "
            label="Email Address">
            <template  v-slot:append>
              <q-icon v-show="formData.email.length > 0" name="cancel" @click.stop="formData.email = ''" class="cursor-pointer" />
            </template>
            <template v-slot:error>
              {{ errors.email[0] }}
            </template>
          </q-input>


          <q-input
            v-model="formData.password"
            class="q-mb-md"
            :type="type"
            :error="has_error && errors.password ? true : false"
            label="Enter Your Pin">
            <template  v-slot:append>
              <q-icon v-show="formData.password.length > 0 && type === 'password'" name="remove_red_eye" @click.stop="type = 'text'" class="cursor-pointer" />
              <q-icon v-show="formData.password.length > 0 && type === 'text'" name="cancel" @click.stop="type = 'password'" class="cursor-pointer" />
            </template>
            <template v-slot:error>
              {{ errors.password[0] }}
            </template>
          </q-input>


          <div class="row">
            <q-space />
            <q-btn class="col" rounded
                   :loading="loading"
                   color="black"
                   type="submit"
                   label="Login" />
          </div>
          <div class="row">
            <div class="q-mt-md justify-center">
<!--              <q-item class="text-center" clickable to="/forgot-password">Forgot Password  </q-item>-->
<!--              <span class="">OR</span>-->
            </div>
          </div>
          <div class="column">
            <q-space />
            <q-btn class="col" rounded
                   color="warning"
                   to="/register"
                   label="No Account Yet ? Create One" />
          </div>
        </q-form>
      </q-tab-panel>
    </div>
  </q-page>
</template>

<script>
import {mapActions, mapState} from "vuex";
import {login} from "boot/general";
import axios from "axios";
import {firebaseAuth} from "boot/firebase";

export default {
  data () {
    return {
      email:'',
      type:'password',
      loading:false,
      voice:false,
      command:'',
      agreed:1,
      formData: {
        login:'',
        email: '',
        password: ''
      },
      errors:{},
      has_error: false,
    }
  },
  mounted() {
    this.voice = true,
    this.$store.commit("store/loginFailed", '');
    this.$store.commit("store/regSuccess", '');
  },
  methods : {

    ...mapActions('store', ['loginUser','loginFailed']),

    submitForm() {
      this.loading = true;
      this.errors = {};
      this.has_error = false;
      this.authenticate();
    },

    register(){
      this.$router.push('/register');
    },
    authenticate() {
      this.$q.loading.show();
      firebaseAuth.signInWithEmailAndPassword(this.formData.email, this.formData.password)
        .then((response) => {
            alert('Login Successful');
            this.$store.commit("store/loginSuccess", 'login successful');
            this.$router.push('/admin');
            this.$q.loading.hide();
            this.loading = false;
          },
          err => {
            alert(err.message)
            this.loading = false;
            this.$q.loading.hide();
            console.log(err.message)
            this.$store.commit("store/loginFailed", err.message);
            this.has_error = true;
          })
    },

  },
  computed: {
    ...mapState('store', ['authError','currentUser','reg_success']),
  },
  watch : {
  },
  components: {
    'login-register' : require('../../components/LoginRegister.vue').default
  }
}
</script>

<style>
</style>

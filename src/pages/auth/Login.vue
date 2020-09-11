<template>
  <q-page class="flex q-pa-md flex-center">
    <div class="column full-width q-mt-md ">
      <div class="column items-center q-mb-md">
      </div>
      <q-tab-panel name="register">

        <q-form @submit="submitForm">
          <div class="text-center q-mb-md text-bold text-accent" v-if="authError">
            {{ authError }}
          </div>

          <q-input
            v-model="formData.email"
            class="q-mb-md"
            :error="has_error && errors.email ? true : false"
            type="text"
            :hint="formData.email.length > 0 ? 'enter your email address' : '' "
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
            let userId = firebaseAuth.currentUser.uid;
            this.$q.notify({
              message: 'Login successfully',
              color: 'secondary'
            });
            this.$store.commit("store/loginSuccess", userId);
            this.$router.push('/');
            this.$q.loading.hide();
            this.loading = false;
          },
          err => {

            this.$q.notify({
              message: err.message,
              color: 'negative'
            });
            this.loading = false;
            this.$q.loading.hide();
            console.log(err.message)
            this.$store.commit("store/loginFailed", err.message);
            this.has_error = true;
          })
    },

  },
  computed: {
    ...mapState('store', ['authError','currentUser']),
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

<template>
  <q-page class="flex q-pa-md">
    <div class="column full-width q-mt-md ">
      <div class="column items-center q-mb-md">
        <img class="items-center auth-logo" src="~assets/afiannyi_logo_black.png" height="60px" width="60" />
      </div>
      <q-card class="my-card q-mt-md">
        <q-card-section>
          <div class="text-h6 text-center">Please confirm your email...</div>
        </q-card-section>

        <q-separator  />

        <q-card-section>
          <q-item-label>You'll need to verify your email to access all features. We've sent a confirmation email to: </q-item-label>
          <q-item-label class="q-pt-md text-secondary">{{ currentUser.email }}</q-item-label>

          <q-item-label class="text-weight-light q-mt-md q-pt-md">Don't forget to check your spam folder just incase.</q-item-label>
        </q-card-section>

        <q-separator />

<!--        <q-card-actions vertical>-->
<!--          <div class="column">-->
<!--            <q-item-label class="text-weight-light text-center q-pt-md q-pb-md">If you don't receive an email, you can</q-item-label>-->
<!--            <q-btn @click="resendEmail()" class="q-mt-md" dense label="resend email" rounded color="primary" />-->
<!--          </div>-->
<!--        </q-card-actions>-->
      </q-card>

<!--      <div class="text-center q-mb-md text-bold text-negative" v-if="hasError">-->
<!--        <div class="column">-->
<!--          <q-btn @click="resendEmail()" v-show="authError === 'Please Verify Your Email Address'" class="q-mt-md" dense label="resend email" rounded color="primary" />-->
<!--        </div>-->
<!--      </div>-->
    </div>
  </q-page>
</template>

<script>
  import {mapState} from "vuex";

  export default {
    data () {
      return {
        loading:false,
        resend_msg:[],
        hasError:false,
        error:'',
      }
    },
    methods : {

      resendEmail(){
        this.errors = {};
        this.error = '';
        this.hasError = false;
        this.$axios.post('/auth/email/resend')
          .then((response) => {
            this.$q.loading.hide();
            this.resend_msg = response.response.data

          }).catch(error => {
          this.loading = false;
          this.errors = error.response.data.errors;
          this.hasError = true;
        })
      },
    },
    computed: {
      ...mapState('store', ['currentUser']),
    },
  }
</script>

<style>
</style>

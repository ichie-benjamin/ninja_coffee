<template>
  <q-page class="">
    <div class="q-pa-md">
      <div class="q-gutter-md full-width" style="" >
        <q-input v-model="text" label="Search" />

      </div>
      <div class="column q-mt-md">
        <q-list>
          <template v-for="item in stores">
            <q-item :key="item.id" clickable v-ripple>

              <q-item-section>
                <q-item-label lines="1">{{  item.name }}</q-item-label>
                <q-item-label caption>{{ item.email }}</q-item-label>
              </q-item-section>
              <q-item-section side top>
                <q-btn v-if="currentUser.is_admin" class="" @click="edit(item)" color="warning" size="12px" dense round icon="edit" />
              </q-item-section>
            </q-item>
            <q-separator />
          </template>

        </q-list>
      </div>
    </div>


    <q-dialog v-model="prompt" persistent>

      <q-card style="min-width: 350px" >
        <q-btn color="negative" flat icon="close" v-close-popup />

        <q-form @submit.prevent="update" class="q-gutter-md">

        <q-card-section>
          <q-input  v-model="form.name" clearable label="Store Name : " />

          <q-item-label class="q-mt-md">Login Details</q-item-label>

          <q-input  v-model="form.email" disable type="email" label="Email Address : " />
          <q-input  v-model="form.password" type="password" disable label="Password : " />
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
import {firebaseDb} from "boot/firebase";

export default {
  name: "Index",
  data(){
    return {
      text : '',
      prompt:false,
      form:{
        name:'',
        password:'***********',
        email:'',
      }
    }
  },
  created() {
    this.getStores();
  },
  methods : {
    ...mapActions('store', ['getStores']),
    delete(item){
      this.$q.loading.show();
      firebaseDb.collection("users").where('email', '==', item.email).get()
        .then(querySnapshot => {
          querySnapshot.forEach(doc => {
            let id = doc.id;
            firebaseDb.collection("users").doc(id).delete().then(()=>{
              this.$q.notify({
                message: 'Store successfully deleted',
                color: 'secondary'
              });
              this.$q.loading.hide();
              this.getStores();
            }).catch(error => {
              this.$q.loading.hide()
              this.$q.notify({
                message: 'Something went wrong',
                color: 'negative'
              });
            })
          })
        })
        .catch(error => {
          this.$q.loading.hide()
        });
    },
    edit(item){
      this.prompt = true;
      this.form.name = item.name;
      this.form.id = item.id;
      this.form.email = item.email
    },
    update(){
      this.$q.loading.show();
      firebaseDb.collection("users").doc(this.form.id).set({
        name: this.form.name,
        email: this.form.email,
        is_admin: false,
      }).then(()=>{
        this.$q.loading.hide();

        this.$q.notify({
          message: 'Store successfully updated',
          color: 'secondary'
        });
        this.getStores();
        this.prompt = false;
      })

    },
    confirm (item) {
      this.$q.dialog({
        title: 'Confirm',
        message: 'Are you sure you want to delete this product ?',
        cancel: true,
        persistent: true
      }).onOk(() => {
        this.delete(item)
      })
    },
  },
  computed : {
    ...mapState('store', ['stores','currentUser']),
  }
}
</script>

<style scoped>

</style>

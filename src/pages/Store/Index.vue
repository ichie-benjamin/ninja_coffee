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
<!--              <q-item-section side top>-->
<!--                <q-btn v-if="currentUser.is_admin" class="" @click="confirm(item)" color="red" size="12px" flat dense round icon="delete" />-->
<!--              </q-item-section>-->
            </q-item>
            <q-separator />
          </template>

        </q-list>
      </div>
    </div>
  </q-page>
</template>

<script>
import {mapActions, mapState} from "vuex";
import {firebaseDb} from "boot/firebase";

export default {
  name: "Index",
  data(){
    return {
      text : ''
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

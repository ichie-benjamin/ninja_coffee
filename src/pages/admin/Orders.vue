<template>
  <q-page class="">
    <div class="q-pa-md">
<!--      <div class="q-gutter-md full-width" style="" >-->
<!--        <q-input v-model="text" label="Search" />-->

<!--      </div>-->
      <div class="column q-mt-md">
        <q-list>
          <template>
            <q-card v-if="orders.length > 0" v-for="item in orders" :key="item.id" flat bordered class=" my-card q-mb-sm">
              <q-item class="">
                <q-item-section>
                  <q-item-label class="text-negative text-bold text-h6">{{ item.product_name }} X {{ item.volume }}</q-item-label>
                  <q-item-label class=" text-bold" caption>{{ formateDate(item.date)}}</q-item-label>

                  <q-item-label class="text-cente text-bold text-secondary">Store Details</q-item-label>


                  <q-item-label>{{ item.store }}</q-item-label>


                  <q-item-label class="text-bold text-secondary q-mt-sm">Order Details</q-item-label>

                  <q-item-label class=" text-bold" caption>Unit Price : ({{ item.amount }} X {{ item.volume }})</q-item-label>

                  <q-item-label>Total : ${{ item.volume * item.amount }}</q-item-label>

                </q-item-section>


                <q-item-section side top>
                  <q-btn v-if="currentUser.is_admin" class="" @click="confirm(item)" color="red" size="12px" flat dense round icon="delete" />
                </q-item-section>
              </q-item>
            </q-card>

          </template>

        </q-list>
      </div>
    </div>
  </q-page>
</template>

<script>
import {mapActions, mapState} from "vuex";
import {date} from "quasar";
import {firebaseDb} from "boot/firebase";

export default {
  name: "Orders",
  created() {
    this.getOrders();
  },
  data(){
    return {
      text:'',
    }
  },
  methods : {
    ...mapActions('store', ['getOrders']),
    formateDate(item){
      return date.formatDate(item, 'Do-MMM-YYYY HH:mm')
    },
    delete(item){
      this.$q.loading.show();
      firebaseDb.collection("orders").where('id', '==', item.id).get()
        .then(querySnapshot => {
          querySnapshot.forEach(doc => {
            let id = doc.id;
            firebaseDb.collection("orders").doc(id).delete().then(()=>{
              this.$q.notify({
                message: 'Order successfully deleted',
                color: 'secondary'
              });
              this.$q.loading.hide();
              this.getOrders();
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
        message: 'Are you sure you want to delete this order ?',
        cancel: true,
        persistent: true
      }).onOk(() => {
        this.delete(item)
      })
    },
  },
  computed : {
    ...mapState('store', ['orders', 'currentUser']),
  }
}
</script>

<style scoped>

</style>

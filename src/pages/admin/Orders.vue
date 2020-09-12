<template>
  <q-page class="">
    <div class="q-pa-md">
<!--      <div class="q-gutter-md full-width" style="" >-->
<!--        <q-input v-model="text" label="Search" />-->

<!--      </div>-->
      <div class="column q-mt-md">
        <q-list>
          <template  v-if="orders.length > 0">
            <q-card v-for="item in orders" :key="item.id" flat bordered class=" my-card q-mb-sm">
              <q-item class="" clickable>
                <q-item-section>
                  <q-item-label class="text-negative text-bold text-h6"> {{ item.store }}</q-item-label>
                  <q-item-label class=" text-bold" caption>{{ formateDate(item.date)}}</q-item-label>


<!--                  <q-item-label class="text-bold text-secondary q-mt-sm">Order Details</q-item-label>-->

                  <q-item-label class=" text-bold" caption>Items : {{ item.qty }}</q-item-label>
                  <q-item-label class=" text-bold" caption>Total Stock : {{ item.stock }}</q-item-label>

                  <q-item-label v-if="item.variant" class=" text-bold" caption>Variant : {{ item.variant }}</q-item-label>

<!--                  <q-item-label>Total : £{{ item.volume * item.amount }}</q-item-label>-->

                </q-item-section>


                <q-item-section side top>
                  <q-btn v-if="currentUser.is_admin" class="q-mb-md" @click="confirm(item)" color="red" size="12px" flat dense round icon="delete" />
                  <q-btn class="q-pr-sm q-pl-sm"  @click="goto(item.user_id, item.id)" color="warning" size="12px" dense label="VIEW" />
                </q-item-section>
              </q-item>
            </q-card>

          </template>

          <template v-else>
          <q-card  flat bordered  class=" my-card q-mb-sm">
            <q-item class="q-pt-xl q-pb-xl">
              <q-item-section class="justify-center">
                <q-item-label class="text-negative text-bold text-center text-h6">No Pending Orders</q-item-label>

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
      console.log(item.id)
            firebaseDb.collection("orders").doc(item.id).delete().then(()=>{
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
        .catch(error => {
          console.log(error);
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
    goto(id,ref){
      this.$router.push('/order/'+id+'/'+ref);
    },
  },
  computed : {
    ...mapState('store', ['orders', 'currentUser']),
  }
}
</script>

<style scoped>

</style>

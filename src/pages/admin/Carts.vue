<template>
  <q-page class="">
    <div class="q-pa-md" style="margin-bottom: 40px">
<!--      <div class="q-gutter-md full-width" style="" >-->
<!--        <q-input v-model="text" label="Search" />-->

<!--      </div>-->

      <div class="column q-mt-md" v-if="orders.length > 0">


            <q-card  flat bordered  class=" my-card q-mb-sm">
              <q-item class="q-pt-xl q-pb-xl">
                <q-item-section class="justify-center">
                  <q-item-label class="text-negative text-bold text-center text-h6">You have a pending order, Ninja Coffee will fulfill the order before you can place another</q-item-label>
                  <div class="text-center q-mt-xl  box" style="width: 100%!important;" @click="goto('/admin/orders')">
                    <q-item-label class="q-mt-sm">Goto Orders</q-item-label>

                  </div>
                </q-item-section>
              </q-item>
            </q-card>
      </div>
      <div class="column q-mt-md" v-else>
        <q-list>
          <template v-if="carts.length > 0">

            <q-card v-for="item in carts" :key="item.id" flat bordered class=" my-card q-mb-sm">
              <q-item class="">
                <q-item-section>
                  <q-item-label class="text-negative text-bold text-h6">{{ item.product_name }} X {{ item.volume }}</q-item-label>

                  <!--                  <q-item-label class="text-bold text-secondary q-mt-sm">Order Details</q-item-label>-->

                  <q-item-label class=" text-bold" caption>Wholesale Price : ({{ item.amount }} X {{ item.volume }})</q-item-label>

                  <q-item-label>Total : £{{ item.volume * item.amount }}</q-item-label>

                </q-item-section>


                <q-item-section side top>
                  <!--                  <q-item-label class=" text-bold" caption>{{ formateDate(item.date)}}</q-item-label>-->
                  <q-btn  class="" @click="confirm(item)" color="red" size="17px" flat dense round icon="delete" />
                </q-item-section>
              </q-item>
            </q-card>
          </template>
          <template v-else>
            <q-card  flat bordered  class=" my-card q-mb-sm">
              <q-item class="q-pt-xl q-pb-xl">
                <q-item-section class="justify-center">
                  <q-item-label class="text-negative text-bold text-center text-h6">No item in your cart</q-item-label>
                  <div class="text-center q-mt-xl  box" style="width: 100%!important;" @click="goto('/product')">

                    <q-icon name="add_shopping_cart" size="34px" />
                    <q-item-label class="q-mt-sm">Add</q-item-label>

                  </div>
                </q-item-section>
              </q-item>
            </q-card>

          </template>

        </q-list>
      </div>
    </div>

    <q-page-sticky expand position="bottom">
      <q-btn v-if="carts.length > 0 && orders.length < 1" @click="order = true" label="Send Order" class="full-width no-border q-mt-md" unelevated padding="13px 10px" type="submit" color="warning"/>
    </q-page-sticky>
    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn to="/product" icon="add" fab  color="black" />
    </q-page-sticky>

    <q-dialog v-model="order" persistent>

      <q-card style="min-width: 350px" >
        <q-btn color="negative" flat icon="close" v-close-popup />

        <q-card-section>
          <div class="text-h6 text-center">
            You are about to send this orders to Ninja Coffee
            <q-separator class="q-mt-lg" />
          <q-item-label class="q-mt-lg">Total Stock : {{ totalStock }}</q-item-label>
          </div>
        </q-card-section>

        <q-card-actions>
          <q-btn v-if="carts.length > 0" @click="placeOrder()" label="Proceed >>" class="full-width no-border q-mt-md" unelevated padding="13px 10px" type="submit" color="black"/>

        </q-card-actions>

        <q-separator />
      </q-card>
    </q-dialog>

  </q-page>

</template>

<script>
import {mapActions, mapState} from "vuex";
import {date} from "quasar";
import {firebaseDb} from "boot/firebase";

export default {
  name: "Carts",
  created() {
    this.getCarts();
    this.getOrders();
  },
  data(){
    return {
      text:'',
      order:false,
    }
  },
  methods : {
    ...mapActions('store', ['getCarts','getOrders']),
    formateDate(item){
      return date.formatDate(item, 'Do-MMM-YYYY HH:mm')
    },
    goto(link){
      this.$router.push(link);
    },
    delete(item){
      this.$q.loading.show();
      firebaseDb.collection("carts").doc(this.currentUser.userId).collection('details').where('id', '==', item.id).get()
        .then(querySnapshot => {
          querySnapshot.forEach(doc => {
            let id = doc.id;
            firebaseDb.collection("carts").doc(this.currentUser.userId).collection('details').doc(id).delete().then(()=>{
              this.$q.notify({
                message: 'Item successfully removed from cart',
                color: 'secondary'
              });
              this.$q.loading.hide();
              this.getCarts();
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
    placeOrder(){
      this.$q.loading.show();
      // this.form.date = Date.now();

        firebaseDb.collection('orders').add({user_id: this.currentUser.userId, qty : this.carts.length, stock : this.totalStock, store : this.currentUser.name, date : Date.now(), fulfilled : false})
          .then( docRef => {
            this.order = false;
            this.$q.loading.hide();
            this.getOrders();
            this.$q.notify({
              message: 'Order successfully placed',
              color: 'secondary'
            })
          }).catch(error => {
          this.$q.loading.hide();

        })



    }
  },
  computed : {
    ...mapState('store', ['carts', 'currentUser','orders']),
    totalStock: function(){
      // return 5;
      return this.carts.reduce(function(total, item){
        return parseInt(total) + parseInt((item.volume));
      },0);
    },
  }
}
</script>

<style scoped>

</style>

<template>
  <q-page class="">
    <div class="q-pa-md">
<!--      <div class="q-gutter-md full-width" style="" >-->
<!--        <q-input v-model="text" label="Search" />-->

<!--      </div>-->

      <div class="column q-mt-md">
        <q-list>
          <template v-if="items.length > 0">

            <q-card v-for="item in items" :key="item.id" flat bordered class=" my-card q-mb-sm">
              <q-item class="">
                <q-item-section>
                  <q-item-label class="text-negative  text-bold text-h6">{{ item.product_name }} X {{ item.volume }}</q-item-label>
                  <q-item-label class=" text-bold" caption>Wholesale Price : ({{ item.amount }} X {{ item.volume }})</q-item-label>

                  <q-item-label class=" text-bold text-capitalize" caption>Variant : {{ item.variant }}</q-item-label>

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

                  <div class="q-gutter-md row justify-center">
                    <q-spinner
                      color="black"
                      size="3em"
                    />
                  </div>


          </template>

        </q-list>
      </div>
    </div>
    <q-page-sticky expand position="bottom"  v-show="currentUser.is_admin">
      <q-btn v-if="items.length > 0" @click="order = true" label="Fulfill Order" class="full-width no-border q-mt-md" unelevated padding="13px 10px" type="submit" color="warning"/>
    </q-page-sticky>
    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn to="/product" icon="add" fab  color="black" />
    </q-page-sticky>

    <q-dialog v-model="order" persistent>

      <q-card style="min-width: 350px" >
        <q-btn color="negative" flat icon="close" v-close-popup />

        <q-card-section>
          <div class="text-h6 text-center">
            You are about to fulfill this order, once fulfilled, stocks will be moved to store
            <q-separator class="q-mt-lg" />
<!--          <q-item-label class="q-mt-lg">Total Stock : {{ totalStock }}</q-item-label>-->
          </div>
        </q-card-section>

        <q-card-actions>
          <q-btn v-if="items.length > 0 " @click="fulfillOrder()" label="Proceed >>" class="full-width no-border q-mt-md" unelevated padding="13px 10px" type="submit" color="black"/>

        </q-card-actions>

        <q-separator />
      </q-card>
    </q-dialog>

  </q-page>

</template>

<script>
import {mapActions, mapState} from "vuex";
import {date, uid} from "quasar";
import {firebaseDb} from "boot/firebase";

export default {
  name: "OrderDetails",
  created() {
    this.getData();
  },
  data(){
    return {
      text:'',
      order:false,
      items:[],
    }
  },
  methods : {
    // ...mapActions('store', ['getCarts']),
    getData(){
      firebaseDb.collection("carts").doc(this.$route.params.id).collection('details').get().then
      ((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          this.items.push(doc.data());
        });
      });
    },
    formateDate(item){
      return date.formatDate(item, 'Do-MMM-YYYY HH:mm')
    },
    goto(link){
      this.$router.push(link);
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
    fulfillOrder() {
      this.$q.loading.show();
      // this.form.date = Date.now();

      firebaseDb.collection("carts").doc(this.$route.params.id).collection('details').get().then
      ((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          var docRef = firebaseDb.collection("items").where('store_id', '==', doc.data().userId).where('barcode', '==', doc.data().barcode)
          docRef.get().then(function (items) {
            if (!items.empty) {
              docRef.get().then(query => {
                query.forEach(product => {
                  let qty = parseInt(product.data().qty) + parseInt(doc.data().volume);
                  firebaseDb.collection('items').doc(product.id).set({
                    barcode: doc.data().barcode,
                    date: Date.now(),
                    amount: doc.data().amount,
                    id: uid().toString(),
                    name: doc.data().product_name,
                    product_id: doc.data().product_id,
                    qty: qty,
                    store_id: doc.data().userId,
                    store_name: doc.data().store
                  })
                })
              })
            } else {
              firebaseDb.collection('items').add({
                barcode: doc.data().barcode,
                date: Date.now(),
                amount: doc.data().amount,
                id: uid().toString(),
                variant: doc.data().variant,
                name: doc.data().product_name,
                product_id: doc.data().product_id,
                qty: doc.data().volume,
                store_id: doc.data().userId,
                store_name: doc.data().store
              })
            }
          });

          firebaseDb.collection("products").where('id', '==', doc.data().product_id).get()
            .then(queryS => {
              queryS.forEach(doc_new => {
                let p_id = doc_new.id;
                let p = doc_new.data();
                p.volume = p.volume - doc.data().volume;
                firebaseDb.collection("products").doc(p_id).set(p)
              })
            })

          firebaseDb.collection("carts").doc(this.$route.params.id).collection('details').doc(doc.id).delete()

        });



        firebaseDb.collection("orders").doc(this.$route.params.ref).delete();

        this.$q.loading.hide();

        this.order = false;

        this.$router.push('/admin/orders');
      })

    }
  },
  computed : {
    ...mapState('store', ['currentUser']),
  }
}
</script>

<style scoped>

</style>

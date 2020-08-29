<template>
  <q-page class="">
    <div class="q-pa-md">
      <div class="q-gutter-md full-width" style="" >
        <q-input v-model="text" label="Search" />

      </div>

      <div class="column q-mt-md">
        <q-list>
          <template v-for="item in products">
            <q-item :key="item.id" clickable @click="currentUser.is_admin ? confirm(item) : buyProduct(item)" v-ripple>

              <q-item-section>
                <q-item-label lines="1">{{  item.name }}</q-item-label>
                <q-item-label caption>{{ item.type}}</q-item-label>
                <q-item-label caption>Qty : {{ item.volume}}</q-item-label>
              </q-item-section>
              <q-item-section side>
                ${{ item.good_amount}}
                <q-btn v-if="currentUser.is_admin" class="" @click="confirm(item)" color="red" size="12px" flat dense round icon="delete" />
              </q-item-section>
            </q-item>
            <q-separator inset="item" />
          </template>

        </q-list>
      </div>
    </div>
    <q-dialog v-model="prompt" persistent>
      <q-card style="min-width: 350px" >
        <form @submit="orderProduct">
        <q-card-section>
          <div class="text-h6 text-center">Buy [{{ product.name }}]</div>
        </q-card-section>

        <q-separator />

        <q-card-section class="q-pt-none">
          <q-input v-model="product.good_amount" disable type="number" label="Good Amount : " />
          <q-input v-model="form.volume" :rules="[ val => val <= 3 || 'Insufficient quantity in warehouse', val => !!val || 'Volume is required']" clearable type="number" label="Volume : " />
        </q-card-section>

        <q-card-actions align="right" class="text-primary">
          <q-btn flat label="Cancel" v-close-popup />
          <q-btn flat label="Create Order" type="submit" />
        </q-card-actions>
        </form>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import {mapActions, mapState} from "vuex";
import {firebaseDb} from "boot/firebase";
import {uid} from "quasar";

export default {
  name: "Index",
  data(){
    return {
      text:'',
      prompt:false,
      product:{
        name:null,
        good_amount:null,
      },
      form : {
        product_id : '',
        volume : '',
        // userId : this.currentUser.userId,
      }
    }
  },
  created() {
    this.getProducts();
  },
  methods : {
    ...mapActions('store', ['getProducts']),
    orderProduct(){
      this.$q.loading.show();
      this.form.date = Date.now();
      firebaseDb.collection('orders').add(this.form)
        .then( docRef => {
          firebaseDb.collection("products").where('id', '==', this.form.product_id).get()
            .then(querySnapshot => {
              querySnapshot.forEach(doc => {
                let product_id = doc.id;
                this.product.volume = this.product.volume - this.form.volume;
                firebaseDb.collection("products").doc(product_id).set(this.product).then(({

                })).catch(error => {
                  this.$q.loading.hide()
                })
                this.$q.loading.hide();
                this.$q.notify({
                  message: 'Order successfully placed',
                  color: 'secondary'
                })
              })
            })
            .catch(error => {
              this.$q.loading.hide()
              console.log(error)
            })
          this.prompt = false
        }).catch(error => {
          this.$q.loading.hide();
      })
    },
    buyProduct(item){
      if(this.currentUser.userId) {

        this.product = item
        this.form.product_id = item.id;
        this.form.userId = this.currentUser.userId;
        this.form.store = this.currentUser.name;
        // this.form.store_id = item.store_id
        this.form.barcode = item.barcode
        this.form.amount = item.good_amount
        this.form.product_name = item.name
        this.form.id = uid();
        this.prompt = true
      }else {
        this.$q.notify({
          message: 'Authentication Error',
          color: 'negative'
        });
      }
    },
    delete(item){
      this.$q.loading.show();
      firebaseDb.collection("products").where('id', '==', item.id).get()
        .then(querySnapshot => {
          querySnapshot.forEach(doc => {
            let product_id = doc.id;
            firebaseDb.collection("products").doc(product_id).delete().then(()=>{
              this.$q.notify({
                message: 'Product successfully deleted',
                color: 'secondary'
              });
              this.$q.loading.hide();
              this.getProducts();
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
    ...mapState('store', ['products', 'currentUser']),
  }
}
</script>

<style scoped>

</style>

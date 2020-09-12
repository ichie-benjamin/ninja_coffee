<template>
  <q-page class="text-main" style="margin-bottom: 100px">
    <div class="q-pa-md" v-if="!scan">
      <div class="q-gutter-md full-width" style="" >
        <q-input v-model="text" label="Search" />

      </div>

      <div class="column q-mt-md">
        <q-list>
          <template v-for="item in products">
            <q-item :key="item.id" clickable @click="currentUser.is_admin ? confirm(item) : buyProduct(item)" v-ripple>

              <q-item-section>
                <q-item-label lines="1">{{  item.name }}</q-item-label>
<!--                <q-item-label caption>{{ item.type}}</q-item-label>-->
                <q-item-label v-if="!currentUser.is_admin" caption>Qty : {{ item.volume}}</q-item-label>
                <q-item-label v-if="currentUser.is_admin" caption class="text-bold">£{{ formatNum(item.good_amount) }}</q-item-label>

              </q-item-section>
              <q-item-section side>
                <template v-if="currentUser.is_admin">
                  <q-item-label caption class="text-bold">Available Vol</q-item-label>
                  <q-item-label caption class="text-bold">{{ formatNum(item.volume) }}</q-item-label>
                  <q-btn  class="" @click="confirm(item)" color="red" size="12px" flat dense round icon="delete" />
                </template>
                <template v-else>
                  <q-item-label caption class="text-bold">£{{ formatNum(item.good_amount) }}</q-item-label>
                </template>

              </q-item-section>
            </q-item>
            <q-separator  />
          </template>

        </q-list>
      </div>
    </div>
    <div class="q-pa-md" v-else>
      <q-btn color="red" flat icon="cancel" @click="scan = false" />

      <StreamBarcodeReader v-if="scanner"
                           @decode="onDecode"
      ></StreamBarcodeReader>

      <q-btn @click="scanner = !scanner" :label="scanner ? 'Close Scanner' : 'Open Scanner' " class="full-width no-border q-mt-md" unelevated padding="13px 10px" type="button" color="dark"/>

<!--      <q-btn @click="scanner = !scanner" :label="scanner ? 'Close Scanner' : 'Open Scanner' " class="full-width no-border q-mt-md" unelevated padding="13px 10px" type="button" color="dark"/>-->


      <q-card style="min-width: 350px" v-if="scan && product.name">
        <form @submit.prevent="orderProduct">
          <q-card-section>
            <div class="text-h6 text-center">Buy [{{ product.name }}]</div>
          </q-card-section>

          <q-separator />

          <q-card-section class="q-pt-none">
            <q-input v-model="product.good_amount" disable type="number" label="Wholesale Price : " />
            <q-input v-model="form.volume" :rules="[ val => !!val || 'Volume is required']"
                     clearable :hint="product.volume+' Stock Available'" type="number" label="Volume : " />

            <q-item-label v-if="form.volume > product.volume - 1" class="text-negative">You can order more than our current stock</q-item-label>

          </q-card-section>

          <q-card-actions align="right" class="text-primary">
            <q-btn v-if="parseInt(form.volume) < parseInt(product.volume)" flat label="Create Order" type="submit" />
          </q-card-actions>
        </form>
      </q-card>

    </div>

    <q-dialog v-model="prompt" persistent>
      <q-card style="min-width: 350px" >
        <form @submit.prevent="orderProduct">
          <q-card-section>
            <div class="text-h6 text-center">Buy [{{ product.name }}]</div>
          </q-card-section>

          <q-separator />

          <q-card-section class="q-pt-none">
            <q-input v-model="product.good_amount" disable type="number" label="Wholesale Price : " />
            <q-select v-if="variants.length > 0" v-model="form.variant" :options="variants" label="Variant" />

            <q-input v-model="form.volume" :rules="[ val => !!val || 'Volume is required']"
                     clearable :hint="product.volume+' Stock Available'" type="number" label="Volume : " />

            <q-item-label v-if="form.volume > product.volume" class="text-negative">You can't order more than the available warehouse stock</q-item-label>


          </q-card-section>

          <q-card-actions align="right" class="text-primary">
            <q-btn flat label="Cancel" v-close-popup />
            <q-btn v-if="parseInt(form.volume) <= parseInt(product.volume)" flat label="Add to Cart" type="submit" />
          </q-card-actions>
        </form>
      </q-card>
    </q-dialog>


    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn @click="openScan" label="scan" fab  color="black" />
    </q-page-sticky>
  </q-page>
</template>

<script>
import {mapActions, mapState} from "vuex";
import {firebaseDb} from "boot/firebase";
import {Platform, uid} from "quasar";
import { StreamBarcodeReader } from "vue-barcode-reader";


export default {
  name: "Index",
  data(){
    return {
      text:'',
      prompt:false,
      scan:false,
      scanner:false,
      variants:[],
      product:{
        name:null,
        good_amount:null,
      },
      form : {
        product_id : '',
        volume : '',
        variant:'',
        // userId : this.currentUser.userId,
      }
    }
  },
  created() {
    this.getProducts();
  },
  methods : {
    ...mapActions('store', ['getProducts','getCarts']),
    openScan(){
      if(Platform.is.cordova){
        this.scanBarcode()
      }else {
        this.scan = true;
        this.scanner = true;
      }
    },
    checkScan(){
      if(Platform.is.cordova){
        this.scanBarcode()
      }else {
        this.scan = !this.scan
      }
    },

    scanBarcode () {
      var self = this;
      var code = '';
      cordova.plugins.barcodeScanner.scan(
        function (result) {
          if(result.text)
          {
            code += result.text
            code = code.replace("+", "%2B")
            self.onDecode(code)
          }

          else
          {
            //alert("Scanning cancelled or failed")
          }

        },

        function (error) {
          alert("Scanning failed: " + error);
        },

      );
    },


    orderProduct(){
      this.$q.loading.show();
      this.form.date = Date.now();
      firebaseDb.collection('carts').doc(this.currentUser.userId).collection('details').doc(this.form.product_id).set(this.form)
        .then( docRef => {
         this.getCarts();
          this.prompt = false
                this.$q.loading.hide();
                this.$q.notify({
                  message: 'Item successfully added to cart',
                  color: 'secondary'
                });
          this.$q.loading.hide();
        }).catch(error => {
          this.$q.loading.hide();
      })
    },
    buyProduct(item){
      if(this.currentUser.userId) {

        this.product = item
        this.variants = item.variants ? item.variants.split(",") : [];
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
    formatNum(num) {
      return new Intl.NumberFormat().format(num);
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
    onDecode (result) {
      this.result = result;
      this.updated = false,
        firebaseDb.collection("products").where('barcode', '==', result).get()
          .then(querySnapshot => {
            querySnapshot.forEach(doc => {
              this.buyProduct(doc.data());
                // this.order_id = doc.id;
                // this.form = doc.data();
                this.not_working = false;
            })
          })
      this.scan = false;
    },

  },
  computed : {
    ...mapState('store', ['products', 'currentUser']),
  },
  components: {
    StreamBarcodeReader,
  }
}
</script>

<style scoped>

</style>

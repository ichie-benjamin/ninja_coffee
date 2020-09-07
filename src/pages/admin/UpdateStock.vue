<template>
  <q-page class="flex flex-center">
    <div class="q-pa-md">
      <div class="q-gutter-md text-black" style="width: 90vw">

        <q-form @submit.prevent="update" class="q-gutter-md">
          <div v-if="order_id">
            <q-item-label class="text-bold text-center text-h6 q-mb-md">Update {{  form.product_name }} Stock :</q-item-label>
            <q-item-label class="text-negative">Remaining volume : {{ form.volume - vol}}</q-item-label>
            <q-input  v-model="vol" type="number" :rules="[val => !!val || 'Field is required']" clearable label="Sold Qty : " />

            <q-input v-model="form.volume" hint="Available Stock" disable clearable type="number" label="Available Stock : " />

            <q-item-label class="q-mt-lg">Barcode : {{ result }} </q-item-label>

          </div>
          <StreamBarcodeReader v-if="scan"
                               @decode="onDecode"
          ></StreamBarcodeReader>


          <div>
            <q-btn @click="checkScan()" :label="scan ? 'Close Scanner' : 'Scan Barcode' " class="full-width no-border q-mt-md" unelevated padding="13px 10px" type="button" color="dark"/>

            <q-btn v-if="order_id" label="Update Stock" :disable="not_working" class="full-width no-border q-mt-md" unelevated padding="13px 10px" type="submit" color="warning"/>

          </div>
        </q-form>
      </div>
    </div>
  </q-page>
</template>

<script>
import {firebaseDb} from "boot/firebase";
import {mapActions, mapState} from "vuex";

import { StreamBarcodeReader } from "vue-barcode-reader";

import {Platform, uid} from 'quasar'
export default {
  name: "UpdateStock",
  data(){
    return {
      result: '',
      order_id : '',
      vol:0,
      not_working:true,
      product:{},
      scan:false,
      error: '',
      form:{
        name:'',
        low_amount:'',
        good_amount:'',
        volume:'',
        type:'',
        barcode:''
      }
    }
  },
  created(){
  },
  methods:{

    update() {
      this.form.volume = this.form.volume - this.vol;
      if (this.form.volume < 0) {
        this.$q.notify({
          message: 'Sorry you cant have a negative volume',
          color: 'negative'
        })
      } else {
        this.$q.loading.show();
        firebaseDb.collection('orders').doc(this.order_id).set(this.form)
        .then(docRef => {
          this.$q.notify({
            message: 'successfully updated',
            color: 'secondary'
          });
          this.vol = 0;
          this.$q.loading.hide();
        })
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




    onDecode (result) {
      this.result = result;
      this.updated = false,
        firebaseDb.collection("orders").where('barcode', '==', result).get()
          .then(querySnapshot => {
            querySnapshot.forEach(doc => {
              this.order_id = doc.id;
              this.form = doc.data();
              this.not_working = false;
            })
          })
      this.scan = false;
    },
    async onInit (promise) {
      try {
        await promise
      } catch (error) {
        if (error.name === 'NotAllowedError') {
          this.error = "ERROR: you need to grant camera access permisson"
        } else if (error.name === 'NotFoundError') {
          this.error = "ERROR: no camera on this device"
        } else if (error.name === 'NotSupportedError') {
          this.error = "ERROR: secure context required (HTTPS, localhost)"
        } else if (error.name === 'NotReadableError') {
          this.error = "ERROR: is the camera already in use?"
        } else if (error.name === 'OverconstrainedError') {
          this.error = "ERROR: installed cameras are not suitable"
        } else if (error.name === 'StreamApiNotSupportedError') {
          this.error = "ERROR: Stream API is not supported in this browser"
        }
      }
    }
  },
  computed:{
  },
  components: {
    StreamBarcodeReader,
  }
}
</script>

<style scoped lang="scss">
.no-border {
  border-radius: 0;
}
</style>

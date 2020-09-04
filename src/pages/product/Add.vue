<template>
  <q-page class="flex flex-center">
    <div class="q-pa-md">
      <div class="q-gutter-md text-black" style="width: 90vw">
        <q-form @submit.prevent="submit" class="q-gutter-md">
        <q-input  v-model="form.name" :rules="[val => !!val || 'Product name is required']" clearable label="Name : " />
        <q-input v-model="form.low_amount"  clearable type="number" label="Low Amount : " />
        <q-input v-model="form.good_amount" :rules="[val => !!val || 'Product amount is required']" clearable type="number" label="Good Amount : " />
        <q-input v-model="form.volume" clearable type="number" :rules="[val => !!val || 'Product Vol/Qty is required']" label="Volume : " />
        <q-input class="q-pb-md" v-model="form.type" clearable label="Type : " />

          <div>
            <q-item-label class="q-mb-sm">Product Variants : </q-item-label>
            <vue-tags-input
              v-model="form.tag"
              :tags="tags"
              @tags-changed="newTags => tags = newTags"
            />
          </div>


          <StreamBarcodeReader v-if="scan" @decode="onDecode"></StreamBarcodeReader>

          <q-input v-model="form.barcode" :rules="[val => !!val || 'Barcode is required']" clearable label="Barcode : " />

          <q-item-label v-if="error" class="text-negative">Product with barcode : {{ form.barcode }} already exit</q-item-label>
        <div>

          <q-btn @click="scan = !scan" :label="scan ? 'Close Scanner' : 'Scan Barcode' " class="full-width no-border q-mt-md" unelevated padding="13px 10px" type="button" color="dark"/>

          <q-btn label="Add" class="full-width no-border q-mt-md" unelevated padding="13px 10px" type="submit" color="warning"/>
        </div>
        </q-form>
      </div>
    </div>
  </q-page>
</template>

<script>
import {firebaseDb} from "boot/firebase";
import {mapActions, mapState} from "vuex";
import { uid } from 'quasar'
import {StreamBarcodeReader} from "vue-barcode-reader";
import VueTagsInput from '@johmun/vue-tags-input';
export default {
  name: "Add",
  data(){
    return {
      scan:false,
      loading : true,
      error:false,
      tags:[],
      lists:[],
      form:{
        name:'',
        tag:'',
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
    ...mapActions('store', ['getStores']),
    push(){
      let list = [];
      this.tags.forEach(function(item) {
        list.push(item.text)
      });
      this.lists = list.join(', ');
    },
    submit(){
      this.push();
      if(!this.loading){
        firebaseDb.collection('products').add({
          barcode : this.form.barcode,
          date : Date.now(),
          variants:this.lists,
          good_amount : this.form.good_amount,
          id : uid().toString(),
          low_amount : this.form.low_amount,
          name : this.form.name,
          type : this.form.type,
          volume : this.form.volume
        })
          .then( docRef => {
            this.$router.push('/product')
          })
          .catch(error => console.log(err))
      }else {
        let msg = "Product with barcode :" + this.form.barcode + " already exit, or scanner not used";

        this.$q.notify({
          message: msg,
          color: 'negative'
        });
      }

    },
    onDecode (result) {
      this.error = false
      this.form.barcode = result;
      firebaseDb.collection("products").where('barcode', '==', result).get()
        .then(querySnapshot => {
          this.loading = false
          querySnapshot.forEach(doc => {

            if (doc.exists) {
              this.error = true
              this.loading = true
            }
          })
        })
      this.scan = false
    },
  },
  computed:{
    ...mapState('store', ['stores']),
  },
  components: {
    StreamBarcodeReader,VueTagsInput
  }
}
</script>

<style scoped lang="scss">
.no-border {
  border-radius: 0;
}
</style>

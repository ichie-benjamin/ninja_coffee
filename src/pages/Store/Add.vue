<template>
  <q-page class="flex flex-center">
    <div class="q-pa-md">
      {{ stores }}
      <div class="q-gutter-md text-black" style="width: 90vw">
        <q-form @submit="" class="q-gutter-md">
        <q-input  v-model="form.name" clearable label="Name : " />
        <q-input class="q-mt-md" v-model="form.low_amount"  clearable type="number" label="Low Amount : " />
        <q-input v-model="form.good_amount" clearable type="number" label="Good Amount : " />
        <q-input v-model="form.volume" clearable type="number" label="Volume : " />
        <q-input class="q-pb-md" v-model="form.type" clearable label="Type : " />

          <q-item-label class="q-mt-lg">Barcode : </q-item-label>

        <div>
          <q-btn label="Scan Barcode" class="full-width no-border q-mt-md" unelevated padding="13px 10px" type="submit" color="dark"/>

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

export default {
  name: "Add",
  data(){
    return {
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
    this.getStores();
  },
  methods:{
    ...mapActions('store', ['getStores']),
  },
  computed:{
    ...mapState('store', ['stores']),
  }
}
</script>

<style scoped lang="scss">
.no-border {
  border-radius: 0;
}
</style>

<template>
  <q-page class="">
    <div class="q-pa-md">
<!--      <div class="q-gutter-md full-width" style="" >-->
<!--        <q-input v-model="text" label="Search" />-->

<!--      </div>-->
      <q-item-label class="text-center text-bold text-h5" v-if="!loading">{{  title }} Stock ({{ totalStock }}) </q-item-label>

      <div v-if="!loading" class="column q-mt-md">
        <q-list>
          <template>
            <q-card v-if="stocks.length > 0" v-for="item in stocks" :key="item.id" flat bordered class=" my-card q-mb-sm">
              <q-item class="">
                <q-item-section>
                  <q-item-label class="text-negative text-bold text-h6">{{ item.name }} X {{ item.qty }}</q-item-label>
                  <q-item-label class=" text-bold" caption>{{ formateDate(item.date)}}</q-item-label>

                  <q-item-label class="text-bold text-secondary q-mt-sm">Stock Details</q-item-label>

                  <q-item-label v-if="item.variant" class=" text-bold text-capitalise" caption>Variant : {{ item.variant }}</q-item-label>

                  <q-item-label class=" text-bold" caption>Remaining Vol. : #{{ item.qty }}</q-item-label>

                  <q-item-label>Wholesale Price : £{{  formatNum(item.amount) }}</q-item-label>

                </q-item-section>


<!--                <q-item-section side top>-->
<!--                  <q-btn v-if="currentUser.is_admin" class="" @click="confirm(item)" color="red" size="12px" flat dense round icon="delete" />-->
<!--                </q-item-section>-->
              </q-item>
            </q-card>

            <q-card v-if="!loading && stocks.length < 1" flat bordered  class=" my-card q-mb-sm">
              <q-item class="q-pt-xl q-pb-xl">
                <q-item-section class="justify-center">
                  <q-item-label class="text-negative text-bold text-center text-h6">No Stock Available</q-item-label>

                </q-item-section>
              </q-item>
            </q-card>

          </template>

        </q-list>
      </div>
      <div v-else class="column absolute-center">
        <q-spinner
          color="red"
          size="3em"
          :thickness="10"
        />
      </div>
    </div>
  </q-page>
</template>

<script>
import {mapActions, mapState} from "vuex";
import {date} from "quasar";
import {firebaseDb} from "boot/firebase";

export default {
  name: "StoreOverview",
  created() {
    this.getDetails();
  },
  data(){
    return {
      text:'',
      stocks:[],
      loading:true,
      title:'Store Overview',
    }
  },
  methods : {
    ...mapActions('store', ['getStocks']),
    formateDate(item){
      return date.formatDate(item, 'Do-MMM-YYYY HH:mm')
    },
    formatNum(num) {
      return new Intl.NumberFormat().format(num);
    },
    getDetails(){
      this.title = this.$route.params.name+' Store';
      firebaseDb.collection("items").where('store_id', '==', this.$route.params.id).get().then
      ((querySnapshot) => {
        this.loading = false;
        querySnapshot.forEach((doc) => {
          this.stocks.push(doc.data());
        });
      });
    },
  },
  computed : {
    ...mapState('store', ['currentUser']),

    totalStock: function(){
      // return 5;
      return this.stocks.reduce(function(total, item){
        return parseInt(total) + parseInt((item.qty));
      },0);
    },
  }
}
</script>

<style scoped>

</style>

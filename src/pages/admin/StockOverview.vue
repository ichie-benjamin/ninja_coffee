<template>
  <q-page class="">
    <div class="q-pa-md">
<!--      <div class="q-gutter-md full-width" style="" >-->
<!--        <q-input v-model="text" label="Search" />-->

<!--      </div>-->
      <q-item-label class="text-center text-h5">Total Stock : {{ totalStock }} </q-item-label>

      <div class="column q-mt-md">
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

                  <q-item-label>Wholesale Price : £{{  item.amount }}</q-item-label>

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
  name: "StockOverview",
  created() {
    this.getStocks();
  },
  data(){
    return {
      text:'',
    }
  },
  methods : {
    ...mapActions('store', ['getStocks']),
    formateDate(item){
      return date.formatDate(item, 'Do-MMM-YYYY HH:mm')
    },
  },
  computed : {
    ...mapState('store', ['stocks', 'currentUser']),

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

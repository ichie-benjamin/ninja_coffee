<template>
  <q-page class="">
    <div class="q-pa-md">
      <div class="q-gutter-md full-width" style="" >
        <q-input v-model="text" label="Search" />

      </div>
      <div class="column q-mt-md">
        <q-list>
          <template v-for="item in stores">
            <q-item :key="item.id" clickable @click="goto(item.id, item.name)" v-ripple>

              <q-item-section>
                <q-item-label lines="1">{{  item.name }}</q-item-label>
                <q-item-label caption>{{ item.email }}</q-item-label>
              </q-item-section>
              <q-item-section side top>
                <q-btn v-if="currentUser.is_admin" class="q-pr-md q-pl-md" @click="goto(item.id, item.name)" color="warning" size="12px" dense label="view stock" />
              </q-item-section>
            </q-item>
            <q-separator />
          </template>

        </q-list>
      </div>
    </div>
  </q-page>
</template>

<script>
import {mapActions, mapState} from "vuex";
import {firebaseDb} from "boot/firebase";

export default {
  name: "AllStore",
  data(){
    return {
      text : ''
    }
  },
  created() {
    this.getStores();
  },
  methods : {
    ...mapActions('store', ['getStores']),
    goto(id,name){
      this.$router.push('/store/'+id+'/'+name);
    },
  },
  computed : {
    ...mapState('store', ['stores','currentUser']),
  }
}
</script>

<style scoped>

</style>

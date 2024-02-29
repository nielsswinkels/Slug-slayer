<template>
  <q-page class="column items-center justify-start">
    <div class="text-h6 q-mt-lg">
      Din kill count: 
    </div>
    <div class="text-h1 q-mb-lg">
      <q-spinner v-if="!doneLoading"></q-spinner>
      {{ (this.doneLoading?this.personalTotal:'') }}
    </div>
    <div>
      Du är inloggad som {{ currentUser.get('username') }}
      <q-btn
      label="Logga ut"
      to="/logout"
      size="md"
      class="rorstrand-button"
      text-color="primary"
      flat
      no-caps
      />
    </div>
    <q-page-sticky position="bottom-right" :offset="[30, 30]">
      <q-btn
        label="Dags att mörda"
        icon="content_cut"
        rounded
        color="primary"
        size="xl"
        class="q-pa-lg"
        to="/user/kill"
      ></q-btn>
    </q-page-sticky>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import parse from 'parse'
import parseUtil from 'src/js/parseUtil'

export default defineComponent({
  name: 'IndexPage',
  components: {  },
  setup() {
    return {
      personalTotal: ref(0),
      doneLoading: ref(false),
      currentUser: ref(parse.User.current())
    };
  },
  async mounted () {
    this.doneLoading = false
    this.personalTotal = await parseUtil.getTotalKillCountForUser(this.currentUser)
    this.doneLoading = true
  }
});
</script>

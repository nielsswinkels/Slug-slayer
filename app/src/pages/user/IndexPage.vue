<template>
  <q-page class="column items-center justify-evenly">
    hej
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

export default defineComponent({
  name: 'IndexPage',
  components: {  },
  setup() {
    
    return {
      currentUser: ref(parse.User.current())
    };
  }
});
</script>

<template>
  <q-page class="row items-center justify-evenly">
    Välkommen

    <q-btn
      label="Login"
      to="/user/"
    ></q-btn>
  </q-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'IndexPage',
  components: { },
  setup() {
    return {};
  }
});
</script>

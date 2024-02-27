<template>
  <q-page class="row items-center justify-evenly">
    Hej
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

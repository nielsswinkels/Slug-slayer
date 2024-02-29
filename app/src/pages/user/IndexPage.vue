<template>
  <q-page class="column items-center justify-start">
    <div class="text-h6 q-mt-lg">
      Din kill count: 
    </div>
    <div class="text-h1 q-mb-lg">
      <q-spinner v-if="!personalTotal"></q-spinner>
      {{ (this.personalTotal?this.personalTotal:'') }}
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
    <div>
      <q-list>
        <q-item
          v-for="user in this.allUsers"
          :key="user.id"
        >
          {{ user.get('username') }}
        </q-item>
      </q-list>
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
import { defineComponent, ref, Ref } from 'vue';
import parse from 'parse'
import parseUtil from 'src/js/parseUtil'

export default defineComponent({
  name: 'IndexPage',
  components: {  },
  setup() {
    let personalTotal: Ref<null | number> = ref(null)
    return {
      personalTotal,
      allUsers: ref([]),
      currentUser: ref(parse.User.current())
    };
  },
  async mounted () {
    this.personalTotal = await parseUtil.getTotalKillCountForUser(this.currentUser)
    // const loadedUsers = await parseUtil.getAllUsers()
    // for (const user of loadedUsers) {
      
    //   // this.allUsers.push({
    //   //   id:user.id,
    //   //   username:user.get('username'),
    //   // })
    // }
  }
});
</script>

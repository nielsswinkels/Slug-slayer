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
      <h4>Toppmördare</h4>
      <q-list>
        <q-item
          v-for="(user, index) in allUsers"
          :key="user.id"
        >
          {{ index+1 }}
          <q-icon
            name="arrow_right"
            size="sm"
            v-if="user.username === currentUser.get('username')"
          ></q-icon>
          {{ user.username }}
          {{ user.killCount }}
        </q-item>
      </q-list>
    </div>
    <div>
      <h4>Teamlistan</h4>
      <q-list>
        <q-item
          v-for="(user, index) in allTeams"
          :key="user.id"
        >
          {{ index+1 }}
          <q-icon
            name="arrow_right"
            size="sm"
            v-if="user.username === currentUser.get('username')"
          ></q-icon>
          {{ user.username }}
          {{ user.killCount }}
        </q-item>
      </q-list>
    </div>
    <div
      class="q-py-xl q-my-xl"
    >
      <div class="text-h6">Uppdateringar</div>
      <ul>
        <li>
          Any day now..
          <ul>
            <li>En första utmärkelse är möjligt att få!</li>
          </ul>
        </li>
        <li>
          2024-05-25
          <ul>
            <li>Se en lista över dina strider från vänstra menyn.</li>
          </ul>
        </li>
        <li>
          2024-05-24
          <ul>
            <li>Nu går det att direkt skriva din kill count.</li>
          </ul>
        </li>
      </ul>

    </div>
    <div
      class="q-py-xl q-my-xl"
    >

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
    let allUsers: Ref<Array<{id:string, username:string, killCount:number}>> = ref([])

    return {
      personalTotal,
      allUsers,
      currentUser: ref(parse.User.current())
    };
  },
  async mounted () {
    if (this.currentUser) {
        this.personalTotal = await parseUtil.getTotalKillCountForUser(this.currentUser)
    }
    const loadedUsers = await parseUtil.getAllUsers()
    for (const user of loadedUsers) {
      console.log(user)
      console.log(user.get('username'))

      let killCount = await parseUtil.getTotalKillCountForUser(user)
      
      this.allUsers.push({
        'id':user.id,
        'username':user.get('username'),
        'killCount': killCount,
      })
    }
    this.allUsers.sort((a,b) => b.killCount - a.killCount)
  }
});
</script>

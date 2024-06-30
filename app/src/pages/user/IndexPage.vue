<template>
  <q-page class="column items-center justify-start">
    <div class="text-h6 q-mt-lg">
      Din kill count: 
    </div>
    <div class="text-h1 q-mb-lg">
      <q-spinner v-if="!personalTotal"></q-spinner>
      {{ (personalTotal?personalTotal:'') }}
    </div>
    <div>
      <h4>Toppmördare</h4>
      <q-list>
        <q-item
          v-for="(user, index) in allUsers"
          :key="user.id"
        >
          {{ index+1 }}.
          <q-icon
            name="arrow_right"
            size="sm"
            v-if="currentUser && user.username === currentUser.get('username')"
          ></q-icon>
          {{ user.username }}
          {{ user.killCount }}
        </q-item>
      </q-list>
    </div>
    <div>
      <h4>Laglistan</h4>
      <q-list>
        <q-item
          v-for="(team, index) in allTeams"
          :key="team.id"
        >
          {{ index+1 }}.
          <q-icon
            name="arrow_right"
            size="sm"
            v-if="currentTeam && team.name === currentTeam.get('name')"
          ></q-icon>
          {{ team.name }}
          {{ team.killCount }}
        </q-item>
      </q-list>
    </div>
    <div
      class="q-py-xl q-my-xl"
    >
      <div class="text-h6">Uppdateringar</div>
      <ul>
        <li>
          2024-06-23
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
        color="accent"
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
    let allTeams: Ref<Array<{id:string, name:string, killCount:number}>> = ref([])
    let currentTeam: Ref<parse.Object | undefined> = ref(undefined)

    return {
      personalTotal,
      allUsers,
      allTeams,
      currentTeam,
      currentUser: ref(parse.User.current())
    };
  },
  async mounted () {
    if (this.currentUser) {
        this.personalTotal = await parseUtil.getTotalKillCountForUser(this.currentUser)
    }
    const loadedUsers = await parseUtil.getAllUsers()
    for (const user of loadedUsers) {
      // console.log(user)
      // console.log(user.get('username'))

      let killCount = await parseUtil.getTotalKillCountForUser(user)
      
      this.allUsers.push({
        'id':user.id,
        'username':user.get('username'),
        'killCount': killCount,
      })
    }
    this.allUsers.sort((a,b) => b.killCount - a.killCount)

    const teamMembership = await parseUtil.getTeamMembershipForUser(this.currentUser)
    this.currentTeam = teamMembership?.get('team')
    const loadedTeams = await parseUtil.getAllTeams()
    for (const team of loadedTeams) {
      let killCount = await parseUtil.getTotalKillCountForTeam(team)
      
      this.allTeams.push({
        'id':team.id,
        'name':team.get('name'),
        'killCount': killCount,
      })
    }
    this.allTeams.sort((a,b) => b.killCount - a.killCount)
  }
});
</script>

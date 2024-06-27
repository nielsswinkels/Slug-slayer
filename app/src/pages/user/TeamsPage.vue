<template>
  <q-page class="column items-center justify-start">
    <template v-if="currentTeam">
      <div>
        <h4>Mitt lag</h4>
        <h5>{{ currentTeam.get('name') }}</h5>
        <q-list>
          <q-item
            v-for="(member, index) in teamMembers"
            :key="member.id"
          >
            {{ index+1 }}
            <q-icon
              name="arrow_right"
              size="sm"
              v-if="currentUser && member.user.get('username') === currentUser.get('username')"
            ></q-icon>
            <q-icon
              name="flag"
              size="sm"
              v-if="member.isCaptain"
            ></q-icon>
            {{ member.user.get('username') }}
            {{ member.killCount }}
          </q-item>
        </q-list>
      </div>
      <div v-if="requestedMembers.length > 0">
        <h5>Begär att gå med </h5>
        <q-list>
          <q-item
            v-for="(member, index) in requestedMembers"
            :key="member.id"
          >
            {{ index+1 }}
            <q-icon
              name="arrow_right"
              size="sm"
              v-if="currentUser && member.user.get('username') === currentUser.get('username')"
            ></q-icon>
            <q-icon
              name="flag"
              size="sm"
              v-if="member.isCaptain"
            ></q-icon>
            {{ member.user.get('username') }}
            {{ member.killCount }}
          </q-item>
        </q-list>
      </div>
      <div>
        <q-btn
          label="Lämna lag"
          rounded
          no-caps
          color="negative"
        />
      </div>
    </template>
    <template v-if="!currentTeam">
      <div>
        Du är inte med i ett lag ännu. Vill du skapa ett nytt, eller gå med i ett befintligt?
      </div>
      <q-btn
        label="Skapa nytt lag"
        icon="add"
        rounded
        no-caps
        to="/user/newteam"
      />
    </template>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, ref, Ref } from 'vue';
import parse from 'parse'
import parseUtil from 'src/js/parseUtil'
// import { TeamMember, Team} from '../../../../shared-types'

export default defineComponent({
  name: 'IndexPage',
  components: {  },
  setup() {
    let currentTeam: Ref<parse.Object | undefined> = ref()
    let teamMembers: Ref<{
      'id': string,
      'isCaptain': boolean,
      'isAccepted': boolean,
      'joinDate': Date,
      'user':parse.Object,
      'killCount':number
    }[]> = ref([])
    let requestedMembers: Ref<{
      'id': string,
      'isCaptain': boolean,
      'isAccepted': boolean,
      'joinDate': Date,
      'user':parse.Object,
      'killCount':number
    }[]> = ref([])

    return {
      currentTeam,
      currentUser: ref(parse.User.current()),
      teamMembers,
      requestedMembers
    };
  },
  async mounted () {
    if (this.currentUser) {
      this.currentTeam = await parseUtil.getTeamForUser(this.currentUser)
      if (this.currentTeam) {
        const loadedTeamMembers = await parseUtil.getTeamMembers(this.currentTeam)
        for (const member of loadedTeamMembers) {
          // console.log(user)
          // console.log(user.get('username'))

          let killCount = await parseUtil.getTotalKillCountForUser(member.get('user'))
          
          if (member.get('isAccepted')) {
            this.teamMembers.push({
              'id': member.id,
              'isCaptain': member.get('isCaptain'),
              'isAccepted': member.get('isAccepted'),
              'joinDate': member.get('joinDate'),
              'user': member.get('user'),
              'killCount': killCount,
            })
          } else {
            this.requestedMembers.push({
              'id': member.id,
              'isCaptain': member.get('isCaptain'),
              'isAccepted': member.get('isAccepted'),
              'joinDate': member.get('joinDate'),
              'user': member.get('user'),
              'killCount': killCount,
            })
          }
        }
      }
    }
  }
});
</script>

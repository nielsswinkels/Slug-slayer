<template>
  <q-page class="column items-center justify-start q-px-md">
    <template v-if="isLoading">
      <q-spinner
        size="xl"
        class="q-ma-xl"
      />
    </template>
    <template v-if="!isLoading && currentTeam && currentMembership?.get('isDenied')">
      <h4>{{ currentTeam.get('name') }}</h4>
      Du fick tyvärr inte vara med i laget.
      <div class="q-ma-xl q-pa-xl">
        <q-btn
          :label="(currentMembership?.get('isAccepted')?'Lämna lag':'Avbryt begäran')"
          rounded
          no-caps
          color="negative"
          @click="showLeaveDialog = true"
        />
      </div>
    </template>
    <template v-if="!isLoading && currentTeam && !currentMembership?.get('isDenied')">
      <div>
        <h4>Mitt lag</h4>
        <h4>{{ currentTeam.get('name') }}</h4>
        <h6>Total: {{ currentTeamKillCount }}</h6>
        <q-list>
          <q-item
            v-for="(member, index) in teamMembers"
            :key="member.id"
          >
            {{ index+1 }}.
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
            <q-item-section>
              <div>
                {{ index+1 }}.
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
              </div>
            </q-item-section>
            <q-item-section avatar v-if="currentMembership?.get('isCaptain')">
              <div class="row justify-between q-gutter-sm">
                <q-btn
                  rounded
                  icon="done"
                  color="positive"
                  @click="acceptJoinRequest(member.user)"
                  />
                  <q-btn
                  rounded
                  icon="block"
                  color="negative"
                  @click="rejectJoinRequest(member.user)"
                  />
              </div>
            </q-item-section>
          </q-item>
        </q-list>
      </div>
      <div class="q-ma-xl q-pa-xl">
        <q-btn
          :label="(currentMembership?.get('isAccepted')?'Lämna lag':'Avbryt begäran')"
          rounded
          no-caps
          color="negative"
          @click="showLeaveDialog = true"
        />
      </div>
    </template>
    <template v-if="!isLoading && !currentTeam">
      <div class="q-my-xl">
        Du är inte med i ett lag ännu. Vill du skapa ett nytt, eller gå med i ett befintligt?
      </div>
      <q-btn
        label="Skapa nytt lag"
        icon="add"
        rounded
        no-caps
        to="/user/newteam"
      />
      <div>
      <h4>Laglistan</h4>
      <q-list>
        <q-item
          v-for="(team, index) in allTeams"
          :key="team.id"
        >
          <q-item-section>
            {{ index+1 }}.
            <q-icon
              name="arrow_right"
              size="sm"
              v-if="currentTeam && team.name === currentTeam.get('name')"
            ></q-icon>
            {{ team.name }}
          </q-item-section>
          <q-item-section avatar>
            <q-btn
              label="Begär att gå med"
              icon="group_add"
              rounded
              no-caps
              @click="joinTeam(team.id)"
            />
          </q-item-section>
        </q-item>
      </q-list>
    </div>
    </template>
    <q-dialog v-model="showLeaveDialog">
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar icon="group_remove" color="primary" text-color="white" />
          <span class="q-ml-sm" v-if="currentMembership?.get('isAccepted')">Är du säker att du vill lämna laget?</span>
          <span class="q-ml-sm" v-if="!currentMembership?.get('isAccepted')">Är du säker att du vill avbryta din begäran att gå med i laget?</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn label="Ångra" color="primary" v-close-popup />
          <q-btn
            :label="(currentMembership?.get('isAccepted')?'Lämna lag':'Avbryt begäran')"
            color="negative"
            v-close-popup
            @click="leaveTeam"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
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
  methods: {
    async joinTeam (id: string) {
      const team = await parseUtil.getTeamById(id)
      if (team) {
        await parseUtil.joinTeam(team, this.currentUser, false, false)
        this.loadCurrentMembership()
      } else {
        console.error('Could not find team with that ID so you can not join it. Very weird.', id)
      }
    },
    async leaveTeam () {
      if (this.currentTeam && this.currentUser) {
        await parseUtil.leaveTeam(this.currentTeam, this.currentUser)
        this.loadCurrentMembership()
      } else {
        console.error('Can not leave current team because either currentTeam or currentUser is missing. Very weird.', this.currentTeam, this.currentUser)
      }
    },
    async acceptJoinRequest (user: parse.Object) {
      await parseUtil.acceptJoinTeam(this.currentTeam, user)
      this.loadCurrentMembership()
    },
    async rejectJoinRequest (user: parse.Object) {
      await parseUtil.rejectJoinTeam(this.currentTeam, user)
      this.loadCurrentMembership()
    },
    async loadCurrentMembership () {
      this.isLoading = true
      if (this.currentUser) {
        this.currentMembership = await parseUtil.getTeamMembershipForUser(this.currentUser)
        this.currentTeam = this.currentMembership?.get('team')
        if (this.currentTeam) {
          const loadedTeamMembers = await parseUtil.getTeamMembers(this.currentTeam)
          this.teamMembers = []
          this.requestedMembers = []
          this.currentTeamKillCount = 0
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
              this.currentTeamKillCount += killCount
            } else {
              if (!member.get('isDenied')) {
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
      this.isLoading = false
    },
    async loadAllTeams () {
      this.isLoading = true
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
      this.isLoading = false
    }
  },
  setup() {
    let currentMembership: Ref<parse.Object | undefined> = ref()
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
    let allTeams: Ref<Array<{id:string, name:string, killCount:number}>> = ref([])

    return {
      currentTeam,
      currentTeamKillCount: ref(0),
      currentMembership,
      currentUser: ref(parse.User.current()),
      teamMembers,
      requestedMembers,
      allTeams,
      isLoading: ref(true),
      showLeaveDialog: ref(false)
    };
  },
  async mounted () {
    this.loadCurrentMembership()
    this.loadAllTeams()
  }
});
</script>

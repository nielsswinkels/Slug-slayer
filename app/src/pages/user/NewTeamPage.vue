<template>
  <q-page class="column justify-evenly items-evenly">
    <div class="col-shrink row justify-center items-center text-h6">
      Skapa nytt lag
    </div>
    <div
      class="col-shrink column justify-center items-center "
    >
      <div class="q-pa-md" style="max-width: 300px">
        <template v-if="!isSaving">
          <q-input
            autocomplete="off"
            v-model="teamName"
            label="Lagnamn"
          >
          </q-input>
      </template>
      <q-spinner v-if="isSaving"></q-spinner>
      </div>
      <div class="col row justify-between q-gutter-xl">
        <q-btn
            rounded
            size="md"
            label="Avbryt"
            to="/user"
            :disable="isSaving"
          ></q-btn>
        <q-btn
            rounded
            size="md"
            label="Skapa"
            color="positive"
            @click="saveNewTeam"
            :disable="isSaving || teamName.trim() === ''"
            class="q-pa-md"
          ></q-btn>
      </div>
    </div>
  </q-page>
</template>

<script lang="ts">
import parseUtil from 'src/js/parseUtil'
import parse from 'parse'
import { defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'IndexPage',
  components: {  },
  methods: {
    async saveNewTeam () {
      this.isSaving = true
      this.teamName = this.teamName.trim()
      const existingTeam = await parseUtil.getTeam(this.teamName)
      if (existingTeam !== null) {
        console.warn('Team name is already in use.')
        // TODO show some kind of error
        this.isSaving = false
        return
      }
      const currentUser = parse.User.current()
      const currentTeam = await parseUtil.getTeamForUser(currentUser)
      if (currentTeam) {
        console.error('User is already in a team.')
        // TODO show some kind of error
        this.isSaving = false
        return
      }
      const savedTeam = await parseUtil.createTeam(this.teamName)
      if (!savedTeam) {
        console.error('Did not save the new team! Now what we do?!')
        // TODO show some kind of error
        this.isSaving = false
        return
      }
      if (!currentUser) {
        console.error('Could not find current user! Now what we do?!')
        // TODO show some kind of error
        this.isSaving = false
        return
      }
      const savedTeamMember = await parseUtil.joinTeam(savedTeam, currentUser, true)
      if (!savedTeamMember) {
        console.error('Could not join the new team! Now what we do?!')
        // TODO show some kind of error
        this.isSaving = false
        return
      }
      this.$router.push('/user')
      this.isSaving = false
    },
    
  },
  setup() {
    return {
      teamName: ref(''),
      isSaving: ref(false)
    };
  }
});
</script>

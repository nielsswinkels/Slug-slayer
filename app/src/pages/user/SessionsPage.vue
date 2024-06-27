<template>
  <q-page class="column items-center justify-start">
    <div>
      <h4>Mina strider</h4>
      <q-list>
        <q-item
          v-for="(session) in sessions"
          :key="session.id"
        >
          <q-item-section side>
            <!-- {{ session.date.toLocaleDateString() }} -->
            {{ session.date.toLocaleString() }}
          </q-item-section>
          <q-item-section>
            {{ session.count }}
          </q-item-section>
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
  </q-page>
</template>

<script lang="ts">
import { defineComponent, ref, Ref } from 'vue';
import parse from 'parse'
import parseUtil from 'src/js/parseUtil'
import { Session } from '../../../../shared-types'

export default defineComponent({
  name: 'IndexPage',
  components: {  },
  setup() {
    let personalTotal: Ref<null | number> = ref(null)
    let sessions: Ref<Session[]> = ref([])

    return {
      personalTotal,
      sessions,
      currentUser: ref(parse.User.current())
    };
  },
  async mounted () {
    if (this.currentUser) {
      this.sessions = await parseUtil.getSessionsForUser(this.currentUser)
    }
  }
});
</script>

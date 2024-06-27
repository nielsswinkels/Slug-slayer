<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title @click="$router.push('/user')">
          {{ appName }}
        </q-toolbar-title>
        <span
        @click="toggleRightDrawer"
        >
          {{ currentUser.get('username') }}
        </span>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      bordered
    >
      <q-list>
        <q-item
          clickable
          to="/user/"
        >
          Översikt
        </q-item>
        <q-item
          clickable
          to="/user/sessions"
        >
          Mina strider
        </q-item>
        <q-item
          clickable
          to="/user/teams"
        >
          Mitt lag
        </q-item>
        <q-item
          clickable
          to="/user/awards"
        >
          Utmärkelser
        </q-item>
      </q-list>
    </q-drawer>

    <q-drawer
      v-model="rightDrawerOpen"
      bordered
      side="right"
    >
      <q-list>
        <q-item
        >
          Du är inloggad som {{ currentUser.get('username') }}
        </q-item>
        <q-item>
          <q-btn
            label="Logga ut"
            to="/logout"
            size="md"
            class="rorstrand-button"
            text-color="primary"
            flat
            no-caps
          />
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import parse from 'parse'



export default defineComponent({
  name: 'MainLayout',

  components: {
  },

  setup () {
    const leftDrawerOpen = ref(false)
    const rightDrawerOpen = ref(false)
    const appName = process.env.APP_NAME
    const currentUser = parse.User.current()
    return {
      currentUser,
      appName,
      leftDrawerOpen,
      rightDrawerOpen,
      toggleLeftDrawer () {
        leftDrawerOpen.value = !leftDrawerOpen.value
      },
      toggleRightDrawer () {
        rightDrawerOpen.value = !rightDrawerOpen.value
      }
    }
  }
});
</script>

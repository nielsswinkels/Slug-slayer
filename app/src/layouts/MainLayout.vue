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
        {{ currentUser.get('username') }}
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      bordered
    >
      <q-list>
        <q-item
        >
          Menu
        </q-item>
        <q-item
        >
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
    const appName = process.env.APP_NAME
    const currentUser = parse.User.current()
    return {
      currentUser,
      appName,
      leftDrawerOpen,
      toggleLeftDrawer () {
        leftDrawerOpen.value = !leftDrawerOpen.value
      }
    }
  }
});
</script>

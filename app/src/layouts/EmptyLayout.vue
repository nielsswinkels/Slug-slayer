<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-toolbar-title @click="$router.push('/')">
          {{ appName }}
        </q-toolbar-title>
        <q-btn
          icon="login"
          label="Login"
          to="/login"
          size="md"
          flat
          rounded
        ></q-btn>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">
import { defineComponent } from 'vue';


export default defineComponent({
  name: 'MainLayout',

  components: {
  },

  setup () {
    const appName = process.env.APP_NAME
    return {
      appName
    }
  }
});
</script>

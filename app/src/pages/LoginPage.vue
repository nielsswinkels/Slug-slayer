<template>
  <q-page>
    <div class="column items-center justify-center no-wrap" style="height:100%; width:100%; position: absolute;">
      <h1>Login</h1>
      <div class="column items-start q-gutter-md no-wrap">
        <q-input
          class="col q-pb-md"
          autocomplete="on"
          v-model="email"
          clearable
          filled
          type="email"
          label="E-post"
        ></q-input>
        <q-input
          class="col q-pb-md"
          v-model="password"
          filled
          type="password"
          label="Lösenord"
        ></q-input>
        <q-spinner-hourglass
          v-if="this.loginLoading"
          size="lg"></q-spinner-hourglass>
        <q-btn
          class="col rorstrand-button rorstrand-button-primary"
          label="Logga in"
          color="primary"
          @click="logIn"
          no-caps
        />
        <q-btn
          class="col rorstrand-button"
          label="Återställ lösenord"
          text-color="primary"
          @click="resetPassword"
          flat
          no-caps
        />
        <q-btn
          class="col rorstrand-button"
          label="Registrera konto"
          text-color="primary"
          :to="'/register/'+this.email"
          flat
          no-caps
        />
        <div>
          <a href="mailto:rorstrand-ai@betaversion.se">
            <q-btn
              label="Kontakt"
              class="rorstrand-button"
              text-color="primary"
              flat
              no-caps
            />
          </a>
        </div>
        <q-banner
          class="bg-negative text-white"
          v-if="this.errorMessage">
          {{ this.errorMessage }}
          <template v-slot:action>
            <q-btn flat color="white" label="Stäng" @click="this.errorMessage=''" />
          </template>
        </q-banner>
      </div>
    </div>

  </q-page>
</template>

<script>
import parseUtil from 'src/js/parseUtil'
import { ref } from 'vue'

export default {
  name: 'PageIndex',

  components: {
  },

  computed: {
    // ...mapState(['photos', 'response', 'hasError', 'errorMsg']),
  },
  methods: {
    async logIn () {
      this.loginLoading = true
      const loginSuccess = await parseUtil.logIn(this.email, this.password)
      this.loginLoading = false
      console.log(loginSuccess)
      if (loginSuccess.success) {
        this.$router.push('/user/')
      } else {
        this.errorMessage = 'Ursäkta, men någonting gick fel med att logga in. Har du fyllt i rätt e-post och lösenord? Gärna försök en gång till eller ta kontakt med oss. Om du har glömt ditt lösenord tryck på Återställ lösenord. Felkod: ' + loginSuccess.error?.message
      }
    },
    async resetPassword () {
      this.loginLoading = true
      const resetSuccess = await parseUtil.resetPassword(this.email)
      this.loginLoading = false
      console.log(resetSuccess)
      if (resetSuccess.success) {
        // Do what now?
      } else {
        this.errorMessage = 'Ursäkta, men någonting gick fel med att återställa lösenord. Har du fyllt i rätt e-post? Gärna försök en gång till eller ta kontakt med oss. Felkod: ' + resetSuccess.error?.message
      }
    }
  },
  setup () {
    return {
      email: ref(''),
      password: ref(''),
      loginLoading: ref(false),
      errorMessage: ref('')
    }
  },
  mounted () {
    if (this.$route.params.email) {
      this.email = this.$route.params.email
    }
  }
}
</script>

<style scoped>

</style>

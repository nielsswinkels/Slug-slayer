<template>
  <q-page >
    <div class="column items-center justify-center no-wrap">
      <h1 class="text-center debug-red">
        Registrera konto
      </h1>
      <div class="column items-start q-gutter-md no-wrap">
        <q-input
          ref="emailRef"
          class="col"
          autocomplete="on"
          v-model="email"
          filled
          type="email"
          label="E-post"
          lazy-rules
          :rules="[ testPattern.email ]"
        ></q-input>
        <q-input
          ref="usernameRef"
          class="col"
          autocomplete="on"
          v-model="username"
          filled
          type=""
          label="Användarnamn"
          lazy-rules
          :rules="[
            v => v.length >= 1 || 'Användarnamnet ska vara minst 1 karakter'
          ]"
        ></q-input>
        <q-input
          ref="passwordRef"
          class="col"
          autocomplete="on"
          v-model="password"
          filled
          type="password"
          label="Lösenord"
          lazy-rules
          :rules="[
            v => /^.*[0-9].*/.test(v) || 'Lösenordet ska innehålla minst en siffra',
            v => /^.*[a-öA-Ö].*/.test(v) || 'Lösenordet ska innehålla minst en bokstav',
            v => v.length >= 10 || 'Lösenordet ska vara minst 10 karakter'
          ]"
          @focus="this.showPasswordTooltip = true"
          @blur="this.showPasswordTooltip = false"
        >
            <q-tooltip
              v-model="showPasswordTooltip"
              anchor="center right"
              self="center left"
              :offset="[10, 10]"
              class="text-subtitle1"
            >
              Lösenordskrav:
              <ul>
                <li>Minst en siffra</li>
                <li>Minst en bokstav</li>
                <li>Minst 10 karakter</li>
              </ul>
            </q-tooltip>
          </q-input>
          <q-expansion-item
            class="col bg-grey-2"
            icon="info"
            label="Vilkoren"
            v-model="showTerms"
          >
            <q-list
              bordered
              class="q-pa-md bg-white text-body1"
            >
              <q-item-label>
                Genom att registrera ett konto här lovar du att:
              </q-item-label>
              <q-item>
                <p>
                  Fylla i dina mördarsniglarmordsantal på heder och samvetemjöl.
                </p>
              </q-item>
              <q-item-label>
                Kontakt
              </q-item-label>
              <q-item>
                <p>
                  Kontakta oss på&nbsp;<a href="mailto:snigelkampen@nielsswinkels.nl">snigelkampen@nielsswinkels.nl</a>.
                </p>
              </q-item>
              <q-item>
                  <q-btn
                    class="col"
                    text-color="primary"
                    label="Stäng vilkoren"
                    @click="this.showTerms = false"
                    flat
                    no-caps
                  />
              </q-item>
            </q-list>
          </q-expansion-item>
          <q-checkbox
            class="col"
            v-model="termsAccepted"
            label="Jag har läst och godkänner villkoren."
            size="sm"
          />
        <q-spinner-hourglass
          class="col"
          v-if="this.signupLoading"
          size="lg"></q-spinner-hourglass>
        <q-btn
          class="col rorstrand-button rorstrand-button-primary"
          label="Registrera"
          @click="signUp"
          color="primary"
          no-caps
        />
        <q-btn
          class="col rorstrand-button"
          text-color="primary"
          label="Logga in"
          to="/login"
          flat
          no-caps
        />
        <q-banner class="col bg-warning text-body1" v-if="this.signupWarning">
          Du kan inte registrera än. {{ this.signupWarning }}
          <template v-slot:action>
            <q-btn flat label="Stäng" @click="this.signupWarning = null" no-caps />
          </template>
        </q-banner>
        <q-banner
          class="col bg-negative text-white"
          v-if="this.errorMessage">
          {{ this.errorMessage }}
          <template v-slot:action>
            <q-btn flat color="white" label="Stäng" @click="this.errorMessage=''" no-caps />
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
    async signUp () {
      this.signupLoading = true
      if (!this.emailRef.validate()) {
        console.log('Invalid email')
        this.signupWarning = 'Vänligen fyll i en korrekt epost-adress.'
        this.signupLoading = false
        return
      }
      if (!this.usernameRef.validate()) {
        console.log('Invalid username')
        this.signupWarning = 'Vänligen fyll i en korrekt användarnamn.'
        this.signupLoading = false
        return
      }
      if (!this.passwordRef.validate()) {
        console.log('Invalid password')
        this.signupWarning = 'Vänligen fyll i ett bra lösenord.'
        this.signupLoading = false
        return
      }
      if (!this.termsAccepted) {
        console.log('Terms not accepted')
        this.signupWarning = 'Vänligen läs och godkänn vilkoren.'
        this.signupLoading = false
        return
      }
      const registerSuccess = await parseUtil.signUp(this.email, this.username, this.password, this.termsAccepted)
      this.signupLoading = false
      console.log(registerSuccess)
      if (registerSuccess.success) {
        this.$router.push('/login')
      } else {
        this.errorMessage = 'Ursäkta, men någonting gick fel med att skapa ett konto. Gärna försök en gång till eller ta kontakt med oss. Felkod: ' + registerSuccess.error?.message
      }
    }
  },
  setup () {
    const emailRef = ref(null)
    const usernameRef = ref(null)
    const passwordRef = ref(null)
    return {
      email: ref(''),
      password: ref(''),
      termsAccepted: ref(false),
      testPattern: {
        // eslint-disable-next-line
        email: v => /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(v) || 'Vänligen dubbelkolla din e-post',
      },
      signupLoading: ref(false),
      errorMessage: ref(''),
      signupWarning: ref(''),
      emailRef,
      usernameRef,
      passwordRef,
      showTerms: ref(false),
      showPasswordTooltip: ref(false)
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
.q-item__label {
  font-weight: bold;
}
</style>

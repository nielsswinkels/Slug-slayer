<template>
  <q-page>
    <div>
      <h1>Logging out..</h1>
    </div>
  </q-page>
</template>

<script>
import parseUtil from 'src/js/parseUtil'

export default {
  name: 'PageIndex',

  components: {
  },

  computed: {
    // ...mapState(['photos', 'response', 'hasError', 'errorMsg']),
  },
  methods: {
    async logOut () {
      const logoutSuccess = await parseUtil.logOut()
      console.log(logoutSuccess)
      if (logoutSuccess.success) {
        this.$router.push('/login')
      } else {
        console.error('Failed to log out. ' + logoutSuccess.error?.message)
      }
    }
  },
  setup () {
    return {
    }
  },
  mounted () {
    this.logOut()
  }
}
</script>

<style scoped>

</style>

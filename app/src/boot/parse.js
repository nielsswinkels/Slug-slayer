import { boot } from 'quasar/wrappers'
import parse from 'parse'

export default boot(({ app }) => {
  const parse = require('parse')
  parse.serverURL = process.env.PARSE_URL
  parse.liveQueryServerURL = 'wss://' + process.env.PARSE_BACK4APP_SUBDOMAIN
  parse.initialize(
    process.env.PARSE_APPLICATION_ID,
    process.env.PARSE_JS_KEY,
    process.env.PARSE_KEY
  )
  app.config.globalProperties.$parse = parse
})

export { parse }

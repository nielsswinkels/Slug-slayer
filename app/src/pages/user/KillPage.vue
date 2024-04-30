<template>
  <q-page class="row items-evenly justify-evenly">
    <div
      class="col-10 column items-center justify-center"
    >
      <div class="col-shrink text-overline">
        Dags att mörda!
      </div>
      <div class="col-shrink">
        <div class="q-pa-md" style="max-width: 300px">
          <q-input filled v-model="date">
            <template v-slot:prepend>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                  <q-date v-model="date" mask="YYYY-MM-DD HH:mm">
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Close" color="primary" flat />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>

            <template v-slot:append>
              <q-icon name="access_time" class="cursor-pointer">
                <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                  <q-time v-model="date" mask="YYYY-MM-DD HH:mm" format24h>
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Close" color="primary" flat />
                    </div>
                  </q-time>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </div>
      </div>
      <div class="col-shrink text-h1">
        {{ killCount }}
      </div>
    </div>
    <q-page-sticky position="bottom-right" :offset="[50,50]">
      <div
        class="col row justify-between items-center"
      >
        <q-btn
          rounded
          size="md"
          label="Avbryt"
          color="negative"
          to="/user"
          class="q-ma-lg q-pa-lg"
        ></q-btn>
        <q-btn
          rounded
          size="md"
          label="Färdig"
          color="positive"
          @click="saveKillCount"
          class="q-ma-lg q-pa-lg"
        ></q-btn>
        <q-btn
          round
          size="lg"
          icon="remove"
          color="primary"
          @click="killCount=Math.max(0, killCount-1)"
          class="q-ma-lg q-pa-xl"
        ></q-btn>
        <q-btn
          round
          size="xl"
          icon="add"
          color="primary"
          @click="killCount++"
          class="q-ma-lg q-pa-xl"
        ></q-btn>
      </div>
    </q-page-sticky>
  </q-page>
</template>

<script lang="ts">
import parseUtil from 'src/js/parseUtil'
import { defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'IndexPage',
  components: {  },
  methods: {
    async saveKillCount () {
      console.log('FIXME implement save killcount')
      const savedKillCount = await parseUtil.saveKillCount(new Date(this.date), this.killCount)
      if (!savedKillCount) {
        console.error('Did not save the killcount! Now what we do?!')
      }
      this.$router.push('/user')
    }
  },
  setup() {
    const today = new Date()
    return {
      killCount: ref(0),
      date: ref(today.getFullYear()+'-'+(today.getMonth()+1).toString().padStart(2, '0')+'-'+today.getDate().toString().padStart(2, '0')+' '+today.getHours().toString().padStart(2, '0')+':'+today.getMinutes().toString().padStart(2, '0'))
    };
  }
});
</script>

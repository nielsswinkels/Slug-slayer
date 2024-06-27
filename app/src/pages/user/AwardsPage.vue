<template>
  <q-page class="column items-center justify-start">
    <div style="max-width: 800px">
      <h4>Utmärkelser</h4>
      <div
        class="row justify-between items-center "
      >
        <q-card
          v-for="receivedAward in receivedAwards"
          :key="receivedAward.award.name"
          class="col-12"
        >
          <q-card-section class="">
            <div class="text-h6">{{ receivedAward.award.name }}</div>
            <div class="text-subtitle2">Upplåst: {{ receivedAward.dateReceived.toLocaleDateString() }}</div>
          </q-card-section>
          
          <q-card-section class="flex flex-center"> 
            <q-avatar
              class="flex-center"
              size="20vw"
              :icon="receivedAward.award.icon"
              :text-color="receivedAward.award.color"
              :color="receivedAward.award.color2"
            />
            <!-- <q-icon :name="receivedAward.awardIcon" :color="receivedAward.awardColor"></q-icon> -->
          </q-card-section>
          <q-card-section>
            {{ receivedAward.award.description }}
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, ref, Ref } from 'vue';
import parse from 'parse'
import parseUtil from 'src/js/parseUtil'
import { WonAward } from '../../../../shared-types'

export default defineComponent({
  name: 'IndexPage',
  components: {  },
  setup() {
    let personalTotal: Ref<null | number> = ref(null)
    let receivedAwards: Ref<WonAward[]> = ref([])

    return {
      personalTotal,
      receivedAwards,
      currentUser: ref(parse.User.current())
    };
  },
  async mounted () {
    if (this.currentUser) {
      this.receivedAwards = await parseUtil.getAwardsForUser(this.currentUser)
    }
  }
});
</script>

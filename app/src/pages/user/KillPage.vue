<template>
  <q-page class="column justify-evenly items-evenly">
    <div class="col-shrink row justify-center items-center text-overline">
      Dags att mörda!
    </div>
    <div
      class="col-shrink row justify-center items-center "
    >
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
    <div class="col row justify-center items-center text-h1">
      <template v-if="!isSaving">
          <q-input
            autocomplete="off"
            v-model.number="killCount"
            borderless
            type="number"
            class="text-h1 q-pa-none input-h1 no-spinners input-text-center"
            style="max-width: 400px; line-height: 2;"
          >
          </q-input>
      </template>
      <q-spinner v-if="isSaving"></q-spinner>
    </div>
    <div
      class="col-shrink row justify-evenly items-center q-my-md"
    >
      <div
        class="col-4 row justify-center"
      >
        <q-btn
          rounded
          size="md"
          label="Avbryt"
          color="negative"
          to="/user"
          class="q-pa-xl"
        ></q-btn>
      </div>
      <div
        class="col-4 row justify-center"
      >
        <q-btn
          rounded
          size="md"
          label="Färdig"
          color="positive"
          @click="saveKillCount"
          :disable="isSaving"
          class="q-pa-xl"
        ></q-btn>
      </div>
    </div>
    <div
      class="col-shrink row justify-evenly items-center q-my-md"
    >
      <div
        class="col-4 row justify-center"
      >
        <div>
          <q-btn
            round
            size="lg"
            icon="remove"
            color="primary"
            @click="killCount=Math.max(0, killCount-1)"
            class="q-pa-xl"
          ></q-btn>
        </div>
      </div>
      <div
        class="col-4 row justify-center"
      >
        <div>
          <q-btn
            round
            size="xl"
            icon="add"
            color="primary"
            @click="killCount++"
            class="q-pa-xl"
          ></q-btn>
        </div>
      </div>
    </div>
    <q-dialog
      v-model="showAwardDialog"
      backdrop-filter="brightness(60%)"
      @hide="$router.push('/user')"
      style="width:50vw"
      >
      <div
        class="row justify-between items-center q-gutter-sm q-px-md"
      >

        <q-card
          class="col-12 text-h4 q-pa-md"
        >
          Utmärkelse{{ (receivedAwards.length>1?'r':'') }} upplåst!
        </q-card>
        <q-card
          v-for="receivedAward in receivedAwards"
          :key="receivedAward.awardName"
          class="col-12"
        >
          <q-card-section class="row items-center q-pb-none text-h6">
            {{ receivedAward.awardName }}
            {{ receivedAward.dateReceived.toLocaleDateString() }}
          </q-card-section>
          
          <q-card-section class="flex flex-center"> 
            <q-avatar
              class="flex-center"
              size="20vw"
              :icon="receivedAward.awardIcon"
              :text-color="receivedAward.awardColor"
              :color="receivedAward.awardColor2"
            />
            <!-- <q-icon :name="receivedAward.awardIcon" :color="receivedAward.awardColor"></q-icon> -->
          </q-card-section>
          <q-card-section>
            {{ receivedAward.awardDescription }}
          </q-card-section>
        </q-card>
        <div class="col-12 row">
          <q-btn class="col-grow q-ma-md" label="Stäng" color="primary" v-close-popup />
        </div>
      </div>
    </q-dialog>
  </q-page>
</template>

<script lang="ts">
import parseUtil from 'src/js/parseUtil'
import parse from 'parse'
import { defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'IndexPage',
  components: {  },
  methods: {
    async saveKillCount () {
      this.isSaving = true
      if (this.killCount+'' === '' || this.killCount < 0) {
        this.killCount = 0
      }
      this.killCount = Math.round(this.killCount)
      const savedKillCount = await parseUtil.saveKillCount(new Date(this.date), this.killCount)
      if (!savedKillCount) {
        console.error('Did not save the killcount! Now what we do?!')
      }
      await this.checkForAwards();
      if (this.receivedAwards.length == 0) {
        this.$router.push('/user')
      } else {
        this.showAwardDialog = true
      }
      this.isSaving = false
    },
    async checkForAwards () {
      const currentUser = parse.User.current()
      const awardIdWhiteDeath = 'iV1oG5hKuT'
      if (!currentUser) {
        console.warn('Cant check for awards without current user!',currentUser)
        return
      }
      // check if user not already has award
      const thisYear = new Date().getFullYear()
      const foundAward = await parseUtil.getAwardForUser(currentUser, awardIdWhiteDeath, thisYear)
      if (foundAward !== null) {
        console.log('Found award', foundAward)
        return
      }
      // get first date for this user and year
      const firstSession = await parseUtil.getFirstKillForUserAndYear(currentUser, thisYear)
      if (!firstSession) {
        console.log('No first session found!', currentUser, thisYear)
        return
      }
      // if first date is less than 105 days from now
      if ((new Date().getTime() - firstSession.date.getTime()) / (1000 * 60 * 60 * 24) <= 105) {
        // get total
        const killTotal = await parseUtil.getTotalKillCountForUser(currentUser, thisYear)
        // if total >= 742
        if (killTotal >= 742) {
          // get award and save
          const giveAwardResult = await parseUtil.giveAwardToUser(currentUser, awardIdWhiteDeath)
          // show award and pause the redirect
          if (giveAwardResult !== null) {
            console.log('pushing received award', giveAwardResult, giveAwardResult.award)
            console.log('pushing received award', giveAwardResult.award.name)
            this.receivedAwards.push({
              'dateReceived': giveAwardResult.dateReceived,
              'year': giveAwardResult.year,
              'awardName': giveAwardResult.award.name,
              'awardDescription': giveAwardResult.award.description,
              'awardIcon': giveAwardResult.award.icon,
              'awardColor': giveAwardResult.award.color,
              'awardColor2': giveAwardResult.award.color2,
            })
          }
        } else {
          console.log('not high enough killcount')
        }
      } else {
        console.log('too many days have passed', firstSession.date.getTime())
      }
    }
  },
  setup() {
    const today = new Date()
    return {
      killCount: ref(0),
      isSaving: ref(false),
      date: ref(today.getFullYear()+'-'+(today.getMonth()+1).toString().padStart(2, '0')+'-'+today.getDate().toString().padStart(2, '0')+' '+today.getHours().toString().padStart(2, '0')+':'+today.getMinutes().toString().padStart(2, '0')),
      receivedAwards: ref([] as {
        dateReceived: Date;
        year: number;
        awardName: string;
        awardDescription: string;
        awardIcon: string;
        awardColor: string;
        awardColor2: string;
      }[]),
      showAwardDialog: ref(false)
    };
  }
});
</script>

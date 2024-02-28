<template>
  <q-page class="row items-center justify-center">
    <div
      class="col-10 column justify-start items-start"
    >
      <div
        class="col-12 column justify-start items-start"
      >
        <h2 class="col q-ma-none">
          Välkommen till
        </h2>
        <h1 class="col q-mt-none">
          Snigelkampen!
        </h1>
      </div>
      <div
        class="col-12 row justify-between items-center"
      >
        <p class="col-7 text-body1">
          Välkommen till Snigeldödarnas arena - där varje snigel är en utmaning och varje seger ett triumf! Är du redo att anta den ultimata jakten? Gör dig redo att tävla mot andra snigelkrigare och bevisa din skicklighet i att utrota dessa trädgårdsterrorister. Gå med oss idag och låt oss tillsammans göra världen en snigel mindre!
        </p>
        <div class="col-4 row justify-end">
          <q-btn
            label="Gå med!"
            to="/register"
            size="xl"
            rounded
            color="primary"
            class="q-py-lg q-px-xl"
            style="transform: rotate(8deg)"
          ></q-btn>
        </div>
      </div>
    </div>

  </q-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'IndexPage',
  components: { },
  setup() {
    return {};
  }
});
</script>

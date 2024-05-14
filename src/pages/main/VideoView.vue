<template>
  <q-card bordered class="q-pa-sm">
    <q-carousel animated v-model="slide" infinite>
      <q-carousel-slide name="soft-jazz">
        <q-video class="absolute-full" src="https://www.youtube.com/embed/k3_tw44QsZQ" />
      </q-carousel-slide>

      <q-carousel-slide name="Rihanna">
        <q-video class="absolute-full" src="https://www.youtube.com/embed/kOkQ4T5WO9E" />
      </q-carousel-slide>

      <q-carousel-slide name="cobol">
        <q-video class="absolute-full" src="https://www.youtube.com/embed/MqJ3xpi4xak" />
      </q-carousel-slide>
    </q-carousel>

    <div class="row justify-center">
      <q-btn-toggle
        glossy
        v-model="slide"
        :options="[
          { label: 'Soft Jazz', value: 'soft-jazz' },
          { label: 'Rihanna', value: 'Rihanna' },
          { label: 'MicroFocus', value: 'cobol' },
        ]"
      />
    </div>
  </q-card>
</template>

<script setup>
import { ref } from 'vue';

const slide = ref('Rihanna');
</script>

<style scoped lang="sass"></style>

<template>
  <q-card bordered class="q-pa-xs">
    <q-bar class="q-py-xs text-subtitle1 text-bold">
      수주현황 <span class="text-subtitle1 text-bold text-blue q-px-sm">(2023년)</span>
      <q-space />
      <q-btn
        rounded
        dense
        size="0.6rem"
        class="q-pa-xs"
        color="secondary"
        @click="toggle"
        :icon="$q.fullscreen.isActive ? 'fullscreen_exit' : 'fullscreen'"
      >
        <q-tooltip class="bg-amber text-black" anchor="center left" self="center right">
          <q-icon name="open_in_full" size="0.8rem" />
          <strong v-if="$q.fullscreen.isActive"> 돌아가기 </strong>
          <strong v-else> 전체화면 </strong>
        </q-tooltip>
      </q-btn>
    </q-bar>
    <ag-charts-vue :options="options" />
    <q-separator spaced />
    <div class="q-px-xl">
      <q-range
        class="q-mt-xl"
        v-model="yearModel"
        color="orange-5"
        label-always
        markers
        :marker-labels="objYearMarkerLabel"
        :min="2020"
        :max="2024"
      ></q-range>
      <q-range
        class="q-mt-xl"
        v-model="firstModel"
        color="orange-5"
        label-always
        markers
        :marker-labels="objMarkerLabel"
        :min="1"
        :max="12"
      ></q-range>
    </div>
  </q-card>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { AgChartsVue } from 'ag-charts-vue3';
import { QIcon, useQuasar } from 'quasar';

const $q = useQuasar();
const options = {
  title: {
    text: '년간 출고수량 현황',
  },
  subtitle: {
    text: '[ 단위 : Drum ]',
  },
  data: getData(),
  series: [
    {
      type: 'line',
      xKey: 'month',
      yKey: 'petrol',
      yName: '무연',
    },
    {
      type: 'line',
      xKey: 'month',
      yKey: 'diesel',
      yName: '경유',
    },
    {
      type: 'line',
      xKey: 'month',
      yKey: 'kerosene',
      yName: '등유',
    },
    {
      type: 'line',
      xKey: 'month',
      yKey: 'gas',
      yName: '가스',
    },
  ],
};

function getData() {
  return [
    {
      month: '1월',
      petrol: 450,
      diesel: 250,
      kerosene: 80,
      gas: 280,
    },
    {
      month: '2월',
      petrol: 460,
      diesel: 230,
      kerosene: 60,
      gas: 220,
    },
    {
      month: '3월',
      petrol: 430,
      diesel: 260,
      kerosene: 75,
      gas: 240,
    },
    {
      month: '4월',
      petrol: 420,
      diesel: 300,
      kerosene: 85,
      gas: 220,
    },
    {
      month: '5월',
      petrol: 440,
      diesel: 340,
      kerosene: 76,
      gas: 235,
    },
    {
      month: '6월',
      petrol: 450,
      diesel: 320,
      kerosene: 90,
      gas: 230,
    },
    {
      month: '7월',
      petrol: 500,
      diesel: 310,
      kerosene: 100,
      gas: 250,
    },
    {
      month: '8월',
      petrol: 470,
      diesel: 370,
      kerosene: 75,
      gas: 180,
    },
    {
      month: '9월',
      petrol: 480,
      diesel: 380,
      kerosene: 90,
      gas: 200,
    },
    {
      month: '10월',
      petrol: 430,
      diesel: 390,
      kerosene: 80,
      gas: 210,
    },
    {
      month: '11월',
      petrol: 450,
      diesel: 350,
      kerosene: 50,
      gas: 240,
    },
    {
      month: '12월',
      petrol: 410,
      diesel: 360,
      kerosene: 80,
      gas: 230,
    },
  ];
}

const yearModel = ref({
  min: 2020,
  max: 2024,
});
const firstModel = ref({
  min: 3,
  max: 10,
});
const objYearMarkerLabel = {
  2020: '2020',
  2021: '2021',
  2022: '2022',
  2023: '2023',
  2024: '2024',
};
const objMarkerLabel = {
  1: 'Jan',
  2: 'Feb',
  3: 'Mar',
  4: 'Apr',
  5: 'May',
  6: 'Jun',
  7: 'Jul',
  8: 'Aug',
  9: 'Sep',
  10: 'Oct',
  11: 'Nov',
  12: 'Dec',
};
const toggle = e => {
  const target = e.target.parentNode.parentNode.parentNode.parentNode.parentNode;

  $q.fullscreen
    .toggle(target)
    .then(() => {
      // success!
    })
    .catch(err => {
      alert(err);
      // uh, oh, error!!
      // console.error(err)
    });
};
</script>

<style scoped lang="sass"></style>

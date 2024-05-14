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
    text: '년간 매출실적 현황',
  },
  subtitle: {
    text: '[ 단위 : 백만원 ]',
  },
  data: getData(),
  series: [
    {
      type: 'bar',
      xKey: 'month',
      yKey: 'petrol',
      yName: '무연',
    },
    {
      type: 'bar',
      xKey: 'month',
      yKey: 'diesel',
      yName: '경유',
    },
    {
      type: 'bar',
      xKey: 'month',
      yKey: 'kerosene',
      yName: '등유',
    },
    {
      type: 'bar',
      xKey: 'month',
      yKey: 'gas',
      yName: '가스',
    },
  ],
};

function getData() {
  return [
    {
      month: '2020년',
      petrol: 394000,
      diesel: 240000,
      kerosene: 55000,
      gas: 150000,
    },
    {
      month: '2021년',
      petrol: 320000,
      diesel: 220000,
      kerosene: 65000,
      gas: 180000,
    },
    {
      month: '2022년',
      petrol: 360000,
      diesel: 280000,
      kerosene: 55000,
      gas: 210000,
    },
    {
      month: '2023년',
      petrol: 370000,
      diesel: 250000,
      kerosene: 50000,
      gas: 220000,
    },
    {
      month: '2024년',
      petrol: 350000,
      diesel: 210000,
      kerosene: 40000,
      gas: 125000,
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

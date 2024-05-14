<template>
  <q-card bordered class="q-pa-xs" style="height: 100%">
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

    <canvas ref="MyChart"></canvas>

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
import { Chart, registerables } from 'chart.js';
import { QIcon, useQuasar } from 'quasar';
const $q = useQuasar();

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
Chart.register(...registerables);

const type = 'bar';
const data = {
  labels: ['영업1팀', '영업2팀', '영업3팀', '영업4팀', '영업5팀', '영업6팀'],
  datasets: [
    {
      label: '수주목표',
      data: [1200, 1900, 300, 500, 200, 300],
      backgroundColor: ['rgba(255, 99, 132, 0.3)'],
      borderColor: ['rgba(255, 99, 132, 1)'],
      borderWidth: 1,
    },
    {
      label: '수주실적',
      data: [1300, 1600, 500, 700, 300, 600],
      backgroundColor: ['rgba(54, 162, 235, 0.3)'],
      borderColor: ['rgba(54, 162, 235, 1)'],
      borderWidth: 1,
    },
  ],
};
const options = {
  layout: {
    padding: {
      left: 20,
      right: 20,
      top: 0,
      bottom: 0,
    },
  },
  scales: {
    y: {
      beginAtZero: true,
    },
  },
  plugins: {
    legend: {
      position: 'top',
    },
    title: {
      display: false,
      text: '수주형황',
    },
  },
};

const MyChart = ref(null);
const chart = ref(null);

onMounted(() => {
  createChart();
});

const createChart = () => {
  chart.value = new Chart(MyChart.value, {
    type: type,
    data: data,
    options: options,
  });
};

const updateChart = () => {
  // Modify chart data
  chart.value.data.datasets[0].data = [10, 15, 7, 8, 4, 6];
  // Update the chart
  chart.value.update();
};

const toggle = e => {
  const target = e.target.parentNode.parentNode.parentNode.parentNode;

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

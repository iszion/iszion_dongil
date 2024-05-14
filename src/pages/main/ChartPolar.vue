<template>
  <q-card bordered class="q-pa-xs" style="height: 100%">
    <q-bar class="q-py-xs text-subtitle1 text-bold">
      공사분포도 <span class="text-subtitle1 text-bold text-blue q-px-sm">(2023년)</span>
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
        <q-tooltip class="bg-amber text-black shadow-4" anchor="center left" self="center right">
          <q-icon name="open_in_full" size="0.8rem" />
          <strong v-if="$q.fullscreen.isActive"> 돌아가기 </strong>
          <strong v-else> 전체화면 </strong>
        </q-tooltip>
      </q-btn>
    </q-bar>
    <canvas ref="MyChart"></canvas>
  </q-card>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { Chart, registerables } from 'chart.js';
import { QIcon, useQuasar } from 'quasar';
const $q = useQuasar();

Chart.register(...registerables);

const DATA_COUNT = 5;
const NUMBER_CFG = { count: DATA_COUNT, min: 0, max: 100 };

const type = 'polarArea';
const labels = ['서울', '수도', '부산', '충청', '경상', '전라', '제주'];
const data = {
  labels: labels,
  datasets: [
    {
      label: 'Dataset 1',
      data: [85, 90, 65, 40, 75, 65, 40],
      backgroundColor: [
        'rgba(255, 99, 132, 0.3)',
        'rgba(255, 159, 64, 0.3)',
        'rgba(255, 205, 86, 0.3)',
        'rgba(75, 192, 192, 0.3)',
        'rgba(54, 162, 235, 0.3)',
        'rgba(153, 102, 255, 0.3)',
        'rgba(201, 203, 207, 0.3)',
      ],
    },
  ],
};
const options = {
  responsive: true,
  scales: {
    r: {
      pointLabels: {
        display: true,
        centerPointLabels: true,
        font: {
          size: 12,
        },
      },
    },
  },
  plugins: {
    legend: {
      position: 'right',
    },
    title: {
      display: true,
      text: '지역별 공사진행 분포도',
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

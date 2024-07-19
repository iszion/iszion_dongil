<template>
  <q-card bordered class="q-pa-xs">
    <q-bar class="q-py-xs text-subtitle1 text-bold">
      역량평가 진행율
      <q-space />
    </q-bar>
    <q-separator />
    <q-card-section class="q-py-sm q-px-none">
      <div class="row q-pa-xs">
        <apexchart
          class="col-6"
          type="radialBar"
          :height="$q.screen.xs ? '180' : '280'"
          :options="getChartOptions('1차역량 진행율', isXsScreen)"
          :series="series1"
        ></apexchart>
        <apexchart
          class="col-6"
          type="radialBar"
          :height="$q.screen.xs ? '180' : '280'"
          :options="getChartOptions('2차역량 진행율', isXsScreen)"
          :series="series2"
        ></apexchart>
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useQuasar } from 'quasar';

const series1 = ref([60]);
const series2 = ref([20]);
const series3 = ref([0]);
const $q = useQuasar();
const isXsScreen = ref($q.screen.lt.sm);

watch(
  () => $q.screen.lt.sm,
  newVal => {
    isXsScreen.value = newVal;
  },
);

const getChartOptions = (label, isXs) => ({
  chart: {
    height: isXs ? 180 : 280,
    type: 'radialBar',
    offsetY: -10,
  },
  plotOptions: {
    radialBar: {
      startAngle: -130,
      endAngle: 130,
      dataLabels: {
        name: {
          fontSize: isXs ? '15px' : '25px',
          color: undefined,
          offsetY: 120,
        },
        value: {
          offsetY: 76,
          fontSize: isXs ? '20px' : '30px',
          color: undefined,
          formatter: function (val) {
            return val + '%';
          },
        },
      },
    },
  },
  fill: {
    type: 'gradient',
    gradient: {
      shade: 'dark',
      shadeIntensity: 0.15,
      inverseColors: false,
      opacityFrom: 1,
      opacityTo: 1,
      stops: [0, 50, 65, 91],
    },
  },
  stroke: {
    dashArray: 4,
  },
  labels: [label],
});
</script>

<style scoped>
.full-width-chart {
  width: 100%;
}
</style>

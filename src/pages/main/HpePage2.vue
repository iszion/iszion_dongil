<template>
  <q-card bordered class="q-pa-xs">
    <q-bar class="q-py-xs text-subtitle1 text-bold">
      목표/성과 관리
      <q-space />
      <q-avatar size="sm" color="primary" text-color="white"><q-icon name="edit_note" size="1rem" /></q-avatar>
    </q-bar>
    <q-separator />
    <q-card-section class="q-py-sm q-px-none">
      <div class="row">
        <q-space />
        <div class="col-3">
          <apexchart type="radialBar" height="180" :options="chartOptions" :series="series"></apexchart>
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { ref } from 'vue';
const series = ref([50]);
const chartOptions = ref({
  chart: {
    height: 180,
    type: 'radialBar',
    offsetY: -10,
  },
  plotOptions: {
    radialBar: {
      startAngle: -135,
      endAngle: 135,
      dataLabels: {
        name: {
          fontSize: '16px',
          color: undefined,
          offsetY: 120,
        },
        value: {
          offsetY: 76,
          fontSize: '22px',
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
  labels: ['Median Ratio'],
});
</script>

<style scoped>
.full-width-chart {
  width: 100%;
}
</style>

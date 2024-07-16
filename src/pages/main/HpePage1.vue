<template>
  <q-card bordered class="q-pa-xs">
    <q-bar class="q-py-xs text-subtitle1 text-bold">
      평가순위표 ( 상위10위 )
      <q-space />
    </q-bar>
    <q-separator />
    <q-card-section class="q-py-sm q-px-none">
      <apexchart type="bar" height="280" :options="chartOptions" :series="series"></apexchart>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { ref } from 'vue';

const chartOptions = ref({
  chart: {
    type: 'bar',
    height: 350,
    stacked: true,
    toolbar: {
      show: true,
    },
    zoom: {
      enabled: true,
    },
  },
  responsive: [
    {
      breakpoint: 480,
      options: {
        legend: {
          position: 'bottom',
          offsetX: -10,
          offsetY: 0,
        },
      },
    },
  ],
  plotOptions: {
    bar: {
      horizontal: false,
      borderRadius: 10,
      borderRadiusApplication: 'end', // 'around', 'end'
      borderRadiusWhenStacked: 'last', // 'all', 'last'
      dataLabels: {
        total: {
          enabled: true,
          style: {
            fontSize: '13px',
            fontWeight: 900,
          },
        },
      },
    },
  },
  dataLabels: {
    enabled: true,
    formatter: function (val) {
      return val.toFixed(1); // format to one decimal place
    },
    style: {
      fontSize: '12px',
    },
  },
  xaxis: {
    // type: 'datetime',
    categories: ['1.홍길동', '2.김길동', '3.이길동', '4.박길동', '5.차길동', '6.최길동', '7.조길동', '8.문길동', '9.채길동', '10.엄길동'],
  },
  legend: {
    position: 'right',
    offsetY: 40,
  },
  fill: {
    opacity: 1,
  },
});

const series = ref([
  {
    name: '역량평가',
    data: [34.3, 42.2, 35.1, 45.0, 36.3, 37.6, 39.6, 35.4, 36.0, 30.4],
  },
  {
    name: '성과평가',
    data: [65.2, 55.4, 61.2, 50.5, 58.2, 55.3, 50.3, 53.6, 49.4, 54.3],
  },
]);
</script>

<style scoped>
.full-width-chart {
  width: 100%;
}
</style>

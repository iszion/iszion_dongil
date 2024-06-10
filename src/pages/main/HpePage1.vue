<template>
  <q-card bordered class="q-pa-xs"
    >Ï
    <q-bar class="q-py-xs text-subtitle1 text-bold">
      목표/성과 관리
      <q-space />
      <q-avatar size="sm" color="primary" text-color="white"><q-icon name="edit_note" size="1rem" /></q-avatar>
    </q-bar>
    <q-separator />
    <q-card-section class="q-py-sm q-px-none">
      <apexchart type="bar" height="350" :options="chartOptions" :series="series"></apexchart>
    </q-card-section>
  </q-card>
</template>

<script>
export default {
  data() {
    return {
      chartOptions: {
        chart: {
          id: 'vuechart-example',
        },
        xaxis: {
          categories: [2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
        },
      },
      series: [
        {
          name: 'series-1',
          data: [30, 40, 35, 50, 49, 60, 70, 91, 125],
        },
      ],
    };
  },
};
</script>

<style scoped>
.full-width-chart {
  width: 100%;
}
</style>

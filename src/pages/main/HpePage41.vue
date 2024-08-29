<template>
  <q-card bordered class="q-pa-xs">
    <q-bar class="q-py-xs text-subtitle1 text-bold">
      평가대상자(일반직)
      <q-space />
    </q-bar>
    <q-separator />
    <q-card-section class="q-py-sm q-px-none">
      <div class="row q-pa-xs q-col-gutter-x-lg">
        <apexchart
          class="col-xs-12 col-sm-12 col-md-5"
          type="line"
          :height="$q.screen.xs ? '180' : '280'"
          :options="getChartOptions('일반직', label1, isXsScreen)"
          :series="series1"
        ></apexchart>
        <apexchart
          class="col-xs-12 col-sm-12 col-md-7"
          type="line"
          :height="$q.screen.xs ? '180' : '280'"
          :options="getChartOptions('전문직', label2, isXsScreen)"
          :series="series2"
        ></apexchart>
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { onBeforeMount, ref, watch } from 'vue';
import { useQuasar } from 'quasar';
import { api } from 'boot/axios';
import { useUserInfoStore } from 'src/store/setUserInfo';
import { useYearInfoStore } from 'src/store/setYearInfo';
const storeUser = useUserInfoStore();
const storeYear = useYearInfoStore();

const $q = useQuasar();
const isXsScreen = ref($q.screen.lt.sm);

watch(
  () => $q.screen.lt.sm,
  newVal => {
    isXsScreen.value = newVal;
  },
);

const getChartOptions = (title, label, isXs) => ({
  chart: {
    height: 280,
    type: 'line',
    toolbar: {
      show: false, // Disable the toolbar to remove zoom and pan buttons
    },
  },
  stroke: {
    width: [0, 4],
  },
  title: {
    text: title,
  },
  dataLabels: {
    enabled: true,
    enabledOnSeries: [1],
  },
  labels: label,
  yaxis: [],
  plotOptions: {
    bar: {
      columnWidth: '40%', // 막대의 너비를 설정하는 부분
    },
  },
  legend: {
    show: false, // This line hides the legend
  },
});
const label1 = ref(['M1', 'M2', 'M3', 'J', 'A1', 'A2']);
const label2 = ref(['SM1(A)', 'SM1(B)', 'M3', 'J', 'A1', 'A2']);
const series1 = ref([
  {
    name: '',
    type: 'column',
    data: [],
  },
  {
    name: '',
    type: 'line',
    data: [],
  },
]);

const series2 = ref([
  {
    name: '',
    type: 'column',
    data: [],
  },
  {
    name: '',
    type: 'line',
    data: [],
  },
]);

onBeforeMount(async () => {
  try {
    const data = await fetchData('/api/aux/dashboard_page41_list');
    if (data) {
      console.log('data :: ', JSON.stringify(data));
      for (let i = 0; i < data.length; i++) {
        if (data[i].titlCd.substring(0, 1) === '1') {
          series1.value[0].data.push(data[i].hrCnt);
          series1.value[1].data.push(data[i].hrCnt);
          label1.value.push(data[i].titlNm);
        } else {
          series2.value[0].data.push(data[i].hrCnt);
          series2.value[1].data.push(data[i].hrCnt);
          label2.value.push(data[i].titlNm);
        }
      }
    }
  } catch (error) {
    console.error('Error initializing data:', error);
  }
});
// **************************************************************//
// ***** DataBase 연결부분    *************************************//
// **************************************************************//

// ***** 목표진행율 가져오기 부분  *****************************//
const fetchData = async endpoint => {
  try {
    const response = await api.post(endpoint, {
      paramSetYear: storeYear.setYear,
    });
    const data = response.data.data;
    console.log('data :: ', JSON.stringify(data));
    return data;
  } catch (error) {
    console.error(`Error fetching data from ${endpoint}:`, error);
    return [0]; // Return a default value to prevent the chart from breaking
  }
};
</script>

<style scoped>
.full-width-chart {
  width: 100%;
}
</style>

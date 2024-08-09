<template>
  <q-page class="q-pa-xs-xs q-pa-sm-md" :style-fn="myTweak">
    <q-card class="q-pa-sm">
      <q-bar class="q-px-sm">
        <q-icon name="list_alt" />
        <span class="q-px-sm text-bold text-subtitle1" :class="$q.dark.isActive ? 'text-orange' : 'text-primary'">{{ menuLabel }}</span>
        <q-space />
      </q-bar>

      <div class="">
        <q-card class="q-pa-sm">
          <q-toolbar class="row q-px-none q-pt-none">
            <q-space />
            <div class="row q-gutter-x-xs">
              <q-btn outline color="grey" @click="getData" class="q-px-sm">
                <q-icon name="search" size="xs" class="q-mr-xs" />
                조회
              </q-btn>

              <q-btn :disable="rowData.rows.length === 0" outline color="teal" @click="isDialogVisible = true" class="q-px-sm">
                <q-icon name="download" size="xs" class="q-mr-xs" />
                엑셀/출력
              </q-btn>
            </div>
          </q-toolbar>
          <q-separator />
          <q-card class="q-mt-sm">
            <div id="printZoneHeader">
              <div class="row q-px-xs">
                <span class="text-h6">{{ storeYear.setYear }}년 인사평가 결과</span>
                <q-space />
              </div>

              <table>
                <tr>
                  <th rowspan="2" colspan="1">평가집단</th>
                  <th rowspan="1" colspan="6">일반직</th>
                  <th rowspan="1" colspan="1">별정직</th>
                  <th rowspan="1" colspan="9">판매전문직</th>
                  <th rowspan="2" colspan="1">합계</th>
                </tr>
                <tr>
                  <th v-for="(data, index) in titlNmTable" :key="index">{{ data }}</th>
                </tr>

                <tr>
                  <td :style="$q.dark.isActive ? 'background-color: #333333' : 'background-color: #f0f0f0'">팀장</td>
                  <td v-for="(data, index) in viewData1" :key="index">{{ data }}</td>
                </tr>
                <tr>
                  <td :style="$q.dark.isActive ? 'background-color: #333333' : 'background-color: #f0f0f0'">소장</td>
                  <td v-for="(data, index) in viewData2" :key="index">{{ data }}</td>
                </tr>
                <tr>
                  <td :style="$q.dark.isActive ? 'background-color: #333333' : 'background-color: #f0f0f0'">팀원</td>
                  <td v-for="(data, index) in viewData3" :key="index">{{ data }}</td>
                </tr>
                <tr :style="$q.dark.isActive ? 'background-color: #333333' : 'background-color: #f0f0f0'">
                  <td>합계</td>
                  <td v-for="(data, index) in viewData9" :key="index">{{ data }}</td>
                </tr>
              </table>
            </div>
          </q-card>
        </q-card>
      </div>
      <q-separator />
      <q-card>
        <div class="q-pa-sm">
          <q-carousel
            v-model="slide"
            swipeable
            animated
            padding
            arrows
            :control-color="$q.dark.isActive ? 'white' : 'dark'"
            navigation
            navigation-icon="radio_button_unchecked"
            :style="contentBottomZoneStyle"
            class="rounded-borders"
            :class="$q.dark.isActive ? 'bg-grey-9 text-white' : 'bg-grey-3 text-dark'"
            @before-transition="beforeSlideChange"
          >
            <q-carousel-slide name="05" class="text-center">
              <q-scroll-area class="fit">
                <q-icon name="style" size="sm" />
                <span class="text-h6 text-bold q-ml-sm">
                  [ <span :class="$q.dark.isActive ? 'text-orange' : 'text-teal'">{{ activeSlideTitle }}</span>
                  ] 인사평가결과
                </span>
                <q-separator class="q-my-sm" color="grey" />
                <div :style="contentZoneStyle">
                  <ag-grid-vue
                    style="width: 100%; height: 100%"
                    :class="$q.dark.isActive ? 'ag-theme-alpine-dark' : 'ag-theme-alpine'"
                    :columnDefs="columnDefs.team"
                    :rowData="rowData.team"
                    :defaultColDef="defaultColDef.team"
                    @grid-ready="onGridReadyTeam"
                    :grid-options="gridOptions"
                  >
                  </ag-grid-vue>
                </div>
              </q-scroll-area>
            </q-carousel-slide>

            <q-carousel-slide name="06" class="text-center">
              <q-scroll-area class="fit">
                <q-icon name="style" size="sm" />
                <span class="text-h6 text-bold q-ml-sm">
                  [ <span :class="$q.dark.isActive ? 'text-orange' : 'text-teal'">{{ activeSlideTitle }}</span>
                  ] 인사평가결과
                </span>
                <q-separator class="q-my-sm" color="grey" />
                <div :style="contentZoneStyle">
                  <ag-grid-vue
                    style="width: 100%; height: 100%"
                    :class="$q.dark.isActive ? 'ag-theme-alpine-dark' : 'ag-theme-alpine'"
                    :columnDefs="columnDefs.team"
                    :rowData="rowData.team"
                    :defaultColDef="defaultColDef.team"
                    @grid-ready="onGridReadyTeam"
                    :grid-options="gridOptions"
                  >
                  </ag-grid-vue>
                </div>
              </q-scroll-area>
            </q-carousel-slide>

            <q-carousel-slide name="07" class="text-center">
              <q-scroll-area class="fit">
                <q-icon name="style" size="sm" />
                <span class="text-h6 text-bold q-ml-sm">
                  [ <span :class="$q.dark.isActive ? 'text-orange' : 'text-teal'">{{ activeSlideTitle }}</span>
                  ] 인사평가결과
                </span>
                <q-separator class="q-my-sm" color="grey" />
                <div :style="contentZoneStyle">
                  <ag-grid-vue
                    style="width: 100%; height: 100%"
                    :class="$q.dark.isActive ? 'ag-theme-alpine-dark' : 'ag-theme-alpine'"
                    :columnDefs="columnDefs.team"
                    :rowData="rowData.team"
                    :defaultColDef="defaultColDef.team"
                    @grid-ready="onGridReadyTeam"
                    :grid-options="gridOptions"
                  >
                  </ag-grid-vue>
                </div>
              </q-scroll-area>
            </q-carousel-slide>

            <q-carousel-slide name="08" class="text-center">
              <q-scroll-area class="fit">
                <q-icon name="style" size="sm" />
                <span class="text-h6 text-bold q-ml-sm">
                  [ <span :class="$q.dark.isActive ? 'text-orange' : 'text-teal'">{{ activeSlideTitle }}</span>
                  ] 인사평가결과
                </span>
                <q-separator class="q-my-sm" color="grey" />
                <div :style="contentZoneStyle">
                  <ag-grid-vue
                    style="width: 100%; height: 100%"
                    :class="$q.dark.isActive ? 'ag-theme-alpine-dark' : 'ag-theme-alpine'"
                    :columnDefs="columnDefs.team"
                    :rowData="rowData.team"
                    :defaultColDef="defaultColDef.team"
                    @grid-ready="onGridReadyTeam"
                    :grid-options="gridOptions"
                  >
                  </ag-grid-vue>
                </div>
              </q-scroll-area>
            </q-carousel-slide>

            <q-carousel-slide name="09" class="text-center">
              <q-scroll-area class="fit">
                <q-icon name="style" size="sm" />
                <span class="text-h6 text-bold q-ml-sm">
                  [ <span :class="$q.dark.isActive ? 'text-orange' : 'text-teal'">{{ activeSlideTitle }}</span>
                  ] 인사평가결과
                </span>
                <q-separator class="q-my-sm" color="grey" />
                <div :style="contentZoneStyle">
                  <ag-grid-vue
                    style="width: 100%; height: 100%"
                    :class="$q.dark.isActive ? 'ag-theme-alpine-dark' : 'ag-theme-alpine'"
                    :columnDefs="columnDefs.team"
                    :rowData="rowData.team"
                    :defaultColDef="defaultColDef.team"
                    @grid-ready="onGridReadyTeam"
                    :grid-options="gridOptions"
                  >
                  </ag-grid-vue>
                </div>
              </q-scroll-area>
            </q-carousel-slide>

            <q-carousel-slide name="10" class="text-center">
              <q-scroll-area class="fit">
                <q-icon name="style" size="sm" />
                <span class="text-h6 text-bold q-ml-sm">
                  [ <span :class="$q.dark.isActive ? 'text-orange' : 'text-teal'">{{ activeSlideTitle }}</span>
                  ] 인사평가결과
                </span>
                <q-separator class="q-my-sm" color="grey" />
                <div :style="contentZoneStyle">
                  <ag-grid-vue
                    style="width: 100%; height: 100%"
                    :class="$q.dark.isActive ? 'ag-theme-alpine-dark' : 'ag-theme-alpine'"
                    :columnDefs="columnDefs.team"
                    :rowData="rowData.team"
                    :defaultColDef="defaultColDef.team"
                    @grid-ready="onGridReadyTeam"
                    :grid-options="gridOptions"
                  >
                  </ag-grid-vue>
                </div>
              </q-scroll-area>
            </q-carousel-slide>

            <q-carousel-slide name="11" class="text-center">
              <q-scroll-area class="fit">
                <q-icon name="style" size="sm" />
                <span class="text-h6 text-bold q-ml-sm">
                  [ <span :class="$q.dark.isActive ? 'text-orange' : 'text-teal'">{{ activeSlideTitle }}</span>
                  ] 인사평가결과
                </span>
                <q-separator class="q-my-sm" color="grey" />
                <div :style="contentZoneStyle">
                  <ag-grid-vue
                    style="width: 100%; height: 100%"
                    :class="$q.dark.isActive ? 'ag-theme-alpine-dark' : 'ag-theme-alpine'"
                    :columnDefs="columnDefs.team"
                    :rowData="rowData.team"
                    :defaultColDef="defaultColDef.team"
                    @grid-ready="onGridReadyTeam"
                    :grid-options="gridOptions"
                  >
                  </ag-grid-vue>
                </div>
              </q-scroll-area>
            </q-carousel-slide>

            <q-carousel-slide name="12" class="text-center">
              <q-scroll-area class="fit">
                <q-icon name="style" size="sm" />
                <span class="text-h6 text-bold q-ml-sm">
                  [ <span :class="$q.dark.isActive ? 'text-orange' : 'text-teal'">{{ activeSlideTitle }}</span>
                  ] 인사평가결과
                </span>
                <q-separator class="q-my-sm" color="grey" />
                <div :style="contentZoneStyle">
                  <ag-grid-vue
                    style="width: 100%; height: 100%"
                    :class="$q.dark.isActive ? 'ag-theme-alpine-dark' : 'ag-theme-alpine'"
                    :columnDefs="columnDefs.team"
                    :rowData="rowData.team"
                    :defaultColDef="defaultColDef.team"
                    @grid-ready="onGridReadyTeam"
                    :grid-options="gridOptions"
                  >
                  </ag-grid-vue>
                </div>
              </q-scroll-area>
            </q-carousel-slide>
          </q-carousel>
        </div>
      </q-card>
    </q-card>
  </q-page>
  <q-dialog persistent full-height full-width v-model="isDialogVisible">
    <q-card class="q-pa-none q-ma-none">
      <q-card-section class="q-pa-none q-ma-none">
        <hrt-v6010p :rowData="rowData.team" :slidTitle="activeSlideTitle" @close="handleClose" />
      </q-card-section>
    </q-card>
  </q-dialog>
</template>
ㅌ
<script setup>
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import 'ag-grid-community/styles/ag-theme-balham.css';
import { AgGridVue } from 'ag-grid-vue3';
import { computed, onBeforeMount, onBeforeUnmount, onMounted, reactive, ref } from 'vue';
import { api } from 'boot/axios';
import { QBtn, QIcon, QToggle, SessionStorage, useQuasar } from 'quasar';
import { useYearInfoStore } from 'src/store/setYearInfo';
import HrtV6010p from 'pages/erp/hrt/HrtV6010p.vue';

const storeYear = useYearInfoStore();

const rowData = reactive({ rows: [], team: [] });
const isDialogVisible = ref(false);
function handleClose() {
  console.log('handleClose called');
  isDialogVisible.value = false;
}

// grid Height 자동처리부분1
const gridHeight = ref(245); // 초기 높이
const rowHeight = 45; // 행당 높이 (예: 25px)
const minHeight = ref(90); // 최소 높이 (예: 300px) rowHeight의 3배

const $q = useQuasar();

const contentZoneHeight = ref(300);
const contentBottomZoneStyle = computed(() => ({
  height: `${contentZoneHeight.value - 550}px`,
}));
const contentZoneStyle = computed(() => ({
  height: `${contentZoneHeight.value - 680}px`,
}));

onBeforeUnmount(() => {
  // console.log('onBeforeUnmount....');
  // Remove the resize event listener when the component is destroyed
  window.removeEventListener('resize', handleResize);
});

const viewData1 = ref([]);
const viewData2 = ref([]);
const viewData3 = ref([]);
const viewData9 = ref([]);
onBeforeMount(() => {});

const menuLabel = ref('');
onMounted(() => {
  window.addEventListener('resize', handleResize);
  menuLabel.value = window.history.state.label;
  handleResize();

  getData_titl().then(() => {
    for (let i = 0; i < titlCdTable.length + 1; i++) {
      viewData1.value.push(0);
      viewData2.value.push(0);
      viewData3.value.push(0);
    }
    // console.log('view1 : ', viewData1.value);
    // console.log('view2 : ', viewData2.value);
    // console.log('view3 : ', viewData3.value);
    getData().then(data => {
      for (let i = 0; i < data.length; i++) {
        if (data[i].pstnCd === '05') {
          const targetIndex = titlCdTable.indexOf(data[i].titlCd);
          // console.log('ind1 : ', data[i].titlCd, data[i].titlCd, data[i].evalCnt, targetIndex);
          viewData1.value[targetIndex] = data[i].evalCnt;
        } else if (data[i].pstnCd === '06') {
          const targetIndex = titlCdTable.indexOf(data[i].titlCd);
          // console.log('ind2 : ', data[i].titlCd, targetIndex);
          viewData2.value[targetIndex] = data[i].evalCnt;
        } else {
          const targetIndex = titlCdTable.indexOf(data[i].titlCd);
          // console.log('ind3 : ', data[i].titlCd, targetIndex);
          viewData3.value[targetIndex] = data[i].evalCnt;
        }
      }
      // console.log('viewData1 : ', viewData1.value);
      // console.log('viewData2 : ', viewData2.value);
      // console.log('viewData3 : ', viewData3.value);
      for (let i = 0; i < viewData1.value.length; i++) {
        viewData9.value[i] = viewData1.value[i] + viewData2.value[i] + viewData3.value[i];
      }
      let lastI = viewData1.value.length - 1;
      for (let i = 0; i < lastI; i++) {
        viewData1.value[lastI] += viewData1.value[i];
        viewData2.value[lastI] += viewData2.value[i];
        viewData3.value[lastI] += viewData3.value[i];
      }
    });
  });
  beforeSlideChange('05', '06');
});

// ======================================================
const screenSizeHeight = ref(0);
const myTweak = offset => {
  screenSizeHeight.value = offset;

  return { minHeight: offset ? `calc(100vh - ${offset}px)` : '100vh' };
};
const handleResize = () => {
  contentZoneHeight.value = window.innerHeight - screenSizeHeight.value;
  // contentZoneHeight.value = window.innerHeight - state.height - 680;
};
// ======================================================
const slideTitle = ['팀장', '소장', 'M3이상', 'J이하', 'SM급이상', 'SD급이상', 'CS급', '별정직'];
const activeSlideTitle = ref(null);
const beforeSlideChange = (to, from) => {
  activeSlideTitle.value = slideTitle[to - 5];
  getData_team(to);
};
const slide = ref('05');

const gridApiTeam = ref(null);
const onGridReadyTeam = params => {
  gridApiTeam.value = params.api;
};

const defaultColDef = reactive({
  team: {
    flex: 1,
    sortable: true,
    filter: true,
    floatingFilter: false,
    editable: true,
  },
});

const columnDefs = reactive({
  team: [
    {
      headerName: '#',
      minWidth: 70,
      maxWidth: 70,
      editable: false,
      valueGetter: function (params) {
        // Customize row numbers as needed
        return params.node.rowIndex + 1;
      },
    },
    {
      headerName: '소속',
      field: 'deptNm',
      minWidth: 130,
      maxWidth: 150,
    },
    {
      headerName: '직급',
      field: 'titlNm',
      minWidth: 100,
      maxWidth: 100,
    },
    {
      headerName: '성명',
      field: 'empNm',
      minWidth: 100,
      maxWidth: 100,
    },
    {
      headerName: '성과평가',
      field: 'evaP1X',
      minWidth: 100,
      maxWidth: 100,
    },
    {
      headerName: '역량평가',
      field: 'evaP2X',
      minWidth: 100,
      maxWidth: 100,
    },
    {
      headerName: '역량평가(편차)',
      field: 'evaP2Xx',
      minWidth: 120,
      maxWidth: 140,
    },
    {
      headerName: '근태',
      field: 'evaAtt',
      minWidth: 100,
      maxWidth: 100,
    },
    {
      headerName: '최종평가',
      field: 'evaFinalPoint',
      minWidth: 120,
      maxWidth: 120,
    },
    {
      headerName: '기타',
      field: '',
      minWidth: 120,
    },
  ],
});

// **************************************************************//
// ***** DataBase 연결부분    *************************************//
// **************************************************************//

const titlCdTable = [];
const titlNmTable = [];
const getData_titl = async () => {
  try {
    const response = await api.post('/api/mst/titl_option_list', {
      paramSetYear: storeYear.setYear,
    });
    for (let i = 0; i < response.data.data.length; i++) {
      if (response.data.data[i].titlCd !== '101') {
        titlCdTable.push(response.data.data[i].titlCd);
        titlNmTable.push(response.data.data[i].titlNm);
      }
    }
    // console.log(titlCdTable);
    // console.log(titlNmTable);
  } catch (error) {
    console.error('Error fetching users:', error);
  }
};

const getData = async () => {
  try {
    const response = await api.post('/api/hrt/hrt6010_list', {
      paramStdYear: storeYear.setYear,
    });
    rowData.rows = response.data.data;
    // console.log('rowData : ', JSON.stringify(rowData));
    return rowData.rows;
  } catch (error) {
    console.error('Error fetching users:', error);
  }
};

const getData_team = async resCheckCd => {
  try {
    const response = await api.post('/api/hrt/hrt6010_list_team', {
      paramStdYear: storeYear.setYear,
      paramCheckCd: resCheckCd,
    });
    rowData.team = response.data.data;
    // console.log('rowData : ', JSON.stringify(rowData));
    return rowData.team;
  } catch (error) {
    console.error('Error fetching users:', error);
  }
};

// ***** DataBase 소속자료 가져오기 부분 *****************************//

// **************************************************************//
// ***** DataBase 연결부분 끝  *************************************//
// **************************************************************//

/* ************************************************************************* *
 ** Excel저장  처리부분
 ** ************************************************************************* */
const isExcelDownload = () => {};
/* ************************************************************************* *
 ** Excel저장  처리부분 끝
 ** ************************************************************************* */
const gridOptions = {
  localeText: { noRowsToShow: storeYear.setYear + '년 최종평가점수 마감작업 전 입니다. 최종 마감작업을 먼저 진행 하십시요' },
};
</script>
<style>
@import 'src/css/print/hrt6010.css';
</style>

<template>
  <q-page class="q-pa-xs-xs q-pa-sm-md" :style-fn="myTweak">
    <q-card>
      <!-- contents List -->
      <q-card bordered>
        <!-- contents list title bar -->
        <q-bar class="q-px-sm">
          <q-icon name="list_alt" />
          <span class="q-px-sm text-bold text-subtitle1" :class="$q.dark.isActive ? 'text-orange' : 'text-primary'">{{ menuLabel }}</span>
        </q-bar>
        <!--  end of contents list title bar -->
        <q-card-actions align="right" class="q-pa-none">
          <q-toolbar class="row">
            <div v-if="showSimulatedReturnData" class="q-gutter-x-lg">
              <q-radio keep-color v-model="searchParam.evaFg" val="1" label="본부별 편차적용 결과" color="teal" @click="getData" />
              <q-radio keep-color v-model="searchParam.evaFg" val="2" label="직무역량별 편자적용 결과" color="cyan" @click="getData" />
            </div>
            <q-space />
            <div class="q-gutter-xs">
              <q-btn outline color="primary" dense @click="getData"><q-icon name="search" size="xs" class="q-mr-xs" /> 조회 </q-btn>
              <q-btn outline color="positive" dense @click="showSimulatedReturnData = false"
                ><q-icon name="calculate" size="xs" class="q-mr-xs" /> 계산
              </q-btn>
            </div>
          </q-toolbar>
        </q-card-actions>

        <q-separator size="3px" />
        <q-card class="relative-position card-example" flat bordered>
          <q-card-section v-if="!showSimulatedReturnData" class="q-pb-none">
            <div :style="contentZoneStyle">
              <div class="text-h5 q-pa-xl">
                <div class="text-h4 text-primary text-bold flex flex-center q-py-md">{{ storeYear.setYear }}년</div>
                <div class="text-h5 text-teal text-bold flex flex-center">인사평가 계산작업관리</div>
                <div class="flex flex-center q-my-xl q-gutter-x-lg">
                  <q-radio keep-color v-model="searchParam.evaFg" val="1" label="본부별 편차적용" color="teal" />
                  <q-radio keep-color v-model="searchParam.evaFg" val="2" label="직무역량별 편자적용" color="cyan" />
                </div>
                <div class="flex flex-center q-my-xl">
                  <q-btn
                    :disable="storeYear.setLocCh !== '1' && storeYear.setLocCh !== '2'"
                    size="lg"
                    outline
                    color="positive"
                    @click="handleGetProcedure"
                    ><q-icon name="calculate" size="md" class="q-mr-sm" /> 평가계산 시작하기
                  </q-btn>
                </div>
              </div>
            </div>
          </q-card-section>

          <q-card-section class="q-pa-xs">
            <transition appear enter-active-class="animated fadeIn" leave-active-class="animated fadeOut">
              <div v-show="showSimulatedReturnData">
                <div :style="contentZoneStyle">
                  <ag-grid-vue
                    style="width: 100%; height: 100%"
                    :class="$q.dark.isActive ? 'ag-theme-alpine-dark' : 'ag-theme-alpine'"
                    :columnDefs="columnDefs.columns"
                    :rowData="rowData.rows"
                    :defaultColDef="defaultColDef.def"
                    :rowSelection="rowSelection"
                    @selection-changed="onSelectionChanged"
                    @cell-value-changed="onCellValueChanged"
                    @grid-ready="onGridReady"
                    :grid-options="gridOptions"
                  >
                  </ag-grid-vue>
                </div>
              </div>
            </transition>
          </q-card-section>

          <q-inner-loading :showing="calculatorVisible">
            <q-spinner-gears size="100px" color="primary" />
          </q-inner-loading>
        </q-card>
      </q-card>
      <!--  end of contents list -->
    </q-card>

    <!-- contents zone -->
  </q-page>
</template>

<script setup>
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import 'ag-grid-community/styles/ag-theme-balham.css';
import { AgGridVue } from 'ag-grid-vue3';
import { QBtn, QIcon, useQuasar } from 'quasar';
import { computed, onBeforeMount, onBeforeUnmount, onMounted, reactive, ref } from 'vue';
import { api } from '/src/boot/axios';

import commUtil from 'src/js_comm/comm-util';

import { useYearInfoStore } from 'src/store/setYearInfo';

const storeYear = useYearInfoStore();

const $q = useQuasar();

const calculatorVisible = ref(false);
const showSimulatedReturnData = ref(false);

let isSaveFg = null;

const searchParam = reactive({
  pYear: '',
  evaFg: '1',
});
const statusEdit = reactive({
  icon: '',
  message: '',
  color: '',
});

onBeforeUnmount(() => {
  // Remove the resize event listener when the component is destroyed
  window.removeEventListener('resize', handleResize);
});

onBeforeMount(() => {
  rowSelection.value = 'multiple';

  searchParam.pYear = commUtil.getTodayYear().toString();

  optionYearReset();
});

const menuLabel = ref('');
onMounted(() => {
  window.addEventListener('resize', handleResize);
  menuLabel.value = window.history.state.label;
  handleResize();
});

const formDisable = ref(true);

const contentZoneHeight = ref(500);
const contentZoneStyle = computed(() => ({
  height: `${contentZoneHeight.value}px`,
}));

const gridApi = ref(null);
const rowData = reactive({ rows: [], update: [], backup: [] });

const onGridReady = params => {
  gridApi.value = params.api;
};

const defaultColDef = reactive({
  def: {
    flex: 1,
    sortable: true,
    filter: true,
    floatingFilter: false,
    editable: true,
  },
});

const columnDefs = reactive({
  columns: [
    {
      headerName: '#',
      width: 60,
      pinned: 'left',
      editable: false,
      valueGetter: function (params) {
        // Customize row numbers as needed
        return params.node.rowIndex + 1;
      },
    },
    {
      headerName: '사번',
      field: 'empCd',
      minWidth: 100,
      maxWidth: 100,
      pinned: 'left',
    },
    {
      headerName: '성명',
      field: 'empNm',
      minWidth: 100,
      maxWidth: 100,
      pinned: 'left',
    },
    {
      headerName: '소속팀',
      field: 'deptNm',
      minWidth: 120,
      maxWidth: 150,
    },
    {
      headerName: '직급',
      field: 'titlNm',
      minWidth: 90,
      maxWidth: 90,
    },
    {
      headerName: '성과점수',
      field: 'evaP1',
      minWidth: 100,
      maxWidth: 100,
    },
    {
      headerName: '성과환산',
      field: 'evaP1X',
      minWidth: 100,
      maxWidth: 100,
    },
    {
      headerName: '역량점수',
      field: 'evaP2',
      minWidth: 100,
      maxWidth: 100,
    },
    {
      headerName: '역량환산',
      field: 'evaP2X',
      minWidth: 100,
      maxWidth: 100,
    },
    {
      headerName: '역량평균',
      field: 'evaP2Avg',
      minWidth: 100,
      maxWidth: 100,
      cellStyle: { color: 'blue' },
    },
    {
      headerName: '표준편차',
      field: 'evaP2Sd',
      minWidth: 100,
      maxWidth: 100,
      cellStyle: { color: 'blue' },
    },
    {
      headerName: '근태점수',
      field: 'evaAtt',
      minWidth: 100,
      maxWidth: 100,
      cellStyle: params => {
        return getStatusAttStyle(params.data);
      },
    },
    {
      headerName: '역량최종환산',
      field: 'evaP2Xx',
      minWidth: 120,
      maxWidth: 120,
    },
    {
      headerName: '최종점수',
      field: 'evaFinalPoint',
      minWidth: 120,
      maxWidth: 120,
      cellStyle: { color: 'blue' },
    },
    {
      headerName: '성과처리내용',
      field: 'p1Explains',
      minWidth: 120,
    },
    {
      headerName: '역량처리내용',
      field: 'p2Explains',
      minWidth: 120,
    },
    {
      headerName: '최종계산일',
      field: 'updateDate',
      minWidth: 120,
      maxWidth: 180,
    },
    {
      headerName: '작업자',
      field: 'updateEmpNm',
      minWidth: 100,
      maxWidth: 100,
    },
  ],
});

const getStatusAttStyle = val => {
  if (val.evaAtt > 0) {
    return $q.dark.isActive ? { color: 'red' } : { color: 'red' };
  } else {
    return $q.dark.isActive ? { color: 'blue' } : { color: 'blue' };
  }
};

const selectedRows = ref([]);

const onSelectionChanged = event => {
  selectedRows.value = event.api.getSelectedRows();
};

const showSaveBtn = ref(false);
const onCellValueChanged = () => {
  rowData.update = [];
  for (let i = 0; rowData.backup.length > i; i++) {
    if (JSON.stringify(rowData.backup[i]) !== JSON.stringify(rowData.rows[i])) {
      rowData.update.push(rowData.rows[i]);
    }
  }
  showSaveBtn.value = rowData.update.length > 0;
};

const rowSelection = ref(null);

const empCdFocus = ref(null);
const empNmFocus = ref(null);

const screenSizeHeight = ref(0);
const myTweak = offset => {
  screenSizeHeight.value = offset;
  return { minHeight: offset ? `calc(100vh - ${offset}px)` : '100vh' };
};
const handleResize = () => {
  contentZoneHeight.value = window.innerHeight - screenSizeHeight.value - 180;
};

const handleGetProcedure = () => {
  calculatorVisible.value = true;
  showSimulatedReturnData.value = false;

  getProcedure().then(() => {
    setTimeout(() => {
      calculatorVisible.value = false;
      showSimulatedReturnData.value = true;
      getData();
    }, 1000);
  });
};
// **************************************************************//
// ***** DataBase 연결부분    *************************************//
// **************************************************************//
const getData = async () => {
  showSimulatedReturnData.value = true;
  try {
    const response = await api.post('/api/hrt/hrt3010_list', {
      paramSetYear: storeYear.setYear,
      paramEvaFg: searchParam.evaFg,
    });

    rowData.rows = response.data.data;
    rowData.backup = JSON.parse(JSON.stringify(response.data.data));
  } catch (error) {
    console.error('Error fetching users:', error);
  }
};

const getProcedure = async () => {
  try {
    const response = await api.post('/api/hrt/hrt3010_procedure', {
      paramSetYear: searchParam.pYear,
      paramEvaFg: searchParam.evaFg,
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    calculatorVisible.value = false;
  }
};

// **************************************************************//
// ***** DataBase 연결부분 끝  *************************************//
// **************************************************************//

const optionsDate = ref({
  year: [],
  month: [],
  day: [],
});
const optionYearReset = () => {
  optionsDate.value.year = Array.from({ length: 11 }, (_, i) => {
    const year = new Date().getFullYear() - 10 + i;
    return { label: year.toString() + '년', value: year.toString() };
  });
};

const gridOptions = {
  localeText: { noRowsToShow: storeYear.setYear + '년 평가 집계작업 전 입니다. 집계계산적업을 먼저 진행 하십시요' },
};
</script>

<style lang="sass" scoped></style>

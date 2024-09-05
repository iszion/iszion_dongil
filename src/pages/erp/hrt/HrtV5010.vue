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
            <q-space />
            <div class="q-gutter-xs">
              <q-btn outline color="primary" dense @click="getData"><q-icon name="search" size="xs" class="q-mr-xs" /> 조회 </q-btn>
              <q-btn outline color="negative" dense @click="showSimulatedReturnData = false"
                ><q-icon name="key" size="xs" class="q-mr-xs" /> 마감
              </q-btn>
            </div>
          </q-toolbar>
        </q-card-actions>

        <q-separator size="3px" />
        <q-card class="relative-position card-example" flat bordered>
          <q-card-section v-if="!showSimulatedReturnData" class="q-pb-none">
            <div :style="contentZoneStyle">
              <div class="text-h5 q-pa-xl-lg q-pa-sm-xl">
                <div class="text-h4 text-primary text-bold flex flex-center q-py-md">{{ storeYear.setYear }}년</div>
                <div class="text-h5 text-teal text-bold flex flex-center">인사평가점수 마감하기</div>
                <div class="flex flex-center q-my-xl q-gutter-x-lg">
                  <q-radio keep-color v-model="searchParam.evaFg" val="1" label="본부별 마감 확정하기" color="teal" />
                  <q-radio keep-color v-model="searchParam.evaFg" val="2" label="직무역량별 마감 확정하기" color="cyan" />
                </div>
                <div class="flex flex-center q-my-xl">
                  <q-btn
                    :disable="storeYear.setLocCh !== '1' && storeYear.setLocCh !== '2'"
                    size="lg"
                    outline
                    color="negative"
                    @click="handleGetProcedure"
                    ><q-icon name="key" size="md" class="q-mr-sm" /> 평가점수 마감하기
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
import notifySave from 'src/js_comm/notify-save';

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
  getData();
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
      headerName: '평가년도',
      field: 'stdYear',
      minWidth: 110,
      maxWidth: 110,
      pinned: 'left',
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
      field: 'evaP1X',
      minWidth: 120,
      maxWidth: 120,
    },
    {
      headerName: '역량점수',
      field: 'evaP2Xx',
      minWidth: 120,
      maxWidth: 120,
    },
    {
      headerName: '평가점수',
      field: 'finalPoint',
      minWidth: 120,
      maxWidth: 120,
    },
    {
      headerName: '평가등급',
      field: 'evaGrade',
      minWidth: 120,
      maxWidth: 120,
    },
    {
      headerName: '참조사항',
      field: 'explains',
      minWidth: 120,
    },
    {
      headerName: '마감일',
      field: 'regDate',
      minWidth: 120,
      maxWidth: 180,
    },
    {
      headerName: '작업자',
      field: 'regEmpNm',
      minWidth: 100,
      maxWidth: 100,
    },
  ],
});

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

  getProcedure();
};
// **************************************************************//
// ***** DataBase 연결부분    *************************************//
// **************************************************************//
const getData = async () => {
  showSimulatedReturnData.value = true;
  try {
    const response = await api.post('/api/hrt/hrt5010_list', {
      paramStdYear: storeYear.setYear,
    });

    rowData.rows = response.data.data;
    rowData.backup = JSON.parse(JSON.stringify(response.data.data));

    if (rowData.rows.length <= 0) {
      $q.dialog({
        dark: true,
        title: '마감전',
        message: '평가점수 마감 전 입니다. 마감작업을 진행하십시요',
        // persistent: true,
      })
        .onOk(() => {})
        .onCancel(() => {})
        .onDismiss(() => {
          // 확인/취소 모두 실행되었을때
        });
      showSimulatedReturnData.value = false;
    }
  } catch (error) {
    console.error('Error fetching users:', error);
  }
};

const getProcedure = async () => {
  try {
    const response = await api.post('/api/hrt/hrt5010_procedure', {
      paramSetYear: searchParam.pYear,
      paramEvaFg: searchParam.evaFg,
    });

    // console.log('res :: ', response.data.success);

    setTimeout(() => {
      calculatorVisible.value = false;
      showSimulatedReturnData.value = true;

      let procStatus = {};
      response.data.success ? (procStatus.msgColor = 'positive') : (procStatus.msgColor = 'negative');
      response.data.success ? (procStatus.msgTextColor = 'dark') : (procStatus.msgTextColor = 'white');
      response.data.success ? (procStatus.msgCaption = '정상처리') : (procStatus.msgCaption = '처리실패');
      response.data.success
        ? (procStatus.msgMessage = '작업을 모두 끝났습니다.')
        : (procStatus.msgMessage = '착업에 문제가 있습니다.(관리자에게 문의)');
      notifySave.notifyUserView(procStatus);

      getData();
    }, 1000);
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
  localeText: { noRowsToShow: storeYear.setYear + '년 최종평가점수 마감작업 전 입니다. 최종 마감작업을 먼저 진행 하십시요' },
};
</script>

<style lang="sass" scoped></style>

<template>
  <q-page class="q-pa-xs-xs q-pa-sm-md" :style-fn="myTweak">
    <q-card class="q-pa-sm">
      <div class="row">
        <div class="col-xs-12 col-sm-8">
          <div class="row q-col-gutter-x-sm">
            <div class="col-xs-12 col-sm-6">
              <q-banner rounded :class="$q.dark.isActive ? 'bg-grey-9' : 'bg-grey-3'" style="height: 100%">
                <template v-slot:avatar>
                  <q-icon name="menu_book" color="primary" size="md" />
                </template>
                <span class="text-subtitle1 text-bold"> 목표설정에 대한 승인작업입니다.</span><br />
                1. <span class="text-teal text-bold">승인대기</span> 자료만 승인하실 수 있습니다.<br />
                2. <span class="text-teal text-bold">승인반려</span>시 반려사유를 작성합니다.<br />
              </q-banner>
            </div>
            <div class="col-xs-12 col-sm-6 q-pt-xs-xs">
              <q-banner rounded :class="$q.dark.isActive ? 'bg-grey-9' : 'bg-grey-3'">
                <div class="row">
                  <div class="col-4">
                    <q-chip>
                      <q-avatar color="blue" text-color="white">{{ viewStatus.totalCnt }}</q-avatar>
                      전체건수
                    </q-chip>
                  </div>
                  <div class="col-4">
                    <q-chip>
                      <q-avatar color="teal" text-color="white">{{ viewStatus.status_0 }}</q-avatar>
                      목표진행중
                    </q-chip>
                  </div>
                  <div class="col-4">
                    <q-chip>
                      <q-avatar color="grey" text-color="white">{{ viewStatus.status_3 }}</q-avatar>
                      자기평가진행
                    </q-chip>
                  </div>
                </div>
                <div class="row">
                  <q-space />
                  <div class="col-4">
                    <q-chip>
                      <q-avatar color="orange" text-color="white">{{ viewStatus.status_4 }}</q-avatar>
                      평가대기
                    </q-chip>
                  </div>
                  <div class="col-4">
                    <q-chip>
                      <q-avatar color="grey" text-color="white">{{ viewStatus.status_5 }}</q-avatar>
                      성과평가완료
                    </q-chip>
                  </div>
                </div>
              </q-banner>
            </div>
          </div>
        </div>
        <div class="col-xs-12 col-sm-4 q-pa-sm self-center">
          <div class="row">
            <q-space />
            <span class="text-bold text-subtitle2 q-pr-sm text-orange">승인자<q-icon name="chevron_right" size="xs" /></span>
            <q-breadcrumbs separator="|" class="text-orange text-bold" active-color="secondary">
              <q-breadcrumbs-el icon="room_preferences" :label="storeUser.setDeptNm" style="width: 90px" />
              <q-breadcrumbs-el icon="star" :label="storeUser.setTitlNm" style="width: 60px" />
              <q-breadcrumbs-el icon="person" :label="storeUser.setEmpNm" style="width: 70px" />
            </q-breadcrumbs>
          </div>
        </div>
      </div>
    </q-card>

    <q-separator spaced />

    <q-card class="q-pa-sm">
      <q-card-section class="text-center q-pa-sm q-mb-sm" :class="$q.dark.isActive ? 'bg-teal-7' : 'bg-teal-3'">
        <q-item-label class="text-h6">목표설정 / 승인하기</q-item-label>
      </q-card-section>

      <div class="row q-col-gutter-x-lg">
        <div class="col-xs-12 col-md-6">
          <q-card class="q-pa-sm">
            <q-toolbar class="row q-pa-none">
              <q-avatar color="red" text-color="white" size="md">1번</q-avatar>
              <q-space />
              <q-btn outline color="grey" dense @click="getData"
                ><q-icon name="refresh" size="xs" class="q-mr-xs" />
                다시 불러오기
              </q-btn>
            </q-toolbar>
            <div :style="{ height: gridHeight + 'px' }">
              <ag-grid-vue
                style="width: 100%; height: 100%"
                :class="$q.dark.isActive ? 'ag-theme-alpine-dark' : 'ag-theme-alpine'"
                :columnDefs="columnDefs.group"
                :rowData="rowData.rows"
                :defaultColDef="defaultColDef.group"
                rowSelection="single"
                @selection-changed="onSelectionChanged"
                @grid-ready="onGridReady"
                :grid-options="gridOptions"
              >
              </ag-grid-vue>
            </div>
          </q-card>
        </div>
        <div class="col-xs-12 col-md-6">
          <q-card class="q-pa-sm">
            <q-toolbar class="row q-pa-none">
              <q-avatar color="red" text-color="white" size="md">2번</q-avatar>
              <q-space />
              <div class="row q-gutter-x-sm">
                <q-field rounded filled label="자기누적 평균점수" stack-label style="width: 150px">
                  <template v-slot:prepend>
                    <q-icon name="check_circle_outline" />
                  </template>

                  <template v-slot:control>
                    <div class="self-center full-width no-outline text-center text-subtitle1 text-bold text-orange" tabindex="0">
                      {{ viewPoint.selfPoint }}
                    </div>
                  </template>
                </q-field>
                <q-field rounded filled label="평가누적 평균점수" stack-label style="width: 150px">
                  <template v-slot:prepend>
                    <q-icon name="task_alt" />
                  </template>

                  <template v-slot:control>
                    <div class="self-center full-width no-outline text-center text-subtitle1 text-bold text-blue" tabindex="0">
                      {{ viewPoint.markPoint }}
                    </div>
                  </template>
                </q-field>
              </div>
            </q-toolbar>
            <div :key="gridKey" :style="{ height: gridHeightSelect + 'px' }">
              <ag-grid-vue
                style="width: 100%; height: 100%"
                :class="$q.dark.isActive ? 'ag-theme-alpine-dark' : 'ag-theme-alpine'"
                :columnDefs="columnDefs.columns"
                :rowData="rowData.rowsSel"
                :defaultColDef="defaultColDef.columns"
                @selection-changed="onSelectionChangedSel"
                @grid-ready="onGridReadySel"
                :grid-options="gridOptionsSel"
              >
              </ag-grid-vue>
            </div>
          </q-card>
        </div>
      </div>
      <q-separator spaced />
      <q-card class="q-pa-xs">
        <q-scroll-area style="height: 350px; min-height: 300px">
          <div class="row">
            <q-card flat bordered style="width: 100%" v-for="data in selectedRowsSel" :key="data.seq" class="q-mb-xs-lg q-mb-sm-none">
              <div v-if="!$q.screen.lt.sm" class="row">
                <q-card-section class="col-xs-12 col-sm-1 q-pa-none">
                  <div class="row bg-grey-6 q-px-xs">
                    <q-icon name="menu_book" color="primary" size="xs" />
                    <span class="text-subtitle2 text-bold q-ml-sm"> 순번</span><br />
                  </div>
                </q-card-section>
                <q-separator vertical />
                <q-card-section class="col-xs-12 col-sm-3 q-pa-none">
                  <div class="row bg-grey-6 q-px-xs">
                    <q-icon name="menu_book" color="primary" size="xs" />
                    <span class="text-subtitle2 text-bold q-ml-sm"> 목표설정</span><br />
                  </div>
                </q-card-section>
                <q-separator vertical />
                <q-card-section class="col-xs-12 col-sm-2 q-pa-none">
                  <div class="row bg-grey-6 q-px-xs">
                    <q-icon name="menu_book" color="primary" size="xs" />
                    <span class="text-subtitle2 text-bold q-ml-sm">설정기준</span><br />
                  </div>
                </q-card-section>
                <q-separator vertical />
                <q-card-section class="col-xs-12 col-sm-3 q-pa-none">
                  <div class="row bg-grey-6 q-px-xs">
                    <q-icon name="menu_book" color="primary" size="xs" />
                    <span class="text-subtitle2 text-bold q-ml-sm">성과/업적</span><br />
                  </div>
                </q-card-section>
                <q-separator vertical />
                <q-card-section class="col-xs-12 col-sm-1 q-pa-none">
                  <div class="row bg-grey-6 q-px-xs">
                    <q-icon name="menu_book" color="primary" size="xs" />
                    <span class="text-subtitle2 text-bold q-ml-sm">가중치</span><br />
                  </div>
                </q-card-section>
                <q-separator vertical />
                <q-card-section class="col-xs-12 col-sm-1 q-pa-none">
                  <div class="row bg-grey-6 q-px-xs">
                    <q-icon name="menu_book" color="primary" size="xs" />
                    <span class="text-subtitle2 text-bold q-ml-sm">자기점수</span><br />
                  </div>
                </q-card-section>
                <q-separator vertical />
                <q-card-actions v-if="$q.screen.xs" align="right">
                  <div class="row bg-grey-6 q-px-xs">
                    <q-icon name="menu_book" color="primary" size="xs" />
                    <span class="text-subtitle2 text-bold q-ml-sm">자기점수</span><br />
                  </div>
                </q-card-actions>
              </div>

              <div class="row">
                <q-card-section class="col-xs-12 col-sm-1 q-pa-none self-center">
                  <div v-if="$q.screen.lt.sm" class="row bg-grey-6 q-px-xs">
                    <q-icon name="menu_book" color="primary" size="xs" />
                    <span class="text-subtitle2 text-bold q-ml-sm"> 순번</span><br />
                  </div>

                  <div class="q-px-sm text-center">
                    {{ data.seq }}
                  </div>
                </q-card-section>
                <q-separator vertical />
                <q-card-section class="col-xs-12 col-sm-3 q-pa-none">
                  <div v-if="$q.screen.lt.sm" class="row bg-grey-6 q-px-xs">
                    <q-icon name="menu_book" color="primary" size="xs" />
                    <span class="text-subtitle2 text-bold q-ml-sm"> 목표설정</span><br />
                  </div>

                  <span class="q-px-sm">
                    {{ data.targetDoc }}
                  </span>
                </q-card-section>
                <q-separator vertical />
                <q-card-section class="col-xs-12 col-sm-2 q-pa-none">
                  <div v-if="$q.screen.lt.sm" class="row bg-grey-6 q-px-xs">
                    <q-icon name="menu_book" color="primary" size="xs" />
                    <span class="text-subtitle2 text-bold q-ml-sm">설정기준</span><br />
                  </div>
                  <span class="q-px-sm"> 1. {{ data.evaS }}<br /> </span>
                  <span class="q-px-sm"> 2. {{ data.evaA }}<br /> </span>
                  <span class="q-px-sm"> 3. {{ data.evaB }}<br /> </span>
                  <span class="q-px-sm"> 4. {{ data.evaC }}<br /> </span>
                  <span class="q-px-sm"> 5. {{ data.evaD }} </span>
                </q-card-section>
                <q-separator vertical />
                <q-card-section class="col-xs-12 col-sm-3 q-pa-none">
                  <div v-if="$q.screen.lt.sm" class="row bg-grey-6 q-px-xs">
                    <q-icon name="menu_book" color="primary" size="xs" />
                    <span class="text-subtitle2 text-bold q-ml-sm">성과/업적</span><br />
                  </div>

                  <span class="q-px-sm">
                    {{ data.workDoc }}
                  </span>
                </q-card-section>
                <q-separator vertical />
                <q-card-section class="col-xs-12 col-sm-1 q-pa-none self-center">
                  <div v-if="$q.screen.lt.sm" class="row bg-grey-6 q-px-xs">
                    <q-icon name="menu_book" color="primary" size="xs" />
                    <span class="text-subtitle2 text-bold q-ml-sm">가중치</span><br />
                  </div>

                  <div class="q-px-sm self-center text-center">
                    {{ data.weight }}
                  </div>
                </q-card-section>
                <q-separator vertical />
                <q-card-section class="col-xs-12 col-sm-1 q-pa-none self-center">
                  <div v-if="$q.screen.lt.sm" class="row bg-grey-6 q-px-xs">
                    <q-icon name="menu_book" color="primary" size="xs" />
                    <span class="text-subtitle2 text-bold q-ml-sm">자기점수</span><br />
                  </div>

                  <div class="q-px-sm self-center text-center">
                    {{ data.selfPoint }}
                  </div>
                </q-card-section>
                <q-separator vertical />
                <q-card-actions :vertical="!$q.screen.xs" class="q-pa-none">
                  <q-radio
                    keep-color
                    v-model="data.markCh"
                    val="S"
                    label="S"
                    color="deep-orange"
                    :size="$q.screen.xs ? 'sm' : 'sm'"
                    :style="{ fontSize: '1.4em' }"
                  />
                  <q-radio
                    keep-color
                    v-model="data.markCh"
                    val="A"
                    label="A"
                    color="deep-orange"
                    :size="$q.screen.xs ? 'sm' : 'sm'"
                    :style="{ fontSize: '1.4em' }"
                  />
                  <q-radio
                    keep-color
                    v-model="data.markCh"
                    val="B"
                    label="B"
                    color="deep-orange"
                    :size="$q.screen.xs ? 'sm' : 'sm'"
                    :style="{ fontSize: '1.4em' }"
                  />
                  <q-radio
                    keep-color
                    v-model="data.markCh"
                    val="C"
                    label="C"
                    color="deep-orange"
                    :size="$q.screen.xs ? 'sm' : 'sm'"
                    :style="{ fontSize: '1.4em' }"
                  />
                  <q-radio
                    keep-color
                    v-model="data.markCh"
                    val="D"
                    label="D"
                    color="deep-orange"
                    :size="$q.screen.xs ? 'sm' : 'sm'"
                    :style="{ fontSize: '1.4em' }"
                  />
                </q-card-actions>
              </div>
            </q-card>
          </div>
        </q-scroll-area>
      </q-card>
    </q-card>
  </q-page>
</template>

<script setup>
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import 'ag-grid-community/styles/ag-theme-balham.css';
import { AgGridVue } from 'ag-grid-vue3';
import { computed, onBeforeMount, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue';
import { isEmpty, isEqual } from 'lodash';
import { api } from 'boot/axios';
import notifySave from 'src/js_comm/notify-save';
import { QBtn, QIcon, QToggle, useQuasar } from 'quasar';
import jsonUtil from 'src/js_comm/json-util';
import { useUserInfoStore } from 'src/store/setUserInfo';
import { useYearInfoStore } from 'src/store/setYearInfo';
const storeUser = useUserInfoStore();
const storeYear = useYearInfoStore();

const setEvsCd = ref('2011101'); // 성과평가 공통코드

const isDialogVisible = ref(false);
const sendReturnDialog = (resStdYear, resEmpCd, resSeq) => {
  if (formData.value.returnDoc) {
    $q.dialog({
      dark: true,
      title: '안내',
      html: true,
      message: '기존에 작성한 반려내용이 있습니다. <br>다시작성 또는 기존내용을 수정하실 수 있습니다',
      // persistent: true,
      ok: {
        label: '다시작성',
        color: 'primary',
      },
      cancel: {
        label: '수정하기',
        color: 'secondary',
      },
    })
      .onOk(() => {
        formData.value.returnDoc = null;
        formData.value.evtEmpCd = resEmpCd;
        formData.value.seq = resSeq;
        formData.value.stdYear = resStdYear;
      })
      .onCancel(() => {})
      .onDismiss(() => {
        // 확인/취소 모두 실행되었을때
        isDialogVisible.value = true;
      });
  } else {
    isDialogVisible.value = true;
  }
};

const rowData = reactive({ rows: [], rowsSel: [] });

// grid Height 자동처리부분
const gridHeight = ref(200); // 초기 높이
const gridHeightSelect = ref(135); // 초기 높이
const rowHeight = 46; // 행당 높이 (예: 25px)
const minHeight = ref(90); // 최소 높이 (예: 300px) rowHeight의 3배
const minHeightSel = ref(135); // 최소 높이 (예: 300px) rowHeight의 3배

const $q = useQuasar();
let isSaveFg = null;
const gridKey = ref(0);

const contentZoneHeight = ref(300);
const contentZoneStyle = computed(() => ({
  height: `${contentZoneHeight.value}px`,
}));

const gridApi = ref(null);
const gridApiSel = ref(null);
const onGridReady = params => {
  gridApi.value = params.api;
  gridApi.value.setGridOption('headerHeight', 45);
  gridApi.value.setGridOption('rowHeight', 45);
  gridApi.value.deselectAll();
};
const onGridReadySel = params => {
  gridApiSel.value = params.api;
  gridApiSel.value.setGridOption('headerHeight', 45);
  gridApiSel.value.setGridOption('rowHeight', 45);
  if (rowData.rowsSel.length > 0) {
    totalComputeWeight();
  }
  gridApiSel.value.deselectAll();
};
const defaultColDef = reactive({
  group: {
    flex: 1,
    sortable: true,
    filter: true,
    floatingFilter: false,
    editable: false,
  },
  columns: {
    flex: 1,
    sortable: true,
    filter: true,
    floatingFilter: false,
    editable: false,
  },
});
const columnDefs = reactive({
  group: [
    {
      headerName: '',
      field: '',
      sortable: false,
      filter: false,
      maxWidth: 60,
      minWidth: 60,
      pinned: 'left',
      cellStyle: { textAlign: 'center' },
      checkboxSelection: true,
      headerCheckboxSelection: true,
    },
    {
      headerName: '성명',
      field: 'evtEmpNm',
      minWidth: 80,
      maxWidth: 80,
      resizable: true,
    },
    {
      headerName: '소속팀',
      field: 'evtDeptNm',
      minWidth: 100,
      resizable: true,
    },
    {
      headerName: '직급',
      field: 'evtTitlNm',
      minWidth: 80,
      maxWidth: 80,
      resizable: true,
    },
    {
      headerName: '진행상태',
      marryChildren: true,
      children: [
        {
          headerName: '목표진행',
          field: 'authCnt0',
          minWidth: 100,
          maxWidth: 100,
          cellStyle: params => {
            if (params.data.authCnt0 > 0) {
              return $q.dark.isActive ? { color: 'teal', textAlign: 'center' } : { color: 'teal', textAlign: 'center' };
            } else {
              return { textAlign: 'center' };
            }
          },
        },
        {
          headerName: '자기평가',
          field: 'authCnt3',
          minWidth: 100,
          maxWidth: 100,
          cellStyle: params => {
            if (params.data.authCnt3 > 0) {
              return $q.dark.isActive ? { color: 'grey', textAlign: 'center' } : { color: 'grey', textAlign: 'center' };
            } else {
              return { textAlign: 'center' };
            }
          },
        },
        {
          headerName: '평가대기',
          field: 'authCnt4',
          minWidth: 100,
          maxWidth: 100,
          cellStyle: params => {
            if (params.data.authCnt4 > 0) {
              return $q.dark.isActive ? { color: 'orange', textAlign: 'center' } : { color: 'orange', textAlign: 'center' };
            } else {
              return { textAlign: 'center' };
            }
          },
        },
        {
          headerName: '평가완료',
          field: 'authCnt5',
          minWidth: 100,
          maxWidth: 100,
          cellStyle: params => {
            if (params.data.authCnt5 > 0) {
              return $q.dark.isActive ? { color: 'blue', textAlign: 'center' } : { color: 'blue', textAlign: 'center' };
            } else {
              return { textAlign: 'center' };
            }
          },
        },
      ],
    },
  ],
  columns: [
    {
      headerName: '',
      field: '',
      sortable: false,
      filter: false,
      maxWidth: 60,
      minWidth: 60,
      pinned: 'left',
      cellStyle: { textAlign: 'center' },
      checkboxSelection: params => params.data.status === '4',
      headerCheckboxSelection: true,
    },
    {
      headerName: '순번',
      field: 'seq',
      minWidth: 80,
      maxWidth: 80,
      resizable: true,
    },
    {
      headerName: '목표',
      field: 'targetDoc',
      minWidth: 100,
      resizable: true,
    },
    {
      headerName: '가중치',
      field: 'weight',
      minWidth: 90,
      maxWidth: 90,
      cellStyle: { textAlign: 'center' },
      resizable: true,
    },
    {
      headerName: '자기점수',
      field: 'selfPoint',
      minWidth: 100,
      maxWidth: 100,
      cellStyle: { textAlign: 'center' },
      resizable: true,
    },
    {
      headerName: '평가점수',
      field: 'markPoint',
      minWidth: 100,
      maxWidth: 100,
      cellStyle: { textAlign: 'center' },
      resizable: true,
    },
    {
      headerName: '진행상태',
      field: 'statusNm',
      minWidth: 110,
      maxWidth: 110,
      cellStyle: params => {
        switch (params.data.status) {
          case '0':
            return null;
          case '1':
            return $q.dark.isActive ? { color: 'orange' } : { color: 'orange' };
          case '2':
            return $q.dark.isActive ? { color: 'red' } : { color: 'red' };
          case '3':
            return $q.dark.isActive ? { color: 'pink' } : { color: 'purple' };
          case '4':
            return $q.dark.isActive ? { color: 'lime' } : { color: 'teal' };
          case '5':
            return $q.dark.isActive ? { color: 'cyan' } : { color: 'blue' };
          default:
            return null;
        }
      },
    },
  ],
});
let totalWeight = 0;
const totalComputeWeight = () => {
  console.log('row : ', rowData.rowsSel);
  totalWeight = 0;
  totalWeight = rowData.rowsSel.reduce((sum, item) => sum + item.weight, 0);
  const pinnedBottomRowData = [
    {
      targetDoc: '가중치 합계',
      weight: totalWeight,
    },
  ];
  gridApiSel.value.setPinnedBottomRowData(pinnedBottomRowData);
};

onBeforeUnmount(() => {
  // Remove the resize event listener when the component is destroyed
  window.removeEventListener('resize', handleResize);
});
onBeforeMount(() => {
  getData();
});

onMounted(() => {
  window.addEventListener('resize', handleResize);
  handleResize();
});

const formData = ref({
  stdYear: '',
  evtEmpCd: '',
  seq: 0,
  returnDoc: '',
  status: '',
});

const selectedRows = ref([]);
const selectedRowsSel = ref([]);
const onSelectionChanged = event => {
  selectedRows.value = event.api.getSelectedRows();
  // console.log('sel: ', JSON.stringify(selectedRows.value));
  if (selectedRows.value.length > 0) {
    getDataSelectList(selectedRows.value[0].stdYear, selectedRows.value[0].evsEmpCd, selectedRows.value[0].evtEmpCd);
  } else {
    getDataSelectList();
  }
};
const viewPoint = ref({
  selfPoint: 0,
  markPoint: 0,
});
const onSelectionChangedSel = event => {
  selectedRowsSel.value = event.api.getSelectedRows();

  let tmpSelfAddPoint = 0;
  let tmpSelfAddCnt = 0;
  let tmpMarkAddPoint = 0;
  let tmpMarkAddCnt = 0;
  event.api.forEachNodeAfterFilterAndSort(node => {
    if (node.data.selfPoint > 0) {
      tmpSelfAddCnt++;
      tmpSelfAddPoint += node.data.selfPoint;
    }
    if (node.data.markPoint > 0) {
      tmpMarkAddCnt++;
      tmpMarkAddPoint += node.data.markPoint;
    }
  });
  // viewPoint.value.selfPoint = (tmpSelfAddPoint / tmpSelfAddCnt).toFixed(1);
  // viewPoint.value.markPoint = (tmpMarkAddPoint / tmpMarkAddCnt).toFixed(1);
  viewPoint.value.selfPoint = tmpSelfAddCnt !== 0 ? parseFloat((tmpSelfAddPoint / tmpSelfAddCnt).toFixed(1)) : 0.0;
  viewPoint.value.markPoint = tmpMarkAddCnt !== 0 ? parseFloat((tmpMarkAddPoint / tmpMarkAddCnt).toFixed(1)) : 0.0;
  // console.log('aa : ', viewPoint.value.markPoint, tmpMarkAddPoint, ' / ', tmpMarkAddCnt);
};
// ======================================================
const screenSizeHeight = ref(0);
const myTweak = offset => {
  screenSizeHeight.value = offset;
  return { minHeight: offset ? `calc(100vh - ${offset}px)` : '100vh' };
};
const handleResize = () => {
  contentZoneHeight.value = window.innerHeight - screenSizeHeight.value - 520;
};
// ======================================================

const saveDataSendSection = (resStdYear, resEmpCd, resSeq, resStatus) => {
  $q.dialog({
    dark: true,
    title: '승인하기',
    message: '목표요청 자료를 승인합니다. ',
    // persistent: true,
  })
    .onOk(() => {
      if (resStatus === '1') {
        formData.value.status = '3'; // 승인취소
      } else {
        formData.value.status = '1'; // 목표승인
      }
      formData.value.stdYear = resStdYear;
      formData.value.evtEmpCd = resEmpCd;
      formData.value.seq = resSeq;
      saveDataAndHandleResult(jsonUtil.dataJsonParse('S', formData.value));
      console.log('form : ', JSON.stringify(formData.value));
    })
    .onCancel(() => {})
    .onDismiss(() => {
      // 확인/취소 모두 실행되었을때
    });
  // console.log('save data::: ', JSON.stringify(formData.value));
};

const saveDataReturnSection = () => {
  $q.dialog({
    dark: true,
    title: '반려하기',
    message: '목표요청 자료를 반려합니다. ',
    // persistent: true,
  })
    .onOk(() => {
      formData.value.status = '2';
      saveDataAndHandleResult(jsonUtil.dataJsonParse('S', formData.value));
    })
    .onCancel(() => {})
    .onDismiss(() => {
      // 확인/취소 모두 실행되었을때
    });
  // console.log('save data::: ', JSON.stringify(formData.value));
};

// **************************************************************//
// ***** DataBase 연결부분    *************************************//
// **************************************************************//

// ***** 목표승인대상자 집계리스트 가져오기 부분  *****************************//
const viewStatus = ref({
  totalCnt: 0,
  status_0: 0,
  status_3: 0,
  status_4: 0,
  status_5: 0,
});
const getData = async () => {
  try {
    const response = await api.post('/api/hpe/hpe2020_list', { paramSetYear: storeYear.setYear, paramEmpCd: storeUser.setEmpCd });
    rowData.rows = response.data.data;
    // console.log('aa : ', JSON.stringify(response.data.data));
    if (rowData.rows.length === 0) {
      minHeight.value = 220;
    }
    const calculatedHeight = rowData.rows.length * rowHeight;
    gridHeight.value = minHeight.value + calculatedHeight;

    viewStatus.value.totalCnt = 0;
    viewStatus.value.status_0 = 0;
    viewStatus.value.status_3 = 0;
    viewStatus.value.status_4 = 0;
    viewStatus.value.status_5 = 0;
    for (let i = 0; i < rowData.rows.length; i++) {
      viewStatus.value.totalCnt += rowData.rows[i].authCnt0 + rowData.rows[i].authCnt3 + rowData.rows[i].authCnt4 + rowData.rows[i].authCnt5;
      viewStatus.value.status_0 += rowData.rows[i].authCnt0;
      viewStatus.value.status_3 += rowData.rows[i].authCnt3;
      viewStatus.value.status_4 += rowData.rows[i].authCnt4;
      viewStatus.value.status_5 += rowData.rows[i].authCnt5;
    }

    // console.log('getData : ', JSON.stringify(rowData.rows));
  } catch (error) {
    console.error('Error fetching users:', error);
  }
};

// ***** 목표승인대상자 승인대상자료 목록 자료 가져오기 부분  *****************************//
const getDataSelectList = async (resStdYear, resEvsEmpCd, resEvtEmpCd) => {
  try {
    const response = await api.post('/api/hpe/hpe2020_select_list', {
      paramSetYear: resStdYear,
      paramEvsEmpCd: resEvsEmpCd,
      paramEvtEmpCd: resEvtEmpCd,
    });
    rowData.rowsSel = response.data.data;
    // alert(rowData.rowsSel.length);
    if (rowData.rowsSel.length > 0) {
      minHeightSel.value = 90;
    } else {
      minHeightSel.value = 135;
    }
    const calculatedHeight = rowData.rowsSel.length * rowHeight;
    gridHeightSelect.value = minHeightSel.value + calculatedHeight;

    gridKey.value += 1;
    // console.log('getData : ', JSON.stringify(rowData.rows));
  } catch (error) {
    console.error('Error fetching users:', error);
  }
};

// ***** 자료저장 및 삭제 처리부분 *****************************//
// saveStatus = 0=수정성공 1=신규성공 2=삭제성공 3=수정에러 4=시스템에러
const saveDataAndHandleResult = resFormData => {
  console.log('form data : ', JSON.stringify(resFormData));
  api
    .post('/api/hpe/hpe2010_save', resFormData)
    .then(res => {
      let saveStatus = {};
      if (res.data.rtn === '0') {
        saveStatus.rtn = 1;
        saveStatus.rtn1 = res.data.rtnMsg1;
        saveStatus.rtn2 = '자료저장 완료';
      } else {
        saveStatus.rtn = res.data.rtn;
        saveStatus.rtn1 = res.data.rtnMsg1;
        saveStatus.rtn2 = res.data.rtnMsg2;
      }
      notifySave.notifyView(saveStatus);
      getData();
    })
    .catch(error => {
      console.log('error: ', error);
    });
};

// **************************************************************//
// ***** DataBase 연결부분 끝  *************************************//
// **************************************************************//

const gridOptions = {
  localeText: { noRowsToShow: '조회 결과가 없습니다.' },
};
const gridOptionsSel = {
  suppressRowClickSelection: true, // Disable row selection on click
  rowSelection: 'multiple',
  isRowSelectable: function (node) {
    return node.data.status === '4';
  },
  getRowStyle: params => {
    if (params.node.rowPinned) {
      return { backgroundColor: 'lightblue' };
    }
  },
  localeText: { noRowsToShow: '조회 결과가 없습니다.' },
};
</script>
<style lang="scss" scoped></style>

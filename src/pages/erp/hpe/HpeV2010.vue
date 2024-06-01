<template>
  <q-page class="q-pa-xs-xs q-pa-sm-md" :style-fn="myTweak">
    <q-card class="q-pa-sm">
      <div class="row">
        <div class="col-xs-12 col-sm-8">
          <div class="row q-col-gutter-x-sm">
            <div class="col-xs-12 col-sm-6">
              <q-banner rounded :class="$q.dark.isActive ? 'bg-grey-9' : 'bg-grey-3'">
                <template v-slot:avatar>
                  <q-icon name="menu_book" color="primary" size="md" />
                </template>
                <span class="text-subtitle1 text-bold"> 목표에 대한 성과를 등록 작업입니다.</span><br />
                1. <span class="text-teal text-bold">승인완료</span> 자료만 등록하실 수 있습니다.<br />
                2. 등록이 완료된 자료는 <span class="text-indigo text-bold">평가요청</span>을 진행합니다.<br />
              </q-banner>
            </div>
            <div class="col-xs-12 col-sm-6">
              <q-banner rounded :class="$q.dark.isActive ? 'bg-grey-9' : 'bg-grey-3'">
                <template v-slot:avatar>
                  <q-icon name="money" color="primary" size="md" />
                </template>
                <span class="text-subtitle1 text-bold"> 자기평가점수 Point설정</span><br />
                <div class="row">
                  <div class="col">1. <span class="text-teal text-bold">S</span> ( 100 )</div>
                  <div class="col">2. <span class="text-teal text-bold">A</span> ( 90 )</div>
                  <div class="col">3. <span class="text-teal text-bold">B</span> ( 80 )</div>
                </div>
                <div class="row">
                  <div class="col"></div>
                  <div class="col">4. <span class="text-teal text-bold">C</span> ( 70 )</div>
                  <div class="col">5. <span class="text-teal text-bold">D</span> ( 60 )</div>
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
              <q-breadcrumbs-el icon="room_preferences" :label="setEvGroup.evsGroup.deptNm" style="width: 90px" />
              <q-breadcrumbs-el icon="star" :label="setEvGroup.evsGroup.titlNm" style="width: 60px" />
              <q-breadcrumbs-el icon="person" :label="setEvGroup.evsGroup.empNm" style="width: 70px" />
            </q-breadcrumbs>
          </div>
        </div>
      </div>
    </q-card>

    <q-separator spaced />

    <q-card>
      <q-card-section class="text-center q-pa-sm" :class="$q.dark.isActive ? 'bg-teal-7' : 'bg-teal-3'">
        <q-item-label class="text-h6">목표성과 / 승인하기</q-item-label>
      </q-card-section>
      <q-separator size="3px" class="q-mb-xs" />

      <div class="row">
        <div class="col-xs-12 col-lg-5">
          <q-card-section>
            <q-toolbar class="row q-pa-none">
              <div class="q-gutter-xs">
                <q-btn outline color="grey" dense @click="getData"
                  ><q-icon name="refresh" size="xs" class="q-mr-xs" />
                  다시 불러오기
                </q-btn>
              </div>
              <q-space />
            </q-toolbar>
            <div :key="gridKey" :style="{ height: gridHeight + 'px' }">
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
            <q-card class="q-mt-sm">
              <span class="q-pa-sm text-bold text-subtitle1 self-center"> 대상자 목표승인 대기자료</span>
              <div :key="gridKey" :style="{ height: gridHeightSelect + 'px' }">
                <ag-grid-vue
                  style="width: 100%; height: 100%"
                  :class="$q.dark.isActive ? 'ag-theme-alpine-dark' : 'ag-theme-alpine'"
                  :columnDefs="columnDefs.columns"
                  :rowData="rowData.rowsSel"
                  :defaultColDef="defaultColDef.columns"
                  rowSelection="multiple"
                  @selection-changed="onSelectionChangedSel"
                  @grid-ready="onGridReadySel"
                  :grid-options="gridOptions"
                >
                </ag-grid-vue>
              </div>
            </q-card>
          </q-card-section>
        </div>
        <div class="col-xs-12 col-lg-5"></div>
      </div>
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
import authHeader from 'boot/authHeader';
import notifySave from 'src/js_comm/notify-save';
import { QBtn, QIcon, useQuasar } from 'quasar';
import jsonUtil from 'src/js_comm/json-util';
import commUtil from 'src/js_comm/comm-util';
import CompSelectLevel from 'components/CompSelectLevel.vue';

const setEvsCd = ref('2011101'); // 성과평가 공통코드
const setEmpCd = ref('2198001'); // 엄원길
// const setEmpCd = ref('2195159');  // 이윤
// const setEmpCd = ref('2206004'); // 김진서
const setDEmpCd = ref('2198001'); // 엄원길

// 기준평가자연결정보
const setEvGroup = reactive({
  evsGroup: {
    empCd: '2198001',
    empNm: '엄원길',
    deptCd: '105',
    deptNm: '총무부',
    titlCd: '102',
    titlNm: 'M1',
  },
  evtGroup: {
    empCd: '',
    empNm: '',
    deptCd: '',
    deptNm: '',
    titlCd: '',
    titlNm: '',
  },
});
// 기준평가기간 적용부분
const setYearGroup = ref({
  setYear: '',
  setFg: '',
  setLocCh: '',
});

const rowData = reactive({ rows: [], rowsSel: [] });

// grid Height 자동처리부분
const gridHeight = ref(300); // 초기 높이
const gridHeightSelect = ref(300); // 초기 높이
const rowHeight = 45; // 행당 높이 (예: 25px)
const minHeight = ref(45); // 최소 높이 (예: 300px) rowHeight의 3배
const minHeightSel = ref(135); // 최소 높이 (예: 300px) rowHeight의 3배

const $q = useQuasar();
let isSaveFg = null;
const gridKey = ref(0);

const contentZoneHeight = ref(300);
const contentZoneStyle = computed(() => ({
  height: `${contentZoneHeight.value}px`,
}));

const focusStart = ref(null);

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
  if (selectedRows.value.length > 0) {
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
      headerName: '대기',
      field: 'authCnt1',
      minWidth: 80,
      maxWidth: 80,
      cellStyle: params => {
        if (params.data.authCnt1 > 0) {
          return $q.dark.isActive ? { color: 'orange' } : { color: 'orange' };
        }
      },
    },
    {
      headerName: '반려',
      field: 'authCnt4',
      minWidth: 80,
      maxWidth: 80,
      cellStyle: params => {
        if (params.data.authCnt4 > 0) {
          return $q.dark.isActive ? { color: 'red' } : { color: 'red' };
        }
      },
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
      checkboxSelection: true,
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
      resizable: true,
    },
    {
      headerName: '진행상태',
      field: 'statusNm',
      minWidth: 100,
      maxWidth: 100,
      cellStyle: params => {
        switch (params.data.status) {
          case '0':
            return null;
          case '1':
            return $q.dark.isActive ? { color: 'orange' } : { color: 'orange' };
          case '2':
            return $q.dark.isActive ? { color: 'lime' } : { color: 'teal' };
          case '3':
            return $q.dark.isActive ? { color: 'pink' } : { color: 'purple' };
          case '4':
            return $q.dark.isActive ? { color: 'red' } : { color: 'red' };
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
const getStorgeSetYearGroup = () => {
  const _value = $q.localStorage.getItem('setYearGroup').split('|');
  setYearGroup.value.setYear = _value[0];
  setYearGroup.value.setFg = _value[1];
  setYearGroup.value.setLocCh = _value[2];
  // console.log('Sub SetYear Group :: ', setYearGroup.value.setYear, setYearGroup.value.setFg, setYearGroup.value.setLocCh);
};
// 기준평가기간 적용부분 끝

onBeforeUnmount(() => {
  // Remove the resize event listener when the component is destroyed
  window.removeEventListener('resize', handleResize);
});
onBeforeMount(() => {
  getStorgeSetYearGroup();

  getData();
});

onMounted(() => {
  window.addEventListener('resize', handleResize);
  handleResize();
});

const formReadonly = ref(true);
const oldFormData = ref(null);
const formData = ref({
  stdYear: '',
  empCd: '',
  seq: 0,
  targetDoc: '',
  evaS: '',
  evaA: '',
  evaB: '',
  evaC: '',
  evaD: '',
  weight: 0,
  workDoc: '',
  workPer: 0,
  markCh: '',
  markPoint: 0,
  status: '',
  statusDate: '00000000',
  returnDoc: '',
  iuD: '',
});

const formDataInitialize = () => {
  formData.value.stdYear = setYearGroup.value.setYear;
  formData.value.empCd = setEmpCd.value;
  formData.value.seq = 1;
  formData.value.targetDoc = '';
  formData.value.evaS = '';
  formData.value.evaA = '';
  formData.value.evaB = '';
  formData.value.evaC = '';
  formData.value.evaD = '';
  formData.value.weight = 0;
  formData.value.workDoc = '';
  formData.value.workPer = 0;
  formData.value.markCh = '';
  formData.value.markPoint = 0;
  formData.value.status = '';
  formData.value.statusDate = '00000000';
  formData.value.returnDoc = '';
  formData.value.iuD = 'I';
};

const selectedRows = ref([]);
const selectedRowsSel = ref([]);
const onSelectionChanged = event => {
  selectedRows.value = event.api.getSelectedRows();
  console.log('sel: ', JSON.stringify(selectedRows.value));
  if (selectedRows.value.length > 0) {
    getDataSelectList(selectedRows.value[0].stdYear, selectedRows.value[0].evsEmpCd, selectedRows.value[0].evtEmpCd);
  }
};
const onSelectionChangedSel = event => {
  selectedRowsSel.value = event.api.getSelectedRows();
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

const saveDataSection = () => {
  if (isEqual(formData.value, oldFormData.value)) {
    $q.dialog({
      dark: true,
      title: '안내',
      message: '변경된 자료가 없습니다. ',
      // persistent: true,
    })
      .onOk(() => {})
      .onCancel(() => {})
      .onDismiss(() => {
        // 확인/취소 모두 실행되었을때
      });
  } else {
    // console.log('save data::: ', JSON.stringify(formData.value));
    saveDataAndHandleResult(jsonUtil.dataJsonParse(isSaveFg, formData.value));
  }
};

const clearFieldSection = () => {
  $q.dialog({
    dark: true,
    title: '자료 지우기',
    message:
      '선택된 자료의 입력항목을 모두 지우겠습니까? <br> 선택확인 하고 반드시 <span class="text-orange">저장</span> 버튼을 클릭해야 적용됩니다.',
    html: true,
    ok: {
      push: true,
      color: 'negative',
    },
    cancel: {
      push: true,
      color: 'grey-7',
    },
    // persistent: true,
  })
    .onOk(() => {
      formData.value.workDoc = '';
      formData.value.markCh = '';
      formData.value.markPoint = 0;
      formData.value.workPer = 0;
    })
    .onCancel(() => {})
    .onDismiss(() => {
      // 확인/취소 모두 실행되었을때
    });
};
// **************************************************************//
// ***** DataBase 연결부분    *************************************//
// **************************************************************//

// ***** 목표승인대상자 집계리스트 가져오기 부분  *****************************//
let maxSeq = 0;
const getData = async () => {
  console.log('param: ', setYearGroup.value.setYear, setEmpCd.value);
  try {
    const response = await api.post(
      '/api/hpe/hpe2010_list',
      { paramSetYear: setYearGroup.value.setYear, paramEmpCd: setEmpCd.value },
      { headers: authHeader() },
    );
    rowData.rows = response.data.data;

    if (rowData.rows.length === 0) {
      minHeight.value = 90;
    }
    const calculatedHeight = rowData.rows.length * rowHeight;
    gridHeight.value = minHeight.value + calculatedHeight;

    gridKey.value += 1;
    // console.log('getData : ', JSON.stringify(rowData.rows));
  } catch (error) {
    console.error('Error fetching users:', error);
  }
};

// ***** 목표승인대상자 승인대상자료 목록 자료 가져오기 부분  *****************************//
const getDataSelectList = async (resStdYear, resEvsEmpCd, resEvtEmpCd) => {
  try {
    const response = await api.post(
      '/api/hpe/hpe2010_select_list',
      { paramSetYear: resStdYear, paramEvsEmpCd: resEvsEmpCd, paramEvtEmpCd: resEvtEmpCd },
      { headers: authHeader() },
    );
    rowData.rowsSel = response.data.data;

    if (rowData.rowsSel.length > 0) {
      minHeightSel.value = 90;
    }
    const calculatedHeight = rowData.rowsSel.length * rowHeight;
    gridHeightSelect.value = minHeightSel.value + calculatedHeight;

    gridKey.value += 1;
    // console.log('getData : ', JSON.stringify(rowData.rows));
  } catch (error) {
    console.error('Error fetching users:', error);
  }
};

// ***** 선택한 성과/목표정보 목록 자료 가져오기 부분  *****************************//
const getDataSelect = async () => {
  try {
    const response = await api.post(
      '/api/hpe/hpe2010_select',
      {
        paramSetYear: setYearGroup.value.setYear,
        paramEmpCd: selectedRows.value[0].empCd,
        paramSeq: selectedRows.value[0].seq,
      },
      { headers: authHeader() },
    );
    formData.value = response.data.data[0];
    console.log('getSelect1 : ', JSON.stringify(response.data.data[0]));
    oldFormData.value = JSON.parse(JSON.stringify(formData.value)); // 초기자료 저장
    console.log('getSelect2 : ', JSON.stringify(formData.value));
  } catch (error) {
    console.error('Error fetching users:', error);
  }
};

// ***** 자료저장 및 삭제 처리부분 *****************************//
// saveStatus = 0=수정성공 1=신규성공 2=삭제성공 3=수정에러 4=시스템에러
const saveDataAndHandleResult = resFormData => {
  console.log('form data : ', JSON.stringify(resFormData));
  api
    .post('/api/hpe/hpe2010_save', resFormData, { headers: authHeader() })
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

const byteCount = ref(0);
const updateByteCount = () => {
  const encoder = new TextEncoder();
  byteCount.value = encoder.encode(formData.value.targetDoc).length;
};

const gridOptions = {
  localeText: { noRowsToShow: '조회 결과가 없습니다.' },
};
</script>
<style lang="scss" scoped></style>

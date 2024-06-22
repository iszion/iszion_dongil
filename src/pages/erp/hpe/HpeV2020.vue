<template>
  <q-page class="q-pa-xs-xs q-pa-sm-md" :style-fn="myTweak">
    <q-card class="q-pa-sm">
      <div class="row">
        <div class="col-xs-12 col-sm-12 col-lg-8">
          <q-banner rounded :class="$q.dark.isActive ? 'bg-grey-9' : 'bg-grey-3'" style="height: 100%">
            <template v-slot:avatar>
              <q-icon name="menu_book" color="primary" size="md" />
            </template>
            <span class="text-subtitle1 text-bold"> 목표에대한 성과및업적에 대한 평가작업입니다.</span><br />
            1. <span class="text-teal text-bold">평가대기</span> 자료만 평가하실 수 있습니다.<br />
            2. 선택한 직원의 평가완료 시 <span class="text-teal text-bold">평가마감</span>버튼이 활성화됩니다.<br />
          </q-banner>
        </div>
        <div class="col-xs-12 col-sm-12 col-lg-4">
          <q-card class="q-ml-sm-md q-pa-sm" :class="$q.screen.xs ? 'q-mt-xs' : 'row flex-center'" style="height: 100%">
            <div class="row">
              <q-space />
              <span class="text-bold text-subtitle2 q-pr-sm text-orange">평가자<q-icon name="chevron_right" size="xs" /></span>
              <q-breadcrumbs separator="|" class="text-orange text-bold" active-color="secondary">
                <q-breadcrumbs-el icon="room_preferences" :label="storeUser.setDeptNm" style="width: 90px" />
                <q-breadcrumbs-el icon="star" :label="storeUser.setTitlNm" style="width: 60px" />
                <q-breadcrumbs-el icon="person" :label="storeUser.setEmpNm" style="width: 70px" />
              </q-breadcrumbs>
            </div>
          </q-card>
        </div>
      </div>
    </q-card>

    <q-separator spaced />

    <q-card class="q-pa-sm">
      <q-card-section class="text-center q-pa-sm q-mb-sm" :class="$q.dark.isActive ? 'bg-teal-7' : 'bg-teal-3'">
        <q-item-label class="text-h6">성과,업적 / 평가하기</q-item-label>
      </q-card-section>

      <div ref="gridZone" class="row q-col-gutter-x-lg">
        <div class="col-xs-12 col-md-12 col-lg-4">
          <q-card class="q-pa-sm">
            <q-toolbar class="row q-pa-none">
              <q-avatar color="red" text-color="white" size="md">1번</q-avatar>
              <q-space />
              <q-btn outline color="grey" dense @click="getData"
                ><q-icon name="refresh" size="xs" class="q-mr-xs" />
                다시 불러오기
              </q-btn>
            </q-toolbar>
            <div :style="{ height: gridHeight + 30 + 'px' }">
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
        <div class="col-xs-12 col-md-12 col-lg-8">
          <!--      {{ contentZoneHeight }} = {{ state.height }}-->
          <q-card class="q-pa-xs">
            <q-toolbar class="row q-pa-none">
              <q-avatar color="red" text-color="white" size="md">2번</q-avatar>
              <q-space />
              <div class="row q-gutter-x-sm">
                <q-btn
                  v-if="sendCheck.lockBtn"
                  outline
                  color="primary"
                  dense
                  class="q-pr-md q-ml-sm"
                  @click="saveDataEvalOkSendSection(sendCheck.cnt)"
                >
                  <q-badge color="orange" floating>{{ sendCheck.cnt }}</q-badge>
                  <q-icon name="lock" size="xs" class="q-mr-xs" />
                  평가마감하기
                </q-btn>
                <q-btn
                  v-if="sendCheck.initialize > 0"
                  outline
                  color="deep-orange"
                  dense
                  class="q-pr-md q-ml-sm"
                  @click="deleteDataSection(sendCheck.cnt)"
                >
                  <q-badge color="orange" floating>{{ sendCheck.cnt }}</q-badge>
                  <q-icon name="delete" size="xs" class="q-mr-xs" />
                  평가초기화
                </q-btn>
              </div>
            </q-toolbar>
            <div class="row">
              <q-card flat bordered style="width: 100%" v-for="data in rowData.rowsSel" :key="data.seq" class="q-mb-sm">
                <div class="row">
                  <q-card class="col-xs-12 col-sm-1">
                    <div class="bg-deep-orange-3 text-center text-subtitle2 text-bold q-px-xs">순번</div>
                    <div class="text-center q-pa-xs" :class="$q.screen.xs ? '' : 'row flex-center'" style="height: 100%">
                      {{ data.seq }}
                    </div>
                  </q-card>
                  <q-card class="col-xs-12 col-sm-4">
                    <div class="bg-deep-orange-3 text-center text-subtitle2 text-bold q-px-xs">목표설정</div>
                    <div class="q-pa-xs" v-html="data.targetDoc"></div>
                  </q-card>
                  <q-card class="col-xs-12 col-sm-2">
                    <div class="bg-deep-orange-3 text-center text-subtitle2 text-bold q-px-xs">기준설정</div>
                    <div class="q-pa-xs">
                      <span class="q-px-sm"> 1. {{ data.evaS }}<br /> </span>
                      <span class="q-px-sm"> 2. {{ data.evaA }}<br /> </span>
                      <span class="q-px-sm"> 3. {{ data.evaB }}<br /> </span>
                      <span class="q-px-sm"> 4. {{ data.evaC }}<br /> </span>
                      <span class="q-px-sm"> 5. {{ data.evaD }} </span>
                    </div>
                  </q-card>
                  <q-card class="col-xs-12 col-sm-3">
                    <div class="bg-deep-orange-3 text-center text-subtitle2 text-bold q-px-xs">성과/업적</div>
                    <div class="q-pa-xs" v-html="data.workDoc"></div>
                  </q-card>
                  <q-card class="col-xs-12 col-sm-1">
                    <div class="bg-deep-orange-3 text-center text-subtitle2 text-bold q-px-xs">가중치</div>
                    <div class="text-center q-pa-xs" :class="$q.screen.xs ? '' : 'row flex-center'" style="height: 100%">
                      {{ data.weight }}
                    </div>
                  </q-card>
                  <q-card class="col-xs-12 col-sm-1">
                    <div class="bg-deep-orange-3 text-center text-subtitle2 text-bold q-px-xs">자기평가</div>
                    <div class="text-center q-pa-xs" :class="$q.screen.xs ? '' : 'row flex-center'" style="height: 100%">
                      {{ data.selfPoint }}
                    </div>
                  </q-card>
                </div>
                <q-card bordered class="bg-blue-grey-2 q-mt-xs">
                  <div class="row">
                    <div
                      class="col-xs-12 col-sm-5 text-center self-center text-subtitle1 text-bold"
                      :class="$q.screen.xs ? '' : 'row flex-center'"
                      style="height: 100%"
                    >
                      평가하기
                    </div>
                    <div class="col-xs-12 col-sm-5 text-center">
                      <q-radio
                        keep-color
                        v-model="data.markCh"
                        :disable="formReadonly"
                        val="S"
                        label="S"
                        color="deep-orange"
                        class="text-subtitle1 text-bold"
                        @update:model-value="val => handlePointClick(val, data)"
                      />
                      <q-radio
                        keep-color
                        v-model="data.markCh"
                        :disable="formReadonly"
                        val="A"
                        label="A"
                        color="blue"
                        class="text-subtitle1 text-bold"
                        @update:model-value="val => handlePointClick(val, data)"
                      />
                      <q-radio
                        keep-color
                        v-model="data.markCh"
                        :disable="formReadonly"
                        val="B"
                        label="B"
                        color="cyan"
                        class="text-subtitle1 text-bold"
                        @update:model-value="val => handlePointClick(val, data)"
                      />
                      <q-radio
                        keep-color
                        v-model="data.markCh"
                        :disable="formReadonly"
                        val="C"
                        label="C"
                        color="teal"
                        class="text-subtitle1 text-bold"
                        @update:model-value="val => handlePointClick(val, data)"
                      />
                      <q-radio
                        keep-color
                        v-model="data.markCh"
                        :disable="formReadonly"
                        val="D"
                        label="D"
                        color="green"
                        class="text-subtitle1 text-bold"
                        @update:model-value="val => handlePointClick(val, data)"
                      />
                    </div>
                    <div class="col-xs-12 col-sm-2 text-center self-center text-subtitle1 text-bold">평가점수 : {{ data.markPoint }}</div>
                  </div>
                </q-card>
              </q-card>
            </div>
            <!--        </q-scroll-area>-->
          </q-card>
        </div>
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
import { computed, onBeforeMount, onBeforeUnmount, onMounted, onUpdated, reactive, ref, watch } from 'vue';
import { isEmpty, isEqual } from 'lodash';
import { api } from 'boot/axios';
import notifySave from 'src/js_comm/notify-save';
import { QBtn, QIcon, QToggle, useQuasar } from 'quasar';
import jsonUtil from 'src/js_comm/json-util';
import { useUserInfoStore } from 'src/store/setUserInfo';
import { useYearInfoStore } from 'src/store/setYearInfo';
const storeUser = useUserInfoStore();
const storeYear = useYearInfoStore();

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

const rowData = reactive({ rows: [] });
const formReadonly = ref(false);

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

const defaultColDef = reactive({
  group: {
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
      headerName: '#',
      width: 50,
      pinned: 'left',
      sortable: false,
      filter: false,
      valueGetter: function (params) {
        return params.node.rowIndex + 1;
      },
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
      field: 'statusMessage',
      minWidth: 105,
      maxWidth: 105,
      cellStyle: params => {
        return getStatusMessageStyle(params.data);
      },
    },
  ],
});
const getStatusMessageStyle = data => {
  if (data.statusMessage === '평가중') {
    return $q.dark.isActive ? { color: 'teal' } : { color: 'teal' };
  } else if (data.statusMessage === '평가완료') {
    return $q.dark.isActive ? { color: 'orange' } : { color: 'blue' };
  } else if (data.statusMessage === '평가마감') {
    return $q.dark.isActive ? { color: 'red' } : { color: 'red' };
  } else {
    return {};
    // return { textAlign: 'center' };
  }
};

onBeforeUnmount(() => {
  console.log('onBeforeUnmount....');
  // Remove the resize event listener when the component is destroyed
  window.removeEventListener('resize', handleResize);
});
onBeforeMount(() => {
  console.log('onBeforeMount....');
  getData();
});

const gridZone = ref(null);
const state = reactive({
  height: 0,
});
onMounted(() => {
  console.log('onMounted....');
  window.addEventListener('resize', handleResize);
  handleResize();
  if (gridZone.value) {
    state.height = gridZone.value.clientHeight;
    console.log('size 1 : ', state.height);
  }
});

onUpdated(() => {
  console.log('onUpdated....');
  if (gridZone.value) {
    state.height = gridZone.value.clientHeight;
    console.log('size 2 : ', state.height);
  }
});

const formData = ref({
  stdYear: '',
  evtEmpCd: '',
  seq: 0,
  returnDoc: '',
  status: '',
});

const sendCheck = ref({
  lock: false,
  lockBtn: false,
  initialize: false,
  cnt: 0,
});

const selectedRows = ref([]);
const onSelectionChanged = event => {
  selectedRows.value = event.api.getSelectedRows();
  // console.log('sel: ', JSON.stringify(selectedRows.value));
  sendCheck.value.lockBtn = false;
  sendCheck.value.initialize = false;
  formReadonly.value = false;
  sendCheck.value.cnt = 0;

  if (selectedRows.value.length === 1) {
    if (selectedRows.value[0].status > '3') {
      getDataSelectList(selectedRows.value[0]).then(() => {
        const evalCount = rowData.rowsSel.filter(item => item.markPoint > 0).length;
        // if (selectedRows.value[0].evalCount > 0) {
        //   sendCheck.value.initialize = true;
        //   sendCheck.value.cnt = selectedRows.value[0].evalCount;
        // }
        // 평가마감
        if (selectedRows.value[0].status === '5') {
          sendCheck.value.lockBtn = false;
          sendCheck.value.initialize = false;
          formReadonly.value = true;
        }
        if (selectedRows.value[0].status === '4' && selectedRows.value[0].workCount === evalCount) {
          sendCheck.value.initialize = true;
          sendCheck.value.lockBtn = true;
          sendCheck.value.cnt = evalCount;
        }
      });
    } else {
      rowData.rowsSel = [];
      $q.dialog({
        dark: true,
        title: '목표성과',
        html: true,
        message: '목표성과 작성중입니다. <br />목표성과작업 완료 후 작업이 가능합니다.',
      });
    }
  }
};

const handlePointClick = (val, resData) => {
  switch (val) {
    case 'S':
      resData.markPoint = 100;
      break;
    case 'A':
      resData.markPoint = 90;
      break;
    case 'B':
      resData.markPoint = 80;
      break;
    case 'C':
      resData.markPoint = 70;
      break;
    case 'D':
      resData.markPoint = 60;
      break;
    default:
      resData.markPoint = 0;
      break;
  }

  saveDataAndHandleResult(jsonUtil.dataJsonParse('I', resData));

  setTimeout(() => {
    const markPointCount = rowData.rowsSel.filter(item => item.markPoint > 0).length;
    statusMessageUpdate(markPointCount);
  }, 500);
};
const statusMessageUpdate = resEvalCount => {
  let selectedRow = gridApi.value.getSelectedNodes()[0];

  if (selectedRow.data.lockYn === 'Y') {
    selectedRow.data.statusMessage = '평가마감';
  } else if (resEvalCount === 0) {
    selectedRow.data.statusMessage = '평가대기';
  } else if (resEvalCount === selectedRow.data.workCount) {
    selectedRow.data.statusMessage = '평가완료';
    sendCheck.value.lockBtn = true;
    sendCheck.value.cnt = rowData.rowsSel.filter(item => item.markPoint > 0).length;
  } else {
    selectedRow.data.statusMessage = '평가중';
    sendCheck.value.initialize = true;
    sendCheck.value.cnt = rowData.rowsSel.filter(item => item.markPoint > 0).length;
  }
  getStatusMessageStyle(selectedRow.data);
  // 그리드에 변경 사항을 반영하도록 갱신합니다.
  gridApi.value.applyTransaction({ update: [selectedRow.data] });

  // 평가마감버튼 활성화 체크부분
  // const targetRowData = rowData.rows.find(item => item.workNo === selectedRow.data.workNo);
  // targetRowData.evalCount = resEvalCount;

  // const evalCount = rowData.rows.filter(item => item.evalCount > 0).length;
  // const markPointCount = rowData.rows.filter(item => rowData.rows.length !== item.evalCount).length;
  // sendCheck.value.lockBtn = evalCount === markPointCount;
  // console.log('ch :1: ', sendCheck.value.lock, evalCount, markPointCount);

  // if (resEvalCount > 0) {
  //   sendCheck.value.initialize = true;
  //   sendCheck.value.cnt = resEvalCount;
  // } else {
  //   sendCheck.value.initialize = false;
  // }
};

// ======================================================
const screenSizeHeight = ref(0);
const myTweak = offset => {
  screenSizeHeight.value = offset;
  return { minHeight: offset ? `calc(100vh - ${offset}px)` : '100vh' };
};
const handleResize = () => {
  contentZoneHeight.value = window.innerHeight - screenSizeHeight.value - 730;
  // contentZoneHeight.value = window.innerHeight - state.height - 680;
};
// ======================================================

const deleteDataSection = resCnt => {
  $q.dialog({
    dark: true,
    title: '평가초기화',
    message: '선택된 ' + resCnt + '건 평가자료를 모두 초기화 하시겠습니까? ',
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
      isSaveFg = 'D';

      let iu = [];
      let iuD = [];
      let formData = {};
      formData.stdYear = selectedRows.value[0].stdYear;
      formData.evsEmpCd = selectedRows.value[0].evsEmpCd;
      formData.evtEmpCd = selectedRows.value[0].evtEmpCd;
      let tmpJson = '{"mode": "' + isSaveFg + '","data":' + JSON.stringify(formData) + '}';
      iuD.push(tmpJson);
      saveDataAndHandleResult(jsonUtil.jsonFiller(iu, iuD));
      setTimeout(() => {
        getData();
      }, 500);
    })
    .onCancel(() => {})
    .onDismiss(() => {
      // 확인/취소 모두 실행되었을때
    });
};

// 성과평가 평가마감하기
const saveDataEvalOkSendSection = resCnt => {
  $q.dialog({
    dark: true,
    title: '평가마감하기',
    message: '선택된 ' + resCnt + '건의 평가자료를 모두 마감 하시겠습니까? ',
    ok: {
      push: true,
      color: 'orange',
    },
    cancel: {
      push: true,
      color: 'grey-7',
    },
    // persistent: true,
  })
    .onOk(() => {
      // 승인요청 시
      isSaveFg = 'S';

      let iu = [];
      let iuD = [];
      let formData = {};
      formData.stdYear = selectedRows.value[0].stdYear;
      formData.evsEmpCd = selectedRows.value[0].evsEmpCd;
      formData.evtEmpCd = selectedRows.value[0].evtEmpCd;
      formData.status = '5';
      formData.acceptYn = 'Y';
      formData.lockYn = 'Y';
      let tmpJson = '{"mode": "' + isSaveFg + '","data":' + JSON.stringify(formData) + '}';
      iu.push(tmpJson);
      saveDataAndHandleResult(jsonUtil.jsonFiller(iu, iuD));
      setTimeout(() => {
        getData();
      }, 500);
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
const viewStatus = ref({
  totalCnt: 0,
  status_0: 0,
  status_3: 0,
  status_4: 0,
  status_5: 0,
});
const getData = async () => {
  try {
    const response = await api.post('/api/hpe/hpe2020_list', { paramSetYear: storeYear.setYear, paramEvsEmpCd: storeUser.setEmpCd });
    rowData.rows = response.data.data;
    // console.log('aa : ', JSON.stringify(response.data.data));
    if (rowData.rows.length === 0) {
      minHeight.value = 220;
    }
    const calculatedHeight = rowData.rows.length * rowHeight;
    gridHeight.value = minHeight.value + calculatedHeight;
    rowData.rowsSel = [];

    // console.log('getData : ', JSON.stringify(rowData.rows));
  } catch (error) {
    console.error('Error fetching users:', error);
  }
};

// ***** 목표승인대상자 승인대상자료 목록 자료 가져오기 부분  *****************************//
const getDataSelectList = async resRow => {
  try {
    const response = await api.post('/api/hpe/hpe2020_select_list', {
      paramSetYear: resRow.stdYear,
      paramEvsEmpCd: resRow.evsEmpCd,
      paramEvtEmpCd: resRow.evtEmpCd,
    });

    rowData.rowsSel = response.data.data;

    // viewPoint.value.selfPoint = 0;
    // viewPoint.value.markPoint = 0;
    // sendCount.value.rowSelTotalCount = 0;
    // if (rowData.rowsSel.length) {
    //   sendCount.value.rowSelTotalCount = rowData.rowsSel.length;
    // }

    // formReadonly.value = true;
    // if (resRow.authCnt5 === 0) {
    //   formReadonly.value = false;
    //   checkCount();
    // }

    // alert(rowData.rowsSel.length);
    // if (rowData.rowsSel.length > 0) {
    //   minHeightSel.value = 90;
    // } else {
    //   minHeightSel.value = 135;
    // }
    // const calculatedHeight = rowData.rowsSel.length * rowHeight;
    // gridHeightSelect.value = minHeightSel.value + calculatedHeight;
    //
    // gridKey.value += 1;
    // console.log('getData : ', JSON.stringify(rowData.rows));
  } catch (error) {
    console.error('Error fetching users:', error);
  }
};

// ***** 자료저장 및 삭제 처리부분 *****************************//
// saveStatus = 평가점수 저장
const saveDataAndHandleResult = resFormData => {
  api
    .post('/api/hpe/hpe2020_save', resFormData)
    .then(res => {
      let saveStatus = {};
      saveStatus.rtn = res.data.rtn;
      saveStatus.rtnMsg = res.data.rtnMsg;
      notifySave.notifyView(saveStatus);
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
</script>
<style lang="scss" scoped></style>

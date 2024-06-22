<template>
  <q-page class="q-pa-xs-xs q-pa-sm-md" :style-fn="myTweak">
    <q-card class="q-pa-sm">
      <div class="row">
        <div class="col-xs-12 col-sm-12 col-lg-8">
          <q-banner rounded :class="$q.dark.isActive ? 'bg-grey-9' : 'bg-grey-3'" style="height: 100%">
            <template v-slot:avatar>
              <q-icon name="menu_book" color="primary" size="md" />
            </template>
            <span class="text-subtitle1 text-bold"> 1차 역량평가 평가작업입니다.</span><br />
            1. <span class="text-teal text-bold">진행상태</span>는 '평가완료', '진행중', '평가대기' 상태로 표기됩니다.
            <span class="text-teal text-bold">자료정리</span>버튼을 클릭하여 진행상태를 재정리 하실 수 있습니다.<br />
            2. 선택한 직원의 평가완료 시 <span class="text-blue text-bold">평가마감하기</span>버튼이 활성화됩니다.
            <span class="text-blue text-bold">평가마감하기</span>버튼 클릭 시 <span class="text-red text-bold">평가마감완료</span><br />
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
        <q-item-label class="text-h6">1차 역량평가하기 (항목기준) </q-item-label>
      </q-card-section>

      <div ref="gridZone" class="row q-col-gutter-x-lg">
        <div class="col-xs-12 col-md-12 col-lg-6">
          <q-card class="q-pa-sm">
            <q-toolbar class="row q-px-none">
              <q-avatar color="red" text-color="white" size="md">1번</q-avatar>
              <q-space />
              <div class="row q-gutter-x-xs">
                <q-btn outline color="grey" dense @click="getData">
                  <q-icon name="refresh" size="xs" class="q-mr-xs" />
                  자료정리
                </q-btn>
                <q-btn v-if="!sendCheck.lock && sendCheck.initialize" outline color="deep-orange" dense class="q-pr-md" @click="deleteDataSection()">
                  <q-icon name="delete" size="xs" class="q-mr-xs" />
                  <q-badge color="orange" floating>{{ sendCheck.cnt }}</q-badge>
                  초기화
                </q-btn>

                <q-btn v-if="sendCheck.lockBtn" outline color="blue-12" dense @click="saveDataLockSendSection">
                  <q-icon name="lock" size="xs" class="q-mr-xs" />
                  평가마감하기
                </q-btn>
              </div>
            </q-toolbar>
            <q-card class="">
              <q-tabs
                v-model="setItemFg"
                dense
                class="text-grey bg-cyan-2"
                active-color="primary"
                indicator-color="primary"
                @update:model-value="onTabChange"
              >
                <q-tab name="2021102" label="평가항목(팀원)" />
                <q-tab name="2021101" label="평가항목(팀장/소장)" />
              </q-tabs>
              <q-separator spaced />
              <q-tab-panels v-model="setItemFg" animated>
                <q-tab-panel name="2021102" class="q-pa-none">
                  <div :style="{ height: gridHeight + 33 + 'px' }">
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
                </q-tab-panel>

                <q-tab-panel name="2021101" class="q-pa-none">
                  <div :style="{ height: gridHeight + 33 + 'px' }">
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
                </q-tab-panel>
              </q-tab-panels>
            </q-card>
          </q-card>
        </div>
        <div class="col-xs-12 col-md-12 col-lg-6">
          <!--      {{ contentZoneHeight }} = {{ state.height }}-->
          <q-card class="q-pa-xs">
            <q-toolbar class="row q-pa-none">
              <q-avatar color="red" text-color="white" size="md">2번</q-avatar>
              <span v-if="viewInfo.workNo" class="q-ml-md text-subtitle1">
                <span class="q-mr-xs">
                  항목번호 :
                  <span class="text-indigo-12"> {{ viewInfo.workNo }}</span>
                </span>
              </span>

              <q-space />
            </q-toolbar>
            <div class="row">
              <div class="col-12 row">
                <div class="col-xs-12 col-sm-12 col-md-5 q-mb-sm">
                  <q-card square class="bg-grey" style="height: 60px">
                    <div class="bg-deep-orange-3 text-center text-subtitle2 text-bold q-px-xs">인사정보</div>
                    <div class="row">
                      <div class="col-md-2 text-center text-subtitle1 q-py-xs">No</div>
                      <div class="col-md-3 text-subtitle1 q-py-xs">성명</div>
                      <div class="col-md-7 text-subtitle1 q-py-xs">소속/직급</div>
                    </div>
                  </q-card>
                </div>
                <div class="col-xs-12 col-sm-12 col-md-7 q-mb-sm">
                  <q-card square class="bg-grey" style="height: 60px">
                    <div class="bg-deep-orange-3 text-center text-subtitle2 text-bold q-px-xs">평가하기</div>
                    <div class="row">
                      <div class="col-md-9 text-center">
                        <q-radio
                          keep-color
                          v-model="tmpMark.markCh"
                          :disable="formReadonly"
                          val="S"
                          label="S"
                          color="deep-orange"
                          class="text-subtitle1 text-bold"
                          @update:model-value="val => handlePointClickAll(val)"
                        />
                        <q-radio
                          keep-color
                          v-model="tmpMark.markCh"
                          :disable="formReadonly"
                          val="A"
                          label="A"
                          color="blue"
                          class="text-subtitle1 text-bold"
                          @update:model-value="val => handlePointClickAll(val)"
                        />
                        <q-radio
                          keep-color
                          v-model="tmpMark.markCh"
                          :disable="formReadonly"
                          val="B"
                          label="B"
                          color="cyan"
                          class="text-subtitle1 text-bold"
                          @update:model-value="val => handlePointClickAll(val)"
                        />
                        <q-radio
                          keep-color
                          v-model="tmpMark.markCh"
                          :disable="formReadonly"
                          val="C"
                          label="C"
                          color="teal"
                          class="text-subtitle1 text-bold"
                          @update:model-value="val => handlePointClickAll(val)"
                        />
                        <q-radio
                          keep-color
                          v-model="tmpMark.markCh"
                          :disable="formReadonly"
                          val="D"
                          label="D"
                          color="green"
                          class="text-subtitle1 text-bold"
                          @update:model-value="val => handlePointClickAll(val)"
                        />
                      </div>
                    </div>
                  </q-card>
                </div>
              </div>

              <q-separator />
              <div v-if="isShowMessage" style="width: 100%" class="q-pa-xl">
                <span class="text-subtitle1 text-bold row flex-center">관련팀원이 없습니다.</span>
              </div>

              <div style="width: 100%" v-for="(data, index) in rowData.rowsSel" :key="data.seq" class="q-mb-sm">
                <div class="row">
                  <q-card class="col-xs-12 col-sm-12 col-md-5 shadow-3">
                    <div class="row">
                      <div class="col-xs-2 col-sm-2 col-md-2">
                        <div class="text-subtitle1 text-center q-pa-xs">
                          {{ index + 1 }}
                        </div>
                      </div>
                      <div class="col-xs-3 col-sm-3 col-md-3">
                        <div class="text-subtitle1 q-pa-xs" :class="data.markPoint > 0 ? 'text-blue' : ''">{{ data.evtEmpNm }}</div>
                      </div>
                      <div class="col-xs-2 col-sm-2 col-md-7">
                        <div class="text-subtitle2 q-py-sm q-pl-sm">{{ data.evtDeptNm }} / {{ data.evtTitlNm }}</div>
                      </div>
                    </div>
                  </q-card>
                  <q-card class="col-xs-12 col-sm-12 col-md-7 shadow-3">
                    <div class="row">
                      <div class="col-md-9 text-center">
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
                      <div class="col-md-3 flex flex-center">
                        <span class="q-ml-lg text-center self-center text-subtitle1 text-bold">( {{ data.markPoint }} )</span>
                      </div>
                    </div>
                  </q-card>
                </div>
              </div>
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
import { api } from 'boot/axios';
import notifySave from 'src/js_comm/notify-save';
import { QBtn, QIcon, QToggle, useQuasar } from 'quasar';
import jsonUtil from 'src/js_comm/json-util';
import { useUserInfoStore } from 'src/store/setUserInfo';
import { useYearInfoStore } from 'src/store/setYearInfo';
const storeUser = useUserInfoStore();
const storeYear = useYearInfoStore();
const setItemFg = ref(null);

const rowData = reactive({ rows: [] });
const formReadonly = ref(true);
const isShowMessage = ref(false);

const onTabChange = val => {
  setItemFg.value = val;
  getData();
  isShowMessage.value = false;
};

// grid Height 자동처리부분
const gridHeight = ref(200); // 초기 높이
const rowHeight = 45; // 행당 높이 (예: 25px)
const minHeight = ref(15); // 최소 높이 (예: 300px) rowHeight의 3배

const $q = useQuasar();
let isSaveFg = null;
const tmpMark = ref({
  markCh: null,
  markPoint: 0,
});

const contentZoneHeight = ref(300);
const contentZoneStyle = computed(() => ({
  height: `${contentZoneHeight.value}px`,
}));

const gridApi = ref(null);
const onGridReady = params => {
  gridApi.value = params.api;
  gridApi.value.setGridOption('headerHeight', 45);
  gridApi.value.setGridOption('rowHeight', 45);
  gridApi.value.deselectAll();
  params.api.sizeColumnsToFit();
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
      field: 'seq',
      minWidth: 50,
      maxWidth: 50,
      pinned: 'left',
      filter: false,
    },
    {
      headerName: '평가항목',
      field: 'itemNm',
      minWidth: 150,
      resizable: true,
      cellClass: 'wrap-text', // Apply the custom CSS class
      autoHeight: true,
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
  if (data.statusMessage === '평가마감') {
    return $q.dark.isActive ? { color: 'red' } : { color: 'red' };
  } else if (data.statusMessage === '평가중') {
    return $q.dark.isActive ? { color: 'teal' } : { color: 'teal' };
  } else if (data.statusMessage === '평가완료') {
    return $q.dark.isActive ? { color: 'orange' } : { color: 'blue' };
  } else {
    return {};
    // return { textAlign: 'center' };
  }
};

onBeforeUnmount(() => {
  // console.log('onBeforeUnmount....');
  // Remove the resize event listener when the component is destroyed
  window.removeEventListener('resize', handleResize);
});
onBeforeMount(() => {
  // console.log('onBeforeMount....', storeUser.setCatgCd, storeUser.setCatgNm, storeUser.setEvtgCd, storeUser.setEvtgNm);
  if (storeUser.setCatgCd <= '03') {
    setItemFg.value = '2021101';
  } else if (storeUser.setCatgCd <= '05') {
    setItemFg.value = '2021102';
  } else {
    setItemFg.value = null;
  }
  getData();
});

const gridZone = ref(null);
const state = reactive({
  height: 0,
});
onMounted(() => {
  // console.log('onMounted....');
  window.addEventListener('resize', handleResize);
  handleResize();
  if (gridZone.value) {
    state.height = gridZone.value.clientHeight;
  }
});

const formData = ref({
  stdYear: '',
  evtEmpCd: '',
  seq: 0,
  returnDoc: '',
  status: '',
});

const viewInfo = ref({
  itemNm: null,
  workNo: null,
});
const selectedRows = ref([]);
const onSelectionChanged = event => {
  selectedRows.value = event.api.getSelectedRows();
  // console.log('sel: ', JSON.stringify(selectedRows.value));
  sendCheck.value.initialize = false;
  viewInfo.value.itemNm = null;
  viewInfo.value.workNo = null;

  if (selectedRows.value.length === 1) {
    tmpMark.value.markPoint = 0;
    tmpMark.value.markCh = null;

    formReadonly.value = sendCheck.value.lock;

    viewInfo.value.itemNm = selectedRows.value[0].itemNm;
    viewInfo.value.workNo = selectedRows.value[0].workNo;
    getDataSelectList(selectedRows.value[0]).then(() => {
      isShowMessage.value = false;
      if (rowData.rowsSel.length === 0) {
        formReadonly.value = true;
        isShowMessage.value = true;
      }
      const evalCount = rowData.rows.filter(item => item.evalCount > 0).length;
      const empCount = rowData.rows.filter(item => item.empCount > 0).length;
      const lockYnCount = rowData.rows.filter(item => item.lockYn === 'Y').length;
      if (lockYnCount > 0) {
        sendCheck.value.lockBtn = false;
        formReadonly.value = true;
      } else {
        sendCheck.value.lockBtn = evalCount === empCount;
        sendCheck.value.initialize = evalCount > 0;
        sendCheck.value.cnt = rowData.rowsSel.filter(item => item.markPoint > 0).length;
      }
    });
  }
};

const sendCheck = ref({
  lock: false,
  lockBtn: false,
  initialize: false,
  cnt: 0,
});

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

const handlePointClickAll = resMarkCh => {
  switch (resMarkCh) {
    case 'S':
      tmpMark.value.markPoint = 100;
      break;
    case 'A':
      tmpMark.value.markPoint = 90;
      break;
    case 'B':
      tmpMark.value.markPoint = 80;
      break;
    case 'C':
      tmpMark.value.markPoint = 70;
      break;
    case 'D':
      tmpMark.value.markPoint = 60;
      break;
    default:
      tmpMark.value.markPoint = 0;
      break;
  }

  let iu = [];
  let iuD = [];
  for (let i = 0; i < rowData.rowsSel.length; i++) {
    rowData.rowsSel[i].markCh = resMarkCh;
    rowData.rowsSel[i].markPoint = tmpMark.value.markPoint;
    let tmpJson = '{"mode":"I","data":' + JSON.stringify(rowData.rowsSel[i]) + '}';
    // console.log('all save : ', JSON.stringify(rowData.rowsSel));
    iu.push(tmpJson);
  }
  saveDataAndHandleResult(jsonUtil.jsonFiller(iu, iuD));
  setTimeout(() => {
    const markPointCount = rowData.rowsSel.filter(item => item.markPoint > 0).length;
    console.log('markPointCount :: ', markPointCount);
    statusMessageUpdate(markPointCount);
  }, 500);
};

const handlePointClick = (resMarkCh, resData) => {
  switch (resMarkCh) {
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

  // console.log('rowData :: ', JSON.stringify(rowData.rows));
  // console.log('rowDataSel :: ', JSON.stringify(rowData.rowsSel));
  saveDataAndHandleResult(jsonUtil.dataJsonParse('I', resData));

  // console.log('markPointCount : ', markPointCount, rowData.rowsSel.length);
  // if (rowData.rowsSel.length === markPointCount) {
  setTimeout(() => {
    const markPointCount = rowData.rowsSel.filter(item => item.markPoint > 0).length;
    console.log('markPointCount : ', markPointCount);
    statusMessageUpdate(markPointCount);
  }, 500);
  // }
  // const totalPointCount = rowData.rows.filter(item => item.evalCount === rowData.rowsSel.length).length;
  // if (totalPointCount === rowData.rows.length) {
  //   setTimeout(() => {
  //     getData();
  //   }, 500);
  // }
};

const statusMessageUpdate = resEvalCount => {
  let selectedRow = gridApi.value.getSelectedNodes()[0];
  // console.log('sel : ', selectedRow.data);

  if (selectedRow.data.lockYn === 'Y') {
    selectedRow.data.statusMessage = '평가마감';
  } else if (resEvalCount === 0) {
    selectedRow.data.statusMessage = '평가대기';
  } else if (resEvalCount === selectedRow.data.empCount) {
    selectedRow.data.statusMessage = '평가완료';
  } else {
    selectedRow.data.statusMessage = '평가중';
  }
  getStatusMessageStyle(selectedRow.data);
  // 그리드에 변경 사항을 반영하도록 갱신합니다.
  gridApi.value.applyTransaction({ update: [selectedRow.data] });

  // 평가마감버튼 활성화 체크부분
  const targetRowData = rowData.rows.find(item => item.workNo === selectedRow.data.workNo);
  targetRowData.evalCount = resEvalCount;

  const evalCount = rowData.rows.filter(item => item.evalCount > 0 && item.evalCount === item.empCount).length;
  const markPointCount = rowData.rows.filter(item => rowData.rows.length !== item.evalCount).length;
  sendCheck.value.lockBtn = evalCount === markPointCount;
  // console.log('ch :1: ', sendCheck.value.lock, evalCount, markPointCount);

  if (resEvalCount > 0) {
    sendCheck.value.initialize = true;
    sendCheck.value.cnt = resEvalCount;
  } else {
    sendCheck.value.initialize = false;
  }
};

const deleteDataSection = () => {
  $q.dialog({
    dark: true,
    title: '평가초기화',
    message: '평가자료를 모두 초기화 하시겠습니까? ',
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
      formData.evsEmpCd = storeUser.setEmpCd;
      formData.evsCd = selectedRows.value[0].evsCd;
      formData.itemFg = selectedRows.value[0].itemFg;
      formData.workNo = selectedRows.value[0].workNo;
      let tmpJson = '{"mode": "' + isSaveFg + '","data":' + JSON.stringify(formData) + '}';
      iuD.push(tmpJson);
      saveDataAndHandleResult(jsonUtil.jsonFiller(iu, iuD));

      tmpMark.value.markCh = null;
      tmpMark.value.markPoint = 0;
      for (let i = 0; i < rowData.rowsSel.length; i++) {
        rowData.rowsSel[i].markCh = null;
        rowData.rowsSel[i].markPoint = 0;
      }
      setTimeout(() => {
        statusMessageUpdate(0);
      }, 500);
    })
    .onCancel(() => {})
    .onDismiss(() => {
      // 확인/취소 모두 실행되었을때
    });
};

// 성과평가 평가마감하기
const saveDataLockSendSection = () => {
  $q.dialog({
    dark: true,
    title: '평가마감하기',
    message: '평가자료를 모두 마감 하시겠습니까? ',
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
      formData.stdYear = storeYear.setYear;
      formData.evsEmpCd = storeUser.setEmpCd;
      formData.itemFg = setItemFg.value;
      formData.lock = 'Y';
      let tmpJson = '{"mode": "' + isSaveFg + '","data":' + JSON.stringify(formData) + '}';
      iu.push(tmpJson);
      saveDataAndHandleResult(jsonUtil.jsonFiller(iu, iuD));
      setTimeout(() => {
        getData();
      }, 1000);
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
    const response = await api.post('/api/hce/hce2010_list', {
      paramSetYear: storeYear.setYear,
      paramEvsEmpCd: storeUser.setEmpCd,
      paramItemFg: setItemFg.value,
    });
    rowData.rows = response.data.data;
    // console.log('aa : ', JSON.stringify(response.data.data));
    if (rowData.rows.length === 0) {
      minHeight.value = 220;
      sendCheck.value.lock = false;
      sendCheck.value.lockYn = false;
    } else {
      const calculatedHeight = rowData.rows.length * rowHeight;
      gridHeight.value = minHeight.value + calculatedHeight;
      rowData.rowsSel = [];

      // console.log('getData : ', JSON.stringify(rowData.rows));
      const evalCount = rowData.rows.filter(item => item.evalCount > 0).length;
      const empCount = rowData.rows.filter(item => item.empCount > 0).length;
      const lockYnCount = rowData.rows.filter(item => item.lockYn === 'Y').length;
      if (lockYnCount > 0) {
        sendCheck.value.lockBtn = false;
      } else {
        sendCheck.value.lockBtn = evalCount === empCount;
      }
    }
  } catch (error) {
    console.error('Error fetching users:', error);
  }
};

// ***** 목표승인대상자 승인대상자료 목록 자료 가져오기 부분  *****************************//
const getDataSelectList = async resRow => {
  // console.log('resRow : ', JSON.stringify(resRow));
  try {
    const response = await api.post('/api/hce/hce2010_select_list', {
      paramStdYear: resRow.stdYear,
      paramEvsEmpCd: storeUser.setEmpCd,
      paramEvsCd: resRow.evsCd,
      paramItemFg: resRow.itemFg,
      paramWorkNo: resRow.workNo,
    });

    rowData.rowsSel = response.data.data;

    // console.log('getDataSel : ', JSON.stringify(rowData.rowsSel));
  } catch (error) {
    console.error('Error fetching users:', error);
  }
};

// ***** 자료저장 및 삭제 처리부분 *****************************//
// saveStatus = 평가점수 저장
const saveDataAndHandleResult = resFormData => {
  // console.log('save :: ', JSON.stringify(resFormData));
  api
    .post('/api/hce/hce2010_save', resFormData)
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
<style>
.wrap-text {
  white-space: normal !important;
  word-wrap: break-word !important;
  overflow: visible !important;
  line-height: 1.5; /* Optional: Adjust line height for better readability */
}
</style>

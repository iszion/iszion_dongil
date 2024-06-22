<template>
  <q-page class="q-pa-xs-xs q-pa-sm-md" :style-fn="myTweak">
    <q-card class="q-pa-sm">
      <div class="row">
        <div class="col-xs-12 col-sm-12 col-lg-8">
          <q-banner rounded :class="$q.dark.isActive ? 'bg-grey-9' : 'bg-grey-3'" style="height: 100%">
            <template v-slot:avatar>
              <q-icon name="menu_book" color="primary" size="md" />
            </template>
            <span class="text-subtitle1 text-bold"> 2차 역량평가 평가작업입니다.</span><br />
            1. <span class="text-teal text-bold">진행상태</span>는 '평가완료', '진행중', '평가대기' 상태로 표기됩니다.
            <span class="text-teal text-bold">자료정리</span>버튼을 클릭하여 진행상태를 재정리 하실 수 있습니다.<br />
            2. 선택한 직원의 평가완료 시 <span class="text-teal text-bold">평가마감</span>버튼이 활성화됩니다.
            <span class="text-teal text-bold">평가마감</span>버튼 클릭 시 <span class="text-red text-bold">평가마감완료</span><br />
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
        <q-item-label class="text-h6">2차 역량평가하기 </q-item-label>
      </q-card-section>

      <div ref="gridZone" class="row q-col-gutter-x-lg">
        <div class="col-xs-12 col-md-12 col-lg-4">
          <q-card class="q-pa-sm">
            <q-toolbar class="row q-px-none">
              <q-avatar color="red" text-color="white" size="md">1번</q-avatar>
              <q-space />
              <q-btn v-if="sendCheck.lock" outline color="blue-12" dense @click="lockSave" class="q-mr-xs">
                <q-icon name="lock" size="xs" class="q-mr-xs" />
                평가마감
              </q-btn>
              <q-btn outli리ne outline color="grey" dense @click="getData">
                <q-icon name="refresh" size="xs" class="q-mr-xs" />
                자료정리
              </q-btn>
            </q-toolbar>
            <div :style="{ height: gridHeight + 50 + 'px' }">
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
              <span v-if="viewInfo.empNm" class="q-ml-md text-subtitle1">
                <span class="q-mr-md"
                  >성명: <span class="q-pl-sm text-blue"> {{ viewInfo.empNm }}</span>
                </span>
                <span class="q-mr-md"
                  >소속: <span class="q-pl-sm text-blue">{{ viewInfo.deptNm }}</span></span
                >
                <span class="q-mr-md"
                  >직급: <span class="q-pl-sm text-blue">{{ viewInfo.titlNm }}</span></span
                >
              </span>
              <q-space />
              <q-btn v-if="sendCheck.initialize" outline color="deep-orange" dense class="q-pr-md q-ml-sm" @click="deleteDataSection()">
                <q-icon name="delete" size="xs" class="q-mr-xs" />
                <q-badge color="orange" floating>{{ sendCheck.cnt }}</q-badge>
                평가초기화
              </q-btn>
            </q-toolbar>
            <div class="row">
              <div class="col-xs-12 col-sm-12 col-md-7 q-mb-sm">
                <div class="row">
                  <q-card square class="col-xs-2 col-sm-2 col-md-1">
                    <div class="bg-deep-orange-3 text-center text-subtitle2 text-bold q-px-xs">순번</div>
                  </q-card>
                  <q-card square class="col-xs-8 col-sm-8 col-md-10">
                    <div class="bg-deep-orange-3 text-center text-subtitle2 text-bold q-px-xs">평가항목</div>
                  </q-card>
                  <q-card square class="col-xs-2 col-sm-2 col-md-1">
                    <div class="bg-deep-orange-3 text-center text-subtitle2 text-bold q-px-xs">가중치</div>
                  </q-card>
                </div>
              </div>
              <div class="col-xs-12 col-sm-12 col-md-5 q-mb-sm">
                <q-card square class="">
                  <div class="bg-deep-orange-3 text-center text-subtitle2 text-bold q-px-xs">평가하기</div>
                </q-card>
              </div>

              <div style="width: 100%" v-for="data in rowData.rowsSel" :key="data.seq" class="q-mb-sm">
                <div class="row">
                  <q-card class="col-xs-12 col-sm-12 col-md-7 shadow-3">
                    <div class="row">
                      <div class="col-xs-2 col-sm-2 col-md-1">
                        <div class="text-subtitle1 text-center q-pa-xs">
                          {{ data.workNo }}
                        </div>
                      </div>
                      <div class="col-xs-8 col-sm-8 col-md-10">
                        <div class="text-subtitle1 q-pa-xs" :class="data.markPoint > 0 ? 'text-blue' : ''">{{ data.itemNm }}</div>
                      </div>
                      <div class="col-xs-2 col-sm-2 col-md-1">
                        <div class="text-subtitle1 text-center q-pa-xs">
                          {{ data.weight }}
                        </div>
                      </div>
                    </div>
                  </q-card>
                  <q-card class="col-xs-12 col-sm-12 col-md-5 shadow-3">
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
import { isEmpty, isEqual } from 'lodash';
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
const formReadonly = ref(false);

// grid Height 자동처리부분
const gridHeight = ref(200); // 초기 높이
const rowHeight = 45; // 행당 높이 (예: 25px)
const minHeight = ref(15); // 최소 높이 (예: 300px) rowHeight의 3배

const $q = useQuasar();
let isSaveFg = null;

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
  // console.log('store : ', JSON.stringify(storeUser));
  // 2차 역량평가 기준 평가항목
  if (storeUser.setDepgCd === '1011001' || storeUser.setDepgCd === '1011002') {
    // 대표이사
    if (storeUser.setCatgCd === '02') {
      setItemFg.value = '2021101'; // 팀장항목
      // 본부장(임원)
    } else if (storeUser.setCatgCd === '03') {
      setItemFg.value = '2021102'; // 팀원항목
    } else {
      setItemFg.value = null;
    }
  } else if (storeUser.setDepgCd === '1011003') {
    // 본부장(임원)
    if (storeUser.setCatgCd === '03') {
      setItemFg.value = '2021102'; // 팀원항목
    } else {
      setItemFg.value = null;
    }
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

const sendCheck = ref({
  lock: false,
  initialize: false,
  cnt: 0,
});

const viewInfo = ref({
  empNm: null,
  deptNm: null,
  titlNm: null,
});
const selectedRows = ref([]);
const onSelectionChanged = event => {
  selectedRows.value = event.api.getSelectedRows();
  // console.log('sel: ', JSON.stringify(selectedRows.value));
  sendCheck.value.initialize = false;
  viewInfo.value.empNm = null;
  viewInfo.value.deptNm = null;
  viewInfo.value.titlNm = null;

  if (selectedRows.value.length === 1) {
    viewInfo.value.empNm = selectedRows.value[0].evtEmpNm;
    viewInfo.value.deptNm = selectedRows.value[0].evtDeptNm;
    viewInfo.value.titlNm = selectedRows.value[0].evtTitlNm;
    getDataSelectList(selectedRows.value[0]);

    if (selectedRows.value[0].evalCount > 0) {
      sendCheck.value.initialize = true;
      sendCheck.value.cnt = selectedRows.value[0].evalCount;
    }
  }
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

  // console.log('rowData :: ', JSON.stringify(rowData.rows));
  // console.log('rowDataSel :: ', JSON.stringify(rowData.rowsSel));
  saveDataAndHandleResult(jsonUtil.dataJsonParse('I', resData));

  const markPointCount = rowData.rowsSel.filter(item => item.markPoint > 0).length;
  // console.log('markPointCount : ', markPointCount);
  // if (rowData.rowsSel.length === markPointCount) {
  //   for (let item of rowData.rows) {
  //     if (item.evtEmpCd === resData.evtEmpCd) {
  //       item.evalCount = rowData.rowsSel.length;
  //       item.statusMessage = '평가완료';
  //       break;
  //     }
  //   }
  // }
  if (rowData.rowsSel.length === markPointCount) {
    setTimeout(() => {
      getData();
    }, 500);
  }
  const totalPointCount = rowData.rows.filter(item => item.evalCount === rowData.rowsSel.length).length;
  if (totalPointCount === rowData.rows.length) {
    setTimeout(() => {
      getData();
    }, 500);
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
      formData.evsEmpCd = selectedRows.value[0].evsEmpCd;
      formData.evtEmpCd = selectedRows.value[0].evtEmpCd;
      formData.evsCd = selectedRows.value[0].evsCd;
      formData.itemFg = selectedRows.value[0].itemFg;
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
      formData.itemFg = setItemFg.value;
      formData.lock = 'Y';
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
    const response = await api.post('/api/hce/hce1020_list', {
      paramSetYear: storeYear.setYear,
      paramEmpCd: storeUser.setEmpCd,
      paramItemFg: setItemFg.value,
    });
    rowData.rows = response.data.data;
    // console.log('aa : ', JSON.stringify(response.data.data));
    if (rowData.rows.length === 0) {
      minHeight.value = 220;
    }
    const calculatedHeight = rowData.rows.length * rowHeight;
    gridHeight.value = minHeight.value + calculatedHeight;
    rowData.rowsSel = [];

    // console.log('getData : ', JSON.stringify(rowData.rows));
    sendCheck.value.lock = false;
    const totalPointCount = rowData.rows.filter(item => item.evalCount !== 0 && item.evalCount === item.itemCount).length;
    if (totalPointCount === rowData.rows.length) {
      sendCheck.value.lock = true;
    }
  } catch (error) {
    console.error('Error fetching users:', error);
  }
};

// ***** 목표승인대상자 승인대상자료 목록 자료 가져오기 부분  *****************************//
const getDataSelectList = async resRow => {
  try {
    const response = await api.post('/api/hce/hce1020_select_list', {
      paramStdYear: resRow.stdYear,
      paramEvtEmpCd: resRow.evtEmpCd,
      paramEvsCd: resRow.evsCd,
      paramItemFg: resRow.itemFg,
    });

    rowData.rowsSel = response.data.data;

    formReadonly.value = false;

    // console.log('getData : ', JSON.stringify(rowData.rows));
  } catch (error) {
    console.error('Error fetching users:', error);
  }
};

// ***** 자료저장 및 삭제 처리부분 *****************************//
// saveStatus = 평가점수 저장
const saveDataAndHandleResult = resFormData => {
  api
    .post('/api/hce/hce1020_save', resFormData)
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

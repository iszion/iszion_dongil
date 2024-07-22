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
            <div class="row">
              <div class="col-xs-12 col-sm-6">
                1. <span class="text-teal text-bold">진행상태</span>는 '평가완료', '진행중', '평가대기' 상태로 표기됩니다.<br />
                2. <span class="text-teal text-bold">자료정리</span>버튼을 클릭하여 진행상태를 재정리 하실 수 있습니다.<br />
                3. <span class="text-teal text-bold">각 포인 체크건수</span>는 <span class="text-teal text-bold">정해진 인원 배정</span>에 한해
                <span class="text-teal text-bold">선택</span> 하실 수 있습니다.<br />
              </div>
              <div class="col-xs-12 col-sm-6">
                4. <span class="text-blue text-bold">적은 한도인원</span> 부터 선택하면
                <span class="text-blue text-bold">남은 1개의 포인트 점수는 자동 체점</span>됩니다.<br />
                5. 선택한 평가항목의 평가완료 시 <span class="text-blue text-bold">평가마감하기</span>버튼이 활성화됩니다.<br />
                6. <span class="text-blue text-bold">평가마감하기</span>버튼 클릭 시 <span class="text-red text-bold">평가마감완료</span>
              </div>
            </div>
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
        <q-item-label class="text-h6">2차 역량평가하기 (항목기준) </q-item-label>
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
                <q-btn
                  v-if="!sendCheck.lock && sendCheck.initialize && sendCheck.cnt > 0"
                  outline
                  color="deep-orange"
                  dense
                  class="q-pr-md"
                  @click="deleteDataSection()"
                >
                  <q-icon name="delete" size="xs" class="q-mr-xs" />
                  <q-badge color="orange" floating>{{ sendCheck.cnt }}</q-badge>
                  초기화
                </q-btn>

                <q-btn v-if="!sendCheck.lock && sendCheck.lockBtn" outline color="blue-12" dense @click="saveDataLockSendSection">
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
                <div class="col-xs-12 col-sm-12 col-md-6 q-mb-sm">
                  <q-card square class="bg-grey" style="height: 60px">
                    <div class="bg-deep-orange-3 text-center text-subtitle2 text-bold q-px-xs">인사정보</div>
                    <div class="row">
                      <div class="col-md-2 text-center text-subtitle1 q-py-xs">No</div>
                      <div class="col-md-3 text-subtitle1 q-py-xs">성명</div>
                      <div class="col-md-6 text-subtitle1 q-py-xs">소속/직급</div>
                      <div class="col-md-1 text-subtitle1 q-py-xs">1차</div>
                    </div>
                  </q-card>
                </div>
                <div class="col-xs-12 col-sm-12 col-md-6 q-mb-sm">
                  <q-card square class="bg-grey" style="height: 60px">
                    <div class="bg-deep-orange-3 text-center text-subtitle2 text-bold q-px-xs">
                      평가하기 [ <span class="text-teal-8">()안은 평가대상인원수</span> ]
                    </div>
                    <div v-if="!setTotEva" class="q-pa-sm text-subtitle1 text-bold flex flex-center q-gutter-x-lg">
                      <span class="text-blue-9 q-mr-xs">S </span> ( {{ pointValue.cnt.S }} ) <span class="text-cyan-9 q-mr-xs">A</span> (
                      {{ pointValue.cnt.A }} ) <span class="text-teal-8 q-mr-xs">B</span> ( {{ pointValue.cnt.B }} )
                      <span class="text-green-8 q-mr-xs">C</span> ( {{ pointValue.cnt.C }} ) <span class="text-deep-orange-9 q-mr-xs">D</span> (
                      {{ pointValue.cnt.D }} )
                    </div>
                    <div v-if="setTotEva" class="row">
                      <div class="col-md-12 text-center">
                        <q-radio
                          keep-color
                          left-label
                          v-model="tmpMark.markCh2"
                          :disable="formReadonly"
                          val="S"
                          :label="`S(${pointValue.cnt.S})`"
                          color="blue-9"
                          class="text-subtitle1 text-bold"
                          @update:model-value="val => handlePointClickAll(val)"
                        />
                        <q-radio
                          keep-color
                          left-label
                          v-model="tmpMark.markCh2"
                          :disable="formReadonly"
                          val="A"
                          :label="`A(${pointValue.cnt.A})`"
                          color="cyan-9"
                          class="text-subtitle1 text-bold"
                          @update:model-value="val => handlePointClickAll(val)"
                        />
                        <q-radio
                          keep-color
                          left-label
                          v-model="tmpMark.markCh2"
                          :disable="formReadonly"
                          val="B"
                          :label="`B(${pointValue.cnt.B})`"
                          color="teal-9"
                          class="text-subtitle1 text-bold"
                          @update:model-value="val => handlePointClickAll(val)"
                        />
                        <q-radio
                          keep-color
                          left-label
                          v-model="tmpMark.markCh2"
                          :disable="formReadonly"
                          val="C"
                          :label="`C(${pointValue.cnt.C})`"
                          color="green-9"
                          class="text-subtitle1 text-bold"
                          @update:model-value="val => handlePointClickAll(val)"
                        />
                        <q-radio
                          keep-color
                          left-label
                          v-model="tmpMark.markCh2"
                          :disable="formReadonly"
                          val="D"
                          :label="`D(${pointValue.cnt.D})`"
                          color="deep-orange-8"
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
                  <q-card class="col-xs-12 col-sm-12 col-md-6 shadow-3">
                    <div class="row">
                      <div class="col-xs-2 col-sm-2 col-md-2">
                        <div class="text-subtitle1 text-center q-pa-xs">
                          {{ index + 1 }}
                        </div>
                      </div>
                      <div class="col-xs-3 col-sm-3 col-md-3">
                        <div class="text-subtitle1 q-pa-xs" :class="data.markPoint2 > 0 ? 'text-blue' : ''">{{ data.evtEmpNm }}</div>
                      </div>
                      <div class="col-xs-2 col-sm-2 col-md-5">
                        <div class="text-subtitle2 q-py-sm q-pl-sm">{{ data.evtDeptNm }} / {{ data.evtTitlNm }}</div>
                      </div>
                      <div class="col-xs-2 col-sm-2 col-md-2 flex flex-center">
                        <span v-if="data.markCh1" class="q-ml-lg text-center self-center text-subtitle1 text-bold">[ {{ data.markCh1 }} ]</span>
                      </div>
                    </div>
                    <div v-if="viewInfo.attenYn" class="row q-gutter-x-lg flex-center">
                      <div class="">
                        지각: <span class="text-red text-bold">{{ data.attenCh1 }}</span>
                      </div>
                      <div class="">
                        미체크: <span class="text-red text-bold">{{ data.attenCh2 }}</span>
                      </div>
                      <div class="">
                        결근: <span class="text-red text-bold">{{ data.attenCh3 }}</span>
                      </div>
                    </div>
                  </q-card>
                  <q-card class="col-xs-12 col-sm-12 col-md-6 shadow-3">
                    <div class="row">
                      <div class="col-md-9 text-center">
                        <q-radio
                          keep-color
                          left-label
                          v-model="data.markCh2"
                          :disable="formReadonly || data.markCh1 === ''"
                          val="S"
                          label="S"
                          color="blue"
                          class="text-subtitle1 text-bold"
                          @update:model-value="val => handlePointClick(val, data)"
                        />
                        <q-radio
                          keep-color
                          left-label
                          v-model="data.markCh2"
                          :disable="formReadonly || data.markCh1 === ''"
                          val="A"
                          label="A"
                          color="cyan"
                          class="text-subtitle1 text-bold"
                          @update:model-value="val => handlePointClick(val, data)"
                        />
                        <q-radio
                          keep-color
                          left-label
                          v-model="data.markCh2"
                          :disable="formReadonly || data.markCh1 === ''"
                          val="B"
                          label="B"
                          color="teal"
                          class="text-subtitle1 text-bold"
                          @update:model-value="val => handlePointClick(val, data)"
                        />
                        <q-radio
                          keep-color
                          left-label
                          v-model="data.markCh2"
                          :disable="formReadonly || data.markCh1 === ''"
                          val="C"
                          label="C"
                          color="green"
                          class="text-subtitle1 text-bold"
                          @update:model-value="val => handlePointClick(val, data)"
                        />
                        <q-radio
                          keep-color
                          left-label
                          v-model="data.markCh2"
                          :disable="formReadonly || data.markCh1 === ''"
                          val="D"
                          label="D"
                          color="deep-orange"
                          class="text-subtitle1 text-bold"
                          @update:model-value="val => handlePointClick(val, data)"
                        />
                      </div>
                      <div class="col-md-3 flex flex-center">
                        <span v-if="data.markPoint2" class="q-ml-lg text-center self-center text-subtitle1 text-bold">( {{ data.markPoint2 }} )</span>
                      </div>
                      <div v-if="data.markCh1 === 'S'" class="q-px-sm q-pb-xs" style="width: 100%">
                        <q-field dense label-color="orange" label="1차 S포인트적용 사유" stack-label>
                          <template v-slot:control>
                            <div class="self-center full-width no-outline" tabindex="0">{{ data.sExplains1 }}</div>
                          </template>
                        </q-field>
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
  markCh2: null,
  markPoint2: 0,
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
  // 대표이사
  if (storeUser.setCatgCd <= '03') {
    setItemFg.value = '2021101';
  } else if (storeUser.setCatgCd <= '05') {
    setItemFg.value = '2021102';
  } else {
    setItemFg.value = null;
  }
  getDataSetB();
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
  attenYn: false,
});
const selectedRows = ref([]);
const onSelectionChanged = event => {
  selectedRows.value = event.api.getSelectedRows();
  console.log('sel: ', JSON.stringify(selectedRows.value));
  sendCheck.value.initialize = false;
  viewInfo.value.itemNm = null;
  viewInfo.value.workNo = null;

  if (selectedRows.value.length === 1) {
    tmpMark.value.markPoint2 = 0;
    tmpMark.value.markCh2 = null;

    viewInfo.value.attenYn = selectedRows.value[0].attenYn === 'Y';
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
        sendCheck.value.lockBtn = evalCount === empCount && evalCount !== 0;
        sendCheck.value.initialize = evalCount > 0;
        sendCheck.value.cnt = rowData.rowsSel.filter(item => item.markPoint2 > 0).length;
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
      tmpMark.value.markPoint2 = 100;
      break;
    case 'A':
      tmpMark.value.markPoint2 = 90;
      break;
    case 'B':
      tmpMark.value.markPoint2 = 80;
      break;
    case 'C':
      tmpMark.value.markPoint2 = 70;
      break;
    case 'D':
      tmpMark.value.markPoint2 = 60;
      break;
    default:
      tmpMark.value.markPoint2 = 0;
      break;
  }

  let iu = [];
  let iuD = [];
  for (let i = 0; i < rowData.rowsSel.length; i++) {
    rowData.rowsSel[i].markCh2 = resMarkCh;
    rowData.rowsSel[i].markPoint2 = tmpMark.value.markPoint2;
    let tmpJson = '{"mode":"I","data":' + JSON.stringify(rowData.rowsSel[i]) + '}';
    // console.log('all save : ', JSON.stringify(rowData.rowsSel));
    iu.push(tmpJson);
  }
  saveDataAndHandleResult(jsonUtil.jsonFiller(iu, iuD));
  setTimeout(() => {
    const markPoint2Count = rowData.rowsSel.filter(item => item.markPoint2 > 0).length;
    statusMessageUpdate(markPoint2Count);
  }, 500);
};

const handlePointClick = (resMarkCh, resData) => {
  const chS = rowData.rowsSel.filter(item => item.markCh2 === 'S').length;
  const chA = rowData.rowsSel.filter(item => item.markCh2 === 'A').length;
  const chB = rowData.rowsSel.filter(item => item.markCh2 === 'B').length;
  const chC = rowData.rowsSel.filter(item => item.markCh2 === 'C').length;
  const chD = rowData.rowsSel.filter(item => item.markCh2 === 'D').length;

  switch (resMarkCh) {
    case 'S':
      if (chS > pointValue.value.cnt.S) {
        resData.markPoint2 = 0;
        resData.markCh2 = null;
      } else {
        resData.markPoint2 = 100;
      }
      break;
    case 'A':
      if (chA > pointValue.value.cnt.A) {
        resData.markPoint2 = 0;
        resData.markCh2 = null;
      } else {
        resData.markPoint2 = 90;
      }
      break;
    case 'B':
      if (chB > pointValue.value.cnt.B) {
        resData.markPoint2 = 0;
        resData.markCh2 = null;
      } else {
        resData.markPoint2 = 80;
      }
      break;
    case 'C':
      if (chC > pointValue.value.cnt.C) {
        resData.markPoint2 = 0;
        resData.markCh2 = null;
      } else {
        resData.markPoint2 = 70;
      }
      break;
    case 'D':
      if (chD > pointValue.value.cnt.D) {
        resData.markPoint2 = 0;
        resData.markCh2 = null;
      } else {
        resData.markPoint2 = 60;
      }
      break;
    default:
      resData.markPoint2 = 0;
      break;
  }

  if (resData.markCh1 === '' || resData.markCh1 === null) {
    resData.markPoint2 = 0;
    resData.markCh2 = '';
    $q.dialog({
      dark: true,
      title: '1차평가미확인',
      message: '1차평가 진행 후 평가 하실 수 있습니다.',
      ok: {
        push: true,
        color: 'negative',
      },
    });
  } else {
    if (resData.markPoint2 > 0) {
      saveDataAndHandleResult(jsonUtil.dataJsonParse('I', resData));

      setTimeout(() => {
        const checkS = chS === pointValue.value.cnt.S;
        const checkA = chA === pointValue.value.cnt.A;
        const checkB = chB === pointValue.value.cnt.B;
        const checkC = chC === pointValue.value.cnt.C;
        const checkD = chD === pointValue.value.cnt.D;
        // false인 변수를 찾는 함수
        const checks = { checkS, checkA, checkB, checkC, checkD };
        const falseKeys = Object.keys(checks).filter(key => !checks[key]);

        if (falseKeys.length === 1) {
          const falseVariable = falseKeys[0];

          for (let i = 0; i < rowData.rowsSel.length; i++) {
            if (rowData.rowsSel[i].markCh1 === '' || rowData.rowsSel[i].markPoint2 > 0) {
            } else {
              switch (falseVariable) {
                case 'checkS':
                  rowData.rowsSel[i].markCh2 = 'S';
                  rowData.rowsSel[i].markPoint2 = '100';
                  break;
                case 'checkA':
                  rowData.rowsSel[i].markCh2 = 'A';
                  rowData.rowsSel[i].markPoint2 = '90';
                  break;
                case 'checkB':
                  rowData.rowsSel[i].markCh2 = 'B';
                  rowData.rowsSel[i].markPoint2 = '80';
                  break;
                case 'checkC':
                  rowData.rowsSel[i].markCh2 = 'C';
                  rowData.rowsSel[i].markPoint2 = '70';
                  break;
                case 'checkD':
                  rowData.rowsSel[i].markCh2 = 'D';
                  rowData.rowsSel[i].markPoint2 = '60';
                  break;
                default:
                  rowData.rowsSel[i].markCh2 = '';
                  rowData.rowsSel[i].markPoint2 = '';
                  break;
              }
              if (rowData.rowsSel[i].markPoint2 > 0) {
                saveDataAndHandleResult(jsonUtil.dataJsonParse('I', rowData.rowsSel[i]));
              }
            }
          }
        }
        const markPoint2Count = rowData.rowsSel.filter(item => item.markPoint2 > 0).length;
        statusMessageUpdate(markPoint2Count);
      }, 500);
    } else {
      saveDataAndHandleResult(jsonUtil.dataJsonParse('D', resData));

      setTimeout(() => {
        const markPoint2Count = rowData.rowsSel.filter(item => item.markPoint2 > 0).length;

        statusMessageUpdate(markPoint2Count);

        $q.dialog({
          dark: true,
          title: '인원초과',
          message: '평가대상점수 인원한도 초과입니다.',
          ok: {
            push: true,
            color: 'negative',
          },
        });
      }, 500);
    }
  }
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

  const evalCount = rowData.rows.filter(item => item.evalCount > 0).length;
  const markPoint2Count = rowData.rows.filter(item => rowData.rows.length !== item.evalCount).length;
  sendCheck.value.lockBtn = evalCount === markPoint2Count && evalCount !== 0;
  // console.log('ch :1: ', sendCheck.value.lock, evalCount, markPoint2Count);

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
      formData.evtEmpCd = '';
      formData.evsCd = selectedRows.value[0].evsCd;
      formData.itemFg = selectedRows.value[0].itemFg;
      formData.workNo = selectedRows.value[0].workNo;
      let tmpJson = '{"mode": "' + isSaveFg + '","data":' + JSON.stringify(formData) + '}';
      iuD.push(tmpJson);
      saveDataAndHandleResult(jsonUtil.jsonFiller(iu, iuD));

      setTimeout(() => {
        statusMessageUpdate(0);
        gridApi.value.deselectAll();
        rowData.rowsSel = [];
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
// ***** 기본설정자료 가져오기 부분  *****************************//
const setTotEva = ref(false);
const pointValue = ref({
  per1: {
    S: 0,
    A: 0,
    B: 0,
    C: 0,
    D: 0,
  },
  per2: {
    S: 0,
    A: 0,
    B: 0,
    C: 0,
    D: 0,
  },
  cnt: {
    S: 0,
    A: 0,
    B: 0,
    C: 0,
    D: 0,
  },
  cnt1: {
    S: 0,
    A: 0,
    B: 0,
    C: 0,
    D: 0,
  },
  cnt2: {
    S: 0,
    A: 0,
    B: 0,
    C: 0,
    D: 0,
  },
});
const getDataSetB = async () => {
  try {
    const response = await api.post('/api/aux/aux1020_select', {
      paramStdYear: storeYear.setYear,
    });
    setTotEva.value = response.data.data[0].eva2bYn === 'Y'; // 2차역량평가 항목기준 체크유무
    pointValue.value.per1.S = response.data.data[0].team1PerPointS;
    pointValue.value.per1.A = response.data.data[0].team1PerPointA;
    pointValue.value.per1.B = response.data.data[0].team1PerPointB;
    pointValue.value.per1.C = response.data.data[0].team1PerPointC;
    pointValue.value.per1.D = response.data.data[0].team1PerPointD;
    pointValue.value.per2.S = response.data.data[0].team2PerPointS;
    pointValue.value.per2.A = response.data.data[0].team2PerPointA;
    pointValue.value.per2.B = response.data.data[0].team2PerPointB;
    pointValue.value.per2.C = response.data.data[0].team2PerPointC;
    pointValue.value.per2.D = response.data.data[0].team2PerPointD;
    console.log('point : ', JSON.stringify(response.data.data[0]));
    formReadonly.value = true;
  } catch (error) {
    console.error('Error fetching users:', error);
  }
};
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
    const response = await api.post('/api/hce/hce2020_list', {
      paramSetYear: storeYear.setYear,
      paramEvsEmpCd: storeUser.setEmpCd,
      paramItemFg: setItemFg.value,
    });
    rowData.rows = response.data.data;
    // console.log('aa : ', JSON.stringify(response.data.data));
    if (rowData.rows.length === 0) {
      minHeight.value = 220;
      sendCheck.value.lock = false;
      sendCheck.value.lockBtn = false;
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
        formReadonly.value = true;
      } else {
        sendCheck.value.lockBtn = evalCount === empCount && evalCount !== 0;
        sendCheck.value.initialize = evalCount > 0;
        sendCheck.value.cnt = rowData.rowsSel.filter(item => item.markPoint2 > 0).length;
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
    const response = await api.post('/api/hce/hce2020_select_list', {
      paramStdYear: resRow.stdYear,
      paramEvsEmpCd: storeUser.setEmpCd,
      paramEvsCd: resRow.evsCd,
      paramItemFg: resRow.itemFg,
      paramWorkNo: resRow.workNo,
    });

    rowData.rowsSel = response.data.data;
    if (resRow.itemFg === '2021101') {
      pointValue.value.cnt.S = Math.round((rowData.rowsSel.length * pointValue.value.per1.S) / 100);
      pointValue.value.cnt.A = Math.round((rowData.rowsSel.length * pointValue.value.per1.A) / 100);
      pointValue.value.cnt.C = Math.round((rowData.rowsSel.length * pointValue.value.per1.C) / 100);
      pointValue.value.cnt.D = Math.round((rowData.rowsSel.length * pointValue.value.per1.D) / 100);
      pointValue.value.cnt.B =
        rowData.rowsSel.length - (pointValue.value.cnt.S + pointValue.value.cnt.A + pointValue.value.cnt.C + pointValue.value.cnt.D);
    } else {
      pointValue.value.cnt.S = Math.round((rowData.rowsSel.length * pointValue.value.per2.S) / 100);
      pointValue.value.cnt.A = Math.round((rowData.rowsSel.length * pointValue.value.per2.A) / 100);
      pointValue.value.cnt.C = Math.round((rowData.rowsSel.length * pointValue.value.per2.C) / 100);
      pointValue.value.cnt.D = Math.round((rowData.rowsSel.length * pointValue.value.per2.D) / 100);
      pointValue.value.cnt.B =
        rowData.rowsSel.length - (pointValue.value.cnt.S + pointValue.value.cnt.A + pointValue.value.cnt.C + pointValue.value.cnt.D);
    }

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
    .post('/api/hce/hce2020_save', resFormData)
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
.wrap-text { white-space: normal !important; word-wrap: break-word !important; overflow: visible !important; line-height: 1.5; /* Optional: Adjust
line height for better readability */ }

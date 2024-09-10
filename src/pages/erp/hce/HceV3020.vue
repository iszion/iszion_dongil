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
        <div class="col-xs-12 col-md-12 col-lg-5 q-gutter-y-md">
          <q-card class="q-pa-sm">
            <q-card-actions class="row q-px-none">
              <q-avatar color="red" text-color="white" size="md">1번</q-avatar>
              <q-space />
              <div class="row q-gutter-x-xs">
                <q-btn outline color="grey" dense @click="getDataCatg"> <q-icon name="refresh" size="xs" class="q-mr-xs" /> 자료정리 </q-btn>
                <q-btn v-if="sendCheck.lockBtn" outline color="blue-12" dense @click="saveDataLockSendSection">
                  <q-icon name="lock" size="xs" class="q-mr-xs" />
                  평가마감하기
                </q-btn>
              </div>
            </q-card-actions>
            <q-card-section class="q-pa-none">
              <div :style="{ height: gridHeightCatg + 60 + 'px' }">
                <ag-grid-vue
                  style="width: 100%; height: 100%"
                  :class="$q.dark.isActive ? 'ag-theme-alpine-dark' : 'ag-theme-alpine'"
                  :columnDefs="columnDefs.catg"
                  :rowData="rowData.rowsCatg"
                  :defaultColDef="defaultColDef.catg"
                  rowSelection="single"
                  @selection-changed="onSelectionChangedCatg"
                  @grid-ready="onGridReadyCatg"
                  :grid-options="gridOptionsCatg"
                >
                </ag-grid-vue>
              </div>
            </q-card-section>
          </q-card>

          <q-card class="q-pa-sm">
            <q-card-actions class="row q-px-none">
              <q-avatar color="red" text-color="white" size="md">2번</q-avatar>
              <q-space />
              <div class="row q-gutter-x-xs">
                <q-btn outline color="grey" dense @click="getDataCall">
                  <q-icon name="refresh" size="xs" class="q-mr-xs" />
                  자료정리
                </q-btn>
              </div>
            </q-card-actions>
            <q-card-section class="q-pa-none">
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
            </q-card-section>
          </q-card>
        </div>
        <div class="col-xs-12 col-md-12 col-lg-7">
          <!--      {{ contentZoneHeight }} = {{ state.height }}-->
          <q-card class="q-pa-xs">
            <q-toolbar class="row q-pa-none">
              <q-avatar color="red" text-color="white" size="md">3번</q-avatar>
              <span v-if="viewInfo.seq" class="q-ml-md text-subtitle1">
                <span class="q-mr-xs">
                  항목번호 :
                  <span class="text-indigo-12 text-bold q-ml-sm">[ {{ viewInfo.seq }} ]</span>
                </span>
              </span>

              <q-space />
              <q-btn v-if="sendCheck.lockOk && sendCheck.cnt > 0" outline color="deep-orange" dense class="q-pr-md" @click="deleteDataSection()">
                <q-icon name="delete" size="xs" class="q-mr-xs" />
                <q-badge color="orange" floating>{{ sendCheck.cnt }}</q-badge>
                초기화
              </q-btn>
            </q-toolbar>
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
                  <div class="bg-deep-orange-3 text-center text-subtitle2 text-bold q-px-xs">평가하기</div>
                  <div class="q-pa-sm text-subtitle1 text-bold flex flex-center q-gutter-x-lg">전체 평가점수 합이 80%을 넘을 수 없습니다.</div>
                </q-card>
              </div>
            </div>

            <q-separator />

            <q-scroll-area :style="contentZoneStyle">
              <div v-if="isShowMessage" style="width: 100%" class="q-pa-xl">
                <span class="text-subtitle1 text-bold row flex-center">관련팀원이 없습니다.</span>
              </div>
              <div style="width: 100%" v-for="(data, index) in rowData.rowsSel" :key="data.seq" class="q-mb-sm">
                <div class="row">
                  <q-card class="col-xs-12 col-sm-12 col-md-6 shadow-3">
                    <div class="row">
                      <div class="col-xs-2 col-sm-2 col-md-1">
                        <div class="text-subtitle1 text-center q-pa-xs">
                          {{ index + 1 }}
                        </div>
                      </div>

                      <div class="col-xs-2 col-sm-2 col-md-2">
                        <div class="flex flex-center">
                          <q-avatar v-if="data.imageFileNm">
                            <q-img
                              class="cursor-pointer"
                              :src="`https://hr.energyshop.co.kr/imagesThumbnail/${data.imageFileNm}?${new Date().getTime()}`"
                              style="object-fit: cover; width: 100%; height: 100%"
                              @click="handleShowImage(data)"
                            />
                          </q-avatar>
                          <q-icon v-if="!data.imageFileNm" name="face" color="teal" size="50px" style="height: 50px" />
                        </div>
                      </div>

                      <div class="col-xs-3 col-sm-3 col-md-2">
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
            </q-scroll-area>
          </q-card>
        </div>
      </div>
    </q-card>

    <!-- 이미지 원본보기 Dialog -->
    <q-dialog v-model="dialogOpen">
      <q-card bordered style="max-width: 450px; width: 100%">
        <q-img :src="showImage.fullImageUrl" style="max-width: 100%; max-height: 100vh" />
        <q-card-section>
          <div class="row no-wrap items-center">
            <div class="col text-h6 ellipsis">{{ showImage.empNm }}</div>
            <div class="q-gutter-x-sm">
              <span class="text-subtitle1">{{ showImage.deptNm }}</span>
              <span class="text-subtitle2">{{ showImage.titlNm }}</span>
            </div>
          </div>
        </q-card-section>

        <q-card-section class="q-pt-none"> </q-card-section>

        <q-separator />

        <q-card-actions align="right">
          <q-btn v-close-popup flat color="primary" label="닫기" />
        </q-card-actions>
      </q-card>
    </q-dialog>
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

const rowData = reactive({ rows: [], rowsSel: [], rowsCatg: [] });
const formReadonly = ref(false);
const isShowMessage = ref(false);

// grid Height 자동처리부분
const gridHeightCatg = ref(200); // 초기 높이
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

const gridApiCatg = ref(null);
const onGridReadyCatg = params => {
  gridApiCatg.value = params.api;
  gridApiCatg.value.setGridOption('headerHeight', 45);
  gridApiCatg.value.setGridOption('rowHeight', 45);
  gridApiCatg.value.deselectAll();
  params.api.sizeColumnsToFit();
};
const gridApi = ref(null);
const onGridReady = params => {
  gridApi.value = params.api;
  // gridApi.value.setGridOption('headerHeight', 45);
  // gridApi.value.setGridOption('rowHeight', 45);
  gridApi.value.deselectAll();
  // params.api.sizeColumnsToFit();
};

const defaultColDef = reactive({
  catg: {
    flex: 1,
    sortable: true,
    filter: true,
    floatingFilter: false,
    editable: false,
  },
  group: {
    flex: 1,
    sortable: true,
    filter: true,
    floatingFilter: false,
    editable: false,
  },
});
const columnDefs = reactive({
  catg: [
    {
      headerName: '평가그룹',
      field: 'catgNm',
      pinned: 'left',
      minWidth: 100,
      resizable: true,
    },
    {
      headerName: '진행상태',
      field: 'statusMessage',
      minWidth: 100,
      cellStyle: params => {
        return getStatusMessageStyle(params.data);
      },
    },
    {
      headerName: '',
      field: '',
      minWidth: 100,
      sortable: false,
      filter: false,
    },
  ],
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
    return $q.dark.isActive ? { color: 'white' } : { color: 'black' };
    // return { textAlign: 'center' };
  }
};

onBeforeUnmount(() => {
  // console.log('onBeforeUnmount....');
  // Remove the resize event listener when the component is destroyed
  window.removeEventListener('resize', handleResize);
});
onBeforeMount(() => {
  // 평가대상그룹 불러오기
  getDataCatg();

  // 평가항목 불러오기
  // getData();
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

// 근태정보 view
const viewInfo = ref({
  itemNm: null,
  seq: 0,
  attenYn: false,
});

const pointValue = ref({
  cntS: 0,
  cntA: 0,
  cntB: 0,
  cntC: 0,
  cntD: 0,
});

const selectedRowsCatg = ref([]);
const onSelectionChangedCatg = event => {
  selectedRowsCatg.value = event.api.getSelectedRows();
  // console.log('sel: ', JSON.stringify(selectedRows.value));
  if (selectedRowsCatg.value.length === 1) {
    getDataCall();
  }
};
const getDataCall = () => {
  getData(selectedRowsCatg.value[0]).then(() => {
    if (selectedRowsCatg.value[0].catgCnt > 5) {
      pointValue.value.cntS = selectedRowsCatg.value[0].teamCntS;
      pointValue.value.cntA = selectedRowsCatg.value[0].teamCntA;
      pointValue.value.cntB = selectedRowsCatg.value[0].teamCntB;
      pointValue.value.cntC = selectedRowsCatg.value[0].teamCntC;
      pointValue.value.cntD = selectedRowsCatg.value[0].teamCntD;
    } else if (selectedRowsCatg.value[0].catgCnt === 5) {
      pointValue.value.cntS = 1;
      pointValue.value.cntA = 1;
      pointValue.value.cntB = 1;
      pointValue.value.cntC = 1;
      pointValue.value.cntD = 1;
    } else if (selectedRowsCatg.value[0].catgCnt === 4) {
      pointValue.value.cntS = 1;
      pointValue.value.cntA = 1;
      pointValue.value.cntB = 1;
      pointValue.value.cntC = 1;
      pointValue.value.cntD = 0;
    } else if (selectedRowsCatg.value[0].catgCnt === 3) {
      pointValue.value.cntS = 1;
      pointValue.value.cntA = 1;
      pointValue.value.cntB = 1;
      pointValue.value.cntC = 0;
      pointValue.value.cntD = 0;
    } else if (selectedRowsCatg.value[0].catgCnt === 2) {
      pointValue.value.cntS = 1;
      pointValue.value.cntA = 1;
      pointValue.value.cntB = 0;
      pointValue.value.cntC = 0;
      pointValue.value.cntD = 0;
    } else if (selectedRowsCatg.value[0].catgCnt === 1) {
      pointValue.value.cntS = 1;
      pointValue.value.cntA = 0;
      pointValue.value.cntB = 0;
      pointValue.value.cntC = 0;
      pointValue.value.cntD = 0;
    }
  });
};
const selectedRows = ref([]);
const onSelectionChanged = event => {
  selectedRows.value = event.api.getSelectedRows();
  // console.log('sel: ', JSON.stringify(selectedRows.value));
  viewInfo.value.itemNm = null;
  viewInfo.value.seq = 0;

  if (selectedRows.value.length === 1) {
    tmpMark.value.markPoint2 = 0;
    tmpMark.value.markCh2 = null;

    viewInfo.value.attenYn = selectedRows.value[0].attenYn === 'Y';
    formReadonly.value = selectedRows.value[0].statusMessage === '평가마감';

    viewInfo.value.itemNm = selectedRows.value[0].itemNm;
    viewInfo.value.seq = selectedRows.value[0].seq;
    // console.log('sel: ', JSON.stringify(selectedRows.value[0]));
    getDataSelectList(selectedRows.value[0]).then(() => {
      isShowMessage.value = rowData.rowsSel.length === 0;
      // const evalCount = rowData.rows.filter(item => item.evalCount > 0).length;
      // const empCount = rowData.rows.filter(item => item.empCount > 0).length;
      const lockYn2Count = rowData.rows.filter(item => item.lockYn2 === 'Y').length;
      if (lockYn2Count > 0) {
        formReadonly.value = true;
      } else {
        sendCheck.value.cnt = rowData.rowsSel.filter(item => item.markPoint2 > 0).length;
      }
    });
  }
};

const lockBtnCheck = () => {
  const _maxPerCnt = rowData.rowsCatg.reduce((sum, current) => sum + current.maxPerCnt, 0);
  const _maxEvlCnt = rowData.rowsCatg.reduce((sum, current) => sum + current.maxEvlCnt, 0);
  const checkEvlCnt = rowData.rowsCatg.filter(item => item.statusMessage === '평가완료').length;
  const checkLockCnt = rowData.rowsCatg.filter(item => item.statusMessage === '마감완료').length;
  sendCheck.value.lockBtn = checkEvlCnt === rowData.rowsCatg.length && rowData.rowsCatg.length > 0;
  sendCheck.value.lockOk = checkLockCnt === rowData.rowsCatg.length && rowData.rowsCatg.length > 0;
};

const sendCheck = ref({
  lockBtn: false,
  lockOk: false,
  cnt: 0,
});

// ======================================================
const screenSizeHeight = ref(0);
const myTweak = offset => {
  screenSizeHeight.value = offset;
  return { minHeight: offset ? `calc(100vh - ${offset}px)` : '100vh' };
};
const handleResize = () => {
  contentZoneHeight.value = window.innerHeight - screenSizeHeight.value - 360;
  // contentZoneHeight.value = window.innerHeight - state.height - 680;
};
// ======================================================

const handlePointClick = (resMarkCh, resData) => {
  switch (resMarkCh) {
    case 'S':
      resData.markPoint2 = 100;
      break;
    case 'A':
      resData.markPoint2 = 90;
      break;
    case 'B':
      resData.markPoint2 = 80;
      break;
    case 'C':
      resData.markPoint2 = 70;
      break;
    case 'D':
      resData.markPoint2 = 60;
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
      const result = percentOverCheck(resData);
      if (result) {
        saveDataAndHandleResult(jsonUtil.dataJsonParse('I', resData))
          .then(saveStatus => {
            const markPoint2Count = rowData.rowsSel.filter(item => item.markPoint2 > 0).length;
            statusMessageUpdate(markPoint2Count);
          })
          .catch(error => {
            console.error('Error saving data: ', error);
          });
      }
    }
  }
};

function revertDataSet(resData) {
  for (let i = 0; i < rowData.rowsSel.length; i++) {
    if (rowData.rowsSel[i].evtEmpCd === resData.evtEmpCd) {
      rowData.rowsSel[i].markCh2 = rowData.rowsSel[i].markCh2Old;
      rowData.rowsSel[i].markPoint2 = rowData.rowsSel[i].markPoint2Old;
    }
  }
  let saveStatus = {};
  saveStatus.msgColor = 'negative';
  saveStatus.msgTextColor = 'white';
  saveStatus.msgCaption = '되돌리기';
  saveStatus.msgMessage = '선택범위를 넘었습니다.';

  notifySave.notifyUserView(saveStatus, 1000);
}
function saveDataSet(resData) {
  for (let i = 0; i < rowData.rowsSel.length; i++) {
    if (rowData.rowsSel[i].evtEmpCd === resData.evtEmpCd) {
      rowData.rowsSel[i].markCh2Old = rowData.rowsSel[i].mark2Ch;
      rowData.rowsSel[i].markPoint2Old = rowData.rowsSel[i].markPoint2;
    }
  }
}

const percentOverCheck = resData => {
  let maxInwon = rowData.rowsSel.length;
  const checkPer = rowData.rowsSel.reduce((sum, row) => sum + row.markPoint2, 0) / maxInwon;
  if (maxInwon === 1) {
    saveDataSet(resData);
    return true;
  } else if (maxInwon === 2) {
    if (checkPer > 85) {
      revertDataSet(resData);
      return false;
    } else {
      saveDataSet(resData);
      return true;
    }
  } else if (checkPer > 80) {
    revertDataSet(resData);
    return false;
  } else {
    saveDataSet(resData);
    return true;
  }
};

const statusMessageUpdate = resEvalCount => {
  //========================
  // 평가항목자료 view 처리부분
  let selectedRow = gridApi.value.getSelectedNodes()[0];

  if (selectedRow.data.lockYn2 === 'Y') {
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
  // 평가항목자료 view 처리부분 끝
  //========================

  setTimeout(() => {
    //========================
    // 평가그룹자료 view 처리부분
    statusMessageUpdateCatg();
    // 평가그룹자료 view 처리부분 끝
    //========================
  }, 500);
};

const statusMessageUpdateCatg = () => {
  let selectedRowCatg = gridApiCatg.value.getSelectedNodes()[0];
  const checkLockCnt = rowData.rows.filter(item => item.statusMessage === '평가완료').length;
  const checkZeroCnt = rowData.rows.filter(item => item.statusMessage === '평가대기').length;
  if (checkLockCnt === rowData.rows.length) {
    selectedRowCatg.data.statusMessage = '평가완료';
  } else if (checkZeroCnt === rowData.rows.length) {
    selectedRowCatg.data.statusMessage = '평가대기';
  } else {
    selectedRowCatg.data.statusMessage = '평가중';
  }
  getStatusMessageStyle(selectedRowCatg.data);
  // 그리드에 변경 사항을 반영하도록 갱신합니다.
  gridApiCatg.value.applyTransaction({ update: [selectedRowCatg.data] });

  lockBtnCheck();
  // 평가마감버튼 활성화 체크부분
  // const lockCnt = rowData.rowsCatg.filter(item => item.statusMessage === '평가완료').length;
  // sendCheck.value.lockBtn = lockCnt === rowData.rowsCatg.length;

  sendCheck.value.cnt = rowData.rowsSel.filter(item => item.markPoint2 > 0).length;
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

      const formData = rowData.rowsSel.filter(item => item.markPoint2 > 0);
      for (let i = 0; i < formData.length; i++) {
        // console.log('aaaa :: ', JSON.stringify(formData[i]));
        let tmpJson = '{"mode": "' + isSaveFg + '","data":' + JSON.stringify(formData[i]) + '}';
        iuD.push(tmpJson);
      }

      saveDataAndHandleResult(jsonUtil.jsonFiller(iu, iuD))
        .then(saveStatus => {
          // console.log('saveStatus.rtn: ', saveStatus.rtn); // saveStatus.rtn 값을 사용
          if (saveStatus.rtn === '0') {
            statusMessageUpdate(0);
            gridApi.value.deselectAll();
            rowData.rowsSel = [];
          }
        })
        .catch(error => {
          console.error('Error saving data: ', error);
        });
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
      saveDataAndHandleResult(jsonUtil.jsonFiller(iu, iuD))
        .then(saveStatus => {
          // console.log('saveStatus.rtn: ', saveStatus.rtn); // saveStatus.rtn 값을 사용
          // if (saveStatus.rtn === '0') {
          getDataCatg();
          // }
        })
        .catch(error => {
          console.error('Error saving data: ', error);
        });
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

// 평가분류대상항목 자료 불러오기
const getDataCatg = async () => {
  try {
    const response = await api.post('/api/hce/hce2020_list_catg', {
      paramSetYear: storeYear.setYear,
      paramEvsEmpCd: storeUser.setEmpCd,
    });
    rowData.rowsCatg = response.data.data;
    lockBtnCheck();

    // console.log('aa : ', JSON.stringify(response.data.data));
    if (rowData.rowsCatg.length === 0) {
      minHeight.value = 220;
      sendCheck.value.lock = false;
    } else {
      const calculatedHeight = rowData.rowsCatg.length * rowHeight;
      gridHeightCatg.value = minHeight.value + calculatedHeight;

      rowData.rows = [];
      rowData.rowsSel = [];
    }
  } catch (error) {
    console.error('Error fetching users:', error);
  }
};
// 평가항목 자료 불러오기
const getData = async resData => {
  try {
    const response = await api.post('/api/hce/hce2020_list', {
      paramSetYear: resData.stdYear,
      paramEvsEmpCd: storeUser.setEmpCd,
      paramCatgCd: resData.catgCd,
      paramItemFg: resData.itemFg,
    });
    rowData.rows = response.data.data;
    // console.log('aa : ', JSON.stringify(response.data.data));
    if (rowData.rows.length === 0) {
      minHeight.value = 220;
      sendCheck.value.lock = false;
    } else {
      const calculatedHeight = rowData.rows.length * rowHeight;
      gridHeight.value = minHeight.value + calculatedHeight;

      rowData.rowsSel = [];
    }
  } catch (error) {
    console.error('Error fetching users:', error);
  }
};

// ***** 목표승인대상자 승인대상자료 목록 자료 가져오기 부분  *****************************//

const getDataSelectList = async resRow => {
  console.log('resRow : ', JSON.stringify(resRow));
  try {
    const response = await api.post('/api/hce/hce2020_select_list', {
      paramStdYear: resRow.stdYear,
      paramEvsEmpCd: storeUser.setEmpCd,
      paramEvsCd: resRow.evsCd,
      paramCatgCd: resRow.catgCd,
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
const saveDataAndHandleResult = async resFormData => {
  // console.log('save :: ', JSON.stringify(resFormData));
  try {
    const res = await api.post('/api/hce/hce2020_save', resFormData);
    let saveStatus = {
      rtn: res.data.rtn,
      rtnMsg: res.data.rtnMsg,
    };
    notifySave.notifyView(saveStatus);
    return saveStatus; // saveStatus 객체를 반환
  } catch (error) {
    console.log('error: ', error);
    throw error; // 에러 발생 시 에러를 던져 호출자에서 처리할 수 있도록 함
  }
};

// **************************************************************//
// ***** DataBase 연결부분 끝  *************************************//
// **************************************************************//
// 이미지 팝업 뷰
const dialogOpen = ref(false);
const showImage = ref({
  fullImageUrl: '',
  empNm: '',
  deptNm: '',
  titlNm: '',
});
const handleShowImage = data => {
  showImage.value.fullImageUrl = `https://hr.energyshop.co.kr/images/${data.imageFileNm}?${new Date().getTime()}`;
  showImage.value.empNm = data.evtEmpNm;
  showImage.value.deptNm = data.evtDeptNm;
  showImage.value.titlNm = data.evtTitlNm;
  dialogOpen.value = true;
};
// 이미지 팝업 뷰 끝

const gridOptionsCatg = {
  localeText: { noRowsToShow: '조회 결과가 없습니다.' },
};
const gridOptions = {
  localeText: { noRowsToShow: '조회 결과가 없습니다.' },
};
</script>
<style scoped>
.wrap-text {
  white-space: normal !important;
}
</style>

<template>
  <q-page class="q-pa-xs-xs q-pa-sm-md" :style-fn="myTweak">
    <q-card class="q-pa-sm">
      <div class="row">
        <div class="col-xs-12 col-sm-12 col-lg-8">
          <div class="row q-col-gutter-x-sm">
            <div class="col-xs-12 col-sm-6">
              <q-banner rounded :class="$q.dark.isActive ? 'bg-grey-9' : 'bg-grey-3'" style="height: 100%">
                <template v-slot:avatar>
                  <q-icon name="menu_book" color="primary" size="md" />
                </template>
                <span class="text-subtitle1 text-bold"> 목표에대한 성과및업적에 대한 평가작업입니다.</span><br />
                1. <span class="text-teal text-bold">평가대기</span> 자료만 평가하실 수 있습니다.<br />
                2. 선택한 직원의 평가완료 시 <span class="text-teal text-bold">평가마감</span>버튼이 활성화됩니다.<br />
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
        <div class="col-xs-12 col-sm-12 col-lg-4 q-my-sm">
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
              <q-btn
                v-if="sendCount.cancel > 0"
                outline
                color="deep-orange"
                dense
                class="q-pr-md q-ml-sm"
                @click="deleteDataSection(sendCount.cancel)"
              >
                <q-badge color="orange" floating>{{ sendCount.cancel }}</q-badge>
                <q-icon name="delete" size="xs" class="q-mr-xs" />
                평가취소하기
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
              <div class="row q-gutter-x-sm"></div>
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
                        val="S"
                        label="S"
                        color="deep-orange"
                        class="text-subtitle1 text-bold"
                        @update:model-value="val => handlePointClick(val, data)"
                      />
                      <q-radio
                        keep-color
                        v-model="data.markCh"
                        val="A"
                        label="A"
                        color="blue"
                        class="text-subtitle1 text-bold"
                        @update:model-value="val => handlePointClick(val, data)"
                      />
                      <q-radio
                        keep-color
                        v-model="data.markCh"
                        val="B"
                        label="B"
                        color="cyan"
                        class="text-subtitle1 text-bold"
                        @update:model-value="val => handlePointClick(val, data)"
                      />
                      <q-radio
                        keep-color
                        v-model="data.markCh"
                        val="C"
                        label="C"
                        color="teal"
                        class="text-subtitle1 text-bold"
                        @update:model-value="val => handlePointClick(val, data)"
                      />
                      <q-radio
                        keep-color
                        v-model="data.markCh"
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
        if (
          params.data.authCnt0 + params.data.authCnt1 + params.data.authCnt2 + params.data.authCnt3 + params.data.authCnt4 + params.data.authCnt5 ===
          0
        ) {
          return $q.dark.isActive ? { color: 'orange' } : { color: 'orange' };
          // return { textAlign: 'center' };
        } else {
          return $q.dark.isActive ? { color: 'teal' } : { color: 'teal' };
          // return { textAlign: 'center' };
        }
      },
    },
  ],
});

const viewPoint = ref({
  selfPoint: 0,
  markPoint: 0,
  isEvalOk: false,
});

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

const selectedRows = ref([]);
const onSelectionChanged = event => {
  selectedRows.value = event.api.getSelectedRows();
  // console.log('sel: ', JSON.stringify(selectedRows.value));
  if (selectedRows.value.length === 1) {
    getDataSelectList(selectedRows.value[0].stdYear, selectedRows.value[0].evsEmpCd, selectedRows.value[0].evtEmpCd);
  }
};

const sendCount = ref({
  cancel: 0,
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

  console.log('form : ', JSON.stringify(resData));
  saveDataAndHandleResult(jsonUtil.dataJsonParse('I', resData));
};

const deleteDataSection = resCnt => {
  $q.dialog({
    dark: true,
    title: '평가취소',
    message: '선택된 ' + resCnt + '건 평가자료를 모두 취소 하시겠습니까? ',
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
      for (let i = 0; i < rowData.rows.length; i++) {
        let tmpJson = '{"mode": "' + isSaveFg + '","data":' + JSON.stringify(rowData.rows[i]) + '}';
        iuD.push(tmpJson);
      }
      saveDataAndHandleResult(jsonUtil.jsonFiller(iu, iuD));
      setTimeout(() => {
        getDataSelectList(selectedRows.value[0].stdYear, selectedRows.value[0].evsEmpCd, selectedRows.value[0].evtEmpCd);
      }, 500);
    })
    .onCancel(() => {})
    .onDismiss(() => {
      // 확인/취소 모두 실행되었을때
    });
};

// 성과평가 평가마감하기
const saveDataEvalOkSendAllSection = () => {
  $q.dialog({
    dark: true,
    title: '평가마감하기',
    message: '선택된 ' + rowData.rows.length + '건의 평가자료를 모두 마감 하시겠습니까? ',
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
      formData.empCd = selectedRows.value[0].evtEmpCd;
      formData.status = '5';
      formData.acceptYn = 'N';
      let tmpJson = '{"mode": "' + isSaveFg + '","data":' + JSON.stringify(formData) + '}';
      iu.push(tmpJson);
      saveDataAndHandleResult(jsonUtil.jsonFiller(iu, iuD));
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
    const response = await api.post('/api/hpe/hpe2020_list', { paramSetYear: storeYear.setYear, paramEmpCd: storeUser.setEmpCd });
    rowData.rows = response.data.data;
    // console.log('aa : ', JSON.stringify(response.data.data));
    if (rowData.rows.length === 0) {
      minHeight.value = 220;
    }
    const calculatedHeight = rowData.rows.length * rowHeight;
    gridHeight.value = minHeight.value + calculatedHeight;

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
    viewPoint.value.selfPoint = 0;
    viewPoint.value.markPoint = 0;

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
// saveStatus = 평가점수 저장
const saveDataAndHandleResult = resFormData => {
  api
    .post('/api/hpe/hpe2020_save', resFormData)
    .then(res => {
      // for (let i = 0; i < selectedRowsSel.value.length; i++) {
      //   if (selectedRowsSel.value[i].workNo === res.data.data[0].workNo) {
      //     console.log('row1 :: ', res.data.data[0].markPoint);
      //     selectedRowsSel.value[i].markPoint = res.data.data[0].markPoint;
      //     console.log('row2 :: ', selectedRowsSel.value[i].markPoint);
      //   }
      // }
      // gridKey.value += 1;
      // const rowNode = gridApiSel.value.getRowNode(res.data.data[0].workNo);
      // console.log('node :: ', JSON.stringify(rowNode));
      // rowNode.setDataValue('markPoint', res.data.data[0].markPoint);
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

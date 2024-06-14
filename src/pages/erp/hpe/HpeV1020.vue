<template>
  <q-page class="q-pa-xs-xs q-pa-sm-md" :style-fn="myTweak">
    <q-card class="q-pa-sm">
      <div class="row">
        <div class="col-xs-12 col-md-12 col-lg-8">
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
        <div class="col-xs-12 col-md-12 col-lg-4 q-my-sm">
          <q-card class="q-ml-lg-md q-pa-sm" :class="$q.screen.xs ? 'q-mt-xs' : 'row flex-center'" style="height: 100%">
            <q-space />
            <q-card-section class="row q-pa-none justify-center">
              <span class="text-bold text-subtitle2 q-pr-sm text-blue">작성자<q-icon name="chevron_right" size="xs" /> </span>
              <q-breadcrumbs separator="|" class="text-blue text-bold" active-color="secondary">
                <q-breadcrumbs-el icon="room_preferences" :label="setEvGroup.evtGroup.deptNm" style="width: 90px" />
                <q-breadcrumbs-el icon="star_half" :label="setEvGroup.evtGroup.titlNm" style="width: 60px" />
                <q-breadcrumbs-el icon="person" :label="setEvGroup.evtGroup.empNm" style="width: 70px" />
              </q-breadcrumbs>
            </q-card-section>
            <q-space />
            <q-card-section class="row q-pa-none justify-center">
              <span class="text-bold text-subtitle2 q-pr-sm text-orange">승인자<q-icon name="chevron_right" size="xs" /></span>
              <q-breadcrumbs separator="|" class="text-orange text-bold" active-color="secondary">
                <q-breadcrumbs-el icon="room_preferences" :label="setEvGroup.evsGroup.deptNm" style="width: 90px" />
                <q-breadcrumbs-el icon="star" :label="setEvGroup.evsGroup.titlNm" style="width: 60px" />
                <q-breadcrumbs-el icon="person" :label="setEvGroup.evsGroup.empNm" style="width: 70px" />
              </q-breadcrumbs>
            </q-card-section>
          </q-card>
        </div>
      </div>
    </q-card>

    <q-separator spaced />

    <q-card>
      <q-card-section class="text-center q-pa-sm" :class="$q.dark.isActive ? 'bg-teal-7' : 'bg-teal-3'">
        <q-item-label class="text-h6">목표성과등록 / 자기평가하기</q-item-label>
      </q-card-section>
      <q-separator size="3px" class="q-mb-xs" />

      <div class="row">
        <div class="col-xs-12 col-md-7">
          <q-card-section>
            <q-toolbar class="row q-pa-none">
              <div class="q-gutter-xs">
                <q-btn outline color="grey" dense @click="getData"
                  ><q-icon name="refresh" size="xs" class="q-mr-xs" />
                  다시 불러오기
                </q-btn>
              </div>
              <q-space />
              <q-btn v-if="statusCheck.cancelHide" outline color="indigo-7" dense @click="sendAuthRequestCancel" class="q-pr-md">
                <q-badge color="orange" floating>{{ sendCountCancel }}</q-badge>
                <q-icon name="replay" size="xs" class="q-pr-xs" /> 평가대기취소
              </q-btn>
              <q-btn v-if="statusCheck.sendHide" outline color="indigo-12" dense @click="sendAuthRequest" class="q-pr-md q-ml-md">
                <q-badge color="orange" floating>{{ sendCount }}</q-badge>
                <q-icon name="send" size="xs" class="q-pr-xs" /> 평가요청
              </q-btn>
            </q-toolbar>
            <div :key="gridKey" :style="{ height: gridHeight + 'px' }">
              <ag-grid-vue
                style="width: 100%; height: 100%"
                :class="$q.dark.isActive ? 'ag-theme-alpine-dark' : 'ag-theme-alpine'"
                :columnDefs="columnDefs.columns"
                :rowData="rowData.rows"
                :defaultColDef="defaultColDef.def"
                :rowSelection="rowSelection"
                @selection-changed="onSelectionChanged"
                @grid-ready="onGridReady"
                :grid-options="gridOptions"
              >
              </ag-grid-vue>
            </div>
          </q-card-section>
        </div>
        <div class="col-xs-12 col-md-5">
          <q-card-section>
            <q-toolbar class="row q-pa-none">
              <q-breadcrumbs v-if="formData.status !== '4'" gutter="none" class="text-orange" active-color="grey">
                <q-breadcrumbs-el label="진행중" v-if="formData.status >= 0 && selectedRows.length === 1" />
                <q-breadcrumbs-el label="승인대기" v-if="formData.status >= 1 && selectedRows.length === 1" />
                <q-breadcrumbs-el label="평가작성" v-if="formData.status >= 3 && selectedRows.length === 1" />
                <q-breadcrumbs-el label="평가대기" v-if="formData.status >= 4 && selectedRows.length === 1" />
                <q-breadcrumbs-el label="평가완료" v-if="formData.status >= 5 && selectedRows.length === 1" />
              </q-breadcrumbs>
              <q-breadcrumbs gutter="none" class="text-orange" active-color="grey">
                <q-breadcrumbs-el label="승인반려" v-if="formData.status === '2' && selectedRows.length === 1" />
              </q-breadcrumbs>
              <q-space />
              <div class="q-gutter-xs">
                <q-btn v-if="formData.status === '3'" outline color="blue-12" dense @click="saveDataSection">
                  <q-icon name="save" size="xs" /><span v-if="!$q.screen.xs" class="q-ml-xs">저장</span>
                </q-btn>
                <q-btn v-if="formData.status === '3' && formData.selfCh !== ''" outline color="grey" dense @click="clearFieldSection">
                  <q-icon name="backspace" size="xs" /> <span v-if="!$q.screen.xs" class="q-ml-xs">초기화</span>
                </q-btn>
              </div>
            </q-toolbar>
            <q-card class="q-pa-sm q-mb-md">
              <q-banner rounded :class="$q.dark.isActive ? 'bg-grey-9' : 'bg-grey-2'" class="q-pa-sm">
                <template v-slot:avatar>
                  <q-icon name="ads_click" style="width: 20px" size="sm" />
                </template>
                <span v-html="formData.targetDoc" />
                <template v-slot:action>
                  <span class="text-bold text-subtitle1 text-teal"> 설정목표 </span>
                </template>
              </q-banner>
            </q-card>
            <q-card class="q-pa-sm q-mb-xs">
              <q-input
                ref="focusStart"
                :readonly="formReadonly"
                :disable="formDisable"
                v-model="formData.workDoc"
                clearable
                type="textarea"
                color="blue-13"
                label-color="blue-13"
                label="성과업적/실적"
                rows="3"
                :hint="`${byteCount} / 200자 까지 입력하실 수 있습니다.`"
                @update:model-value="updateByteCount"
              />
            </q-card>
            <q-card class="q-pa-sm">
              <div class="row q-col-gutter-x-xl">
                <div class="col">
                  <q-field label="가중치" stack-label bottom-slots label-color="orange">
                    <template v-slot:control>
                      <div class="self-center full-width no-outline" tabindex="0">{{ formData.weight }}</div>
                    </template>
                    <template v-slot:hint>{{ formData.weight }} / {{ totalWeight }}</template>
                  </q-field>
                </div>
                <div class="col">
                  <q-field dense ref="fieldRef" :model-value="formData.workPer" :hint="'목표달성율' + formData.workPer + '%'" class="q-mt-md">
                    <template v-slot:control>
                      <q-slider readonly v-model="formData.workPer" :min="0" :max="100" label-always />
                      <span></span>
                    </template>
                  </q-field>
                </div>
                <div class="col">
                  <q-field label="자기평가점수" stack-label bottom-slots label-color="red">
                    <template v-slot:control>
                      <div class="self-center full-width no-outline" tabindex="0">{{ formData.selfPoint }}</div>
                    </template>
                    <template v-slot:hint>평가선택점수</template>
                  </q-field>
                </div>
              </div>
            </q-card>
            <q-card class="q-pa-sm q-mt-xs">
              <div class="row justify-between q-px-sm-lg">
                <q-radio
                  keep-color
                  :disable="formReadonly"
                  v-model="formData.selfCh"
                  val="S"
                  label="S"
                  color="deep-orange"
                  :size="$q.screen.xs ? 'sm' : 'md'"
                  :style="{ fontSize: '1.4em' }"
                  @update:model-value="handlePointClick"
                />
                <q-radio
                  keep-color
                  :disable="formReadonly"
                  v-model="formData.selfCh"
                  val="A"
                  label="A"
                  color="blue"
                  :size="$q.screen.xs ? 'sm' : 'md'"
                  :style="{ fontSize: '1.4em' }"
                  @update:model-value="handlePointClick"
                />
                <q-radio
                  keep-color
                  :disable="formReadonly"
                  v-model="formData.selfCh"
                  val="B"
                  label="B"
                  color="cyan"
                  :size="$q.screen.xs ? 'sm' : 'md'"
                  :style="{ fontSize: '1.4em' }"
                  @update:model-value="handlePointClick"
                />
                <q-radio
                  keep-color
                  :disable="formReadonly"
                  v-model="formData.selfCh"
                  val="C"
                  label="C"
                  color="teal"
                  :size="$q.screen.xs ? 'sm' : 'md'"
                  :style="{ fontSize: '1.4em' }"
                  @update:model-value="handlePointClick"
                />
                <q-radio
                  keep-color
                  :disable="formReadonly"
                  v-model="formData.selfCh"
                  val="D"
                  label="D"
                  color="green"
                  :size="$q.screen.xs ? 'sm' : 'md'"
                  :style="{ fontSize: '1.5em' }"
                  @update:model-value="handlePointClick"
                />
              </div>
            </q-card>
          </q-card-section>
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
import { computed, onBeforeMount, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue';
import { isEmpty, isEqual } from 'lodash';
import { api } from 'boot/axios';
import notifySave from 'src/js_comm/notify-save';
import { QBtn, QIcon, useQuasar } from 'quasar';
import jsonUtil from 'src/js_comm/json-util';
import { useUserInfoStore } from 'src/store/setUserInfo';
import { useYearInfoStore } from 'src/store/setYearInfo';
const storeUser = useUserInfoStore();
const storeYear = useYearInfoStore();

const setEvsCd = ref('2011101'); // 성과평가 공통코드

const rowData = reactive({ rows: [] });

// grid Height 자동처리부분
const gridHeight = ref(300); // 초기 높이
const rowHeight = 46; // 행당 높이 (예: 25px)
const minHeight = ref(135); // 최소 높이 (예: 300px) rowHeight의 3배
watch(
  () => rowData.rows,
  newRows => {
    const calculatedHeight = newRows.length * rowHeight;
    gridHeight.value = minHeight.value + calculatedHeight;
    // gridHeight.value = Math.max(minHeight.value, calculatedHeight);
  },
  { immediate: true },
);
// grid Height 자동처리부분 끝

const handlePointClick = val => {
  switch (val) {
    case 'S':
      formData.value.selfPoint = 100;
      break;
    case 'A':
      formData.value.selfPoint = 90;
      break;
    case 'B':
      formData.value.selfPoint = 80;
      break;
    case 'C':
      formData.value.selfPoint = 70;
      break;
    case 'D':
      formData.value.selfPoint = 60;
      break;
    default:
      formData.value.selfPoint = 0;
      break;
  }
  formData.value.workPer = formData.value.selfPoint;
};

const $q = useQuasar();
let isSaveFg = null;
const gridKey = ref(0);

const contentZoneHeight = ref(300);
const contentZoneStyle = computed(() => ({
  height: `${contentZoneHeight.value}px`,
}));

const rowSelection = ref(null);
const focusStart = ref(null);

const gridApi = ref(null);
const onGridReady = params => {
  gridApi.value = params.api;
  gridApi.value.setGridOption('headerHeight', 45);
  gridApi.value.setGridOption('rowHeight', 45);
  totalComputeWeight();
  gridApi.value.deselectAll();
};
const defaultColDef = reactive({
  def: {
    flex: 1,
    sortable: true,
    filter: true,
    floatingFilter: false,
    editable: false,
  },
});
const columnDefs = reactive({
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
      headerName: 'No',
      field: 'seq',
      maxWidth: 70,
      minWidth: 70,
    },
    {
      headerName: '세부목표',
      field: 'targetDoc',
      minWidth: 200,
      resizable: true,
    },
    {
      headerName: '가중치',
      field: 'weight',
      maxWidth: 95,
      minWidth: 95,
      resizable: false,
      pinned: 'right',
      cellStyle: params => {
        return $q.dark.isActive ? { color: 'cyan', fontWeight: '300' } : { color: 'blue', fontWeight: '300' };
      },
    },
    {
      headerName: '진행상태',
      field: 'statusNm',
      minWidth: 120,
      maxWidth: 120,
      pinned: 'right',
      cellStyle: params => {
        if (params.data.status === '0') {
          return null;
        } else if (params.data.status === '1') {
          return $q.dark.isActive ? { color: 'orange' } : { color: 'orange' };
        } else if (params.data.status === '2') {
          return $q.dark.isActive ? { color: 'red' } : { color: 'red' };
        } else if (params.data.status === '3') {
          if (params.data.selfCh === '') {
            return $q.dark.isActive ? { color: 'orange' } : { color: 'orange' };
          } else {
            return $q.dark.isActive ? { color: 'teal' } : { color: 'teal' };
          }
        } else if (params.data.status === '4') {
          return $q.dark.isActive ? { color: 'pink' } : { color: 'purple' };
        } else if (params.data.status === '5') {
          return $q.dark.isActive ? { color: 'cyan' } : { color: 'blue' };
        } else {
          return null;
        }
      },
    },
  ],
});
let totalWeight = 0;
const totalComputeWeight = () => {
  totalWeight = 0;
  rowData.rows.forEach(item => {
    totalWeight += item.weight;
  });

  const pinnedBottomRowData = [
    {
      targetDoc: '합계',
      weight: totalWeight,
    },
  ];

  // gridApi.value.updateGridOptions({ pinnedBottomRowData });
  gridApi.value.setPinnedBottomRowData(pinnedBottomRowData);
};
// 기준평가자연결정보
const setEvGroup = reactive({
  evsGroup: {
    empCd: '',
    empNm: '',
    deptCd: '',
    deptNm: '',
    titlCd: '',
    titlNm: '',
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

onBeforeUnmount(() => {
  // Remove the resize event listener when the component is destroyed
  window.removeEventListener('resize', handleResize);
});
onBeforeMount(() => {
  rowSelection.value = 'multiple';
  getDataEvsn(storeUser.setEmpCd, setEvsCd.value);
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
  workNo: 0,
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
  selfCh: '',
  selfPoint: 0,
  status: '',
  statusDate: '00000000',
  returnDoc: '',
  iuD: '',
});

const formDataInitialize = () => {
  formData.value.stdYear = storeYear.setYear;
  formData.value.empCd = storeUser.setEmpCd;
  formData.value.workNo = 1;
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
  formData.value.selfCh = '';
  formData.value.selfPoint = 0;
  formData.value.status = '';
  formData.value.statusDate = '00000000';
  formData.value.returnDoc = '';
  formData.value.iuD = 'I';
};

const selectedRows = ref([]);
const formDisable = ref(true);
const sendCount = ref(0);
const sendCountCancel = ref(0);
const onSelectionChanged = event => {
  selectedRows.value = event.api.getSelectedRows();

  sendCount.value = 0;
  sendCountCancel.value = 0;
  selectedRows.value.forEach(row => {
    if (row.status === '3' && row.workDoc && row.selfPoint > 0 && row.workPer > 0) {
      sendCount.value++;
    }
    if (row.status === '4' && row.markCh === '') {
      sendCountCancel.value++;
    }
  });

  formReadonly.value = true;
  if (selectedRows.value.length === 1) {
    isSaveFg = 'U';
    getDataSelect(selectedRows.value[0].stdYear, selectedRows.value[0].empCd, selectedRows.value[0].workNo);
  } else if (selectedRows.value.length > 1) {
    isSaveFg = 'D';
    formDisable.value = true;
    formDataInitialize();
  } else {
    formData.value = {};
    isSaveFg = '';
    formDisable.value = true;
  }
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
    saveDataAndHandleResult(jsonUtil.dataJsonParse(isSaveFg, formData.value));
  }
};

const sendAuthRequest = () => {
  $q.dialog({
    dark: true,
    title: '평가 요청하기',
    message: '선택된 자료를 평가요청 하시겠습니까? ',
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
      formData.empCd = storeUser.setEmpCd;
      formData.status = '4';
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

const sendAuthRequestCancel = () => {
  $q.dialog({
    dark: true,
    title: '평가요청 취소하기',
    message: '선택된 자료의 평가요청을 취소 하시겠습니까? ',
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
      for (let i = 0; i < selectedRows.value.length; i++) {
        // 평가대기 체크
        if (selectedRows.value[i].status === '4') {
          selectedRows.value[i].status = '3';
          let tmpJson = '{"mode": "' + isSaveFg + '","data":' + JSON.stringify(selectedRows.value[i]) + '}';
          iu.push(tmpJson);
        }
      }
      saveDataAndHandleResult(jsonUtil.jsonFiller(iu, iuD));
    })
    .onCancel(() => {})
    .onDismiss(() => {
      // 확인/취소 모두 실행되었을때
    });
};

const clearFieldSection = () => {
  $q.dialog({
    dark: true,
    title: '자료 지우기',
    message: '선택된 자료의 입력항목을 모두 지우겠습니까?',
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
      formData.value.selfCh = '';
      formData.value.selfPoint = 0;
      formData.value.workPer = 0;
      isSaveFg = 'U';
      saveDataAndHandleResult(jsonUtil.dataJsonParse(isSaveFg, formData.value));
    })
    .onCancel(() => {})
    .onDismiss(() => {
      // 확인/취소 모두 실행되었을때
    });
};
// **************************************************************//
// ***** DataBase 연결부분    *************************************//
// **************************************************************//

// ***** 사원정보 가져오기 부분  *****************************//
const getDataEvsn = async (resEmpCd, resEvsCd) => {
  try {
    const response = await api.post('/api/aux/aux_emp_evsn_list', {
      paramSetYear: storeYear.setYear,
      paramEmpCd: resEmpCd,
      paramEvsCd: resEvsCd,
    });
    setEvGroup.evsGroup.empCd = response.data.data[0].evsEmpCd;
    setEvGroup.evsGroup.empNm = response.data.data[0].evsEmpNm;
    setEvGroup.evsGroup.deptCd = response.data.data[0].evsDeptCd;
    setEvGroup.evsGroup.deptNm = response.data.data[0].evsDeptNm;
    setEvGroup.evsGroup.titlCd = response.data.data[0].evsTitlCd;
    setEvGroup.evsGroup.titlNm = response.data.data[0].evsTitlNm;

    setEvGroup.evtGroup.empCd = response.data.data[0].evtEmpCd;
    setEvGroup.evtGroup.empNm = response.data.data[0].evtEmpNm;
    setEvGroup.evtGroup.deptCd = response.data.data[0].evtDeptCd;
    setEvGroup.evtGroup.deptNm = response.data.data[0].evtDeptNm;
    setEvGroup.evtGroup.titlCd = response.data.data[0].evtTitlCd;
    setEvGroup.evtGroup.titlNm = response.data.data[0].evtTitlNm;
  } catch (error) {
    console.error('Error fetching users:', error);
  }
};

// ***** 성과/목표정보 목록 자료 가져오기 부분  *****************************//
const statusCheck = ref({
  cancelHide: false, // 승인대기취소
  sendHide: false, // 승인
  sendCancelHide: false, // 승인취소
  returnHide: false, // 반려상태
  acceptUpdate: false, // 열람상태
  sendCount: 0,
});
const getData = async () => {
  try {
    const response = await api.post('/api/hpe/hpe1020_list', {
      paramSetYear: storeYear.setYear,
      paramEmpCd: storeUser.setEmpCd,
    });
    rowData.rows = response.data.data;
    if (rowData.rows.length > 0) {
      minHeight.value = 90;
    }
    sendCount.value = 0;
    gridKey.value += 1;

    // 자료 열람확인 처리
    statusCheck.value.cancelHide = false;
    statusCheck.value.sendHide = false;
    statusCheck.value.sendCancelHide = false;
    statusCheck.value.returnHide = false;
    statusCheck.value.acceptUpdate = false;
    statusCheck.value.sendCount = 0;

    for (let i = 0; i < rowData.rows.length; i++) {
      if (rowData.rows[i].status === '3' && rowData.rows[i].acceptYn === 'Y' && rowData.rows[i].workDoc !== null && rowData.rows[i].selfPoint !== 0) {
        statusCheck.value.sendCount++;
      }
      if (rowData.rows[i].status === '3' && rowData.rows[i].acceptYn !== 'Y') {
        statusCheck.value.acceptUpdate = true;
      }
    }
    if (rowData.rows.length === statusCheck.value.sendCount) {
      // console.log(rowData.rows[i].status, ' = ', rowData.rows[i].acceptYn, ' = ', rowData.rows[i].workDoc, ' = ', rowData.rows[i].selfPoint);
      statusCheck.value.sendHide = true;
    }
    if (statusCheck.value.acceptUpdate) {
      acceptCheckSaveSection(storeYear.setYear, storeUser.setEmpCd);
    }
  } catch (error) {
    console.error('Error fetching users:', error);
  }
};

// ***** 선택한 성과/목표정보 목록 자료 가져오기 부분  *****************************//
const getDataSelect = async () => {
  try {
    const response = await api.post('/api/hpe/hpe1020_select', {
      paramSetYear: storeYear.setYear,
      paramEmpCd: selectedRows.value[0].empCd,
      paramWorkNo: selectedRows.value[0].workNo,
    });
    formData.value = response.data.data[0];
    formData.value.targetDoc = formData.value.targetDoc.replace(/\n/g, '<br>');
    oldFormData.value = JSON.parse(JSON.stringify(formData.value)); // 초기자료 저장

    if (formData.value.status === '3') {
      formReadonly.value = false;
      formDisable.value = false;
    }

    if (formData.value.status !== selectedRows.value[0].status) {
      $q.dialog({
        dark: true,
        title: '안내',
        html: true,
        message: '<em>자료가 변경되었습니다.</em> <br /><span class="text-red">다시 불러오기</span> <strong> 실행 후 작업을 진행하십시요.</strong>',
      })
        .onOk(() => {
          // console.log('OK')
        })
        .onCancel(() => {
          // console.log('Cancel')
        })
        .onDismiss(() => {
          // console.log('I am triggered on both OK and Cancel')
        });
    }

    isSaveFg = 'U';
  } catch (error) {
    console.error('Error fetching users:', error);
  }
};

// ***** 자료저장 및 삭제 처리부분 *****************************//
// saveStatus = 0=수정성공 1=신규성공 2=삭제성공 3=수정에러 4=시스템에러
const saveDataAndHandleResult = resFormData => {
  api
    .post('/api/hpe/hpe1020_save', resFormData)
    .then(res => {
      if (isSaveFg !== 'A') {
        getData();
        let saveStatus = {};
        saveStatus.rtn = res.data.rtn;
        saveStatus.rtnMsg = res.data.rtnMsg;
        notifySave.notifyView(saveStatus);
      }
    })
    .catch(error => {
      console.log('error: ', error);
    });
};

// **************************************************************//
// ***** View Accept Check Save  ********************************//
// **************************************************************//
const acceptCheckSaveSection = (resStdYear, resEvtEmpCd) => {
  isSaveFg = 'A';

  let iu = [];
  let iuD = [];

  let formData = {};
  formData.stdYear = resStdYear;
  formData.empCd = resEvtEmpCd;
  formData.acceptYn = 'Y';
  let tmpJson = '{"mode": "' + isSaveFg + '","data":' + JSON.stringify(formData) + '}';
  iu.push(tmpJson);

  saveDataAndHandleResult(jsonUtil.jsonFiller(iu, iuD));
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
  getRowStyle: params => {
    if (params.node.rowPinned) {
      return { backgroundColor: 'lightblue' };
    }
  },
  localeText: { noRowsToShow: '조회 결과가 없습니다.' },
};
</script>
<style lang="scss" scoped></style>

<template>
  <q-page class="q-pa-xs-xs q-pa-sm-md" :style-fn="myTweak">
    <q-card class="q-pa-sm">
      <div class="row">
        <div class="col-xs-12 col-lg-8">
          <q-banner rounded :class="$q.dark.isActive ? 'bg-grey-9' : 'bg-grey-3'">
            <template v-slot:avatar>
              <q-icon name="menu_book" color="primary" size="md" />
            </template>
            <span class="text-subtitle1 text-bold"> 목표설정등록 작업입니다.</span><br />
            1. 각 항목별로 세부 업무목표 및 평가기준을 설정하고 등록합니다. <span class="text-deep-orange"> '승인완료'된자료는 수정불가입니다.</span
            ><br />
            2. 목표자료는 여러건을 입력 수 있으나 가중치는 합이 100을 넘어설수는 없습니다.<br />
          </q-banner>
        </div>
        <q-space />
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
        <q-item-label class="text-h6">성과목표등록</q-item-label>
      </q-card-section>
      <q-separator size="3px" class="q-mb-xs" />

      <div class="row">
        <div class="col-xs-12 col-md-7">
          <q-card-section>
            <q-toolbar class="row q-pa-none">
              <div class="q-gutter-xs">
                <q-btn outline color="grey" dense @click="getData">
                  <q-icon name="refresh" size="xs" class="q-mr-xs" />
                  다시 불러오기
                </q-btn>
                <q-btn outline color="grey" dense @click="getData">
                  <q-icon name="refresh" size="xs" class="q-mr-xs" />
                  전년목표 가져오기
                </q-btn>
                <q-btn outline color="grey" dense @click="isCommonTargetLoad">
                  <q-icon name="refresh" size="xs" class="q-mr-xs" />
                  공통목표 가져오기
                </q-btn>
              </div>
              <q-space />
              <q-btn v-if="statusCheck.cancelHide" outline color="indigo-7" dense @click="sendAuthRequestCancel" @mouseover="getData" class="q-pr-md">
                <q-badge color="orange" floating>{{ rowData.rows.length }}</q-badge>
                <q-icon name="replay" size="xs" class="q-pr-xs" /> 승인요청취소
              </q-btn>
              <q-btn
                v-if="statusCheck.sendHide && totalWeight === 100"
                outline
                color="indigo-12"
                dense
                @click="sendAuthRequest"
                class="q-pr-md q-ml-md"
              >
                <q-badge color="orange" floating>{{ rowData.rows.length }}</q-badge>
                <q-icon name="send" size="xs" class="q-pr-xs" /> 승인요청
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
                :rowDragManaged="true"
                :animateRows="true"
                @row-drag-move="onRowDragMove"
                @row-drag-end="onRowDragEnd"
                @row-drag-enter="onRowDragEnter"
                @row-drag-leave="onRowDragLeave"
              >
              </ag-grid-vue>
            </div>
            <q-card v-if="(selectedRows.length === 1 && formData.status === '2') || formData.returnDoc" class="q-pa-sm q-mt-md">
              <q-banner rounded :class="$q.dark.isActive ? 'bg-grey-9' : 'bg-grey-2'">
                <template v-slot:avatar>
                  <q-icon name="reply" style="width: 50px" />
                </template>

                {{ formData.returnDoc }}
                <template v-slot:action> <span class="text-bold text-subtitle1 text-red"> 반려사유 </span></template>
              </q-banner>
            </q-card>
          </q-card-section>
        </div>
        <div class="col-xs-12 col-md-5">
          <q-card-section>
            <q-toolbar class="row q-pa-none">
              <q-space />
              <div class="q-gutter-xs">
                <q-btn v-if="totalWeight < 100 && selectedRows.length === 1" outline color="grey" dense @click="addDataSectionCopy">
                  <q-icon name="add_to_photos" size="xs" /><span v-if="!$q.screen.xs" class="q-ml-xs"> 복사 </span>
                </q-btn>
                <q-btn v-if="totalWeight < 100" outline color="grey" dense @click="addDataSection">
                  <q-icon name="add" size="xs" /><span v-if="!$q.screen.xs" class="q-ml-xs"> 신규 </span>
                </q-btn>
                <q-btn v-if="formData.status === '0' || formData.status === '2'" outline color="blue-12" dense @click="saveDataSection">
                  <q-icon name="save" size="xs" /><span v-if="!$q.screen.xs" class="q-ml-xs">저장</span>
                </q-btn>
                <q-btn v-if="viewStatusCount.sendDelete > 0" outline color="red-12" dense @click="deleteDataSection" class="q-pr-md">
                  <q-badge color="orange" floating>{{ selectedRows.length }}</q-badge>
                  <q-icon name="delete" size="xs" /> <span v-if="!$q.screen.xs" class="q-ml-xs">삭제</span>
                </q-btn>
              </div>
            </q-toolbar>
            <q-card class="q-pa-lg">
              <q-input
                ref="focusStart"
                :readonly="formReadonly"
                :disable="formDisable"
                v-model="formData.targetDoc"
                clearable
                type="textarea"
                color="orange-13"
                label-color="orange-13"
                label="세부목표"
                rows="3"
                :hint="`${byteCount} / 200자 까지 입력하실 수 있습니다.`"
                @update:model-value="updateByteCount"
              />
              <div class="row q-col-gutter-x-xl q-mt-lg">
                <div class="col-8 q-gutter-y-md">
                  <q-input
                    :readonly="formReadonly"
                    :disable="formDisable"
                    v-model="formData.evaS"
                    dense
                    clearable
                    color="purple-12"
                    label-color="purple-12"
                    label="평가기준(S)"
                    hint="평가기준 S(100)에 해당되는 기준"
                  />
                  <q-input
                    :readonly="formReadonly"
                    :disable="formDisable"
                    v-model="formData.evaA"
                    dense
                    clearable
                    color="purple-12"
                    label-color="purple-12"
                    label="평가기준(A)"
                    hint="평가기준 A(90)에 해당되는 기준"
                  />
                  <q-input
                    :readonly="formReadonly"
                    :disable="formDisable"
                    v-model="formData.evaB"
                    dense
                    clearable
                    color="purple-12"
                    label-color="purple-12"
                    label="평가기준(B)"
                    hint="평가기준 B(80)에 해당되는 기준"
                  />
                  <q-input
                    :readonly="formReadonly"
                    :disable="formDisable"
                    v-model="formData.evaC"
                    dense
                    clearable
                    color="purple-12"
                    label-color="purple-12"
                    label="평가기준(C)"
                    hint="평가기준 C(70)에 해당되는 기준"
                  />
                  <q-input
                    :readonly="formReadonly"
                    :disable="formDisable"
                    v-model="formData.evaD"
                    dense
                    clearable
                    color="purple-12"
                    label-color="purple-12"
                    label="평가기준(D)"
                    hint="평가기준 D(60)에 해당되는 기준"
                  />
                </div>
                <div class="col-4 q-gutter-y-xl">
                  <q-input
                    :readonly="formReadonly"
                    :disable="formDisable"
                    v-model="formData.weight"
                    type="number"
                    color="pink-12"
                    label-color="pink-12"
                    label="가중치"
                    hint="가중치를 설정하세요"
                    :rules="[val => totalWeight - oldWeight + parseInt(val) <= 100 || '가중치합이 100이 넘을 수 없습니다.']"
                  />
                </div>
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
const minHeight = ref(135); // 최소 높이 (예: 300px)
watch(
  () => rowData.rows,
  newRows => {
    const calculatedHeight = newRows.length * rowHeight;
    // console.log('newRows : ', newRows.length);
    // console.log('calculatedHeight : ', calculatedHeight);
    gridHeight.value = minHeight.value + calculatedHeight;
    // gridHeight.value = Math.max(minHeight.value, calculatedHeight);
    // console.log('gridHeight : ', gridHeight.value);
  },
  { immediate: true },
);
// grid Height 자동처리부분 끝

const $q = useQuasar();
const isSaveFg = ref(null);
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
      rowDrag: true,
      maxWidth: 80,
      minWidth: 80,
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
      cellStyle: params => {
        return $q.dark.isActive ? { color: 'cyan', fontWeight: '700' } : { color: 'blue', fontWeight: '700' };
      },
    },
    {
      headerName: '진행상태',
      field: 'statusNm',
      minWidth: 120,
      maxWidth: 120,
      cellStyle: params => {
        switch (params.data.status) {
          case '0':
            return null;
          case '1':
            return $q.dark.isActive ? { color: 'orange' } : { color: 'orange' };
          case '2':
            return $q.dark.isActive ? { color: 'red' } : { color: 'red' };
          case '3':
            return $q.dark.isActive ? { color: 'lime' } : { color: 'teal' };
          case '4':
            return $q.dark.isActive ? { color: 'pink' } : { color: 'purple' };
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
  acceptYn: '',
  returnDoc: '',
  iuD: '',
});

const formDataInitialize = () => {
  formData.value.stdYear = storeYear.setYear;
  formData.value.empCd = storeUser.setEmpCd;
  formData.value.workNo = 1;
  formData.value.seq = 1;
  formData.value.targetDoc = '';
  formData.value.evaS = 'S:100점';
  formData.value.evaA = 'A:90점';
  formData.value.evaB = 'B:80점';
  formData.value.evaC = 'C:70점';
  formData.value.evaD = 'D:60점';
  formData.value.weight = 0;
  formData.value.workDoc = '';
  formData.value.workPer = 0;
  formData.value.selfCh = '';
  formData.value.selfPoint = 0;
  formData.value.status = '';
  formData.value.statusDate = '00000000';
  formData.value.acceptYn = 'N';
  formData.value.returnDoc = '';
  formData.value.iuD = 'I';
};

const addDataSection = () => {
  gridApi.value.deselectAll();
  setTimeout(() => {
    formDataInitialize();
    oldFormData.value = formData;
    formData.value.weight = 100 - totalWeight;
    formData.value.status = '0';
    isSaveFg.value = 'I';

    formReadonly.value = false;
    formDisable.value = false;
    formData.value.stdYear = storeYear.setYear;
    setTimeout(() => {
      focusStart.value.focus();
    }, 100);
  }, 100);
};

const addDataSectionCopy = () => {
  formData.value.status = '0';
  formData.value.workDoc = '';
  formData.value.selfCh = '';
  formData.value.selfPoint = 0;
  formData.value.statusDate = '00000000';
  formData.value.returnDoc = '';

  oldFormData.value = formData;
  formData.value.weight = 100 - totalWeight;
  isSaveFg.value = 'I';

  formDisable.value = false;
  formData.value.stdYear = storeYear.setYear;
  setTimeout(() => {
    focusStart.value.focus();
  }, 100);
};

const selectedRows = ref([]);
const formReadonly = ref(true);
const formDisable = ref(true);
const viewStatusCount = ref({
  sendCount: 0,
  sendCancel: 0,
  sendDelete: 0,
});

const onSelectionChanged = event => {
  selectedRows.value = event.api.getSelectedRows();
  viewStatusCount.value.sendCancel = 0;
  viewStatusCount.value.sendCount = 0;
  viewStatusCount.value.sendDelete = 0;
  selectedRows.value.forEach(row => {
    if ((row.status === '0' || row.status === '2') && row.targetDoc !== '') {
      viewStatusCount.value.sendCount++;
    }
    if (row.status === '0') {
      viewStatusCount.value.sendDelete++;
    }
    if (row.status === '1') {
      viewStatusCount.value.sendCancel++;
    }
  });

  formReadonly.value = true;
  if (selectedRows.value.length === 1) {
    getDataSelect(selectedRows.value[0].stdYear, selectedRows.value[0].empCd, selectedRows.value[0].workNo);
  } else {
    formData.value = {};
    isSaveFg.value = '';
    formDisable.value = true;
  }
};
const onRowDragMove = event => {};
const onRowDragEnter = event => {};
const onRowDragEnd = event => {
  const allRowData = [];
  gridApi.value.forEachNode(node => allRowData.push(node.data));

  let iu = [];
  let iuD = [];
  for (let i = 0; i < allRowData.length; i++) {
    // 순번처리저장
    allRowData[i].seq = i + 1;
    let tmpJson = '{"mode": "N", "data":' + JSON.stringify(allRowData[i]) + '}';
    iu.push(tmpJson);
  }
  saveDataAndHandleResult(jsonUtil.jsonFiller(iu, iuD));
};

const onRowDragLeave = event => {
  console.log('onRowDragLeave...');
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
    saveDataAndHandleResult(jsonUtil.dataJsonParse(isSaveFg.value, formData.value));
  }
};

const sendAuthRequest = () => {
  $q.dialog({
    dark: true,
    title: '승인 요청하기',
    message: '선택된 자료를 승인요청 하시겠습니까? ',
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
      let iu = [];
      let iuD = [];

      let formData = {};
      formData.stdYear = storeYear.setYear;
      formData.empCd = storeUser.setEmpCd;
      formData.status = '1';
      formData.acceptYn = 'N';
      let tmpJson = '{"mode": "S","data":' + JSON.stringify(formData) + '}';
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
    title: '승인요청 취소하기',
    message: '선택된 자료의 승인요청을 취소 하시겠습니까? ',
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
      let iu = [];
      let iuD = [];
      let formData = {};
      formData.stdYear = storeYear.setYear;
      formData.empCd = storeUser.setEmpCd;
      formData.status = '0';
      formData.acceptYn = 'N';
      let tmpJson = '{"mode": "S","data":' + JSON.stringify(formData) + '}';
      iu.push(tmpJson);

      saveDataAndHandleResult(jsonUtil.jsonFiller(iu, iuD));
    })
    .onCancel(() => {})
    .onDismiss(() => {
      // 확인/취소 모두 실행되었을때
    });
};

const deleteDataSection = () => {
  $q.dialog({
    dark: true,
    title: '자료삭제',
    message: '선택된 자료를 삭제하시겠습니까? ',
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
      let iu = [];
      let iuD = [];
      for (let i = 0; i < selectedRows.value.length; i++) {
        let tmpJson = '{"mode":"D","data":' + JSON.stringify(selectedRows.value[i]) + '}';
        // console.log('delete : ', JSON.stringify(selectedRows.value[i]));
        iuD.push(tmpJson);
      }
      saveDataAndHandleResult(jsonUtil.jsonFiller(iu, iuD));
    })
    .onCancel(() => {})
    .onDismiss(() => {
      // 확인/취소 모두 실행되었을때
    });
};

const isCommonTargetLoad = () => {
  $q.dialog({
    dark: true,
    title: '공통목표',
    html: true,
    message: '<em><span class="text-orange">공통목표설정자료</span></em>가 있습니다.<br />가져오기 버튼을 클릭하여 목표자료를 가져옵니다.',
    ok: {
      label: '가져오기',
      push: true,
      color: 'orange',
    },
    cancel: {
      label: '닫기',
      push: true,
      color: 'grey-7',
    },
    // persistent: true,
  })
    .onOk(() => {
      const formData = {
        paramSetYear: storeYear.setYear,
        paramEmpCd: storeUser.setEmpCd,
        paramProgId: 'mst1030',
      };
      commonTargetLoading(jsonUtil.dataJsonParse('I', formData));
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
const commonTargetLoading = resFormData => {
  // console.log('form data : ', JSON.stringify(resFormData));
  api
    .post('/api/hpe/hpe1010_tagt_loading', resFormData)
    .then(res => {
      let saveStatus = {};
      saveStatus.rtn = res.data.rtn;
      saveStatus.rtnMsg = res.data.rtnMsg;
      notifySave.notifyView(saveStatus);
      getData();
    })
    .catch(error => {
      console.log('error: ', error);
    });
};

// ***** 사원정보 가져오기 부분  *****************************//
const getDataEvsn = async (resEmpCd, resEvsCd) => {
  // console.log('param: ', resEmpCd, resEvsCd);
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
  cancelHide: false,
  sendHide: false,
});
const getData = async () => {
  try {
    const response = await api.post('/api/hpe/hpe1010_list', { paramSetYear: storeYear.setYear, paramEmpCd: storeUser.setEmpCd });
    rowData.rows = response.data.data;
    if (rowData.rows.length > 0) {
      minHeight.value = 90;
    }

    statusCheck.value.cancelHide = false;
    statusCheck.value.sendHide = false;
    for (let i = 0; i < rowData.rows.length; i++) {
      if (rowData.rows[i].status === '1' && rowData.rows[i].acceptYn !== 'Y') {
        statusCheck.value.cancelHide = true;
      }
      if (rowData.rows[i].status === '0' || rowData.rows[i].status === '2') {
        statusCheck.value.sendHide = true;
      }
    }
    gridKey.value += 1;
    // console.log('getData : ', JSON.stringify(rowData.rows));
  } catch (error) {
    console.error('Error fetching users:', error);
  }
};

// ***** 선택한 성과/목표정보 목록 자료 가져오기 부분  *****************************//
let oldWeight = 0;
const getDataSelect = async () => {
  try {
    const response = await api.post('/api/hpe/hpe1010_select', {
      paramSetYear: storeYear.setYear,
      paramEmpCd: selectedRows.value[0].empCd,
      paramWorkNo: selectedRows.value[0].workNo,
    });
    formData.value = response.data.data[0];
    oldFormData.value = JSON.parse(JSON.stringify(formData.value)); // 초기자료 저장

    if (formData.value.status === '0' || formData.value.status === '2') {
      formReadonly.value = false;
    }
    oldWeight = formData.value.weight;
    isSaveFg.value = 'U';
    formDisable.value = false;

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
  } catch (error) {
    console.error('Error fetching users:', error);
  }
};

// ***** 자료저장 및 삭제 처리부분 *****************************//
// saveStatus = 0=수정성공 1=신규성공 2=삭제성공 3=수정에러 4=시스템에러
const saveDataAndHandleResult = resFormData => {
  // console.log('form data : ', JSON.stringify(resFormData));
  api
    .post('/api/hpe/hpe1010_save', resFormData)
    .then(res => {
      let saveStatus = {};
      saveStatus.rtn = res.data.rtn;
      saveStatus.rtnMsg = res.data.rtnMsg;
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
  getRowStyle: params => {
    if (params.node.rowPinned) {
      return { backgroundColor: 'lightblue' };
    }
  },
  localeText: { noRowsToShow: '조회 결과가 없습니다.' },
};
</script>

<style lang="scss" scoped></style>

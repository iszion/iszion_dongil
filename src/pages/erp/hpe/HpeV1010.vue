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
            2. 목표자료는 여러건을 입력 수 있으나 가중치는 합이 100을 넘어설수는 없습니다. (<span class="text-deep-orange">
              입력시 가중치는 자동으로 남은 가중치가 표기됩니다.</span
            >)
          </q-banner>
        </div>
        <q-space />
        <div class="col-xs-12 col-md-12 col-lg-4">
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
                <q-btn v-if="tagtCnt > 0" outline color="grey" dense class="q-pr-md" @click="isCommonTargetLoad">
                  <q-badge color="orange" floating>{{ tagtCnt }}</q-badge>
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
            <q-card v-if="selectedRows.length === 1 && formData.status === '2'" class="q-pa-sm q-mt-md">
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
                <q-btn v-if="viewStatusCount.sendDelete > 0" outline color="red-12" dense @click="deleteDataSection">
                  <q-icon name="delete" size="xs" /> <span v-if="!$q.screen.xs" class="q-ml-xs">삭제</span>
                </q-btn>
              </div>
            </q-toolbar>
            <q-card class="q-pa-lg">
              <q-select
                ref="focusStart"
                :disable="formReadonly"
                v-model="formData.eidcCd"
                :options="eidcOptions"
                label="평가지표"
                label-color="orange"
                option-value="eidcCd"
                option-label="eidcNm"
                options-dense
                emit-value
                map-options
              >
                <template v-slot:option="{ itemProps, opt, selected, toggleOption }">
                  <q-item v-bind="itemProps">
                    <q-item-section>
                      <q-item-label v-html="opt.eidcNm" />
                    </q-item-section>
                    <q-item-section side>
                      <q-toggle :model-value="selected" @update:model-value="toggleOption(opt)" />
                    </q-item-section>
                  </q-item>
                </template>
              </q-select>

              <q-input
                :readonly="formReadonly"
                :disable="formDisable"
                v-model="formData.targetDoc"
                autogrow
                clearable
                type="textarea"
                color="orange-13"
                label-color="orange-13"
                label="세부목표"
                :hint="`${byteCount.targetDoc} / 400(한글200)자 까지 입력하실 수 있습니다.`"
                @update:model-value="updateByteCount('targetDoc', formData.targetDoc, 400)"
              />
              <div class="row q-col-gutter-x-xl q-mt-lg">
                <div class="col-8 q-gutter-y-md">
                  <q-input
                    :readonly="formReadonly"
                    :disable="formDisable"
                    v-model="formData.evaS"
                    clearable
                    color="purple-12"
                    label-color="purple-12"
                    label="평가기준( S:100점 )"
                    :hint="`${byteCount.evaS} /200(한글100자) 까지 입력하실 수 있습니다.`"
                    @update:model-value="updateByteCount('evaS', formData.evaS, 200)"
                  />
                  <q-input
                    :readonly="formReadonly"
                    :disable="formDisable"
                    v-model="formData.evaA"
                    clearable
                    color="purple-12"
                    label-color="purple-12"
                    label="평가기준( A:90점 )"
                    :hint="`${byteCount.evaA} /200(한글100자) 까지 입력하실 수 있습니다.`"
                    @update:model-value="updateByteCount('evaA', formData.evaA, 200)"
                  />
                  <q-input
                    :readonly="formReadonly"
                    :disable="formDisable"
                    v-model="formData.evaB"
                    clearable
                    color="purple-12"
                    label-color="purple-12"
                    label="평가기준( B:80점 )"
                    :hint="`${byteCount.evaB} /200(한글100자) 까지 입력하실 수 있습니다.`"
                    @update:model-value="updateByteCount('evaB', formData.evaB, 200)"
                  />
                  <q-input
                    :readonly="formReadonly"
                    :disable="formDisable"
                    v-model="formData.evaC"
                    clearable
                    color="purple-12"
                    label-color="purple-12"
                    label="평가기준( C:70점 )"
                    :hint="`${byteCount.evaC} /200(한글100자) 까지 입력하실 수 있습니다.`"
                    @update:model-value="updateByteCount('evaC', formData.evaC, 200)"
                  />
                  <q-input
                    :readonly="formReadonly"
                    :disable="formDisable"
                    v-model="formData.evaD"
                    clearable
                    color="purple-12"
                    label-color="purple-12"
                    label="평가기준( D:60점 )"
                    :hint="`${byteCount.evaD} /200(한글100자) 까지 입력하실 수 있습니다.`"
                    @update:model-value="updateByteCount('evaD', formData.evaD, 200)"
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
import commUtil from 'src/js_comm/comm-util';
import { useUserInfoStore } from 'src/store/setUserInfo';
import { useYearInfoStore } from 'src/store/setYearInfo';
import { useRouter } from 'vue-router';
import { value } from 'lodash/seq';
import axios from 'axios';

const router = useRouter();
const storeUser = useUserInfoStore();
const storeYear = useYearInfoStore();

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
      headerName: 'NO',
      field: 'seq',
      rowDrag: true,
      maxWidth: 80,
      minWidth: 80,
    },
    {
      headerName: '평가지표',
      field: 'eidcNm',
      minWidth: 150,
      maxWidth: 180,
      resizable: true,
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
  rowSelection.value = 'single';
  getDataEvsn().then(() => {
    commonTargetCountCheck().then(() => {
      getData().then(() => {
        getDataEidcOption();
      });
    });
  });
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
  eidcCd: '',
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
  formData.value.eidcCd = '';
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
    updateByteCount('targetDoc', selectedRows.value[0].targetDoc, 400);
    updateByteCount('evaS', selectedRows.value[0].evaS, 200);
    updateByteCount('evaA', selectedRows.value[0].evaA, 200);
    updateByteCount('evaB', selectedRows.value[0].evaB, 200);
    updateByteCount('evaC', selectedRows.value[0].evaC, 200);
    updateByteCount('evaD', selectedRows.value[0].evaD, 200);
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
    message:
      '<em><span class="text-orange">공통목표설정자료</span></em>가 있습니다.<br />1. 가져오기 버튼을 클릭하여 목표자료를 가져옵니다.<br />2. 공통목표의 <em><span class="text-orange">평가지표</em></span>를 선택하고 <span class="text-orange">저장</span>합니다.',
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
      commonTargetWeightCheck().then(resWeight => {
        if (resWeight + totalWeight <= 100) {
          commonTargetLoading(jsonUtil.dataJsonParse('I', formData)).then(() => {
            commonTargetCountCheck().then(() => {
              getData();
            });
          });
        } else {
          let message = '<strong>가중치 합이 <span style="color: red">100을 초과</span> 합니다</strong> <br />';
          message += '<strong>작성한 목표 가중치 합 : ' + totalWeight + '</strong> <br>';
          message += '<strong>공통목표 가중치 합 : ' + resWeight + '</strong> <br />';
          message += '<strong><span style="color:red">초과 가중치 : ' + resWeight + '</span></strong> <br />';
          message += '<strong>가중치를 조정하고 다시 불러오기 하십시요</strong>';

          let saveStatus = {};
          saveStatus.rtn = '0';
          saveStatus.rtnMsg = message;
          notifySave.notifyView1(saveStatus, 10000);
        }
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

// ***** 사원정보 가져오기 부분  *****************************//
const tagtCnt = ref(0);
const commonTargetWeightCheck = async () => {
  try {
    const response = await api.post('/api/hce/hce1010_tagt_weight', {
      paramSetYear: storeYear.setYear,
      paramEmpCd: storeUser.setEmpCd,
    });
    return response.data.data[0].weight;
  } catch (error) {
    console.error('Error fetching users:', error);
  }
};

const commonTargetCountCheck = async () => {
  try {
    const response = await api.post('/api/hpe/hpe1010_tagt_count', {
      paramSetYear: storeYear.setYear,
      paramEmpCd: storeUser.setEmpCd,
    });
    tagtCnt.value = response.data.data[0].tagtCnt;
  } catch (error) {
    console.error('Error fetching users:', error);
  }
};

// ***** 사원정보 가져오기 부분  *****************************//
const commonTargetLoading = async resFormData => {
  try {
    const response = await api.post('/api/hpe/hpe1010_tagt_loading', resFormData);

    console.log('status : ', response.data.rtn);
    let saveStatus = {};
    saveStatus.rtn = response.data.rtn;
    saveStatus.rtnMsg = response.data.rtnMsg;
    notifySave.notifyView(saveStatus);
  } catch (error) {
    console.log('error: ', error);
  }
};

// ***** 사원정보 가져오기 부분  *****************************//
const getDataEvsn = async () => {
  // console.log('param: ', resEmpCd, resEvsCd);
  try {
    const response = await api.post('/api/aux/aux_emp_evsn_list', {
      paramSetYear: storeYear.setYear,
      paramEmpCd: storeUser.setEmpCd,
      paramEvsCd: '2011101',
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
      getData().then(() => {
        let saveStatus = {};
        saveStatus.rtn = '0';
        if (rowData.rows[0].status === '2') {
          saveStatus.rtnMsg = '<em>승인요청이 <span class="text-red">반려</span> 되었습니다.</em> <br /><em>자료를 다시 불러옵니다</em>';
        } else {
          saveStatus.rtnMsg = '<em>승인요청이 <span class="text-red">취소</span> 되었습니다.</em> <br /><em>자료를 다시 불러옵니다</em>';
        }
        notifySave.notifyView1(saveStatus, 1000);
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
      commonTargetCountCheck();
      getData();
    })
    .catch(error => {
      console.log('error: ', error);
    });
};

// ***** 평가지표정보 가져오기 부분  *****************************//
const eidcOptions = ref(null);
async function getDataEidcOption() {
  try {
    const response = await api.post('/api/aux/eidc_option_list', { paramSetYear: storeYear.setYear, paramEidcCd: storeUser.setDeptCd });
    eidcOptions.value = response.data.data;
  } catch (error) {
    console.error('Error fetching users:', error);
  }
}
// **************************************************************//
// ***** DataBase 연결부분 끝  *************************************//
// **************************************************************//

const byteCount = ref({ targetDoc: 0, evaS: 0, evaA: 0, evaB: 0, evaC: 0, evaD: 0 });
const updateByteCount = (ch, val, maxCnt) => {
  if (val) {
    switch (ch) {
      case 'targetDoc':
        byteCount.value.targetDoc = commUtil.textByteLength(val);
        if (byteCount.value.targetDoc > maxCnt) {
          alert('한글 ' + maxCnt + '자 (한글 ' + Math.trunc(maxCnt / 2) + '자)까지 가능합니다.');
        }
        break;
      case 'evaS':
        byteCount.value.evaS = commUtil.textByteLength(val);
        if (byteCount.value.evaS > maxCnt) {
          alert('한글 ' + maxCnt + '자 (한글 ' + Math.trunc(maxCnt / 2) + '자)까지 가능합니다.');
        }
        break;
      case 'evaA':
        byteCount.value.evaA = commUtil.textByteLength(val);
        if (byteCount.value.evaA > maxCnt) {
          alert('한글 ' + maxCnt + '자 (한글 ' + Math.trunc(maxCnt / 2) + '자)까지 가능합니다.');
        }
        break;
      case 'evaB':
        byteCount.value.evaB = commUtil.textByteLength(val);
        if (byteCount.value.evaB > maxCnt) {
          alert('한글 ' + maxCnt + '자 (한글 ' + Math.trunc(maxCnt / 2) + '자)까지 가능합니다.');
        }
        break;
      case 'evaC':
        byteCount.value.evaC = commUtil.textByteLength(val);
        if (byteCount.value.evaC > maxCnt) {
          alert('한글 ' + maxCnt + '자 (한글 ' + Math.trunc(maxCnt / 2) + '자)까지 가능합니다.');
        }
        break;
      case 'evaD':
        byteCount.value.evaD = commUtil.textByteLength(val);
        if (byteCount.value.evaD > maxCnt) {
          alert('한글 ' + maxCnt + '자 (한글 ' + Math.trunc(maxCnt / 2) + '자)까지 가능합니다.');
        }
        break;
      default:
        break;
    }
  }
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

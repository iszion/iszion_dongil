<template>
  <q-page class="q-pa-xs-xs q-pa-sm-md" :style-fn="myTweak">
    <q-card class="q-pa-sm">
      <div class="row">
        <div class="col-xs-12 col-lg-12">
          <q-banner rounded :class="$q.dark.isActive ? 'bg-grey-9' : 'bg-grey-3'">
            <template v-slot:avatar>
              <q-icon name="menu_book" color="primary" size="md" />
            </template>
            <span class="text-subtitle1 text-bold"> 공통목표설정 작업입니다.</span><br />
            1. 선택된 부서의 모든 사원에게 목표자료 등록 시 자동 추가 적용됩니다.<br />
          </q-banner>
        </div>
        <q-space />
      </div>
    </q-card>

    <q-separator spaced />

    <q-card>
      <q-card-section class="text-center q-pa-sm" :class="$q.dark.isActive ? 'bg-teal-7' : 'bg-teal-3'">
        <q-item-label class="text-h6">공통 업무목표 설정등록</q-item-label>
      </q-card-section>
      <q-separator size="3px" class="q-mb-xs" />

      <q-card-section>
        <q-toolbar class="row q-pa-none q-gutter-x-xs">
          <q-space />
          <q-btn v-if="selectedRows.length === 1" outline color="grey" dense @click="addDataSectionCopy">
            <q-icon name="add_to_photos" size="xs" class="q-pr-xs" /><span v-if="!$q.screen.xs" class="q-ml-xs"> 복사 </span>
          </q-btn>
          <q-btn outline color="grey" dense @click="addDataSection">
            <q-icon name="add" size="xs" class="q-pr-xs" /><span v-if="!$q.screen.xs" class="q-ml-xs"> 신규 </span>
          </q-btn>
          <q-btn v-if="selectedRows.length === 1 || isSaveFg === 'I'" outline color="blue-12" dense @click="saveDataSection">
            <q-icon name="save" size="xs" class="q-pr-xs" /><span v-if="!$q.screen.xs" class="q-ml-xs">저장</span>
          </q-btn>
          <q-btn v-if="selectedRows.length > 0" outline color="red" dense @click="deleteDataSection" class="q-pr-md">
            <q-badge color="orange" floating>{{ selectedRows.length }}</q-badge>
            <q-icon name="delete" size="xs" class="q-pr-xs" /> <span v-if="!$q.screen.xs" class="q-ml-xs"> 삭제 </span>
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
        <q-separator spaced />
        <q-card class="q-pa-lg">
          <div class="row q-col-gutter-x-xl">
            <div class="col-8">
              <div class="row q-gutter-md-y-lg">
                <div class="col-12">
                  <q-input
                    ref="focusStart"
                    :readonly="formReadonly"
                    :disable="formDisable"
                    v-model="formData.targetDoc"
                    clearable
                    type="textarea"
                    color="orange-13"
                    label-color="orange-13"
                    label="공통목표설정"
                    rows="3"
                    :hint="`${byteCount} / 100자 까지 입력하실 수 있습니다.`"
                    @update:model-value="updateByteCount"
                  />
                </div>
                <div class="col-12">
                  <div class="row q-gutter-x-lg">
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
                </div>
              </div>
            </div>
            <div class="col-4 q-gutter-md-y-xl">
              <div class="row q-col-gutter-x-md">
                <div class="col-6">
                  <q-input
                    :readonly="formReadonly"
                    :disable="formDisable"
                    v-model="formData.weight"
                    type="number"
                    color="pink-12"
                    label-color="pink-12"
                    label="가중치"
                    hint="가중치를 설정하세요"
                    :rules="[val => parseInt(val) <= 100 || '가중치합이 100이 넘을 수 없습니다.']"
                  />
                </div>
                <div class="col-6 flex flex-center">
                  <q-toggle
                    size="lg"
                    v-model="formData.useYn"
                    true-value="Y"
                    false-value="N"
                    checked-icon="check"
                    unchecked-icon="clear"
                    color="primary"
                    label="사용"
                  />
                </div>
              </div>
              <div class="row justify-between">
                <q-radio
                  keep-color
                  :disable="formReadonly"
                  v-model="formData.deptFg"
                  val="1"
                  label="본사용"
                  color="deep-orange"
                  :size="$q.screen.xs ? 'sm' : 'md'"
                  :style="{ fontSize: '1.4em' }"
                  @update:model-value="handlePointClick"
                />
                <q-radio
                  keep-color
                  :disable="formReadonly"
                  v-model="formData.deptFg"
                  val="2"
                  label="충전소"
                  color="blue"
                  :size="$q.screen.xs ? 'sm' : 'md'"
                  :style="{ fontSize: '1.4em' }"
                  @update:model-value="handlePointClick"
                />
                <q-radio
                  keep-color
                  :disable="formReadonly"
                  v-model="formData.deptFg"
                  val="3"
                  label="주유소"
                  color="cyan"
                  :size="$q.screen.xs ? 'sm' : 'md'"
                  :style="{ fontSize: '1.4em' }"
                  @update:model-value="handlePointClick"
                />
              </div>
            </div>
          </div>
        </q-card>
      </q-card-section>
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
import { QBtn, QIcon, QToggle, useQuasar } from 'quasar';
import jsonUtil from 'src/js_comm/json-util';
import { useUserInfoStore } from 'src/store/setUserInfo';
import { useYearInfoStore } from 'src/store/setYearInfo';
const storeUser = useUserInfoStore();
const storeYear = useYearInfoStore();

const rowData = reactive({
  rows: [],
  rowsSel: [],
});

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
const rowSelectionSel = ref(null);
const focusStart = ref(null);

const gridApiSel = ref(null);
const gridApi = ref(null);

const onGridReady = params => {
  gridApi.value = params.api;
  gridApi.value.setGridOption('headerHeight', 45);
  gridApi.value.setGridOption('rowHeight', 45);
  gridApi.value.deselectAll();
};
const defaultColDef = reactive({
  def: {
    flex: 1,
    sortable: true,
    filter: true,
    floatingFilter: false,
    editable: false,
    resizable: true,
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
      headerName: '공통목표설정',
      field: 'targetDoc',
      minWidth: 200,
    },
    {
      headerName: '가중치',
      field: 'weight',
      maxWidth: 100,
      minWidth: 100,
      cellStyle: params => {
        return $q.dark.isActive ? { color: 'cyan', fontWeight: '700' } : { color: 'blue', fontWeight: '700' };
      },
    },
    {
      headerName: '사용처',
      field: 'weight',
      minWidth: 120,
      maxWidth: 120,
    },
    {
      headerName: '사용',
      field: 'useYn',
      minWidth: 100,
      maxWidth: 100,
    },
  ],
});

onBeforeUnmount(() => {
  // Remove the resize event listener when the component is destroyed
  window.removeEventListener('resize', handleResize);
});
onBeforeMount(() => {
  rowSelectionSel.value = 'single';
  rowSelection.value = 'multiple';

  getData();
});

onMounted(() => {
  window.addEventListener('resize', handleResize);
  handleResize();
});

const oldFormData = ref(null);
const formData = ref({
  stdYear: '',
  targetNo: '',
  seq: 0,
  targetDoc: '',
  evaS: '',
  evaA: '',
  evaB: '',
  evaC: '',
  evaD: '',
  weight: 0,
  deptFg: '',
  useYn: 'N',
  iuD: '',
});

const formDataInitialize = () => {
  formData.value.stdYear = storeYear.setYear;
  formData.value.targetNo = '';
  formData.value.seq = 1;
  formData.value.targetDoc = '';
  formData.value.evaS = 'S:100점';
  formData.value.evaA = 'A:90점';
  formData.value.evaB = 'B:80점';
  formData.value.evaC = 'C:70점';
  formData.value.evaD = 'D:60점';
  formData.value.weight = 0;
  formData.value.deptFg = '';
  formData.value.useYn = 'N';
  formData.value.iuD = 'I';
};

const addDataSection = () => {
  gridApi.value.deselectAll();
  setTimeout(() => {
    formDataInitialize();
    oldFormData.value = formData;
    isSaveFg.value = 'I';

    formReadonly.value = false;
    formDisable.value = false;
    formData.value.stdYear = storeYear.setYear;
    formData.value.deptFg = '1';
    formData.value.useYn = 'Y';
    setTimeout(() => {
      focusStart.value.focus();
    }, 100);
  }, 100);
};

const addDataSectionCopy = () => {
  oldFormData.value = formData;
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

const onSelectionChanged = event => {
  selectedRows.value = event.api.getSelectedRows();

  formReadonly.value = true;
  if (selectedRows.value.length === 1) {
    formReadonly.value = false;
    formDisable.value = false;
    getDataSelect(selectedRows.value[0].stdYear, selectedRows.value[0].targetNo);
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
    console.log('save data::: ', JSON.stringify(formData.value));
    saveDataAndHandleResult(jsonUtil.dataJsonParse(isSaveFg.value, formData.value));
  }
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
        console.log('delete : ', JSON.stringify(selectedRows.value[i]));
        iuD.push(tmpJson);
      }
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

// ***** 성과/목표정보 목록 자료 가져오기 부분  *****************************//
const getData = async () => {
  try {
    const response = await api.post('/api/mst/mst1030_list', { paramSetYear: storeYear.setYear });
    rowData.rows = response.data.data;
    if (rowData.rows.length > 0) {
      minHeight.value = 90;
    }

    gridKey.value += 1;
  } catch (error) {
    console.error('Error fetching users:', error);
  }
};

// ***** 선택한 성과/목표정보 목록 자료 가져오기 부분  *****************************//
const getDataSelect = async (resYear, resTargetNo) => {
  try {
    const response = await api.post('/api/mst/mst1030_select', {
      paramStdYear: resYear,
      paramTargetNo: resTargetNo,
    });
    formData.value = response.data.data[0];
    oldFormData.value = JSON.parse(JSON.stringify(formData.value)); // 초기자료 저장

    isSaveFg.value = 'U';
    formDisable.value = false;
  } catch (error) {
    console.error('Error fetching users:', error);
  }
};

// ***** 자료저장 및 삭제 처리부분 *****************************//
// saveStatus = 0=수정성공 1=신규성공 2=삭제성공 3=수정에러 4=시스템에러
const saveDataAndHandleResult = resFormData => {
  // console.log('form data : ', JSON.stringify(resFormData));
  api
    .post('/api/mst/mst1030_save', resFormData)
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

const gridOptionsSel = {
  localeText: { noRowsToShow: '조회 결과가 없습니다.' },
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

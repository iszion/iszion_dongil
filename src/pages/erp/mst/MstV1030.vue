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
              <!--              <div class="row justify-between">-->
              <!--                <q-radio-->
              <!--                  keep-color-->
              <!--                  :disable="formReadonly"-->
              <!--                  v-model="formData.deptFg"-->
              <!--                  val="1"-->
              <!--                  label="본사용"-->
              <!--                  color="deep-orange"-->
              <!--                  :size="$q.screen.xs ? 'sm' : 'md'"-->
              <!--                  :style="{ fontSize: '1.4em' }"-->
              <!--                />-->
              <!--                <q-radio-->
              <!--                  keep-color-->
              <!--                  :disable="formReadonly"-->
              <!--                  v-model="formData.deptFg"-->
              <!--                  val="2"-->
              <!--                  label="충전소"-->
              <!--                  color="blue"-->
              <!--                  :size="$q.screen.xs ? 'sm' : 'md'"-->
              <!--                  :style="{ fontSize: '1.4em' }"-->
              <!--                />-->
              <!--                <q-radio-->
              <!--                  keep-color-->
              <!--                  :disable="formReadonly"-->
              <!--                  v-model="formData.deptFg"-->
              <!--                  val="3"-->
              <!--                  label="주유소"-->
              <!--                  color="cyan"-->
              <!--                  :size="$q.screen.xs ? 'sm' : 'md'"-->
              <!--                  :style="{ fontSize: '1.4em' }"-->
              <!--                />-->
              <!--              </div>-->
            </div>
          </div>
        </q-card>
      </q-card-section>
    </q-card>
  </q-page>

  <!-- ***************** -->
  <!-- 연결코드 등록 화면    -->
  <!-- ***************** -->
  <q-dialog persistent v-model="isDialogVisible" @show="onDialogShow" @hide="onDialogHide">
    <q-card flat bordered style="max-width: 520px; width: 100%">
      <q-bar>
        <q-icon name="list_alt" />
        <div>권한조정 관리</div>
        <q-space />
        <span class="text-bold text-subtitle1"> 공통관리번호 [ {{ showDialogTitle.targetNo }} ] </span>
        <q-space />
        <q-btn dense flat icon="close" v-close-popup>
          <q-tooltip> 닫기 </q-tooltip>
        </q-btn>
      </q-bar>
      <q-card-actions>
        <q-toolbar class="q-px-sm q-py-none">
          <q-select
            dense
            stack-label
            options-dense
            class="q-pb-sm q-mr-lg"
            label-color="orange"
            v-model="searchParam.deptCd"
            :options="deptOptionsSearch"
            option-value="deptCd"
            option-label="deptNm"
            option-disable="inactive"
            emit-value
            map-options
            style="min-width: 130px; max-width: 130px"
            label="소속팀"
            @update:model-value="getDataDialog"
          />
          <q-btn dense outline class="q-px-md" color="teal" @:click="getDataDialog()"
            ><q-icon name="refresh" size="xs" class="q-pr-sm-sm" /><span v-if="$q.screen.gt.sm">다시불러오기</span></q-btn
          >
          <q-space />
          <q-btn
            v-if="selectedRowsDialog.length > 0"
            outline
            dense
            color="primary"
            @click="saveDataDialogSection"
            v-close-popup
            class="q-px-sm q-mr-sm"
            ><q-icon class="q-mr-xs" name="save" size="xs" /> 저장하기
          </q-btn>
          <q-btn outline dense color="primary" v-close-popup class="q-px-sm"><q-icon class="q-mr-xs" name="close" size="xs" /> 닫기 </q-btn>
        </q-toolbar>
      </q-card-actions>
      <q-card-section class="q-px-md q-pt-none">
        <div :style="contentZoneStyle">
          <ag-grid-vue
            style="width: 100%; height: 100%"
            :class="$q.dark.isActive ? 'ag-theme-alpine-dark' : 'ag-theme-alpine'"
            :columnDefs="columnDefsDialog.columns"
            :rowData="rowDataDialog.rows"
            :defaultColDef="defaultColDefDialog.def"
            :rowSelection="rowSelectionDialog"
            @selection-changed="onSelectionChangedDialog"
            :suppressRowClickSelection="true"
            @grid-ready="onGridReadyDialog"
            :grid-options="gridOptionsDialog"
          >
          </ag-grid-vue>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
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
import CompButtonTargetNo from 'components/CompButtonTargetNo.vue';
const storeUser = useUserInfoStore();
const storeYear = useYearInfoStore();

const isDialogVisible = ref(false);
const showDialogTitle = ref({
  targetNo: '',
});

const rowData = reactive({
  rows: [],
});
const rowDataDialog = reactive({ rows: [] });
const rowDataDialogBack = ref([]);

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

const rowSelectionDialog = ref(null);
const rowSelection = ref(null);
const focusStart = ref(null);

const gridApi = ref(null);
const gridApiDialog = ref(null);

const onGridReady = params => {
  gridApi.value = params.api;
  gridApi.value.setGridOption('headerHeight', 45);
  gridApi.value.setGridOption('rowHeight', 45);
  gridApi.value.deselectAll();
};
const onGridReadyDialog = params => {
  gridApi_dialog = params.api;
  gridApiDialog.value = params.api;
  gridApiDialog.value.setGridOption('headerHeight', 45);
  gridApiDialog.value.setGridOption('rowHeight', 45);
  gridApiDialog.value.deselectAll();

  params.api.forEachNode(node => {
    // console.log('node : ', node.data);
    // 타겟 평가자와 선택한 평가자가 같은면 체크
    if (node.data.targetNo === showDialogTitle.value.targetNo) {
      node.setSelected(true);
    }
  });
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
      headerName: 'NO',
      field: 'seq',
      rowDrag: true,
      maxWidth: 80,
      minWidth: 80,
    },
    {
      headerName: '사번연결',
      field: 'targetNo',
      minWidth: 120,
      maxWidth: 120,
      filter: true,
      cellRenderer: CompButtonTargetNo,
      cellRendererParams: {
        updateSelectedValue: row => {
          console.log('targetNo : ', row.value.targetNo);
          showDialogTitle.value.targetNo = row.value.targetNo;
          isDialogVisible.value = true;
        },
      },
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

const defaultColDefDialog = reactive({
  def: {
    flex: 1,
    sortable: true,
    filter: false,
    floatingFilter: false,
    editable: false,
  },
});
const columnDefsDialog = reactive({
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
      headerName: '사번',
      field: 'empCd',
      maxWidth: 100,
      minWidth: 100,
    },
    {
      headerName: '성명',
      field: 'empNm',
      minWidth: 100,
      maxWidth: 100,
      resizable: true,
    },
    {
      headerName: '소속팀',
      field: 'deptNm',
      minWidth: 150,
      maxWidth: 150,
      resizable: true,
    },
    {
      headerName: '직급',
      field: 'titlNm',
      minWidth: 100,
      resizable: false,
    },
  ],
});

onBeforeUnmount(() => {
  // Remove the resize event listener when the component is destroyed
  window.removeEventListener('resize', handleResize);
});
onBeforeMount(() => {
  rowSelection.value = 'multiple';
  rowSelectionDialog.value = 'multiple';

  getDataDeptOption();
  setTimeout(() => {
    getData();
  }, 500);
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

const selectedRowsDialog = ref([]);
const onSelectionChangedDialog = event => {
  selectedRowsDialog.value = event.api.getSelectedRows();
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

const saveDataDialogSection = () => {
  // if (selectisEqual(formData.value, oldFormData.value)) {
  //   $q.dialog({
  //     dark: true,
  //     title: '안내',
  //     message: '변경된 자료가 없습니다. ',
  //     // persistent: true,
  //   })
  //     .onOk(() => {})
  //     .onCancel(() => {})
  //     .onDismiss(() => {
  //       // 확인/취소 모두 실행되었을때
  //     });
  // } else {
  let iu = [];
  let iuD = [];
  let _tmpJson = {};

  // 모든 empCd 값을 Set에 추가한 후 비교
  for (let i = 0; i < rowDataDialog.rows.length; i++) {
    let useCheck = true;
    for (let k = 0; k < selectedRowsDialog.value.length; k++) {
      if (rowDataDialog.rows[i].empCd === selectedRowsDialog.value[k].empCd) {
        if (rowDataDialog.rows[i].iuD !== 'U') {
          _tmpJson = rowDataDialog.rows[i];
          _tmpJson.progId = 'mst1030';
          _tmpJson.targetNo = showDialogTitle.value.targetNo;
          let tmpJson = '{"mode": "I", "data":' + JSON.stringify(_tmpJson) + '}';
          iu.push(tmpJson);

          console.log('I : ', rowDataDialog.rows[i].empCd, rowDataDialog.rows[i].empNm);
        }
        useCheck = false;
      }
    }
    if (useCheck && rowDataDialog.rows[i].iuD === 'U') {
      _tmpJson = rowDataDialog.rows[i];
      _tmpJson.progId = 'mst1030';
      _tmpJson.targetNo = showDialogTitle.value.targetNo;
      let tmpJson = '{"mode": "D", "data":' + JSON.stringify(_tmpJson) + '}';
      iuD.push(tmpJson);
      console.log('D : ', rowDataDialog.rows[i].empCd, rowDataDialog.rows[i].empNm);
    }
  }
  // 사원연결자료 저장부분
  saveDataDialogAndHandleResult(jsonUtil.jsonFiller(iu, iuD));
};

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
// ***** Dialog처리부분       *************************************//
// **************************************************************//
let gridApi_dialog = null;
const onDialogShow = () => {
  // 대화 상자가 열린 후에 처리할 코드
  searchParam.deptCd = '';
  getDataDialog();
  // gridKey.value += 1;
  setTimeout(() => {
    gridApi_dialog.forEachNode(node => {
      if (node.data.iuD === 'U') {
        node.setSelected(true);
        console.log('node :: ', node.data.empCd);
      }
    });
  }, 500);
};
const onDialogHide = () => {
  // 대화 상자가 닫힐 때 처리할 코드
  console.log('Dialog has closed');
  gridApi_dialog.value.deselectAll();
};

// **************************************************************//
// ***** DataBase 연결부분    *************************************//
// **************************************************************//
// ***** 소속팀정보 가져오기 부분  *****************************//
const deptOptionsSearch = ref(null);
const searchParam = reactive({
  deptCd: '',
});
async function getDataDeptOption() {
  try {
    const response = await api.post('/api/mst/dept_option_list', { paramSetYear: storeYear.setYear });
    deptOptionsSearch.value = JSON.parse(JSON.stringify(response.data.data));
    deptOptionsSearch.value.push({ deptCd: '', deptNm: '전체' });
  } catch (error) {
    console.error('Error fetching users:', error);
  }
}

// ***** 성과/목표정보 목록 자료 가져오기 부분  *****************************//
const getData = async () => {
  try {
    const response = await api.post('/api/mst/mst1030_list', {
      paramSetYear: storeYear.setYear,
    });
    rowData.rows = response.data.data;
    if (rowData.rows.length > 0) {
      minHeight.value = 90;
    }
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

// ***** 사번선택 자료저장 및 삭제 처리부분 *****************************//
// saveStatus = 0=수정성공 1=신규성공 2=삭제성공 3=수정에러 4=시스템에러
const saveDataDialogAndHandleResult = resFormData => {
  // console.log('form data : ', JSON.stringify(resFormData));
  api
    .post('/api/mst/mst1030_tset_save', resFormData)
    .then(res => {
      let saveStatus = {};
      saveStatus.rtn = res.data.rtn;
      saveStatus.rtnMsg = res.data.rtnMsg;
      notifySave.notifyView(saveStatus);
      isDialogVisible.value = false;
    })
    .catch(error => {
      console.log('error: ', error);
    });
};

// *****************************************************//
// ***** 연결사번 가져오기 부분  *****************************//
const getDataDialog = async () => {
  try {
    const response = await api.post('/api/mst/mst1030_tset_list', {
      paramSetYear: storeYear.setYear,
      paramDeptCd: searchParam.deptCd,
      paramProgId: 'mst1030',
      paramTargetNo: showDialogTitle.value.targetNo,
    });
    rowDataDialog.rows = response.data.data;

    // rowDataDialogBack.value = JSON.parse(JSON.stringify(response.data.data));
  } catch (error) {
    console.error('Error fetching users:', error);
  }
};
// ***** 프로그램 선택된 자료 가져오기 부분  *****************************//
// **************************************************************//
// ***** DataBase 연결부분 끝  *************************************//
// **************************************************************//

const byteCount = ref(0);
const updateByteCount = () => {
  const encoder = new TextEncoder();
  byteCount.value = encoder.encode(formData.value.targetDoc).length;
};

const gridOptionsDialog = {
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

<template>
  <q-page class="q-pa-xs-xs q-pa-sm-md" :style-fn="myTweak">
    <q-card class="q-pa-sm">
      <div class="row">
        <div class="col-xs-12 col-lg-12">
          <q-banner rounded :class="$q.dark.isActive ? 'bg-grey-9' : 'bg-grey-3'">
            <template v-slot:avatar>
              <q-icon name="menu_book" color="primary" size="md" />
            </template>
            <span class="text-subtitle1 text-bold"> 역량평가 기준 항목정의 설정 작업입니다.</span><br />
            1. 먼저 평가대상항목을 선택하고 각 항목명을 등록하십시요.<br />
            2. 가중치는 합이 100을 넘어설수는 없습니다.<br />
          </q-banner>
        </div>
        <q-space />
      </div>
    </q-card>

    <q-separator spaced />

    <q-card>
      <q-card-section class="text-center q-pa-sm" :class="$q.dark.isActive ? 'bg-teal-7' : 'bg-teal-3'">
        <q-item-label class="text-h6">역량평가 기준 항목정의</q-item-label>
      </q-card-section>
      <q-separator size="3px" class="q-mb-xs" />

      <div class="row">
        <div class="col-xs-2">
          <q-card-section>
            <q-toolbar class="row q-pa-none">
              <div class="q-gutter-xs">
                <q-btn outline color="grey" dense @click="getData">
                  <q-icon name="refresh" size="xs" class="q-mr-xs" />
                  다시 불러오기
                </q-btn>
              </div>
              <q-space />
            </q-toolbar>
            <div :style="{ height: gridHeight + 'px' }">
              <ag-grid-vue
                style="width: 100%; height: 100%"
                :class="$q.dark.isActive ? 'ag-theme-alpine-dark' : 'ag-theme-alpine'"
                :columnDefs="columnDefs.sel"
                :rowData="rowData.rowsSel"
                :defaultColDef="defaultColDef.defSel"
                :rowSelection="rowSelectionSel"
                @selection-changed="onSelectionChangedSel"
                @grid-ready="onGridReadySel"
                :grid-options="gridOptionsSel"
              >
              </ag-grid-vue>
            </div>
          </q-card-section>
        </div>

        <div class="col-xs-10">
          <q-card-section>
            <q-toolbar class="row q-pa-none q-gutter-x-xs">
              <q-space />
              <q-btn v-if="totalWeight < 100 && selectedRows.length === 1" outline color="grey" dense @click="addDataSectionCopy">
                <q-icon name="add_to_photos" size="xs" class="q-pr-xs" /><span v-if="!$q.screen.xs" class="q-ml-xs"> 복사 </span>
              </q-btn>
              <q-btn v-if="totalWeight < 100" outline color="grey" dense @click="addDataSection">
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
                <div class="col-2">
                  <q-select
                    :readonly="formReadonly"
                    :disable="formDisable"
                    stack-label
                    options-dense
                    label-color="orange"
                    v-model="formData.divCd"
                    :options="divOptions"
                    option-value="commCd"
                    option-label="commNm"
                    option-disable="inactive"
                    emit-value
                    map-options
                    label="항목분류"
                  />
                </div>
                <div class="col-8">
                  <q-input
                    ref="focusStart"
                    :readonly="formReadonly"
                    :disable="formDisable"
                    v-model="formData.itemNm"
                    clearable
                    type="text"
                    color="orange-13"
                    label-color="orange-13"
                    label="평가항목명"
                    :hint="`${byteCount} / 100자 까지 입력하실 수 있습니다.`"
                    @update:model-value="updateByteCount"
                  />
                </div>
                <div class="col-2">
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
const onGridReadySel = params => {
  gridApiSel.value = params.api;
  gridApiSel.value.setGridOption('headerHeight', 45);
  gridApiSel.value.setGridOption('rowHeight', 45);
  gridApiSel.value.deselectAll();
};
const onGridReady = params => {
  gridApi.value = params.api;
  gridApi.value.setGridOption('headerHeight', 45);
  gridApi.value.setGridOption('rowHeight', 45);
  totalComputeWeight();
  gridApi.value.deselectAll();
};
const defaultColDef = reactive({
  defSel: {
    flex: 1,
    sortable: true,
    filter: false,
    floatingFilter: false,
    editable: false,
  },
  def: {
    flex: 1,
    sortable: true,
    filter: true,
    floatingFilter: false,
    editable: false,
  },
});
const columnDefs = reactive({
  sel: [
    {
      headerName: '#',
      width: 60,
      pinned: 'left',
      valueGetter: function (params) {
        // Customize row numbers as needed
        return params.node.rowIndex + 1;
      },
    },
    {
      headerName: '분류항목',
      field: 'commNm',
      sortable: true,
      filter: false,
      cellStyle: { textAlign: 'center' },
    },
  ],
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
      headerName: '평가분류',
      field: 'divNm',
      minWidth: 150,
      maxWidth: 150,
      resizable: true,
    },
    {
      headerName: '평가항목명',
      field: 'itemNm',
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
  ],
});
const totalWeight = ref(0);
const totalComputeWeight = () => {
  totalWeight.value = 0;
  rowData.rows.forEach(item => {
    totalWeight.value += item.weight;
  });

  const pinnedBottomRowData = [
    {
      itemNm: '합계',
      weight: totalWeight.value,
    },
  ];

  gridApi.value.updateGridOptions({ pinnedBottomRowData });
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
  rowSelectionSel.value = 'single';
  rowSelection.value = 'multiple';

  getDataCommOption('202');
  setTimeout(() => {
    getDataCommOption('203');
  }, 500);
});

onMounted(() => {
  window.addEventListener('resize', handleResize);
  handleResize();
});

const oldFormData = ref(null);
const formData = ref({
  stdYear: '',
  itemFg: '',
  itemCd: '',
  divCd: '',
  itemNm: '',
  seq: 0,
  weight: 0,
  iuD: '',
});

const formDataInitialize = () => {
  formData.value.stdYear = storeYear.setYear;
  formData.value.itemFg = selectedRowsSel.value[0].commCd;
  formData.value.itemCd = '';
  formData.value.divCd = '';
  formData.value.itemNm = '';
  formData.value.seq = 1;
  formData.value.weight = 0;
  formData.value.iuD = 'I';
};

const addDataSection = () => {
  gridApi.value.deselectAll();
  setTimeout(() => {
    formDataInitialize();
    oldFormData.value = formData;
    formData.value.weight = 100 - totalWeight.value;
    formData.value.status = '0';
    isSaveFg.value = 'I';

    formReadonly.value = false;
    formDisable.value = false;
    formData.value.stdYear = storeYear.setYear;
    formData.value.itemFg = selectedRowsSel.value[0].commCd;
    setTimeout(() => {
      focusStart.value.focus();
    }, 100);
  }, 100);
};

const addDataSectionCopy = () => {
  oldFormData.value = formData;
  formData.value.weight = 100 - totalWeight.value;
  isSaveFg.value = 'I';

  formDisable.value = false;
  formData.value.stdYear = storeYear.setYear;
  setTimeout(() => {
    focusStart.value.focus();
  }, 100);
};

const selectedRowsSel = ref([]);
const selectedRows = ref([]);
const formReadonly = ref(true);
const formDisable = ref(true);

const onSelectionChangedSel = event => {
  selectedRowsSel.value = event.api.getSelectedRows();
  console.log('aaa : ', JSON.stringify(selectedRowsSel.value));
  if (selectedRowsSel.value.length > 0) {
    getData(selectedRowsSel.value[0].commCd);
  }
};

const onSelectionChanged = event => {
  selectedRows.value = event.api.getSelectedRows();

  formReadonly.value = true;
  if (selectedRows.value.length === 1) {
    formReadonly.value = false;
    formDisable.value = false;
    getDataSelect(selectedRows.value[0].stdYear, selectedRows.value[0].itemFg, selectedRows.value[0].itemCd);
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

// ***** 공통코드 평가항목 분류명 가져오기 공통코드='202' 부분  *****************************//
const divOptions = ref([]);
const selectedDiv = ref(null);
const getDataCommOption = async resCommCd1 => {
  try {
    const response = await api.post('/api/mst/comm_option_list', { paramCommCd1: resCommCd1 });
    switch (resCommCd1) {
      case '202':
        rowData.rowsSel = response.data.data;
        break;
      case '203':
        divOptions.value = response.data.data;
        // selectedDiv.value = divOptions.value[0].commCd;
        break;
      default:
        break;
    }
    console.log('getData1: ', JSON.stringify(response.data.data));
  } catch (error) {
    console.error('Error fetching users:', error);
  }
};

// ***** 성과/목표정보 목록 자료 가져오기 부분  *****************************//
const getData = async resItemFg => {
  try {
    const response = await api.post('/api/mst/mst1020_list', { paramSetYear: storeYear.setYear, paramItemFg: resItemFg });
    rowData.rows = response.data.data;
    if (rowData.rows.length > 0) {
      minHeight.value = 90;
    }

    gridKey.value += 1;
    // console.log('getData : ', JSON.stringify(rowData.rows));
  } catch (error) {
    console.error('Error fetching users:', error);
  }
};

// ***** 선택한 성과/목표정보 목록 자료 가져오기 부분  *****************************//
const oldWeight = ref(0);
const getDataSelect = async (resYear, resItemFg, resItemCd) => {
  console.log('aa ::: ', resYear, resItemFg, resItemCd);
  try {
    const response = await api.post('/api/mst/mst1020_select', {
      paramStdYear: resYear,
      paramItemFg: resItemFg,
      paramItemCd: resItemCd,
    });
    formData.value = response.data.data[0];
    oldFormData.value = JSON.parse(JSON.stringify(formData.value)); // 초기자료 저장

    oldWeight.value = formData.value.weight;
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
    .post('/api/mst/mst1020_save', resFormData)
    .then(res => {
      let saveStatus = {};
      saveStatus.rtn = res.data.rtn;
      saveStatus.rtnMsg = res.data.rtnMsg;
      notifySave.notifyView(saveStatus);
      getData(selectedRowsSel.value[0].commCd);
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

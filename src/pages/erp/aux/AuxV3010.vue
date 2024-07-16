<template>
  <q-page class="q-pa-xs-xs q-pa-sm-md" :style-fn="myTweak">
    <q-card class="q-pa-sm">
      <div class="row">
        <div class="col-xs-12 col-lg-12">
          <q-banner rounded :class="$q.dark.isActive ? 'bg-grey-9' : 'bg-grey-3'">
            <template v-slot:avatar>
              <q-icon name="menu_book" color="primary" size="md" />
            </template>
            <span class="text-subtitle1 text-bold"> 평가지표정의 설정작업입니다.</span><br />
            1. 행당년도의 평가지표내용을 정의 등록하고 관련소속팀을 연결합니다.<br />
          </q-banner>
        </div>
        <q-space />
      </div>
    </q-card>

    <q-separator spaced />

    <q-card>
      <q-card-section class="text-center q-pa-sm" :class="$q.dark.isActive ? 'bg-teal-7' : 'bg-teal-3'">
        <q-item-label class="text-h6">평가지표 정의 설정등록</q-item-label>
      </q-card-section>
      <q-separator size="3px" class="q-mb-xs" />

      <q-card-section>
        <div class="row q-col-gutter-x-sm">
          <div class="col-xs-12 col-sm-8">
            <q-toolbar class="row q-pa-none q-gutter-x-xs">
              <q-space />
              <q-btn v-if="selectedRows.length === 1" outline color="grey" dense @click="addDataSectionCopy">
                <q-icon name="add_to_photos" size="xs" class="q-pr-xs" /><span v-if="!$q.screen.xs" class="q-ml-xs"> 복사 </span>
              </q-btn>
              <q-btn v-if="selectedRows.length === 1 || isSaveFg === 'I'" outline color="blue-12" dense @click="saveDataSection">
                <q-icon name="save" size="xs" class="q-pr-xs" /><span v-if="!$q.screen.xs" class="q-ml-xs">저장</span>
              </q-btn>
              <q-btn v-if="selectedRows.length > 0" outline color="red" dense @click="deleteDataSection" class="q-pr-md">
                <q-badge color="orange" floating>{{ selectedRows.length }}</q-badge>
                <q-icon name="delete" size="xs" class="q-pr-xs" /> <span v-if="!$q.screen.xs" class="q-ml-xs"> 삭제 </span>
              </q-btn>
              <q-btn outline color="grey" dense @click="addDataSection">
                <q-icon name="add" size="xs" class="q-pr-xs" /><span v-if="!$q.screen.xs" class="q-ml-xs"> 신규 </span>
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
            <q-separator spaced />
            <q-card class="q-pa-lg">
              <div class="row q-col-gutter-x-xl q-gutter-xs-y-lg">
                <div class="col-xs-12 col-sm-4">
                  <q-input
                    ref="focusStart"
                    :readonly="formReadonly"
                    :disable="formDisable"
                    v-model="formData.eidcNm"
                    clearable
                    color="orange-13"
                    label-color="orange-13"
                    label="평가지표명"
                    :hint="`${byteCount} / 25자 까지 입력하실 수 있습니다.`"
                    @update:model-value="updateByteCount"
                  />
                </div>
                <div class="col-xs-12 col-sm-8">
                  <q-input
                    :readonly="formReadonly"
                    :disable="formDisable"
                    v-model="formData.explains"
                    clearable
                    type="textarea"
                    color="orange-13"
                    label-color="orange-13"
                    label="평가지표명 설명"
                    :hint="`${byteCount} / 100자 까지 입력하실 수 있습니다.`"
                    @update:model-value="updateByteCount"
                  />
                </div>
              </div>
            </q-card>
          </div>
          <div class="col-xs-12 col-sm-4">
            <q-toolbar class="row q-pa-none q-gutter-x-xs">
              <q-space />
              <q-btn v-if="selectedRows.length === 1 || isSaveFg === 'I'" outline color="blue-12" dense @click="saveDataSectionDialog">
                <q-icon name="save" size="xs" class="q-pr-xs" />부서적용
              </q-btn>
            </q-toolbar>
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
          </div>
        </div>
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
import CompButtonWorkNo from 'components/CompButtonWorkNo.vue';
const storeUser = useUserInfoStore();
const storeYear = useYearInfoStore();

const showDialogTitle = ref({
  workNo: '',
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
  gridApiDialog.value = params.api;
  gridApiDialog.value.setGridOption('headerHeight', 45);
  gridApiDialog.value.setGridOption('rowHeight', 45);
  gridApiDialog.value.deselectAll();

  params.api.forEachNode(node => {
    // console.log('node : ', node.data);
    // 타겟 평가자와 선택한 평가자가 같은면 체크
    if (node.data.workNo === showDialogTitle.value.workNo) {
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
      headerName: '코드',
      field: 'eidcCd',
      minWidth: 100,
      maxWidth: 100,
      filter: true,
    },
    {
      headerName: '평가지표명',
      field: 'eidcNm',
    },
    {
      headerName: '설명',
      field: 'explains',
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
      headerName: '코드',
      field: 'deptCd',
      minWidth: 100,
      maxWidth: 100,
    },
    {
      headerName: '소속팀',
      field: 'deptNm',
      minWidth: 150,
      resizable: true,
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

  getData();
});

onMounted(() => {
  window.addEventListener('resize', handleResize);
  handleResize();
});

const oldFormData = ref(null);
const formData = ref({
  stdYear: '',
  eidcCd: '',
  eidcNm: '',
  explains: '',
});

const formDataInitialize = () => {
  formData.value.stdYear = storeYear.setYear;
  formData.value.eidcCd = '';
  formData.value.eidcNm = '';
  formData.value.explains = '';
};

const addDataSection = () => {
  gridApi.value.deselectAll();
  setTimeout(() => {
    formDataInitialize();
    oldFormData.value = JSON.parse(JSON.stringify(formData.value));
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
  oldFormData.value = JSON.parse(JSON.stringify(formData.value));
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
    getDataSelect(selectedRows.value[0].stdYear, selectedRows.value[0].eidcCd).then(() => {
      getDataDialog(selectedRows.value[0].stdYear, selectedRows.value[0].eidcCd).then(() => {
        gridApiDialog.value.forEachNode(node => {
          if (node.data.useYn === 'Y') {
            node.setSelected(true);
          }
        });
      });
    });
  } else {
    formData.value = {};
    isSaveFg.value = '';
    formDisable.value = true;
    rowDataDialog.rows = [];
  }
};

const selectedRowsDialog = ref([]);
const onSelectionChangedDialog = event => {
  selectedRowsDialog.value = event.api.getSelectedRows();
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

const saveDataSectionDialog = () => {
  let iu = [];
  let iuD = [];
  for (let i = 0; i < rowDataDialog.rows.length; i++) {
    if (rowDataDialog.rows[i].useYn === 'Y') {
      let tmpJson = '{"mode": "D", "data":' + JSON.stringify(rowDataDialog.rows[i]) + '}';
      iuD.push(tmpJson);
    }
  }
  saveDataDialogAndHandleResult(jsonUtil.jsonFiller(iu, iuD));
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
    const response = await api.post('/api/aux/aux3010_list', {
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
const getDataSelect = async (resYear, resEidcCd) => {
  try {
    const response = await api.post('/api/aux/aux3010_select', {
      paramStdYear: resYear,
      paramEidcCd: resEidcCd,
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
    .post('/api/aux/aux3010_save', resFormData)
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
    .post('/api/aux/aux3010_tset_save', resFormData)
    .then(res => {
      let iu = [];
      let iuD = [];
      for (let i = 0; i < selectedRowsDialog.value.length; i++) {
        let tmpJson = '{"mode": "I", "data":' + JSON.stringify(selectedRowsDialog.value[i]) + '}';
        iu.push(tmpJson);
      }

      const tmpData = jsonUtil.jsonFiller(iu, iuD);
      api
        .post('/api/aux/aux3010_tset_save', tmpData)
        .then(res => {
          let saveStatus = {};
          saveStatus.rtn = res.data.rtn;
          saveStatus.rtnMsg = res.data.rtnMsg;
          notifySave.notifyView(saveStatus);
        })
        .catch(error => {
          console.log('error: ', error);
        });
    })
    .catch(error => {
      console.log('error: ', error);
    });
};

// *****************************************************//
// ***** 연결사번 가져오기 부분  *****************************//
const getDataDialog = async (resStdYear, resEidcCd) => {
  try {
    const response = await api.post('/api/aux/aux3010_tset_list', {
      paramStdYear: resStdYear,
      paramEidcCd: resEidcCd,
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
const updateByteCount = val => {
  const encoder = new TextEncoder();
  byteCount.value = encoder.encode(val).length;
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

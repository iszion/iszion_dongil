<template>
  <q-page class="q-pa-xs" :style-fn="myTweak">
    <!-- contents zone -->
    <div class="row q-pa-sm q-col-gutter-md">
      <!-- contents List -->
      <div class="col-12 col-lg-5">
        <q-card bordered>
          <!-- contents list title bar -->
          <q-bar class="q-px-sm">
            <q-icon name="list_alt" />
            <span class="text-subtitle2 q-px-sm">기준인사정보 리스트</span>
            <q-space />
          </q-bar>
          <!--  end of contents list title bar -->
          <q-card-actions align="right" class="q-pa-none">
            <q-toolbar class="row">
              <div class="row q-col-gutter-md">
                <q-select
                  dense
                  stack-label
                  options-dense
                  class="q-px-md q-mr-sm"
                  label-color="orange"
                  v-model="selectedDept"
                  :options="deptOptions"
                  option-value="deptCd"
                  option-label="deptNm"
                  option-disable="inactive"
                  emit-value
                  map-options
                  style="min-width: 150px; max-width: 150px"
                  label="소속팀"
                  @update:model-value="getDataEmp"
                />
                <q-input
                  stack-label
                  label-color="orange"
                  bottom-slots
                  v-model="searchValue"
                  label="검색"
                  dense
                  class="q-pb-none"
                  style="width: 120px"
                >
                  <template v-slot:append>
                    <q-icon v-if="searchValue !== ''" name="close" @click="searchValue = ''" class="cursor-pointer" />
                  </template>
                </q-input>
              </div>
              <q-space />
              <div class="q-gutter-xs">
                <q-btn outline color="positive" dense @click="getDataEmp"><q-icon name="search" size="xs" /> 조회 </q-btn>
              </div>
            </q-toolbar>
          </q-card-actions>

          <q-separator size="3px" />

          <q-card-section class="q-pa-xs">
            <div :style="contentZoneStyle">
              <ag-grid-vue
                style="width: 100%; height: 100%"
                :class="$q.dark.isActive ? 'ag-theme-alpine-dark' : 'ag-theme-alpine'"
                :columnDefs="columnDefsEmp.columns"
                :rowData="rowDataEmp.rows"
                :defaultColDef="defaultColDefEmp.def"
                :rowSelection="rowSelectionEmp"
                @selection-changed="onSelectionChangedEmp"
                @grid-ready="onGridReadyEmp"
              >
              </ag-grid-vue>
            </div>
          </q-card-section>
        </q-card>
      </div>
      <!--  end of contents list -->
      <!-- contents List -->
      <div class="col-12 col-lg-7">
        <q-card bordered>
          <!-- contents list title bar -->
          <q-bar class="q-px-sm">
            <q-icon name="list_alt" />
            <span class="text-subtitle2 q-px-sm">평가대상자 선택</span>
            <q-space />
          </q-bar>
          <!--  end of contents list title bar -->
          <q-card-actions align="right" class="q-pa-none">
            <q-toolbar class="row">
              <div v-if="!isEmpty(selectedRows)" class="q-mr-xl">
                <span class="text-subtitle1 text-bold">평가자 : </span>
                <span class="text-subtitle1 text-bold"> ( {{ selectedRows[0].empCd }} ) {{ selectedRows[0].empNm }} </span>
              </div>
              <div class="row q-col-gutter-md">
                <q-select
                  dense
                  stack-label
                  options-dense
                  class="q-px-md q-mr-sm"
                  label-color="orange"
                  v-model="selectedEvs"
                  :options="evsOptions"
                  option-value="commCd"
                  option-label="commNm"
                  option-disable="inactive"
                  emit-value
                  map-options
                  style="min-width: 150px; max-width: 150px"
                  label="평가승인구분"
                  @update:model-value="handleSelectedEvs"
                />
              </div>

              <q-space />
              <div class="q-gutter-xs">
                <q-btn v-if="isShowSaveBtn" outline color="primary" dense @click="saveDataSection">
                  <q-icon name="content_copy" size="xs" class="q-mr-sm" /> 권한복사 시작</q-btn
                >
              </div>
            </q-toolbar>
          </q-card-actions>

          <q-separator size="3px" />

          <q-card-section class="q-pa-xs">
            <div :style="contentZoneStyle">
              <ag-grid-vue
                style="width: 100%; height: 100%"
                :class="$q.dark.isActive ? 'ag-theme-alpine-dark' : 'ag-theme-alpine'"
                :columnDefs="columnDefs.columns"
                :rowData="rowData.rows"
                :rowSelection="rowSelection"
                :defaultColDef="defaultColDef.def"
                @grid-ready="onGridReady"
              >
              </ag-grid-vue>
            </div>
          </q-card-section>
        </q-card>
      </div>
      <!--  end of contents list -->
    </div>
  </q-page>
</template>

<script setup>
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import 'ag-grid-community/styles/ag-theme-balham.css';
import { AgGridVue } from 'ag-grid-vue3';
import { Notify, QBtn, QIcon, useQuasar } from 'quasar';
import { computed, onBeforeMount, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue';
import { api } from '/src/boot/axios';
import authHeader from 'boot/authHeader';
import { isEmpty, isEqual } from 'lodash';
import jsonUtil from 'src/js_comm/json-util';
import notifySave from 'src/js_comm/notify-save';
import CompToggleAuth from 'components/CompToggleAuth.vue';

const $q = useQuasar();

let isSaveFg = 'I';

const searchValue = ref('');
const selectedSourceUserId = ref('');

const contentZoneHeight = ref(500);
const contentZoneStyle = computed(() => ({
  height: `${contentZoneHeight.value}px`,
}));

const gridApi = ref(null);
const gridApiUser = ref(null);
const rowData = reactive({ rows: [] });
const rowDataEmp = reactive({ rows: [] });

onBeforeUnmount(() => {
  // Remove the resize event listener when the component is destroyed
  window.removeEventListener('resize', handleResize);
});
onBeforeMount(() => {
  getStorgeSetYearGroup();

  rowSelectionEmp.value = 'single';
  rowSelection.value = 'multiple';
  getDataEmp();
});

onMounted(() => {
  window.addEventListener('resize', handleResize);
  handleResize();
  getDataDeptOption();
  getDataCommOption('201');
});

// 기준평가기간 적용부분
const setYearGroup = ref({
  setYear: '',
  setFg: '',
  setLocCh: '',
});
const getStorgeSetYearGroup = () => {
  const _value = $q.localStorage.getItem('setYearGroup').split('|');
  setYearGroup.value.setYear = _value[0];
  setYearGroup.value.setFg = _value[1];
  setYearGroup.value.setLocCh = _value[2];
  console.log('Sub SetYear Group :: ', setYearGroup.value.setYear, setYearGroup.value.setFg, setYearGroup.value.setLocCh);
};
// 기준평가기간 적용부분 끝

const onGridReadyEmp = params => {
  gridApiUser.value = params.api;
};

const defaultColDefEmp = reactive({
  def: {
    flex: 1,
    sortable: false,
    filter: false,
    floatingFilter: false,
    editable: false,
  },
});

const columnDefsEmp = reactive({
  columns: [
    {
      headerName: '#',
      minWidth: 60,
      maxWidth: 60,
      pinned: 'left',
      cellStyle: { textAlign: 'center' },
      valueGetter: function (params) {
        // Customize row numbers as needed
        return params.node.rowIndex + 1;
      },
    },
    {
      headerName: '선택',
      field: '',
      maxWidth: 60,
      minWidth: 60,
      pinned: 'left',
      cellStyle: { textAlign: 'center' },
      checkboxSelection: true,
    },
    {
      headerName: '사번',
      field: 'empCd',
      maxWidth: 100,
      minWidth: 100,
      cellStyle: { textAlign: 'center' },
    },
    {
      headerName: '성명',
      field: 'empNm',
      minWidth: 80,
      maxWidth: 80,
      cellStyle: { textAlign: 'center' },
    },
    {
      headerName: '소속분류',
      field: 'depgNm',
      maxWidth: 90,
      minWidth: 90,
      cellStyle: { textAlign: 'center' },
    },
    {
      headerName: '직급',
      field: 'titlNm',
      maxWidth: 70,
      minWidth: 70,
      cellStyle: { textAlign: 'center' },
    },
    {
      headerName: '소속팀',
      field: 'deptNm',
      maxWidth: 100,
      minWidth: 100,
      cellStyle: { textAlign: 'center' },
    },
  ],
});

const onGridReady = params => {
  gridApi.value = params.api;
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
      headerName: '#',
      filter: false,
      minWidth: 60,
      maxWidth: 60,
      pinned: 'left',
      cellStyle: { textAlign: 'center' },
      valueGetter: function (params) {
        // Customize row numbers as needed
        return params.node.rowIndex + 1;
      },
    },
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
    },
    {
      headerName: '소속분류',
      field: 'depgNm',
      maxWidth: 90,
      minWidth: 90,
      cellStyle: { textAlign: 'center' },
    },
    {
      headerName: '직급',
      field: 'titlNm',
      maxWidth: 100,
      minWidth: 100,
    },
    {
      headerName: '소속팀',
      field: 'deptNm',
      maxWidth: 100,
      minWidth: 100,
    },
  ],
});

const selectedRows = ref();
const isShowSaveBtn = ref(false);

const onSelectionChangedEmp = event => {
  selectedRows.value = event.api.getSelectedRows();
  if (!isEmpty(selectedRows.value)) {
    getDataSelectEmp(selectedRows.value[0].empCd);
  }
};

const rowSelectionEmp = ref(null);
const rowSelection = ref(null);

const updateData = ref([]);
const showSaveBtn = ref(false);

const saveDataSection = () => {
  for (let i = 0; i < updateData.value.length; i++) {
    updateData.value[i].sourceUserId = selectedSourceUserId.value;
  }

  let iu = [];
  let iuD = [];
  // 신규/수정 부분

  for (let i = 0; i < updateData.value.length; i++) {
    let tmpJson;
    tmpJson = '{"mode": "I","data":' + JSON.stringify(updateData.value[i]) + '}';
    iu.push(tmpJson);
    tmpJson = '{"mode": "D","data":' + JSON.stringify(updateData.value[i]) + '}';
    iuD.push(tmpJson);
  }

  if (updateData.value.length <= 0) {
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
    saveDataAndHandleResult(jsonUtil.jsonFiller(iu, iuD));
  }
};

const screenSizeHeight = ref(0);
const myTweak = offset => {
  screenSizeHeight.value = offset;
  return { minHeight: offset ? `calc(100vh - ${offset}px)` : '100vh' };
};
const handleResize = () => {
  contentZoneHeight.value = window.innerHeight - screenSizeHeight.value - 180;
};

// **************************************************************//
// ***** DataBase 연결부분    *************************************//
// **************************************************************//

// ***** 사용자정보 목록 자료 가져오기 부분  *****************************//
const getDataEmp = async () => {
  try {
    const response = await api.post(
      '/api/aux/aux2010_list',
      { paramSetYear: setYearGroup.value.setYear, paramDeptCd: selectedDept.value, paramSearchValue: searchValue.value },
      { headers: authHeader() },
    );
    rowDataEmp.rows = response.data.data;
  } catch (error) {
    console.error('Error fetching users:', error);
  }
};

// ***** 선택한 인사정보 소속사원 자료 가져오기 부분  *****************************//
const getDataSelectEmp = async resEmpCd => {
  try {
    const response = await api.post(
      '/api/aux/aux2010_select',
      { paramSetYear: setYearGroup.value.setYear, paramEmpCd: resEmpCd },
      { headers: authHeader() },
    );
    rowData.rows = response.data.data;
  } catch (error) {
    console.error('Error fetching users:', error);
  }
};

// ***** 자료저장 및 삭제 처리부분 *****************************//
// saveStatus = 0=수정성공 1=신규성공 2=삭제성공 3=수정에러 4=시스템에러
const saveDataAndHandleResult = resFormData => {
  api
    .post('/api/sys/sys1120_save', resFormData, { headers: authHeader() })
    .then(res => {
      let saveStatus = {};
      if (res.data.rtn === '0') {
        saveStatus.rtn = 1;
        saveStatus.rtn1 = res.data.rtnMsg1;
        saveStatus.rtn2 = '자료저장 완료';
      } else {
        saveStatus.rtn = res.data.rtn;
        saveStatus.rtn1 = res.data.rtnMsg1;
        saveStatus.rtn2 = res.data.rtnMsg2;
      }
      showSaveBtn.value = false;
      notifySave.notifyView(saveStatus);
    })
    .catch(error => {
      console.log('error: ', error);
    });
};

// ***** DataBase 소속자료 가져오기 부분 *****************************//
const deptOptions = ref([]);
const selectedDept = ref('');
// ***** 공통코드정보 가져오기 부분  *****************************//
async function getDataDeptOption(resParamCommCd1) {
  try {
    console.log('year :: ', setYearGroup.value.setYear);
    const response = await api.post('/api/mst/dept_option_list', { paramSetYear: setYearGroup.value.setYear }, { headers: authHeader() });

    deptOptions.value = response.data.data;
    deptOptions.value.push({ deptCd: '', deptNm: '전체' });
  } catch (error) {
    console.error('Error fetching users:', error);
  }
}

// ***** DataBase 공통코드 가져오기 부분 *****************************//
const evsOptions = ref([]);
const selectedEvs = ref(null);
// ***** 공통코드정보 가져오기 부분  *****************************//
async function getDataCommOption(resParamCommCd1) {
  try {
    const response = await api.post('/api/mst/comm_option_list', { paramCommCd1: resParamCommCd1 }, { headers: authHeader() });
    evsOptions.value = response.data.data;
    selectedEvs.value = evsOptions.value[0].commCd;
    // deptOptions.value.push({ commCd: '', commNm: '전체' });
  } catch (error) {
    console.error('Error fetching users:', error);
  }
}

// **************************************************************//
// ***** DataBase 연결부분 끝  *************************************//
// **************************************************************//
</script>

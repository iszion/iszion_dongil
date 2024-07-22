<template>
  <q-page class="q-pa-xs-xs q-pa-sm-md" :style-fn="myTweak">
    <!-- contents zone -->
    <q-card bordered>
      <!-- contents list title bar -->
      <q-bar class="q-px-sm">
        <q-icon name="list_alt" />
        <span class="q-px-sm text-bold text-subtitle1" :class="$q.dark.isActive ? 'text-orange' : 'text-primary'">{{ menuLabel }}</span>
        <q-space />
      </q-bar>
      <!-- contents List -->
      <div class="row q-pa-sm q-col-gutter-md">
        <div class="col-12 col-lg-5">
          <q-card bordered>
            <!-- contents list title bar -->
            <q-bar class="q-px-sm">
              <q-icon name="list_alt" />
              <span class="text-subtitle2 q-px-sm">평가자 선택</span>
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
                    v-model="selectedDeptH"
                    :options="deptOptionsX"
                    option-value="deptCd"
                    option-label="deptNm"
                    option-disable="inactive"
                    emit-value
                    map-options
                    style="min-width: 150px; max-width: 150px"
                    label="소속팀"
                    @update:model-value="getDataEmp"
                  />
                  <q-select
                    dense
                    stack-label
                    options-dense
                    class="q-px-md q-mr-sm"
                    label-color="orange"
                    v-model="selectedCatgH"
                    :options="catgOptionsX"
                    option-value="catgCd"
                    option-label="catgNm"
                    option-disable="inactive"
                    emit-value
                    map-options
                    style="min-width: 150px; max-width: 150px"
                    label="직분류"
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
                <q-btn outline color="positive" dense @click="getDataEmp"><q-icon name="search" size="xs" /> 조회 </q-btn>
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
                  suppressRowClickSelection="true"
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
            </q-bar>
            <!--  end of contents list title bar -->
            <div class="row q-pa-xs">
              <div v-if="!isEmpty(selectedRows)" class="col-xs-12 col-sm-3 row">
                <span class="text-subtitle1 text-bold q-mx-sm q-pt-sm">평가자 : </span>
                <span class="text-subtitle1 text-bold q-pt-sm"> {{ selectedRows[0].empNm }}</span>
                <q-space />
                <q-btn v-if="$q.screen.xs && isShowSaveBtn1" outline color="primary" dense class="q-ma-xs q-pr-lg" @click="saveDataSection">
                  <q-badge color="orange" floating>{{ selectedRowsTarget.length }}</q-badge>
                  <q-icon name="save" size="xs" class="q-mr-sm" />
                  저장
                </q-btn>
              </div>

              <div class="col-xs-12 col-sm-9 row">
                <q-select
                  dense
                  :disable="isDesableEvs"
                  stack-label
                  options-dense
                  class="q-px-md"
                  label-color="orange"
                  v-model="selectedEvs"
                  :options="evsOptions"
                  option-value="commCd"
                  option-label="commNm"
                  option-disable="inactive"
                  emit-value
                  map-options
                  style="min-width: 120px; max-width: 120px"
                  label="평가승인구분"
                  @update:model-value="getDataSelectEmpCall"
                />
                <q-select
                  dense
                  :disable="isDesableEvs"
                  stack-label
                  options-dense
                  class="q-px-md q-mr-xs"
                  label-color="orange"
                  v-model="selectedDept"
                  :options="deptOptions"
                  option-value="deptCd"
                  option-label="deptNm"
                  option-disable="inactive"
                  emit-value
                  map-options
                  style="min-width: 120px; max-width: 120px"
                  label="소속팀"
                  @update:model-value="getDataSelectEmpCall"
                />
                <q-select
                  dense
                  :disable="isDesableEvs"
                  stack-label
                  options-dense
                  class="q-px-md"
                  label-color="orange"
                  v-model="selectedTitl"
                  :options="titlOptions"
                  option-value="titlCd"
                  option-label="titlNm"
                  option-disable="inactive"
                  emit-value
                  map-options
                  style="min-width: 100px; max-width: 100px"
                  label="직급"
                  @update:model-value="getDataSelectEmpCall"
                />
                <q-select
                  dense
                  :disable="isDesableEvs"
                  stack-label
                  options-dense
                  class="q-px-md"
                  label-color="orange"
                  v-model="selectedCatg"
                  :options="catgOptions"
                  option-value="catgCd"
                  option-label="catgNm"
                  option-disable="inactive"
                  emit-value
                  map-options
                  style="min-width: 100px; max-width: 100px"
                  label="직분류"
                  @update:model-value="getDataSelectEmpCall"
                />
                <q-space />
                <div class="q-gutter-xs q-pa-xs">
                  <q-btn
                    v-if="oldRowCount > 0 || selectedRowsTarget.length > 0"
                    outline
                    color="primary"
                    dense
                    class="q-ma-xs q-pr-lg"
                    @click="saveDataSection"
                  >
                    <q-badge v-if="selectedRowsTarget.length === 0 && oldRowCount > 0" color="orange" floating>{{ oldRowCount }}</q-badge>
                    <q-badge v-if="selectedRowsTarget.length > 0" color="orange" floating>{{ selectedRowsTarget.length }}</q-badge>
                    <q-icon name="save" size="xs" class="q-mr-sm" />
                    <span v-if="selectedRowsTarget.length === 0 && oldRowCount > 0">삭제</span>
                    <span v-if="selectedRowsTarget.length > 0">저장</span>
                  </q-btn>
                </div>
              </div>
            </div>

            <q-separator size="3px" />

            <q-card-section class="q-pa-xs">
              <div :key="gridKey" :style="contentZoneStyle">
                <ag-grid-vue
                  style="width: 100%; height: 100%"
                  :class="$q.dark.isActive ? 'ag-theme-alpine-dark' : 'ag-theme-alpine'"
                  :columnDefs="columnDefs.columns"
                  :rowData="rowData.rows"
                  :rowSelection="rowSelection"
                  :defaultColDef="defaultColDef.def"
                  @selection-changed="onSelectionTargetEmp"
                  @grid-ready="onGridReady"
                  suppressRowClickSelection="true"
                >
                </ag-grid-vue>
              </div>
            </q-card-section>
          </q-card>
        </div>
      </div>
      <!--  end of contents list -->
    </q-card>
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
import { isEmpty, isEqual } from 'lodash';
import jsonUtil from 'src/js_comm/json-util';
import notifySave from 'src/js_comm/notify-save';
import { useYearInfoStore } from 'src/store/setYearInfo';
const storeYear = useYearInfoStore();

const $q = useQuasar();

let isSaveFg = 'I';
const isDesableEvs = ref(true);

const searchValue = ref('');
const selectedSourceUserId = ref('');
const gridKey = ref(0);

const contentZoneHeight = ref(500);
const contentZoneStyle = computed(() => ({
  height: `${contentZoneHeight.value}px`,
}));

const gridApi = ref(null);
const gridApiEmp = ref(null);
const rowData = reactive({ rows: [] });
const rowDataEmp = reactive({ rows: [] });
const rowSelectionEmp = ref(null);
const rowSelection = ref(null);

const updateData = ref([]);
const showSaveBtn = ref(false);

onBeforeUnmount(() => {
  // Remove the resize event listener when the component is destroyed
  window.removeEventListener('resize', handleResize);
});
onBeforeMount(() => {
  rowSelectionEmp.value = 'single';
  rowSelection.value = 'multiple';
  getDataEmp();
});

const menuLabel = ref('');
onMounted(() => {
  window.addEventListener('resize', handleResize);
  menuLabel.value = window.history.state.label;
  handleResize();
  getDataDeptOption();
  getDataTitlOption();
  getDataCatgOption();
  getDataCommOption('201');
});

const onGridReadyEmp = params => {
  gridApiEmp.value = params.api;
};

const defaultColDefEmp = reactive({
  def: {
    flex: 1,
    sortable: true,
    filter: true,
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
      initialPinned: 'left',
      cellStyle: { textAlign: 'center' },
      valueGetter: function (params) {
        // Customize row numbers as needed
        return params.node.rowIndex + 1;
      },
    },
    {
      headerName: '',
      field: '',
      maxWidth: 60,
      minWidth: 60,
      initialPinned: 'left',
      cellStyle: { textAlign: 'center' },
      checkboxSelection: true,
    },
    {
      headerName: '사번',
      field: 'empCd',
      minWidth: 95,
    },
    {
      headerName: '성명',
      field: 'empNm',
      minWidth: 80,
    },
    {
      headerName: '직분류',
      field: 'catgNm',
      minWidth: 90,
    },
    {
      headerName: '직급',
      field: 'titlNm',
      minWidth: 75,
    },
    {
      headerName: '소속팀',
      field: 'deptNm',
      minWidth: 140,
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
      sortable: false,
      filter: false,
      minWidth: 60,
      maxWidth: 60,
      pinned: 'left',
      cellStyle: { textAlign: 'center' },
      checkboxSelection: true,
      headerCheckboxSelection: true,
      headerCheckboxSelectionFilteredOnly: true,
    },
    {
      headerName: '사번',
      field: 'evtEmpCd',
      minWidth: 100,
      maxWidth: 100,
    },
    {
      headerName: '성명',
      field: 'evtEmpNm',
      minWidth: 80,
      maxWidth: 80,
    },
    {
      headerName: '소속팀',
      field: 'deptGroupNm',
      minWidth: 150,
    },
    {
      headerName: '직급',
      field: 'titlNm',
      minWidth: 90,
      maxWidth: 90,
    },
    {
      headerName: '직분류',
      field: 'catgNm',
      minWidth: 100,
      maxWidth: 100,
    },
    {
      headerName: '대상그룹',
      field: 'evtgNm',
      minWidth: 100,
      maxWidth: 150,
    },
    {
      headerName: '평가자',
      field: 'evsEmpNm',
      minWidth: 100,
      maxWidth: 100,
    },
  ],
});

const selectedRows = ref();
const selectedRowsTarget = ref([]);
const isShowSaveBtn1 = ref(false);
const isShowSaveBtn3 = ref(false);
const oldRowCount = ref();

const onSelectionChangedEmp = event => {
  selectedRows.value = event.api.getSelectedRows();
  if (!isEmpty(selectedRows.value)) {
    // console.log('year : ', selectedRows.value[0].stdYear);
    getDataSelectEmpCall();

    isDesableEvs.value = false;
  } else {
    isDesableEvs.value = true;
    rowData.rows = [];
  }
};
const getDataSelectEmpCall = () => {
  getDataSelectEmp().then(() => {
    selectedRowsTarget.value = [];
    gridApi.value.forEachNode(node => {
      // console.log('node : ', node.data.iuD);
      // 타겟 평가자와 선택한 평가자가 같은면 체크
      if (node.data.iuD === 'U') {
        node.setSelected(true);
      }
    });
    if (isEmpty(selectedRowsTarget.value)) {
      isShowSaveBtn1.value = false;
      isShowSaveBtn3.value = false;
    }

    oldRowCount.value = rowData.rows.filter(item => item.iuD === 'U').length;
  });
};
const onSelectionTargetEmp = event => {
  selectedRowsTarget.value = event.api.getSelectedRows();
  if (isEmpty(selectedRowsTarget.value)) {
    isShowSaveBtn1.value = false;
    isShowSaveBtn3.value = true;
  } else {
    isShowSaveBtn3.value = false;
    isShowSaveBtn1.value = true;
  }
  // console.log('data :: ', JSON.stringify(selectedRowsTarget.value));
};
const saveDataSection = () => {
  let iu = [];
  let iuD = [];

  for (let i = 0; i < rowData.rows.length; i++) {
    if (rowData.rows[i].iuD === 'U') {
      let tmpJson = '{"mode": "D","data":' + JSON.stringify(rowData.rows[i]) + '}';
      // console.log('row : ', JSON.stringify(rowData.rows[i]));
      iuD.push(tmpJson);
    }
  }

  for (let i = 0; i < selectedRowsTarget.value.length; i++) {
    let tmpJson = '{"mode": "I","data":' + JSON.stringify(selectedRowsTarget.value[i]) + '}';
    // console.log('row : ', JSON.stringify(selectedRowsTarget.value[i]));
    iu.push(tmpJson);
  }

  saveDataAndHandleResult(jsonUtil.jsonFiller(iu, iuD));
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
    const response = await api.post('/api/aux/aux2010_list', {
      paramSetYear: storeYear.setYear,
      paramDeptCd: selectedDeptH.value,
      paramCatgCd: selectedCatgH.value,
      paramSearchValue: searchValue.value,
    });
    rowDataEmp.rows = response.data.data;
  } catch (error) {
    console.error('Error fetching users:', error);
  }
};

// ***** 선택한 인사정보 소속사원 자료 가져오기 부분  *****************************//
const getDataSelectEmp = async () => {
  try {
    const response = await api.post('/api/aux/aux2010_select', {
      paramSetYear: storeYear.setYear,
      paramDeptCd: selectedDept.value,
      paramTitlCd: selectedTitl.value,
      paramCatgCd: selectedCatg.value,
      paramEvsEmpCd: selectedRows.value[0].empCd,
      paramEvsCd: selectedEvs.value,
    });
    rowData.rows = response.data.data;
    // console.log('seleData : ', JSON.stringify(rowData.rows));
  } catch (error) {
    console.error('Error fetching users:', error);
  }
};

// ***** 자료저장 및 삭제 처리부분 *****************************//
// saveStatus = 0=수정성공 1=신규성공 2=삭제성공 3=수정에러 4=시스템에러
const saveDataAndHandleResult = resFormData => {
  api
    .post('/api/aux/aux2010_save', resFormData)
    .then(res => {
      showSaveBtn.value = false;
      let saveStatus = {};
      saveStatus.rtn = res.data.rtn;
      saveStatus.rtnMsg = res.data.rtnMsg;
      notifySave.notifyView(saveStatus);
    })
    .catch(error => {
      console.log('error: ', error);
    });
};

// ***** DataBase 소속자료 가져오기 부분 *****************************//
const deptOptions = ref([]);
const deptOptionsX = ref([]);
const catgOptions = ref([]);
const catgOptionsX = ref([]);

const selectedDept = ref('');
const selectedDeptH = ref('');
const selectedCatg = ref('');
const selectedCatgH = ref('');
async function getDataDeptOption(resParamCommCd1) {
  try {
    const response = await api.post('/api/mst/dept_option_list', { paramSetYear: storeYear.setYear });

    deptOptions.value = response.data.data;
    deptOptionsX.value = JSON.parse(JSON.stringify(deptOptions.value));
    deptOptions.value.unshift({ deptCd: '', deptNm: '전체' });
    deptOptionsX.value.unshift({ deptCd: '', deptNm: '전체' });
  } catch (error) {
    console.error('Error fetching users:', error);
  }
}

async function getDataCatgOption(resParamCommCd1) {
  try {
    const response = await api.post('/api/mst/catg_option_list', { paramSetYear: storeYear.setYear });

    catgOptions.value = response.data.data;
    catgOptionsX.value = JSON.parse(JSON.stringify(catgOptions.value));
    catgOptions.value.unshift({ catgCd: '', catgNm: '전체' });
    catgOptionsX.value.unshift({ catgCd: '', catgNm: '전체' });
  } catch (error) {
    console.error('Error fetching users:', error);
  }
}

// ***** DataBase 직급자료 가져오기 부분 *****************************//
const titlOptions = ref([]);
const selectedTitl = ref('');
async function getDataTitlOption(resParamCommCd1) {
  try {
    const response = await api.post('/api/mst/titl_option_list', { paramSetYear: storeYear.setYear });

    titlOptions.value = response.data.data;
    titlOptions.value.unshift({ titlCd: '', titlNm: '전체' });
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
    const response = await api.post('/api/mst/comm_option_list', { paramCommCd1: resParamCommCd1 });
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

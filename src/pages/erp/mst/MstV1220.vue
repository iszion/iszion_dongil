<template>
  <q-page class="q-pa-xs-xs q-pa-sm-md" :style-fn="myTweak">
    <q-card>
      <q-tabs
        v-model="screenTab"
        dense
        class="text-grey text-subtitle1"
        active-color="primary"
        indicator-color="primary"
        align="left"
        narrow-indicator
      >
        <q-tab name="main" label="발령정보관리" />
        <q-tab name="upload" label="엑셀업로드" />
      </q-tabs>
      <q-separator />
      <q-tab-panels v-model="screenTab" animated>
        <q-tab-panel name="main" class="q-pa-sm">
          <!-- contents List -->
          <q-card bordered>
            <!-- contents list title bar -->
            <q-bar class="q-px-sm">
              <q-icon name="list_alt" />
              <span class="q-px-sm text-bold text-subtitle1" :class="$q.dark.isActive ? 'text-orange' : 'text-primary'">{{ menuLabel }}</span>
            </q-bar>
            <!--  end of contents list title bar -->
            <q-card-actions align="right" class="q-pa-none">
              <q-toolbar class="row">
                <div class="row q-col-gutter-md">
                  <q-select
                    dense
                    v-model="searchParam.pMonth"
                    :options="optionsDate.month"
                    label="월"
                    label-color="orange"
                    emit-value
                    map-options
                    options-dense
                    style="width: 90px"
                  />
                  <q-input
                    stack-label
                    bottom-slots
                    label-color="orange"
                    v-model="searchParam.word"
                    label="검색"
                    dense
                    class="q-pb-none"
                    style="width: 120px"
                  >
                    <template v-slot:append>
                      <q-icon v-if="searchParam.word !== ''" name="close" size="xs" @click="searchParam.word = ''" class="cursor-pointer q-pt-sm" />
                    </template>
                  </q-input>
                </div>
                <q-space />
                <div class="q-gutter-xs">
                  <q-btn outline color="positive" dense @click="getData"><q-icon name="search" size="xs" /> 조회 </q-btn>
                  <q-btn v-if="searchParam.pMonth > '00'" outline color="primary" dense @click="addDataSection">
                    <q-icon name="add" size="xs" /> 신규</q-btn
                  >
                  <q-btn v-if="showSaveBtn" outline color="primary" dense @click="saveDataSection"> <q-icon name="save" size="xs" /> 저장</q-btn>
                  <!--                  <q-btn v-if="selectedRows.length > 0" outline color="negative" dense @click="deleteDataSection">-->
                  <!--                    <q-icon name="delete" size="xs" /> 삭제</q-btn-->
                  <!--                  >-->
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
                  :defaultColDef="defaultColDef.def"
                  :rowSelection="rowSelection"
                  @selection-changed="onSelectionChanged"
                  @cell-value-changed="onCellValueChanged"
                  @grid-ready="onGridReady"
                  suppressRowClickSelection="true"
                >
                </ag-grid-vue>
              </div>
            </q-card-section>
          </q-card>
          <!--  end of contents list -->
        </q-tab-panel>

        <q-tab-panel name="upload" class="q-pa-sm">
          <!-- contents List -->
          <q-card bordered>
            <!-- contents list title bar -->
            <q-card-section class="q-pa-xs">
              <q-banner rounded :class="$q.dark.isActive ? 'bg-grey-9' : 'bg-grey-3'">
                <template v-slot:avatar>
                  <q-icon name="menu_book" color="primary" size="md" />
                </template>
                <div class="row">
                  <span class="col-xs-12 col-sm-6 text-subtitle1 text-bold">
                    발령정보 Excel파일을 업로드하여 발령정보 자료를 생성합니다. (
                    <span class="text-subtitle2 text-blue"> ▼ 아래 항목별로 엑셀자료를 준비해 주세요</span> )</span
                  >
                  <span class="col-xs-12 col-sm-6 text-subtitle1 text-bold">
                    반드시 월별로 1개월씩 업로드 가능합니다. (
                    <span class="text-subtitle2 text-red"> 해당 년월에 자료가 있으면 모두 지워지고 업로드 자료로 저장됩니다.</span> )</span
                  >
                </div>
                <q-separator class="q-my-xs" />
                <div class="row justify-between">
                  <div><span class="text-deep-orange">Field 1(년월)</span> : <span class="text-orange">202401</span></div>
                  <div><span class="text-deep-orange">Field 2(성명)</span> : <span class="text-orange">홍길동</span></div>
                  <div><span class="text-deep-orange">Field 3(사번)</span> : <span class="text-orange">2200001</span></div>
                  <div><span class="text-deep-orange">Field 4(지각)</span> : <span class="text-orange">2</span></div>
                  <div><span class="text-deep-orange">Field 5(미근태체크)</span> : <span class="text-orange">5</span></div>
                  <div><span class="text-deep-orange">Field 6(결근)</span> : <span class="text-orange">0</span></div>
                  <div><span class="text-deep-orange">Field 7(기타)</span> : <span class="text-orange">5, 10, 11, 15, 16, 20, 25</span></div>
                </div>
              </q-banner>
            </q-card-section>
            <q-separator size="3px" />
            <!--  end of contents list title bar -->
            <q-card-actions align="right" class="q-py-sm">
              <q-toolbar class="row">
                <q-file
                  dense
                  v-model="file"
                  label="엑셀파일을 선택하세요"
                  style="width: 200px"
                  accept=".xlsx, .xls"
                  outlined
                  color="primary"
                  text-color="white"
                />
                <q-space />
                <q-btn v-if="rowDataExcel.length > 0" outline color="primary" @click="uploadSaveSection">
                  <q-icon name="upload" size="xs" />저장하기
                </q-btn>
              </q-toolbar>
            </q-card-actions>

            <q-separator size="3px" />

            <q-card-section class="q-pa-xs">
              <div :style="contentZoneStyle">
                <ag-grid-vue
                  style="width: 100%; height: 100%"
                  :class="$q.dark.isActive ? 'ag-theme-alpine-dark' : 'ag-theme-alpine'"
                  :gridOptions="gridOptionsExcel"
                  :columnDefs="columnDefsExcel"
                  :rowData="rowDataExcel"
                >
                </ag-grid-vue>
              </div>
            </q-card-section>
          </q-card>
          <!--  end of contents list -->
        </q-tab-panel>
      </q-tab-panels>
    </q-card>

    <!-- contents zone -->
  </q-page>
</template>

<script setup>
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import 'ag-grid-community/styles/ag-theme-balham.css';
import { AgGridVue } from 'ag-grid-vue3';
import { QBtn, QIcon, useQuasar } from 'quasar';
import { computed, onBeforeMount, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue';
import { api } from '/src/boot/axios';
import CompSelectDept from 'components/CompSelectDept.vue';
import CompSelectTitl from 'components/CompSelectTitl.vue';

import { isEqual } from 'lodash';
import jsonUtil from 'src/js_comm/json-util';
import notifySave from 'src/js_comm/notify-save';
import commUtil from 'src/js_comm/comm-util';

import { useYearInfoStore } from 'src/store/setYearInfo';
import * as XLSX from 'xlsx';

const storeYear = useYearInfoStore();

const $q = useQuasar();

const screenTab = ref('main');
let isSaveFg = null;

const searchParam = reactive({
  pYear: '',
  pMonth: '',
  word: '',
});
const statusEdit = reactive({
  icon: '',
  message: '',
  color: '',
});

onBeforeUnmount(() => {
  // Remove the resize event listener when the component is destroyed
  window.removeEventListener('resize', handleResize);
});

onBeforeMount(() => {
  rowSelection.value = 'multiple';

  searchParam.pYear = storeYear.setYear;
  searchParam.pMonth = commUtil.getTodayMonth();
  optionYymmReset();
});

const menuLabel = ref('');
onMounted(() => {
  window.addEventListener('resize', handleResize);
  menuLabel.value = window.history.state.label;
  handleResize();
});

const formDisable = ref(true);

const contentZoneHeight = ref(500);
const contentZoneStyle = computed(() => ({
  height: `${contentZoneHeight.value}px`,
}));

const gridApi = ref(null);
const rowData = reactive({ rows: [], update: [], backup: [] });

const onGridReady = params => {
  gridApi.value = params.api;
};

const defaultColDef = reactive({
  def: {
    flex: 1,
    sortable: true,
    filter: true,
    floatingFilter: false,
    editable: true,
  },
});

const columnDefs = reactive({
  columns: [
    {
      headerName: '',
      field: '',
      maxWidth: 50,
      minWidth: 50,
      checkboxSelection: true,
      headerCheckboxSelection: true,
      filter: false,
      pinned: 'left',
      editable: false,
    },
    {
      headerName: '#',
      width: 60,
      pinned: 'left',
      editable: false,
      valueGetter: function (params) {
        // Customize row numbers as needed
        return params.node.rowIndex + 1;
      },
    },
    {
      headerName: '근태년월',
      field: 'makeYm',
      valueFormatter: params => {
        return commUtil.formatDateYm(params.data.makeYm);
      },
      minWidth: 120,
      maxWidth: 120,
    },
    {
      headerName: '사번',
      field: 'empCd',
      minWidth: 100,
      maxWidth: 100,
    },
    {
      headerName: '성명',
      field: 'empNm',
      minWidth: 120,
      maxWidth: 120,
      editable: false,
    },
    {
      headerName: '소속팀',
      field: 'deptNm',
      minWidth: 150,
      maxWidth: 150,
      filter: true,
      editable: false,
    },
    {
      headerName: '직급',
      field: 'titlNm',
      minWidth: 120,
      maxWidth: 120,
      filter: true,
      editable: false,
    },
    {
      headerName: '지각',
      field: 'attenCh1',
      minWidth: 120,
      maxWidth: 120,
    },
    {
      headerName: '근태미체크',
      field: 'attenCh2',
      minWidth: 120,
      maxWidth: 120,
    },
    {
      headerName: '결근',
      field: 'attenCh3',
      minWidth: 120,
      maxWidth: 120,
    },
    {
      headerName: '기타사항',
      field: 'explains',
      minWidth: 120,
    },
  ],
});

const selectedRows = ref([]);

const onSelectionChanged = event => {
  selectedRows.value = event.api.getSelectedRows();
  // console.log('sele : ', JSON.stringify(selectedRows.value));
  iuD = [];
  for (let i = 0; selectedRows.value.length > i; i++) {
    if (selectedRows.value[i].iuD !== 'I') {
      let tmpJson = '{"mode": "D","data":' + JSON.stringify(selectedRows.value[i]) + '}';
      iuD.push(tmpJson);
    }
  }
  showSaveBtn.value = selectedRows.value.length > 0;
  // console.log('iuD ;', JSON.stringify(iuD));
};

const showSaveBtn = ref(false);
let iu = [];
let iuD = [];
const onCellValueChanged = params => {
  // console.log(JSON.stringify(rowData.rows));
  let updateRow = params.data;
  for (let i = 0; rowData.rows.length > i; i++) {
    if (updateRow.rowNum === rowData.rows[i].rowNum) {
      if (rowData.rows[i].iuD !== 'I') {
        rowData.rows[i].iuD = 'U';
      }
    }
  }
  showSaveBtn.value = rowData.rows.filter(item => item.iuD === 'I' || item.iuD === 'U').length > 0;
  iu = [];
  for (let i = 0; rowData.rows.length > i; i++) {
    if (rowData.rows[i].iuD === 'I' || rowData.rows[i].iuD === 'U') {
      let tmpJson = '{"mode":"' + rowData.rows[i].iuD + '","data":' + JSON.stringify(rowData.rows[i]) + '}';

      iu.push(tmpJson);
    }
  }
  // console.log('iu ;', JSON.stringify(iu));
};

const rowSelection = ref(null);

const empCdFocus = ref(null);
const empNmFocus = ref(null);
const addDataSection = () => {
  showSaveBtn.value = true;
  const addIndex = 0;
  const newItem = {
    rowNum: rowData.rows.length + 1,
    makeYm: storeYear.setYear + searchParam.pMonth,
    empCd: '',
    empNm: '',
    deptNm: '',
    titlNm: '',
    attenCh1: '',
    attenCh2: '',
    attenCh3: '',
    explains: '',
    iuD: 'I',
  };
  rowData.rows.splice(addIndex, 0, newItem);

  gridApi.value.setRowData(rowData.rows);
  // 첫컬럼에 focus
  gridApi.value.setFocusedCell(addIndex, 'empCd');

  // const res = gridApi.value.applyTransaction({ add: [newItem] });
  // if (res.add) {
  //   새로 추가된 행의 첫 번째 셀에 포커스 맞추기
  // gridApi.value.startEditingCell({
  //   rowIndex: res.add[0].rowIndex,
  //   colKey: 'empCd',
  // });
  // }
};

const uploadSaveSection = () => {
  $q.dialog({
    dark: true,
    title: '업로드',
    message: '자료를 업로드 하시겠습니까? ',
    ok: {
      push: true,
      color: 'primary',
    },
    cancel: {
      push: true,
      color: 'grey-7',
    },
    // persistent: true,
  })
    .onOk(() => {
      isSaveFg = 'I';

      let iu = [];
      let iuD = [];
      for (let i = 0; i < rowDataExcel.value.length; i++) {
        const objJson = {
          makeYm: rowDataExcel.value[i].col0, // 년월
          oldMakeYm: rowDataExcel.value[i].col0, // 년월

          empCd: rowDataExcel.value[i].col2, // 사번
          oldEmpCd: rowDataExcel.value[i].col2, // 사번

          attenCh1: rowDataExcel.value[i].col3, // 지각
          attenCh2: rowDataExcel.value[i].col4, // 근태미체크
          attenCh3: rowDataExcel.value[i].col5, // 결근
          explains: rowDataExcel.value[i].col6, // 기타
        };

        let tmpJson = '{"mode":"C","data":' + JSON.stringify(objJson) + '}';
        iu.push(tmpJson);
      }
      saveDataAndHandleResult(jsonUtil.jsonFiller(iu, iuD));
    })
    .onCancel(() => {})
    .onDismiss(() => {
      // 확인/취소 모두 실행되었을때
    });
};

const saveDataSection = () => {
  $q.dialog({
    dark: true,
    title: iuD.length > 0 ? '자료 저장(삭제)' : '자료저장',
    message: iuD.length > 0 ? '자료를 저장(삭제)하시겠습니까?' : '자료를 저장하시겠습니까?',
    // persistent: true,
  })
    .onOk(() => {
      if (iu.length > 0 || iuD.length > 0) {
        saveDataAndHandleResult(jsonUtil.jsonFiller(iu, iuD));
        setTimeout(() => {
          getData();
        }, 500);
      } else {
        alert('변경된 자료가 없습니다.');
      }
    })
    .onCancel(() => {})
    .onDismiss(() => {
      // 확인/취소 모두 실행되었을때
    });
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

// ***** 자료저장 및 삭제 처리부분 *****************************//
// saveStatus = 0=수정성공 1=신규성공 2=삭제성공 3=수정에러 4=시스템에러
const saveDataAndHandleResult = resFormData => {
  api
    .post('/api/mst/mst1220_save', resFormData)
    .then(res => {
      let saveStatus = {};
      saveStatus.rtn = res.data.rtn;
      saveStatus.rtnMsg = res.data.rtnMsg;
      notifySave.notifyView(saveStatus);
    })
    .catch(error => {
      console.log('error: ', error);
    });
};
// ***** 인사정보 목록 자료 가져오기 부분  *****************************//
const getData = async () => {
  try {
    const response = await api.post('/api/mst/mst1220_list', {
      paramMakeYear: storeYear.setYear,
      paramMakeMonth: searchParam.pMonth,
      paramSearchWord: searchParam.word,
    });
    rowData.rows = response.data.data;
    rowData.backup = JSON.parse(JSON.stringify(response.data.data));
  } catch (error) {
    console.error('Error fetching users:', error);
  }
};

// **************************************************************//
// ***** DataBase 연결부분 끝  *************************************//
// **************************************************************//

// **************************************************************//
// *****  Excel정보 처리부분    ************************************//
// **************************************************************//
const file = ref(null);
const rowDataExcel = ref([]);
const columnDefsExcel = ref([]);
const gridOptionsExcel = ref({
  defaultColDef: {
    flex: 1,
    minWidth: 100,
    sortable: true,
    resizable: true,
  },
  cacheOverflowSize: 2,
  maxConcurrentDatasourceRequests: 2,
  infiniteInitialRowCount: 1,
  maxBlocksInCache: 2,
});
watch(file, newFile => {
  handleFileUpload(newFile);
});

const handleFileUpload = event => {
  console.log('File selected1:', event); // Debugging log
  console.log('File selected2:', event); // Debugging log
  const selectedFile = event;
  console.log('Selected file:', selectedFile); // Check if the correct file object is logged
  if (!selectedFile) return;

  const reader = new FileReader();

  reader.onload = e => {
    const data = new Uint8Array(e.target.result);
    const workbook = XLSX.read(data, { type: 'array' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

    // Assume the first row of jsonData contains headers (if available)
    if (jsonData.length > 0) {
      // Create columnDefs based on the number of columns
      columnDefsExcel.value = jsonData[0].map((header, index) => ({
        headerName: `Field ${index + 1}`,
        field: `col${index}`, // Assuming fields like col0, col1, col2, ...
      }));

      // Assign rowData, skipping the first row (if it's headers)
      const validRows = jsonData
        .slice(1)
        .map(row => {
          console.log('row : ', JSON.stringify(row));

          // row가 존재하는지 확인하는 조건문 추가
          if (!row || row.length === 0) {
            return null;
          }

          const rowDataObj = {};
          row.forEach((value, colIndex) => {
            rowDataObj[`col${colIndex}`] = value;
            // console.log('index : ', colIndex, value);
          });
          return rowDataObj;
        })
        .filter(row => row !== null); // null 값 필터링 (값이 없으면 제거)

      if (validRows.length > 0) {
        rowDataExcel.value = validRows;
      } else {
        console.log('No valid rows to assign to rowDataExcel.value');
      }
    }
  };
  reader.readAsArrayBuffer(selectedFile);
};

const optionsDate = ref({
  year: [],
  month: [],
  day: [],
});
const optionYymmReset = () => {
  optionsDate.value.year = Array.from({ length: 30 }, (_, i) => {
    const year = new Date().getFullYear() - 10 + i;
    return { label: year.toString() + '년', value: year };
  });

  optionsDate.value.month = [
    { label: '전체', value: '' },
    { label: '01월', value: '01' },
    { label: '02월', value: '02' },
    { label: '03월', value: '03' },
    { label: '04월', value: '04' },
    { label: '05월', value: '05' },
    { label: '06월', value: '06' },
    { label: '07월', value: '07' },
    { label: '08월', value: '08' },
    { label: '09월', value: '09' },
    { label: '10월', value: '10' },
    { label: '11월', value: '11' },
    { label: '12월', value: '12' },
  ];
};
</script>

<style lang="sass" scoped></style>

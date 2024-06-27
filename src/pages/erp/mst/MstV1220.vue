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
              <span class="text-subtitle2 q-px-sm">근태정보 관리</span>
            </q-bar>
            <!--  end of contents list title bar -->
            <q-card-actions align="right" class="q-pa-none">
              <q-toolbar class="row">
                <div class="row q-col-gutter-md">
                  <q-select
                    dense
                    v-model="searchParam.pYear"
                    :options="optionsDate.year"
                    label="년"
                    label-color="orange"
                    emit-value
                    map-options
                    options-dense
                    style="width: 90px"
                  /><q-select
                    dense
                    v-model="searchParam.pMonth"
                    :options="optionsDate.month"
                    label="월"
                    label-color="orange"
                    emit-value
                    map-options
                    options-dense
                    style="width: 75px"
                  /><q-select
                    dense
                    v-model="searchParam.pDay"
                    :options="optionsDate.day"
                    label="일"
                    label-color="orange"
                    emit-value
                    map-options
                    options-dense
                    style="width: 75px"
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
                  <q-btn v-if="selectedRows.length > 0" outline color="negative" dense @click="deleteDataSection">
                    <q-icon name="delete" size="xs" /> 삭제</q-btn
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
                  :defaultColDef="defaultColDef.def"
                  :rowSelection="rowSelection"
                  @selection-changed="onSelectionChanged"
                  @cell-value-changed="onCellValueChanged"
                  @grid-ready="onGridReady"
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
                <span class="text-subtitle1 text-bold">
                  발령정보 Excel파일을 업로드하여 발령정보 자료를 생성합니다. (
                  <span class="text-subtitle2 text-blue"> ▼ 아래 항목별로 엑셀자료를 준비해 주세요</span> )</span
                >
                <br />
                <div class="row justify-between">
                  <div>1. <span class="text-deep-orange">Cell 1</span> -> <span class="text-orange">사번</span></div>
                  <div><span class="text-deep-orange">Cell 2</span> -> <span class="text-orange">소속코드</span></div>
                  <div><span class="text-deep-orange">Cell 3</span> -> <span class="text-orange">직급코드</span></div>
                  <div><span class="text-deep-orange">Cell 4</span> -> <span class="text-orange">발령일자</span></div>
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
  pDay: '',
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

  searchParam.pYear = commUtil.getTodayYear();
  searchParam.pMonth = commUtil.getTodayMonth();
  searchParam.pDay = commUtil.getTodayDay();
  optionYymmReset();
  optionDayReset(searchParam.pYear, searchParam.pMonth);
  getDataAppoYearOption();
});

onMounted(() => {
  window.addEventListener('resize', handleResize);
  handleResize();
});

const formDisableEmpCd = ref(true);
const formDisable = ref(true);
const isScreenVisible = ref(true);
const isClassActive = ref(true);

const isScreenVisibleProcess = () => {
  isScreenVisible.value = !isScreenVisible.value;
  isScreenVisible.value ? (isClassActive.value = true) : (isClassActive.value = false);
};
const contentZoneHeight = ref(500);
const contentZoneStyle = computed(() => ({
  height: `${contentZoneHeight.value}px`,
}));

const gridApi = ref(null);
const rowData = reactive({ rows: [], update: [], backup: [] });

const dateFormatter = params => {
  const dateStr = params.value;
  if (dateStr && dateStr.length === 8) {
    return `${dateStr.slice(0, 4)}-${dateStr.slice(4, 6)}-${dateStr.slice(6)}`;
  }
  return dateStr;
};
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
      headerName: '근태일',
      field: 'makeDay',
      valueFormatter: params => {
        return commUtil.formatDate(params.data.makeDay);
      },
      minWidth: 120,
      maxWidth: 120,
    },
    {
      headerName: '근태시간',
      field: 'makeTime',
      valueFormatter: params => {
        return commUtil.formatTime(params.data.makeTime);
      },
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

const oldFormData = ref(null);
const formData = ref({
  empCd: '',
  empNm: '',
  deptCd: '',
  catgCd: '',
  pstnCd: '',
  titlCd: '',
  evtgCd: '',
  gender: '',
  birthday: '',
  mobile: '',
  email: '',
  inDay: '',
  outDay: '',
  imageFileNm: '',
});

const selectedRows = ref([]);
const isShowStatusEdit = ref(false);
const isShowDeleteBtn = ref(false);
const isShowSaveBtn = ref(false);

const onSelectionChanged = event => {
  selectedRows.value = event.api.getSelectedRows();
};

const onCellValueChanged = () => {
  rowData.update = [];
  for (let i = 0; rowData.backup.length > i; i++) {
    if (JSON.stringify(rowData.backup[i]) !== JSON.stringify(rowData.rows[i])) {
      rowData.update.push(rowData.rows[i]);
    }
  }
  showSaveBtn.value = rowData.update.length > 0;
};

const rowSelection = ref(null);

const empCdFocus = ref(null);
const empNmFocus = ref(null);
const addDataSection = () => {
  formData.value = {};
  oldFormData.value = {};
  isShowStatusEdit.value = true;
  statusEdit.icon = 'edit';
  statusEdit.message = '신규입력모드 입니다';
  statusEdit.color = 'primary';
  isSaveFg = 'I';
  isShowSaveBtn.value = true;
  formDisableEmpCd.value = false;
  formDisable.value = true;
  formData.value.stdYear = storeYear.setYear;
  formData.value.outDay = '9999-12-31';
  setTimeout(() => {
    empCdFocus.value.focus();
  }, 100);
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
        // 출근일자 시간 포멧
        const _dateTime = rowDataExcel.value[i].col0;
        const _datetimeArr = _dateTime.split(' ');
        const _date = _datetimeArr[0].split('-').join('');
        const _ampm = _datetimeArr[1];
        const _timeArr = _datetimeArr[2].split(':');
        let _h = _timeArr[0];
        const _m = _timeArr[1];
        const _s = _timeArr[2];
        if (_ampm === '오후') {
          _h = parseInt(_h) + 12;
        }
        const _time = _h + '' + _m + '' + _s;

        console.log('lastDate : ', _date, _time);
        // 출근일자 시간 포멧 끝

        // 사번
        const _empCd = rowDataExcel.value[i].col3;
        // 상태
        let _status = '0';
        if (_h + _m > '0900') {
          _status = '1';
        }

        const objJson = {
          makeDay: _date,
          makeTime: _time,
          empCd: _empCd,
          status: _status,
          explains: 'upload data',
        };

        let tmpJson = '{"mode":"I","data":' + JSON.stringify(objJson) + '}';
        iu.push(tmpJson);
      }
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
      isSaveFg = 'D';

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
const saveDataSection = () => {
  formData.value.birthday = commUtil.unFormatDate(formData.value.birthday);
  formData.value.inDay = commUtil.unFormatDate(formData.value.inDay);
  formData.value.outDay = commUtil.unFormatDate(formData.value.outDay);

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
      paramSetYear: storeYear.setYear,
      paramAppoYear: searchParam.appoYear,
      paramSearchWord: searchParam.word,
    });
    rowData.rows = response.data.data;
  } catch (error) {
    console.error('Error fetching users:', error);
  }
};

// ***** 발령년도 가져오기 부분  *****************************//
const appoYearOptions = ref([]);
async function getDataAppoYearOption() {
  try {
    const response = await api.post('/api/mst/mst1210_year_list', { paramSetYear: storeYear.setYear });
    appoYearOptions.value = response.data.data;
    appoYearOptions.value.unshift({ appoYearNm: '전체', appoYear: '' });
  } catch (error) {
    console.error('Error fetching users:', error);
  }
}

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
const optionDayReset = (year, month) => {
  const lastDay = commUtil.getLastMonthDay(year, month);
  optionsDate.value.day = Array.from({ length: lastDay }, (_, dd) => {
    let _day = dd + 1;
    let day = commUtil.getDateWithZero(_day);
    return { label: day + '일', value: day };
  });
  optionsDate.value.day.unshift({ label: '전체', value: '' });
};
</script>

<style lang="sass" scoped></style>

<template>
  <q-page class="q-pa-xs-xs q-pa-sm-md" :style-fn="myTweak">
    <q-card class="q-pa-sm">
      <q-bar class="q-px-sm">
        <q-icon name="list_alt" />
        <span class="q-px-sm text-bold text-subtitle1" :class="$q.dark.isActive ? 'text-orange' : 'text-primary'">{{ menuLabel }}</span>
        <q-space />
      </q-bar>

      <div class="">
        <q-card class="q-pa-sm">
          <q-toolbar class="row q-px-none q-pt-none">
            <div class="col-xs-12 col-sm-9 row">
              <q-select
                stack-label
                options-dense
                class="q-px-md q-mr-xs"
                label-color="orange"
                v-model="searchValue.deptCd"
                :options="searchValue.deptOptions"
                option-value="deptCd"
                option-label="deptNm"
                option-disable="inactive"
                emit-value
                map-options
                style="min-width: 100px"
                label="소속팀"
                @update:model-value="getData"
              />
              <q-select
                stack-label
                options-dense
                class="q-px-md"
                label-color="orange"
                v-model="searchValue.titlCd"
                :options="searchValue.titlOptions"
                option-value="titlCd"
                option-label="titlNm"
                option-disable="inactive"
                emit-value
                map-options
                style="min-width: 90px"
                label="직급"
                @update:model-value="getData"
              />
              <q-select
                stack-label
                options-dense
                class="q-px-md"
                label-color="orange"
                v-model="searchValue.catgCd"
                :options="searchValue.catgOptions"
                option-value="catgCd"
                option-label="catgNm"
                option-disable="inactive"
                emit-value
                map-options
                style="min-width: 100px"
                label="직분류"
                @update:model-value="getData"
              />
              <q-input
                stack-label
                label-color="orange"
                bottom-slots
                v-model="searchValue.textValue"
                label="검색(성명)"
                class="q-pb-none"
                style="width: 110px"
                @update:model-value="getData"
              >
                <template v-slot:append>
                  <q-icon
                    v-if="searchValue.textValue !== ''"
                    name="close"
                    @click="searchValue.textValue = ''"
                    size="xs"
                    class="cursor-pointer q-pt-md"
                  />
                </template>
              </q-input>
            </div>
            <q-space />
            <div class="row q-gutter-x-xs">
              <q-btn outline color="grey" @click="getData" class="q-px-sm">
                <q-icon name="search" size="xs" class="q-mr-xs" />
                조회
              </q-btn>

              <q-btn :disable="rowData.rows.length === 0" outline color="teal" @click="isExcelDownload" class="q-px-sm">
                <q-icon name="download" size="xs" class="q-mr-xs" />
                엑셀
              </q-btn>
            </div>
          </q-toolbar>
          <q-card class="q-mt-sm">
            <div :style="{ height: gridHeight + 'px' }">
              <ag-grid-vue
                style="width: 100%; height: 100%"
                :class="$q.dark.isActive ? 'ag-theme-alpine-dark' : 'ag-theme-alpine'"
                :rowData="rowData.rows"
                :grid-options="gridOptions"
              >
              </ag-grid-vue>
            </div>
          </q-card>
        </q-card>
      </div>
    </q-card>
    <!--    <q-dialog persistent full-height full-width v-model="isDialogVisible">-->
    <!--      <q-card class="q-pa-none q-ma-none">-->
    <!--        <q-card-section class="q-pa-none q-ma-none">-->
    <!--          <hrt-v4020p :rowData="rowData.rows" @close="handleClose" />-->
    <!--        </q-card-section>-->
    <!--      </q-card>-->
    <!--    </q-dialog>-->
  </q-page>
</template>
ㅌ
<script setup>
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import 'ag-grid-community/styles/ag-theme-balham.css';
import { AgGridVue } from 'ag-grid-vue3';
import { computed, onBeforeMount, onBeforeUnmount, onMounted, reactive, ref } from 'vue';
import { api } from 'boot/axios';
import * as XLSX from 'xlsx';
import { QBtn, QIcon, QToggle, SessionStorage, useQuasar } from 'quasar';
import { useYearInfoStore } from 'src/store/setYearInfo';

const storeYear = useYearInfoStore();

const rowData = reactive({ rows: [] });
const isDialogVisible = ref(false);

// grid Height 자동처리부분1
const gridHeight = ref(145); // 초기 높이
const rowHeight = 45; // 행당 높이 (예: 25px)
const minHeight = ref(90); // 최소 높이 (예: 300px) rowHeight의 3배

const $q = useQuasar();

function handleClose() {
  console.log('handleClose called');
  isDialogVisible.value = false;
}
const contentZoneHeight = ref(300);
const contentZoneStyle = computed(() => ({
  height: `${contentZoneHeight.value}px`,
}));

const searchValue = ref({
  textValue: '',
  deptCd: null,
  titlCd: null,
  catgCd: null,
  deptOptions: null,
  titlOptions: null,
  catgOptions: null,
});

const columnDefs = reactive({
  group: [
    {
      headerName: '#',
      minWidth: 70,
      maxWidth: 80,
      pinned: 'left',
      sortable: false,
      filter: false,
      valueGetter: function (params) {
        return params.node.rowIndex + 1;
      },
      cellStyle: params => {
        return { textAlign: 'center' };
      },
    },
    {
      headerName: '사번',
      field: 'empCd',
      pinned: 'left',
      minWidth: 100,
      resizable: true,
      cellStyle: params => {
        return getStatusMessageStyle(params.data);
      },
    },
    {
      headerName: '성명',
      field: 'empNm',
      pinned: 'left',
      minWidth: 90,
      resizable: true,
      cellStyle: params => {
        return getStatusMessageStyle(params.data);
      },
    },
    {
      headerName: '소속',
      field: 'deptNm',
      minWidth: 105,
      cellStyle: params => {
        return getStatusMessageStyle(params.data);
      },
    },
    {
      headerName: '직급',
      field: 'titlNm',
      minWidth: 90,
      cellStyle: params => {
        return getStatusMessageStyle(params.data);
      },
    },
    {
      headerName: '성과점수',
      field: 'evaP1',
      minWidth: 100,
      cellStyle: params => {
        return getStatusMessageStyle(params.data);
      },
    },
    {
      headerName: '역량점수',
      field: 'evaP2',
      minWidth: 100,
      cellStyle: params => {
        return getStatusMessageStyle(params.data);
      },
    },
    {
      headerName: '성과환산',
      field: 'evaP1X',
      minWidth: 100,
      cellStyle: params => {
        return getStatusMessageStyle(params.data);
      },
    },
    {
      headerName: '역량환산',
      field: 'evaP2X',
      minWidth: 100,
      cellStyle: params => {
        return getStatusMessageStyle(params.data);
      },
    },
    {
      headerName: '최종점수',
      field: 'evaPT',
      minWidth: 100,
      cellStyle: params => {
        return getStatusMessageStyle(params.data);
      },
    },
    {
      headerName: '본부별역량평균',
      field: 'evaP2Avg',
      minWidth: 100,
      cellStyle: params => {
        return getStatusMessageStyle(params.data);
      },
    },
    {
      headerName: '역량평균개인편차',
      field: 'evaP2C',
      minWidth: 100,
      cellStyle: params => {
        return getStatusMessageStyle(params.data);
      },
    },
    {
      headerName: '개인편차의제곱',
      field: 'evaP2Cc',
      minWidth: 100,
      cellStyle: params => {
        return getStatusMessageStyle(params.data);
      },
    },
    {
      headerName: '소속의편차평균',
      field: 'evaP2CcAvg',
      minWidth: 100,
      cellStyle: params => {
        return getStatusMessageStyle(params.data);
      },
    },
    {
      headerName: '분산의루트(표준편차)',
      field: 'evaP2SqSd',
      minWidth: 100,
      cellStyle: params => {
        return getStatusMessageStyle(params.data);
      },
    },
    {
      headerName: '전체평균에대한편차',
      field: 'evaP2TavgSd',
      minWidth: 100,
      cellStyle: params => {
        return getStatusMessageStyle(params.data);
      },
    },
    {
      headerName: '소속표준편차',
      field: 'evaP2DivSd',
      minWidth: 100,
      cellStyle: params => {
        return getStatusMessageStyle(params.data);
      },
    },
    {
      headerName: '역량조정점수',
      field: 'evaP2Comp',
      minWidth: 100,
      cellStyle: params => {
        return getStatusMessageStyle(params.data);
      },
    },
    {
      headerName: '본부별평균',
      field: 'evaDivAvg',
      minWidth: 100,
      cellStyle: params => {
        return getStatusMessageStyle(params.data);
      },
    },
    {
      headerName: '소속표준편차',
      field: 'evaP2Sd',
      minWidth: 100,
      cellStyle: params => {
        return getStatusMessageStyle(params.data);
      },
    },
    {
      headerName: '근태점수',
      field: 'evaAtt',
      minWidth: 100,
      maxWidth: 100,
      cellStyle: params => {
        return getStatusAttStyle(params.data);
      },
    },
    {
      headerName: '역량조정환산',
      field: 'evaP2Xx',
      minWidth: 100,
      cellStyle: params => {
        return getStatusMessageStyle(params.data);
      },
    },
    {
      headerName: '최종점수',
      field: 'evaFinalPoint',
      pinned: 'right',
      minWidth: 120,
      maxWidth: 120,
      cellStyle: { color: 'blue' },
    },
    {
      headerName: '등급',
      field: 'evaGrade',
      pinned: 'right',
      minWidth: 90,
      maxWidth: 90,
      cellStyle: { color: 'blue' },
    },
  ],
});
const getStatusAttStyle = val => {
  if (val.evaAtt > 0) {
    return $q.dark.isActive ? { color: 'red' } : { color: 'red' };
  } else {
    return $q.dark.isActive ? { color: 'blue' } : { color: 'blue' };
  }
};

const getStatusMessageStyle = val => {
  // console.log(JSON.stringify(val));

  return { color: 'dark' };
  // return { textAlign: 'center' };
  // }
};

onBeforeUnmount(() => {
  // console.log('onBeforeUnmount....');
  // Remove the resize event listener when the component is destroyed
  window.removeEventListener('resize', handleResize);
});
onBeforeMount(() => {
  // console.log('onBeforeMount....', storeUser.setCatgCd, storeUser.setCatgNm, storeUser.setEvtgCd, storeUser.setEvtgNm);
  getDataDeptOption();
  getDataTitlOption();
  getDataCatgOption();

  // getData();
});

const menuLabel = ref('');
onMounted(() => {
  window.addEventListener('resize', handleResize);
  menuLabel.value = window.history.state.label;
  handleResize();
});

const selectedRows = ref([]);

// ======================================================
const screenSizeHeight = ref(0);
const myTweak = offset => {
  screenSizeHeight.value = offset;

  return { minHeight: offset ? `calc(100vh - ${offset}px)` : '100vh' };
};
const handleResize = () => {
  contentZoneHeight.value = window.innerHeight - screenSizeHeight.value;
  // contentZoneHeight.value = window.innerHeight - state.height - 680;
};
// ======================================================

// **************************************************************//
// ***** DataBase 연결부분    *************************************//
// **************************************************************//

const getData = async () => {
  try {
    const response = await api.post('/api/hrt/hrt4020_list', {
      paramSetYear: storeYear.setYear,
      paramEvaFg: '2',
      paramDeptCd: searchValue.value.deptCd,
      paramTitlCd: searchValue.value.titlCd,
      paramCatgCd: searchValue.value.catgCd,
      paramSearchValue: searchValue.value.textValue,
    });
    rowData.rows = response.data.data;
    // console.log('aa : ', JSON.stringify(response.data.data));
    if (rowData.rows.length === 0) {
      gridHeight.value = 145;
    } else {
      gridHeight.value = minHeight.value + rowData.rows.length * rowHeight;
      const maxHeight = contentZoneHeight.value - 180;
      if (gridHeight.value > maxHeight) {
        gridHeight.value = maxHeight;
      }
      // console.log('height : ', contentZoneHeight.value, gridHeight.value);
    }
  } catch (error) {
    console.error('Error fetching users:', error);
  }
};

// ***** DataBase 소속자료 가져오기 부분 *****************************//
async function getDataDeptOption() {
  try {
    const response = await api.post('/api/mst/dept_option_list', { paramSetYear: storeYear.setYear });

    searchValue.value.deptOptions = response.data.data;
    searchValue.value.deptOptions.unshift({ deptCd: '', deptNm: '전체' });
    searchValue.value.deptCd = '';
  } catch (error) {
    console.error('Error fetching users:', error);
  }
}

// ***** DataBase 직급자료 가져오기 부분 *****************************//
async function getDataTitlOption() {
  try {
    const response = await api.post('/api/mst/titl_option_list', { paramSetYear: storeYear.setYear });

    searchValue.value.titlOptions = response.data.data;
    searchValue.value.titlOptions.unshift({ titlCd: '', titlNm: '전체' });
    searchValue.value.titlCd = '';
  } catch (error) {
    console.error('Error fetching users:', error);
  }
}

// ***** DataBase 직분류자료 가져오기 부분 *****************************//
async function getDataCatgOption() {
  try {
    const response = await api.post('/api/mst/catg_option_list', { paramSetYear: storeYear.setYear });

    searchValue.value.catgOptions = response.data.data;
    searchValue.value.catgOptions.unshift({ catgCd: '', catgNm: '전체' });
    searchValue.value.catgCd = '';
  } catch (error) {
    console.error('Error fetching users:', error);
  }
}

// **************************************************************//
// ***** DataBase 연결부분 끝  *************************************//
// **************************************************************//

const gridOptions = {
  columnDefs: columnDefs.group,
  defaultColDef: {
    flex: 1,
    sortable: true,
    filter: true,
    floatingFilter: false,
    editable: false,
  },
  rowSelection: 'single' /* 'single' or 'multiple',*/,
  enableColResize: true,
  enableSorting: true,
  enableFilter: true,
  enableRangeSelection: true,
  suppressRowClickSelection: false,
  animateRows: true,
  suppressHorizontalScroll: true,
  localeText: { noRowsToShow: '조회 결과가 없습니다.' },
  getRowStyle: function (param) {
    // console.log('node : ', param);
    if (param.node.rowPinned) {
      return { 'font-weight': 'bold', background: '#dddddd' };
    }
    return { 'text-align': 'left' };
  },
  getRowHeight: function (param) {
    // 고정된 행의 높이
    if (param.node.rowPinned) {
      return 45;
    }
    return 35;
  },
  // GRID READY 이벤트, 사이즈 자동조정
  onGridReady: function (event) {
    event.api.sizeColumnsToFit();
  },
  // 창 크기 변경 되었을 때 이벤트
  onGridSizeChanged: function (event) {
    event.api.sizeColumnsToFit();
  },
  onRowEditingStarted: function (event) {
    console.log('never called - not doing row editing');
  },
  onRowEditingStopped: function (event) {
    console.log('never called - not doing row editing');
  },
  onCellEditingStarted: function (event) {
    console.log('cellEditingStarted');
  },
  onCellEditingStopped: function (event) {
    console.log('cellEditingStopped');
  },
  onRowClicked: function (event) {
    console.log('onRowClicked');
    selectedRows.value = event.api.getSelectedRows();
    // console.log('sel: ', JSON.stringify(selectedRows.value));
  },
  onCellClicked: function (event) {
    console.log('onCellClicked');
  },
  isRowSelectable: function (event) {
    // console.log('isRowSelectable');
    return true;
  },
  onSelectionChanged: function (event) {
    console.log('onSelectionChanged');
  },
  onSortChanged: function (event) {
    console.log('onSortChanged');
  },
  onCellValueChanged: function (event) {
    console.log('onCellValueChanged');
  },
  getRowNodeId: function (data) {
    return null;
  },
  // 리드 상단 고정
  setPinnedTopRowData: function (data) {
    return null;
  },
  // 그리드 하단 고정
  setPinnedBottomRowData: function (data) {
    return null;
  },
  // components: {
  //   numericCellEditor: NumericCellEditor,
  //   moodEditor: MoodEditor,
  // },
  debug: false,
};

/* ************************************************************************* *
 ** Excel저장  처리부분
 ** ************************************************************************* */
const isExcelDownload = () => {
  $q.dialog({
    dark: true,
    title: 'Excel 저장',
    html: true,
    message: '엑셀 파일로 저장 하시겠습니까?',
    // persistent: true,
    ok: {
      label: '저장',
      color: 'primary',
    },
    cancel: {
      label: '닫기',
      color: 'secondary',
    },
  })
    .onOk(() => {
      excelDownload();
    })
    .onCancel(() => {})
    .onDismiss(() => {});
};
const headerGroup = reactive({
  header: [],
  headProps: [
    'deptNm',
    'titlNm',
    'empCd',
    'empNm',
    'evaP1',
    'evaP2',
    'evaP1X',
    'evaP2X',
    'evaPT',
    'evaP2Avg',
    'evaP2C',
    'evaP2Cc',
    'evaP2CcAvg',
    'evaP2SqSd',
    'evaP2TavgSd',
    'evaP2DivSd',
    'evaP2Comp',
    'evaDivAvg',
    'evaP2Sd',
    'evaAtt',
    'evaP2Xx',
    'evaFinalPoint',
  ],
  headRow1: [
    { name: '소속', rowspan: 1, colspan: 1, key: 'deptNm' },
    { name: '직급', rowspan: 1, colspan: 1, key: 'titlNm' },
    { name: '사번', rowspan: 1, colspan: 1, key: 'empCd' },
    { name: '성명', rowspan: 1, colspan: 1, key: 'empNm' },
    { name: '성과평가점수', rowspan: 1, colspan: 1, key: 'evaP1' },
    { name: '역량평가점수', rowspan: 1, colspan: 1, key: 'evaP2' },
    { name: '성과환산', rowspan: 1, colspan: 1, key: 'evaP1X' },
    { name: '역량환산', rowspan: 1, colspan: 1, key: 'evaP2X' },
    { name: '최종점수', rowspan: 1, colspan: 1, key: 'evaPT' },
    { name: '본부별역량평균', rowspan: 1, colspan: 1, key: 'evaP2Avg' },
    { name: '역량평균개인편차', rowspan: 1, colspan: 1, key: 'evaP2C' },
    { name: '개인편차의제곱', rowspan: 1, colspan: 1, key: 'evaP2Cc' },
    { name: '소속의편차평균(분산)', rowspan: 1, colspan: 1, key: 'evaP2CcAvg' },
    { name: '분산의루트(표준편차)', rowspan: 1, colspan: 1, key: 'evaP2SqSd' },
    { name: '전체평균에대한편차', rowspan: 1, colspan: 1, key: 'evaP2TavgSd' },
    { name: '소속표준편차', rowspan: 1, colspan: 1, key: 'evaP2DivSd' },
    { name: '역량조정점수', rowspan: 1, colspan: 1, key: 'evaP2Comp' },
    { name: '본부별평균', rowspan: 1, colspan: 1, key: 'evaDicAvg' },
    { name: '소속표준편차', rowspan: 1, colspan: 1, key: 'evaP2Sd' },
    { name: '근태', rowspan: 1, colspan: 1, key: 'evaAtt' },
    { name: '역량조정환산', rowspan: 1, colspan: 1, key: 'evaP2Xx' },
    { name: '최종점수', rowspan: 1, colspan: 1, key: 'evaFinalPoint' },
  ],
});

const excelDownload = () => {
  headerGroup.header = [];
  headerGroup.header.push(headerGroup.headRow1);
  // headerGroup.header.push(headerGroup.headRow2);

  let options = {
    header: headerGroup.header,
    headProps: headerGroup.headProps,
  };
  excelExport(rowData.rows, options);
};

const visibleHeadProps = ref([]);
const instance = ref(undefined);
const excelExport = (data, options) => {
  let headProps = [];
  if (Array.isArray(options.headProps)) {
    headProps = options.headProps;
  } else if (options.headProps === 'header') {
    for (let h of headerGroup.header) {
      headProps.push(h.key);
    }
  } else {
    headProps = Object.keys(data[0]);
  }
  visibleHeadProps.value = headerGroup.headProps;

  instance.value = document.createElement('table');

  // Header 세팅
  let headerRows = [];
  if (!Array.isArray(headerGroup.header[0])) {
    headerRows.push(headerGroup.header);
  } else {
    headerRows = headerGroup.header;
  }
  let thead = document.createElement('thead');
  for (let row of headerRows) {
    let tr = document.createElement('tr');
    for (let h of row) {
      let rowspan = h.rowspan || '1';
      let colspan = h.colspan || '1';
      let th = document.createElement('th');
      th.setAttribute('rowspan', rowspan);
      th.setAttribute('colspan', colspan);
      th.innerText = h.name;
      tr.appendChild(th);
    }
    thead.appendChild(tr);
  }
  instance.value.appendChild(thead);

  // Body 세팅
  let tbody = document.createElement('tbody');
  for (let row of data) {
    let tr = document.createElement('tr');
    for (let cellkey of visibleHeadProps.value) {
      let td = document.createElement('td');
      td.innerText = row[cellkey];
      tr.appendChild(td);
    }
    tbody.appendChild(tr);
  }
  instance.value.appendChild(tbody);

  // instance에 만들어진 table을 엑셀파일로 저장
  const config = { raw: true, type: 'string' };
  const ws = XLSX.utils.table_to_sheet(instance.value, config);

  // Set red color to A1 cell
  ws['A1'].s = {
    font: {
      color: { rgb: 'FF0000' }, // Red color
      bold: true,
    },
  };

  // Add borders to all cells
  const range = XLSX.utils.decode_range(ws['!ref']);
  for (let R = range.s.r; R <= range.e.r; ++R) {
    for (let C = range.s.c; C <= range.e.c; ++C) {
      const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
      if (!ws[cellAddress]) continue;
      ws[cellAddress].s = {
        border: {
          // top: { style: 'thin', color: { auto: 1 } },
          // bottom: { style: 'thin', color: { auto: 1 } },
          // left: { style: 'thin', color: { auto: 1 } },
          // right: { style: 'thin', color: { auto: 1 } },
          top: { style: 'thin', color: { rgb: '0000FF' } }, // Blue color
          bottom: { style: 'thin', color: { rgb: '0000FF' } }, // Blue color
          left: { style: 'thin', color: { rgb: '0000FF' } }, // Blue color
          right: { style: 'thin', color: { rgb: '0000FF' } }, // Blue color
        },
      };
    }
  }

  let wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, '최종(편차적용)_직무역량별');
  XLSX.writeFile(wb, '최종(편차적용)_직무역량별.xlsx');
};
/* ************************************************************************* *
 ** Excel저장  처리부분 끝
 ** ************************************************************************* */
</script>
<style>
table {
  border-collapse: collapse;
  width: 100%;
}

th,
td {
  border: 1px solid black;
  padding: 8px;
  text-align: left;
}

th {
  background-color: #f2f2f2;
}
</style>

<template>
  <q-page class="q-pa-xs-xs q-pa-sm-md" :style-fn="myTweak">
    <!-- contents zone -->
    <div class="row q-col-gutter-md">
      <!-- contents List -->
      <div class="col-12">
        <q-card bordered>
          <!-- contents list title bar -->
          <q-bar class="q-px-sm">
            <q-icon name="list_alt" />
            <span class="text-subtitle2 q-px-sm">소속팀정보리스트</span>
          </q-bar>
          <!--  end of contents list title bar -->
          <q-card-actions align="right" class="q-pa-none">
            <q-toolbar class="row">
              <q-btn outline color="positive" dense @click="getData"><q-icon name="refresh" size="xs" class="q-mr-sm" />다시불러오기</q-btn>
              <q-space />
              <div class="q-gutter-xs">
                <q-btn v-if="selectedRows.length > 0" outline color="negative" dense @click="deleteDataSection">
                  <q-icon name="delete" size="xs" /> 삭제</q-btn
                >
                <q-btn v-if="showSaveBtn" outline color="primary" dense @click="saveDataSection"><q-icon name="save" size="xs" /> 저장 </q-btn>
                <q-btn outline color="positive" dense @click="addDataSection"><q-icon name="add" size="xs" /> 신규 </q-btn>
              </div>
            </q-toolbar>
          </q-card-actions>

          <q-separator size="3px" />

          <q-card-section class="q-pa-xs">
            <div :style="contentZoneStyle">
              <ag-grid-vue
                ref="myGrid"
                style="width: 100%; height: 100%"
                :class="$q.dark.isActive ? 'ag-theme-alpine-dark' : 'ag-theme-alpine'"
                :grid-options="gridOptions"
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
import { QBtn, QIcon, useQuasar } from 'quasar';
import { computed, onBeforeMount, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue';
import { api } from '/src/boot/axios';
import { isEmpty } from 'lodash';
import jsonUtil from 'src/js_comm/json-util';
import notifySave from 'src/js_comm/notify-save';
import CompSelectTeam from 'components/CompSelectTeam.vue';

const $q = useQuasar();

let isSaveFg = null;

const contentZoneHeight = ref(500);
const contentZoneStyle = computed(() => ({
  height: `${contentZoneHeight.value}px`,
}));

const rowData = reactive({ rows: [] });
const rowDataBack = ref([]);
const showSaveBtn = ref(false);
const showDeleteBtn = ref(false);

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize);
});
onBeforeMount(() => {
  getDataCommOption('201').then(() => {
    columnDefsSet();
    myGrid.value.api.setColumnDefs(columnDefs.value);
    getData();
  });
});
onMounted(() => {
  window.addEventListener('resize', handleResize);
  handleResize();
});

watch(
  () => $q.dark.isActive,
  () => {
    if (myGrid.value && myGrid.value.api) {
      myGrid.value.api.refreshCells(); // Refresh the ag-Grid cells
    }
  },
);
const teamOptions = ref([]);
const columnDefs = ref([]);
const columnDefsSet = () => {
  columnDefs.value = [
    {
      headerName: '',
      field: '',
      maxWidth: 50,
      minWidth: 50,
      editable: false,
      checkboxSelection: true,
      headerCheckboxSelection: true,

      filter: false,
      pinned: 'left',
    },
    {
      headerName: '코드',
      field: 'salesCd',
      maxWidth: 80,
      minWidth: 80,
      editable: false,
      pinned: 'left',
      cellEditorParams: {
        maxLength: 5, // 최대 길이
      },
    },
    {
      headerName: '영업담당',
      field: 'salesNm',
      maxWidth: 100,
      minWidth: 100,
      pinned: 'left',
      editable: false,
    },
    {
      headerName: '년간 목표액',
      field: 'o00Amt',
      minWidth: 140,
      maxWidth: 140,
      pinned: 'left',
      valueFormatter: params => {
        if (params.value != null) {
          return new Intl.NumberFormat('ko-KR', {
            // style: 'currency',
            // currency: 'KRW',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          }).format(params.value);
        }
        return '';
      },
      cellClass: 'ag-right-aligned-cell',
      cellStyle: () => {
        return {
          color: $q.dark.isActive ? 'orange' : 'teal',
        };
      },
    },
    {
      headerName: '1월 목표액',
      field: 'o01Amt',
      minWidth: 130,
      valueFormatter: params => {
        if (params.value != null) {
          return new Intl.NumberFormat('ko-KR', {
            // style: 'currency',
            // currency: 'KRW',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          }).format(params.value);
        }
        return '';
      },
      cellClass: 'ag-right-aligned-cell',
    },
    {
      headerName: '2월 목표액',
      field: 'o02Amt',
      minWidth: 130,
      valueFormatter: params => {
        if (params.value != null) {
          return new Intl.NumberFormat('ko-KR', {
            // style: 'currency',
            // currency: 'KRW',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          }).format(params.value);
        }
        return '';
      },
      cellClass: 'ag-right-aligned-cell',
    },
    {
      headerName: '3월 목표액',
      field: 'o03Amt',
      minWidth: 130,
      valueFormatter: params => {
        if (params.value != null) {
          return new Intl.NumberFormat('ko-KR', {
            // style: 'currency',
            // currency: 'KRW',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          }).format(params.value);
        }
        return '';
      },
      cellClass: 'ag-right-aligned-cell',
    },
    {
      headerName: '4월 목표액',
      field: 'o04Amt',
      minWidth: 130,
      valueFormatter: params => {
        if (params.value != null) {
          return new Intl.NumberFormat('ko-KR', {
            // style: 'currency',
            // currency: 'KRW',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          }).format(params.value);
        }
        return '';
      },
      cellClass: 'ag-right-aligned-cell',
    },
    {
      headerName: '5월 목표액',
      field: 'o05Amt',
      minWidth: 130,
      valueFormatter: params => {
        if (params.value != null) {
          return new Intl.NumberFormat('ko-KR', {
            // style: 'currency',
            // currency: 'KRW',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          }).format(params.value);
        }
        return '';
      },
      cellClass: 'ag-right-aligned-cell',
    },
    {
      headerName: '6월 목표액',
      field: 'o06Amt',
      minWidth: 130,
      valueFormatter: params => {
        if (params.value != null) {
          return new Intl.NumberFormat('ko-KR', {
            // style: 'currency',
            // currency: 'KRW',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          }).format(params.value);
        }
        return '';
      },
      cellClass: 'ag-right-aligned-cell',
    },
    {
      headerName: '7월 목표액',
      field: 'o07Amt',
      minWidth: 130,
      valueFormatter: params => {
        if (params.value != null) {
          return new Intl.NumberFormat('ko-KR', {
            // style: 'currency',
            // currency: 'KRW',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          }).format(params.value);
        }
        return '';
      },
      cellClass: 'ag-right-aligned-cell',
    },
    {
      headerName: '8월 목표액',
      field: 'o08Amt',
      minWidth: 130,
      valueFormatter: params => {
        if (params.value != null) {
          return new Intl.NumberFormat('ko-KR', {
            // style: 'currency',
            // currency: 'KRW',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          }).format(params.value);
        }
        return '';
      },
      cellClass: 'ag-right-aligned-cell',
    },
    {
      headerName: '9월 목표액',
      field: 'o09Amt',
      minWidth: 130,
      valueFormatter: params => {
        if (params.value != null) {
          return new Intl.NumberFormat('ko-KR', {
            // style: 'currency',
            // currency: 'KRW',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          }).format(params.value);
        }
        return '';
      },
      cellClass: 'ag-right-aligned-cell',
    },
    {
      headerName: '10월 목표액',
      field: 'o10Amt',
      minWidth: 130,
      valueFormatter: params => {
        if (params.value != null) {
          return new Intl.NumberFormat('ko-KR', {
            // style: 'currency',
            // currency: 'KRW',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          }).format(params.value);
        }
        return '';
      },
      cellClass: 'ag-right-aligned-cell',
    },
    {
      headerName: '11월 목표액',
      field: 'o11Amt',
      minWidth: 130,
      valueFormatter: params => {
        if (params.value != null) {
          return new Intl.NumberFormat('ko-KR', {
            // style: 'currency',
            // currency: 'KRW',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          }).format(params.value);
        }
        return '';
      },
      cellClass: 'ag-right-aligned-cell',
    },
    {
      headerName: '12월 목표액',
      field: 'o12Amt',
      minWidth: 130,
      valueFormatter: params => {
        if (params.value != null) {
          return new Intl.NumberFormat('ko-KR', {
            // style: 'currency',
            // currency: 'KRW',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          }).format(params.value);
        }
        return '';
      },
      cellClass: 'ag-right-aligned-cell',
    },
    {
      headerName: '년합게',
      field: 'totAmt',
      minWidth: 140,
      maxWidth: 140,
      pinned: 'right',
      editable: false,
      valueFormatter: params => {
        if (params.value != null) {
          return new Intl.NumberFormat('ko-KR', {
            // style: 'currency',
            // currency: 'KRW',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          }).format(params.value);
        }
        return '';
      },
      cellClass: 'ag-right-aligned-cell',
      cellStyle: () => {
        return {
          color: $q.dark.isActive ? 'white' : 'black',
          backgroundColor: $q.dark.isActive ? '#616161' : '#d2d2d2', // Set based on dark or light mode
        };
      },
    },
  ];
};

const selectedRows = ref([]);
const updateData = ref([]);
const handleCellValueChanged = event => {
  const changedField = event.colDef.field; // Access the field name from the event
  const valueAmt = event.newValue;
  const rowDataItem = event.data;

  // Log the field name for debugging
  if (changedField.substring(0, 1) === 'o') {
    const valueMonth = changedField.substring(1, 3);
    const fiendNm = 'U' + valueMonth;
    const valueUID = rowDataItem[fiendNm] === 'Y' ? 'U' : 'I';
    const valueSalesCd = rowDataItem['salesCd'];
    const valueDivCd = rowDataItem['divCd'];
    console.log('month :', valueMonth);
    console.log('salesCd :', valueSalesCd);
    console.log('divCd :', valueDivCd);
    console.log('UID :', valueUID);
    console.log('amt :', valueAmt);

    let ch = true;
    for (let i = 0; i < updateData.value.length; i++) {
      if (updateData.value[i].salesCd === valueSalesCd) {
        updateData.value[i].targetAmt = valueAmt;
      } else {
        updateData.value.push({
          mode: valueUID,
          stdYymm: '2024' + '' + valueMonth,
          salesCd: valueSalesCd,
          divCd: valueDivCd,
          targetAmt: valueAmt,
        });
      }
      ch = false;
    }
    if (ch) {
      updateData.value.push({
        mode: valueUID,
        stdYymm: '2024' + '' + valueMonth,
        salesCd: valueSalesCd,
        divCd: valueDivCd,
        targetAmt: valueAmt,
      });
    }
  }

  console.log('up ; ', JSON.stringify(updateData.value));
  showSaveBtn.value = updateData.value.length > 0;
};

//*******************************************************//
//****  신규 자료 추가부분     ******************************//
const addDataSection = () => {
  showSaveBtn.value = true;
  updateData.value = [];
  const addIndex = 0;
  const newItems = {
    salesCd: '',
    oldSalesCd: '',
    salesNm: '',
    teamCd: '',
    explains: '',
    seq: rowData.rows.length + 1,
    iuD: 'I',
  };
  rowData.rows.splice(addIndex, 0, newItems);
  // Refresh the grid
  myGrid.value.api.setRowData(rowData.rows);
  // 첫컬럼에 focus
  myGrid.value.api.setFocusedCell(addIndex, 'deptCd');
};
//****  신규 자료 추가부분 끝    ******************************//

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

      const selectedData = myGrid.value.api.getSelectedRows();
      myGrid.value.api.applyTransaction({ remove: selectedData });
    })
    .onCancel(() => {})
    .onDismiss(() => {
      // 확인/취소 모두 실행되었을때
    });
};

const saveDataSection = () => {
  let iu = [];
  let iuD = [];
  // 신규 추가 부분
  for (let i = 0; i < rowData.rows.length; i++) {
    if (!isEmpty(rowData.rows[i].salesCd)) {
      if (rowData.rows[i].iuD === 'I') {
        let tmpJson = '{"mode": "' + rowData.rows[i].iuD + '","data":' + JSON.stringify(rowData.rows[i]) + '}';
        iu.push(tmpJson);
      }
    }
  }
  // 자료 수정 부분
  for (let i = 0; i < updateData.value.length; i++) {
    if (!isEmpty(updateData.value[i].salesCd)) {
      if (updateData.value[i].iuD === 'U') {
        let tmpJson = '{"mode": "' + updateData.value[i].iuD + '","data":' + JSON.stringify(updateData.value[i]) + '}';
        iu.push(tmpJson);
      }
    }
  }
  // console.log('iu ::: ', JSON.stringify(iu));
  if (isEmpty(iu) && isEmpty(iuD)) {
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
    setTimeout(() => {
      getData();
    }, 500);
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
const myGrid = ref(null);
// ***** 소속팀정보 가저오기 부분  **************************//
const getData = async () => {
  try {
    const response = await api.post('/api/mkt/mkt2010_list', {
      paramYear: '2024',
      paramDivCd: '1100',
    });
    rowData.rows = response.data.data;
    rowDataBack.value = JSON.parse(JSON.stringify(response.data.data));
    // console.log('rowData : ', JSON.stringify(rowData.rows));
    // console.log('bakData : ', JSON.stringify(rowDataBack.value));
    updateData.value = [];
    showSaveBtn.value = false;
    myGrid.value.api.setGridOption('rowData', rowData.rows);
    myGrid.value.api.setPinnedBottomRowData([calculateTotal()]);
  } catch (error) {
    console.error('Error fetching users:', error);
  }
};

// ***** 소속팀정보 저장하기 부분  **************************//
const saveDataAndHandleResult = resFormData => {
  api
    .post('/api/mst/mst2010_save', resFormData)
    .then(res => {
      let saveStatus = {};
      saveStatus.rtn = res.data.rtn;
      saveStatus.rtnMsg = res.data.rtnMsg;
      notifySave.notifyView(saveStatus);

      showSaveBtn.value = false;
      getData();
    })
    .catch(error => {
      console.log('error: ', error);
    });
};

async function getDataCommOption(resCommCd1) {
  try {
    const response = await api.post('/api/mst/comm_option_list', { paramCommCd1: resCommCd1 });
    switch (resCommCd1) {
      case '201':
        teamOptions.value = response.data.data;
        // console.log('level : ', JSON.stringify(levelOptions.value));
        break;
      default:
        teamOptions.value = [];
    }

    // console.log('getData1: ', JSON.stringify(response.data.data));
  } catch (error) {
    console.error('Error fetching users:', error);
  }
}
// **************************************************************//
// ***** DataBase 연결부분 끝  *************************************//
// **************************************************************//

// *********************************
// rows 전체 합 구하는 부분
const calculateTotal = () => {
  let totalRow = {
    salesNm: '합계',
    o00Amt: 0,
    o01Amt: 0,
    o02Amt: 0,
    o03Amt: 0,
    o04Amt: 0,
    o05Amt: 0,
    o06Amt: 0,
    o07Amt: 0,
    o08Amt: 0,
    o09Amt: 0,
    o10Amt: 0,
    o11Amt: 0,
    o12Amt: 0,
    totAmt: 0,
  };

  rowData.rows.forEach(row => {
    totalRow.o00Amt += row.o00Amt || 0;
    totalRow.o01Amt += row.o01Amt || 0;
    totalRow.o02Amt += row.o02Amt || 0;
    totalRow.o03Amt += row.o03Amt || 0;
    totalRow.o04Amt += row.o04Amt || 0;
    totalRow.o05Amt += row.o05Amt || 0;
    totalRow.o06Amt += row.o06Amt || 0;
    totalRow.o07Amt += row.o07Amt || 0;
    totalRow.o08Amt += row.o08Amt || 0;
    totalRow.o09Amt += row.o09Amt || 0;
    totalRow.o10Amt += row.o10Amt || 0;
    totalRow.o11Amt += row.o11Amt || 0;
    totalRow.o12Amt += row.o12Amt || 0;
    totalRow.totAmt += row.totAmt || 0;
  });

  return totalRow;
};
// rows 전체 합 구하는 부분 끝
// *********************************

// *********************************
// row 합 구하는 부분
const cellSum = rowData => {
  let total = 0;
  total += rowData.o01Amt ? rowData.o01Amt : 0;
  total += rowData.o02Amt ? rowData.o02Amt : 0;
  total += rowData.o03Amt ? rowData.o03Amt : 0;
  total += rowData.o04Amt ? rowData.o04Amt : 0;
  total += rowData.o05Amt ? rowData.o05Amt : 0;
  total += rowData.o06Amt ? rowData.o06Amt : 0;
  total += rowData.o07Amt ? rowData.o07Amt : 0;
  total += rowData.o08Amt ? rowData.o08Amt : 0;
  total += rowData.o09Amt ? rowData.o09Amt : 0;
  total += rowData.o10Amt ? rowData.o10Amt : 0;
  total += rowData.o11Amt ? rowData.o11Amt : 0;
  total += rowData.o12Amt ? rowData.o12Amt : 0;
  return total;
};

// row 각 cell 편집 시 자동 합 구하기 구하기
const handleRowSum = event => {
  if (
    ['o00Amt', 'o01Amt', 'o02Amt', 'o03Amt', 'o04Amt', 'o05Amt', 'o06Amt', 'o07Amt', 'o08Amt', 'o09Amt', 'o10Amt', 'o11Amt', 'o12Amt'].includes(
      event.colDef.field,
    )
  ) {
    // 해당 행 데이터
    let rowData = event.data;

    // 각 월의 목표액 합산
    const total = cellSum(rowData);

    // 년합계(totAmt) 필드 업데이트
    event.node.setDataValue('totAmt', total);
  }
};

// row 처음 데이타 불러올때 합 구하기
function calculateInitialTotals() {
  myGrid.value.api.forEachNode(node => {
    let rowData = node.data;

    // Calculate total for all months (o00Amt ~ o12Amt)
    const total = cellSum(rowData);
    // Update the 'totAmt' field
    node.setDataValue('totAmt', total);
  });
}
// row 합 구하는 부분 끝
// *********************************

const gridOptions = {
  columnDefs: columnDefs.value,
  rowData: rowData.rows,
  defaultColDef: {
    flex: 1,
    sortable: true,
    filter: true,
    floatingFilter: false,
    editable: true,
  },

  rowSelection: 'multiple' /* 'single' or 'multiple',*/,
  enableColResize: true,
  enableSorting: true,
  enableFilter: false,
  enableRangeSelection: true,
  suppressRowClickSelection: false,
  animateRows: true,
  suppressHorizontalScroll: true,

  onFirstDataRendered: calculateInitialTotals,

  localeText: { noRowsToShow: '조회 결과가 없습니다.' },
  getRowStyle: function (param) {
    if (param.node.rowPinned) {
      return { 'font-weight': 'bold', background: $q.dark.isActive ? '#464646' : '#e6e6e6' };
    }
    return { 'text-align': 'left' };
  },
  getRowHeight: function (param) {
    // 고정된 행의 높이
    if (param.node.rowPinned) {
      return 45;
    }
    return 40;
  },
  // GRID READY 이벤트, 사이즈 자동조정
  onGridReady: function (event) {
    // console.log('Grid is ready'); // Check if grid initializes
    event.api.sizeColumnsToFit();
  },
  // 창 크기 변경 되었을 때 이벤트
  onGridSizeChanged: function (event) {
    event.api.sizeColumnsToFit();
  },
  onRowEditingStarted: function (event) {
    // console.log('never called - not doing row editing');
  },
  onRowEditingStopped: function (event) {
    // console.log('never called - not doing row editing');
  },
  onCellEditingStarted: function (event) {
    // console.log('cellEditingStarted');
  },
  onCellEditingStopped: function (event) {
    // console.log('cellEditingStopped');
  },
  onRowClicked: function (event) {
    // console.log('onRowClicked');
    // selectedRows.value = event.api.getSelectedRows();
    // console.log('sel: ', JSON.stringify(selectedRows.value));
  },
  onCellClicked: function (event) {
    // console.log('onCellClicked');
  },
  isRowSelectable: function (event) {
    // console.log('isRowSelectable');
    return true;
  },
  onSelectionChanged: function (event) {
    // console.log('onSelectionChanged1');
    selectedRows.value = event.api.getSelectedRows();
  },
  onSortChanged: function (event) {
    // console.log('onSortChanged');
  },
  pinnedBottomRowData: [calculateTotal()],
  onCellValueChanged: function (event) {
    // console.log('onCellValueChanged');
    handleCellValueChanged(event);
    handleRowSum(event); // row 합 구하기
    event.api.setPinnedBottomRowData([calculateTotal()]); // row전체 합 구하기
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
</script>

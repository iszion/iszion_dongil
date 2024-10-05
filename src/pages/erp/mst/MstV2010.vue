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
import { computed, onBeforeMount, onBeforeUnmount, onMounted, reactive, ref } from 'vue';
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
const updateData = ref([]);
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

const teamOptions = ref([]);
const columnDefs = ref([]);
const columnDefsSet = () => {
  columnDefs.value = [
    {
      headerName: '',
      field: '',
      maxWidth: 50,
      minWidth: 50,
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
      cellEditorParams: {
        maxLength: 5, // 최대 길이
      },
    },
    {
      headerName: '담당자명',
      field: 'salesNm',
      maxWidth: 150,
      minWidth: 150,
    },
    {
      headerName: '팀명',
      field: 'teamCd',
      minWidth: 150,
      maxWidth: 220,
      filter: true,
      editable: false,
      cellRenderer: CompSelectTeam,
      cellRendererParams: {
        updateSelectedValue: row => {
          handleCellValueChanged();
        },
        valueOptions: teamOptions.value,
      },
    },
    {
      headerName: '팀구호',
      field: 'explains',
      minWidth: 120,
      filter: true,
    },
    {
      headerName: '순서',
      field: 'seq',
      minWidth: 100,
      maxWidth: 100,
      filter: true,
    },
  ];
};

const selectedRows = ref([]);

const handleCellValueChanged = () => {
  updateData.value = [];
  for (let i = 0; rowDataBack.value.length > i; i++) {
    if (JSON.stringify(rowDataBack.value[i]) !== JSON.stringify(rowData.rows[i])) {
      updateData.value.push(rowData.rows[i]);
    }
  }
  // console.log('up ; ', JSON.stringify(updateData.value));
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
    const response = await api.post('/api/mst/mst2010_list', {});
    rowData.rows = response.data.data;
    rowDataBack.value = JSON.parse(JSON.stringify(response.data.data));
    updateData.value = [];
    showSaveBtn.value = false;
    myGrid.value.api.setGridOption('rowData', rowData.rows);
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
  localeText: { noRowsToShow: '조회 결과가 없습니다.' },
  getRowStyle: function (param) {
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
  onCellValueChanged: function (event) {
    // console.log('onCellValueChanged');
    handleCellValueChanged();
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

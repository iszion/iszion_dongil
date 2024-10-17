<template>
  <q-page class="q-pa-xs-xs q-pa-sm-md">
    <!-- contents zone -->
    <div class="row q-col-gutter-md">
      <!-- contents List -->
      <div class="col-12">
        <q-card bordered>
          <!-- contents list title bar -->
          <q-bar class="q-px-sm">
            <q-icon name="list_alt" />
            <span class="q-px-sm text-bold text-subtitle1" :class="$q.dark.isActive ? 'text-orange' : 'text-primary'">{{ menuLabel }}</span>
          </q-bar>
          <!--  end of contents list title bar -->
          <q-card-section>
            <div>
              <q-splitter v-model="splitterModel" horizontal :style="contentZoneStyle" @update:model-value="handelSplitterResize">
                <template v-slot:before>
                  <div ref="beforeSection">
                    <div class="row q-pb-sm">
                      <q-btn outline color="positive" dense @click="getData"><q-icon name="refresh" size="xs" class="q-mr-sm" />다시불러오기</q-btn>
                      <q-space />
                      <div class="q-gutter-xs">
                        <q-btn v-if="selectedRows.length > 0" outline color="negative" dense @click="deleteDataSection">
                          <q-icon name="delete" size="xs" /> 삭제</q-btn
                        >
                        <q-btn v-if="showSaveBtn" outline color="primary" dense @click="saveDataSection"
                          ><q-icon name="save" size="xs" /> 저장
                        </q-btn>
                        <q-btn outline color="positive" dense @click="addDataSection"><q-icon name="add" size="xs" /> 신규 </q-btn>
                      </div>
                    </div>
                    <div :style="contentGridBeforeHeight">
                      <ag-grid-vue
                        ref="myGrid"
                        style="width: 100%; height: 100%"
                        :class="$q.dark.isActive ? 'ag-theme-alpine-dark' : 'ag-theme-alpine'"
                        :grid-options="gridOptions"
                      >
                      </ag-grid-vue>
                    </div>
                  </div>
                </template>

                <template v-slot:after>
                  <div class="q-mt-md">
                    <div class="row q-pb-sm flex-center">
                      <span class="text-bold text-subtitle1"
                        ><q-icon name="style" size="sm" color="teal" /> <span class="text-orange"> {{ viewSalesNm }}</span></span
                      >
                      <q-space />
                      <div class="q-gutter-sm">
                        <!--                        <q-btn v-if="selected규Rows.length > 0" outline color="positive" dense @click="addDataSectionSub"-->
                        <!--                          ><q-icon name="add" size="xs" /> 신규-->
                        <!--                        </q-btn>-->
                        <q-btn v-if="updateDataSub.length > 0" outline color="primary" dense @click="saveDataSectionSub"
                          ><q-icon name="save" size="xs" /> 저장
                        </q-btn>
                        <q-btn v-if="selectedRowsSub.length > 0" outline color="negative" dense @click="deleteDataSectionSub">
                          <q-icon name="delete" size="xs" /> 삭제</q-btn
                        >
                      </div>
                    </div>
                    <div :style="contentGridAfterHeight">
                      <ag-grid-vue
                        ref="myGrid1"
                        style="width: 100%; height: 100%"
                        :class="$q.dark.isActive ? 'ag-theme-alpine-dark' : 'ag-theme-alpine'"
                        :grid-options="gridOptions1"
                      >
                      </ag-grid-vue>
                    </div>
                  </div>
                </template>
              </q-splitter>
            </div>
          </q-card-section>
        </q-card>
      </div>
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
import commUtil from 'src/js_comm/comm-util';
import HelpEmp from 'components/subvue/HelpEmp.vue';

const $q = useQuasar();

let isSaveFg = null;
const splitterModel = ref(60);
const beforeSection = ref(null);
const viewSalesNm = ref(null);

const dualScreenHeight = reactive({
  before: 0,
  after: 0,
});
const handelSplitterResize = () => {
  dualScreenHeight.before = (contentZoneHeight.value * splitterModel.value) / 100;
  dualScreenHeight.after = contentZoneHeight.value - dualScreenHeight.before;
  // console.log('Before : ', dualScreenHeight.before);
  // console.log('after : ', dualScreenHeight.after);
};

const contentZoneHeight = ref(500);
const handleResize = () => {
  // console.log('windows height : ', window.innerHeight);
  contentZoneHeight.value = window.innerHeight - 180;
  if (window.innerHeight <= 800) {
    splitterModel.value = 55;
  } else if (window.innerHeight <= 900) {
    splitterModel.value = 60;
  } else if (window.innerHeight <= 1090) {
    splitterModel.value = 60;
  } else if (window.innerHeight <= 1240) {
    splitterModel.value = 60;
  } else if (window.innerHeight <= 1440) {
    splitterModel.value = 60;
  } else if (window.innerHeight <= 1920) {
    splitterModel.value = 65;
  } else {
    splitterModel.value = 70;
  }
};

const contentZoneStyle = computed(() => ({
  height: `${contentZoneHeight.value}px`,
}));
const contentGridBeforeHeight = computed(() => ({
  height: `${dualScreenHeight.before - 110}px`,
}));
const contentGridAfterHeight = computed(() => ({
  height: `${dualScreenHeight.after - 65}px`,
}));

const rowData = reactive({ rows: [], rowsSub: [] });
const rowDataBack = ref([]);
const rowDataSubBack = ref([]);
const updateData = ref([]);
const updateDataSub = ref([]);
const showSaveBtn = ref(false);
const showDeleteBtn = ref(false);

const dateFormatter = params => {
  const dateStr = params.value;
  if (dateStr && dateStr.length === 8) {
    return `${dateStr.slice(0, 4)}-${dateStr.slice(4, 6)}-${dateStr.slice(6)}`;
  }
  return dateStr;
};
// 편집기에서 날짜 값을 가져올 때
const dateValueGetter = params => {
  const dateStr = params.data.changeDay;
  if (dateStr && dateStr.length === 8) {
    return `${dateStr.slice(0, 4)}-${dateStr.slice(4, 6)}-${dateStr.slice(6)}`;
  }
  return dateStr;
};

// 편집 후 데이터를 저장할 때
const dateValueSetter = params => {
  const dateStr = params.newValue.replace(/-/g, '');
  if (dateStr.length === 8) {
    params.data.changeDay = dateStr;
    return true;
  }
  return false;
};

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize);
});
onBeforeMount(() => {
  handleResize();
  handelSplitterResize();

  getDataCommOption('201').then(() => {
    columnDefsSet();
    myGrid.value.api.setColumnDefs(columnDefs.value);
    getData();
  });
});

const menuLabel = ref('');
onMounted(() => {
  window.addEventListener('resize', handleResize);
  handleResize();
  menuLabel.value = window.history.state.label;
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
      headerName: '사번',
      field: 'empCd',
      maxWidth: 100,
      minWidth: 100,
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

const columnDefsSub = ref([
  {
    headerName: '#',
    minWidth: 60,
    maxWidth: 60,
    editable: false,
    pinned: 'left',
    valueGetter: function (params) {
      return params.node.rowIndex + 1;
    },
  },
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
    headerName: '담당변경일',
    field: 'changeDay',
    maxWidth: 130,
    minWidth: 130,
    cellEditor: 'agDateStringCellEditor',
    valueFormatter: dateFormatter,
    valueGetter: dateValueGetter,
    valueSetter: dateValueSetter,
  },
  {
    headerName: '사번',
    field: 'empCd',
    maxWidth: 100,
    minWidth: 100,
    editable: false,
  },
  {
    headerName: '담당자명',
    field: 'empNm',
    minWidth: 120,
    maxWidth: 120,
    editable: false,
  },
  {
    headerName: '참조',
    field: 'explains',
    maxWidth: 130,
    minWidth: 130,
    editable: true,
  },
]);

const selectedRows = ref([]);
const selectedRowsSub = ref([]);

const handleCellValueChanged = event => {
  updateData.value = [];
  for (let i = 0; rowDataBack.value.length > i; i++) {
    if (JSON.stringify(rowDataBack.value[i]) !== JSON.stringify(rowData.rows[i])) {
      updateData.value.push(rowData.rows[i]);
    }
  }
  // console.log('up ; ', JSON.stringify(updateData.value));
  showSaveBtn.value = updateData.value.length > 0;
};

const handleCellValueChangedSub = event => {
  const rowDataItem = event.data;

  let ch = true;
  for (let i = 0; updateDataSub.value.length > i; i++) {
    if (updateDataSub.value[i].seq === rowDataItem.seq) {
      updateDataSub.value[i] = rowDataItem;
      ch = false;
    }
  }
  if (ch) {
    updateDataSub.value.push(rowDataItem);
  }
  console.log('updateSub :: ', JSON.stringify(updateDataSub.value));
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
  myGrid.value.api.setFocusedCell(addIndex, 'salesCd');
};
//****  신규 자료 추가부분 끝    ******************************//

//****  신규 변동정보 자료 추가부분     ******************************//
const addDataSectionSub = () => {
  updateDataSub.value = [];
  const addIndex = 0;
  const newItems = {
    salesCd: selectedRows.value[0].salesCd,
    oldSalesCd: selectedRows.value[0].salesCd,
    changeDay: commUtil.getToday(),
    oldChangeDay: commUtil.getToday(),
    empCd: '',
    empNm: '',
    explains: '',
    iuD: 'I',
  };
  rowData.rowsSub.splice(addIndex, 0, newItems);
  // Refresh the grid
  myGrid1.value.api.setRowData(rowData.rowsSub);
  // 첫컬럼에 focus
  myGrid1.value.api.setFocusedCell(addIndex, 'changeDay');
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

const deleteDataSectionSub = () => {
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
      for (let i = 0; i < selectedRowsSub.value.length; i++) {
        let tmpJson = '{"mode":"D","data":' + JSON.stringify(selectedRowsSub.value[i]) + '}';
        iuD.push(tmpJson);
      }
      saveDataAndHandleResultSub(jsonUtil.jsonFiller(iu, iuD));

      const selectedData = myGrid1.value.api.getSelectedRows();
      myGrid1.value.api.applyTransaction({ remove: selectedData });
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

const saveDataSectionSub = () => {
  let iu = [];
  let iuD = [];
  // 신규 추가 부분
  for (let i = 0; i < rowData.rowsSub.length; i++) {
    if (!isEmpty(rowData.rowsSub[i].salesCd)) {
      if (rowData.rowsSub[i].iuD === 'I') {
        let tmpJson = '{"mode": "' + rowData.rowsSub[i].iuD + '","data":' + JSON.stringify(rowData.rowsSub[i]) + '}';
        iu.push(tmpJson);
      }
    }
  }
  // 자료 수정 부분
  for (let i = 0; i < updateDataSub.value.length; i++) {
    if (!isEmpty(updateDataSub.value[i].salesCd)) {
      if (updateDataSub.value[i].iuD === 'U') {
        let tmpJson = '{"mode": "' + updateDataSub.value[i].iuD + '","data":' + JSON.stringify(updateDataSub.value[i]) + '}';
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
    saveDataAndHandleResultSub(jsonUtil.jsonFiller(iu, iuD));
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

// ***** 사용자정보 선택된 자료 가져오기 부분  *****************************//
const getDataSub = async resSalesCd => {
  try {
    const response = await api.post('/api/mst/mst2010_sub_list', {
      paramSalesCd: resSalesCd,
    });
    rowData.rowsSub = response.data.data;
    rowDataSubBack.value = JSON.parse(JSON.stringify(response.data.data));
    myGrid1.value.api.setGridOption('rowData', rowData.rowsSub);
    updateData.value = [];
    selectedRowsSub.value = [];
  } catch (error) {
    console.error('Error fetching users:', error);
  }
};
// ***** 사용자정보 선택된 자료 가져오기 부분  *****************************//

// ***** 영업담당정보 저장하기 부분  **************************//
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
// ***** 영업담당변경정보 저장하기 부분  **************************//
const saveDataAndHandleResultSub = resFormData => {
  api
    .post('/api/mst/mst2010_sub_save', resFormData)
    .then(res => {
      let saveStatus = {};
      saveStatus.rtn = res.data.rtn;
      saveStatus.rtnMsg = res.data.rtnMsg;
      notifySave.notifyView(saveStatus);

      updateDataSub.value = [];
      getDataSub(selectedRows.value[0].salesCd);
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
  enableColResize: false,
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
    selectedRows.value = event.api.getSelectedRows();
    if (selectedRows.value.length === 1) {
      getDataSub(selectedRows.value[0].salesCd);
      viewSalesNm.value = selectedRows.value[0].salesNm;
    }
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
    const { data, colDef, newValue, oldValue } = event;
    if (colDef.field === 'empCd') {
      helpValue.empCd = newValue;
      openHelpEmpDialog(true);
    }
    // console.log('row : ', JSON.stringify(rowData.rowsSub));
    handleCellValueChanged(event);
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

const myGrid1 = ref(null);
const gridOptions1 = {
  columnDefs: columnDefsSub.value,
  rowData: rowData.rowsSub,
  defaultColDef: {
    flex: 1,
    sortable: true,
    filter: true,
    floatingFilter: false,
    editable: true,
  },

  rowSelection: 'multiple' /* 'single' or 'multiple',*/,
  enableColResize: false,
  enableSorting: true,
  enableFilter: false,
  enableRangeSelection: true,
  suppressRowClickSelection: true, // row 선택해도 check박스 체크안되게 하려면 true
  animateRows: true,
  suppressHorizontalScroll: true,

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
    selectedRowsSub.value = event.api.getSelectedRows();
  },
  onSortChanged: function (event) {
    // console.log('onSortChanged');
  },
  pinnedBottomRowData: null,
  onCellValueChanged: function (event) {
    // console.log('onCellValueChanged');
    // const { data, colDef, newValue, oldValue } = event;
    // console.log('row : ', JSON.stringify(data));
    handleCellValueChangedSub(event);
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

// **************************************************************//
// ***** Dialog Help 연결부분  ************************************//
// **************************************************************//
const helpValue = reactive({
  empCd: '',
  empNm: '',
});
const openHelpEmpDialog = status => {
  if (status) {
    $q.dialog({
      component: HelpEmp,
      componentProps: {
        paramEmpNm: helpValue.empCd,
        paramCloseDay: '99991231',
      },
    })
      .onOk(res => {
        console.log('res ::: ', res.empCd, res.empNm);
        const selectedData = myGrid.value.api.getSelectedRows();
        selectedData[0].empCd = res.empCd;
        selectedData[0].salesNm = res.empNm;
        console.log('res : ', JSON.stringify(selectedData));

        myGrid.value.api.applyTransaction({
          update: selectedData,
        });
      })
      .onCancel(() => {
        console.log('Cancel');
      })
      .onDismiss(() => {
        console.log('Called on OK or Cancel');
      });
  } else {
  }
};
</script>

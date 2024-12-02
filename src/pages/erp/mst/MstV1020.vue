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
        <div v-show="isScreenShow" class="col-xs-12 col-lg-3">
          <q-card bordered>
            <!-- contents list title bar -->
            <q-bar class="q-px-sm">
              <q-icon name="list_alt" />
              <span class="text-subtitle2 q-px-sm">진행자 선택</span>
              <q-space />
            </q-bar>
            <!--  end of contents list title bar -->
            <q-card-actions class="q-pa-none">
              <q-toolbar class="row">
                <div class="row q-col-gutter-md">
                  <q-select
                    stack-label
                    options-dense
                    class="q-px-md"
                    label-color="orange"
                    v-model="selectedDept"
                    :options="deptOptions"
                    option-value="commCd"
                    option-label="commNm"
                    option-disable="inactive"
                    emit-value
                    map-options
                    style="min-width: 150px; max-width: 150px"
                    label="소속팀"
                    @update:model-value="getDataEmp"
                  />
                </div>
              </q-toolbar>
            </q-card-actions>

            <q-separator size="3px" />

            <q-card-section class="q-pa-xs">
              <div :style="contentZoneStyle">
                <ag-grid-vue
                  ref="myGrid1"
                  style="width: 100%; height: 100%"
                  :class="$q.dark.isActive ? 'ag-theme-alpine-dark' : 'ag-theme-alpine'"
                  :grid-options="gridOptionsEmp"
                >
                </ag-grid-vue>
              </div>
            </q-card-section>
          </q-card>
        </div>
        <!--  end of contents list -->
        <!-- contents List -->
        <div :class="!isScreenShow ? 'col-xs-12' : 'col-xs-12 col-lg-9'">
          <q-card bordered>
            <!-- contents list title bar -->
            <q-bar class="q-px-sm">
              <q-btn
                padding="none"
                size="md"
                round
                color="deep-orange"
                :icon="isScreenShow ? 'navigate_before' : 'navigate_next'"
                class="cursor-pointer q-mx-sm"
                @click="isScreenShow = !isScreenShow"
              />
              <q-icon name="list_alt" />
              <span class="text-subtitle2 q-px-sm">평가대상자 선택</span>
            </q-bar>
            <!--  end of contents list title bar -->
            <q-card-actions class="q-pa-none">
              <q-toolbar class="row">
                <div class="row col-12">
                  <q-select
                    stack-label
                    options-dense
                    class="q-px-md"
                    label-color="orange"
                    v-model="selectedLineCd"
                    :options="lineOptions"
                    option-value="commCd"
                    option-label="commNm"
                    option-disable="inactive"
                    emit-value
                    map-options
                    style="min-width: 120px; max-width: 150px"
                    label="결재유형"
                    @update:model-value="getData"
                  />
                  <q-select
                    stack-label
                    options-dense
                    class="q-px-md q-mr-xs"
                    label-color="orange"
                    v-model="selectedEmpCd"
                    :options="empOptions"
                    option-value="empCd"
                    option-label="empNm"
                    option-disable="inactive"
                    emit-value
                    map-options
                    style="min-width: 300px; max-width: 300px"
                    label="결재담당자선택"
                    @update:model-value="getData"
                  >
                    <template v-slot:option="{ itemProps, opt, selected, toggleOption }">
                      <q-item v-bind="itemProps">
                        <q-item-section>
                          <q-item-label v-html="opt.empNm" />
                        </q-item-section>
                        <q-item-section>
                          <q-item-label v-html="opt.deptNm" />
                        </q-item-section>
                        <q-item-section side>
                          <q-toggle :model-value="selected" @update:model-value="toggleOption(opt)" />
                        </q-item-section>
                      </q-item>
                    </template>
                  </q-select>

                  <q-space />
                  <div class="q-gutter-xs q-pa-xs flex flex-center">
                    <div class="q-gutter-xs">
                      <q-btn v-if="selectedEmpCd && rowData.rows.length < 5" outline color="positive" dense @click="addDataSection"
                        ><q-icon name="add" size="xs" /> 신규
                      </q-btn>
                      <q-btn v-if="showSaveBtn || selectedRows.length > 0" outline color="primary" dense @click="saveDataSection"
                        ><q-icon name="save" size="xs" /> 저장
                      </q-btn>
                    </div>
                  </div>
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
import jsonUtil from 'src/js_comm/json-util';
import notifySave from 'src/js_comm/notify-save';
import CompSelectEmpS from 'components/CompSelectEmpApp.vue';
import CompSelectEmpC1 from 'components/CompSelectEmpC1.vue';
import CompSelectEmpC2 from 'components/CompSelectEmpC2.vue';
import CompSelectEmpC3 from 'components/CompSelectEmpC3.vue';
import CompToggleUse from 'components/CompToggleUse.vue';
import CompTogglePass from 'components/CompTogglePass.vue';

const $q = useQuasar();

const isScreenShow = ref(false);

const contentZoneHeight = ref(500);
const contentZoneStyle = computed(() => ({
  height: `${contentZoneHeight.value}px`,
}));

const rowData = reactive({ rows: [] });
const rowDataEmp = reactive({ rows: [] });
const rowDataBack = ref([]);

const updateData = ref([]);
const showSaveBtn = ref(false);

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize);
});
onBeforeMount(() => {
  getDataCommOption('701'); // 결재유형
  getDataCommOption('501'); // 부서

  getDataEmp().then(() => {
    columnDefsSet();
    myGrid.value.api.setColumnDefs(columnDefs.value);
    getData();
  });
});

const menuLabel = ref('');
onMounted(() => {
  window.addEventListener('resize', handleResize);
  menuLabel.value = window.history.state.label;
  handleResize();
});

const columnDefsEmp = reactive({
  columns: [
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
      headerName: '소속팀',
      field: 'deptNm',
      minWidth: 140,
    },
    {
      headerName: '직위',
      field: 'pstnNm',
      minWidth: 80,
    },
  ],
});
const paramEmpOptions = ref([]);
const columnDefs = ref([]);

const columnDefsSet = () => {
  columnDefs.value = [
    {
      sortable: false,
      filter: false,
      editable: false,
      minWidth: 60,
      maxWidth: 60,
      cellStyle: { textAlign: 'center' },
      checkboxSelection: true,
      headerCheckboxSelection: true,
      headerCheckboxSelectionFilteredOnly: true,
    },
    {
      headerName: '순서',
      field: 'lineSeq',
      cellEditor: 'agNumberCellEditor',
      cellEditorParams: {
        precision: 2,
        step: 1,
        min: 0,
        max: 4,
        showStepperButtons: true,
      },
      editable: true,
      filter: false,
      minWidth: 60,
      maxWidth: 60,
      cellStyle: { textAlign: 'center' },
      valueSetter: params => {
        // 값이 5보다 큰지 검사
        if (params.newValue > 4) {
          // 5보다 크면 값을 설정하지 않음
          alert('4보다 큰 값은 입력할 수 없습니다.');
          return false; // 값 변경을 막음
        } else {
          // 유효한 값이면 값을 설정
          params.data.lineSeq = params.newValue;
          return true; // 값 변경 허용
        }
      },
      onCellValueChanged: params => {
        const newValue = params.newValue;
        let isDuplicate = false;

        // 그리드의 모든 노드(행)를 반복합니다.
        params.api.forEachNode(node => {
          // 거짓 양성을 피하기 위해 현재 노드(편집 중인 노드)를 건너뜁니다.
          if (node.rowIndex !== params.node.rowIndex && node.data.lineSeq === newValue) {
            isDuplicate = true;
          }
        });

        if (isDuplicate) {
          alert('중복번호가 있습니다. 같은 번호가 있을경우 저장이 되지 않습니다.');
          params.node.setDataValue('lineSeq', params.oldValue);
        }
      },
    },
    {
      headerName: '결재자',
      field: 'empCdApp',
      minWidth: 130,
      maxWidth: 150,
      filter: false,
      editable: false,
      cellRenderer: CompSelectEmpS,
      cellRendererParams: {
        updateSelectedValue: row => {
          // console.log('row : ', JSON.stringify(row.value));
          handleCellValueChanged(row.value);
        },
        valueOptions: paramEmpOptions.value,
      },
    },

    {
      headerName: '참조1',
      field: 'empCdC1',
      minWidth: 130,
      maxWidth: 150,
      filter: false,
      editable: false,
      cellRenderer: CompSelectEmpC1,
      cellRendererParams: {
        updateSelectedValue: row => {
          handleCellValueChanged(row.value);
        },
        valueOptions: paramEmpOptions.value,
      },
    },

    {
      headerName: '참조2',
      field: 'empCdC2',
      minWidth: 130,
      maxWidth: 150,
      filter: false,
      editable: false,
      cellRenderer: CompSelectEmpC2,
      cellRendererParams: {
        updateSelectedValue: row => {
          handleCellValueChanged(row.value);
        },
        valueOptions: paramEmpOptions.value,
      },
    },

    {
      headerName: '참조3',
      field: 'empCdC3',
      minWidth: 130,
      maxWidth: 150,
      filter: false,
      editable: false,
      cellRenderer: CompSelectEmpC3,
      cellRendererParams: {
        updateSelectedValue: row => {
          handleCellValueChanged(row.value);
        },
        valueOptions: paramEmpOptions.value,
      },
    },
    {
      headerName: '사용',
      field: 'useYn',
      minWidth: 90,
      maxWidth: 90,
      filter: false,
      editable: false,
      cellRenderer: CompToggleUse,
      cellRendererParams: {
        updateSelectedValue: row => {
          handleCellValueChanged(row.value);
        },
      },
    },
    {
      headerName: '전결',
      field: 'passYn',
      minWidth: 90,
      maxWidth: 90,
      filter: false,
      editable: false,
      cellRenderer: CompTogglePass,
      cellRendererParams: {
        updateSelectedValue: row => {
          handleCellValueChanged(row.value);
        },
      },
    },
  ];
};

//****  신규 자료 추가부분     ******************************//
const addIndex = ref(0);
const maxSeq = ref(0);
const addDataSection = () => {
  addIndex.value = maxSeq.value;
  const newItems = {
    lineCd: selectedLineCd.value,
    empCd: selectedEmpCd.value,
    empCdApp: '',
    lineSeq: maxSeq.value++,
    empCdC1: '',
    empCdC2: '',
    empCdC3: '',
    passYn: 'N',
    useYn: 'Y',
    iuD: 'I',
  };
  rowData.rows.splice(addIndex.value, 0, newItems);
  // Refresh the grid
  myGrid.value.api.setGridOption('rowData', rowData.rows);
  // 첫컬럼에 focus
  myGrid.value.api.setFocusedCell(addIndex.value, 'empCdApp');
  myGrid.value.api.refreshCells({ force: true });
};
//****  신규 자료 추가부분 끝    ******************************//

const handleCellValueChanged = resData => {
  // console.log('rowDataItem : ', JSON.stringify(resData));

  let ch = true;
  for (let i = 0; updateData.value.length > i; i++) {
    if (updateData.value[i].lineSeq === resData.lineSeq) {
      updateData.value[i] = resData;
      ch = false;
    }
  }
  if (ch) {
    updateData.value.push(resData);
  }
  // console.log('update : ', JSON.stringify(updateData.value));
  showSaveBtn.value = updateData.value.length > 0;
};

const selectedRows = ref([]);
const selectedRowsEmp = ref([]);

const saveDataSection = () => {
  let iu = [];
  let iuD = [];

  for (let i = 0; i < rowDataBack.value.length; i++) {
    let tmpJson = '{"mode": "D","data":' + JSON.stringify(rowDataBack.value[i]) + '}';
    iuD.push(tmpJson);
  }

  for (let i = 0; i < rowData.rows.length; i++) {
    const useCh = selectedRows.value.find(val => val.rowNum === rowData.rows[i].rowNum);
    if (!useCh) {
      let tmpJson = '{"mode": "I","data":' + JSON.stringify(rowData.rows[i]) + '}';
      iu.push(tmpJson);
    }
  }

  // console.log('row Del : ', JSON.stringify(iuD));
  // console.log('row Ins : ', JSON.stringify(iu));
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
const myGrid = ref(null);
const myGrid1 = ref(null);

const empOptions = ref([]);
const selectedEmpCd = ref(null);
// ***** 사용자정보 목록 자료 가져오기 부분  *****************************//
const getDataEmp = async () => {
  try {
    const response = await api.post('/api/mst/mst1020_emp_list', {
      paramDeptCd: selectedDept.value,
    });
    rowDataEmp.rows = response.data.data;
    myGrid1.value.api.setGridOption('rowData', rowDataEmp.rows); // this should trigger the grid to reload data

    empOptions.value = response.data.data;
    paramEmpOptions.value = JSON.parse(JSON.stringify(response.data.data));
    empOptions.value.unshift({ empCd: null, empNm: '결재담당 선택하세요' });
    paramEmpOptions.value.unshift({ empCd: null, empNm: '사용안함' });
  } catch (error) {
    console.error('Error fetching users:', error);
  }
};
const getData = async () => {
  try {
    const response = await api.post('/api/mst/mst1020_list', {
      paramLineCd: selectedLineCd.value,
      paramEmpCd: selectedEmpCd.value,
    });
    rowData.rows = response.data.data;
    rowDataBack.value = JSON.parse(JSON.stringify(response.data.data));
    maxSeq.value = rowData.rows.length;
    if (myGrid.value && myGrid.value.api) {
      myGrid.value.api.setGridOption('rowData', rowData.rows); // this should trigger the grid to reload data
    }

    updateData.value = [];
  } catch (error) {
    console.error('Error fetching users:', error);
  }
};

// ***** 자료저장 및 삭제 처리부분 *****************************//
const saveDataAndHandleResult = resFormData => {
  api
    .post('/api/mst/mst1020_save', resFormData)
    .then(res => {
      showSaveBtn.value = false;
      let saveStatus = {};
      saveStatus.rtn = res.data.rtn;
      saveStatus.rtnMsg = res.data.rtnMsg;
      notifySave.notifyView(saveStatus);

      getData();
    })
    .catch(error => {
      showSaveBtn.value = false;
      let saveStatus = {};
      saveStatus.rtn = '3';
      saveStatus.rtnMsg = '키 중복 또는 그외 error 저장실패';
      notifySave.notifyView(saveStatus);

      getData();
    });
};

// ***** DataBase 기준정보 가져오기 부분 *****************************//

const lineOptions = ref([]);
const deptOptions = ref([]);

const selectedLineCd = ref(null);
const selectedDept = ref('');

// ***** 공통코드정보 가져오기 부분  *****************************//
async function getDataCommOption(resCommCd1) {
  try {
    const response = await api.post('/api/mst/comm_option_list', { paramCommCd1: resCommCd1 });
    switch (resCommCd1) {
      case '701':
        lineOptions.value = response.data.data;
        if (!selectedLineCd.value) {
          selectedLineCd.value = lineOptions.value[0].commCd;
        }
        break;
      case '501':
        deptOptions.value = response.data.data;
        // deptOptionsSearch.value = JSON.parse(JSON.stringify(deptOptions.value));
        deptOptions.value.unshift({ commCd: '', commNm: '전체' });
        break;
      default:
        deptOptions.value = [];
        lineOptions.value = [];
    }
  } catch (error) {
    console.error('Error fetching users:', error);
  }
}

// **************************************************************//
// ***** DataBase 연결부분 끝  *************************************//
// **************************************************************//

const gridOptionsEmp = {
  columnDefs: columnDefsEmp.columns,
  rowData: rowDataEmp.rows,
  defaultColDef: {
    flex: 1,
    sortable: true,
    filter: false,
    floatingFilter: false,
    editable: false,
  },
  rowSelection: 'single' /* 'single' or 'multiple',*/,
  enableColResize: false,
  enableSorting: true,
  enableFilter: false,
  enableRangeSelection: true,
  suppressRowClickSelection: true,
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
    // event.api.sizeColumnsToFit();
  },
  // 창 크기 변경 되었을 때 이벤트
  onGridSizeChanged: function (event) {
    // event.api.sizeColumnsToFit();
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
    // console.log('onRowClicked : ', JSON.stringify(event.data));
    selectedEmpCd.value = event.data.empCd;
    getData();
  },
  onCellClicked: function (event) {
    // console.log('onCellClicked');
  },
  isRowSelectable: function (event) {
    // console.log('isRowSelectable');
    return true;
  },
  onSelectionChanged: function (event) {
    // console.log('onSelectionChanged');
    selectedRowsEmp.value = event.api.getSelectedRows();
  },
  onSortChanged: function (event) {
    // console.log('onSortChanged');
  },
  onCellValueChanged: function (event) {
    // console.log('onCellValueChanged');
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

const gridOptions = {
  columnDefs: columnDefs.value,
  rowData: rowData.rows,
  defaultColDef: {
    flex: 1,
    sortable: true,
    filter: false,
    floatingFilter: false,
    editable: true,
  },
  rowSelection: 'multiple' /* 'single' or 'multiple',*/,
  enableColResize: false,
  enableSorting: true,
  enableFilter: false,
  enableRangeSelection: true,
  suppressRowClickSelection: true,
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
    handleCellValueChanged(event.data);

    // const rowDataItem = event.data;

    // let ch = true;
    // for (let i = 0; updateData.value.length > i; i++) {
    //   if (updateData.value[i].seq === rowDataItem.seq) {
    //     updateData.value[i] = rowDataItem;
    //     ch = false;
    //   }
    // }
    // if (ch) {
    //   updateData.value.push(rowDataItem);
    // }
    // console.log('updateSub :: ', JSON.stringify(updateData.value));
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

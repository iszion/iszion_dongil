<template>
  <q-page class="q-pa-xs-xs q-pa-sm-md" :style-fn="myTweak">
    <q-card class="q-pa-sm">
      <q-card-section class="text-center q-pa-sm q-mb-sm" :class="$q.dark.isActive ? 'bg-teal-7' : 'bg-teal-3'">
        <q-item-label class="text-h6">역량평가 현황 </q-item-label>
      </q-card-section>

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

              <q-btn :disable="rowData.rows.length === 0" outline color="teal" @click="isDialogVisible = true" class="q-px-sm">
                <q-icon name="download" size="xs" class="q-mr-xs" />
                엑셀/출력
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
    <q-dialog persistent full-height full-width v-model="isDialogVisible">
      <q-card class="q-pa-none q-ma-none">
        <q-card-section class="q-pa-none q-ma-none">
          <hrt-v2030p :rowData="rowData.rows" @close="handleClose" />
        </q-card-section>
      </q-card>
    </q-dialog>
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
import { QBtn, QIcon, QToggle, SessionStorage, useQuasar } from 'quasar';
import { useYearInfoStore } from 'src/store/setYearInfo';
import HrtV2030p from 'pages/erp/hrt/HrtV2030p.vue';

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
      headerName: '성명',
      field: 'empNm',
      minWidth: 90,
      resizable: true,
      cellStyle: params => {
        return getStatusMessageStyle(params.data);
      },
    },

    {
      headerName: '1차환산점수',
      field: 'ch1MarkPointX',
      minWidth: 100,
      cellStyle: params => {
        return getStatusMessageStyle(params.data);
      },
    },
    {
      headerName: '2차환산점수',
      field: 'ch2MarkPointX',
      minWidth: 100,
      cellStyle: params => {
        return getStatusMessageStyle(params.data);
      },
    },
    {
      headerName: '평균점수',
      field: 'avgMarkPointX',
      minWidth: 100,
      cellStyle: params => {
        return getStatusMessageStyle(params.data);
      },
    },
  ],
});

const getStatusMessageStyle = val => {
  // console.log(val);
  // if (data.statusMessage === '평가마감') {
  //   return $q.dark.isActive ? { color: 'red' } : { color: 'red' };
  // } else if (data.statusMessage === '평가중') {
  //   return $q.dark.isActive ? { color: 'teal' } : { color: 'teal' };
  // } else if (data.statusMessage === '평가완료') {
  //   return $q.dark.isActive ? { color: 'orange' } : { color: 'blue' };
  // } else {
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

onMounted(() => {
  // console.log('onMounted....');
  window.addEventListener('resize', handleResize);
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
    const response = await api.post('/api/hrt/hrt2030_list', {
      paramSetYear: storeYear.setYear,
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
      const maxHeight = contentZoneHeight.value - 165;
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
    console.log('node : ', param);
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
    return 25;
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
    console.log('sel: ', JSON.stringify(selectedRows.value));
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

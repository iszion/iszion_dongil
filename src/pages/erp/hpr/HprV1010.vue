<template>
  <q-page class="q-pa-xs-xs q-pa-sm-md" :style-fn="myTweak">
    <q-card>
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
                v-model="searchParam.pYear"
                :options="optionsDate.year"
                label="년"
                label-color="orange"
                emit-value
                map-options
                options-dense
                style="width: 100px"
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
import { computed, onBeforeMount, onBeforeUnmount, onMounted, reactive, ref } from 'vue';
import { api } from '/src/boot/axios';

import commUtil from 'src/js_comm/comm-util';

import { useYearInfoStore } from 'src/store/setYearInfo';

const storeYear = useYearInfoStore();

const $q = useQuasar();

let isSaveFg = null;

const searchParam = reactive({
  pYear: 0,
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
  changeHeaderName();

  optionYearReset();
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

const changeHeaderName = () => {
  columnDefs.columns = columnDefs.columns.map(colDef => {
    if (colDef.field === 'year4') {
      return { ...colDef, headerName: searchParam.pYear - 4 + '년' };
    }
    if (colDef.field === 'year3') {
      return { ...colDef, headerName: searchParam.pYear - 3 + '년' };
    }
    if (colDef.field === 'year2') {
      return { ...colDef, headerName: searchParam.pYear - 2 + '년' };
    }
    if (colDef.field === 'year1') {
      return { ...colDef, headerName: searchParam.pYear - 1 + '년' };
    }
    if (colDef.field === 'year0') {
      return { ...colDef, headerName: searchParam.pYear + '년' };
    }

    return colDef;
  });
  if (gridApi.value) {
    gridApi.value.setColumnDefs(columnDefs.value);
  }
};

const columnDefs = reactive({
  columns: [
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
      headerName: '-4년',
      field: 'year4',
      minWidth: 120,
      maxWidth: 120,
      filter: true,
      editable: false,
    },
    {
      headerName: '-3년',
      field: 'year3',
      minWidth: 120,
      maxWidth: 120,
      filter: true,
      editable: false,
    },
    {
      headerName: '-2년',
      field: 'year2',
      minWidth: 120,
      maxWidth: 120,
      filter: true,
      editable: false,
    },
    {
      headerName: '-1년',
      field: 'year1',
      minWidth: 120,
      maxWidth: 120,
      filter: true,
      editable: false,
    },
    {
      headerName: '0년',
      field: 'year0',
      minWidth: 120,
      maxWidth: 120,
      filter: true,
      editable: false,
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
};

const showSaveBtn = ref(false);
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
const getData = async () => {
  changeHeaderName();
  try {
    const response = await api.post('/api/hpr/hpr1010_list', {
      paramSetYear: searchParam.pYear,
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

const optionsDate = ref({
  year: [],
  month: [],
  day: [],
});
const optionYearReset = () => {
  optionsDate.value.year = Array.from({ length: 11 }, (_, i) => {
    const year = new Date().getFullYear() - 10 + i;
    return { label: year.toString() + '년', value: year };
  });
};
</script>

<style lang="sass" scoped></style>

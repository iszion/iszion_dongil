<template>
  <q-page class="q-pa-xs" :style-fn="myTweak">
    <!-- contents zone -->
    <div class="row q-pa-sm q-col-gutter-md">
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
                <q-btn v-if="showDeleteBtn" outline color="negative" dense @click="deleteDataSection"> <q-icon name="delete" size="xs" /> 삭제</q-btn>
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
import authHeader from 'boot/authHeader';
import { isEmpty } from 'lodash';
import jsonUtil from 'src/js_comm/json-util';
import notifySave from 'src/js_comm/notify-save';
import CompSelectDepg from 'components/CompSelectDepg.vue';

const $q = useQuasar();

let isSaveFg = null;

const contentZoneHeight = ref(500);
const contentZoneStyle = computed(() => ({
  height: `${contentZoneHeight.value}px`,
}));

const gridApi = ref(null);
const rowData = reactive({ rows: [] });
const rowDataBack = ref([]);
const updateData = ref([]);
const showSaveBtn = ref(false);
const showDeleteBtn = ref(false);

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize);
});
const props = defineProps(['setStdYearGroup']);
onBeforeMount(() => {
  rowSelection.value = 'multiple';
  getData();
});

onMounted(() => {
  console.log('setYear::::==: ', props.setStdYearGroup.setStdYear);
  console.log('setYear::::==: ', props.setStdYearGroup.setStdFg);
  console.log('setYear::::==: ', props.setStdYearGroup.setLocCh);
  window.addEventListener('resize', handleResize);
  handleResize();
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
    },
    {
      headerName: '코드',
      field: 'deptCd',
      maxWidth: 80,
      minWidth: 80,
      cellEditorParams: {
        maxLength: 5, // 최대 길이
      },
    },
    {
      headerName: '항목명',
      field: 'deptNm',
      maxWidth: 150,
      minWidth: 150,
    },
    {
      headerName: '소속분류',
      field: 'depgCd',
      minWidth: 120,
      maxWidth: 120,
      filter: true,
      editable: false,
      cellRenderer: CompSelectDepg,
      cellRendererParams: {
        updateSelectedValue: row => {
          onCellValueChanged();
        },
      },
    },
    {
      headerName: '처리순서',
      field: 'seq',
      maxWidth: 100,
      minWidth: 100,
      cellEditor: 'agNumberCellEditor',
      cellEditorParams: {
        precision: 2,
        step: 1,
        showStepperButtons: true,
      },
    },
  ],
});

const selectedRows = ref();

const onSelectionChanged = event => {
  selectedRows.value = event.api.getSelectedRows();

  if (selectedRows.value.length === 1) {
    showDeleteBtn.value = true;
    showSaveBtn.value = true;
  } else if (selectedRows.value.length > 1) {
    isSaveFg = 'D';
    showDeleteBtn.value = true;
    showSaveBtn.value = false;
  } else {
    isSaveFg = '';
    showDeleteBtn.value = false;
  }
};

const onCellValueChanged = () => {
  updateData.value = [];
  for (let i = 0; rowDataBack.value.length > i; i++) {
    if (JSON.stringify(rowDataBack.value[i]) !== JSON.stringify(rowData.rows[i])) {
      if (rowData.rows[i].iuD === 'U') {
        updateData.value.push(rowData.rows[i]);
      }
    }
  }

  if (updateData.value.length > 0) {
    showSaveBtn.value = true;
  }
};

const rowSelection = ref(null);

//*******************************************************//
//****  신규 자료 추가부분     ******************************//
const addDataSection = () => {
  showSaveBtn.value = true;
  updateData.value = [];
  const addIndex = 0;
  const newItems = {
    stdYear: '2024',
    deptCd: '',
    oldDeptCd: '',
    deptNm: '',
    depgNm: '',
    depgCd: '1011001',
    seq: rowData.rows.length + 1,
    iuD: 'I',
  };
  rowData.rows.splice(addIndex, 0, newItems);
  // Refresh the grid
  gridApi.value.setRowData(rowData.rows);
  // 첫컬럼에 focus
  gridApi.value.setFocusedCell(addIndex, 'deptCd');
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

      const selectedData = gridApi.value.getSelectedRows();
      gridApi.value.applyTransaction({ remove: selectedData });
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
    if (!isEmpty(rowData.rows[i].deptCd)) {
      if (rowData.rows[i].iuD === 'I') {
        let tmpJson = '{"mode": "' + rowData.rows[i].iuD + '","data":' + JSON.stringify(rowData.rows[i]) + '}';
        iu.push(tmpJson);
      }
    }
  }
  // 자료 수정 부분
  for (let i = 0; i < updateData.value.length; i++) {
    if (!isEmpty(updateData.value[i].deptCd)) {
      if (updateData.value[i].iuD === 'U') {
        let tmpJson = '{"mode": "' + updateData.value[i].iuD + '","data":' + JSON.stringify(updateData.value[i]) + '}';
        iu.push(tmpJson);
      }
    }
  }
  console.log('iu ::: ', JSON.stringify(iu));
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

// ***** 소속팀정보 가저오기 부분  **************************//
const getData = async () => {
  try {
    const response = await api.post('/api/mst/mst2020_list', { paramSetYear: '2024' }, { headers: authHeader() });
    rowData.rows = response.data.data;
    rowDataBack.value = JSON.parse(JSON.stringify(response.data.data));
    updateData.value = [];
  } catch (error) {
    console.error('Error fetching users:', error);
  }
};

// ***** 소속팀정보 저장하기 부분  **************************//
const saveDataAndHandleResult = resFormData => {
  api
    .post('/api/mst/mst2020_save', resFormData, { headers: authHeader() })
    .then(res => {
      let saveStatus = {};
      if (res.data.rtn === '0') {
        saveStatus.rtn = 1;
        saveStatus.rtn1 = res.data.rtnMsg1;
        saveStatus.rtn2 = '자료저장 완료';
      } else {
        saveStatus.rtn = res.data.rtn;
        saveStatus.rtn1 = res.data.rtnMsg1;
        saveStatus.rtn2 = res.data.rtnMsg2;
      }
      showSaveBtn.value = false;
      notifySave.notifyView(saveStatus);
    })
    .catch(error => {
      console.log('error: ', error);
    });
};

// **************************************************************//
// ***** DataBase 연결부분 끝  *************************************//
// **************************************************************//
</script>

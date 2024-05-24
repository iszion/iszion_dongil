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
            <span class="text-subtitle2 q-px-sm">권한정보 조정관리</span>
          </q-bar>
          <!--  end of contents list title bar -->
          <q-card-actions align="right" class="q-pa-none">
            <q-toolbar class="row">
              <q-select
                dense
                stack-label
                options-dense
                class="q-pb-sm q-pl-sm q-mr-lg"
                label-color="orange"
                v-model="selectedDept"
                :options="deptOptions"
                option-value="deptCd"
                option-label="deptNm"
                option-disable="inactive"
                emit-value
                map-options
                style="min-width: 150px; max-width: 150px"
                label="소속팀"
                @update:model-value="getData"
              />
              <q-input
                stack-label
                bottom-slots
                label-color="orange"
                v-model="searchValue"
                label="ID/성명"
                dense
                class="q-pb-sm q-pl-sm q-mr-lg"
                style="max-width: 120px"
                @keyup.enter="getData"
              >
                <template v-slot:append>
                  <q-icon size="xs" v-if="searchValue !== ''" name="close" @click="searchValue = ''" class="cursor-pointer q-mt-sm" />
                  <q-icon name="search" size="xs" class="q-mt-sm cursor-pointer" @click="getData" />
                </template>
              </q-input>
              <q-btn outline color="positive" dense @click="getData"><q-icon class="q-mr-sm" name="refresh" size="xs" />다시 불러오기</q-btn>
              <q-space />
              <div class="q-gutter-xs">
                <q-btn v-if="showSaveBtn" outline color="primary" dense @click="saveDataSection"><q-icon name="save" size="xs" /> 저장 </q-btn>
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
  <!-- ***************** -->
  <!-- 프로그램 권한주기 화면 -->
  <!-- ***************** -->
  <q-dialog persistent v-model="isDialogVisible">
    <q-card flat bordered style="max-width: 1050px; width: 100%">
      <q-bar>
        <q-icon name="list_alt" />
        <div>프로그램 권한조정 관리</div>
        <q-space />
        <span class="text-bold text-subtitle1"> [ {{ showDialogTitle.userId }} ] {{ showDialogTitle.userNm }}</span>
        <q-space />
        <q-btn dense flat icon="close" v-close-popup>
          <q-tooltip> 닫기 </q-tooltip>
        </q-btn>
      </q-bar>
      <q-card-actions>
        <q-toolbar class="q-px-sm q-py-none">
          <q-select
            dense
            options-dense
            class="q-pb-sm q-pl-sm q-mr-lg"
            label-color="orange"
            v-model="selectedGroup"
            :options="groupOptions"
            option-value="groupCd"
            option-label="groupNm"
            option-disable="inactive"
            emit-value
            map-options
            style="min-width: 150px; max-width: 150px"
            label="그룹선택"
            @update:model-value="getDataDialog"
          />
          <q-btn dense outline class="q-px-md" color="teal" @:click="getDataDialog()"
            ><q-icon name="refresh" size="xs" class="q-pr-sm-sm" /><span v-if="$q.screen.gt.sm">다시불러오기</span></q-btn
          >
          <q-space />
          <q-btn v-if="showSaveDialogBtn" outline dense color="primary" @click="saveDataDialogSection" v-close-popup class="q-px-sm q-mr-sm"
            ><q-icon class="q-mr-xs" name="save" size="xs" /> 권한 적용하기
          </q-btn>
          <q-btn outline dense color="primary" v-close-popup class="q-px-sm"><q-icon class="q-mr-xs" name="close" size="xs" /> 닫기 </q-btn>
        </q-toolbar>
      </q-card-actions>
      <q-card-section class="q-px-md q-pt-none">
        <div :style="contentZoneStyle">
          <ag-grid-vue
            ref="myGrid1"
            style="width: 100%; height: 100%"
            :class="$q.dark.isActive ? 'ag-theme-alpine-dark' : 'ag-theme-alpine'"
            :columnDefs="columnDefsDialog.columns"
            :rowData="rowDataDialog.rows"
            :defaultColDef="defaultColDefDialog.def"
            :rowSelection="rowSelectionDialog"
            @selection-changed="onSelectionChangedDialog"
            @cell-value-changed="onCellValueChangedDialog"
            @grid-ready="onGridReadyDialog"
          >
          </ag-grid-vue>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import 'ag-grid-community/styles/ag-theme-balham.css';
import { AgGridVue } from 'ag-grid-vue3';
import { QBtn, QIcon, QToggle, useQuasar } from 'quasar';
import { computed, h, onBeforeMount, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue';
import { api } from '/src/boot/axios';
import authHeader from 'boot/authHeader';
import { isEmpty, isEqual } from 'lodash';
import jsonUtil from 'src/js_comm/json-util';
import notifySave from 'src/js_comm/notify-save';
import CompToggleHpe from 'components/CompToggleHpe.vue';
import CompToggleHce from 'components/CompToggleHce.vue';
import CompToggleHpr from 'components/CompToggleHpr.vue';
import CompToggleAux from 'components/CompToggleAux.vue';
import CompToggleMst from 'components/CompToggleMst.vue';
import CompToggleSys from 'components/CompToggleSys.vue';
import CompSelectLevel from 'components/CompSelectLevel.vue';
import CompButtonUser from 'components/CompButtonUser.vue';
import CompCheckHeader from 'components/CompCheckHeader.vue';
import CompToggleScr from 'components/CompToggleScr.vue';
import CompToggleNew from 'components/CompToggleNew.vue';
import CompToggleDbg from 'components/CompToggleDbg.vue';
import CompToggleDel from 'components/CompToggleDel.vue';
import CompToggleApp from 'components/CompToggleApp.vue';
import CompToggleRpt from 'components/CompToggleRpt.vue';
import CompToggleExc from 'components/CompToggleExc.vue';
import CompToggleLoc from 'components/CompToggleLoc.vue';

const $q = useQuasar();

const isDialogVisible = ref(false);

let isSaveFg = null;
const searchValue = ref('');
const searchParam = reactive({
  deptCd: '',
  word: '',
});

const contentZoneHeight = ref(500);
const contentZoneStyle = computed(() => ({
  height: `${contentZoneHeight.value}px`,
}));

const gridApi = ref(null);
const gridApiDialog = ref(null);
const rowData = reactive({ rows: [] });
const rowDataDialog = reactive({ rows: [] });
const rowDataBack = ref([]);
const rowDataDialogBack = ref([]);
const updateData = ref([]);
const showSaveBtn = ref(false);
const showSaveDialogBtn = ref(false);
const selectedRows = ref();
const isSelectedDialog = ref();
const showDialogTitle = ref({
  userId: '',
  userNm: '',
});

const onGridReady = params => {
  gridApi.value = params.api;
};
const onGridReadyDialog = params => {
  gridApiDialog.value = params.api;
};

const defaultColDef = reactive({
  def: {
    flex: 1,
    sortable: true,
    filter: false,
    floatingFilter: false,
    editable: false,
  },
});

const columnDefs = reactive({
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
      headerName: '아이디',
      field: 'userId',
      minWidth: 120,
      maxWidth: 120,
      filter: true,
      pinned: 'left',
      cellRenderer: CompButtonUser,
      cellRendererParams: {
        updateSelectedValue: row => {
          showDialogTitle.value.userId = row.value.userId;
          showDialogTitle.value.userNm = row.value.userNm;
          isDialogVisible.value = true;
          getDataDialog();
          getGroupData();
        },
      },
    },
    {
      headerName: '성명',
      field: 'userNm',
      minWidth: 80,
      maxWidth: 80,
      filter: true,
      pinned: 'left',
    },
    {
      headerName: '사원번호',
      field: 'empCd',
      filter: true,
      minWidth: 100,
      maxWidth: 100,
    },
    {
      headerName: '부서',
      field: 'deptNm',
      minWidth: 110,
      maxWidth: 110,
      filter: true,
    },
    {
      headerName: '직위',
      field: 'titlNm',
      minWidth: 90,
      maxWidth: 90,
      filter: true,
    },
    {
      headerName: '권한레벨',
      field: 'levelCd',
      minWidth: 120,
      maxWidth: 120,
      filter: true,
      cellRenderer: CompSelectLevel,
      cellRendererParams: {
        updateSelectedValue: row => {
          onCellValueChanged();
        },
      },
    },
    {
      headerName: '성과평가',
      headerComponent: CompCheckHeader,
      headerComponentParams: {
        headerCheckYn: false,
        updateSelectedValue: row => {
          checkAll('gnHpe', row.value ? 'Y' : 'N');
        },
      },
      field: 'gnHpe',
      maxWidth: 110,
      minWidth: 110,
      cellStyle: { textAlign: 'center' },
      cellRenderer: CompToggleHpe,
      cellRendererParams: {
        updateSelectedValue: row => {
          onCellValueChanged();
        },
      },
    },
    {
      headerName: '역량평가',
      headerComponent: CompCheckHeader,
      headerComponentParams: {
        headerCheckYn: false,
        updateSelectedValue: row => {
          checkAll('gnHce', row.value ? 'Y' : 'N');
        },
      },
      field: 'gnHce',
      maxWidth: 110,
      minWidth: 110,
      cellStyle: { textAlign: 'center' },
      cellRenderer: CompToggleHce,
      cellRendererParams: {
        updateSelectedValue: row => {
          onCellValueChanged();
        },
      },
    },
    {
      headerName: '승격심사',
      headerComponent: CompCheckHeader,
      headerComponentParams: {
        headerCheckYn: false,
        updateSelectedValue: row => {
          checkAll('gnHpr', row.value ? 'Y' : 'N');
        },
      },
      field: 'gnHpr',
      maxWidth: 110,
      minWidth: 110,
      cellStyle: { textAlign: 'center' },
      cellRenderer: CompToggleHpr,
      cellRendererParams: {
        updateSelectedValue: row => {
          onCellValueChanged();
        },
      },
    },
    {
      headerName: '보조운영',
      headerComponent: CompCheckHeader,
      headerComponentParams: {
        headerCheckYn: false,
        updateSelectedValue: row => {
          checkAll('gnAux', row.value ? 'Y' : 'N');
        },
      },
      field: 'gnAux',
      maxWidth: 110,
      minWidth: 110,
      cellStyle: { textAlign: 'center' },
      cellRenderer: CompToggleAux,
      cellRendererParams: {
        updateSelectedValue: row => {
          onCellValueChanged();
        },
      },
    },
    {
      headerName: '기준정보',
      headerComponent: CompCheckHeader,
      headerComponentParams: {
        headerCheckYn: false,
        updateSelectedValue: row => {
          checkAll('gnMst', row.value ? 'Y' : 'N');
        },
      },
      field: 'gnMst',
      maxWidth: 110,
      minWidth: 110,
      cellStyle: { textAlign: 'center' },
      cellRenderer: CompToggleMst,
      cellRendererParams: {
        updateSelectedValue: row => {
          onCellValueChanged();
        },
      },
    },
    {
      headerName: '시스템',
      headerComponent: CompCheckHeader,
      headerComponentParams: {
        headerCheckYn: false,
        updateSelectedValue: row => {
          checkAll('gnSys', row.value ? 'Y' : 'N');
        },
      },
      field: 'gnSys',
      maxWidth: 100,
      minWidth: 100,
      cellStyle: { textAlign: 'center' },
      cellRenderer: CompToggleSys,
      cellRendererParams: {
        updateSelectedValue: row => {
          onCellValueChanged();
        },
      },
    },
  ],
});
const defaultColDefDialog = reactive({
  def: {
    flex: 1,
    sortable: true,
    filter: false,
    floatingFilter: false,
    editable: false,
  },
});

const columnDefsDialog = reactive({
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
      headerName: '코드',
      field: 'progId',
      minWidth: 100,
      maxWidth: 100,
      filter: true,
      sortable: true,
      resizable: true,
      pinned: 'left',
    },
    {
      headerName: '프로그램명',
      field: 'progNm',
      minWidth: 170,
      filter: true,
      pinned: 'left',
    },
    {
      headerName: '조회',
      headerComponent: CompCheckHeader,
      headerComponentParams: {
        headerCheckYn: false,
        updateSelectedValue: row => {
          checkAllProg('scrYn', row.value ? 'Y' : 'N');
        },
      },
      field: 'scrYn',
      maxWidth: 100,
      minWidth: 100,
      cellStyle: { textAlign: 'center' },
      cellRenderer: CompToggleScr,
      cellRendererParams: {
        updateSelectedValue: row => {
          onCellValueChangedDialog();
        },
      },
    },
    {
      headerName: '입력',
      headerComponent: CompCheckHeader,
      headerComponentParams: {
        headerCheckYn: false,
        updateSelectedValue: row => {
          checkAllProg('newYn', row.value ? 'Y' : 'N');
        },
      },
      field: 'newYn',
      maxWidth: 100,
      minWidth: 100,
      cellStyle: { textAlign: 'center' },
      cellRenderer: CompToggleNew,
      cellRendererParams: {
        updateSelectedValue: row => {
          onCellValueChangedDialog();
        },
      },
    },
    {
      headerName: '수정',
      headerComponent: CompCheckHeader,
      headerComponentParams: {
        headerCheckYn: false,
        updateSelectedValue: row => {
          checkAllProg('dbgYn', row.value ? 'Y' : 'N');
        },
      },
      field: 'dbgYn',
      maxWidth: 100,
      minWidth: 100,
      cellStyle: { textAlign: 'center' },
      cellRenderer: CompToggleDbg,
      cellRendererParams: {
        updateSelectedValue: row => {
          onCellValueChangedDialog();
        },
      },
    },
    {
      headerName: '삭제',
      headerComponent: CompCheckHeader,
      headerComponentParams: {
        headerCheckYn: false,
        updateSelectedValue: row => {
          checkAllProg('delYn', row.value ? 'Y' : 'N');
        },
      },
      field: 'delYn',
      maxWidth: 100,
      minWidth: 100,
      cellStyle: { textAlign: 'center' },
      cellRenderer: CompToggleDel,
      cellRendererParams: {
        updateSelectedValue: row => {
          onCellValueChangedDialog();
        },
      },
    },
    {
      headerName: '출력',
      headerComponent: CompCheckHeader,
      headerComponentParams: {
        headerCheckYn: false,
        updateSelectedValue: row => {
          checkAllProg('rptYn', row.value ? 'Y' : 'N');
        },
      },
      field: 'rptYn',
      maxWidth: 100,
      minWidth: 100,
      cellStyle: { textAlign: 'center' },
      cellRenderer: CompToggleRpt,
      cellRendererParams: {
        updateSelectedValue: row => {
          onCellValueChangedDialog();
        },
      },
    },
    {
      headerName: '엑셀',
      headerComponent: CompCheckHeader,
      headerComponentParams: {
        headerCheckYn: false,
        updateSelectedValue: row => {
          checkAllProg('excYn', row.value ? 'Y' : 'N');
        },
      },
      field: 'excYn',
      maxWidth: 100,
      minWidth: 100,
      cellStyle: { textAlign: 'center' },
      cellRenderer: CompToggleExc,
      cellRendererParams: {
        updateSelectedValue: row => {
          onCellValueChangedDialog();
        },
      },
    },
    {
      headerName: '마감 ',
      headerComponent: CompCheckHeader,
      headerComponentParams: {
        headerCheckYn: false,
        updateSelectedValue: row => {
          checkAllProg('locYn', row.value ? 'Y' : 'N');
        },
      },
      field: 'locYn',
      maxWidth: 100,
      minWidth: 100,
      cellStyle: { textAlign: 'center' },
      cellRenderer: CompToggleLoc,
      cellRendererParams: {
        updateSelectedValue: row => {
          onCellValueChangedDialog();
        },
      },
    },
    {
      headerName: '승인',
      headerComponent: CompCheckHeader,
      headerComponentParams: {
        headerCheckYn: false,
        updateSelectedValue: row => {
          checkAllProg('appYn', row.value ? 'Y' : 'N');
        },
      },
      field: 'appYn',
      maxWidth: 100,
      minWidth: 100,
      cellStyle: { textAlign: 'center' },
      cellRenderer: CompToggleApp,
      cellRendererParams: {
        updateSelectedValue: row => {
          onCellValueChangedDialog();
        },
      },
    },
  ],
});

const onSelectionChanged = event => {
  selectedRows.value = event.api.getSelectedRows();
};
const onSelectionChangedDialog = event => {
  selectedRows.value = event.api.getSelectedRows();
};
const onCellValueChanged = () => {
  updateData.value = [];
  for (let i = 0; rowDataBack.value.length > i; i++) {
    if (JSON.stringify(rowDataBack.value[i]) !== JSON.stringify(rowData.rows[i])) {
      updateData.value.push(rowData.rows[i]);
    }
  }
  showSaveBtn.value = updateData.value.length > 0;
};
const onCellValueChangedDialog = () => {
  updateData.value = [];
  for (let i = 0; rowDataDialogBack.value.length > i; i++) {
    if (JSON.stringify(rowDataDialogBack.value[i]) !== JSON.stringify(rowDataDialog.rows[i])) {
      updateData.value.push(rowDataDialog.rows[i]);
    }
  }
  showSaveDialogBtn.value = updateData.value.length > 0;
};

const rowSelection = ref(null);
const rowSelectionDialog = ref(null);

const saveDataSection = () => {
  let iu = [];
  let iuD = [];
  // 신규/수정 부분
  for (let i = 0; i < updateData.value.length; i++) {
    let tmpJson = '{"mode": "' + updateData.value[i].iuD + '","data":' + JSON.stringify(updateData.value[i]) + '}';
    iu.push(tmpJson);
  }
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

const saveDataDialogSection = () => {
  let iu = [];
  let iuD = [];
  // 신규/수정 부분
  for (let i = 0; i < updateData.value.length; i++) {
    let tmpJson = '{"mode": "' + updateData.value[i].iuD + '","data":' + JSON.stringify(updateData.value[i]) + '}';
    iu.push(tmpJson);
  }

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
    saveDataDialogAndHandleResult(jsonUtil.jsonFiller(iu, iuD));
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

onBeforeUnmount(() => {
  // Remove the resize event listener when the component is destroyed
  window.removeEventListener('resize', handleResize);
});
onBeforeMount(() => {
  getStorgeSetYearGroup();
  rowSelection.value = 'multiple';
  getData();
  getDataDeptOption();
});

onMounted(() => {
  window.addEventListener('resize', handleResize);
  handleResize();
});

// 기준평가기간 적용부분
const setYearGroup = ref({
  setYear: '',
  setFg: '',
  setLocCh: '',
});
const getStorgeSetYearGroup = () => {
  const _value = $q.localStorage.getItem('setYearGroup').split('|');
  setYearGroup.value.setYear = _value[0];
  setYearGroup.value.setFg = _value[1];
  setYearGroup.value.setLocCh = _value[2];
  console.log('Sub SetYear Group :: ', setYearGroup.value.setYear, setYearGroup.value.setFg, setYearGroup.value.setLocCh);
};
// 기준평가기간 적용부분 끝

const checkAll = (resId, resCheck) => {
  for (let i = 0; i < rowData.rows.length; i++) {
    rowData.rows[i][resId] = resCheck;
  }
  onCellValueChanged();
};

const checkAllProg = (resId, resCheck) => {
  for (let i = 0; i < rowDataDialog.rows.length; i++) {
    if (rowDataDialog.rows[i][resId]) {
      rowDataDialog.rows[i][resId] = resCheck;
    }
  }
  onCellValueChangedDialog();
};

// **************************************************************//
// ***** DataBase 연결부분    *************************************//
// **************************************************************//

// ***** 사용자 권한정보 저장하기 부분  *****************************//
const saveDataAndHandleResult = resFormData => {
  api
    .post('/api/sys/sys1110_grntg_save', resFormData, { headers: authHeader() })
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
// ***** 사용자 권한정보 저장하기 부분 끝 *****************************//

// ***** 사용자 권한정보 선택된 자료 가져오기 부분  *****************************//
const getData = async () => {
  try {
    const response = await api.post(
      '/api/sys/sys1110_grntg_list',
      { paramSetYear: setYearGroup.value.setYear, paramDeptCd: selectedDept.value, paramSearchValue: searchValue.value },
      { headers: authHeader() },
    );
    rowData.rows = response.data.data;
    rowDataBack.value = JSON.parse(JSON.stringify(response.data.data));
    updateData.value = [];
  } catch (error) {
    console.error('Error fetching users:', error);
  }
};
// ***** 사용자 권한정보 선택된 자료 가져오기 부분  *****************************//

// ***** 프로그램 권한정보 저장하기 부분  *****************************//
const saveDataDialogAndHandleResult = resFormData => {
  api
    .post('/api/sys/sys1110_grntp_save', resFormData, { headers: authHeader() })
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
      showSaveDialogBtn.value = false;
      notifySave.notifyView(saveStatus);
    })
    .catch(error => {
      console.log('error: ', error);
    });
};
// ***** 프로그램 권한정보 저장하기 부분 끝 *****************************//

// ***** 프로그램 권한정보 선택된 자료 가져오기 부분  *****************************//
const getDataDialog = async () => {
  try {
    const response = await api.post(
      '/api/sys/sys1110_grntp_list',
      { paramUserId: showDialogTitle.value.userId, paramGroupCd: selectedGroup.value },
      { headers: authHeader() },
    );
    rowDataDialog.rows = response.data.data;
    rowDataDialogBack.value = JSON.parse(JSON.stringify(response.data.data));
    updateData.value = [];
    showSaveDialogBtn.value = false;
  } catch (error) {
    console.error('Error fetching users:', error);
  }
};
// ***** 프로그램 선택된 자료 가져오기 부분  *****************************//

/// ***** 공통코드정보 가져오기 부분  *****************************//
const selectedDept = ref('');
const deptOptions = ref([]);
async function getDataDeptOption() {
  try {
    const response = await api.post('/api/mst/dept_option_list', { paramStdYear: setYearGroup.value.setYear }, { headers: authHeader() });
    deptOptions.value = response.data.data;
    deptOptions.value.push({ deptNm: '전체', deptCd: '' });
  } catch (error) {
    console.error('Error fetching users:', error);
  }
}
// ***** 사용정보 선택된 자료 가져오기 부분  *****************************//

// ***** DataBase 그룹자료 가져오기 부분 *****************************//
const groupOptions = ref([]);
const selectedGroup = ref(null);
const getGroupData = async () => {
  try {
    const response = await api.post('/api/sys/prog_group_list', { paramUserId: showDialogTitle.value.userId }, { headers: authHeader() });
    // 옵션 초기화
    groupOptions.value = [];
    groupOptions.value.push({ groupNm: '전체', groupCd: '' });

    response.data.data.forEach(group => {
      groupOptions.value.push(group);
    });
    selectedGroup.value = null;
  } catch (error) {
    console.error('Error fetching users:', error);
  }
};
// **************************************************************//
// ***** DataBase 연결부분 끝  *************************************//
// **************************************************************//
</script>
<style scoped>
.ag-body-viewport [col-id='userNm'] {
  background-color: #2244cc44;
}
</style>

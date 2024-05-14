<template>
  <q-page class="q-pa-xs">
    <!-- contents zone -->
    <div class="row q-pa-sm q-col-gutter-md">
      <!-- contents List -->
      <div class="col-12">
        <q-card bordered>
          <!-- contents list title bar -->
          <q-bar class="q-px-sm">
            <q-icon name="list_alt" />
            <span class="text-subtitle2 q-px-sm">조회/조정/삭제</span>
            <q-space />
            <q-chip v-if="isShowStatusEdit" size="sm" outline :color="statusEdit.color" class="q-px-md">
              <q-icon :name="statusEdit.icon" class="q-mr-sm" size="15px" /> {{ statusEdit.message }}
            </q-chip>
          </q-bar>
          <!--  end of contents list title bar -->
          <q-card-actions align="right" class="q-pa-none">
            <q-toolbar class="row">
              <div class="q-gutter-xs"></div>
              <q-space />
              <div class="q-gutter-xs">
                <q-btn v-if="isShowSaveBtn" outline color="primary" dense @click="saveDataSection"><q-icon name="save" size="xs" /> 저장 </q-btn>
                <q-btn outline color="positive" dense @click="addDataSection"><q-icon name="add" size="xs" /> 신규 </q-btn>
              </div>
            </q-toolbar>
          </q-card-actions>

          <q-separator size="3px" />

          <q-card-section class="q-pa-none">
            <q-card flat bordered class="q-ma-sm-xs q-ma-xs-none q-pa-sm-sm q-pa-xs-xs">
              <div class="form1 row text-center text-bold text-subtitle2">
                <div class="form1-top form1-left col-12 col-sm-2 q-py-xs bg-blue-grey-4">이자적용일</div>
                <div class="form1-top form1-left col-12 col-sm-3 q-py-xs bg-blue-grey-4">회원</div>
                <div class="form1-top form1-left col-12 col-sm-3 q-py-xs bg-blue-grey-4">비회원</div>
                <div class="form1-top form1-left form1-right col-12 col-sm-4 q-py-xs bg-blue-grey-4">기타사항</div>
              </div>
              <div class="row">
                <div
                  style="display: flex; justify-content: center; align-items: center"
                  class="form1-left form1-bottom col-12 col-sm-2 q-py-xs q-px-lg"
                >
                  <q-input
                    ref="rateDayFocus"
                    dense
                    outlined
                    type="date"
                    v-model="formData.rateDay"
                    :disable="formDisable"
                    input-class="text-center"
                  />
                </div>
                <div class="col-12 col-sm-6 row">
                  <div class="col-12 col-sm-6 row text-center text-bold text-subtitle2">
                    <div class="form1-top form1-left col-6 q-py-xs bg-blue-grey-4">이자율</div>
                    <div class="form1-top form1-left fo col-6 q-py-xs bg-blue-grey-4">연체율</div>
                  </div>
                  <div class="col-12 col-sm-6 row text-center text-bold text-subtitle2">
                    <div class="form1-top form1-left col-6 q-py-xs bg-blue-grey-4">이자율</div>
                    <div class="form1-top form1-left col-6 q-py-xs bg-blue-grey-4">연체율</div>
                  </div>
                  <div class="col-12 col-sm-6 row">
                    <div
                      class="form1-top form1-left form1-bottom col-6 q-py-xs q-px-lg"
                      style="display: flex; justify-content: center; align-items: center"
                    >
                      <q-input dense outlined v-model="formData.rateM" :disable="formDisable" input-class="text-right">
                        <template v-slot:append><span class="text-subtitle2 text-bold">%</span></template>
                      </q-input>
                    </div>
                    <div
                      class="form1-top form1-left form1-bottom col-6 q-py-xs q-px-lg"
                      style="display: flex; justify-content: center; align-items: center"
                    >
                      <q-input dense outlined v-model="formData.rateMc" :disable="formDisable" input-class="text-right">
                        <template v-slot:append><span class="text-subtitle2 text-bold">%</span></template>
                      </q-input>
                    </div>
                  </div>
                  <div class="form1 col-12 col-sm-6 row">
                    <div
                      class="form1-top form1-left form1-bottom col-6 q-py-xs q-px-lg"
                      style="display: flex; justify-content: center; align-items: center"
                    >
                      <q-input dense outlined v-model="formData.rateP" :disable="formDisable" input-class="text-right">
                        <template v-slot:append><span class="text-subtitle2 text-bold">%</span></template>
                      </q-input>
                    </div>
                    <div
                      class="form1-top form1-left form1-bottom col-6 q-py-xs q-px-lg"
                      style="display: flex; justify-content: center; align-items: center"
                    >
                      <q-input dense outlined v-model="formData.ratePc" :disable="formDisable" input-class="text-right">
                        <template v-slot:append><span class="text-subtitle2 text-bold">%</span></template>
                      </q-input>
                    </div>
                  </div>
                </div>
                <div class="form1-top form1-left form1-bottom form1-right col-12 col-sm-4 q-py-xs q-px-xs">
                  <q-input
                    outlined
                    :disable="formDisable"
                    type="textarea"
                    v-model="formData.explains"
                    autogrow
                    counter
                    maxlength="200"
                    hint="200자까지 입력가능"
                  />
                </div>
              </div>
            </q-card>
          </q-card-section>
        </q-card>
      </div>
      <!--  end of contents list -->
      <!-- contents List -->
      <div class="col-12">
        <q-card bordered>
          <!-- contents list title bar -->
          <q-bar class="q-px-sm">
            <q-icon name="list_alt" />
            <span class="text-subtitle2 q-px-sm">기준이율정보 리스트</span>
          </q-bar>
          <!--  end of contents list title bar -->
          <q-card-actions align="right" class="q-pa-none">
            <q-toolbar class="row">
              <q-space />
              <div class="q-gutter-xs">
                <q-btn outline color="positive" dense @click="getData('104')"
                  ><q-icon name="refresh" size="xs" class="q-mr-xs" /> 다시불러오기
                </q-btn>
                <q-btn v-if="isShowDeleteBtn" outline color="negative" dense @click="deleteDataSection">
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
import { computed, onBeforeMount, reactive, ref } from 'vue';
import { api } from '/src/boot/axios';
import authHeader from 'boot/authHeader';
import { isEqual } from 'lodash';
import jsonUtil from 'src/js_comm/json-util';
import notifySave from 'src/js_comm/notify-save';

const $q = useQuasar();

let isSaveFg = null;

window.dateFormatRendering = function dateFormatRendering(params) {
  return formatDate(params.value);
};
window.currencyFormatter = function currencyFormatter(params) {
  return formatNumber(params.value);
};
window.formatNumber = function formatNumber(number) {
  return number.toFixed(2).toLocaleString();
};

const statusEdit = reactive({
  icon: '',
  message: '',
  color: '',
});

const formDisable = ref(true);

const contentZoneHeight = ref(500);
const contentZoneStyle = computed(() => ({
  height: `${contentZoneHeight.value}px`,
}));

const gridApi = ref(null);
const rowData = reactive({ rows: [] });

const onGridReady = params => {
  gridApi.value = params.api;
};

const defaultColDef = reactive({
  def: {
    flex: 1,
    sortable: true,
    filter: true,
    floatingFilter: false,
    editable: false,
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
      headerName: '변동일',
      field: 'rateDay',
      minWidth: 120,
      maxWidth: 120,
      pinned: 'left',
      valueFormatter: dateFormatRendering,
    },
    {
      headerName: '이율(회원)',
      field: 'rateM',
      minWidth: 140,
      valueFormatter: currencyFormatter,
    },
    {
      headerName: '연체율(회원)',
      field: 'rateMc',
      minWidth: 140,
      valueFormatter: currencyFormatter,
    },
    {
      headerName: '이율(비회원)',
      field: 'rateP',
      minWidth: 140,
      valueFormatter: currencyFormatter,
    },
    {
      headerName: '연체율(회원)',
      field: 'ratePc',
      minWidth: 140,
      valueFormatter: currencyFormatter,
    },
    {
      headerName: '기타사항',
      field: 'explains',
      minWidth: 140,
    },
  ],
});

const oldFormData = ref(null);
const formData = ref({
  rateDay: '',
  oldRateDay: '',
  rateM: 0,
  rateMc: 0,
  rateP: 0,
  ratePc: 0,
  explains: '',
});
const formDataInitialize = () => {
  formData.value.rateDay = '';
  formData.value.oldRateDay = '';
  formData.value.rateM = 0;
  formData.value.rateMc = 0;
  formData.value.rateP = 0;
  formData.value.ratePc = 0;
  formData.value.explains = '';
};

const selectedRows = ref();
const isShowStatusEdit = ref(false);
const isShowDeleteBtn = ref(false);
const isShowSaveBtn = ref(false);
const rateDayFocus = ref(null);

const onSelectionChanged = event => {
  selectedRows.value = event.api.getSelectedRows();
  isShowStatusEdit.value = false;
  isShowDeleteBtn.value = selectedRows.value.length > 0;
  isShowSaveBtn.value = isShowDeleteBtn.value;

  if (selectedRows.value.length === 1) {
    getSelectData(selectedRows.value[0].oldRateDay);
    isShowStatusEdit.value = true;
    formDisable.value = false;
    statusEdit.icon = 'edit_note';
    statusEdit.message = '수정/추가/삭제 모드 입니다';
    statusEdit.color = 'accent';
    setTimeout(() => {
      rateDayFocus.value.focus();
    }, 100);
  } else if (selectedRows.value.length > 1) {
    isSaveFg = 'D';
    isShowStatusEdit.value = true;
    isShowSaveBtn.value = false;
    statusEdit.icon = 'delete';
    statusEdit.message = '삭제모드 입니다';
    statusEdit.color = 'negative';
    formDisable.value = true;
    formDataInitialize();
  } else {
    formData.value = {};
    isShowStatusEdit.value = false;
    isSaveFg = '';
    formDisable.value = true;
  }
};

const rowSelection = ref(null);

onBeforeMount(() => {
  rowSelection.value = 'multiple';
  getData('104');
});

const addDataSection = () => {
  oldFormData.value = {};
  isShowStatusEdit.value = true;
  statusEdit.icon = 'edit';
  statusEdit.message = '신규입력모드 입니다';
  statusEdit.color = 'primary';
  isSaveFg = 'I';
  isShowSaveBtn.value = true;
  formDisable.value = false;
  formDataInitialize();
  setTimeout(() => {
    rateDayFocus.value.focus();
  }, 100);
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
        let tmpJson = '{"mode":"D","data": { "oldRateDay" : ' + selectedRows.value[i].oldRateDay + '} }';
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
  formData.value.rateDay = reFormatDate(formData.value.rateDay);
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
    formData.value.rateDay = formatDate(formData.value.rateDay);
  }
};

// **************************************************************//
// ***** DataBase 연결부분    *************************************//
// **************************************************************//

// ***** 이율적용조건정보 자료저장 및 삭제 처리부분 *****************************//
// saveStatus = 0=수정성공 1=신규성공 2=삭제성공 3=수정에러 4=시스템에러
const saveDataAndHandleResult = resFormData => {
  console.log(JSON.stringify(resFormData));
  api
    .post('/api/mst/mst1110_save', resFormData, { headers: authHeader() })
    .then(res => {
      let saveStatus = {};
      if (res.data.rtn === '0') {
        if (isSaveFg === 'I') {
          saveStatus.rtn = 1;
          saveStatus.rtn1 = res.data.rtnMsg1;
          saveStatus.rtn2 = '신규추가 완료';

          formData.value.rateDay = reFormatDate(formData.value.rateDay);
          formData.value.oldRateDay = reFormatDate(formData.value.rateDay);
          formData.value.rateM = parseFloat(formData.value.rateM);
          formData.value.rateMc = parseFloat(formData.value.rateMc);
          formData.value.rateP = parseFloat(formData.value.rateP);
          formData.value.ratePc = parseFloat(formData.value.ratePc);

          let newData = [formData.value];
          gridApi.value.applyTransaction({
            add: newData,
            addIndex: 0,
          });
        } else if (isSaveFg === 'U') {
          saveStatus.rtn = 0;
          saveStatus.rtn1 = res.data.rtnMsg1;
          saveStatus.rtn2 = '수정 완료';

          const selectedData = gridApi.value.getSelectedRows();

          selectedData[0].rateDay = reFormatDate(formData.value.rateDay);
          selectedData[0].oldRateDay = reFormatDate(formData.value.rateDay);
          selectedData[0].rateM = parseFloat(formData.value.rateM);
          selectedData[0].rateMc = parseFloat(formData.value.rateMc);
          selectedData[0].rateP = parseFloat(formData.value.rateP);
          selectedData[0].ratePc = parseFloat(formData.value.ratePc);
          selectedData[0].explains = formData.value.explains;

          gridApi.value.applyTransaction({
            update: selectedData,
          });
        } else if (isSaveFg === 'D') {
          saveStatus.rtn = 2;
          saveStatus.rtn1 = res.data.rtnMsg1;
          saveStatus.rtn2 = '삭제 완료';

          const selectedData = gridApi.value.getSelectedRows();
          gridApi.value.applyTransaction({ remove: selectedData });
        }
      } else {
        saveStatus.rtn = res.data.rtn;
        saveStatus.rtn1 = res.data.rtnMsg1;
        saveStatus.rtn2 = res.data.rtnMsg2;
      }
      gridApi.value.deselectAll();
      notifySave.notifyView(saveStatus);
    })
    .catch(error => {
      console.log('error: ', error);
    });
};
// ***** 공통코드정보 목록 자료 가져오기 부분  *****************************//
const getData = async resParamCommCd1 => {
  try {
    const response = await api.post('/api/mst/mst1110_list', {}, { headers: authHeader() });
    rowData.rows = response.data.data;
  } catch (error) {
    console.error('Error fetching users:', error);
  }
};
// ***** 공통코드정보 목록 자료 가져오기 부분  끝 *****************************//

// ***** 이율적용조건정보 선택된 자료 가져오기 부분  *****************************//
const getSelectData = async resParamOldRateDay => {
  try {
    const response = await api.post('/api/mst/mst1110_select', { paramOldRateDay: resParamOldRateDay }, { headers: authHeader() });
    if (response.data.data.length > 0) {
      formData.value = response.data.data[0];
      oldFormData.value = JSON.parse(JSON.stringify(formData.value)); // 초기자료 저장
      formData.value.rateDay = formatDate(response.data.data[0].rateDay);
      isSaveFg = 'U';
    } else {
      formDataInitialize();
      oldFormData.value = JSON.parse(JSON.stringify(formData.value)); // 초기자료 저장
      formData.value.rateDay = formatDate(response.data.data[0].rateDay);
      isSaveFg = 'I';
    }
    console.log(JSON.stringify(formData.value));
  } catch (error) {
    console.error('Error fetching users:', error);
  }
};
// ***** 이율적용조건정보 선택된 자료 가져오기 부분  *****************************//

// **************************************************************//
// ***** DataBase 연결부분 끝  *************************************//
// **************************************************************//

const reFormatDate = rawDate => {
  return rawDate ? rawDate.replace(/-/g, '') : null;
};

const formatDate = rawDate => {
  if (rawDate) {
    const year = rawDate.substring(0, 4);
    const month = rawDate.substring(4, 6);
    const day = rawDate.substring(6, 8);
    return `${year}-${month}-${day}`;
  } else {
    return null;
  }
};
</script>

<style lang="scss" scoped>
.form1-left {
  border-left: 2px solid $blue-grey-2;
}
.form1-top {
  border-top: 2px solid $blue-grey-2;
}
.form1-right {
  border-right: 2px solid $blue-grey-3;
}
.form1-bottom {
  border-bottom: 2px solid $blue-grey-3;
}
</style>

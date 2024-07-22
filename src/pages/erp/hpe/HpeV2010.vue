<template>
  <q-page class="q-pa-xs-xs q-pa-sm-md" :style-fn="myTweak">
    <q-card class="q-pa-sm">
      <div class="row">
        <div class="col-xs-12 col-sm-12 col-lg-8">
          <div class="row q-col-gutter-x-sm">
            <div class="col-xs-12 col-sm-12">
              <q-banner rounded :class="$q.dark.isActive ? 'bg-grey-9' : 'bg-grey-3'" style="height: 100%">
                <template v-slot:avatar>
                  <q-icon name="menu_book" color="primary" size="md" />
                </template>
                <span class="text-subtitle1 text-bold"> 목표설정에 대한 승인작업입니다.</span><br />
                1. <span class="text-teal text-bold">승인대기</span> 자료만 승인하실 수 있습니다.<br />
                2. <span class="text-teal text-bold">승인반려</span>시 반려사유를 작성합니다.<br />
              </q-banner>
            </div>
          </div>
        </div>
        <div class="col-xs-12 col-sm-12 col-lg-4">
          <q-card class="q-ml-sm-md q-pa-sm" :class="$q.screen.xs ? 'q-mt-xs' : 'row flex-center'" style="height: 100%">
            <div class="row">
              <q-space />
              <span class="text-bold text-subtitle2 q-pr-sm text-orange">평가자<q-icon name="chevron_right" size="xs" /></span>
              <q-breadcrumbs separator="|" class="text-orange text-bold" active-color="secondary">
                <q-breadcrumbs-el icon="room_preferences" :label="storeUser.setDeptNm" style="width: 90px" />
                <q-breadcrumbs-el icon="star" :label="storeUser.setTitlNm" style="width: 60px" />
                <q-breadcrumbs-el icon="person" :label="storeUser.setEmpNm" style="width: 70px" />
              </q-breadcrumbs>
            </div>
          </q-card>
        </div>
      </div>
    </q-card>

    <q-separator spaced />

    <q-card class="q-pa-sm">
      <q-card-section class="text-center q-pa-sm q-mb-sm" :class="$q.dark.isActive ? 'bg-teal-7' : 'bg-teal-3'">
        <q-item-label class="text-h6">목표설정 / 승인하기</q-item-label>
      </q-card-section>

      <div class="row q-col-gutter-x-lg">
        <div class="col-xs-12 col-md-12 col-lg-4">
          <q-card class="q-pa-sm">
            <q-toolbar class="row q-pa-none">
              <q-avatar color="red" text-color="white" size="md">1번</q-avatar>
              <q-space />
              <q-btn outline color="grey" dense @click="getData"
                ><q-icon name="refresh" size="xs" class="q-mr-xs" />
                다시 불러오기
              </q-btn>
              <q-btn v-if="statusCheck.cancelHide" outline color="grey" dense @click="sendAuthRequestCancel" class="q-ml-xs"
                ><q-icon name="refresh" size="xs" class="q-mr-xs" />
                승인대기취소
              </q-btn>
            </q-toolbar>
            <div :style="{ height: gridHeight + 30 + 'px' }">
              <ag-grid-vue
                style="width: 100%; height: 100%"
                :class="$q.dark.isActive ? 'ag-theme-alpine-dark' : 'ag-theme-alpine'"
                :columnDefs="columnDefs.group"
                :rowData="rowData.rows"
                :defaultColDef="defaultColDef.group"
                rowSelection="single"
                @selection-changed="onSelectionChanged"
                @grid-ready="onGridReady"
                :grid-options="gridOptions"
              >
              </ag-grid-vue>
            </div>
            <q-card v-if="statusCheck.returnHide" class="q-pa-sm q-mt-md">
              <q-banner rounded :class="$q.dark.isActive ? 'bg-grey-9' : 'bg-grey-2'">
                <template v-slot:avatar>
                  <q-icon name="reply" style="width: 50px" />
                </template>

                {{ textReturnDoc }}
                <template v-slot:action> <span class="text-bold text-subtitle1 text-red"> 반려사유 </span></template>
              </q-banner>
            </q-card>
          </q-card>
        </div>
        <div class="col-xs-12 col-md-12 col-lg-8">
          <q-card class="q-pa-xs">
            <q-toolbar class="row q-pa-none">
              <q-avatar color="red" text-color="white" size="md">2번</q-avatar>
              <q-space />
              <div class="row q-gutter-x-sm">
                <q-btn
                  v-if="statusCheck.sendCancelHide"
                  outline
                  color="teal"
                  dense
                  class="q-pr-md"
                  @click="saveDataSendAllSection('1', 'Y', '승인취소', rowData.rowsSel.length)"
                >
                  <q-badge color="orange" floating>{{ sendCount.status_3 }}</q-badge>
                  <q-icon name="check" size="xs" class="q-mr-xs" />
                  승인취소
                </q-btn>
                <q-btn
                  v-if="rowData.rowsSel.length > 0"
                  outline
                  color="blue"
                  dense
                  class="q-pr-md"
                  @click="saveDataSendAllSection('3', 'N', '승인하기', rowData.rowsSel.length)"
                >
                  <q-badge color="orange" floating>{{ rowData.rowsSel.length }}</q-badge>
                  <q-icon name="check" size="xs" class="q-mr-xs" />
                  승인하기
                </q-btn>
                <q-btn v-if="rowData.rowsSel.length > 0" outline color="red" dense class="q-pr-md" @click="sendReturnDialog">
                  <q-badge color="orange" floating>{{ rowData.rowsSel.length }}</q-badge>
                  <q-icon name="reply" size="xs" class="q-mr-xs" />
                  반려하기
                </q-btn>
              </div>
            </q-toolbar>
            <!--        <q-scroll-area :style="contentZoneStyle">-->
            <div class="row">
              <q-card flat bordered style="width: 100%" v-for="data in rowData.rowsSel" :key="data.workNo" class="q-mb-sm">
                <div class="row">
                  <q-card class="col-xs-12 col-sm-1">
                    <div class="bg-deep-orange-3 text-center text-subtitle2 text-bold q-px-xs">순번</div>
                    <div class="text-center q-pa-xs" :class="$q.screen.xs ? '' : 'row flex-center'" style="height: 100%">
                      {{ data.seq }}
                    </div>
                  </q-card>
                  <q-card class="col-xs-12 col-sm-7">
                    <div class="bg-deep-orange-3 text-center text-subtitle2 text-bold q-px-xs">목표설정</div>
                    <div :class="$q.dark.isActive ? 'q-pa-xs bg-grey-8' : 'q-pa-xs bg-grey-4'">
                      <span :class="$q.dark.isActive ? 'text-orange' : 'text-deep-orange'"> 평가지표 : </span>
                      <span class="text-bold"> {{ data.eidcNm }}</span>
                    </div>
                    <div class="q-pa-xs" v-html="data.targetDoc.replace(/\n/g, '<br>')"></div>
                  </q-card>
                  <q-card class="col-xs-12 col-sm-3">
                    <div class="bg-deep-orange-3 text-center text-subtitle2 text-bold q-px-xs">기준설정</div>
                    <div class="q-pa-xs">
                      <span v-if="data.evaS" class="q-px-sm"> <span class="text-blue"> S(100점) :</span> {{ data.evaS }}<br /> </span>
                      <span v-if="data.evaA" class="q-px-sm"> <span class="text-blue"> A(90점) :</span> {{ data.evaA }}<br /> </span>
                      <span v-if="data.evaB" class="q-px-sm"> <span class="text-blue"> B(80점) :</span> {{ data.evaB }}<br /> </span>
                      <span v-if="data.evaC" class="q-px-sm"> <span class="text-blue"> C(70점) :</span> {{ data.evaC }}<br /> </span>
                      <span v-if="data.evaD" class="q-px-sm"> <span class="text-blue"> D(60점) :</span> {{ data.evaD }} </span>
                    </div>
                  </q-card>
                  <q-card class="col-xs-12 col-sm-1">
                    <div class="bg-deep-orange-3 text-center text-subtitle2 text-bold q-px-xs">가중치</div>
                    <div class="text-center q-pa-xs" :class="$q.screen.xs ? '' : 'row flex-center'" style="height: 100%">
                      {{ data.weight }}
                    </div>
                  </q-card>
                </div>
              </q-card>
            </div>
            <!--        </q-scroll-area>-->
          </q-card>
        </div>
      </div>
      <q-separator spaced />
    </q-card>

    <q-dialog persistent v-model="isDialogVisible">
      <q-card flat bordered style="max-width: 450px; width: 100%">
        <q-bar>
          <q-icon name="list_alt" />
          <div>목표반려사유 등록 (전체적용)</div>

          <q-space />
          <q-btn dense flat icon="close" v-close-popup>
            <q-tooltip> 닫기 </q-tooltip>
          </q-btn>
        </q-bar>

        <q-form class="">
          <q-card class="q-pa-md">
            <q-card-section>
              <q-input
                autofocus
                :input-style="{ minHeight: '150px' }"
                outlined
                type="textarea"
                class="q-pt-sm"
                v-model="textReturnDoc"
                :color="$q.dark.isActive ? 'orange' : 'teal'"
                :label-color="$q.dark.isActive ? 'orange' : 'teal'"
                label="반려사유"
                :rows="5"
                :autogrow="true"
                :hint="`${byteCount} / 200자 까지 입력하실 수 있습니다.`"
                @update:model-value="updateByteCount"
              />
            </q-card-section>
          </q-card>
        </q-form>

        <q-separator size="2px" color="grey" />

        <q-card-actions align="right" class="q-pa-md">
          <q-btn color="red" v-close-popup @click="saveDataReturnAllSection"><q-icon class="q-mr-xs" name="save" size="xs" /> 반려하기 </q-btn>
          <q-btn color="grey" v-close-popup><q-icon class="q-mr-xs" name="close" size="xs" /> 닫기 </q-btn>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import 'ag-grid-community/styles/ag-theme-balham.css';
import { AgGridVue } from 'ag-grid-vue3';
import { computed, onBeforeMount, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue';
import { isEmpty, isEqual } from 'lodash';
import { api } from 'boot/axios';
import notifySave from 'src/js_comm/notify-save';
import { QBtn, QIcon, QToggle, useQuasar } from 'quasar';
import jsonUtil from 'src/js_comm/json-util';
import { useUserInfoStore } from 'src/store/setUserInfo';
import { useYearInfoStore } from 'src/store/setYearInfo';
import commUtil from 'src/js_comm/comm-util';
const storeUser = useUserInfoStore();
const storeYear = useYearInfoStore();

const setEvsCd = ref('2011101'); // 성과평가 공통코드

const isDialogVisible = ref(false);
const textReturnDoc = ref(null);
const sendReturnDialog = () => {
  if (textReturnDoc.value) {
    $q.dialog({
      dark: true,
      title: '안내',
      html: true,
      message: '기존에 작성한 반려내용이 있습니다. <br>다시작성 또는 기존내용을 수정하실 수 있습니다',
      // persistent: true,
      ok: {
        label: '다시작성',
        color: 'primary',
      },
      cancel: {
        label: '수정하기',
        color: 'secondary',
      },
    })
      .onOk(() => {
        textReturnDoc.value = null;
      })
      .onCancel(() => {})
      .onDismiss(() => {
        // 확인/취소 모두 실행되었을때
        updateByteCount(textReturnDoc);
        isDialogVisible.value = true;
      });
  } else {
    isDialogVisible.value = true;
  }
};

const rowData = reactive({ rows: [], rowsSel: [] });

// grid Height 자동처리부분
const gridHeight = ref(300); // 초기 높이
const rowHeight = 45; // 행당 높이 (예: 25px)
const minHeight = ref(90); // 최소 높이 (예: 300px) rowHeight의 3배

const $q = useQuasar();
let isSaveFg = null;

const contentZoneHeight = ref(300);
const contentZoneStyle = computed(() => ({
  height: `${contentZoneHeight.value}px`,
}));

const gridApi = ref(null);
const onGridReady = params => {
  gridApi.value = params.api;
  gridApi.value.setGridOption('headerHeight', 45);
  gridApi.value.setGridOption('rowHeight', 45);
  gridApi.value.deselectAll();
};
const defaultColDef = reactive({
  group: {
    flex: 1,
    sortable: true,
    filter: true,
    floatingFilter: false,
    editable: false,
  },
});
const columnDefs = reactive({
  group: [
    {
      headerName: '#',
      width: 50,
      pinned: 'left',
      sortable: false,
      filter: false,
      valueGetter: function (params) {
        return params.node.rowIndex + 1;
      },
    },
    {
      headerName: '성명',
      field: 'evtEmpNm',
      minWidth: 80,
      maxWidth: 80,
      resizable: true,
    },
    {
      headerName: '소속팀',
      field: 'evtDeptNm',
      minWidth: 100,
      resizable: true,
    },
    {
      headerName: '직급',
      field: 'evtTitlNm',
      minWidth: 80,
      maxWidth: 80,
      resizable: true,
    },
    {
      headerName: '진행상태',
      field: 'statusMessage',
      minWidth: 105,
      maxWidth: 105,
      cellStyle: params => {
        if (
          params.data.authCnt0 + params.data.authCnt1 + params.data.authCnt2 + params.data.authCnt3 + params.data.authCnt4 + params.data.authCnt5 ===
          0
        ) {
          return $q.dark.isActive ? { color: 'orange' } : { color: 'orange' };
          // return { textAlign: 'center' };
        } else {
          return {};
          // return { textAlign: 'center' };
        }
      },
    },
  ],
});

onBeforeUnmount(() => {
  // Remove the resize event listener when the component is destroyed
  window.removeEventListener('resize', handleResize);
});
onBeforeMount(() => {
  getData();
});

onMounted(() => {
  window.addEventListener('resize', handleResize);
  handleResize();
});

const formData = ref({
  stdYear: '',
  evtEmpCd: '',
  workNo: 0,
  returnDoc: '',
  status: '',
});

const selectedRows = ref([]);
const sendCount = ref({
  status_1: 0,
  status_3: 0,
});

const onSelectionChanged = event => {
  selectedRows.value = event.api.getSelectedRows();
  // console.log('sel: ', JSON.stringify(selectedRows.value));
  if (selectedRows.value.length === 1) {
    if (selectedRows.value[0].status !== '') {
      getDataSelectList(selectedRows.value[0]);
    } else {
      rowData.rowsSel = [];
    }
  }
};

// ======================================================
const screenSizeHeight = ref(0);
const myTweak = offset => {
  screenSizeHeight.value = offset;
  return { minHeight: offset ? `calc(100vh - ${offset}px)` : '100vh' };
};
const handleResize = () => {
  contentZoneHeight.value = window.innerHeight - screenSizeHeight.value - 730;
  // alert(contentZoneHeight.value + ' =  ' + window.innerHeight + '  -  ' + screenSizeHeight.value + ' - 730');
};
// ======================================================

const sendAuthRequestCancel = () => {
  $q.dialog({
    dark: true,
    title: '승인대기 취소하기',
    message: '선택된 자료의 승인요청을 취소 하시겠습니까? ',
    ok: {
      push: true,
      color: 'orange',
    },
    cancel: {
      push: true,
      color: 'grey-7',
    },
    // persistent: true,
  })
    .onOk(() => {
      isSaveFg = 'S';

      let iu = [];
      let iuD = [];

      let formData = {};
      formData.stdYear = selectedRows.value[0].stdYear;
      formData.evtEmpCd = selectedRows.value[0].evtEmpCd;
      formData.status = '0';
      formData.acceptYn = 'N';
      let tmpJson = '{"mode": "' + isSaveFg + '","data":' + JSON.stringify(formData) + '}';
      iu.push(tmpJson);
      saveDataAndHandleResult(jsonUtil.jsonFiller(iu, iuD));
    })
    .onCancel(() => {})
    .onDismiss(() => {
      // 확인/취소 모두 실행되었을때
    });
};

const saveDataSendAllSection = (resStatus, resAcceptYn, resText, resCnt) => {
  $q.dialog({
    dark: true,
    title: resText,
    message: '선택된 ' + resCnt + '건 자료를 모두 승인 하시겠습니까? ',
    ok: {
      push: true,
      color: 'orange',
    },
    cancel: {
      push: true,
      color: 'grey-7',
    },
    // persistent: true,
  })
    .onOk(() => {
      // 승인요청 시
      isSaveFg = 'S';

      let iu = [];
      let iuD = [];
      let formData = {};
      formData.stdYear = selectedRows.value[0].stdYear;
      formData.evtEmpCd = selectedRows.value[0].evtEmpCd;
      formData.status = resStatus;
      formData.acceptYn = resAcceptYn;
      let tmpJson = '{"mode": "' + isSaveFg + '","data":' + JSON.stringify(formData) + '}';
      iu.push(tmpJson);

      saveDataAndHandleResult(jsonUtil.jsonFiller(iu, iuD));
    })
    .onCancel(() => {})
    .onDismiss(() => {
      // 확인/취소 모두 실행되었을때
    });
};
const saveDataReturnAllSection = () => {
  $q.dialog({
    dark: true,
    title: '반려하기',
    message: '자료를 모두 반려 하시겠습니까? ',
    ok: {
      push: true,
      color: 'orange',
    },
    cancel: {
      push: true,
      color: 'grey-7',
    },
    // persistent: true,
  })
    .onOk(() => {
      isSaveFg = 'R';

      let iu = [];
      let iuD = [];
      let formData = {};
      formData.stdYear = selectedRows.value[0].stdYear;
      formData.evtEmpCd = selectedRows.value[0].evtEmpCd;
      formData.status = '2';
      formData.returnDoc = textReturnDoc.value;
      let tmpJson = '{"mode": "' + isSaveFg + '","data":' + JSON.stringify(formData) + '}';
      iu.push(tmpJson);
      saveDataAndHandleResult(jsonUtil.jsonFiller(iu, iuD));
    })
    .onCancel(() => {})
    .onDismiss(() => {
      // 확인/취소 모두 실행되었을때
    });
};

// **************************************************************//
// ***** DataBase 연결부분    *************************************//
// **************************************************************//

// ***** 목표승인대상자 집계리스트 가져오기 부분  *****************************//
const getData = async () => {
  try {
    const response = await api.post('/api/hpe/hpe2010_list', { paramSetYear: storeYear.setYear, paramEvsEmpCd: storeUser.setEmpCd });
    rowData.rows = response.data.data;
    // console.log('aa : ', JSON.stringify(response.data.data));
    if (rowData.rows.length === 0) {
      minHeight.value = 220;
    }
    const calculatedHeight = rowData.rows.length * rowHeight;
    gridHeight.value = minHeight.value + calculatedHeight;

    // console.log('getData : ', JSON.stringify(rowData.rows));
  } catch (error) {
    console.error('Error fetching users:', error);
  }
};

// ***** 목표승인대상자 승인대상자료 목록 자료 가져오기 부분  *****************************//
const statusCheck = ref({
  cancelHide: false, // 승인대기취소
  sendHide: false, // 승인
  sendCancelHide: false, // 승인취소
  returnHide: false, // 반려상태
  acceptUpdate: false, // 열람상태
});
const getDataSelectList = async resRowSel => {
  try {
    const response = await api.post('/api/hpe/hpe2010_select_list', {
      paramSetYear: resRowSel.stdYear,
      paramEvsEmpCd: resRowSel.evsEmpCd,
      paramEvtEmpCd: resRowSel.evtEmpCd,
    });
    rowData.rowsSel = response.data.data;
    // alert(rowData.rowsSel.length);

    // 자료 열람확인 처리
    textReturnDoc.value = null;
    statusCheck.value.cancelHide = false;
    statusCheck.value.sendHide = false;
    statusCheck.value.sendCancelHide = false;
    statusCheck.value.returnHide = false;
    statusCheck.value.acceptUpdate = false;

    for (let i = 0; i < rowData.rowsSel.length; i++) {
      if (rowData.rowsSel[i].status === '1' && rowData.rowsSel[i].acceptYn !== 'Y') {
        statusCheck.value.acceptUpdate = true;
      }
      if (rowData.rowsSel[i].status === '1' && rowData.rowsSel[i].acceptYn === 'Y') {
        statusCheck.value.sendHide = true;
        statusCheck.value.cancelHide = true;
        textReturnDoc.value = rowData.rowsSel[i].returnDoc;
      }
      if (rowData.rowsSel[i].status === '2') {
        statusCheck.value.returnHide = true;
        textReturnDoc.value = rowData.rowsSel[i].returnDoc;
      }
      if (rowData.rowsSel[i].status === '3' && rowData.rowsSel[i].acceptYn !== 'Y') {
        statusCheck.value.sendCancelHide = true;
      }
    }
    if (statusCheck.value.acceptUpdate) {
      acceptCheckSaveSection(resRowSel.stdYear, resRowSel.evtEmpCd);
      statusCheck.value.sendHide = true;
      statusCheck.value.cancelHide = true;
    }
    // 자료 열람확인 처리 끝
  } catch (error) {
    console.error('Error fetching users:', error);
  }
};

// ***** 자료저장 및 삭제 처리부분 *****************************//
// saveStatus = 0=수정성공 1=신규성공 2=삭제성공 3=수정에러 4=시스템에러
const saveDataAndHandleResult = resFormData => {
  // console.log('form data : ', JSON.stringify(resFormData));
  api
    .post('/api/hpe/hpe2010_save', resFormData)
    .then(res => {
      if (isSaveFg !== 'A') {
        let saveStatus = {};
        saveStatus.rtn = res.data.rtn;
        saveStatus.rtnMsg = res.data.rtnMsg;
        notifySave.notifyView(saveStatus);
        getData();
        rowData.rowsSel = [];
        statusCheck.value.cancelHide = false;
        statusCheck.value.sendHide = false;
        statusCheck.value.sendCancelHide = false;
        statusCheck.value.acceptUpdate = false;
      }
    })
    .catch(error => {
      console.log('error: ', error);
    });
};

// **************************************************************//
// ***** DataBase 연결부분 끝  *************************************//
// **************************************************************//

// **************************************************************//
// ***** View Accept Check Save  ********************************//
// **************************************************************//
const acceptCheckSaveSection = (resStdYear, resEvtEmpCd) => {
  isSaveFg = 'A';

  let iu = [];
  let iuD = [];

  let formData = {};
  formData.stdYear = resStdYear;
  formData.empCd = resEvtEmpCd;
  formData.acceptYn = 'Y';
  let tmpJson = '{"mode": "' + isSaveFg + '","data":' + JSON.stringify(formData) + '}';
  iu.push(tmpJson);

  saveDataAndHandleResult(jsonUtil.jsonFiller(iu, iuD));
};

const byteCount = ref(0);
const updateByteCount = val => {
  if (val) {
    byteCount.value = commUtil.textByteLength(val);
    if (byteCount.value > 200) {
      alert('한글 200자 까지 가능합니다.');
    }
  }
};

const gridOptions = {
  localeText: { noRowsToShow: '조회 결과가 없습니다.' },
};
const gridOptionsSel = {
  suppressRowClickSelection: true, // Disable row selection on click
  rowSelection: 'multiple',
  isRowSelectable: function (node) {
    return node.data.status === '1' || node.data.status === '3'; // Only rows with status '1' are selectable
  },
  getRowStyle: params => {
    if (params.node.rowPinned) {
      return { backgroundColor: 'lightblue' };
    }
  },
  localeText: { noRowsToShow: '조회 결과가 없습니다.' },
};
</script>
<style lang="scss" scoped></style>

<template>
  <q-page class="q-pa-xs-xs q-pa-sm-md" :style-fn="myTweak">
    <q-card class="q-pa-sm">
      <div class="row">
        <div class="col-xs-12 col-sm-12 col-lg-8">
          <div class="row q-col-gutter-x-sm">
            <div class="col-xs-12 col-sm-6">
              <q-banner rounded :class="$q.dark.isActive ? 'bg-grey-9' : 'bg-grey-3'" style="height: 100%">
                <template v-slot:avatar>
                  <q-icon name="menu_book" color="primary" size="md" />
                </template>
                <span class="text-subtitle1 text-bold"> 목표설정에 대한 승인작업입니다.</span><br />
                1. <span class="text-teal text-bold">승인대기</span> 자료만 승인하실 수 있습니다.<br />
                2. <span class="text-teal text-bold">승인반려</span>시 반려사유를 작성합니다.<br />
              </q-banner>
            </div>
            <div class="col-xs-12 col-sm-6 q-pt-xs-xs">
              <q-banner rounded :class="$q.dark.isActive ? 'bg-grey-9' : 'bg-grey-3'">
                <div class="row">
                  <div class="col-4">
                    <q-chip>
                      <q-avatar color="blue" text-color="white">{{ viewStatus.totalCnt }}</q-avatar>
                      전체건수
                    </q-chip>
                  </div>
                  <div class="col-4">
                    <q-chip>
                      <q-avatar color="orange" text-color="white">{{ viewStatus.status_1 }}</q-avatar>
                      승인대기
                    </q-chip>
                  </div>
                  <div class="col-4">
                    <q-chip>
                      <q-avatar color="grey" text-color="white">{{ viewStatus.status_3 }}</q-avatar>
                      승인완료
                    </q-chip>
                  </div>
                </div>
                <div class="row">
                  <div class="col-4">
                    <q-chip>
                      <q-avatar color="teal" text-color="white">{{ viewStatus.status_0 }}</q-avatar>
                      진행중
                    </q-chip>
                  </div>
                  <div class="col-4">
                    <q-chip>
                      <q-avatar color="red" text-color="white">{{ viewStatus.status_2 }}</q-avatar>
                      승인반려
                    </q-chip>
                  </div>
                  <div class="col-4">
                    <q-chip>
                      <q-avatar color="grey" text-color="white">{{ viewStatus.status_9 }}</q-avatar>
                      그외진행
                    </q-chip>
                  </div>
                </div>
              </q-banner>
            </div>
          </div>
        </div>
        <div class="col-xs-12 col-sm-12 col-lg-4 q-my-sm">
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
        <div class="col-xs-12 col-md-12 col-lg-6">
          <q-card class="q-pa-sm">
            <q-toolbar class="row q-pa-none">
              <q-avatar color="red" text-color="white" size="md">1번</q-avatar>
              <q-space />
              <q-btn outline color="grey" dense @click="getData"
                ><q-icon name="refresh" size="xs" class="q-mr-xs" />
                다시 불러오기
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
          </q-card>
        </div>
        <div class="col-xs-12 col-md-12 col-lg-6">
          <q-card class="q-pa-sm">
            <q-toolbar class="row q-pa-none">
              <q-avatar color="red" text-color="white" size="md">2번</q-avatar>
              <q-space />
              <div class="row q-gutter-x-sm">
                <q-btn
                  v-if="sendCount.status_3 > 1"
                  outline
                  color="teal"
                  dense
                  class="q-pr-md"
                  @click="saveDataSendAllSection('3', '전체승인취소하기', sendCount.status_3)"
                >
                  <q-badge color="orange" floating>{{ sendCount.status_3 }}</q-badge>
                  <q-icon name="check" size="xs" class="q-mr-xs" />
                  전체승인취소
                </q-btn>
                <q-btn
                  v-if="sendCount.status_1 > 1"
                  outline
                  color="blue"
                  dense
                  class="q-pr-md"
                  @click="saveDataSendAllSection('1', '전체승인하기', sendCount.status_1)"
                >
                  <q-badge color="orange" floating>{{ sendCount.status_1 }}</q-badge>
                  <q-icon name="check" size="xs" class="q-mr-xs" />
                  전체승인
                </q-btn>
                <q-btn v-if="sendCount.status_1 > 1" outline color="red" dense class="q-pr-md" @click="sendReturnAllDialog">
                  <q-badge color="orange" floating>{{ sendCount.status_1 }}</q-badge>
                  <q-icon name="reply" size="xs" class="q-mr-xs" />
                  전체반려
                </q-btn>
              </div>
            </q-toolbar>
            <div :key="gridKey" :style="{ height: gridHeightSelect + 'px' }">
              <ag-grid-vue
                style="width: 100%; height: 100%"
                :class="$q.dark.isActive ? 'ag-theme-alpine-dark' : 'ag-theme-alpine'"
                :columnDefs="columnDefs.columns"
                :rowData="rowData.rowsSel"
                :defaultColDef="defaultColDef.columns"
                @selection-changed="onSelectionChangedSel"
                @grid-ready="onGridReadySel"
                :grid-options="gridOptionsSel"
              >
              </ag-grid-vue>
            </div>
          </q-card>
        </div>
      </div>
      <q-separator spaced />
      <q-card class="q-pa-xs">
        <!--        <q-scroll-area :style="contentZoneStyle">-->
        <div class="row">
          <q-card flat bordered style="width: 100%" v-for="data in selectedRowsSel" :key="data.workNo" class="q-mb-sm">
            <div class="row">
              <q-card class="col-xs-12 col-sm-1">
                <div class="bg-deep-orange-3 text-center text-subtitle2 text-bold q-px-xs">순번</div>
                <div class="text-center q-pa-xs" :class="$q.screen.xs ? '' : 'row flex-center'" style="height: 100%">
                  {{ data.seq }}
                </div>
              </q-card>
              <q-card class="col-xs-12 col-sm-5">
                <div class="bg-deep-orange-3 text-center text-subtitle2 text-bold q-px-xs">목표설정</div>
                <div class="q-pa-xs" v-html="data.targetDoc"></div>
              </q-card>
              <q-card class="col-xs-12 col-sm-3">
                <div class="bg-deep-orange-3 text-center text-subtitle2 text-bold q-px-xs">기준설정</div>
                <div class="q-pa-xs">
                  <span class="q-px-sm"> 1. {{ data.evaS }}<br /> </span>
                  <span class="q-px-sm"> 2. {{ data.evaA }}<br /> </span>
                  <span class="q-px-sm"> 3. {{ data.evaB }}<br /> </span>
                  <span class="q-px-sm"> 4. {{ data.evaC }}<br /> </span>
                  <span class="q-px-sm"> 5. {{ data.evaD }} </span>
                </div>
              </q-card>
              <q-card class="col-xs-12 col-sm-1">
                <div class="bg-deep-orange-3 text-center text-subtitle2 text-bold q-px-xs">가중치</div>
                <div class="text-center q-pa-xs" :class="$q.screen.xs ? '' : 'row flex-center'" style="height: 100%">
                  {{ data.weight }}
                </div>
              </q-card>
              <div class="col-xs-12 col-sm-2 q-pa-xs flex-center row">
                <q-card-section vertical>
                  <div class="row q-gutter-y-sm" :class="$q.screen.xs ? '' : 'row flex-center'" style="height: 100%">
                    <q-btn
                      :color="data.status === '1' ? 'blue' : 'teal'"
                      outline
                      @click="saveDataSendSection(data.stdYear, data.evtEmpCd, data.workNo, data.status)"
                    >
                      <q-icon name="check" size="xs" class="q-mr-xs" />
                      <span v-if="data.status === '1'">목표승인</span><span v-if="data.status === '3'">승인취소</span>
                    </q-btn>
                    <!--                      {{ data.stdYear }} - {{ data.evtEmpCd }} - {{ data.workNo }}-->
                    <q-btn
                      v-if="data.status !== '3'"
                      outline
                      color="red"
                      class="q-ml-xs-xs q-ml-sm-none"
                      @click="sendReturnDialog(data.stdYear, data.evtEmpCd, data.workNo)"
                    >
                      <q-icon name="reply" size="xs" class="q-mr-xs" />
                      목표반려
                    </q-btn>
                  </div>
                </q-card-section>
              </div>
            </div>
          </q-card>
        </div>
        <!--        </q-scroll-area>-->
      </q-card>
    </q-card>

    <q-dialog persistent v-model="isDialogVisible">
      <q-card flat bordered style="max-width: 450px; width: 100%">
        <q-bar>
          <q-icon name="list_alt" />
          <div>목표반려사유 등록</div>

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
                v-model="formData.returnDoc"
                :color="$q.dark.isActive ? 'orange' : 'teal'"
                :label-color="$q.dark.isActive ? 'orange' : 'teal'"
                label="반려사유"
                :rows="5"
                :autogrow="true"
              />
            </q-card-section>
          </q-card>
        </q-form>

        <q-separator size="2px" color="grey" />

        <q-card-actions align="right" class="q-pa-md">
          <q-btn color="red" v-close-popup @click="saveDataReturnSection"><q-icon class="q-mr-xs" name="save" size="xs" /> 반려하기 </q-btn>
          <q-btn color="grey" v-close-popup><q-icon class="q-mr-xs" name="close" size="xs" /> 닫기 </q-btn>
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog persistent v-model="isDialogAllVisible">
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
              />
            </q-card-section>
          </q-card>
        </q-form>

        <q-separator size="2px" color="grey" />

        <q-card-actions align="right" class="q-pa-md">
          <q-btn color="red" v-close-popup @click="saveDataReturnAllSection"><q-icon class="q-mr-xs" name="save" size="xs" /> 전체반려하기 </q-btn>
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
const storeUser = useUserInfoStore();
const storeYear = useYearInfoStore();

const setEvsCd = ref('2011101'); // 성과평가 공통코드

const isDialogVisible = ref(false);
const isDialogAllVisible = ref(false);
const textReturnDoc = ref(null);
const sendReturnDialog = (resStdYear, resEmpCd, resWorkNo) => {
  if (formData.value.returnDoc) {
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
        formData.value.returnDoc = null;
      })
      .onCancel(() => {})
      .onDismiss(() => {
        // 확인/취소 모두 실행되었을때
        isDialogVisible.value = true;
        formData.value.stdYear = resStdYear;
        formData.value.workNo = resWorkNo;
        formData.value.evtEmpCd = resEmpCd;
      });
  } else {
    isDialogVisible.value = true;
    formData.value.stdYear = resStdYear;
    formData.value.workNo = resWorkNo;
    formData.value.evtEmpCd = resEmpCd;
  }
};

const sendReturnAllDialog = () => {
  formData.value.returnDoc = null;
  isDialogVisible.value = true;
};

const rowData = reactive({ rows: [], rowsSel: [] });

// grid Height 자동처리부분
const gridHeight = ref(300); // 초기 높이
const gridHeightSelect = ref(135); // 초기 높이
const rowHeight = 45; // 행당 높이 (예: 25px)
const minHeight = ref(90); // 최소 높이 (예: 300px) rowHeight의 3배
const minHeightSel = ref(135); // 최소 높이 (예: 300px) rowHeight의 3배

const $q = useQuasar();
let isSaveFg = null;
const gridKey = ref(0);

const contentZoneHeight = ref(300);
const contentZoneStyle = computed(() => ({
  height: `${contentZoneHeight.value}px`,
}));

const gridApi = ref(null);
const gridApiSel = ref(null);
const onGridReady = params => {
  gridApi.value = params.api;
  gridApi.value.setGridOption('headerHeight', 45);
  gridApi.value.setGridOption('rowHeight', 45);
  gridApi.value.deselectAll();
};
const onGridReadySel = params => {
  gridApiSel.value = params.api;
  gridApiSel.value.setGridOption('headerHeight', 45);
  gridApiSel.value.setGridOption('rowHeight', 45);
  if (rowData.rowsSel.length > 0) {
    totalComputeWeight();
  }
  gridApiSel.value.deselectAll();
};
const defaultColDef = reactive({
  group: {
    flex: 1,
    sortable: true,
    filter: true,
    floatingFilter: false,
    editable: false,
  },
  columns: {
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
      headerName: '',
      field: '',
      sortable: false,
      filter: false,
      maxWidth: 60,
      minWidth: 60,
      pinned: 'left',
      cellStyle: { textAlign: 'center' },
      checkboxSelection: true,
      headerCheckboxSelection: true,
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
      marryChildren: true,
      children: [
        {
          headerName: '작성',
          field: 'authCnt0',
          minWidth: 80,
          maxWidth: 80,
          cellStyle: params => {
            if (params.data.authCnt0 > 0) {
              // return $q.dark.isActive ? { color: 'teal', textAlign: 'center' } : { color: 'teal', textAlign: 'center' };
              return { textAlign: 'center' };
            } else {
              return { textAlign: 'center' };
            }
          },
        },
        {
          headerName: '대기',
          field: 'authCnt1',
          minWidth: 80,
          maxWidth: 80,
          cellStyle: params => {
            if (params.data.authCnt1 > 0) {
              // return $q.dark.isActive ? { color: 'orange', textAlign: 'center' } : { color: 'blue', textAlign: 'center' };
              return { textAlign: 'center' };
            } else {
              return { textAlign: 'center' };
            }
          },
        },
        {
          headerName: '반려',
          field: 'authCnt2',
          minWidth: 80,
          maxWidth: 80,
          cellStyle: params => {
            if (params.data.authCnt2 > 0) {
              // return $q.dark.isActive ? { color: 'red', textAlign: 'center' } : { color: 'red', textAlign: 'center' };
              return { textAlign: 'center' };
            } else {
              return { textAlign: 'center' };
            }
          },
        },
        {
          headerName: '승인',
          field: 'authCnt3',
          minWidth: 80,
          maxWidth: 80,
          cellStyle: params => {
            if (params.data.authCnt3 > 0) {
              // return $q.dark.isActive ? { color: 'blue', textAlign: 'center' } : { color: 'blue', textAlign: 'center' };
              return { textAlign: 'center' };
            } else {
              return { textAlign: 'center' };
            }
          },
        },
        {
          headerName: '그외',
          field: 'authCnt9',
          minWidth: 80,
          maxWidth: 80,
          cellStyle: params => {
            if (params.data.authCnt9 > 0) {
              // return $q.dark.isActive ? { color: 'blue', textAlign: 'center' } : { color: 'blue', textAlign: 'center' };
              return { textAlign: 'center' };
            } else {
              return { textAlign: 'center' };
            }
          },
        },
      ],
    },
  ],
  columns: [
    {
      headerName: '',
      field: '',
      sortable: false,
      filter: false,
      maxWidth: 60,
      minWidth: 60,
      pinned: 'left',
      cellStyle: { textAlign: 'center' },
      checkboxSelection: params => params.data.status === '1' || params.data.status === '3',
      headerCheckboxSelection: true,
    },
    {
      headerName: '순번',
      field: 'seq',
      minWidth: 80,
      maxWidth: 80,
      resizable: true,
    },
    {
      headerName: '목표',
      field: 'targetDoc',
      minWidth: 100,
      resizable: true,
    },
    {
      headerName: '가중치',
      field: 'weight',
      minWidth: 95,
      maxWidth: 95,
      resizable: true,
    },
    {
      headerName: '진행상태',
      field: 'statusNm',
      minWidth: 110,
      maxWidth: 110,
      cellStyle: params => {
        switch (params.data.status) {
          case '0':
            return null;
          case '1':
            return $q.dark.isActive ? { color: 'orange' } : { color: 'orange' };
          case '2':
            return $q.dark.isActive ? { color: 'red' } : { color: 'red' };
          case '3':
            return $q.dark.isActive ? { color: 'pink' } : { color: 'purple' };
          case '4':
            return $q.dark.isActive ? { color: 'lime' } : { color: 'teal' };
          case '5':
            return $q.dark.isActive ? { color: 'cyan' } : { color: 'blue' };
          default:
            return null;
        }
      },
    },
  ],
});
let totalWeight = 0;
const totalComputeWeight = () => {
  console.log('row : ', rowData.rowsSel);
  totalWeight = 0;
  totalWeight = rowData.rowsSel.reduce((sum, item) => sum + item.weight, 0);
  const pinnedBottomRowData = [
    {
      targetDoc: '가중치 합계',
      weight: totalWeight,
    },
  ];
  gridApiSel.value.setPinnedBottomRowData(pinnedBottomRowData);
};

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
const selectedRowsSel = ref([]);
const onSelectionChanged = event => {
  selectedRows.value = event.api.getSelectedRows();
  console.log('sel: ', JSON.stringify(selectedRows.value));
  if (selectedRows.value.length > 0) {
    getDataSelectList(selectedRows.value[0].stdYear, selectedRows.value[0].evsEmpCd, selectedRows.value[0].evtEmpCd);
  } else {
    getDataSelectList();
  }
};
const sendCount = ref({
  status_1: 0,
  status_3: 0,
});
const onSelectionChangedSel = event => {
  selectedRowsSel.value = event.api.getSelectedRows();

  sendCount.value.status_1 = 0;
  sendCount.value.status_3 = 0;
  event.api.forEachNodeAfterFilterAndSort(node => {
    if (node.isSelected()) {
      if (node.data.status === '1') {
        sendCount.value.status_1++;
      }
      if (node.data.status === '3') {
        sendCount.value.status_3++;
      }
    }
  });
  selectedRowsSel.value.forEach(item => {
    item.targetDoc = item.targetDoc.replace(/\n/g, '<br>');
    item.workDoc = item.workDoc.replace(/\n/g, '<br>');
  });
  console.log('select : ', JSON.stringify(selectedRowsSel.value));
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

const saveDataSendSection = (resStdYear, resEmpCd, resWorkNo, resStatus) => {
  $q.dialog({
    dark: true,
    title: '승인하기',
    message: '목표요청 자료를 승인합니다. ',
    // persistent: true,
  })
    .onOk(() => {
      if (resStatus === '1') {
        formData.value.status = '3'; // 승인취소
      } else {
        formData.value.status = '1'; // 목표승인
      }
      formData.value.stdYear = resStdYear;
      formData.value.evtEmpCd = resEmpCd;
      formData.value.workNo = resWorkNo;
      saveDataAndHandleResult(jsonUtil.dataJsonParse('S', formData.value));
    })
    .onCancel(() => {})
    .onDismiss(() => {
      // 확인/취소 모두 실행되었을때
    });
  // console.log('save data::: ', JSON.stringify(formData.value));
};

const saveDataReturnSection = () => {
  $q.dialog({
    dark: true,
    title: '반려하기',
    message: '목표요청 자료를 반려합니다. ',
    // persistent: true,
  })
    .onOk(() => {
      formData.value.status = '2';
      saveDataAndHandleResult(jsonUtil.dataJsonParse('R', formData.value));
    })
    .onCancel(() => {})
    .onDismiss(() => {
      // 확인/취소 모두 실행되었을때
    });
  // console.log('save data::: ', JSON.stringify(formData.value));
};

const saveDataSendAllSection = (resStatus, resText, resCnt) => {
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
      for (let i = 0; i < selectedRowsSel.value.length; i++) {
        // 모두 승인차리
        if (selectedRowsSel.value[i].status === resStatus) {
          if (resStatus === '1') {
            selectedRowsSel.value[i].status = '3';
            let tmpJson = '{"mode": "' + isSaveFg + '","data":' + JSON.stringify(selectedRowsSel.value[i]) + '}';
            // console.log('update send : ', JSON.stringify(selectedRowsSel.value[i]));
            iu.push(tmpJson);
          } else if (resStatus === '3') {
            selectedRowsSel.value[i].status = '1';
            let tmpJson = '{"mode": "' + isSaveFg + '","data":' + JSON.stringify(selectedRowsSel.value[i]) + '}';
            // console.log('update send : ', JSON.stringify(selectedRowsSel.value[i]));
            iu.push(tmpJson);
          }
        }
      }
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
    title: '전체 반려하기',
    message: '선택된 자료를 모두 반려 하시겠습니까? ',
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
      isSaveFg = 'R';

      let iu = [];
      let iuD = [];
      for (let i = 0; i < selectedRowsSel.value.length; i++) {
        // 모두 승인차리
        if (selectedRowsSel.value[i].status === '1') {
          selectedRowsSel.value[i].status = '2';
          selectedRowsSel.value[i].returnDoc = textReturnDoc.value;
          let tmpJson = '{"mode": "' + isSaveFg + '","data":' + JSON.stringify(selectedRowsSel.value[i]) + '}';
          console.log('update send : ', JSON.stringify(selectedRowsSel.value[i]));
          iu.push(tmpJson);
        }
      }
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
const viewStatus = ref({
  totalCnt: 0,
  status_0: 0,
  status_1: 0,
  status_2: 0,
  status_3: 0,
  status_9: 0,
});
const getData = async () => {
  try {
    const response = await api.post('/api/hpe/hpe2010_list', { paramSetYear: storeYear.setYear, paramEmpCd: storeUser.setEmpCd });
    rowData.rows = response.data.data;
    // console.log('aa : ', JSON.stringify(response.data.data));
    if (rowData.rows.length === 0) {
      minHeight.value = 220;
    }
    const calculatedHeight = rowData.rows.length * rowHeight;
    gridHeight.value = minHeight.value + calculatedHeight;

    viewStatus.value.totalCnt = 0;
    viewStatus.value.status_0 = 0;
    viewStatus.value.status_1 = 0;
    viewStatus.value.status_2 = 0;
    viewStatus.value.status_3 = 0;
    viewStatus.value.status_9 = 0;
    for (let i = 0; i < rowData.rows.length; i++) {
      viewStatus.value.totalCnt +=
        rowData.rows[i].authCnt0 + rowData.rows[i].authCnt1 + rowData.rows[i].authCnt2 + rowData.rows[i].authCnt3 + rowData.rows[i].authCnt9;
      viewStatus.value.status_0 += rowData.rows[i].authCnt0;
      viewStatus.value.status_1 += rowData.rows[i].authCnt1;
      viewStatus.value.status_2 += rowData.rows[i].authCnt2;
      viewStatus.value.status_3 += rowData.rows[i].authCnt3;
      viewStatus.value.status_9 += rowData.rows[i].authCnt9;
    }

    // console.log('getData : ', JSON.stringify(rowData.rows));
  } catch (error) {
    console.error('Error fetching users:', error);
  }
};

// ***** 목표승인대상자 승인대상자료 목록 자료 가져오기 부분  *****************************//
const getDataSelectList = async (resStdYear, resEvsEmpCd, resEvtEmpCd) => {
  try {
    const response = await api.post('/api/hpe/hpe2010_select_list', {
      paramSetYear: resStdYear,
      paramEvsEmpCd: resEvsEmpCd,
      paramEvtEmpCd: resEvtEmpCd,
    });
    rowData.rowsSel = response.data.data;
    // alert(rowData.rowsSel.length);
    if (rowData.rowsSel.length > 0) {
      minHeightSel.value = 90;
    } else {
      minHeightSel.value = 135;
    }
    const calculatedHeight = rowData.rowsSel.length * rowHeight;
    gridHeightSelect.value = minHeightSel.value + calculatedHeight;

    gridKey.value += 1;
    // console.log('getData : ', JSON.stringify(rowData.rows));
  } catch (error) {
    console.error('Error fetching users:', error);
  }
};

// ***** 자료저장 및 삭제 처리부분 *****************************//
// saveStatus = 0=수정성공 1=신규성공 2=삭제성공 3=수정에러 4=시스템에러
const saveDataAndHandleResult = resFormData => {
  console.log('form data : ', JSON.stringify(resFormData));
  api
    .post('/api/hpe/hpe2010_save', resFormData)
    .then(res => {
      let saveStatus = {};
      saveStatus.rtn = res.data.rtn;
      saveStatus.rtnMsg = res.data.rtnMsg;
      notifySave.notifyView(saveStatus);
      getData();
    })
    .catch(error => {
      console.log('error: ', error);
    });
};

// **************************************************************//
// ***** DataBase 연결부분 끝  *************************************//
// **************************************************************//

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

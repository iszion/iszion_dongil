<template>
  <q-page class="q-pa-xs-xs q-pa-sm-md" :style-fn="myTweak">
    <!-- contents zone -->
    <div class="row q-col-gutter-md">
      <!-- contents List -->
      <div v-if="isScreenVisible" class="col-12">
        <q-form class="">
          <q-card bordered>
            <!-- contents list title bar -->
            <q-bar class="q-px-sm">
              <q-icon name="list_alt" />
              <span class="text-subtitle2 q-px-sm">자료 조회/조정/삭제</span>
              <q-space />
              <q-chip v-if="isShowStatusEdit" size="sm" outline :color="statusEdit.color" class="q-px-md">
                <q-icon :name="statusEdit.icon" class="q-mr-sm" size="15px" /> {{ statusEdit.message }}
              </q-chip>
            </q-bar>
            <!--  end of contents list title bar -->
            <q-card-actions align="right" class="q-pa-none">
              <q-toolbar>
                <q-btn outline color="positive" dense @click="getData"><q-icon name="refresh" size="xs" class="q-mr-xs" /> 다시 불러오기 </q-btn>
                <q-space />
                <div class="q-gutter-xs">
                  <q-btn outline color="positive" dense @click="addDataSection"><q-icon name="add" size="xs" /> 신규 </q-btn>
                  <q-btn v-if="formData.stdYear" outline color="primary" dense @click="saveDataSection"><q-icon name="save" size="xs" /> 저장 </q-btn>
                  <q-btn v-if="selectedRows.length > 0" outline color="negative" dense @click="deleteDataSection">
                    <q-icon name="delete" size="xs" /> 삭제
                  </q-btn>
                </div>
              </q-toolbar>
            </q-card-actions>

            <q-separator size="3px" />

            <q-card-section class="q-pa-none">
              <q-card flat bordered class="q-ma-xs">
                <div class="row">
                  <div class="col-12 col-sm-5 q-pa-md q-col-gutter-y-lg">
                    <div class="row q-gutter-xl">
                      <div style="max-width: 100px">
                        <q-input
                          ref="stdYearFocus"
                          stack-label
                          v-model="formData.stdYear"
                          type="text"
                          label="기준년도"
                          label-color="orange"
                          :disable="formDisable"
                          :rules="[val => (val >= '2000' && val <= '2100') || '2000년 ~ 2100년']"
                          class="custom-font-size"
                        >
                          <template v-slot:append>
                            <q-avatar class="q-mt-md"> 년 </q-avatar>
                          </template>
                        </q-input>
                      </div>

                      <div class="q-gutter-sm q-pt-lg">
                        <q-radio dense v-model="formData.stdFg" val="0" label="년" :disable="formDisable" />
                        <q-radio dense v-model="formData.stdFg" val="1" label="상반기" :disable="formDisable" />
                        <q-radio dense v-model="formData.stdFg" val="2" label="하반기" :disable="formDisable" />
                      </div>
                    </div>
                    <div class="row q-gutter-xl">
                      <q-input v-model="formData.sDay" type="date" label="기준시작일" label-color="orange" :disable="formDisable" />
                      <q-input v-model="formData.eDay" type="date" label="기준종료일" label-color="orange" :disable="formDisable" />
                    </div>
                  </div>
                  <q-space />

                  <div class="col-12 col-sm-6">
                    <q-separator v-if="$q.screen.xs" />
                    <q-list>
                      <q-item tag="label" v-ripple>
                        <q-item-section avatar>
                          <q-radio v-model="formData.locCh" val="0" color="teal" :disable="formDisable" />
                        </q-item-section>
                        <q-item-section>
                          <q-item-label :style="{ color: 'teal' }">평가진행오픈 준비중</q-item-label>
                          <q-item-label caption>
                            관리자가 평가작업을 진행 하기전 평가관련 자료를 준비하는 과정입니다.<br />
                            해당 작업을 선택하시면 관리자먄 작업을 진행 하실 수 있습니다.
                          </q-item-label>
                        </q-item-section>
                      </q-item>

                      <q-item tag="label" v-ripple>
                        <q-item-section avatar>
                          <q-radio v-model="formData.locCh" val="1" color="blue" :disable="formDisable" />
                        </q-item-section>
                        <q-item-section>
                          <q-item-label :style="{ color: 'blue' }">평가진행오픈</q-item-label>
                          <q-item-label caption> 모든 피평가자 또는 평가자의 작업을 진행 하실 수 있습니다.<br /> </q-item-label>
                        </q-item-section>
                      </q-item>

                      <q-item tag="label" v-ripple>
                        <q-item-section avatar>
                          <q-radio v-model="formData.locCh" val="2" color="red" :disable="formDisable" />
                        </q-item-section>
                        <q-item-section>
                          <q-item-label :style="{ color: 'red' }">평가마감진행</q-item-label>
                          <q-item-label caption>
                            평가진행을 종료하고 관리자가 마감작업을 진행합니다.<br />해당 작업을 선택 시 모든 자료는 조회만 가능합니다.
                          </q-item-label>
                        </q-item-section>
                      </q-item>

                      <q-item tag="label" v-ripple>
                        <q-item-section avatar top>
                          <q-radio v-model="formData.locCh" val="3" color="orange" :disable="formDisable" />
                        </q-item-section>
                        <q-item-section>
                          <q-item-label :style="{ color: 'orange' }">평가마감오픈</q-item-label>
                          <q-item-label caption>
                            모든 평가작업이 끝나고 각 평가에 대한 결과를 모든 직원들에게 오픈합니다.<br />
                            - 로그인 하면 본인의 결과를 대시보드에서 확인 하실 수 있습니다.
                          </q-item-label>
                        </q-item-section>
                      </q-item>
                    </q-list>
                  </div>
                </div>
              </q-card>
            </q-card-section>
          </q-card>
        </q-form>
      </div>
      <!--  end of contents list -->

      <!-- contents List -->
      <div class="col-12">
        <q-card bordered>
          <!-- contents list title bar -->
          <q-bar class="q-px-sm">
            <q-icon name="list_alt" />
            <span class="text-subtitle2 q-px-sm">품목정보 리스트</span>
            <q-space />
            <q-btn
              class="q-pa-xs"
              rounded
              color="grey"
              text-color="black"
              dense
              size="0.4rem"
              @click="isScreenVisibleProcess"
              :icon="isScreenVisible ? 'open_in_full' : 'close_fullscreen'"
            >
              <q-tooltip class="bg-amber text-black shadow-4" anchor="center left" self="center right">
                <q-icon name="open_in_full" size="0.8rem" />
                <strong v-if="isClassActive"> 펼치기 </strong>
                <strong v-else> 축소하기 </strong>
              </q-tooltip>
            </q-btn>
          </q-bar>
          <!--  end of contents list title bar -->
          <q-card-section class="q-pa-xs">
            <div :key="gridKey" :style="contentZoneStyle">
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
import { Notify, QBtn, QIcon, useQuasar } from 'quasar';
import { computed, onBeforeMount, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue';
import { api } from '/src/boot/axios';
import authHeader from 'boot/authHeader';
import { isEqual } from 'lodash';
import jsonUtil from 'src/js_comm/json-util';
import notifySave from 'src/js_comm/notify-save';
import commUtil from 'src/js_comm/comm-util';

const $q = useQuasar();

let isSaveFg = null;

const gridKey = ref(0);

window.dateFormatRendering = function dateFormatRendering(params) {
  return formatDate(params.value);
};

const statusEdit = reactive({
  icon: '',
  message: '',
  color: '',
});

const formDisable = ref(true);
const isScreenVisible = ref(true);
const isClassActive = ref(true);

const isScreenVisibleProcess = () => {
  isScreenVisible.value = !isScreenVisible.value;
  isScreenVisible.value ? (isClassActive.value = true) : (isClassActive.value = false);
};
const contentZoneHeight = ref(500);
const contentZoneStyle = computed(() => ({
  height: `${contentZoneHeight.value}px`,
}));

const gridApi = ref(null);
const rowData = reactive({ rows: [] });

const onGridReady = params => {
  gridApi.value = params.api;
  let firstNodeSet = false;
  params.api.forEachNode(node => {
    console.log('node: ', JSON.stringify(node.data));
    if (!firstNodeSet) {
      node.setSelected(true);
      firstNodeSet = true;
    }
  });
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
      headerName: '평가기준년도',
      field: 'stdYear',
      minWidth: 120,
    },
    {
      headerName: '평가기준구분',
      field: 'stdFgNm',
      minWidth: 120,
    },
    {
      headerName: '기간시작일',
      field: 'sDay',
      minWidth: 150,
      valueFormatter: dateFormatRendering,
    },
    {
      headerName: '기간종료일',
      field: 'eDay',
      minWidth: 150,
      valueFormatter: dateFormatRendering,
    },
    {
      headerName: '평가진행적용',
      field: 'locChNm',
      minWidth: 120,
      cellClassRules: {
        'loc-ch-0-teal': params => params.data.locCh === '0',
        'loc-ch-1-blue': params => params.data.locCh === '1',
        'loc-ch-2-red': params => params.data.locCh === '2',
        'loc-ch-3-orange': params => params.data.locCh === '3',
      },
    },
  ],
});

const oldFormData = ref(null);
const formData = ref({
  stdYear: '',
  stdFg: '',
  sDay: '',
  eDay: '',
  locCh: '',
});

const formDataInitialize = () => {
  formData.value.stdYear = '';
  formData.value.stdFg = '';
  formData.value.sDay = '';
  formData.value.eDay = '';
  formData.value.locCh = '';
};

const selectedRows = ref([]);
const isShowStatusEdit = ref(false);

const onSelectionChanged = event => {
  selectedRows.value = event.api.getSelectedRows();
  isShowStatusEdit.value = false;

  if (selectedRows.value.length === 1) {
    getDataSelect(selectedRows.value[0].stdYear, selectedRows.value[0].stdFg);
    isShowStatusEdit.value = true;
    statusEdit.icon = 'edit_note';
    statusEdit.message = '수정/삭제모드 입니다';
    statusEdit.color = 'accent';
    isSaveFg = 'U';
    formDisable.value = false;
  } else if (selectedRows.value.length > 1) {
    isSaveFg = 'D';
    isShowStatusEdit.value = true;
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

const screenSizeHeight = ref(0);
const myTweak = offset => {
  screenSizeHeight.value = offset;
  return { minHeight: offset ? `calc(100vh - ${offset}px)` : '100vh' };
};
const handleResize = () => {
  contentZoneHeight.value = window.innerHeight - screenSizeHeight.value - 490;
};
onBeforeUnmount(() => {
  // Remove the resize event listener when the component is destroyed
  window.removeEventListener('resize', handleResize);
});
onBeforeMount(() => {
  rowSelection.value = 'multiple';
  getData();
});
onMounted(() => {
  window.addEventListener('resize', handleResize);
  handleResize();
});

const stdYearFocus = ref(null);
const addDataSection = () => {
  gridApi.value.deselectAll();
  setTimeout(() => {
    formDataInitialize();
    oldFormData.value = formData;
    isShowStatusEdit.value = true;
    statusEdit.icon = 'edit';
    statusEdit.message = '신규입력모드 입니다';
    statusEdit.color = 'primary';
    isSaveFg = 'I';
    formDisable.value = false;

    formData.value.stdYear = String(commUtil.getTodayYear());
    formData.value.stdFg = '0';
    formData.value.sDay = String(commUtil.getTodayYear()) + '-01-01';
    formData.value.eDay = String(commUtil.getTodayYear()) + '-12-31';
    setTimeout(() => {
      stdYearFocus.value.focus();
    }, 100);
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
        let tmpJson = '{"mode":"D","data":' + JSON.stringify(selectedRows.value[i]) + '}';
        console.log('delete : ', JSON.stringify(selectedRows.value[i]));
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
  if (formData.value.locCh === null || formData.value.locCh === '') {
    $q.dialog({
      title: '오류',
      message: '평가진행상태를 선택하세요. ',
    })
      .onOk(() => {})
      .onCancel(() => {})
      .onDismiss(() => {
        // 확인/취소 모두 실행되었을때
      });
  } else {
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
      formData.value.sDay = reFormatDate(formData.value.sDay);
      formData.value.eDay = reFormatDate(formData.value.eDay);

      saveDataAndHandleResult(jsonUtil.dataJsonParse(isSaveFg, formData.value));

      formData.value.sDay = formatDate(formData.value.sDay);
      formData.value.eDay = formatDate(formData.value.eDay);
    }
  }
};

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

// **************************************************************//
// ***** DataBase 연결부분    *************************************//
// **************************************************************//

// ***** 사용자정보 목록 자료 가져오기 부분  *****************************//
const getData = async () => {
  try {
    const response = await api.post('/api/aux/aux1010_list', {}, { headers: authHeader() });
    rowData.rows = response.data.data;
    gridKey.value += 1;
  } catch (error) {
    console.error('Error fetching users:', error);
  }
};
// ***** 사용자정보 목록 자료 가져오기 부분  *****************************//

// ***** 사용자정보 선택된 자료 가져오기 부분  *****************************//
const getDataSelect = async (resStdYear, resStdFg) => {
  try {
    const response = await api.post('/api/aux/aux1010_select', { paramStdYear: resStdYear, paramStdFg: resStdFg }, { headers: authHeader() });
    formData.value = response.data.data[0];
    // oldFormData.value = JSON.parse(JSON.stringify(formData.value)); // 초기자료 저장
    console.log(JSON.stringify(formData.value));
    formData.value.sDay = formatDate(response.data.data[0].sDay);
    formData.value.eDay = formatDate(response.data.data[0].eDay);
    oldFormData.value = JSON.parse(JSON.stringify(formData.value)); // 초기자료 저장
  } catch (error) {
    console.error('Error fetching users:', error);
  }
};
// ***** 사용자정보 선택된 자료 가져오기 부분  *****************************//

// ***** 자료저장 및 삭제 처리부분 *****************************//
// saveStatus = 0=수정성공 1=신규성공 2=삭제성공 3=수정에러 4=시스템에러
const saveDataAndHandleResult = resFormData => {
  console.log('del ::: ', JSON.stringify(resFormData));
  api
    .post('/api/aux/aux1010_save', resFormData, { headers: authHeader() })
    .then(res => {
      let saveStatus = {};
      if (res.data.rtn === '0') {
        if (isSaveFg === 'I') {
          saveStatus.rtn = 1;
          saveStatus.rtn1 = res.data.rtnMsg1;
          saveStatus.rtn2 = '신규추가 완료';
          formData.value.oldStdYear = formData.value.stdYear;
          formData.value.oldStdFg = formData.value.stdFg;
          formData.value.sDay = reFormatDate(formData.value.sDay);
          formData.value.eDay = reFormatDate(formData.value.eDay);

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

          // selectedData[0] = { ...formData.value };
          selectedData[0].stdYear = formData.value.stdYear;
          selectedData[0].stdFg = formData.value.stdFg;
          selectedData[0].oldStdYear = formData.value.stdYear;
          selectedData[0].oldStdFg = formData.value.stdFg;
          selectedData[0].sDay = reFormatDate(formData.value.sDay);
          selectedData[0].eDay = reFormatDate(formData.value.eDay);
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
      getData();
    })
    .catch(error => {
      console.log('error: ', error);
    });
};

// **************************************************************//
// ***** DataBase 연결부분 끝  *************************************//
// **************************************************************//
</script>
<style lang="sass">
.loc-ch-0-teal
  color: teal
.loc-ch-1-blue
  color: blue
.loc-ch-2-red
  color: red
.loc-ch-3-orange
  color: orange
</style>
<style scoped>
.custom-font-size {
  font-size: 18px;
  font-weight: bold;
}
</style>

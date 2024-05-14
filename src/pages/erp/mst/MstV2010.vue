<template>
  <q-page class="q-pa-xs" :style-fn="myTweak">
    <!-- contents zone -->
    <div class="row q-pa-sm q-col-gutter-md">
      <!-- contents List -->
      <div class="col-12" :class="{ 'col-lg-9': isClassActive }">
        <q-card bordered>
          <!-- contents list title bar -->
          <q-bar class="q-px-sm">
            <q-icon name="list_alt" />
            <span class="text-subtitle2 q-px-sm">계정과목 리스트</span>
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
          <q-card-actions align="right" class="q-pa-none">
            <q-toolbar class="row">
              <div class="row q-col-gutter-md">
                <q-select
                  dense
                  stack-label
                  options-dense
                  class="q-pb-sm q-mr-lg"
                  label-color="orange"
                  v-model="searchParam.codeCd1"
                  :options="codeGroupOptions"
                  option-value="codeCd1"
                  option-label="codeNm"
                  option-disable="inactive"
                  emit-value
                  map-options
                  style="min-width: 130px; max-width: 130px"
                  label="계정그룹"
                  @update:model-value="getData"
                />
                <q-input bottom-slots v-model="searchParam.word" label="검색" dense class="q-pb-none" style="width: 120px">
                  <template v-slot:append>
                    <q-icon v-if="searchParam.word !== ''" name="close" @click="searchParam.word = ''" class="cursor-pointer" />
                  </template>
                </q-input>
              </div>
              <q-space />
              <div class="q-gutter-xs">
                <q-btn outline color="positive" dense @click="getData"><q-icon name="search" size="xs" /> 조회 </q-btn>
                <q-btn v-if="isShowDeleteBtn" outline color="negative" dense @click="deleteDataSection">
                  <q-icon name="delete" size="xs" /> 삭제
                </q-btn>
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
      <!-- contents List -->
      <div v-if="isScreenVisible" class="col-12 col-lg-3">
        <q-form class="">
          <q-card bordered>
            <!-- contents list title bar -->
            <q-bar class="q-px-sm">
              <q-icon name="list_alt" />
              <span class="text-subtitle2 q-px-sm">조회/조정</span>
              <q-space />
              <q-chip v-if="isShowStatusEdit" size="sm" outline :color="statusEdit.color" class="q-px-md">
                <q-icon :name="statusEdit.icon" class="q-mr-sm" size="15px" /> {{ statusEdit.message }}
              </q-chip>
            </q-bar>
            <!--  end of contents list title bar -->
            <q-card-actions align="right" class="q-pa-none">
              <q-toolbar class="row">
                <div class="q-gutter-sm"></div>
                <q-space />
                <div class="q-gutter-xs">
                  <q-btn v-if="isShowSaveBtn" outline color="primary" dense @click="saveDataSection"><q-icon name="save" size="xs" /> 저장 </q-btn>
                  <q-btn outline color="positive" dense @click="addDataSection"><q-icon name="add" size="xs" /> 신규 </q-btn>
                </div>
              </q-toolbar>
            </q-card-actions>

            <q-separator size="3px" />

            <q-card-section class="q-pa-none">
              <q-card flat bordered class="q-ma-xs q-pa-md q-gutter-y-md">
                <div style="max-width: 130px; min-width: 130px">
                  <q-input
                    ref="codeCdFocus"
                    v-model="formData.codeCd"
                    maxlength="5"
                    label="코드"
                    label-color="blue"
                    color="blue"
                    mask="#####"
                    :disable="formDisable"
                  >
                    <template v-slot:append>
                      <q-icon size="0.8em" name="done" class="cursor-pointer q-mt-lg" @click="getDataCodeCheck">
                        <q-tooltip transition-show="rotate" transition-hide="rotate" class="bg-amber text-black shadow-4">
                          계정과목 중복체크
                        </q-tooltip>
                      </q-icon>
                    </template>
                  </q-input>
                </div>

                <div style="max-width: 300px">
                  <q-input v-model="formData.codeNm" label="계정과목명" label-color="blue" color="blue" :disable="formDisable" />
                </div>

                <div style="max-width: 300px">
                  <q-input v-model="formData.codeNm1" label="계정과목명(한자)" label-color="blue" color="blue" :disable="formDisable" />
                </div>

                <div style="max-width: 300px">
                  <q-input v-model="formData.codeNm2" label="계정과목명(영문)" label-color="blue" color="blue" :disable="formDisable" />
                </div>

                <div style="max-width: 150px">
                  <q-select
                    stack-label
                    options-dense
                    class="q-pb-sm q-mr-lg"
                    label-color="orange"
                    v-model="formData.expDiv"
                    :options="expDivOptions"
                    option-value="value"
                    option-label="label"
                    option-disable="inactive"
                    emit-value
                    map-options
                    label="적요유형"
                    :disable="formDisable"
                  />
                </div>

                <div class="row">
                  <q-radio v-model="formData.codeDc" val="1" keep-color color="teal" label="차변계정" :disable="formDisable" />
                  <q-radio v-model="formData.codeDc" val="2" keep-color color="teal" label="대변계정" :disable="formDisable" />
                </div>

                <div class="row">
                  <q-radio v-model="formData.codeCh" val="0" keep-color color="orange" label="일반" :disable="formDisable" />
                  <q-radio v-model="formData.codeCh" val="1" keep-color color="orange" label="차감모" :disable="formDisable" />
                  <q-radio v-model="formData.codeCh" val="2" keep-color color="orange" label="차감" :disable="formDisable" />
                  <q-radio v-model="formData.codeCh" val="3" keep-color color="orange" label="차감끝" :disable="formDisable" />
                </div>

                <div class="row">
                  <q-toggle
                    size="lg"
                    v-model="formData.code1Yn"
                    true-value="Y"
                    false-value="N"
                    checked-icon="check"
                    left-label
                    label="세목적용"
                    unchecked-icon="clear"
                    :disable="formDisable"
                  />
                  <q-toggle
                    size="lg"
                    v-model="formData.custYn"
                    true-value="Y"
                    false-value="N"
                    checked-icon="check"
                    left-label
                    label="보조적용"
                    unchecked-icon="clear"
                    :disable="formDisable"
                  />
                </div>

                <div style="max-width: 150px">
                  <q-input v-model="formData.closeDay" type="date" label="거래종료일" label-color="red" color="red" :disable="formDisable" />
                </div>
              </q-card>
            </q-card-section>
          </q-card>
        </q-form>
      </div>
      <!--  end of contents list -->
    </div>
  </q-page>
  <q-dialog v-model="postViewVisible">
    <help-post :searchPost="searchPost" @setPostData="setPostData" />
  </q-dialog>
</template>

<script setup>
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import 'ag-grid-community/styles/ag-theme-balham.css';
import { AgGridVue } from 'ag-grid-vue3';
import { Notify, QBtn, QIcon, useQuasar } from 'quasar';
import { computed, h, onBeforeMount, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue';
import { api } from '/src/boot/axios';
import authHeader from 'boot/authHeader';
import HelpPost from 'pages/help/HelpPost.vue';
import { isEqual } from 'lodash';
import jsonUtil from 'src/js_comm/json-util';
import notifySave from 'src/js_comm/notify-save';

const $q = useQuasar();
const selectedCustFg = ref('1');

let isSaveFg = null;
const codeGroupOptions = ref(null);

window.dateFormatRendering = function dateFormatRendering(params) {
  return formatDate(params.value);
};

const formatAmtInput = value => {
  // 입력값에서 콤마 제거 후 숫자만 남기기
  const numericValue = value.replace(/,/g, '');

  // 3자리마다 콤마 추가
  formData.value.limitAmt = numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  console.log('amt: ', formData.value.limitAmt);
};
const postViewVisible = ref(false);
const searchPost = ref('');
const setPostData = val => {
  // editData.value = val;
};
const businAddr2Focus = ref(null);
const postAddr2Focus = ref(null);
const openPostcodeSearch = resFg => {
  new window.daum.Postcode({
    oncomplete: data => {
      if (resFg === '1') {
        formData.value.businZip = data.zonecode;
        formData.value.businAddr1 = `${data.address} ${data.buildingName || ''}`;
        setTimeout(() => {
          businAddr2Focus.value.focus();
        }, 100);
      } else {
        formData.value.postZip = data.zonecode;
        formData.value.postAddr1 = `${data.address} ${data.buildingName || ''}`;
        setTimeout(() => {
          postAddr2Focus.value.focus();
        }, 100);
      }
    },
  }).open();
};

const searchParam = reactive({
  codeCd1: '',
  word: '',
});
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

const rendererDivCd = {
  setup(props) {
    const { params } = props;
    const option = expDivOptions.find(option => option.value === params.value);
    return () => (option ? option.label : null);
  },
};
const rendererCodeDc = {
  setup(props) {
    const { params } = props;
    return () => (params.value === '1' ? '차변계정' : params.value === '2' ? '대변계정' : null);
  },
};
const rendererCodeCh = {
  setup(props) {
    const { params } = props;
    let text = '';
    switch (params.value) {
      case '0':
        text = '일반';
        break;
      case '1':
        text = '차감모';
        break;
      case '2':
        text = '차감';
        break;
      case '3':
        text = '차감끝';
        break;
      default:
        text = '';
    }
    return () => text;
  },
};
const rendererCodeYn = {
  setup(props) {
    const { params } = props;
    return () => (params.value === 'Y' ? '적용' : '');
  },
};

const onGridReady = params => {
  gridApi.value = params.api;
};

const defaultColDef = reactive({
  def: {
    flex: 1,
    minWidth: 180,
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
      headerName: '코드',
      field: 'codeCd',
      maxWidth: 80,
      minWidth: 80,
      pinned: 'left',
    },
    {
      headerName: '계정과목명',
      field: 'codeNm',
      minWidth: 150,
      pinned: 'left',
    },
    {
      headerName: '계정과목명(한자)',
      field: 'codeNm1',
      minWidth: 150,
    },
    {
      headerName: '계정과목명(영문)',
      field: 'codeNm2',
      minWidth: 150,
    },
    {
      headerName: '적요유형',
      field: 'expDiv',
      maxWidth: 100,
      minWidth: 100,
      cellRenderer: rendererDivCd,
    },
    {
      headerName: '계정구분',
      field: 'codeDc',
      maxWidth: 100,
      minWidth: 100,
      cellRenderer: rendererCodeDc,
    },
    {
      headerName: '차감구분',
      field: 'codeCh',
      maxWidth: 100,
      minWidth: 100,
      cellRenderer: rendererCodeCh,
    },
    {
      headerName: '세목적용',
      field: 'code1Yn',
      maxWidth: 100,
      minWidth: 100,
      cellRenderer: rendererCodeYn,
    },
    {
      headerName: '보조코드적용',
      field: 'custYn',
      maxWidth: 100,
      minWidth: 100,
      cellRenderer: rendererCodeYn,
    },
    {
      headerName: '거래종료일',
      field: 'closeDay',
      maxWidth: 120,
      minWidth: 120,
      valueFormatter: dateFormatRendering,
    },
  ],
});

const oldFormData = ref(null);
const formData = ref({
  codeCd: '',
  codeNm: '',
  codeNm1: '',
  codeNm2: '',
  codeDc: '',
  expDiv: '',
  codeCh: '',
  code1Yn: '',
  custYn: '',
  closeDay: '',
});
const formDataInitialize = () => {
  formData.value.codeCd = '';
  formData.value.codeNm = '';
  formData.value.codeNm1 = '';
  formData.value.codeNm2 = '';
  formData.value.codeDc = '';
  formData.value.expDiv = '';
  formData.value.codeCh = '';
  formData.value.code1Yn = '';
  formData.value.custYn = '';
  formData.value.closeDay = '9999-12-31';
};

const selectedRows = ref();
const isShowStatusEdit = ref(false);
const isShowDeleteBtn = ref(false);
const isShowSaveBtn = ref(false);

const onSelectionChanged = event => {
  selectedRows.value = event.api.getSelectedRows();
  isShowStatusEdit.value = false;
  isShowDeleteBtn.value = selectedRows.value.length > 0;
  isShowSaveBtn.value = isShowDeleteBtn.value;

  if (selectedRows.value.length === 1) {
    getSelectData(selectedRows.value[0].codeCd);
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
    formDataInitialize();
    isShowStatusEdit.value = false;
    isSaveFg = '';
    formDisable.value = true;
  }
};

const rowSelection = ref(null);

onBeforeMount(() => {
  rowSelection.value = 'multiple';
  getGroupData();
  getData();
});

const codeCdFocus = ref(null);
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
    codeCdFocus.value.focus();
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
        let tmpJson = '{"mode":"U","data":' + JSON.stringify(selectedRows.value[i]) + '}';
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
  formData.value.closeDay = reFormatDate(formData.value.closeDay);

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

    formData.value.closeDay = formatDate(formData.value.closeDay);
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
const reFormatMinus = resData => {
  return resData ? resData.replace(/-/g, '') : null;
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
onMounted(() => {
  window.addEventListener('resize', handleResize);
  handleResize();
});

// **************************************************************//
// ***** DataBase 연결부분    *************************************//
// **************************************************************//

// ***** 계정과목 자료저장 및 삭제 처리부분 *****************************//
// saveStatus = 0=수정성공 1=신규성공 2=삭제성공 3=수정에러 4=시스템에러
const saveDataAndHandleResult = resFormData => {
  console.log('saveData: ', JSON.stringify(resFormData));
  api
    .post('/api/mst/mst2010_save', resFormData, { headers: authHeader() })
    .then(res => {
      let saveStatus = {};
      if (res.data.rtn === '0') {
        if (isSaveFg === 'I') {
          saveStatus.rtn = 1;
          saveStatus.rtn1 = res.data.rtnMsg1;
          saveStatus.rtn2 = '신규추가 완료';
          formData.value.oldCodeCd = formData.value.codeCd;
          formData.value.closeDay = reFormatDate(formData.value.closeDay);
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
          selectedData[0].codeCd = formData.value.codeCd;
          selectedData[0].oldCodeCd = formData.value.codeCd;
          selectedData[0].codeNm = formData.value.codeNm;
          selectedData[0].codeNm1 = formData.value.codeNm1;
          selectedData[0].codeNm2 = formData.value.codeNm2;
          selectedData[0].codeDc = formData.value.codeDc;
          selectedData[0].expDiv = formData.value.expDiv;
          selectedData[0].codeCh = formData.value.codeCh;
          selectedData[0].code1Yn = formData.value.code1Yn;
          selectedData[0].custYn = formData.value.custYn;
          selectedData[0].closeDay = reFormatDate(formData.value.closeDay);
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
      notifySave.notifyView(saveStatus);
    })
    .catch(error => {
      console.log('error: ', error);
    });
};
// ***** 계정과목 목록 자료 가져오기 부분  *****************************//
const getGroupData = async () => {
  try {
    const response = await api.post('/api/mst/mst2010_group_list', {}, { headers: authHeader() });
    codeGroupOptions.value = response.data.data;
    codeGroupOptions.value.push({ codeCd1: '', codeNm: '전체' });
  } catch (error) {
    console.error('Error fetching users:', error);
  }
};
// ***** 계정과목 목록 자료 가져오기 부분 끝 *****************************//

// ***** 계정과목 목록 자료 가져오기 부분  *****************************//
const getData = async () => {
  try {
    const response = await api.post(
      '/api/mst/mst2010_list',
      { paramCodeCd1: searchParam.codeCd1, paramSearchWord: searchParam.word },
      { headers: authHeader() },
    );
    rowData.rows = response.data.data;
  } catch (error) {
    console.error('Error fetching users:', error);
  }
};
// ***** 계정과목 목록 자료 가져오기 부분 끝 *****************************//

// ***** 계정과목 코드 중복여부 자료 가져오기 부분  *****************************//
const getDataCodeCheck = async () => {
  try {
    const response = await api.post('/api/mst/mst2010_code_check', { paramCodeCd: formData.value.codeCd }, { headers: authHeader() });
    let message = null;
    let message_color = null;
    if (response.data.data[0].cnt > 0) {
      message = '코드가 존재합니다.';
      message_color = 'red';
    } else {
      message = '등록된 코드가 없습니다.';
      message_color = 'blue';
    }
    Notify.create({
      position: 'top',
      color: message_color,
      caption: '코드중복체크',
      message: message,
      group: false,
      actions: [
        {
          label: '닫기',
          color: 'dark',
          handler: () => {
            /* ... */
          },
        },
      ],
      timeout: 5000,
    });
  } catch (error) {
    console.error('Error fetching users:', error);
  }
};
// ***** 계정과목 코드 중복여부 자료 가져오기 부분 끝  *****************************//

// ***** 계정과목 선택된 자료 가져오기 부분  *****************************//
const getSelectData = async resParamCodeCd => {
  try {
    const response = await api.post('/api/mst/mst2010_select', { paramCodeCd: resParamCodeCd }, { headers: authHeader() });
    formData.value = response.data.data[0];
    oldFormData.value = JSON.parse(JSON.stringify(formData.value)); // 초기자료 저장
    formData.value.closeDay = formatDate(response.data.data[0].closeDay);
  } catch (error) {
    console.error('Error fetching users:', error);
  }
};
// ***** 계정과목 선택된 자료 가져오기 부분 끝 *****************************//

// **************************************************************//
// ***** DataBase 연결부분 끝  *************************************//
// **************************************************************//

const expDivOptions = [
  { value: '1', label: '기본적요' },
  { value: '2', label: '수불적요' },
  { value: '3', label: '어음적요' },
  { value: '4', label: '일수적요' },
  { value: '5', label: '세율적요' },
  { value: '6', label: '외화적요' },
  { value: '7', label: '차입적요' },
  { value: '8', label: '당좌적요' },
];
</script>

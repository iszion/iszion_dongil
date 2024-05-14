<template>
  <q-page class="q-pa-xs" :style-fn="myTweak">
    <!-- contents zone -->
    <div class="row q-pa-sm q-col-gutter-md">
      <!-- contents List -->
      <div class="col-12" :class="{ 'col-lg-6': isClassActive }">
        <q-card bordered>
          <!-- contents list title bar -->
          <q-bar class="q-px-sm">
            <q-icon name="list_alt" />
            <span class="text-subtitle2 q-px-sm">사용정보 리스트</span>
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
                  v-model="searchParam.deptCd"
                  :options="deptOptionsSearch"
                  option-value="commCd"
                  option-label="commNm"
                  option-disable="inactive"
                  emit-value
                  map-options
                  style="min-width: 130px; max-width: 130px"
                  label="소속팀"
                  @update:model-value="getData"
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
                    <q-icon v-if="searchParam.word !== ''" name="close" @click="searchParam.word = ''" class="cursor-pointer" />
                  </template>
                </q-input>
              </div>
              <q-space />
              <div class="q-gutter-xs">
                <q-btn outline color="positive" dense @click="getData"><q-icon name="search" size="xs" /> 조회 </q-btn>
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
      <!-- contents List -->
      <div v-if="isScreenVisible" class="col-12 col-lg-6">
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
              <q-card flat bordered class="q-ma-xs q-pa-md">
                <div class="q-pa-md">
                  <div class="row q-col-gutter-xl">
                    <div class="col-12 col-md-6">
                      <q-card class="my-card">
                        <q-card-section horizontal>
                          <q-img class="col" src="https://cdn.quasar.dev/img/avatar.png" />

                          <q-card-actions vertical class="justify-around">
                            <q-btn flat round color="primary" icon="photo_camera" @click="openFilePicker" />
                            <q-btn flat round color="accent" icon="image" />
                            <q-btn flat round color="red" icon="delete" />
                          </q-card-actions>
                        </q-card-section>
                        <q-separator />

                        <q-card-actions>
                          <div class="text-bold text-subtitle2">파일명: {{ insaFileName }}</div>
                        </q-card-actions>
                      </q-card>
                    </div>
                    <div class="col-12 col-md-6">
                      <q-input ref="userIdFocus" v-model="formData.userId" label="사원 ID" label-color="orange" :disable="formDisable">
                        <template v-slot:append>
                          <q-icon size="0.8em" name="done" class="cursor-pointer q-mt-lg">
                            <q-tooltip transition-show="rotate" transition-hide="rotate" class="bg-amber text-black shadow-4">
                              ID 중복체크
                            </q-tooltip>
                          </q-icon>
                        </template>
                      </q-input>
                      <q-input v-model="formData.userNm" label="성명" label-color="orange" :disable="formDisable" />
                      <q-input v-model="formData.userNmx" label="닉네임" label-color="orange" :disable="formDisable" />
                      <q-input v-model="formData.empCd" color="primary" label="사원번호" label-color="orange" :disable="formDisable" />
                    </div>
                  </div>

                  <div class="row q-col-gutter-xl">
                    <div class="col-12 col-md-6">
                      <q-input v-model="formData.role" label="ROLE" label-color="orange" :disable="formDisable" />
                      <!--                    <q-badge color="secondary" multi-line> Model: "{{ formData.salesCd }}" </q-badge>-->
                      <q-select
                        options-dense
                        :disable="formDisable"
                        v-model="formData.salesCd"
                        :options="salesOptions"
                        option-value="commCd"
                        option-label="commNm"
                        label="영업담당"
                        label-color="orange"
                        emit-value
                        map-options
                      >
                        <template v-slot:option="{ itemProps, opt, selected, toggleOption }">
                          <q-item v-bind="itemProps">
                            <q-item-section>
                              <q-item-label v-html="opt.commNm" />
                            </q-item-section>
                            <q-item-section side>
                              <q-toggle :model-value="selected" @update:model-value="toggleOption(opt)" />
                            </q-item-section>
                          </q-item>
                        </template>
                      </q-select>
                      <!--                    <q-badge color="secondary" multi-line> Model: "{{ formData.deptCd }}" </q-badge>-->
                      <q-select
                        :disable="formDisable"
                        v-model="formData.deptCd"
                        :options="deptOptions"
                        label="소속부서"
                        label-color="orange"
                        option-value="commCd"
                        option-label="commNm"
                        options-dense
                        emit-value
                        map-options
                      >
                        <template v-slot:option="{ itemProps, opt, selected, toggleOption }">
                          <q-item v-bind="itemProps">
                            <q-item-section>
                              <q-item-label v-html="opt.commNm" />
                            </q-item-section>
                            <q-item-section side>
                              <q-toggle :model-value="selected" @update:model-value="toggleOption(opt)" />
                            </q-item-section>
                          </q-item>
                        </template>
                      </q-select>
                      <!--                    <q-badge color="secondary" multi-line> Model: "{{ formData.jobTitleCd }}" </q-badge>-->
                      <q-select
                        :disable="formDisable"
                        v-model="formData.jobTitleCd"
                        :options="jobTitleOptions"
                        label="직위"
                        label-color="orange"
                        option-value="commCd"
                        option-label="commNm"
                        options-dense
                        emit-value
                        map-options
                      >
                        <template v-slot:option="{ itemProps, opt, selected, toggleOption }">
                          <q-item v-bind="itemProps">
                            <q-item-section>
                              <q-item-label v-html="opt.commNm" />
                            </q-item-section>
                            <q-item-section side>
                              <q-toggle :model-value="selected" @update:model-value="toggleOption(opt)" />
                            </q-item-section>
                          </q-item>
                        </template>
                      </q-select>
                      <q-input v-model="formData.empIday" type="date" label="입사일" label-color="orange" :disable="formDisable" />
                      <q-input v-model="formData.empOday" type="date" label="퇴사일" label-color="orange" :disable="formDisable" />
                    </div>
                    <div class="col-12 col-md-6">
                      <q-input v-model="formData.email" label="이메일" label-color="orange" :disable="formDisable" />
                      <q-input v-model="formData.mobile" label="Mobile" label-color="orange" :disable="formDisable" />
                      <q-input v-model="formData.tel" label="전화번호" label-color="orange" :disable="formDisable" />
                      <q-input
                        :disable="formDisable"
                        type="textarea"
                        v-model="formData.explains"
                        label="참고사항"
                        label-color="orange"
                        autogrow
                        counter
                        maxlength="30"
                        hint="30자까지 입력가능"
                      />
                    </div>
                  </div>
                </div>
              </q-card>
            </q-card-section>
          </q-card>
        </q-form>
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
import { computed, onBeforeMount, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue';
import { api } from '/src/boot/axios';

import authHeader from 'boot/authHeader';
import { isEqual } from 'lodash';
import jsonUtil from 'src/js_comm/json-util';
import notifySave from 'src/js_comm/notify-save';

const $q = useQuasar();

let isSaveFg = null;

const insaFileName = ref(null);
const salesOptions = ref(null);
const deptOptionsSearch = ref(null);
const deptOptions = ref(null);
const jobTitleOptions = ref(null);

const searchParam = reactive({
  deptCd: '',
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
      headerName: 'ID',
      field: 'userId',
      pinned: 'left',
      maxWidth: 100,
      minWidth: 100,
    },
    {
      headerName: '성명',
      field: 'userNm',
      minWidth: 100,
      maxWidth: 100,
      pinned: 'left',
    },
    {
      headerName: 'ROLE',
      field: 'role',
      minWidth: 100,
    },
    {
      headerName: '닉네임',
      field: 'userNmx',
      maxWidth: 100,
      minWidth: 100,
      cellStyle: { textAlign: 'center' },
    },
    {
      headerName: '사원번호',
      field: 'empCd',
      maxWidth: 100,
      minWidth: 100,
      cellStyle: { textAlign: 'center' },
    },
    {
      headerName: '영업담당',
      field: 'salesNm',
      maxWidth: 100,
      minWidth: 100,
    },
    {
      headerName: '소속부서',
      field: 'deptNm',
      maxWidth: 100,
      minWidth: 100,
    },
    {
      headerName: '직위',
      field: 'jobTitleNm',
      maxWidth: 100,
      minWidth: 100,
    },
    {
      headerName: 'Mobile',
      field: 'mobile',
      minWidth: 150,
    },
    {
      headerName: '전화번호',
      field: 'tel',
      minWidth: 150,
    },
    {
      headerName: '이메일',
      field: 'email',
      minWidth: 150,
    },
    {
      headerName: '입사일',
      field: 'empIday',
      maxWidth: 130,
      minWidth: 130,
      cellStyle: { textAlign: 'center' },
    },
    {
      headerName: '퇴사일',
      field: 'empOday',
      maxWidth: 130,
      minWidth: 130,
      cellStyle: { textAlign: 'center' },
    },
    {
      headerName: '참고사항',
      field: 'explains',
      maxWidth: 100,
      minWidth: 100,
      cellStyle: { textAlign: 'center' },
    },
  ],
});

const oldFormData = ref(null);
const formData = ref({
  userId: '',
  role: '',
  userNm: '',
  userNmx: '',
  empCd: '',
  salesCd: '',
  deptCd: '',
  jobTitleCd: '',
  email: '',
  mobile: '',
  tel: '',
  levelCd: '',
  empIday: '',
  empOday: '',
  explains: '',
});

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
    getSelectData(selectedRows.value[0].userId);
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
    formData.value = initializeFormData.value;
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
  getData();
  getDataCommOption('301');
  getDataCommOption('701');
  getDataCommOption('702');
});

const userIdFocus = ref(null);
const addDataSection = () => {
  formData.value = {};
  oldFormData.value = {};
  isShowStatusEdit.value = true;
  statusEdit.icon = 'edit';
  statusEdit.message = '신규입력모드 입니다';
  statusEdit.color = 'primary';
  isSaveFg = 'I';
  isShowSaveBtn.value = true;
  formDisable.value = false;
  formData.value.empOday = '9999-12-31';
  setTimeout(() => {
    userIdFocus.value.focus();
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
  formData.value.empIday = reFormatDate(formData.value.empIday);
  formData.value.empOday = reFormatDate(formData.value.empOday);

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

// ***** 자료저장 및 삭제 처리부분 *****************************//
// saveStatus = 0=수정성공 1=신규성공 2=삭제성공 3=수정에러 4=시스템에러
const saveDataAndHandleResult = resFormData => {
  api
    .post('/api/sys/sys1010_save', resFormData, { headers: authHeader() })
    .then(res => {
      let saveStatus = {};
      if (res.data.rtn === '0') {
        if (isSaveFg === 'I') {
          saveStatus.rtn = 1;
          saveStatus.rtn1 = res.data.rtnMsg1;
          saveStatus.rtn2 = '신규추가 완료';
          formData.value.oldUserId = formData.value.userId;

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
          selectedData[0].userId = formData.value.userId;
          selectedData[0].oldUserId = formData.value.userId;
          selectedData[0].role = formData.value.role;
          selectedData[0].userNm = formData.value.userNm;
          selectedData[0].userNmx = formData.value.userNmx;
          selectedData[0].empCd = formData.value.empCd;
          selectedData[0].salesCd = formData.value.salesCd;
          selectedData[0].deptCd = formData.value.deptCd;
          selectedData[0].jobTitleCd = formData.value.jobTitleCd;
          selectedData[0].mobile = formData.value.mobile;
          selectedData[0].tel = formData.value.tel;
          selectedData[0].email = formData.value.email;
          selectedData[0].empIday = formData.value.empIday;
          selectedData[0].empOday = formData.value.empOday;
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
      notifySave.notifyView(saveStatus);
    })
    .catch(error => {
      console.log('error: ', error);
    });
};
// ***** 사용자정보 목록 자료 가져오기 부분  *****************************//
const getData = async () => {
  try {
    const response = await api.post('/api/sys/sys1010_list', { paramDeptCd: searchParam.deptCd }, { headers: authHeader() });
    rowData.rows = response.data.data;
  } catch (error) {
    console.error('Error fetching users:', error);
  }
};
// ***** 사용자정보 목록 자료 가져오기 부분  *****************************//

// ***** 사용자정보 선택된 자료 가져오기 부분  *****************************//
const getSelectData = async resParamUserId => {
  try {
    const response = await api.post('/api/sys/sys1010_select', { paramUserId: resParamUserId }, { headers: authHeader() });
    formData.value = response.data.data[0];
    oldFormData.value = JSON.parse(JSON.stringify(formData.value)); // 초기자료 저장
    formData.value.empIday = formatDate(response.data.data[0].empIday);
    formData.value.empOday = formatDate(response.data.data[0].empOday);
  } catch (error) {
    console.error('Error fetching users:', error);
  }
};
// ***** 사용자정보 선택된 자료 가져오기 부분  *****************************//

// ***** 공통코드정보 가져오기 부분  *****************************//
async function getDataCommOption(resParamCommCd1) {
  try {
    const response = await api.post('/api/mst/comm_option_list', { paramCommCd1: resParamCommCd1 }, { headers: authHeader() });
    switch (resParamCommCd1) {
      case '301':
        salesOptions.value = response.data.data;
        break;
      case '701':
        deptOptions.value = response.data.data;
        deptOptionsSearch.value = JSON.parse(JSON.stringify(deptOptions.value));
        console.log(JSON.stringify(deptOptionsSearch.value));
        deptOptionsSearch.value.push({ commCd: '', commNm: '전체' });

        break;
      case '702':
        jobTitleOptions.value = response.data.data;
        break;
      default:
        break;
    }
  } catch (error) {
    console.error('Error fetching users:', error);
  }
}
// ***** 사용정보 선택된 자료 가져오기 부분  *****************************//

// **************************************************************//
// ***** DataBase 연결부분 끝  *************************************//
// **************************************************************//

const openFilePicker = () => {
  // 파일 선택 대화 상자 열기
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'image/*'; // 이미지 파일만 선택 가능하도록 설정 (선택 사항)
  input.onchange = event => {
    const file = event.target.files[0];
    if (file) {
      // 파일이 선택된 경우, 여기에서 파일 업로드 로직을 추가할 수 있습니다.
      uploadFile(file);
    }
  };
  input.click();
};
const uploadFile = file => {
  // 파일 업로드 로직을 작성하세요.
  insaFileName.value = file.name;
  console.log('Selected file:', file);
  // 여기에서 파일을 업로드하는 코드를 추가하세요.
};
</script>

<style lang="sass" scoped>
.my-card
  width: 100%
  max-width: 350px
</style>

<template>
  <q-page class="q-pa-xs-xs q-pa-sm-md" :style-fn="myTweak">
    <!-- contents zone -->
    <div class="row q-col-gutter-md">
      <!-- contents List -->
      <div class="col-12" :class="{ 'col-lg-8': isClassActive }">
        <q-card bordered>
          <!-- contents list title bar -->
          <q-bar class="q-px-sm">
            <q-icon name="list_alt" />
            <span class="text-subtitle2 q-px-sm">인사기본정보 리스트</span>
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
                  option-value="deptCd"
                  option-label="deptNm"
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
      <div v-if="isScreenVisible" class="col-12 col-lg-4">
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
                      <q-card class="q-ma-xs q-pa-sm">
                        <!--                        <q-img :src="`https://hr.energyshop.co.kr/images/${formData.imageFileNm}`" />-->
                        <q-img :src="`https://www.iszion.com/images/${formData.imageFileNm}`" />
                        <div class="row q-pa-xs">
                          <q-avatar
                            v-if="!formDisable"
                            color="blue"
                            text-color="white"
                            icon="photo_camera"
                            size="md"
                            class="q-pa-none cursor-pointer"
                            @click="handleImageUpload"
                          />
                          <q-space />
                          <q-avatar
                            v-if="!formDisable"
                            color="red"
                            text-color="white"
                            icon="delete_forever"
                            size="md"
                            class="q-pa-none cursor-pointer"
                            @click="handleImageDelete"
                          />
                        </div>
                        <!--                        <div class="text-center">{{ formData.imageFileNm }}</div>-->
                      </q-card>
                    </div>
                    <div class="col-12 col-md-6">
                      <q-input ref="empCdFocus" v-model="formData.empCd" label="사원 ID" label-color="orange" :disable="formDisableEmpCd">
                        <template v-slot:append>
                          <q-icon size="0.8em" name="done" class="cursor-pointer q-mt-lg" @click="getDataEmpCdCheck">
                            <q-tooltip transition-show="rotate" transition-hide="rotate" class="bg-amber text-black shadow-4">
                              사번 중복체크
                            </q-tooltip>
                          </q-icon>
                        </template>
                      </q-input>
                      <q-input ref="empNmFocus" v-model="formData.empNm" label="성명" label-color="orange" :disable="formDisable" />

                      <q-select
                        :disable="formDisable"
                        v-model="formData.deptCd"
                        :options="deptOptions"
                        label="소속팀"
                        label-color="orange"
                        option-value="deptCd"
                        option-label="deptNm"
                        options-dense
                        emit-value
                        map-options
                      >
                        <template v-slot:option="{ itemProps, opt, selected, toggleOption }">
                          <q-item v-bind="itemProps">
                            <q-item-section>
                              <q-item-label v-html="opt.deptNm" />
                            </q-item-section>
                            <q-item-section side>
                              <q-toggle :model-value="selected" @update:model-value="toggleOption(opt)" />
                            </q-item-section>
                          </q-item>
                        </template>
                      </q-select>
                    </div>
                  </div>

                  <div class="row q-col-gutter-xl">
                    <div class="col-12 col-md-6">
                      <q-select
                        options-dense
                        :disable="formDisable"
                        v-model="formData.titlCd"
                        :options="titlOptions"
                        option-value="titlCd"
                        option-label="titlNm"
                        label="직급"
                        label-color="orange"
                        emit-value
                        map-options
                      >
                        <template v-slot:option="{ itemProps, opt, selected, toggleOption }">
                          <q-item v-bind="itemProps">
                            <q-item-section>
                              <q-item-label v-html="opt.titlNm" />
                            </q-item-section>
                            <q-item-section side>
                              <q-toggle :model-value="selected" @update:model-value="toggleOption(opt)" />
                            </q-item-section>
                          </q-item>
                        </template>
                      </q-select>
                      <q-select
                        options-dense
                        :disable="formDisable"
                        v-model="formData.catgCd"
                        :options="catgOptions"
                        option-value="catgCd"
                        option-label="catgNm"
                        label="직분류"
                        label-color="orange"
                        emit-value
                        map-options
                      >
                        <template v-slot:option="{ itemProps, opt, selected, toggleOption }">
                          <q-item v-bind="itemProps">
                            <q-item-section>
                              <q-item-label v-html="opt.catgNm" />
                            </q-item-section>
                            <q-item-section side>
                              <q-toggle :model-value="selected" @update:model-value="toggleOption(opt)" />
                            </q-item-section>
                          </q-item>
                        </template>
                      </q-select>
                      <q-input v-model="formData.mobile" label="Mobile" label-color="orange" :disable="formDisable" />
                      <q-input v-model="formData.inDay" type="date" label="입사일" label-color="orange" :disable="formDisable" />
                      <q-input v-model="formData.outDay" type="date" label="퇴사일" label-color="orange" :disable="formDisable" />
                      <q-input v-model="formData.birthday" type="date" label="생년월일" label-color="orange" :disable="formDisable" />
                    </div>
                    <div class="col-12 col-md-6">
                      <q-select
                        options-dense
                        :disable="formDisable"
                        v-model="formData.pstnCd"
                        :options="pstnOptions"
                        option-value="pstnCd"
                        option-label="pstnNm"
                        label="직위"
                        label-color="orange"
                        emit-value
                        map-options
                      >
                        <template v-slot:option="{ itemProps, opt, selected, toggleOption }">
                          <q-item v-bind="itemProps">
                            <q-item-section>
                              <q-item-label v-html="opt.pstnNm" />
                            </q-item-section>
                            <q-item-section side>
                              <q-toggle :model-value="selected" @update:model-value="toggleOption(opt)" />
                            </q-item-section>
                          </q-item>
                        </template>
                      </q-select>

                      <q-select
                        options-dense
                        :disable="formDisable"
                        v-model="formData.evtgCd"
                        :options="evtgOptions"
                        option-value="evtgCd"
                        option-label="evtgNm"
                        label="평가대상그룹"
                        label-color="orange"
                        emit-value
                        map-options
                      >
                        <template v-slot:option="{ itemProps, opt, selected, toggleOption }">
                          <q-item v-bind="itemProps">
                            <q-item-section>
                              <q-item-label v-html="opt.evtgNm" />
                            </q-item-section>
                            <q-item-section side>
                              <q-toggle :model-value="selected" @update:model-value="toggleOption(opt)" />
                            </q-item-section>
                          </q-item>
                        </template>
                      </q-select>

                      <q-input v-model="formData.email" label="이메일" label-color="orange" :disable="formDisable" />

                      <div class="q-mt-xs q-gutter-sm">
                        <q-radio keep-color v-model="formData.gender" val="M" label="남자" color="teal" :disable="formDisable" />
                        <q-radio keep-color v-model="formData.gender" val="F" label="여자" color="orange" :disable="formDisable" />
                      </div>
                      <q-input v-model="formData.eduLevel" label="최종학력" label-color="orange" :disable="formDisable" />
                      <q-input v-model="formData.finalSchool" label="최종학교" label-color="orange" :disable="formDisable" />
                      <q-separator class="q-mb-xs" />
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
import { computed, onBeforeMount, onBeforeUnmount, onMounted, reactive, ref } from 'vue';
import { api } from '/src/boot/axios';

import { isEqual } from 'lodash';
import jsonUtil from 'src/js_comm/json-util';
import notifySave from 'src/js_comm/notify-save';
import commUtil from 'src/js_comm/comm-util';

import { useYearInfoStore } from 'src/store/setYearInfo';
import ImageView from 'components/ImageView.vue';
const storeYear = useYearInfoStore();

const $q = useQuasar();

let isSaveFg = null;

const deptOptionsSearch = ref(null);
const deptOptions = ref(null);
const titlOptions = ref(null);
const pstnOptions = ref(null);
const catgOptions = ref(null);
const evtgOptions = ref(null);

const searchParam = reactive({
  deptCd: '',
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
  getData();
  getDataDeptOption();
  getDataPstnOption();
  getDataTitlOption();
  getDataCatgOption();
  getDataEvtgOption();
});

onMounted(() => {
  window.addEventListener('resize', handleResize);
  handleResize();
});

const formDisableEmpCd = ref(true);
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

const dateFormatter = params => {
  const dateStr = params.value;
  if (dateStr && dateStr.length === 8) {
    return `${dateStr.slice(0, 4)}-${dateStr.slice(4, 6)}-${dateStr.slice(6)}`;
  }
  return dateStr;
};
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
      headerName: '#',
      width: 60,
      pinned: 'left',
      valueGetter: function (params) {
        // Customize row numbers as needed
        return params.node.rowIndex + 1;
      },
    },
    {
      headerName: 'ID',
      field: 'empCd',
      pinned: 'left',
      maxWidth: 100,
      minWidth: 100,
    },
    {
      headerName: '성명',
      field: 'empNm',
      minWidth: 100,
      maxWidth: 100,
      pinned: 'left',
    },
    {
      headerName: '',
      field: 'imageFileNm',
      minWidth: 70,
      maxWidth: 70,
      filter: false,
      pinned: 'left',
      cellRenderer: ImageView,
    },
    {
      headerName: '소속팀',
      field: 'deptNm',
      maxWidth: 100,
      minWidth: 100,
    },
    {
      headerName: '직위',
      field: 'pstnNm',
      maxWidth: 100,
      minWidth: 100,
    },
    {
      headerName: '직급',
      field: 'titlNm',
      maxWidth: 100,
      minWidth: 100,
    },
    {
      headerName: '직분류',
      field: 'catgNm',
      maxWidth: 120,
      minWidth: 120,
    },
    {
      headerName: '평가대상그룹',
      field: 'evtgNm',
      maxWidth: 120,
      minWidth: 120,
    },
    {
      headerName: '성별',
      field: 'gender',
      maxWidth: 80,
      minWidth: 80,
    },
    {
      headerName: '생년월일',
      field: 'birthday',
      valueFormatter: dateFormatter,
      maxWidth: 130,
      minWidth: 130,
    },
    {
      headerName: 'Mobile',
      field: 'mobile',
      maxWidth: 150,
      minWidth: 150,
    },
    {
      headerName: '이메일',
      field: 'email',
      maxWidth: 150,
      minWidth: 150,
    },
    {
      headerName: '최종학력',
      field: 'eduLevel',
      maxWidth: 100,
      minWidth: 100,
    },
    {
      headerName: '최종학교',
      field: 'finalSchool',
      maxWidth: 150,
      minWidth: 150,
    },
    {
      headerName: '입사일',
      field: 'inDay',
      valueFormatter: dateFormatter,
      maxWidth: 130,
      minWidth: 130,
      cellStyle: { textAlign: 'center' },
    },
    {
      headerName: '이미지파일명',
      field: 'imageFileNm',
      minWidth: 150,
      cellStyle: { textAlign: 'center' },
    },
  ],
});

const oldFormData = ref(null);
const formData = ref({
  empCd: '',
  empNm: '',
  deptCd: '',
  catgCd: '',
  pstnCd: '',
  titlCd: '',
  evtgCd: '',
  gender: '',
  birthday: '',
  mobile: '',
  email: '',
  inDay: '',
  outDay: '',
  eduLevel: '',
  finalSchool: '',
  imageFileNm: '',
  imageFileNmFull: '',
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
    getDataSelect(selectedRows.value[0].stdYear, selectedRows.value[0].empCd);
    isShowStatusEdit.value = true;
    statusEdit.icon = 'edit_note';
    statusEdit.message = '수정/삭제모드 입니다';
    statusEdit.color = 'accent';
    isSaveFg = 'U';
    formDisableEmpCd.value = true;
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

const empCdFocus = ref(null);
const empNmFocus = ref(null);
const addDataSection = () => {
  formData.value = {};
  oldFormData.value = {};
  isShowStatusEdit.value = true;
  statusEdit.icon = 'edit';
  statusEdit.message = '신규입력모드 입니다';
  statusEdit.color = 'primary';
  isSaveFg = 'I';
  isShowSaveBtn.value = true;
  formDisableEmpCd.value = false;
  formDisable.value = true;
  formData.value.stdYear = storeYear.setYear;
  formData.value.outDay = '9999-12-31';
  setTimeout(() => {
    empCdFocus.value.focus();
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
  formData.value.birthday = commUtil.unFormatDate(formData.value.birthday);
  formData.value.inDay = commUtil.unFormatDate(formData.value.inDay);
  formData.value.outDay = commUtil.unFormatDate(formData.value.outDay);

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

// ***** 자료저장 및 삭제 처리부분 *****************************//
// saveStatus = 0=수정성공 1=신규성공 2=삭제성공 3=수정에러 4=시스템에러

const handleImageUpload = () => {
  // 파일 선택 대화 상자 열기
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'image/*'; // 이미지 파일만 선택 가능하도록 설정 (선택 사항)
  input.onchange = event => {
    const file = event.target.files[0];
    console.log('File object: ', file);

    console.log('file name : ' + file.name);
    console.log('File type: ', file.type);
    console.log('File size: ', file.size);

    if (file) {
      // 파일이 선택된 경우, 여기에서 파일 업로드 로직을 추가할 수 있습니다.
      uploadFile(file);
    }
  };
  input.click();
};
const uploadFile = async file => {
  try {
    const param = new FormData();
    param.append('file', file); // 'file'은 서버에서 받는 파라미터 이름
    param.append('empCd', formData.value.empCd);
    const response = await api.post('/api/mst/mst1010_fileSave', param, {
      headers: {
        'Content-Type': 'multipart/form-data', // 파일 업로드를 위한 헤더
      },
    });
    // 서버의 응답 처리
    formData.value.imageFileNm = formData.value.empCd + '_' + file.name;

    console.log('File uploaded successfully:', response.data);
  } catch (error) {
    // 오류 처리
    console.error('Error uploading file:', error);
  }
};

const handleImageDelete = async () => {
  const response = await api.delete('/api/mst/mst1010_fileDelete', {
    params: {
      filename: formData.value.imageFileNm,
      empCd: formData.value.empCd,
    },
  });
  // console.log('delete : ' + response);
  if (response.data.success) {
    formData.value.imageFileNm = ''; // 이미지 삭제 후 이미지 파일명을 비움
  }
};

const saveDataAndHandleResult = resFormData => {
  console.log('save::: ', JSON.stringify(resFormData));
  api
    .post('/api/mst/mst1010_save', resFormData)
    .then(res => {
      if (res.data.rtn === '0') {
        if (isSaveFg === 'I') {
          formData.value.oldUserId = formData.value.empCd;

          let newData = [formData.value];
          gridApi.value.applyTransaction({
            add: newData,
            addIndex: 0,
          });
        } else if (isSaveFg === 'U') {
          const selectedData = gridApi.value.getSelectedRows();

          // selectedData[0] = { ...formData.value };
          selectedData[0].empCd = formData.value.empCd;
          selectedData[0].oldEmpCd = formData.value.empCd;
          selectedData[0].empNm = formData.value.empNm;
          selectedData[0].deptCd = formData.value.deptCd;
          selectedData[0].catgCd = formData.value.catgCd;
          selectedData[0].pstnCd = formData.value.pstnCd;
          selectedData[0].titlCd = formData.value.titlCd;
          selectedData[0].evtgCd = formData.value.evtgCd;
          selectedData[0].gender = formData.value.gender;
          selectedData[0].birthday = formData.value.birthday;
          selectedData[0].mobile = formData.value.mobile;
          selectedData[0].email = formData.value.email;
          selectedData[0].eduLevel = formData.value.eduLevel;
          selectedData[0].finalSchool = formData.value.finalSchool;
          selectedData[0].inDay = formData.value.inDay;
          selectedData[0].outDay = formData.value.outDay;
          selectedData[0].imageFileNm = formData.value.imageFileNm;
          selectedData[0].imageFileNmFull = formData.value.imageFileNmFull;
          gridApi.value.applyTransaction({
            update: selectedData,
          });
        } else if (isSaveFg === 'D') {
          const selectedData = gridApi.value.getSelectedRows();
          gridApi.value.applyTransaction({ remove: selectedData });
        }
      }
      let saveStatus = {};
      saveStatus.rtn = res.data.rtn;
      saveStatus.rtnMsg = res.data.rtnMsg;
      notifySave.notifyView(saveStatus);
    })
    .catch(error => {
      console.log('error: ', error);
    });
};
// ***** 인사정보 목록 자료 가져오기 부분  *****************************//
const getData = async () => {
  try {
    const response = await api.post('/api/mst/mst1010_list', {
      paramSetYear: storeYear.setYear,
      paramDeptCd: searchParam.deptCd,
      paramSearchWord: searchParam.word,
    });
    rowData.rows = response.data.data;
  } catch (error) {
    console.error('Error fetching users:', error);
  }
};

// ***** 인사정보 선택된 자료 가져오기 부분  *****************************//
const imageSrc = ref('');
const getDataSelect = async (resStdYear, resEmpCd) => {
  try {
    const response = await api.post('/api/mst/mst1010_select', { paramStdYear: resStdYear, paramEmpCd: resEmpCd });
    formData.value = response.data.data[0];
    oldFormData.value = JSON.parse(JSON.stringify(formData.value)); // 초기자료 저장
    formData.value.birthday = commUtil.formatDate(response.data.data[0].birthday);
    formData.value.inDay = commUtil.formatDate(response.data.data[0].inDay);
    formData.value.outDay = commUtil.formatDate(response.data.data[0].outDay);
    // imageSrc.value = `https://hr.energyshop.co.kr/images/${formData.value.imageFileNm}`;
    // imageSrc.value = `https://www.iszion.com/images/${formData.value.imageFileNm}`;
    // console.log('imgSrc : ' + imageSrc.value);
    // console.log('formData : ' + formData.value.imageFileNm);
  } catch (error) {
    console.error('Error fetching users:', error);
  }
};

// ***** 사원번호 중복체크 부분  *****************************//
const getDataEmpCdCheck = async () => {
  try {
    const response = await api.post('/api/mst/mst1010_empCd_check', { paramStdYear: storeYear.setYear, paramEmpCd: formData.value.empCd });
    // console.log('check :: ', response.data.data[0].ch);
    if (response.data.data[0].ch === 0) {
      formDisable.value = false;
      setTimeout(() => {
        empNmFocus.value.focus();
      }, 100);
    } else {
      formData.value.empCd = null;
      empCdFocus.value.focus();
      formDisable.value = true;
      $q.notify({
        position: 'top-right',
        type: 'negative',
        message: '중복된 사원번호가 존재합니다. 다른 사원번호로 입력하세요.',
        timeout: 1000,
      });
    }
  } catch (error) {
    console.error('Error fetching users:', error);
  }
};

// ***** 소속팀정보 가져오기 부분  *****************************//
async function getDataDeptOption() {
  try {
    const response = await api.post('/api/mst/dept_option_list', { paramSetYear: storeYear.setYear });
    deptOptions.value = response.data.data;
    deptOptionsSearch.value = JSON.parse(JSON.stringify(deptOptions.value));
    deptOptionsSearch.value.push({ deptCd: '', deptNm: '전체' });
  } catch (error) {
    console.error('Error fetching users:', error);
  }
}
// ***** 직위정보 가져오기 부분  *****************************//
async function getDataPstnOption() {
  try {
    const response = await api.post('/api/mst/pstn_option_list', { paramSetYear: storeYear.setYear });
    pstnOptions.value = response.data.data;
  } catch (error) {
    console.error('Error fetching users:', error);
  }
}
// ***** 직급정보 가져오기 부분  *****************************//
async function getDataTitlOption() {
  try {
    const response = await api.post('/api/mst/titl_option_list', { paramSetYear: storeYear.setYear });
    titlOptions.value = response.data.data;
  } catch (error) {
    console.error('Error fetching users:', error);
  }
}
// ***** 직분류정보 가져오기 부분  *****************************//
async function getDataCatgOption() {
  try {
    const response = await api.post('/api/mst/catg_option_list', { paramSetYear: storeYear.setYear });
    catgOptions.value = response.data.data;
  } catch (error) {
    console.error('Error fetching users:', error);
  }
}
// ***** 평가대상그룹정보 가져오기 부분  *****************************//
async function getDataEvtgOption() {
  try {
    const response = await api.post('/api/mst/evtg_option_list', { paramSetYear: storeYear.setYear });
    evtgOptions.value = response.data.data;
  } catch (error) {
    console.error('Error fetching users:', error);
  }
}

// **************************************************************//
// ***** DataBase 연결부분 끝  *************************************//
// **************************************************************//
//
// const handleImageUpload = () => {
//   // 파일 선택 대화 상자 열기
//   const input = document.createElement('input');
//   input.type = 'file';
//   input.accept = 'image/*'; // 이미지 파일만 선택 가능하도록 설정 (선택 사항)
//   input.onchange = event => {
//     const file = event.target.files[0];
//     if (file) {
//       // 파일이 선택된 경우, 여기에서 파일 업로드 로직을 추가할 수 있습니다.
//       uploadFile(file);
//     }
//   };
//   input.click();
// };
// const uploadFile = file => {
//   // 파일 업로드 로직을 작성하세요.
//   insaFileName.value = file.name;
//   console.log('Selected file:', file);
//   // 여기에서 파일을 업로드하는 코드를 추가하세요.
// };
//
// const handleImageDelete = () => {};
</script>

<style scoped></style>

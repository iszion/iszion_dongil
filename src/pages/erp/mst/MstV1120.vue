<template>
  <q-page class="q-pa-xs">
    <!-- contents zone -->
    <div class="row q-pa-sm q-col-gutter-md">
      <!-- contents List -->
      <div class="col-12 col-lg-3">
        <q-card bordered>
          <!-- contents list title bar -->
          <q-bar class="q-px-sm">
            <q-icon name="list_alt" />
            <span class="text-subtitle2 q-px-sm">품목군 리스트</span>
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
      <!-- contents List -->
      <div class="col-12 col-lg-9">
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
              </div>
            </q-toolbar>
          </q-card-actions>

          <q-separator size="3px" />

          <q-card-section class="q-pa-none">
            <q-card flat bordered class="q-ma-sm-xs q-ma-xs-none q-pa-sm-sm q-pa-xs-xs">
              <div class="row q-col-gutter-x-xs">
                <div class="form1 col-2 flex flex-center bg-grey-4 text-dark text-subtitle1 text-bold">조건 1</div>
                <div class="col-10 q-col-gutter-y-xs">
                  <div class="row text-center text-bold text-subtitle2">
                    <div class="form1 col-12 col-sm-4 q-py-xs bg-blue-grey-4">매출 이율적용 조건명</div>
                    <div class="form1 col-12 col-sm-4 q-py-xs bg-blue-grey-4">부리일</div>
                    <div class="form1 col-12 col-sm-4 q-py-xs bg-blue-grey-4">상환일</div>
                  </div>
                  <div class="row text-center">
                    <div style="display: flex; justify-content: center; align-items: center" class="form1 col-12 col-sm-4 q-py-xs">
                      <q-input ref="condNm1Focus" dense outlined v-model="formData.condNm1" :disable="formDisable" input-class="text-center" />
                    </div>
                    <div style="display: flex; justify-content: center; align-items: center" class="form1 col-12 col-sm-4 q-py-xs">
                      <q-toggle
                        class="q-mr-sm"
                        v-model="formData.condMyy1Ch"
                        true-value="1"
                        false-value="0"
                        color="green"
                        :label="formData.condMyy1Ch === '1' ? '익년' : '당년'"
                        :disable="formDisable"
                      />
                      <q-input
                        class="q-ml-sm"
                        dense
                        outlined
                        v-model="formData.condMmm1"
                        mask="##"
                        style="max-width: 50px"
                        :disable="formDisable"
                        input-class="text-center"
                      />월
                      <q-input
                        class="q-ml-sm"
                        dense
                        outlined
                        v-model="formData.condMdd1"
                        mask="##"
                        style="max-width: 50px"
                        :disable="formDisable"
                        input-class="text-center"
                      />일 까지
                    </div>
                    <div style="display: flex; justify-content: center; align-items: center" class="form1 col-12 col-sm-4 q-py-xs">
                      <q-toggle
                        class="q-mr-sm"
                        v-model="formData.condYyy1Ch"
                        true-value="1"
                        false-value="0"
                        color="green"
                        :label="formData.condYyy1Ch === '1' ? '익년' : '당년'"
                        :disable="formDisable"
                      />
                      <q-input
                        class="q-ml-sm"
                        dense
                        outlined
                        v-model="formData.condYmm1"
                        mask="##"
                        style="max-width: 50px"
                        :disable="formDisable"
                        input-class="text-center"
                      />월
                      <q-input
                        class="q-ml-sm"
                        dense
                        outlined
                        v-model="formData.condYdd1"
                        mask="##"
                        style="max-width: 50px"
                        :disable="formDisable"
                        input-class="text-center"
                      />일 까지
                    </div>
                  </div>
                </div>
              </div>
            </q-card>
            <q-card flat bordered class="q-ma-sm-xs q-ma-xs-none q-pa-sm-sm q-pa-xs-xs">
              <div class="row q-col-gutter-x-xs">
                <div class="form1 col-2 flex flex-center bg-grey-4 text-dark text-subtitle1 text-bold">조건 2</div>
                <div class="col-10 q-col-gutter-y-xs">
                  <div class="row text-center text-bold text-subtitle2">
                    <div class="form1 col-12 col-sm-4 q-py-xs bg-blue-grey-4">매출 이율적용 조건명</div>
                    <div class="form1 col-12 col-sm-4 q-py-xs bg-blue-grey-4">부리일</div>
                    <div class="form1 col-12 col-sm-4 q-py-xs bg-blue-grey-4">상환일</div>
                  </div>
                  <div class="row text-center">
                    <div style="display: flex; justify-content: center; align-items: center" class="form1 col-12 col-sm-4 q-py-xs">
                      <q-input dense outlined v-model="formData.condNm2" :disable="formDisable" input-class="text-center" />
                    </div>
                    <div style="display: flex; justify-content: center; align-items: center" class="form1 col-12 col-sm-4 q-py-xs">
                      <q-toggle
                        class="q-mr-sm"
                        v-model="formData.condMyy2Ch"
                        true-value="1"
                        false-value="0"
                        color="green"
                        :label="formData.condMyy2Ch === '1' ? '익년' : '당년'"
                        :disable="formDisable"
                      />
                      <q-input
                        class="q-ml-sm"
                        dense
                        outlined
                        v-model="formData.condMmm2"
                        mask="##"
                        style="max-width: 50px"
                        :disable="formDisable"
                        input-class="text-center"
                      />월
                      <q-input
                        class="q-ml-sm"
                        dense
                        outlined
                        v-model="formData.condMdd2"
                        mask="##"
                        style="max-width: 50px"
                        :disable="formDisable"
                        input-class="text-center"
                      />일 까지
                    </div>
                    <div style="display: flex; justify-content: center; align-items: center" class="form1 col-12 col-sm-4 q-py-xs">
                      <q-toggle
                        class="q-mr-sm"
                        v-model="formData.condYyy2Ch"
                        true-value="1"
                        false-value="0"
                        color="green"
                        :label="formData.condYyy2Ch === '1' ? '익년' : '당년'"
                        :disable="formDisable"
                      />
                      <q-input
                        class="q-ml-sm"
                        dense
                        outlined
                        v-model="formData.condYmm2"
                        mask="##"
                        style="max-width: 50px"
                        :disable="formDisable"
                        input-class="text-center"
                      />월
                      <q-input
                        class="q-ml-sm"
                        dense
                        outlined
                        v-model="formData.condYdd2"
                        mask="##"
                        style="max-width: 50px"
                        :disable="formDisable"
                        input-class="text-center"
                      />일 까지
                    </div>
                  </div>
                </div>
              </div>
            </q-card>
            <q-card flat bordered class="q-ma-sm-xs q-ma-xs-none q-pa-sm-sm q-pa-xs-xs">
              <div class="row q-col-gutter-x-xs">
                <div class="form1 col-2 flex flex-center bg-grey-4 text-dark text-subtitle1 text-bold">조건 3</div>
                <div class="col-10 q-col-gutter-y-xs">
                  <div class="row text-center text-bold text-subtitle2">
                    <div class="form1 col-12 col-sm-4 q-py-xs bg-blue-grey-4">매출 이율적용 조건명</div>
                    <div class="form1 col-12 col-sm-4 q-py-xs bg-blue-grey-4">부리일</div>
                    <div class="form1 col-12 col-sm-4 q-py-xs bg-blue-grey-4">상환일</div>
                  </div>
                  <div class="row text-center">
                    <div style="display: flex; justify-content: center; align-items: center" class="form1 col-12 col-sm-4 q-py-xs">
                      <q-input dense outlined v-model="formData.condNm3" :disable="formDisable" input-class="text-center" />
                    </div>
                    <div style="display: flex; justify-content: center; align-items: center" class="form1 col-12 col-sm-4 q-py-xs">
                      매출월로 부터
                      <q-input
                        class="q-ml-sm"
                        dense
                        outlined
                        v-model="formData.condMmm2"
                        mask="##"
                        style="max-width: 50px"
                        :disable="formDisable"
                        input-class="text-center"
                      />후 말일
                    </div>
                    <div style="display: flex; justify-content: center; align-items: center" class="form1 col-12 col-sm-4 q-py-xs">
                      매출월로 부터
                      <q-input
                        class="q-ml-sm"
                        dense
                        outlined
                        v-model="formData.condYmm2"
                        mask="##"
                        style="max-width: 50px"
                        :disable="formDisable"
                        input-class="text-center"
                      />후 말일
                    </div>
                  </div>
                </div>
              </div>
            </q-card>
            <q-card flat bordered class="q-ma-sm-xs q-ma-xs-none q-pa-sm-sm q-pa-xs-xs">
              <div class="row q-col-gutter-x-xs">
                <div class="form1 col-2 flex flex-center bg-grey-4 text-dark text-subtitle1 text-bold">조건 4</div>
                <div class="col-10 row q-gutter-y-xs">
                  <div class="form1 col-12 col-sm-2 q-py-xs bg-blue-grey-4 text-center text-bold text-subtitle2">매출 이율적용 조건명</div>
                  <div class="col-12 col-sm-10 row text-bold text-subtitle2">
                    <div class="form1 col-12 col-sm-2 q-py-xs bg-blue-grey-4 text-center">매출 구분</div>
                    <div class="form1 col-12 col-sm-5 q-py-xs bg-blue-grey-4 text-center">매출 구분</div>
                    <div class="form1 col-12 col-sm-5 q-py-xs bg-blue-grey-4 text-center">매출 구분</div>
                  </div>
                  <div class="form1 col-12 col-sm-2 q-py-xs q-px-sm text-center" style="display: flex; justify-content: center; align-items: center">
                    <q-input dense outlined v-model="formData.condNm4" :disable="formDisable" input-class="text-center" />
                  </div>
                  <div class="col-sm-10 row">
                    <div class="form1 col-12 col-sm-2 q-py-xs" style="display: flex; justify-content: center; align-items: center">
                      상반기(1월~6월)
                    </div>
                    <div
                      class="form1 col-12 col-sm-5 q-py-xs q-px-sm text-center"
                      style="display: flex; justify-content: center; align-items: center"
                    >
                      <q-toggle
                        class="q-mr-sm"
                        v-model="formData.condMyy41Ch"
                        true-value="1"
                        false-value="0"
                        color="green"
                        :label="formData.condMyy41Ch === '1' ? '익년' : '당년'"
                        :disable="formDisable"
                      />
                      <q-input
                        class="q-ml-sm"
                        dense
                        outlined
                        v-model="formData.condMmm41"
                        mask="##"
                        style="max-width: 50px"
                        :disable="formDisable"
                        input-class="text-center"
                      />월
                      <q-input
                        class="q-ml-sm"
                        dense
                        outlined
                        v-model="formData.condMdd41"
                        mask="##"
                        style="max-width: 50px"
                        :disable="formDisable"
                        input-class="text-center"
                      />일 까지
                    </div>
                    <div
                      class="form1 col-12 col-sm-5 q-py-xs q-px-sm text-center"
                      style="display: flex; justify-content: center; align-items: center"
                    >
                      <q-toggle
                        class="q-mr-sm"
                        v-model="formData.condYyy41Ch"
                        true-value="1"
                        false-value="0"
                        color="green"
                        :label="formData.condYyy41Ch === '1' ? '익년' : '당년'"
                        :disable="formDisable"
                      />
                      <q-input
                        class="q-ml-sm"
                        dense
                        outlined
                        v-model="formData.condYmm41"
                        mask="##"
                        style="max-width: 50px"
                        :disable="formDisable"
                        input-class="text-center"
                      />월
                      <q-input
                        class="q-ml-sm"
                        dense
                        outlined
                        v-model="formData.condYdd41"
                        mask="##"
                        style="max-width: 50px"
                        :disable="formDisable"
                        input-class="text-center"
                      />일 까지
                    </div>
                    <div class="form1 col-12 col-sm-2 q-py-xs" style="display: flex; justify-content: center; align-items: center">
                      하반기(7월~12월)
                    </div>
                    <div
                      class="form1 col-12 col-sm-5 q-py-xs q-px-sm text-center"
                      style="display: flex; justify-content: center; align-items: center"
                    >
                      <q-toggle
                        class="q-mr-sm"
                        v-model="formData.condMyy42Ch"
                        true-value="1"
                        false-value="0"
                        color="green"
                        :label="formData.condMyy42Ch === '1' ? '익년' : '당년'"
                        :disable="formDisable"
                      />
                      <q-input
                        class="q-ml-sm"
                        dense
                        outlined
                        v-model="formData.condMmm42"
                        mask="##"
                        style="max-width: 50px"
                        :disable="formDisable"
                        input-class="text-center"
                      />월
                      <q-input
                        class="q-ml-sm"
                        dense
                        outlined
                        v-model="formData.condMdd42"
                        mask="##"
                        style="max-width: 50px"
                        :disable="formDisable"
                        input-class="text-center"
                      />일 까지
                    </div>
                    <div
                      class="form1 col-12 col-sm-5 q-py-xs q-px-sm text-center"
                      style="display: flex; justify-content: center; align-items: center"
                    >
                      <q-toggle
                        class="q-mr-sm"
                        v-model="formData.condYyy42Ch"
                        true-value="1"
                        false-value="0"
                        color="green"
                        :label="formData.condYyy42Ch === '1' ? '익년' : '당년'"
                        :disable="formDisable"
                        input-class="text-center"
                      />
                      <q-input
                        class="q-ml-sm"
                        dense
                        outlined
                        v-model="formData.condYmm42"
                        mask="##"
                        style="max-width: 50px"
                        :disable="formDisable"
                        input-class="text-center"
                      />월
                      <q-input
                        class="q-ml-sm"
                        dense
                        outlined
                        v-model="formData.condYdd42"
                        mask="##"
                        style="max-width: 50px"
                        :disable="formDisable"
                        input-class="text-center"
                      />일 까지
                    </div>
                  </div>
                </div>
              </div>
            </q-card>
            <q-card flat bordered class="q-ma-sm-xs q-ma-xs-none q-pa-sm-sm q-pa-xs-xs">
              <div class="row q-col-gutter-x-xs">
                <div class="form1 col-2 flex flex-center bg-grey-4 text-dark text-subtitle1 text-bold">기타사항</div>
                <div class="col-10 q-gutter-y-xs">
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

const divCdOptionsSearch = ref(null);

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
    },
    {
      headerName: '코드',
      field: 'commCd',
      minWidth: 100,
    },
    {
      headerName: '품목군',
      field: 'commNm',
      minWidth: 140,
    },
  ],
});

const oldFormData = ref(null);
const formData = ref({
  condDivCd: '',
  condNm1: '',
  condMyy1Ch: '0',
  condMmm1: '',
  condMdd1: '',
  condYyy1Ch: '0',
  condYmm1: '',
  condYdd1: '',
  condNm2: '',
  condMyy2Ch: '0',
  condMmm2: '',
  condMdd2: '',
  condYyy2Ch: '0',
  condYmm2: '',
  condYdd2: '',
  condNm3: '',
  condMmm3: '',
  condYmm3: '',
  condNm4: '',
  condMyy41Ch: '0',
  condMmm41: '',
  condMdd41: '',
  condYyy41Ch: '0',
  condYmm41: '',
  condYdd41: '',
  condMyy42Ch: '0',
  condMmm42: '',
  condMdd42: '',
  condYyy42Ch: '0',
  condYmm42: '',
  condYdd42: '',
  explains: '',
});
const formDataInitialize = ref({
  condDivCd: '',
  condNm1: '',
  condMyy1Ch: '0',
  condMmm1: '',
  condMdd1: '',
  condYyy1Ch: '0',
  condYmm1: '',
  condYdd1: '',
  condNm2: '',
  condMyy2Ch: '0',
  condMmm2: '',
  condMdd2: '',
  condYyy2Ch: '0',
  condYmm2: '',
  condYdd2: '',
  condNm3: '',
  condMmm3: '',
  condYmm3: '',
  condNm4: '',
  condMyy41Ch: '0',
  condMmm41: '',
  condMdd41: '',
  condYyy41Ch: '0',
  condYmm41: '',
  condYdd41: '',
  condMyy42Ch: '0',
  condMmm42: '',
  condMdd42: '',
  condYyy42Ch: '0',
  condYmm42: '',
  condYdd42: '',
  explains: '',
});

const selectedRows = ref();
const isShowStatusEdit = ref(false);
const isShowDeleteBtn = ref(false);
const isShowSaveBtn = ref(false);
const condNm1Focus = ref(null);

const onSelectionChanged = event => {
  selectedRows.value = event.api.getSelectedRows();
  isShowStatusEdit.value = false;
  isShowDeleteBtn.value = selectedRows.value.length > 0;
  isShowSaveBtn.value = isShowDeleteBtn.value;

  if (selectedRows.value.length === 1) {
    getSelectData(selectedRows.value[0].commCd);
    isShowStatusEdit.value = true;
    formDisable.value = false;
    statusEdit.icon = 'edit_note';
    statusEdit.message = '수정/추가/삭제 모드 입니다';
    statusEdit.color = 'accent';
    setTimeout(() => {
      condNm1Focus.value.focus();
    }, 100);
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
  getData('104');
});

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
        let tmpJson = '{"mode":"D","data": { "condDivCd" : ' + selectedRows.value[i].commCd + '} }';
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
    formData.value.condDivCd = selectedRows.value[0].commCd;
    formData.value.condMmm1 = formData.value.condMmm1.toString().padStart(2, '0');
    formData.value.condMdd1 = formData.value.condMdd1.toString().padStart(2, '0');
    formData.value.condYmm1 = formData.value.condYmm1.toString().padStart(2, '0');
    formData.value.condYdd1 = formData.value.condYdd1.toString().padStart(2, '0');
    formData.value.condMmm2 = formData.value.condMmm2.toString().padStart(2, '0');
    formData.value.condMdd2 = formData.value.condMdd2.toString().padStart(2, '0');
    formData.value.condYmm2 = formData.value.condYmm2.toString().padStart(2, '0');
    formData.value.condYdd2 = formData.value.condYdd2.toString().padStart(2, '0');
    formData.value.condMmm3 = formData.value.condMmm3.toString().padStart(2, '0');
    formData.value.condYmm3 = formData.value.condYmm3.toString().padStart(2, '0');
    formData.value.condMmm41 = formData.value.condMmm41.toString().padStart(2, '0');
    formData.value.condMdd41 = formData.value.condMdd41.toString().padStart(2, '0');
    formData.value.condYmm41 = formData.value.condYmm41.toString().padStart(2, '0');
    formData.value.condYdd41 = formData.value.condYdd41.toString().padStart(2, '0');
    formData.value.condMmm42 = formData.value.condMmm42.toString().padStart(2, '0');
    formData.value.condMdd42 = formData.value.condMdd42.toString().padStart(2, '0');
    formData.value.condYmm42 = formData.value.condYmm42.toString().padStart(2, '0');
    formData.value.condYdd42 = formData.value.condYdd42.toString().padStart(2, '0');
    saveDataAndHandleResult(jsonUtil.dataJsonParse(isSaveFg, formData.value));
  }
};

// **************************************************************//
// ***** DataBase 연결부분    *************************************//
// **************************************************************//

// ***** 이율적용조건정보 자료저장 및 삭제 처리부분 *****************************//
// saveStatus = 0=수정성공 1=신규성공 2=삭제성공 3=수정에러 4=시스템에러
const saveDataAndHandleResult = resFormData => {
  api
    .post('/api/mst/mst1120_save', resFormData, { headers: authHeader() })
    .then(res => {
      let saveStatus = {};
      if (res.data.rtn === '0') {
        if (isSaveFg === 'I') {
          saveStatus.rtn = 1;
          saveStatus.rtn1 = res.data.rtnMsg1;
          saveStatus.rtn2 = '신규추가 완료';
        } else if (isSaveFg === 'U') {
          saveStatus.rtn = 0;
          saveStatus.rtn1 = res.data.rtnMsg1;
          saveStatus.rtn2 = '수정 완료';
        } else if (isSaveFg === 'D') {
          saveStatus.rtn = 2;
          saveStatus.rtn1 = res.data.rtnMsg1;
          saveStatus.rtn2 = '삭제 완료';
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
// ***** 공통코드정보 목록 자료 가져오기 부분  *****************************//
const getData = async resParamCommCd1 => {
  try {
    const response = await api.post('/api/mst/comm_option_list', { paramCommCd1: resParamCommCd1 }, { headers: authHeader() });
    switch (resParamCommCd1) {
      case '104':
        rowData.rows = response.data.data;
        console.log(JSON.stringify(divCdOptionsSearch.value));
        break;

      default:
        break;
    }
  } catch (error) {
    console.error('Error fetching users:', error);
  }
};
// ***** 공통코드정보 목록 자료 가져오기 부분  끝 *****************************//

// ***** 이율적용조건정보 선택된 자료 가져오기 부분  *****************************//
const getSelectData = async resParamCondDivCd => {
  try {
    const response = await api.post('/api/mst/mst1120_select', { paramCondDivCd: resParamCondDivCd }, { headers: authHeader() });
    if (response.data.data.length > 0) {
      formData.value = response.data.data[0];
      oldFormData.value = JSON.parse(JSON.stringify(formData.value)); // 초기자료 저장
      isSaveFg = 'U';
    } else {
      formData.value = JSON.parse(JSON.stringify(formDataInitialize.value));
      oldFormData.value = JSON.parse(JSON.stringify(formDataInitialize.value)); // 초기자료 저장
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
</script>

<style lang="scss" scoped>
.form1 {
  border: 2px solid $blue-grey-3;
}
</style>

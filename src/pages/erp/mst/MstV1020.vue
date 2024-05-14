<template>
  <q-page class="q-pa-xs" :style-fn="myTweak">
    <!-- contents zone -->
    <div class="row q-pa-sm q-col-gutter-md">
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
              <div class="row">
                <div class="col-12 col-sm-9">
                  <q-card flat bordered class="q-ma-xs">
                    <div class="row q-pa-sm q-gutter-xs-y-md">
                      <q-card square class="col-12 col-sm-7 q-pa-md">
                        <div class="row q-col-gutter-xl">
                          <div class="col-12 col-md-5">
                            <q-input ref="prodCdFocus" v-model="formData.prodCd" label="품목코드" label-color="orange" :disable="formDisable">
                              <template v-slot:append>
                                <q-icon size="0.8em" name="done" class="cursor-pointer q-mt-lg" @click="getDataCodeCheck">
                                  <q-tooltip transition-show="rotate" transition-hide="rotate" class="bg-amber text-black shadow-4">
                                    코드 중복체크
                                  </q-tooltip>
                                </q-icon>
                              </template>
                            </q-input>
                          </div>
                          <q-space />
                          <div class="col-12 col-md-4">
                            <q-select
                              ref="prodDivCdFocus"
                              options-dense
                              :disable="formDisable"
                              v-model="formData.prodDivCd"
                              :options="divCdOptions"
                              option-value="commCd"
                              option-label="commNm"
                              label="품목유형"
                              label-color="orange"
                              emit-value
                              map-options
                              @focus="prodDivCdFocus.showPopup()"
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
                          </div>
                        </div>

                        <div class="row q-col-gutter-xl">
                          <div class="col-12 col-md-5">
                            <q-input v-model="formData.prodNm" label="품명" label-color="orange" :disable="formDisable" />
                          </div>
                          <div class="col-12 col-md-4">
                            <q-input v-model="formData.prodSize" label="규격" label-color="orange" :disable="formDisable" />
                          </div>
                          <div class="col-12 col-md-3">
                            <q-select
                              options-dense
                              class="q-pb-sm"
                              label-color="orange"
                              v-model="formData.prodUnit"
                              :options="unitOptions"
                              option-value="commNm"
                              option-label="commNm"
                              emit-value
                              map-options
                              label="단위"
                              :disable="formDisable"
                            />
                          </div>
                        </div>

                        <div class="row q-col-gutter-xl">
                          <div class="col-12 col-md-4">
                            <q-input v-model="formData.prodUpCd" label="업로드코드" label-color="orange" :disable="formDisable" />
                          </div>
                          <div class="col-12 col-md-4">
                            <q-input v-model="formData.oldCode" label="(구)코드" label-color="orange" :disable="formDisable" />
                          </div>
                          <div class="col-12 col-md-4">
                            <q-input
                              v-model="formData.closeDay"
                              type="date"
                              label="거래종료일"
                              label-color="red"
                              color="red"
                              :disable="formDisable"
                            />
                          </div>
                        </div>

                        <div class="row q-col-gutter-xl">
                          <div class="col-12">
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
                      </q-card>
                      <q-card square class="col-12 col-sm-5 q-pa-lg">
                        <div class="row q-col-gutter-x-xl">
                          <div class="col-6 q-gutter-y-lg">
                            <div class="col-12 col-md-4 text-right">
                              <q-input
                                style="max-width: 100px"
                                v-model="formData.prodCost"
                                label="기본 입고단가"
                                label-color="orange"
                                input-class="text-right"
                                @update:model-value="formatProdCostInput"
                                :disable="formDisable"
                              />
                            </div>
                            <div class="col-12 col-md-4">
                              <q-toggle
                                size="lg"
                                v-model="formData.prodIvat"
                                true-value="Y"
                                false-value="N"
                                checked-icon="check"
                                color="red"
                                left-label
                                label="부가세"
                                unchecked-icon="clear"
                                :disable="formDisable"
                              />
                            </div>
                            <div class="col-12 col-md-4">
                              <q-input
                                style="max-width: 100px"
                                v-model="formData.prodCostx"
                                label="입고단가(포함)"
                                label-color="orange"
                                input-class="text-right"
                                @update:model-value="formatProdCostxInput"
                                :disable="formDisable"
                              />
                            </div>
                          </div>
                          <div class="col-6 q-gutter-y-lg">
                            <div class="col-12 col-md-4 text-right">
                              <q-input
                                style="max-width: 100px"
                                v-model="formData.prodPrice"
                                label="기본 판매단가"
                                label-color="orange"
                                input-class="text-right"
                                @update:model-value="formatProdPriceInput"
                                :disable="formDisable"
                              />
                            </div>
                            <div class="col-12 col-md-4">
                              <q-toggle
                                size="lg"
                                v-model="formData.prodOvat"
                                true-value="Y"
                                false-value="N"
                                checked-icon="check"
                                color="red"
                                left-label
                                label="부가세"
                                unchecked-icon="clear"
                                :disable="formDisable"
                              />
                            </div>
                            <div class="col-12 col-md-4">
                              <q-input
                                style="max-width: 100px"
                                v-model="formData.prodPricex"
                                label="판매단가(포함)"
                                label-color="orange"
                                input-class="text-right"
                                @update:model-value="formatProdPricexInput"
                                :disable="formDisable"
                              />
                            </div>
                          </div>
                        </div>
                      </q-card>
                    </div>
                  </q-card>
                </div>

                <div class="col-12 col-sm-3">
                  <q-card flat bordered class="q-ma-xs q-pa-sm">
                    <q-card-section class="bg-brown text-center q-py-md">
                      <div class="text-subtitle1 text-bold">
                        부리일/상환일<br />
                        이율조건 선택
                      </div>
                    </q-card-section>
                    <q-card-section class="q-pa-none">
                      <q-list dense bordered padding class="rounded-borders text-primary q-px-md">
                        <q-item clickable v-ripple :active="formData.prodCond === ''" @click="formData.prodCond = ''" active-class="my-menu-link">
                          <q-item-section avatar>
                            <span class="text-subtitle2 text-bold"></span>
                          </q-item-section>
                          <q-item-section class="text-subtitle2 text-bold">해당사항없음</q-item-section>
                          <q-item-section avatar>
                            <q-toggle
                              dense
                              v-model="formData.prodCond"
                              true-value=""
                              false-value=""
                              checked-icon="check"
                              color="red"
                              unchecked-icon="clear"
                              :disable="formDisable"
                            />
                          </q-item-section>
                        </q-item>

                        <q-separator spaced />

                        <q-item clickable v-ripple :active="formData.prodCond === '1'" @click="formData.prodCond = '1'" active-class="my-menu-link">
                          <q-item-section avatar>
                            <span class="text-subtitle2 text-bold">1</span>
                          </q-item-section>
                          <q-item-section class="text-subtitle2 text-bold">조건1</q-item-section>
                          <q-item-section avatar>
                            <q-toggle
                              dense
                              v-model="formData.prodCond"
                              true-value="1"
                              false-value=""
                              checked-icon="check"
                              color="red"
                              unchecked-icon="clear"
                              :disable="formDisable"
                            />
                          </q-item-section>
                        </q-item>

                        <q-item clickable v-ripple :active="formData.prodCond === '2'" @click="formData.prodCond = '2'" active-class="my-menu-link">
                          <q-item-section avatar>
                            <span class="text-subtitle2 text-bold">2</span>
                          </q-item-section>
                          <q-item-section class="text-subtitle2 text-bold">조건2</q-item-section>
                          <q-item-section avatar>
                            <q-toggle
                              dense
                              v-model="formData.prodCond"
                              true-value="2"
                              false-value=""
                              checked-icon="check"
                              color="red"
                              unchecked-icon="clear"
                              :disable="formDisable"
                            />
                          </q-item-section>
                        </q-item>

                        <q-item clickable v-ripple :active="formData.prodCond === '3'" @click="formData.prodCond = '3'" active-class="my-menu-link">
                          <q-item-section avatar>
                            <span class="text-subtitle2 text-bold">3</span>
                          </q-item-section>
                          <q-item-section class="text-subtitle2 text-bold">조건3</q-item-section>
                          <q-item-section avatar>
                            <q-toggle
                              dense
                              v-model="formData.prodCond"
                              true-value="3"
                              false-value=""
                              checked-icon="check"
                              color="red"
                              unchecked-icon="clear"
                              :disable="formDisable"
                            />
                          </q-item-section>
                        </q-item>

                        <q-item clickable v-ripple :active="formData.prodCond === '4'" @click="formData.prodCond = '4'" active-class="my-menu-link">
                          <q-item-section avatar>
                            <span class="text-subtitle2 text-bold">4</span>
                          </q-item-section>
                          <q-item-section class="text-subtitle2 text-bold">조건4</q-item-section>
                          <q-item-section avatar>
                            <q-toggle
                              dense
                              v-model="formData.prodCond"
                              true-value="4"
                              false-value=""
                              checked-icon="check"
                              color="red"
                              unchecked-icon="clear"
                              :disable="formDisable"
                            />
                          </q-item-section>
                        </q-item>
                      </q-list>
                    </q-card-section>
                  </q-card>
                </div>
              </div>
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
          <q-card-actions align="right" class="q-pa-none">
            <q-toolbar class="row">
              <div class="row q-col-gutter-md">
                <q-select
                  dense
                  stack-label
                  options-dense
                  class="q-pb-sm q-mr-lg"
                  label-color="orange"
                  v-model="searchParam.divCd"
                  :options="divCdOptionsSearch"
                  option-value="commCd"
                  option-label="commNm"
                  option-disable="inactive"
                  emit-value
                  map-options
                  style="min-width: 130px; max-width: 130px"
                  label="품목유형"
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

const $q = useQuasar();

let isSaveFg = null;

const divCdOptionsSearch = ref(null);
const divCdOptions = ref(null);
const unitOptions = ref(null);

window.dateFormatRendering = function dateFormatRendering(params) {
  return formatDate(params.value);
};
window.currencyFormatter = function currencyFormatter(params) {
  return formatNumber(params.value);
};
window.formatNumber = function formatNumber(number) {
  return Math.floor(number).toLocaleString();
};

const formatProdCostInput = value => {
  // 입력값에서 콤마 제거 후 숫자만 남기기
  const numericValue = value.replace(/,/g, '');
  // 3자리마다 콤마 추가
  formData.value.prodCost = numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

const formatProdCostxInput = value => {
  // 입력값에서 콤마 제거 후 숫자만 남기기
  const numericValue = value.replace(/,/g, '');
  // 3자리마다 콤마 추가
  formData.value.prodCostx = numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

const formatProdPriceInput = value => {
  // 입력값에서 콤마 제거 후 숫자만 남기기
  const numericValue = value.replace(/,/g, '');
  // 3자리마다 콤마 추가
  formData.value.prodPrice = numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

const formatProdPricexInput = value => {
  // 입력값에서 콤마 제거 후 숫자만 남기기
  const numericValue = value.replace(/,/g, '');
  // 3자리마다 콤마 추가
  formData.value.prodPricex = numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

const searchParam = reactive({
  divCd: '',
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
      headerName: '유형',
      field: 'prodDivNm',
      pinned: 'left',
      maxWidth: 80,
      minWidth: 80,
    },
    {
      headerName: '코드',
      field: 'prodCd',
      pinned: 'left',
      maxWidth: 90,
      minWidth: 90,
    },
    {
      headerName: '품명',
      field: 'prodNm',
      minWidth: 150,
      pinned: 'left',
    },
    {
      headerName: '규격',
      field: 'prodSize',
      minWidth: 100,
    },
    {
      headerName: '단위',
      field: 'prodUnit',
      minWidth: 80,
    },
    {
      headerName: '기본입고단가',
      field: 'prodCost',
      minWidth: 130,
      cellStyle: { textAlign: 'right' },
      valueFormatter: currencyFormatter,
    },
    {
      headerName: '부가세',
      field: 'prodIvat',
      minWidth: 100,
      cellStyle: { textAlign: 'center' },
    },
    {
      headerName: '입고단가(포함)',
      field: 'prodCostx',
      minWidth: 140,
      cellStyle: { textAlign: 'right' },
      valueFormatter: currencyFormatter,
    },
    {
      headerName: '기본판매단가',
      field: 'prodPrice',
      minWidth: 130,
      cellStyle: { textAlign: 'right' },
      valueFormatter: currencyFormatter,
    },
    {
      headerName: '부가세',
      field: 'prodOvat',
      minWidth: 100,
      cellStyle: { textAlign: 'center' },
    },
    {
      headerName: '판매단가(포함)',
      field: 'prodPricex',
      minWidth: 140,
      cellStyle: { textAlign: 'right' },
      valueFormatter: currencyFormatter,
    },
    {
      headerName: '이자조건',
      field: 'prodCond',
      minWidth: 100,
      cellStyle: { textAlign: 'center' },
    },
    {
      headerName: '업로드코드',
      field: 'prodUpCd',
      minWidth: 110,
      cellStyle: { textAlign: 'center' },
    },
    {
      headerName: '사용기한',
      field: 'closeDay',
      minWidth: 120,
      valueFormatter: dateFormatRendering,
    },
    {
      headerName: '(구)코드',
      field: 'oldCode',
      minWidth: 100,
    },
    {
      headerName: '참고사항',
      field: 'explains',
      minWidth: 100,
      cellStyle: { textAlign: 'center' },
    },
  ],
});

const oldFormData = ref(null);
const formData = ref({
  prodCd: '',
  prodNm: '',
  prodDivCd: '',
  prodSize: '',
  prodUnit: '',
  prodCost: '0',
  prodCostx: '',
  prodIvat: 'N',
  prodPrice: '0',
  prodPricex: '',
  prodOvat: 'N',
  prodUpCd: '',
  prodCond: '',
  closeDay: '9999-12-31',
  oldCode: '',
  explains: '',
});

const formDataInitialize = () => {
  formData.value.prodCd = '';
  formData.value.prodNm = '';
  formData.value.prodDivCd = '';
  formData.value.prodSize = '';
  formData.value.prodUnit = '';
  formData.value.prodCost = '0';
  formData.value.prodCostx = '';
  formData.value.prodIvat = 'N';
  formData.value.prodPrice = '0';
  formData.value.prodPricex = '';
  formData.value.prodOvat = 'N';
  formData.value.prodUpCd = '';
  formData.value.prodCond = '';
  formData.value.closeDay = '9999-12-31';
  formData.value.oldCode = '';
  formData.value.explains = '';
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
    getSelectData(selectedRows.value[0].prodCd);
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

onBeforeMount(() => {
  rowSelection.value = 'multiple';
  getDataCommOption('104');
  getDataCommOption('105');
  getData();
});

const prodCdFocus = ref(null);
const prodDivCdFocus = ref(null);
const addDataSection = () => {
  formDataInitialize();
  getDataCodeSelect();
  oldFormData.value = formData;
  isShowStatusEdit.value = true;
  statusEdit.icon = 'edit';
  statusEdit.message = '신규입력모드 입니다';
  statusEdit.color = 'primary';
  isSaveFg = 'I';
  isShowSaveBtn.value = true;
  formDisable.value = false;
  formData.value.empOday = '9999-12-31';
  setTimeout(() => {
    prodDivCdFocus.value.focus();
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
    formData.value.closeDay = reFormatDate(formData.value.closeDay);
    formData.value.prodCost = formData.value.prodCost.replace(/,/g, '');
    formData.value.prodCostx = formData.value.prodCostx.replace(/,/g, '');
    formData.value.prodPrice = formData.value.prodPrice.replace(/,/g, '');
    formData.value.prodPricex = formData.value.prodPricex.replace(/,/g, '');

    saveDataAndHandleResult(jsonUtil.dataJsonParse(isSaveFg, formData.value));

    formData.value.closeDay = formatDate(formData.value.closeDay);
    formatProdCostInput(formData.value.prodCost);
    formatProdCostxInput(formData.value.prodCostx);
    formatProdPriceInput(formData.value.prodPrice);
    formatProdPricexInput(formData.value.prodPricex);
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

// ***** 품목정보 코드 가져오기 부분  *****************************//
const getDataCodeSelect = async () => {
  try {
    const response = await api.post('/api/mst/mst1020_code_select', {}, { headers: authHeader() });
    formData.value.prodCd = response.data.data[0].prodCd;
  } catch (error) {
    console.error('Error fetching users:', error);
  }
};
// ***** 품목정보 코드 가져오기 부분 끝 *****************************//

// ***** 품목정보 코드중복체크 부분  *****************************//
const getDataCodeCheck = async () => {
  try {
    const response = await api.post('/api/mst/mst1020_code_check', { paramProdCd: formData.value.prodCd }, { headers: authHeader() });
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
// ***** 품목정보 코드중복체크 부분 끝  *****************************//

// ***** 자료저장 및 삭제 처리부분 *****************************//
// saveStatus = 0=수정성공 1=신규성공 2=삭제성공 3=수정에러 4=시스템에러
const saveDataAndHandleResult = resFormData => {
  api
    .post('/api/mst/mst1020_save', resFormData, { headers: authHeader() })
    .then(res => {
      let saveStatus = {};
      if (res.data.rtn === '0') {
        if (isSaveFg === 'I') {
          saveStatus.rtn = 1;
          saveStatus.rtn1 = res.data.rtnMsg1;
          saveStatus.rtn2 = '신규추가 완료';
          formData.value.oldProdCd = formData.value.prodCd;
          formData.value.closeDay = reFormatDate(formData.value.closeDay);
          formData.value.prodCost = parseInt(formData.value.prodCost.replace(/,/g, ''));
          formData.value.prodCostx = parseInt(formData.value.prodCostx.replace(/,/g, ''));
          formData.value.prodPrice = parseInt(formData.value.prodPrice.replace(/,/g, ''));
          formData.value.prodPricex = parseInt(formData.value.prodPricex.replace(/,/g, ''));

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
          selectedData[0].prodCd = formData.value.prodCd;
          selectedData[0].oldProdCd = formData.value.prodCd;
          selectedData[0].prodNm = formData.value.prodNm;
          selectedData[0].prodSize = formData.value.prodSize;
          selectedData[0].prodUnit = formData.value.prodUnit;
          selectedData[0].prodCost = parseInt(formData.value.prodCost.replace(/,/g, ''));
          selectedData[0].prodCostx = parseInt(formData.value.prodCostx.replace(/,/g, ''));
          selectedData[0].prodIvat = formData.value.prodIvat;
          selectedData[0].prodPrice = parseInt(formData.value.prodPrice.replace(/,/g, ''));
          selectedData[0].prodPricex = parseInt(formData.value.prodPricex.replace(/,/g, ''));
          selectedData[0].prodOvat = formData.value.prodOvat;
          selectedData[0].prodUpCd = formData.value.prodUpCd;
          selectedData[0].prodCond = formData.value.prodCond;
          selectedData[0].closeDay = reFormatDate(formData.value.closeDay);
          selectedData[0].oldCode = formData.value.oldCode;
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
// ***** 사용자정보 목록 자료 가져오기 부분  *****************************//
const getData = async () => {
  try {
    const response = await api.post('/api/mst/mst1020_list', { paramDivCd: searchParam.divCd }, { headers: authHeader() });
    rowData.rows = response.data.data;
  } catch (error) {
    console.error('Error fetching users:', error);
  }
};
// ***** 사용자정보 목록 자료 가져오기 부분  *****************************//

// ***** 사용자정보 선택된 자료 가져오기 부분  *****************************//
const getSelectData = async resParamProdCd => {
  try {
    const response = await api.post('/api/mst/mst1020_select', { paramProdCd: resParamProdCd }, { headers: authHeader() });
    formData.value = response.data.data[0];
    // oldFormData.value = JSON.parse(JSON.stringify(formData.value)); // 초기자료 저장
    console.log(JSON.stringify(formData.value));
    formData.value.prodCost = response.data.data[0].prodCost.toLocaleString();
    formData.value.prodCostx = response.data.data[0].prodCostx.toLocaleString();
    formData.value.prodPrice = response.data.data[0].prodPrice.toLocaleString();
    formData.value.prodPricex = response.data.data[0].prodPricex.toLocaleString();
    formData.value.closeDay = formatDate(response.data.data[0].closeDay);
    // formData.value.empOday = formatDate(response.data.data[0].empOday);
    oldFormData.value = JSON.parse(JSON.stringify(formData.value)); // 초기자료 저장
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
      case '104':
        divCdOptions.value = response.data.data;
        divCdOptionsSearch.value = JSON.parse(JSON.stringify(divCdOptions.value));
        console.log(JSON.stringify(divCdOptionsSearch.value));
        divCdOptionsSearch.value.push({ commCd: '', commNm: '전체' });
        break;
      case '105':
        unitOptions.value = response.data.data;
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
</script>
<style lang="sass">
.my-menu-link
  color: white
  background: #F2C037
</style>

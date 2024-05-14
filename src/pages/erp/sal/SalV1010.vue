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
            <span class="text-subtitle2 q-px-sm">자료 조회/조정/삭제</span>
            <q-space />
            <q-chip v-if="isShowStatusEdit" size="sm" outline :color="statusEdit.color" class="q-px-md">
              <q-icon :name="statusEdit.icon" class="q-mr-sm" size="15px" /> {{ statusEdit.message }}
            </q-chip>
          </q-bar>
          <!--  end of contents list title bar -->
          <q-card-actions align="right" class="q-pb-none">
            <q-toolbar class="row">
              <span class="text-subtitle2 text-bold q-mr-xs">판매일자</span>
              <q-input dense outlined type="date" v-model="inputDay" bg-color="orange" style="max-width: 140px" />
              <q-btn class="q-ml-sm" outline color="primary" @click="getData"><q-icon name="search" size="xs" class="q-mr-xs" /> 조회 </q-btn>
              <q-btn class="q-ml-sm" outline color="primary" @click="newDataSection"><q-icon name="add" size="xs" class="q-mr-xs" /> 신규 </q-btn>
              <q-space />
              <q-input outlined dense v-model="searchParam.word" label="고객검색" style="min-width: 100px">
                <template v-slot:append>
                  <q-icon v-if="searchParam.word !== ''" name="close" @click="searchParam.word = ''" class="cursor-pointer" />
                  <q-icon name="search" class="cursor-pointer" />
                </template>
              </q-input>
              <q-space />

              <div class="row q-gutter-x-sm">
                <q-btn outline color="orange"> <q-icon name="print" size="xs" class="q-mr-xs" /> 출고증 </q-btn>
                <q-btn v-if="rowDataDeal.rows.length > 0" outline color="blue"> <q-icon name="save" size="xs" class="q-mr-xs" /> 저장 </q-btn>
                <q-btn v-if="isShowDeleteBtn" outline color="negative" @click="deleteDataSection">
                  <q-icon name="delete" size="xs" class="q-mr-xs" /> 삭제
                </q-btn>
                <q-btn v-if="isShowDeleteAllBtn" outline color="negative" dense @click="deleteDataSection">
                  <q-icon name="delete" size="xs" class="q-mr-xs" /> 전표삭제
                </q-btn>
              </div>
            </q-toolbar>
          </q-card-actions>
          <q-separator spaced />
          <q-card-section class="q-pa-none">
            <q-card bordered class="q-py-sm q-px-sm q-ma-xs" :class="$q.dark.isActive ? 'bg-dark' : 'bg-grey'">
              <div class="row q-gutter-xs-y-xs q-col-gutter-x-md">
                <div class="col-4 q-gutter-y-xs">
                  <div class="row q-gutter-x-sm">
                    <q-input
                      ref="custNmFocus"
                      :dense="dense"
                      :disable="formData1Disable"
                      clearable
                      clear-icon="close"
                      outlined
                      stack-label
                      v-model="formData1.custNm"
                      label-color="dark"
                      label="고객명"
                      :input-class="$q.dark.isActive ? 'text-yellow text-bold text-subtitle1' : 'text-blue text-bold text-subtitle1'"
                      :bg-color="$q.dark.isActive ? 'grey' : 'white'"
                      style="max-width: 180px; min-width: 120px"
                      @keyup.enter.stop="openHelpCustDialog"
                    >
                      <template v-slot:append>
                        <q-icon name="search" class="cursor-pointer" @click.stop.prevent="openHelpCustDialog" />
                      </template>
                    </q-input>
                    <q-input
                      :dense="dense"
                      :disable="formData1Disable"
                      outlined
                      stack-label
                      v-model="formData1.custCd"
                      label-color="dark"
                      label="관리코드"
                      :input-class="
                        $q.dark.isActive ? 'text-yellow text-bold text-subtitle1 text-center' : 'text-blue text-bold text-subtitle1 text-center'
                      "
                      :bg-color="$q.dark.isActive ? 'grey' : 'white'"
                      style="max-width: 80px"
                    />
                    <q-space />
                    <q-input
                      :dense="dense"
                      :disable="formData1Disable"
                      outlined
                      stack-label
                      v-model="formData1.dealNo"
                      label-color="dark"
                      label="전표번호"
                      :input-class="
                        $q.dark.isActive ? 'text-yellow text-bold text-subtitle1 text-center' : 'text-white text-bold text-subtitle1 text-center'
                      "
                      :bg-color="$q.dark.isActive ? 'grey' : 'grey'"
                      style="max-width: 70px"
                      class="q-ml-lg"
                    />
                  </div>
                  <div
                    class=""
                    :class="$q.dark.isActive ? 'bg-grey text-subtitle2 text-bold' : 'bg-white text-subtitle2 text-bold'"
                    style="border-radius: 3px"
                  >
                    <q-radio
                      :disable="formData1Disable"
                      size="sm"
                      v-model="formData1.cashCh"
                      val="2"
                      label="외상"
                      :color="$q.dark.isActive ? 'yellow' : 'blue'"
                    />
                    <q-radio
                      :disable="formData1Disable"
                      size="sm"
                      v-model="formData1.cashCh"
                      val="1"
                      label="현금"
                      :color="$q.dark.isActive ? 'yellow' : 'blue'"
                    />
                  </div>
                  <q-input
                    :dense="dense"
                    :disable="formData1Disable"
                    outlined
                    stack-label
                    v-model="formData1.explains"
                    label="기타사항"
                    label-color="dark"
                    :input-class="$q.dark.isActive ? 'text-yellow text-bold' : 'text-blue text-bold'"
                    :bg-color="$q.dark.isActive ? 'grey' : 'white'"
                  />
                </div>
                <div class="col-6">
                  <q-card bordered class="q-pa-md" :class="$q.dark.isActive ? 'bg-dark' : 'bg-grey'">
                    <div class="row q-col-gutter-x-sm">
                      <div class="col-4 flex flex-left text-dark text-subtitle2 text-bold text-right">
                        <span style="min-width: 70px" class="q-pr-sm" :class="$q.dark.isActive ? 'text-white' : 'text-dark'">고객번호: </span>
                        <span :class="$q.dark.isActive ? 'text-orange' : 'text-white'">{{ infoCustZone.custNo }}</span>
                      </div>
                      <div class="col-4 flex flex-left text-dark text-subtitle2 text-bold text-right">
                        <span style="min-width: 80px" class="q-pr-sm" :class="$q.dark.isActive ? 'text-white' : 'text-dark'">약정만기일: </span
                        ><span :class="$q.dark.isActive ? 'text-orange' : 'text-white'">{{ infoCustZone.excDay }}</span>
                      </div>
                      <div class="col-4 flex flex-left text-dark text-subtitle2 text-bold text-right">
                        <span style="min-width: 70px" class="q-pr-sm" :class="$q.dark.isActive ? 'text-white' : 'text-dark'">약정금액: </span
                        ><span :class="$q.dark.isActive ? 'text-orange' : 'text-white'">{{ infoCustZone.limitAmt }}</span>
                      </div>
                    </div>
                    <q-separator spaced />
                    <div class="row q-col-gutter-x-sm">
                      <div class="col-4 flex flex-left text-dark text-subtitle2 text-bold text-right">
                        <span style="min-width: 70px" class="q-pr-sm" :class="$q.dark.isActive ? 'text-white' : 'text-dark'">판매금액: </span
                        ><span :class="$q.dark.isActive ? 'text-orange' : 'text-white'">{{ infoCustZone.dealAmt }}</span>
                      </div>
                      <div class="col-4 flex flex-left text-dark text-subtitle2 text-bold text-right">
                        <span style="min-width: 80px" class="q-pr-sm" :class="$q.dark.isActive ? 'text-white' : 'text-dark'">수 금 액: </span
                        ><span :class="$q.dark.isActive ? 'text-orange' : 'text-white'">{{ infoCustZone.collAmt }}</span>
                      </div>
                      <div class="col-4 flex flex-left text-dark text-subtitle2 text-bold text-right">
                        <span style="min-width: 70px" class="q-pr-sm" :class="$q.dark.isActive ? 'text-white' : 'text-dark'">미수금액: </span
                        ><span :class="$q.dark.isActive ? 'text-orange' : 'text-white'">{{ infoCustZone.receAmt }}</span>
                      </div>
                    </div>
                    <q-separator spaced />
                    <div class="q-col-gutter-x-sm">
                      <div class="flex flex-left text-dark text-subtitle2 text-bold text-right">
                        <span style="min-width: 70px" class="q-pr-sm" :class="$q.dark.isActive ? 'text-white' : 'text-dark'">주 소: </span
                        ><span :class="$q.dark.isActive ? 'text-orange' : 'text-white'">{{ infoCustZone.addr }}</span>
                      </div>
                    </div>
                    <div class="row q-col-gutter-x-sm">
                      <div class="col-6 flex flex-left text-dark text-subtitle2 text-bold text-right">
                        <span style="min-width: 70px" class="q-pr-sm" :class="$q.dark.isActive ? 'text-white' : 'text-dark'">휴 대 폰: </span
                        ><span :class="$q.dark.isActive ? 'text-orange' : 'text-white'">{{ infoCustZone.mobile }}</span>
                      </div>
                      <div class="col-6 flex flex-left text-dark text-subtitle2 text-bold text-right">
                        <span style="min-width: 80px" class="q-pr-sm" :class="$q.dark.isActive ? 'text-white' : 'text-dark'">전화번호: </span
                        ><span :class="$q.dark.isActive ? 'text-orange' : 'text-white'">{{ infoCustZone.tel }}</span>
                      </div>
                    </div>
                  </q-card>
                </div>
                <div class="col-2 flex flex-center"></div>
              </div>
            </q-card>
            <q-card bordered class="q-py-sm q-px-sm q-ma-xs" :class="$q.dark.isActive ? 'bg-dark' : 'bg-grey'">
              <div class="row q-gutter-x-xs q-gutter-xs-y-xs">
                <q-input
                  :dense="dense"
                  :disable="formData2Disable"
                  outlined
                  stack-label
                  v-model="formData2.seq"
                  label="No"
                  label-color="dark"
                  :input-class="$q.dark.isActive ? 'text-red text-bold text-center' : 'text-red text-bold text-center'"
                  :bg-color="$q.dark.isActive ? 'grey' : 'white'"
                  style="max-width: 50px"
                  @keyup.enter.stop="$refs['dealQty'].$el.focus()"
                />
                <q-input
                  ref="prodNmFocus"
                  :dense="dense"
                  :disable="formData2Disable"
                  clearable
                  clear-icon="close"
                  outlined
                  stack-label
                  v-model="formData2.prodNm"
                  label="품명"
                  label-color="dark"
                  :input-class="$q.dark.isActive ? 'text-yellow text-bold' : 'text-blue text-bold'"
                  :bg-color="$q.dark.isActive ? 'grey' : 'white'"
                  style="max-width: 180px; min-width: 150px"
                  @keyup.enter.prevent="prodInputCheck"
                >
                  <template v-slot:append>
                    <!--                    <q-icon v-if="formData2.prodNm !== ''" name="close" @click="formData2.prodNm = ''" class="q-mt-md cursor-pointer" size="xs" />-->
                    <q-icon name="search" class="cursor-pointer q-ml-none" @click="openHelpProdDialog" />
                  </template>
                </q-input>
                <q-input
                  :dense="dense"
                  :disable="formData2Disable"
                  outlined
                  stack-label
                  v-model="formData2.prodCd"
                  label="코드"
                  label-color="dark"
                  :input-class="$q.dark.isActive ? 'text-yellow text-bold' : 'text-blue text-bold'"
                  :bg-color="$q.dark.isActive ? 'grey' : 'white'"
                  style="max-width: 70px"
                />
                <q-input
                  tabindex="-1"
                  :dense="dense"
                  :disable="formData2Disable"
                  outlined
                  stack-label
                  v-model="formData2.prodSize"
                  label="규격"
                  label-color="dark"
                  :input-class="$q.dark.isActive ? 'text-yellow text-bold' : 'text-blue text-bold'"
                  :bg-color="$q.dark.isActive ? 'grey' : 'white'"
                  style="max-width: 100px; min-width: 80px"
                />
                <q-input
                  tabindex="-1"
                  :dense="dense"
                  :disable="formData2Disable"
                  outlined
                  stack-label
                  v-model="formData2.prodUnit"
                  label="단위"
                  label-color="dark"
                  :input-class="$q.dark.isActive ? 'text-yellow text-bold' : 'text-blue text-bold'"
                  :bg-color="$q.dark.isActive ? 'grey' : 'white'"
                  style="max-width: 50px"
                />
                <q-input
                  ref="dealQtyFocus"
                  :dense="dense"
                  :disable="formData2Disable"
                  outlined
                  stack-label
                  v-model="formData2.dealQty"
                  label="수량"
                  label-color="dark"
                  :input-class="$q.dark.isActive ? 'text-yellow text-bold text-right' : 'text-blue text-bold text-right'"
                  :bg-color="$q.dark.isActive ? 'grey' : 'white'"
                  @update:model-value="formatDealQtyInput"
                  style="max-width: 100px"
                  @keydown.enter.prevent="$refs['dealPriceFocus'].$el.focus()"
                />
                <q-input
                  ref="dealPriceFocus"
                  :dense="dense"
                  :disable="formData2Disable"
                  outlined
                  stack-label
                  v-model="formData2.dealPrice"
                  label="단가"
                  label-color="dark"
                  :input-class="$q.dark.isActive ? 'text-yellow text-bold text-right' : 'text-blue text-bold text-right'"
                  :bg-color="$q.dark.isActive ? 'grey' : 'white'"
                  @update:model-value="formatDealPriceInput"
                  style="max-width: 100px"
                  @keydown.enter.prevent="$refs['dealSupAmtFocus'].$el.focus()"
                />
                <q-input
                  ref="dealSupAmtFocus"
                  :dense="dense"
                  :disable="formData2Disable"
                  outlined
                  stack-label
                  v-model="formData2.dealSupAmt"
                  label="공급가액"
                  label-color="dark"
                  :input-class="$q.dark.isActive ? 'text-yellow text-bold text-right' : 'text-blue text-bold text-right'"
                  :bg-color="$q.dark.isActive ? 'grey' : 'white'"
                  @update:model-value="formatDealSupAmtInput"
                  style="max-width: 140px"
                  @keydown.enter.prevent="$refs['dealVatFocus'].$el.focus()"
                />
                <q-input
                  ref="dealVatFocus"
                  :dense="dense"
                  :disable="formData2Disable"
                  outlined
                  stack-label
                  v-model="formData2.dealVat"
                  label="부가세"
                  label-color="dark"
                  :input-class="$q.dark.isActive ? 'text-yellow text-bold text-right' : 'text-blue text-bold text-right'"
                  :bg-color="$q.dark.isActive ? 'grey' : 'white'"
                  @update:model-value="formatDealVatInput"
                  style="max-width: 130px"
                  @keydown.enter.prevent="$refs['dealAmtFocus'].$el.focus()"
                />
                <q-input
                  ref="dealAmtFocus"
                  :dense="dense"
                  :disable="formData2Disable"
                  outlined
                  stack-label
                  v-model="formData2.dealAmt"
                  label="합계금액"
                  label-color="dark"
                  :input-class="$q.dark.isActive ? 'text-yellow text-bold text-right' : 'text-blue text-bold text-right'"
                  :bg-color="$q.dark.isActive ? 'grey' : 'white'"
                  @update:model-value="formatDealAmtInput"
                  style="max-width: 140px"
                  @keydown.enter.prevent="$refs['saveBtn'].$el.focus()"
                />
                <q-space />
                <q-btn
                  v-if="formData2.prodNm"
                  ref="saveBtn"
                  color="orange"
                  text-color="black"
                  icon="playlist_add"
                  size="lg"
                  class="q-pa-sm"
                  @keyup="addDataSectionKey"
                  @click="addDataSection"
                >
                  <q-tooltip
                    class="bg-amber text-black shadow-4"
                    anchor="top middle"
                    self="bottom middle"
                    transition-show="rotate"
                    transition-hide="rotate"
                    :offset="[10, 10]"
                  >
                    <q-icon name="add" size="0.8rem" />
                    <strong> 입력자료 추가하기 </strong>
                  </q-tooltip></q-btn
                >
              </div>
            </q-card>
          </q-card-section>
          <q-card-section class="q-pa-xs">
            <div style="height: 250px">
              <ag-grid-vue
                style="width: 100%; height: 100%"
                :class="$q.dark.isActive ? 'ag-theme-alpine-dark' : 'ag-theme-alpine'"
                :defaultColDef="defaultColDefDeal"
                :columnDefs="columnDefsDeal.columns"
                :rowData="rowDataDeal.rows"
                :pagination="false"
                @selection-changed="onSelectionChangedDeal"
                @cell-value-changed="onCellValueChangedDeal"
                @grid-ready="onGridReadyDeal"
                :suppressRowClickSelection="isSelected"
                :grid-options="gridOptionsDeal"
              >
              </ag-grid-vue>
            </div>
          </q-card-section>
        </q-card>
      </div>
      <!--  end of contents list -->

      <!-- contents List -->
      <div class="col-12">
        <q-card bordered>
          <q-tabs inline-label v-model="tab" dense class="text-grey" active-color="primary" indicator-color="primary" align="justify">
            <q-tab name="dealList" icon="list_alt"><span class="text-subtitle2 text-bold q-ml-sm">매출목록현황</span></q-tab>
            <q-tab name="inventoryList" icon="fact_check"><span class="text-subtitle2 text-bold q-ml-sm">재고현황</span></q-tab>
            <q-tab name="remarksList" icon="pending"><span class="text-subtitle2 text-bold q-ml-sm">기타</span></q-tab>
          </q-tabs>
          <q-separator />
          <q-tab-panels v-model="tab" animated>
            <q-tab-panel name="dealList" class="q-pa-xs">
              <div style="height: 350px">
                <ag-grid-vue
                  style="width: 100%; height: 100%"
                  :class="$q.dark.isActive ? 'ag-theme-alpine-dark' : 'ag-theme-alpine'"
                  :columnDefs="columnDefs.columns"
                  :rowData="rowData.rows"
                  :defaultColDef="defaultColDef.def"
                  @selection-changed="onSelectionChanged"
                  @grid-ready="onGridReady"
                  setPinnedBottomRowData="setPinnedBottomRowData"
                  :grid-options="gridOptions"
                >
                </ag-grid-vue>
              </div>
            </q-tab-panel>
            <q-tab-panel name="inventoryList" class="q-pa-xs">
              <div style="height: 350px">
                <ag-grid-vue
                  style="width: 100%; height: 100%"
                  :class="$q.dark.isActive ? 'ag-theme-alpine-dark' : 'ag-theme-alpine'"
                  :columnDefs="columnDefs.columns"
                  :rowData="rowData.rows"
                  :defaultColDef="defaultColDef.def"
                  :rowSelection="rowSelection"
                  @selection-changed="onSelectionChanged"
                  @grid-ready="onGridReady"
                  setPinnedBottomRowData="setPinnedBottomRowData"
                >
                </ag-grid-vue>
              </div>
            </q-tab-panel>
            <q-tab-panel name="remarksList" class="q-pa-none">
              <q-splitter v-model="splitterModel">
                <template v-slot:before>
                  <q-tabs inline-label v-model="innerTab" vertical class="text-teal">
                    <q-tab name="innerDivDeal" icon="mail" label="품목군집계표" />
                    <q-tab name="innerReturnInfo" icon="alarm" label="반품정보조회" />
                    <q-tab name="innerRemark" icon="movie" label="기타" />
                  </q-tabs>
                </template>

                <template v-slot:after>
                  <q-tab-panels v-model="innerTab" animated transition-prev="slide-down" transition-next="slide-up">
                    <q-tab-panel name="innerDivDeal">
                      <div class="text-h6">제품군별 판매집계표</div>
                      <q-separator spaced />
                      <p>
                        Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quis praesentium cumque magnam odio iure quidem, quod illum numquam
                        possimus obcaecati commodi minima assumenda consectetur culpa fuga nulla ullam. In, libero.
                      </p>
                      <p>
                        Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quis praesentium cumque magnam odio iure quidem, quod illum numquam
                        possimus obcaecati commodi minima assumenda consectetur culpa fuga nulla ullam. In, libero.
                      </p>
                    </q-tab-panel>

                    <q-tab-panel name="innerReturnInfo">
                      <div class="text-h6">반품전표 상세내역정보</div>
                      <q-separator spaced />
                      <p>
                        Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quis praesentium cumque magnam odio iure quidem, quod illum numquam
                        possimus obcaecati commodi minima assumenda consectetur culpa fuga nulla ullam. In, libero.
                      </p>
                      <p>
                        Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quis praesentium cumque magnam odio iure quidem, quod illum numquam
                        possimus obcaecati commodi minima assumenda consectetur culpa fuga nulla ullam. In, libero.
                      </p>
                    </q-tab-panel>

                    <q-tab-panel name="innerRemark">
                      <div class="text-h6">기타 내역정보</div>
                      <q-separator spaced />
                      <p>
                        Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quis praesentium cumque magnam odio iure quidem, quod illum numquam
                        possimus obcaecati commodi minima assumenda consectetur culpa fuga nulla ullam. In, libero.
                      </p>
                      <p>
                        Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quis praesentium cumque magnam odio iure quidem, quod illum numquam
                        possimus obcaecati commodi minima assumenda consectetur culpa fuga nulla ullam. In, libero.
                      </p>
                      <p>
                        Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quis praesentium cumque magnam odio iure quidem, quod illum numquam
                        possimus obcaecati commodi minima assumenda consectetur culpa fuga nulla ullam. In, libero.
                      </p>
                    </q-tab-panel>
                  </q-tab-panels>
                </template>
              </q-splitter>
            </q-tab-panel>
          </q-tab-panels>
          <q-card-section class="q-pa-xs">
            <!--            <div :style="contentZoneStyle">-->
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
import { Notify, QBtn, QIcon, useQuasar, date } from 'quasar';
import { computed, nextTick, onBeforeMount, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue';
import { api } from '/src/boot/axios';
import authHeader from 'boot/authHeader';
import commUtil from 'src/js_comm/comm-util';
import jsonUtil from 'src/js_comm/json-util';
import notifySave from 'src/js_comm/notify-save';
import HelpCust from 'components/subvue/HelpCust.vue';
import HelpProd from 'components/subvue/HelpProd.vue';

const $q = useQuasar();

let isSaveFg = null;

const tab = ref('dealList');
const innerTab = ref('innerDivDeal');
const splitterModel = ref(15);

const formData1Disable = ref(true);
const formData2Disable = ref(true);

const dense = ref(false);
const divCdOptionsSearch = ref(null);
const divCdOptions = ref(null);
const unitOptions = ref(null);
const inputDay = ref(null);
const isSelected = ref(true);

window.dateFormatRendering = function dateFormatRendering(params) {
  return commUtil.formatDate(params.value);
};
window.currencyFormatter = function currencyFormatter(params) {
  return formatNumber(params.value);
};
window.formatNumber = function formatNumber(number) {
  return Math.floor(number).toLocaleString();
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

const contentZoneHeight = ref(200);
const contentZoneStyle = computed(() => ({
  height: `${contentZoneHeight.value}px`,
}));

const rowData = reactive({ rows: [] });
const rowDataDeal = reactive({ rows: [] });

const gridApiDeal = ref(null);
const onGridReadyDeal = params => {
  gridApiDeal.value = params.api;
  gridApiDeal.value.setGridOption('headerHeight', 30);
  gridApiDeal.value.setGridOption('rowHeight', 30);
  totalComputedDeal();
};
const gridApi = ref(null);
const onGridReady = params => {
  gridApi.value = params.api;
  gridApi.value.setGridOption('headerHeight', 25);
  // gridApi.value.setGridOption("floatingFiltersHeight", value);
  gridApi.value.setGridOption('rowHeight', 25);
  totalComputed();
};

const columnDefsDeal = reactive({
  columns: [
    {
      headerName: '',
      field: '',
      maxWidth: 50,
      minWidth: 50,
      checkboxSelection: true,
      headerCheckboxSelection: true,
      editable: false,
      filter: false,
      pinned: 'left',
    },
    {
      headerName: 'No',
      field: 'seq',
      maxWidth: 50,
      minWidth: 50,
    },
    {
      headerName: '코드',
      field: 'prodCd',
      maxWidth: 100,
      minWidth: 100,
    },
    {
      headerName: '품명',
      field: 'prodNm',
      minWidth: 150,
    },
    {
      headerName: '규격',
      field: 'prodSize',
      minWidth: 80,
    },
    {
      headerName: '단위',
      field: 'prodUnit',
      minWidth: 60,
      maxWidth: 60,
    },
    {
      headerName: '수량',
      field: 'dealQty',
      minWidth: 70,
      cellStyle: { textAlign: 'right' },
      valueFormatter: currencyFormatter,
    },
    {
      headerName: '단가',
      field: 'dealPrice',
      minWidth: 80,
      cellStyle: { textAlign: 'right' },
      valueFormatter: currencyFormatter,
    },
    {
      headerName: '금액',
      field: 'dealSupAmt',
      minWidth: 130,
      cellStyle: { textAlign: 'right' },
      valueFormatter: currencyFormatter,
    },
    {
      headerName: '부가세',
      field: 'dealVat',
      minWidth: 110,
      cellStyle: { textAlign: 'right' },
      valueFormatter: currencyFormatter,
    },
    {
      headerName: '합게금액',
      field: 'dealAmt',
      minWidth: 130,
      cellStyle: { textAlign: 'right' },
      valueFormatter: currencyFormatter,
    },
    {
      headerName: '부리일',
      field: 'mDay',
      minWidth: 120,
      maxWidth: 120,
      valueFormatter: dateFormatRendering,
      cellStyle: { backgroundColor: '#33cc3322' },
    },
    {
      headerName: '상환일',
      field: 'yDay',
      minWidth: 120,
      maxWidth: 120,
      valueFormatter: dateFormatRendering,
      cellStyle: { backgroundColor: '#cc222222' },
    },
  ],
});
// End of Grid 컴럼 설정

const defaultColDef = reactive({
  def: {
    flex: 1,
    sortable: true,
    filter: true,
    floatingFilter: false,
    editable: false,
    // initialWidth: 200,
    wrapHeaderText: true,
    autoHeaderHeight: true,
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
      headerName: '고객정보',
      children: [
        { headerName: '전표번호', field: 'dealNo', pinned: 'left', maxWidth: 95, minWidth: 70 },
        { headerName: '코드', field: 'custCd', pinned: 'left', maxWidth: 80, minWidth: 80 },
        { headerName: '고객명', field: 'custNm', minWidth: 80, maxWidth: 170, pinned: 'left' },
      ],
    },
    {
      headerName: '건',
      field: 'dealCnt',
      minWidth: 60,
      valueFormatter: currencyFormatter,
      cellStyle: { textAlign: 'right', backgroundColor: '#33cc3322' },
    },
    {
      headerName: '수량',
      field: 'dealQty',
      minWidth: 80,
      valueFormatter: currencyFormatter,
      cellStyle: { textAlign: 'right', backgroundColor: '#2244cc22' },
    },
    {
      headerName: '외상내역',
      children: [
        {
          headerName: '공급가액',
          field: 'dealSupAmtCredit',
          minWidth: 120,
          cellStyle: { textAlign: 'right', backgroundColor: '#cc222211' },
          valueFormatter: currencyFormatter,
        },
        {
          headerName: '부가세',
          field: 'dealVatCredit',
          minWidth: 100,
          cellStyle: { textAlign: 'right', backgroundColor: '#cc222222' },
          valueFormatter: currencyFormatter,
        },
        {
          headerName: '합계금액',
          field: 'dealAmtCredit',
          minWidth: 120,
          cellStyle: { textAlign: 'right', backgroundColor: '#cc222233' },
          valueFormatter: currencyFormatter,
        },
      ],
    },
    {
      headerName: '현금내역',
      children: [
        {
          headerName: '공급가액',
          field: 'dealSupAmtCash',
          minWidth: 120,
          cellStyle: { textAlign: 'right', backgroundColor: '#33cc3311' },
          valueFormatter: currencyFormatter,
        },
        {
          headerName: '부가세',
          field: 'dealVatCash',
          minWidth: 100,
          cellStyle: { textAlign: 'right', backgroundColor: '#33cc3322' },
          valueFormatter: currencyFormatter,
        },
        {
          headerName: '합계금액',
          field: 'dealAmtCash',
          minWidth: 120,
          cellStyle: { textAlign: 'right', backgroundColor: '#33cc3333' },
          valueFormatter: currencyFormatter,
        },
      ],
    },
  ],
});
const formData = ref({
  dealDay: '',
  custCd: '',
  dealNo: '',
  cashCh: '',
  explains: '',
  seq: 0,
  prodCd: '',
  prodNm: '',
  prodSize: '',
  prodUnit: '',
  dealQty: 0,
  dealPrice: 0,
  dealSupAmt: 0,
  dealVat: 0,
  dealAmt: 0,
  mDay: '',
  yDay: '',
});

const infoCustZone = ref({
  custNo: '',
  excDay: '',
  limitAmt: 0,
  dealAmt: 0,
  collAmt: 0,
  receAmt: 0,
  addr: '',
  mobile: '',
  tel: '',
});
const formData1 = ref({
  dealDay: '',
  custCd: '',
  custNm: '',
  dealNo: '',
  seq: 1,
  cashCh: '',
  explains: '',
});
const formData2 = ref({
  seq: 0,
  prodCd: '',
  prodNm: '',
  prodSize: '',
  prodUnit: '',
  dealQty: 0,
  dealPrice: 0,
  dealSupAmt: 0,
  dealVat: 0,
  dealAmt: 0,
  mDay: '',
  yDay: '',
});
const formData1Initialize = () => {
  formData1.value.dealDay = '';
  formData1.value.custNm = '';
  formData1.value.custCd = '';
  formData1.value.dealNo = '';
  formData1.value.seq = 1;
  formData1.value.cashCh = '2';
  formData1.value.explains = '';
};
const formData2Initialize = () => {
  formData2.value.seq = 0;
  formData2.value.prodCd = '';
  formData2.value.prodNm = '';
  formData2.value.prodSize = '';
  formData2.value.prodUnit = '';
  formData2.value.dealQty = 0;
  formData2.value.dealPrice = 0;
  formData2.value.dealSupAmt = 0;
  formData2.value.dealVat = 0;
  formData2.value.dealAmt = 0;
  formData2.value.mDay = '';
  formData2.value.yDay = '';
};

const selectedRows = ref();
const isShowStatusEdit = ref(false);
const isShowDeleteBtn = ref(false);
const isShowDeleteAllBtn = ref(false);
const isShowSaveBtn = ref(false);

// row가 selected 선택되었을때 이벤트
const onSelectionChangedDeal = event => {
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
    formData.value = [];
    isShowStatusEdit.value = false;
    isSaveFg = '';
    formDisable.value = true;
  }
};
const onSelectionChanged = event => {
  selectedRows.value = event.api.getSelectedRows();
  isShowStatusEdit.value = false;
  isShowDeleteAllBtn.value = selectedRows.value.length > 0;
  isShowSaveBtn.value = isShowDeleteAllBtn.value;

  if (selectedRows.value.length === 1) {
    getDataDeal(selectedRows.value[0].dealDay, selectedRows.value[0].dealNo, selectedRows.value[0].custCd);
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

// cell 값이 변경되었을때 이벤트
const onCellValueChangedDeal = event => {
  const rowIndex = event.rowIndex;
  const columnId = event.column.colId;
  console.log(`Cell at row ${rowIndex}, column ${columnId} changed`);
  console.log(`New Cell Value: ${event.value}`);
  console.log('New row data2: ', JSON.stringify(rowDataDeal.rows));

  const rowDataItem = rowDataDeal.rows[rowIndex];
  console.log('Entire row data:', rowDataItem);
  // setCellValue(rowIndex, 'mDay', '20240401');

  // Check if the edited cell is in the last column
  const lastColumnIndex = columnDefs.columns.length - 1;
  const currentColumnIndex = columnDefs.columns.findIndex(col => col.field === columnId);
  console.log('lastColumnIndex: ', lastColumnIndex, ' = ', currentColumnIndex);
  if (currentColumnIndex !== lastColumnIndex) {
    // If not in the last column, move focus to the next cell
    const nextColumn = gridApi.value.getColumnDefs()[currentColumnIndex + 1];
    gridApi.value.tabToNextCell(); // Move focus to the next cell
    gridApi.value.ensureColumnVisible(nextColumn);
  } else {
    // If in the last column, move focus to the next row's first editable cell
    const nextRowIndex = rowIndex + 1;
    gridApi.value.forEachNodeAfterFilterAndSort(node => {
      if (node.rowIndex === nextRowIndex) {
        const firstEditableColumn = gridApi.value.getColumnDefs().find(col => col.editable);
        if (firstEditableColumn) {
          gridApi.value.ensureColumnVisible(firstEditableColumn);
          gridApi.value.startEditingCell({
            rowIndex: nextRowIndex,
            colKey: firstEditableColumn.colId,
          });
        }
      }
    });
  }
};

const rowSelectionDeal = ref(null);
const rowSelection = ref(null);

const custNmFocus = ref(null);
const prodNmFocus = ref(null);
const dealQtyFocus = ref(null);
const dealPriceFocus = ref(null);
const newDataSection = () => {
  isShowStatusEdit.value = true;
  statusEdit.icon = 'edit';
  statusEdit.message = '신규 입력모드 입니다';
  statusEdit.color = 'accent';
  isSaveFg = 'I';

  formData1Initialize();
  formData2Initialize();

  formData1Disable.value = false;
  formData2Disable.value = false;

  // grid clear부분
  rowDataDeal.rows = [];
  const rowData = [];
  gridApiDeal.value.forEachNode(function (node) {
    rowData.push(node.data);
  });
  gridApiDeal.value.applyTransaction({
    remove: rowData,
  });
  // grid clear부분 끝

  totalComputedDeal(); // 합계 row clear

  getDataDealNoSelect();
  formData2.value.seq = formData1.value.seq;
  setTimeout(() => {
    custNmFocus.value.focus();
  }, 200);
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
const addDataSectionKey = event => {
  if (event.key !== 'Enter') {
    console.log('key: ', event.key);
    addDataSection();
  }
};
const addDataSection = () => {
  formData.value.dealDay = commUtil.reFormatDate(inputDay.value);
  formData.value.custCd = formData1.value.custCd;
  formData.value.cashCh = formData1.value.cashCh;
  formData.value.dealNo = formData1.value.dealNo;

  formData.value.seq = formData2.value.seq;
  formData.value.prodCd = formData2.value.prodCd;
  formData.value.prodNm = formData2.value.prodNm;
  formData.value.prodSize = formData2.value.prodSize;
  formData.value.prodUnit = formData2.value.prodUnit;
  formData.value.dealQty = commUtil.removeComma(formData2.value.dealQty);
  formData.value.dealPrice = commUtil.removeComma(formData2.value.dealPrice);
  formData.value.dealSupAmt = commUtil.removeComma(formData2.value.dealSupAmt);
  formData.value.dealVat = commUtil.removeComma(formData2.value.dealVat);
  formData.value.dealAmt = commUtil.removeComma(formData2.value.dealAmt);

  formData.value.mDay = commUtil.reFormatDate(formData2.value.mDay);
  formData.value.yDay = commUtil.reFormatDate(formData2.value.yDay);

  // saveDataAndHandleResult(jsonUtil.dataJsonParse(isSaveFg, formData.value));
  rowDataDeal.rows.push(formData.value);
  let newData = [formData.value];
  gridApiDeal.value.applyTransaction({
    add: newData,
    addIndex: null,
  });
  setTimeout(() => {
    totalComputedDeal();
  }, 200);
  console.log('saveData: ', JSON.stringify(rowDataDeal.rows));

  formData2.value.seq = formData.value.seq + 1;
  formData2.value.prodCd = '';
  formData2.value.prodNm = '';
  formData2.value.prodSize = '';
  formData2.value.prodUnit = '';
  formData2.value.dealQty = 0;
  formData2.value.dealPrice = 0;
  formData2.value.dealSupAmt = 0;
  formData2.value.dealVat = 0;
  formData2.value.dealAmt = 0;
  formData2.value.mDay = null;
  formData2.value.yDay = null;

  prodNmFocus.value.focus();
};

// const formatDate = rawDate => {
//   if (rawDate) {
//     const year = rawDate.substring(0, 4);
//     const month = rawDate.substring(4, 6);
//     const day = rawDate.substring(6, 8);
//     return `${year}-${month}-${day}`;
//   } else {
//     return null;
//   }
// };

const gridOptions = {
  rowSelection: 'multiple' /* 'single' or 'multiple',*/,
  localeText: { noRowsToShow: '해당 일자에 판매된 자료가 없습니다.' },
};
const gridOptionsDeal = {
  rowSelection: 'multiple' /* 'single' or 'multiple',*/,
  localeText: { noRowsToShow: '자료가 없습니다.' },
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
  const toDay = Date.now();
  inputDay.value = date.formatDate(toDay, 'YYYY-MM-DD');
  getData();
  // getDataCommOption('104');
  // getDataCommOption('105');
});

onMounted(() => {
  window.addEventListener('resize', handleResize);
  handleResize();
});

const totalComputedDeal = () => {
  const totQty = rowDataDeal.rows.reduce((sum, item) => sum + item.dealQty, 0);
  const totSupAmt = rowDataDeal.rows.reduce((sum, item) => sum + item.dealSupAmt, 0);
  const totVat = rowDataDeal.rows.reduce((sum, item) => sum + item.dealVat, 0);
  const totAmt = rowDataDeal.rows.reduce((sum, item) => sum + item.dealAmt, 0);
  const pinnedBottomRowData = [
    {
      prodNm: '합계',
      dealQty: totQty,
      dealPrice: 0,
      dealSupAmt: totSupAmt,
      dealVat: totVat,
      dealAmt: totAmt,
    },
  ];
  gridApiDeal.value.setPinnedBottomRowData(pinnedBottomRowData);
};
const totalComputed = () => {
  const totCnt = rowData.rows.reduce((sum, item) => sum + item.dealCnt, 0);
  const totQty = rowData.rows.reduce((sum, item) => sum + item.dealQty, 0);
  const totSupAmtCredit = rowData.rows.reduce((sum, item) => sum + item.dealSupAmtCredit, 0);
  const totVatCredit = rowData.rows.reduce((sum, item) => sum + item.dealVatCredit, 0);
  const totAmtCredit = rowData.rows.reduce((sum, item) => sum + item.dealAmtCredit, 0);
  const totSupAmtCash = rowData.rows.reduce((sum, item) => sum + item.dealSupAmtCash, 0);
  const totVatCash = rowData.rows.reduce((sum, item) => sum + item.dealVatCash, 0);
  const totAmtCash = rowData.rows.reduce((sum, item) => sum + item.dealAmtCash, 0);
  const pinnedTopRowData = [
    {
      custNm: '합계',
      dealCnt: totCnt,
      dealQty: totQty,
      dealSupAmtCredit: totSupAmtCredit,
      dealVatCredit: totVatCredit,
      dealAmtCredit: totAmtCredit,
      dealSupAmtCash: totSupAmtCash,
      dealVatCash: totVatCash,
      dealAmtCash: totAmtCash,
    },
  ];
  gridApi.value.setPinnedTopRowData(pinnedTopRowData);
};

// **************************************************************//
// ***** Dialog Help 연결부분  ************************************//
// **************************************************************//
const enterPressed = ref(false);
const openHelpCustDialog = () => {
  if (!enterPressed.value) {
    $q.dialog({
      component: HelpCust,
      componentProps: {
        paramCustNm: formData1.value.custNm,
        paramCloseDay: commUtil.reFormatDate(inputDay.value),
      },
    })
      .onOk(res => {
        formData1.value.custCd = res.custCd;
        formData1.value.custNm = res.custNm;
        getDataCustSelect();
        formData1.value.cashCh = '2';
        setTimeout(() => {
          prodNmFocus.value.focus();
        }, 100);
      })
      .onCancel(() => {
        console.log('Cancel');
      })
      .onDismiss(() => {
        console.log('Called on OK or Cancel');
        enterPressed.value = true;
      });
  } else {
    enterPressed.value = false;
  }
};
const prodInputCheck = () => {
  if (formData2.value.prodNm) {
    openHelpProdDialog();
  } else {
    $q.dialog({
      dark: true,
      title: '안내',
      message: '품목명을 입력하세요',
      ok: {
        push: true,
        color: 'negative',
      },
      // persistent: true,
    });
  }
};
const openHelpProdDialog = () => {
  if (!enterPressed.value) {
    $q.dialog({
      component: HelpProd,
      componentProps: {
        paramProdNm: formData2.value.prodNm,
        paramCloseDay: commUtil.reFormatDate(inputDay.value),
      },
    })
      .onOk(res => {
        formData2.value.prodCd = res.prodCd;
        getDataProdSelect();
        setTimeout(() => {
          dealQtyFocus.value.focus();
        }, 100);
      })
      .onCancel(() => {
        console.log('Cancel');
      })
      .onDismiss(() => {
        console.log('Called on OK or Cancel');
        enterPressed.value = true;
      });
  } else {
    enterPressed.value = false;
  }
};

const formatDealQtyInput = value => {
  //   입력값에서 콤마 제거 후 숫자만 남기기
  const numericValue = value.replace(/,/g, '');
  // 3자리마다 콤마 추가
  formData2.value.dealQty = numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  dataComputed();
};
const formatDealPriceInput = value => {
  //   입력값에서 콤마 제거 후 숫자만 남기기
  const numericValue = value.replace(/,/g, '');
  // 3자리마다 콤마 추가
  formData2.value.dealPrice = numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  dataComputed();
};
const formatDealSupAmtInput = value => {
  //   입력값에서 콤마 제거 후 숫자만 남기기
  const numericValue = value.replace(/,/g, '');
  // 3자리마다 콤마 추가
  formData2.value.dealSupAmt = numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};
const formatDealVatInput = value => {
  //   입력값에서 콤마 제거 후 숫자만 남기기
  const numericValue = value.replace(/,/g, '');
  // 3자리마다 콤마 추가
  formData2.value.dealVat = numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};
const formatDealAmtInput = value => {
  //   입력값에서 콤마 제거 후 숫자만 남기기
  const numericValue = value.replace(/,/g, '');
  // 3자리마다 콤마 추가
  formData2.value.dealAmt = numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

watch(inputDay, () => {
  getData();
});
// **************************************************************//
// ***** DataBase 연결부분    *************************************//
// **************************************************************//
// ***** 판매전표 번호 가져오기 부분  *****************************//
const getDataDealNoSelect = async () => {
  const _inputDay = commUtil.reFormatDate(inputDay.value);
  try {
    const response = await api.post('/api/sal/sal1010_dealNo_select', { paramDealDay: _inputDay }, { headers: authHeader() });
    formData1.value.dealNo = response.data.data[0].dealNo;
  } catch (error) {
    console.error('Error fetching users:', error);
  }
};
// ***** 판매전표 번호 가져오기 부분 끝 *****************************//

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
          formData.value.closeDay = commUtil.reFormatDate(formData.value.closeDay);
          formData.value.prodCost = parseFloat(formData.value.prodCost.replace(/,/g, ''));
          formData.value.prodCostx = parseFloat(formData.value.prodCostx.replace(/,/g, ''));
          formData.value.prodPrice = parseFloat(formData.value.prodPrice.replace(/,/g, ''));
          formData.value.prodPricex = parseFloat(formData.value.prodPricex.replace(/,/g, ''));

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
          selectedData[0].prodCost = parseFloat(formData.value.prodCost.replace(/,/g, ''));
          selectedData[0].prodCostx = parseFloat(formData.value.prodCostx.replace(/,/g, ''));
          selectedData[0].prodIvat = formData.value.prodIvat;
          selectedData[0].prodPrice = parseFloat(formData.value.prodPrice.replace(/,/g, ''));
          selectedData[0].prodPricex = parseFloat(formData.value.prodPricex.replace(/,/g, ''));
          selectedData[0].prodOvat = formData.value.prodOvat;
          selectedData[0].prodUpCd = formData.value.prodUpCd;
          selectedData[0].prodCond = formData.value.prodCond;
          selectedData[0].closeDay = commUtil.reFormatDate(formData.value.closeDay);
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
// ***** 판매정보(일전체 고객별) 목록 자료 가져오기 부분  *****************************//
const getData = async () => {
  try {
    const response = await api.post('/api/sal/sal1010_list', { paramDealDay: commUtil.reFormatDate(inputDay.value) }, { headers: authHeader() });
    rowData.rows = response.data.data;
    totalComputed();
  } catch (error) {
    console.error('Error fetching users:', error);
  }
};
// ***** 판매정보(일전체 고객별) 목록 자료 가져오기 부분 끝  *****************************//

// ***** 판매자료 건별 선택된 자료 가져오기 부분  *****************************//
const getDataDeal = async (resDealDay, resDealNo, resCustCd) => {
  try {
    const response = await api.post(
      '/api/sal/sal1010_deal_list',
      { paramDealDay: resDealDay, paramDealNo: resDealNo, paramCustCd: resCustCd },
      { headers: authHeader() },
    );
    rowDataDeal.rows = response.data.data;
    formData1.value.custCd = rowDataDeal.rows[0].custCd;
    formData1.value.custNm = rowDataDeal.rows[0].custNm;
    formData1.value.dealNo = rowDataDeal.rows[0].dealNo;
    formData1.value.cashCh = rowDataDeal.rows[0].cashCh;
    setTimeout(() => {
      totalComputedDeal();
    }, 100);
  } catch (error) {
    console.error('Error fetching users:', error);
  }
};
// ***** 판매자료 건별 선택된 자료 가져오기 부분 끝 *****************************//

// ***** 판매정보(고객) 목록 자료 가져오기 부분  *****************************//
const getDataSelect = async (resDealDay, resDealNo, resCustCd) => {
  try {
    const response = await api.post(
      '/api/sal/sal1010_select',
      { paramDealDay: resDealDay, paramDealNo: resDealNo, paramCustCd: resCustCd },
      { headers: authHeader() },
    );
    console.log(JSON.stringify(formData.value));
    formData1.value = response.data.data[0];
    formData.value.prodCost = response.data.data[0].prodCost.toLocaleString();
    formData.value.prodCostx = response.data.data[0].prodCostx.toLocaleString();
    formData.value.prodPrice = response.data.data[0].prodPrice.toLocaleString();
    formData.value.prodPricex = response.data.data[0].prodPricex.toLocaleString();
    formData.value.closeDay = commUtil.formatDate(response.data.data[0].closeDay);

    oldFormData.value = JSON.parse(JSON.stringify(formData.value)); // 초기자료 저장
  } catch (error) {
    console.error('Error fetching users:', error);
  }
};
// ***** 판매정보(고객) 목록 자료 가져오기 부분 끝 *****************************//

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

// ***** 고객정보 가져오기 부분  *****************************//
const getDataCustSelect = async () => {
  try {
    const response = await api.post('/api/mst/mst1010_select', { paramCustCd: formData1.value.custCd }, { headers: authHeader() });
    formData1.value.custCd = response.data.data[0].custCd;
    formData1.value.custNm = response.data.data[0].custNm;
    infoCustZone.value.custNo = response.data.data[0].custNo;
    infoCustZone.value.excDay = commUtil.formatDate(response.data.data[0].excDay);
    infoCustZone.value.limitAmt = formatNumber(response.data.data[0].limitAmt);
    infoCustZone.value.addr = response.data.data[0].postAddr1 + ' ' + response.data.data[0].postAddr2;
    infoCustZone.value.mobile = response.data.data[0].mobile;
    infoCustZone.value.tel = response.data.data[0].tel;
  } catch (error) {
    console.error('Error fetching users:', error);
  }
};
// ***** 품목정보 및 상환일자정보 가져오기 부분 끝 *****************************//
let mProd = {};
const getDataProdSelect = async () => {
  try {
    const response = await api.post('/api/mst/prod_cond_select', { paramProdCd: formData2.value.prodCd }, { headers: authHeader() });

    mProd = response.data.data[0];

    formData2.value.prodCd = mProd.prodCd;
    formData2.value.prodNm = mProd.prodNm;
    formData2.value.prodSize = mProd.prodSize;
    formData2.value.prodUnit = mProd.prodUnit;
    formData2.value.dealPrice = formatNumber(mProd.prodPrice);
    console.log('prod data: ', JSON.stringify(mProd));
    dataComputed();
  } catch (error) {
    console.error('Error fetching users:', error);
  }
};

// **************************************************************//
// ***** DataBase 연결부분 끝  *************************************//
// **************************************************************//

const dataComputed = () => {
  let _qty = 0;
  let _price = 0;
  let _supAmt = 0;
  let _vat = 0;
  let _amt = 0;

  if (mProd.prodOvat === '1') {
    _qty = parseFloat(commUtil.removeComma(formData2.value.dealQty));
    _price = parseFloat(commUtil.removeComma(formData2.value.dealPrice));
    _amt = Math.round(_qty * _price);
    _supAmt = Math.round(_amt / 1.1);
    _vat = _amt - _supAmt;
  } else {
    _qty = parseFloat(commUtil.removeComma(formData2.value.dealQty));
    _price = parseFloat(commUtil.removeComma(formData2.value.dealPrice));
    _amt = Math.round(_qty * _price);
    _supAmt = _amt;
  }
  formData2.value.dealSupAmt = formatNumber(_supAmt);
  formData2.value.dealAmt = formatNumber(_amt);
  formData2.value.dealVat = formatNumber(_vat);
};
</script>
<style scoped>
.ag-theme-quartz,
.ag-theme-quartz-dark {
  --ag-grid-size: 5px;
  --ag-list-item-height: 20px;
  --ag-font-size: 14px;
}
.ag-theme-alpine,
.ag-theme-alpine-dark {
  --ag-grid-size: 5px;
  --ag-list-item-height: 30px;
  --ag-font-size: 13px;
}
.ag-theme-balham,
.ag-theme-balham-dark {
  --ag-grid-size: 5px;
  --ag-list-item-height: 30px;
  --ag-font-size: 13px;
}
.addBtn:focus {
  background-color: #ff0000;
}
</style>

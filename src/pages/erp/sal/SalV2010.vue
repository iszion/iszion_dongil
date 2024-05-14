<template>
  <q-page class="q-pa-xs">
    <!-- contents zone -->
    <div>{{ prodCd }} / {{ prodNm }}</div>
    <div class="row q-pa-sm q-col-gutter-md">
      <!-- contents List -->

      <div class="row q-gutter-x-sm">
        <q-input
          ref="prodNmFocus"
          :dense="dense"
          outlined
          stack-label
          v-model="prodNm"
          label-color="dark"
          label="품명"
          :input-class="$q.dark.isActive ? 'text-yellow text-bold text-subtitle1' : 'text-blue text-bold text-subtitle1'"
          :bg-color="$q.dark.isActive ? 'grey' : 'white'"
          style="max-width: 200px"
          @keyup.enter="openDialog"
        >
          <template v-slot:append>
            <q-icon name="close" @click="prodNm = ''" class="q-mt-md cursor-pointer" />
            <q-icon name="search" class="q-mt-md cursor-pointer" @click="openDialog" />
          </template>
        </q-input>
        <q-input
          ref="dealQtyFocus"
          :dense="dense"
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
          outlined
          stack-label
          v-model="formData2.dealAmt"
          label="합계금액"
          label-color="dark"
          :input-class="$q.dark.isActive ? 'text-yellow text-bold text-right' : 'text-blue text-bold text-right'"
          :bg-color="$q.dark.isActive ? 'grey' : 'white'"
          @update:model-value="formatDealAmtInput"
          style="max-width: 140px"
          @keydown.enter.prevent="$refs['dealCustNmFocus'].$el.focus()"
        />
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { QIcon, useDialogPluginComponent, useQuasar } from 'quasar';
import { onMounted, ref } from 'vue';
import HelpProd from 'components/subvue/HelpProd.vue';
import commUtil from 'src/js_comm/comm-util';
import { api } from '/src/boot/axios';
import authHeader from 'boot/authHeader';

const { dialogRef, onDialogHide } = useDialogPluginComponent();
window.formatNumber = function formatNumber(number) {
  return Math.floor(number).toLocaleString();
};

const $q = useQuasar();
const dense = ref(false);
const prodNm = ref('');
const prodCd = ref('');
const formData2 = ref({
  dealQty: 0,
  dealPrice: 0,
  dealSupAmt: 0,
  dealVat: 0,
  dealAmt: 0,
});
const prodNmFocus = ref(null);
const dealQtyFocus = ref(null);
const dealPriceFocus = ref(null);
const dealSupAmtFocus = ref(null);
const dealVatFocus = ref(null);
const dealAmtFocus = ref(null);

const enterPressed = ref(false);

onMounted(() => {
  formData2.value.dealPrice = formatNumber(25000);
});
const enterAccept = event => {
  if (event.key === 'Enter') {
    openDialog();
  }
};

const dataComputed = () => {
  if (formData2.value.dealQty) {
    let _qty = parseFloat(commUtil.removeComma(formData2.value.dealQty));
    let _price = parseFloat(commUtil.removeComma(formData2.value.dealPrice));
    let _amt = Math.round(_qty * _price);
    let _supAmt = Math.round(_amt / 1.1);
    let _vat = _amt - _supAmt;

    formData2.value.dealSupAmt = formatNumber(_supAmt);
    formData2.value.dealVat = formatNumber(_vat);
    formData2.value.dealAmt = formatNumber(_amt);
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

// **************************************************************//
// ***** Dialog Help 연결부분  ************************************//
// **************************************************************//
const openDialog = () => {
  if (!enterPressed.value) {
    $q.dialog({
      component: HelpProd,
      componentProps: {
        paramProdNm: prodNm.value,
      },
    })
      .onOk(res => {
        prodCd.value = res.prodCd;
        getDataProdSelect();
        setTimeout(() => {
          enterPressed.value = false;
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
  }
  enterPressed.value = false;
};

let mProd = {};
const getDataProdSelect = async () => {
  try {
    const response = await api.post('/api/mst/prod_cond_select', { paramProdCd: prodCd.value }, { headers: authHeader() });

    mProd = response.data.data[0];

    prodNm.value = mProd.prodNm;
    formData2.value.prodSize = mProd.prodSize;
    formData2.value.prodUnit = mProd.prodUnit;
    formData2.value.dealPrice = formatNumber(mProd.prodPrice);
    console.log('prod data: ', JSON.stringify(mProd));
    dataComputed();
  } catch (error) {
    console.error('Error fetching users:', error);
  }
};
</script>

<template>
  <!-- notice dialogRef here -->
  <q-dialog ref="dialogRef" style="width: 800px; max-width: 90vw">
    <q-card class="my-card q-dialog-plugin">
      <q-toolbar :class="$q.dark.isActive ? 'bg-lime-10' : 'bg-lime-6'">
        <q-btn @click.stop="onDialogCancel"> <q-icon name="close" size="xs" class="q-mr-xs" />닫기</q-btn>
        <q-space />
        <div class="text-h6 text-bold">
          [ <span class="text-blue"> {{ params.paramSalesNm }} </span> ] <span class="q-ml-md">활동일지 리플</span>
        </div>
        <q-space />
      </q-toolbar>
      <q-card-section class="grid-container q-pa-xs-xs q-pa-sm-sm">
        <q-separator spaced />
        <div></div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import 'ag-grid-community/styles/ag-theme-balham.css';
import { QBtn, QIcon, useDialogPluginComponent, useQuasar } from 'quasar';
import { AgGridVue } from 'ag-grid-vue3';
import { onBeforeMount, reactive, ref } from 'vue';
import { api } from '/src/boot/axios';
import commUtil from 'src/js_comm/comm-util';
import SubHistory from 'components/subvue/SubHistory.vue';

const $q = useQuasar();
const dense = ref(false);

const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } = useDialogPluginComponent();

const params = defineProps({
  paramStdDay: {
    type: String,
    required: false,
    default: null,
  },
  paramSalesCd: {
    type: String,
    required: false,
    default: null,
  },
  paramSalesNm: {
    type: String,
    required: false,
    default: null,
  },
  paramSeq: {
    type: String,
    required: false,
    default: null,
  },
});

const formData = ref({
  stdDay: '',
  salesCd: '',
  projectCd: '',
  projectNm: '',
  typeCd: '',
  subject: '',
  contents: '',
  useYn: '',
  stepCd: '',
});

onBeforeMount(() => {
  console.log('params : ', JSON.stringify(params));
});

const selectedRows = ref(null);

// **************************************************************//
// ***** DataBase 연결부분    *************************************//
// **************************************************************//

// **************************************************************//
// ***** DataBase 연결부분 끝  *************************************//
// **************************************************************//
</script>

<style lang="sass" scoped>
.my-card
  width: 100%
  max-width: 700px
</style>

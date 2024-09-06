<template>
  <q-card flat bordered id="printZone">
    <q-item>
      <q-item-section avatar>
        <q-avatar square size="xl">
          <q-img
            v-if="rowData"
            :src="`https://hr.energyshop.co.kr/imagesThumbnail/${rowData.imageFileNm}?${new Date().getTime()}`"
            style="object-fit: cover; width: 100%; height: 100%"
          />
          <q-img v-else src="https://cdn.quasar.dev/img/boy-avatar.png" />
        </q-avatar>
      </q-item-section>

      <q-item-section>
        <q-item-label
          ><span v-if="rowData" class="text-h6 text-bold">{{ rowData.empNm }}</span></q-item-label
        >
        <q-item-label caption>
          <span v-if="rowData">{{ rowData.empCd }}</span>
        </q-item-label>
      </q-item-section>
      <q-space />
      <span class="flex-center flex text-h5 text-bold">인사평가 결과</span>
    </q-item>
    <q-separator />

    <q-card-section>
      <div class="text-h6">1. 인사정보</div>
      <table class="table-1">
        <tr>
          <th rowspan="1" colspan="1">소속</th>
          <th rowspan="1" colspan="1">직급</th>
          <th rowspan="1" colspan="1">직위</th>
        </tr>
        <tr>
          <td>
            <span v-if="rowData">{{ rowData.deptNm }}</span>
          </td>
          <td>
            <span v-if="rowData">{{ rowData.titlNm }}</span>
          </td>
          <td>
            <span v-if="rowData">{{ rowData.pstnNm }}</span>
          </td>
        </tr>
      </table>
    </q-card-section>
    <q-card-section>
      <div class="text-h6">2. 평가자</div>
      <table class="table-2">
        <tr>
          <th rowspan="1" colspan="1">1차평가자</th>
          <th rowspan="1" colspan="1">
            <span v-if="rowData">{{ rowData.evsEmpNm1 }}</span>
          </th>
          <th rowspan="1" colspan="1">2차평가자</th>
          <th rowspan="1" colspan="1">
            <span v-if="rowData">{{ rowData.evsEmpNm2 }}</span>
          </th>
        </tr>
      </table>
    </q-card-section>
    <q-card-section>
      <div class="text-h6">3. 종합결과</div>
      <table class="table-3">
        <tr>
          <th rowspan="1" colspan="1">근태</th>
          <th rowspan="1" colspan="1">성과평과</th>
          <th rowspan="1" colspan="1">역량평가</th>
          <th rowspan="1" colspan="1">최종점수</th>
          <th rowspan="1" colspan="1">등급</th>
        </tr>
        <tr v-if="rowData">
          <td>
            <span v-if="rowData">{{ rowData.evaAtt }}</span>
          </td>
          <td>
            <span v-if="rowData">{{ rowData.evaP1X }}</span>
          </td>
          <td>
            <span v-if="rowData">{{ rowData.evaP2Xx }}</span>
          </td>
          <td>
            <span v-if="rowData">{{ rowData.evaFinalPoint }}</span>
          </td>
          <td>
            <span v-if="rowData">{{ rowData.evaGrade }}</span>
          </td>
        </tr>
        <tr v-else>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
        </tr>
      </table>
    </q-card-section>
    <q-card-section>
      <div class="text-h6">4. 평가의견</div>
      <q-card flat bordered class="q-pa-md">
        <div style="min-height: 100px"></div>
      </q-card>
    </q-card-section>
  </q-card>
  <q-separator />
  <div class="row q-py-sm q-gutter-x-sm">
    <q-space />
    <q-btn outline dense icon="print" label=" 출력 " color="primary" @click="isPrintReport" />
    <q-btn outline dense icon="close" label=" 닫기 " color="grey" v-close-popup />
  </div>
</template>

<script setup>
import { onBeforeMount, ref } from 'vue';
import { QBtn, useQuasar } from 'quasar';
import { api } from '/src/boot/axios';
import printJS from 'print-js';

const $q = useQuasar();

const props = defineProps(['message']);
onBeforeMount(() => {
  getData();
});

// **************************************************************//
// ***** DataBase 연결부분    *************************************//
// **************************************************************//
// ***** 최종 평가점수 보고서  *****************************//
const rowData = ref(null);
const getData = async () => {
  try {
    const response = await api.post('/api/hrt/personal_final_eval_report', {
      paramSetYear: props.message.setYear,
      paramEmpCd: props.message.setEmpCd,
    });
    rowData.value = response.data.data[0];
    // console.log('data ; ', JSON.stringify(rowData.value));
  } catch (error) {
    console.error('Error fetching users:', error);
  }
};

// **************************************************************//
// ***** DataBase 연결부분 끝  *************************************//
// **************************************************************//

const isPrintReport = () => {
  printJS({
    printable: 'printZone',
    type: 'html',
    css: ['/css/print/evalFinal.css', '/css/quasar.css'],
    scanStyles: false,
  });
};
</script>

<style scoped>
@import 'src/css/print/evalFinal.css';
</style>

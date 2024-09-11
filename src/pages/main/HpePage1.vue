<template>
  <q-card bordered class="q-pa-xs">
    <q-bar class="q-py-xs text-subtitle1 text-bold">
      전년 평가 정보
      <q-space />
    </q-bar>
    <q-card-section class="">
      <div class="row">
        <div class="col-xs-9 col-sm-9 col-md-10">
          <q-table
            flat
            bordered
            square
            class="text-bold"
            title="평가정보"
            :rows="rowData"
            :columns="columns"
            row-key="stdYear"
            :rows-per-page-options="[]"
            hide-bottom
          >
            <template v-slot:header="props">
              <q-tr :props="props">
                <q-th v-for="col in props.cols" :key="col.name" :props="props" :class="$q.dark.isActive ? 'text-grey-3' : 'text-grey-10'">
                  {{ col.label }}
                </q-th>
              </q-tr>
            </template>

            <template v-slot:body="props">
              <q-tr>
                <q-td key="stdYear" :props="props">
                  <span :class="$q.dark.isActive ? 'text-white' : 'text-dark'">{{ props.row.stdYear }}</span>
                </q-td>
                <q-td key="deptNm" :props="props">
                  <span :class="$q.dark.isActive ? 'text-white' : 'text-dark'">{{ props.row.deptNm }}</span>
                </q-td>
                <q-td key="titlNm" :props="props">
                  <span :class="$q.dark.isActive ? 'text-white' : 'text-dark'">{{ props.row.titlNm }}</span>
                </q-td>
                <q-td key="evaP1X" :props="props">
                  <span :class="$q.dark.isActive ? 'text-white' : 'text-dark'"
                    >{{ props.row.evaP1X }}<span class="text-caption">({{ props.row.evaPer1 }}%)</span></span
                  >
                </q-td>
                <q-td key="evaP2Xx" :props="props">
                  <span :class="$q.dark.isActive ? 'text-white' : 'text-dark'"
                    >{{ props.row.evaP2Xx }}<span class="text-caption">({{ props.row.evaPer2 }}%)</span></span
                  >
                </q-td>
                <q-td key="finalPoint" :props="props">
                  <span class="text-primary">
                    {{ props.row.finalPoint }}
                  </span>
                </q-td>
                <q-td key="evaGrade" :props="props">
                  <span class="text-orange">
                    {{ props.row.evaGrade }}
                  </span>
                </q-td>
              </q-tr>
            </template>
          </q-table>
        </div>
        <div class="col-xs-3 col-sm-3 col-md-2">
          <q-card flat square bordered style="height: 197px">
            <q-card-section>
              <div class="text-subtitle1 text-bold text-center">년차</div>
            </q-card-section>

            <q-separator />

            <q-card-section class="flex flex-center items-center" style="height: 130px">
              <q-avatar size="60px" color="orange">
                <span class="text-h6"> {{ rowData[0].yearDiff }}</span>
              </q-avatar>
            </q-card-section>
          </q-card>
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { onMounted, reactive, ref, watch } from 'vue';
import ApexTree from 'apextree';
import { api } from 'boot/axios';
import { useYearInfoStore } from 'src/store/setYearInfo';
import { useUserInfoStore } from 'src/store/setUserInfo';
const storeYear = useYearInfoStore();
const storeUser = useUserInfoStore();

const columns = [
  { name: 'stdYear', align: 'center', label: '평가년도', field: 'stdYear', sortable: false },
  { name: 'deptNm', align: 'center', label: '소속', field: 'deptNm', sortable: false },
  { name: 'titlNm', align: 'center', label: '직급', field: 'titlNm', sortable: false },
  { name: 'evaP1X', align: 'center', label: '성과평가', field: 'evaP1X', sortable: false },
  { name: 'evaP2Xx', align: 'center', label: '역량평가', field: 'evaP2Xx', sortable: false },
  { name: 'finalPoint', align: 'center', label: '종합점수', field: 'finalPoint', sortable: false },
  { name: 'evaGrade', align: 'center', label: '평가등급', field: 'evaGrade', sortable: false },
];

const rowData = ref([
  {
    stdYear: '',
    deptNm: '',
    titlNm: '',
    evaP1X: '',
    evaP2Xx: '',
    finalPoint: '',
    evaGrade: '',
    yearDiff: '',
  },
]);

onMounted(() => {
  getData();
});

// **************************************************************//
// ***** DataBase 연결부분    *************************************//
// **************************************************************//

const getData = async () => {
  try {
    const response = await api.post('/api/aux/dashboard_eva_info_list', {
      paramSetYear: storeYear.setYear - 1,
      paramEmpCd: storeUser.setEmpCd,
      paramBasicDay: storeYear.setYear + '0430',
    });

    // console.log('data page1 ; ', JSON.stringify(response.data.data));
    rowData.value = response.data.data;
  } catch (error) {
    console.error('Error fetching users:', error);
  }
};
</script>

<style scoped>
.q-table .q-th {
  font-family: 'Arial', sans-serif; /* 컬럼 헤더 폰트 */
  font-size: 16px; /* 컬럼 헤더 폰트 크기 */
  font-weight: bold; /* 컬럼 헤더 굵기 */
  color: #444; /* 컬럼 헤더 색상 */
}

/* 테이블 셀 스타일 */
.q-table .q-td {
  font-family: 'Arial', sans-serif; /* 셀 폰트 */
  font-size: 15px; /* 셀 폰트 크기 */
  color: #555; /* 셀 텍스트 색상 */
  padding-top: 40px;
  padding-bottom: 30px;
  padding-left: 0px;
  padding-right: 0px;
}
</style>

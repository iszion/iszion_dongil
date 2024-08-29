<template>
  <q-card bordered class="q-pa-xs">
    <q-bar class="q-py-xs text-subtitle1 text-bold">
      진급대상 정보
      <q-space />
    </q-bar>
    <q-card-section class="">
      <div class="row q-col-gutter-x-lg">
        <div class="col-6">
          <q-table
            flat
            bordered
            class="text-bold my-sticky-header-table"
            title=""
            :rows="rowData1"
            :columns="columns1"
            row-key="titlNmNnextTitlNm"
            :rows-per-page-options="[]"
            @row-click="onRowClick1()"
          >
            <template v-slot:header="props">
              <q-tr :props="props">
                <q-th v-for="col in props.cols" :key="col.name" :props="props" class="text-purple">
                  <span class="text-bold text-subtitle1 text-deep-orange"> {{ col.label }}</span>
                </q-th>
              </q-tr>
            </template>

            <template v-slot:body="props">
              <q-tr>
                <q-td key="titlNmNnextTitlNm" :props="props">
                  {{ props.row.titlNmNnextTitlNm }}
                </q-td>
                <q-td key="hrCnt" :props="props">
                  <span class="text-bold text-subtitle1 text-primary"> {{ props.row.hrCnt }}</span>
                </q-td>
              </q-tr>
            </template>
          </q-table>
        </div>
        <div class="col-6">
          <q-table
            flat
            bordered
            class="text-bold my-sticky-header-table"
            title=""
            :rows="rowData2"
            :columns="columns2"
            row-key="titlNmNnextTitlNm"
            :rows-per-page-options="[]"
            @row-click="onRowClick2"
          >
            <template v-slot:header="props">
              <q-tr :props="props">
                <q-th v-for="col in props.cols" :key="col.name" :props="props">
                  <span class="text-bold text-subtitle1 text-orange"> {{ col.label }}</span>
                </q-th>
              </q-tr>
            </template>

            <template v-slot:body="props">
              <q-tr>
                <q-td key="titlNmNnextTitlNm" :props="props">
                  {{ props.row.titlNmNnextTitlNm }}
                </q-td>
                <q-td key="hrCnt" :props="props">
                  <span class="text-bold text-subtitle1 text-primary"> {{ props.row.hrCnt }}</span>
                </q-td>
              </q-tr>
            </template>
          </q-table>
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

const columns1 = [
  { name: 'titlNmNnextTitlNm', align: 'center', label: '일반직', field: 'titlNmNnextTitlNm', sortable: false },
  { name: 'hrCnt', align: 'center', label: '인원', field: 'hrCnt', sortable: false },
];

const columns2 = [
  { name: 'titlNmNnextTitlNm', align: 'center', label: '전문직', field: 'titlNmNnextTitlNm', sortable: false },
  { name: 'hrCnt', align: 'center', label: '인원', field: 'hrCnt', sortable: false },
];

const rowData1 = ref([
  {
    titlNmNnextTitlNm: '',
    hrCnt: '',
  },
]);
const rowData2 = ref([
  {
    titlNmNnextTitlNm: '',
    hrCnt: '',
  },
]);

onMounted(() => {
  getData().then(resData => {
    rowData1.value = [];
    rowData2.value = [];
    for (let i = 0; i < resData.length; i++) {
      if (resData[i].titlCd.substring(0, 1) === '1') {
        let tmpJSON = { titlNmNnextTitlNm: resData[i].titlNmNnextTitlNm, hrCnt: resData[i].hrCnt };
        rowData1.value.push(tmpJSON);
      } else {
        let tmpJSON = { titlNmNnextTitlNm: resData[i].titlNmNnextTitlNm, hrCnt: resData[i].hrCnt };
        rowData2.value.push(tmpJSON);
      }
    }
    console.log('json 1 : ', JSON.stringify(rowData1.value));
    console.log('json 2 : ', JSON.stringify(rowData2.value));
  });
});

const onRowClick1 = (evt, row, index) => {
  alert(row);
};
const onRowClick2 = (evt, row, index) => {
  alert(row);
};
// **************************************************************//
// ***** DataBase 연결부분    *************************************//
// **************************************************************//

const getData = async () => {
  try {
    const response = await api.post('/api/aux/dashboard_page42_list', {
      paramSetYear: storeYear.setYear,
      paramBasicDay: storeYear.setYear + '0430',
    });

    console.log('data ; ', JSON.stringify(response.data.data));
    return response.data.data;
  } catch (error) {
    console.error('Error fetching users:', error);
  }
};
</script>

<style scoped>
.q-table .q-th {
  font-family: 'Arial', sans-serif; /* 컬럼 헤더 폰트 */
  font-size: 10px; /* 컬럼 헤더 폰트 크기 */
  font-weight: bold; /* 컬럼 헤더 굵기 */
  color: #444; /* 컬럼 헤더 색상 */
}

/* 테이블 셀 스타일 */
.q-table .q-td {
  font-family: 'Arial', sans-serif; /* 셀 폰트 */
  font-size: 13px; /* 셀 폰트 크기 */
  //color: #002bf8; /* 셀 텍스트 색상 */
  padding-top: 0px;
  padding-bottom: 0px;
  padding-left: 4px;
  padding-right: 0px;
}
</style>

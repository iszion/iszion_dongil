<template>
  <q-card bordered class="q-pa-xs">
    <q-bar class="q-py-xs text-subtitle1 text-bold">
      진급대상 정보
      <q-space />
    </q-bar>
    <q-card-section class="q-pa-xs">
      <div class="row q-col-gutter-x-xs">
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
            hide-bottom
          >
            <template v-slot:header="props">
              <q-tr :props="props">
                <q-th v-for="col in props.cols" :key="col.name" :props="props" class="text-purple">
                  <span class="text-bold text-subtitle1 text-deep-orange"> {{ col.label }}</span>
                </q-th>
              </q-tr>
            </template>

            <template v-slot:body="props">
              <q-tr :props="props" @click="onRowClick1(props.row)" class="cursor-pointer">
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
            hide-bottom
          >
            <template v-slot:header="props">
              <q-tr :props="props">
                <q-th v-for="col in props.cols" :key="col.name" :props="props" class="text-purple">
                  <span class="text-bold text-subtitle1 text-deep-orange"> {{ col.label }}</span>
                </q-th>
              </q-tr>
            </template>

            <template v-slot:body="props">
              <q-tr :props="props" @click="onRowClick2(props.row)" class="cursor-pointer">
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

  <!--  게시글 조회 부분 -->

  <q-dialog v-model="isDialogView1">
    <q-card style="width: 700px; max-width: 80vw">
      <q-card-section>
        <div class="text-h6">진급대상자목록</div>
      </q-card-section>

      <q-separator />

      <div class="row text-subtitle1 text-bold text-green q-mx-sm q-pt-sm">
        <div class="col-1 flex flex-center">
          <q-item-label>No</q-item-label>
        </div>

        <div class="col-1 flex flex-center"></div>

        <div class="col-2 flex flex-center">
          <q-item-label>성명</q-item-label>
        </div>

        <div class="col-3 flex flex-center">
          <q-item-label>소속</q-item-label>
        </div>

        <div class="col-2 flex flex-center">
          <q-item-label>직급</q-item-label>
        </div>

        <div class="col-2 flex flex-center">
          <q-item-label>최종승급일</q-item-label>
        </div>

        <div class="col-1 flex flex-center">
          <q-item-label>년차</q-item-label>
        </div>

        <!--              <div class="col-2 flex flex-center">-->
        <!--                <q-item-label>{{ data.catgNm }}</q-item-label>-->
        <!--              </div>-->
      </div>
      <q-card-section style="max-height: 50vh" class="scroll q-pt-xs">
        <q-list bordered class="rounded-borders">
          <div v-for="(data, index) in rowDataEmpList" :key="index" class="">
            <div class="row">
              <div class="col-1 flex flex-center">
                <q-item-label>{{ index + 1 }}</q-item-label>
              </div>

              <div class="col-1 flex flex-center">
                <q-avatar size="55px">
                  <q-img
                    class="cursor-pointer"
                    v-if="data.imageFileNm"
                    :src="`https://hr.energyshop.co.kr/imagesThumbnail/${data.imageFileNm}`"
                    style="object-fit: cover; width: 100%; height: 100%"
                  />
                  <q-icon v-else name="face" color="teal" size="md" />
                </q-avatar>
              </div>

              <div class="col-2 flex flex-center">
                <q-item-label>{{ data.empNm }}</q-item-label>
              </div>

              <div class="col-3 flex flex-center">
                <q-item-label>{{ data.depgNm }} / {{ data.deptNm }}</q-item-label>
              </div>

              <div class="col-2 flex flex-center">
                <q-item-label>{{ data.titlNm }}</q-item-label>
              </div>

              <div class="col-2 flex flex-center">
                <q-item-label>{{ data.appoDay }}</q-item-label>
              </div>

              <div class="col-1 flex flex-center">
                <q-item-label>{{ data.yearDiff }}</q-item-label>
              </div>

              <!--              <div class="col-2 flex flex-center">-->
              <!--                <q-item-label>{{ data.catgNm }}</q-item-label>-->
              <!--              </div>-->
            </div>
            <q-separator v-if="rowDataEmpList.length - 1 !== index" spaced />
          </div>
        </q-list>
      </q-card-section>

      <q-separator />

      <q-card-actions align="right">
        <q-btn flat label="닫기" color="primary" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>

  <!--  게시글 조회부분 끝-->
</template>

<script setup>
import { onMounted, reactive, ref, watch } from 'vue';
import ApexTree from 'apextree';
import { api } from 'boot/axios';
import { useYearInfoStore } from 'src/store/setYearInfo';
import { useUserInfoStore } from 'src/store/setUserInfo';
import { QBtn, QIcon } from 'quasar';
const storeYear = useYearInfoStore();
const storeUser = useUserInfoStore();

const rowDataEmpList = ref(null);

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
        let tmpJSON = { titlNmNnextTitlNm: resData[i].titlNmNnextTitlNm, hrCnt: resData[i].hrCnt, empCdList: resData[i].empCdList };
        rowData1.value.push(tmpJSON);
      } else {
        let tmpJSON = { titlNmNnextTitlNm: resData[i].titlNmNnextTitlNm, hrCnt: resData[i].hrCnt, empCdList: resData[i].empCdList };
        rowData2.value.push(tmpJSON);
      }
    }
    // console.log('json 1 : ', JSON.stringify(rowData1.value));
    // console.log('json 2 : ', JSON.stringify(rowData2.value));
  });
});

const isDialogView1 = ref(false);
const onRowClick1 = data => {
  let result = `^(${data.empCdList.replace(/,/g, '|').replace(/\s+/g, '')})$`; // ,를 |로 대치하고 공백을 제거 하고 ()감싸기
  getDataPage42EmpList(result).then(() => {
    isDialogView1.value = true;
  });
};
const onRowClick2 = data => {
  let result = `^(${data.empCdList.replace(/,/g, '|').replace(/\s+/g, '')})$`; // ,를 |로 대치하고 공백을 제거 하고 ()감싸기
  getDataPage42EmpList(result).then(() => {
    isDialogView1.value = true;
  });
};

// **************************************************************//
// ***** DataBase 연결부분    *************************************//
// **************************************************************//

const getData = async () => {
  try {
    const response = await api.post('/api/aux/dashboard_page42_list', {
      paramSetYear: storeYear.setYear,
      paramBasicDay: storeYear.setYear + '0331',
    });

    // console.log('data ; ', JSON.stringify(response.data.data));
    return response.data.data;
  } catch (error) {
    console.error('Error fetching users:', error);
  }
};

const getDataPage42EmpList = async resEmpCdList => {
  try {
    const response = await api.post('/api/aux/dashboard_page42_emp_list', {
      paramSetYear: storeYear.setYear,
      paramEmpList: resEmpCdList,
    });

    console.log('data1 ; ', JSON.stringify(response.data.data));
    rowDataEmpList.value = response.data.data;
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

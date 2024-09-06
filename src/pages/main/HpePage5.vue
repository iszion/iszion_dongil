<template>
  <q-card bordered class="q-pa-xs">
    <q-bar class="q-py-xs text-subtitle1 text-bold">
      성과평가 사유내역 리스트
      <q-space />
      <q-avatar size="sm" color="primary" text-color="white"><q-icon name="refresh" size="1rem" class="cursor-pointer" @click="getData" /></q-avatar>
    </q-bar>
    <q-card-section class="q-pa-none">
      <div class="row q-col-gutter-sm-x-xs">
        <div class="col-xs-12">
          <q-scroll-area style="height: 320px; max-width: 100%">
            <q-list bordered separator>
              <q-item v-for="(data, index) in rowData" :key="index">
                <q-item-section avatar>
                  <q-avatar color="primary" text-color="white" size="md">
                    {{ data.workSeq }}
                  </q-avatar>
                </q-item-section>

                <q-item-section>
                  <q-item-label class="text-bold" lines="1">
                    <span class="text-grey"> 자기평가</span>: {{ data.selfCh }} <span class="text-blue q-ml-md">평가</span>:
                    {{ data.markCh }}</q-item-label
                  >
                  <q-item-label caption lines="2" v-html="data.sExplains" />
                </q-item-section>

                <q-item-section side top>
                  <q-item-label caption>{{ dayFormat(data.updateDate) }}</q-item-label>

                  <q-item-label caption><q-icon name="star" color="orange" /> {{ data.evtEmpNm }} / {{ data.evsEmpNm }}</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-scroll-area>
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { onBeforeMount, onMounted, reactive, ref, watch } from 'vue';
import ApexTree from 'apextree';
import { api } from 'boot/axios';
import { useYearInfoStore } from 'src/store/setYearInfo';
import { QBtn, QIcon } from 'quasar';
import moment from 'moment/moment';
const storeYear = useYearInfoStore();

const rowData = ref();

onBeforeMount(() => {
  getData();
});

// **************************************************************//
// ***** DataBase 연결부분    *************************************//
// **************************************************************//

const getData = async () => {
  try {
    const response = await api.post('/api/aux/dashboard_page5_list', {
      paramSetYear: storeYear.setYear,
    });

    rowData.value = response.data.data;
    // console.log('data ; ', JSON.stringify(rowData.value));
  } catch (error) {
    console.error('Error fetching users:', error);
  }
};

const dayFormat = resDay => {
  const parsedDate = moment(resDay, 'YYYY-MM-DD HH:mm:ss');

  // Calculate the difference between the current date and the registration date
  const timeDifference = moment().diff(parsedDate, 'minutes');
  // console.log('time: ', parsedDate, timeDifference);
  // Format the date based on the time difference
  let formattedDate;
  if (timeDifference < 1) {
    formattedDate = '방금';
  } else if (timeDifference < 60) {
    formattedDate = `${timeDifference} 분 전`;
  } else if (timeDifference < 24 * 60) {
    formattedDate = `${Math.floor(timeDifference / 60)}시간 전`;
  } else if (timeDifference < 48 * 60) {
    formattedDate = '어제';
  } else if (timeDifference < 62 * 60) {
    formattedDate = '그제';
  } else {
    formattedDate = parsedDate.format('MMM DD, YYYY');
  }

  // console.log('reg_day: ', formattedDate);
  return formattedDate;
};
</script>

<style scoped>
.full-width-chart {
  width: 100%;
}
</style>

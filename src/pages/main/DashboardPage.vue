<template>
  <q-page padding class="q-col-gutter-y-sm">
    <div class="row q-col-gutter-md">
      <div v-if="storeUser.setEvtgCd > '01'" class="col-xs-12 col-sm-12">
        <hpe-page2 />
      </div>
      <div v-if="storeUser.setEvtgCd === '01'" class="col-xs-12 col-sm-6">
        <hpe-page2 />
      </div>
      <div v-if="storeUser.setEvtgCd < '02'" class="col-xs-12 col-sm-6">
        <hpe-page3 />
      </div>
      <div v-if="storeUser.setEvtgCd === ''" class="col-xs-12 col-sm-6">
        <hpe-page1 />
      </div>
    </div>

    <div class="row q-col-gutter-md">
      <div class="col-12 col-md-6">
        <event-view />
      </div>
      <div class="col-12 col-md-6">
        <board-list :message="boardParams.dataComp" />
      </div>
    </div>
    {{}}
  </q-page>
</template>

<script setup>
import { reactive, ref } from 'vue';
import HpePage1 from 'pages/main/HpePage1.vue';
import HpePage2 from 'pages/main/HpePage2.vue';
import HpePage3 from 'pages/main/HpePage3.vue';
import BoardList from 'pages/main/BoardList.vue';
import EventView from 'pages/main/EventView.vue';
import { useUserInfoStore } from 'src/store/setUserInfo';
import { useYearInfoStore } from 'src/store/setYearInfo';
const storeUser = useUserInfoStore();
const storeYear = useYearInfoStore();

const boardParams = reactive({
  dataComp: { deptCd: '0000000', deptNm: '전체' },
  dataTeam: { deptCd: '7011002', deptNm: '관리부' },
});
const text = ref('');
</script>

<style lang="sass" scoped></style>

<template>
  <q-page padding class="q-col-gutter-y-sm">
    <div class="row q-col-gutter-md">
      <div v-if="storeUser.setEvtgCd > '01'" class="col-xs-12 col-sm-6">
        <hpe-page2 />
      </div>
      <div v-if="storeUser.setEvtgCd > '01'" class="col-xs-12 col-sm-6">
        <hpe-page1 />
      </div>

      <div v-if="storeUser.setEvtgCd === '01'" class="col-xs-12 col-sm-4">
        <hpe-page2 />
      </div>
      <div v-if="storeUser.setEvtgCd === '01'" class="col-xs-12 col-sm-3">
        <hpe-page3 />
      </div>
      <div v-if="storeUser.setEvtgCd === '01'" class="col-xs-12 col-sm-5">
        <hpe-page1 />
      </div>

      <div v-if="storeUser.setTitlCd === '101' || storeUser.setLevelCd === '2'" class="col-xs-12 col-sm-6">
        <hpe-page41 />
      </div>
      <div v-if="storeUser.setTitlCd === '101'" class="col-xs-12 col-sm-3">
        <hpe-page3 />
      </div>

      <div v-if="storeUser.setTitlCd === '101' || storeUser.setLevelCd === '2'" class="col-xs-12 col-sm-3">
        <hpe-page42 />
      </div>
      <div v-if="storeUser.setLevelCd === '2'" class="col-xs-12 col-sm-3">
        <hpe-page5 />
      </div>
      <div v-if="storeUser.setTitlCd === '101' || storeUser.setLevelCd === '2'" class="col-xs-12 col-sm-12">
        <dept-tree />
      </div>

      <div v-if="storeUser.setTitlCd === '101' || storeUser.setLevelCd === '2'" class="col-xs-12 col-sm-12">
        <hpe-page43 />
      </div>
    </div>

    <div v-if="storeUser.setTitlCd !== '101'" class="row q-col-gutter-md">
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
import BoardList from 'pages/main/BoardList.vue';
import EventView from 'pages/main/EventView.vue';
import DeptTree from 'pages/main/DeptTree.vue';
import HpePage1 from 'pages/main/HpePage1.vue';
import HpePage2 from 'pages/main/HpePage2.vue';
import HpePage3 from 'pages/main/HpePage3.vue';
import HpePage41 from 'pages/main/HpePage41.vue';
import HpePage42 from 'pages/main/HpePage42.vue';
import HpePage43 from 'pages/main/HpePage43.vue';
import HpePage5 from 'pages/main/HpePage5.vue';
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

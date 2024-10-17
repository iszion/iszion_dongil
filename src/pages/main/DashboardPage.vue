<template>
  <q-page padding class="q-pa-xs-none q-pa-sm-xs q-col-gutter-md">
    <div class="row">
      <div class="col-12">
        <!-- 나의일정 -->
        <aux-page />
      </div>
    </div>
    <div class="row q-col-gutter-md">
      <div class="col-12 col-md-6">
        <!-- 나의일정 -->
        <event-view />
      </div>
      <div class="col-12 col-md-6">
        <!-- 게시글 -->
        <board-list :message="boardParams.dataComp" />
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { reactive } from 'vue';
import AuxPage from 'pages/main/AuxPage.vue';
import BoardList from 'pages/main/BoardList.vue';
import EventView from 'pages/main/EventView.vue';

import { useUserInfoStore } from 'src/store/setUserInfo';
const storeUser = useUserInfoStore();

const boardParams = reactive({
  dataComp: { deptCd: '0000000', deptNm: '전체' },
  dataTeam: { deptCd: '7011002', deptNm: '관리부' },
});
</script>

<style lang="sass" scoped></style>

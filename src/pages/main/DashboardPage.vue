<template>
  <q-page padding class="q-col-gutter-y-sm">
    <div class="row q-col-gutter-md">
      <div class="col-12 col-md-6 col-lg-4">
        <hpe-main />
      </div>
      <div class="col-12 col-md-6 col-lg-4">
        <event-view />
      </div>
      <div class="col-12 col-md-6 col-lg-4">
        <board-list :message="boardParams.dataComp" />
      </div>
    </div>

    <div class="row q-col-gutter-md">
      <div class="col-12 col-md-6 col-lg-4"></div>
      <div class="col-12 col-md-6 col-lg-4"></div>
      <div class="col-12 col-md-6 col-lg-4"></div>
    </div>
    {{}}
  </q-page>
</template>

<script setup>
import { reactive, ref } from 'vue';
import HpeMain from 'pages/main/HpeMain.vue';
import BoardList from 'pages/main/BoardList.vue';
import EventView from 'pages/main/EventView.vue';

const boardParams = reactive({
  dataComp: { deptCd: '0000000', deptNm: '전체' },
  dataTeam: { deptCd: '7011002', deptNm: '관리부' },
});
const text = ref('');
</script>

<style lang="sass" scoped></style>

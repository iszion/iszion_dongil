<template>
  <q-page class="q-pa-xs-xs q-pa-sm-md" :style-fn="myTweak">
    <q-card class="q-pa-none">
      <q-bar class="q-px-sm">
        <q-icon name="list_alt" />
        <span class="q-px-sm text-bold text-subtitle1" :class="$q.dark.isActive ? 'text-orange' : 'text-primary'">{{ menuLabel }}</span>
        <q-space />
      </q-bar>

      <div class="">
        <q-card class="q-pa-sm">
          <q-card v-for="data in rowData.rows" :key="data.seq" class="">
            <q-card-section class="row q-pa-xs">
              <q-card bordered class="col-xs-12 col-sm-1">
                <q-card-section class="q-pa-none text-center text-subtitle2 text-bold q-px-xs" :class="$q.dark.isActive ? 'bg-grey-8' : 'bg-orange-3'"
                  >순번</q-card-section
                >
                <q-card-section
                  class="text-center text-bold text-subtitle1 q-pa-xs"
                  :class="$q.screen.xs ? '' : 'row flex-center'"
                  style="height: 100%"
                >
                  {{ data.seq }}
                </q-card-section>
              </q-card>
              <q-card bordered class="col-xs-12 col-sm-3">
                <q-card-section
                  class="q-pa-none text-center text-subtitle2 text-bold q-px-xs"
                  :class="$q.dark.isActive ? 'bg-grey-8' : 'bg-orange-3'"
                >
                  목표설정
                </q-card-section>
                <!--                <q-card-section :class="$q.dark.isActive ? 'q-pa-xs bg-grey-9' : 'q-pa-xs bg-grey-5'">-->
                <!--                  <span :class="$q.dark.isActive ? 'text-orange' : 'text-deep-orange'"> 평가지표 : </span>-->
                <!--                  <span class="text-bold"> {{ data.eidcNm }}</span>-->
                <!--                </q-card-section>-->
                <q-card-section class="q-pa-xs" v-html="data.targetDoc.replace(/\n/g, '<br>')"></q-card-section>
              </q-card>
              <q-card bordered class="col-xs-12 col-sm-3">
                <q-card-section class="q-pa-none text-center text-subtitle2 text-bold q-px-xs" :class="$q.dark.isActive ? 'bg-grey-8' : 'bg-orange-3'"
                  >기준설정</q-card-section
                >
                <q-card-section class="q-pa-xs">
                  <span v-if="data.evaS" class="q-px-sm"> <span class="text-blue"> S(100점) :</span> {{ data.evaS }}<br /> </span>
                  <span v-if="data.evaA" class="q-px-sm"> <span class="text-blue"> A(90점) :</span> {{ data.evaA }}<br /> </span>
                  <span v-if="data.evaB" class="q-px-sm"> <span class="text-blue"> B(80점) :</span> {{ data.evaB }}<br /> </span>
                  <span v-if="data.evaC" class="q-px-sm"> <span class="text-blue"> C(70점) :</span> {{ data.evaC }}<br /> </span>
                  <span v-if="data.evaD" class="q-px-sm"> <span class="text-blue"> D(60점) :</span> {{ data.evaD }} </span>
                </q-card-section>
              </q-card>
              <q-card bordered class="col-xs-12 col-sm-3">
                <q-card-section class="q-pa-none text-center text-subtitle2 text-bold q-px-xs" :class="$q.dark.isActive ? 'bg-grey-8' : 'bg-orange-3'"
                  >성과/업적</q-card-section
                >
                <q-card-section class="q-pa-xs" v-html="data.workDoc.replace(/\n/g, '<br>')"></q-card-section>
              </q-card>
              <q-card bordered class="col-xs-12 col-sm-1">
                <q-card-section class="q-pa-none text-center text-subtitle2 text-bold q-px-xs" :class="$q.dark.isActive ? 'bg-grey-8' : 'bg-orange-3'"
                  >가중치</q-card-section
                >
                <q-card-section
                  class="text-center text-bold text-subtitle1 q-pa-xs"
                  :class="$q.screen.xs ? '' : 'row flex-center'"
                  style="height: 100%"
                >
                  {{ data.weight }}
                </q-card-section>
              </q-card>
              <q-card bordered class="col-xs-12 col-sm-1">
                <q-card-section class="q-pa-none text-center text-subtitle2 text-bold q-px-xs" :class="$q.dark.isActive ? 'bg-grey-8' : 'bg-orange-3'"
                  >자기평가</q-card-section
                >
                <q-card-section
                  class="text-center text-bold text-subtitle1 q-pa-xs"
                  :class="$q.screen.xs ? '' : 'row flex-center'"
                  style="height: 100%"
                >
                  {{ data.selfPoint }}
                </q-card-section>
              </q-card>
            </q-card-section>
          </q-card>
        </q-card>
      </div>
    </q-card>
  </q-page>
</template>
ㅌ
<script setup>
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import 'ag-grid-community/styles/ag-theme-balham.css';
import { AgGridVue } from 'ag-grid-vue3';
import { computed, onBeforeMount, onBeforeUnmount, onMounted, reactive, ref } from 'vue';
import { api } from 'boot/axios';
import { QBtn, QIcon, QToggle, SessionStorage, useQuasar } from 'quasar';
import { useYearInfoStore } from 'src/store/setYearInfo';
import { useUserInfoStore } from 'src/store/setUserInfo';

const storeYear = useYearInfoStore();
const storeUser = useUserInfoStore();

const rowData = reactive({ rows: [] });

// grid Height 자동처리부분1
const gridHeight = ref(145); // 초기 높이
const rowHeight = 45; // 행당 높이 (예: 25px)
const minHeight = ref(90); // 최소 높이 (예: 300px) rowHeight의 3배

const $q = useQuasar();

function handleClose() {
  console.log('handleClose called');
  isDialogVisible.value = false;
}
const contentZoneHeight = ref(300);
const contentZoneStyle = computed(() => ({
  height: `${contentZoneHeight.value}px`,
}));

onBeforeUnmount(() => {
  // console.log('onBeforeUnmount....');
  // Remove the resize event listener when the component is destroyed
  window.removeEventListener('resize', handleResize);
});
onBeforeMount(() => {
  getData();
});

const menuLabel = ref('');
onMounted(() => {
  window.addEventListener('resize', handleResize);
  menuLabel.value = window.history.state.label;
  handleResize();
});

// ======================================================
const screenSizeHeight = ref(0);
const myTweak = offset => {
  screenSizeHeight.value = offset;

  return { minHeight: offset ? `calc(100vh - ${offset}px)` : '100vh' };
};
const handleResize = () => {
  contentZoneHeight.value = window.innerHeight - screenSizeHeight.value;
  // contentZoneHeight.value = window.innerHeight - state.height - 680;
};
// ======================================================

// **************************************************************//
// ***** DataBase 연결부분    *************************************//
// **************************************************************//

const getData = async () => {
  try {
    const response = await api.post('/api/hce/hpe5010_list', {
      paramSetYear: storeYear.setYear,
      paramEmpCd: storeUser.setEmpCd,
    });

    rowData.rows = response.data.data;
    console.log('rowData : ', JSON.stringify(rowData));

    if (rowData.rows.length === 0) {
      gridHeight.value = 145;
    } else {
      gridHeight.value = minHeight.value + rowData.rows.length * rowHeight;
      const maxHeight = contentZoneHeight.value - 180;
      if (gridHeight.value > maxHeight) {
        gridHeight.value = maxHeight;
      }
    }
  } catch (error) {
    console.error('Error fetching users:', error);
  }
};

// **************************************************************//
// ***** DataBase 연결부분 끝  *************************************//
// **************************************************************//
</script>
<style></style>

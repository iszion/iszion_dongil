<template>
  <q-page class="q-ma-sm">
    <div class="ag-theme-alpine" style="height: 600px; width: 100%">
      <ag-grid-vue
        class="ag-theme-alpine"
        :columnDefs="columnDefs"
        :rowModelType="'infinite'"
        :cacheBlockSize="40"
        :infiniteInitialRowCount="1"
        :datasource="dataSource"
        @firstDataRendered="onFirstDataRendered"
        :gridOptions="gridOptions"
      ></ag-grid-vue>
    </div>
  </q-page>
</template>

<script setup>
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import 'ag-grid-community/styles/ag-theme-balham.css';
import { AgGridVue } from 'ag-grid-vue3';
import { ref } from 'vue';

const columnDefs = ref([
  { headerName: 'ID', field: 'id' },
  { headerName: 'Name', field: 'name' },
  { headerName: 'Age', field: 'age' },
]);

const gridOptions = ref({
  defaultColDef: {
    flex: 1,
    minWidth: 100,
    sortable: true,
    resizable: true,
  },
  cacheOverflowSize: 2,
  maxConcurrentDatasourceRequests: 2,
  infiniteInitialRowCount: 1,
  maxBlocksInCache: 2,
});

const dataSource = {
  getRows(params) {
    console.log('Requesting rows from: ' + params.startRow + ' to ' + params.endRow);
    // setTimeout(() => {
    const rows = [];
    for (let i = params.startRow; i < params.endRow; i++) {
      rows.push({ id: i, name: 'Name ' + i, age: 20 + (i % 20) });
    }
    const lastRow = params.endRow >= 1000 ? 1000 : -1; // assuming 1000 rows max
    console.log('lastRow : ', lastRow);
    params.successCallback(rows, lastRow);
    // }, 500);
  },
};

const onFirstDataRendered = params => {
  params.api.sizeColumnsToFit();
};
</script>

<style scoped>
.ag-theme-alpine {
  height: 1000px;
  width: 100%;
}
</style>

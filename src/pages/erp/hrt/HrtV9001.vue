<template>
  <q-page class="q-ma-sm">
    <input type="file" @change="handleFileUpload($event)" accept=".xlsx, .xls" />
    <div style="height: 600px; width: 100%">
      <ag-grid-vue
        style="width: 100%; height: 100%"
        :class="$q.dark.isActive ? 'ag-theme-alpine-dark' : 'ag-theme-alpine'"
        :gridOptions="gridOptions"
        :columnDefs="columnDefs"
        :rowData="rowData"
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
import * as XLSX from 'xlsx';

const rowData = ref([]);
const columnDefs = ref([]);
const handleFileUpload = event => {
  console.log('event : ', event.target.files[0]);
  const file = event.target.files[0];
  const reader = new FileReader();

  reader.onload = e => {
    const data = new Uint8Array(e.target.result);
    const workbook = XLSX.read(data, { type: 'array' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

    // Assume the first row of jsonData contains headers (if available)
    if (jsonData.length > 0) {
      // Create columnDefs based on the number of columns
      columnDefs.value = jsonData[0].map((header, index) => ({
        headerName: `Field ${index + 1}`,
        field: `col${index}`, // Assuming fields like col0, col1, col2, ...
      }));

      // Assign rowData, skipping the first row (if it's headers)
      rowData.value = jsonData.slice(2).map((row, rowIndex) => {
        const rowDataObj = {};
        row.forEach((value, colIndex) => {
          rowDataObj[`col${colIndex}`] = value;
        });
        return rowDataObj;
      });
    }
  };

  reader.readAsArrayBuffer(file);
};

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
</script>

<style scoped>
.ag-theme-alpine {
  height: 1000px;
  width: 100%;
}
</style>

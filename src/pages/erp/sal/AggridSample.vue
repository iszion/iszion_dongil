<template>
  <ag-grid-vue
    style="width: 100%; height: 100%"
    :class="$q.dark.isActive ? 'ag-theme-alpine-dark' : 'ag-theme-alpine'"
    :columnDefs="columnDefsDeal.columns"
    :rowData="rowDataDeal.rows"
    :pagination="false"
    @selection-changed="onSelectionChangedDeal"
    @cell-value-changed="onCellValueChangedDeal"
    @grid-ready="onGridReadyDeal"
    :suppressRowClickSelection="isSelected"
    :grid-options="gridOptionsDeal"
  >
  </ag-grid-vue>
</template>

<script setup>
import { AgGridVue } from 'ag-grid-vue3';
import { reactive, ref } from 'vue';

const rowDataDeal = reactive({ rows: [] });
const isSelected = ref(true);
const gridApiDeal = ref(null);

const onGridReadyDeal = params => {
  gridApiDeal.value = params.api;
  gridApiDeal.value.setGridOption('headerHeight', 30);
  gridApiDeal.value.setGridOption('rowHeight', 30);
};

const columnDefsDeal = reactive({
  columns: [
    {
      headerName: '',
      field: '',
      maxWidth: 50,
      minWidth: 50,
      checkboxSelection: true,
      headerCheckboxSelection: true,
      editable: false,
      filter: false,
      pinned: 'left',
    },
    {
      headerName: 'No',
      field: 'seq',
      maxWidth: 50,
      minWidth: 50,
    },
  ],
});
const gridOptionsDeal = {
  rowSelection: 'multiple' /* 'single' or 'multiple',*/,
  defaultColDef: {
    flex: 1,
    editable: true,
    width: 100,
  },
  localeText: { noRowsToShow: '자료가 없습니다.' },
};

const onSelectionChangedDeal = event => {
  selectedRows.value = event.api.getSelectedRows();
};
const onCellValueChangedDeal = event => {
  const rowIndex = event.rowIndex;
  const columnId = event.column.colId;
  console.log(`Cell at row ${rowIndex}, column ${columnId} changed`);
  console.log(`New Cell Value: ${event.value}`);
  console.log('New row data2: ', JSON.stringify(rowDataDeal.rows));

  const rowDataItem = rowDataDeal.rows[rowIndex];
  console.log('Entire row data:', rowDataItem);
  // setCellValue(rowIndex, 'mDay', '20240401');
};
</script>

<style scoped lang="sass"></style>

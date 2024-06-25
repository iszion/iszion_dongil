<template>
  <q-page>
    <q-card flat bordered>
      <q-bar>
        <q-icon name="print" />
        <span class="text-subtitle1 q-ml-sm">출력물관리화면</span>
        <q-space />
        <span class="text-bold text-subtitle1"> </span>
        <q-space />
        <q-btn dense flat icon="close" @click="closeDialog">
          <q-tooltip> 닫기 </q-tooltip>
        </q-btn>
      </q-bar>

      <q-card>
        <q-card-actions align="right" :class="$q.dark.isActive ? 'bg-grey-8 text-teal' : 'bg-blue-grey-1 text-teal'">
          <q-btn outline :color="$q.dark.isActive ? 'teal-3' : 'primary'" class="q-px-sm" @click="isExcelDownload">
            <q-icon class="q-mr-xs" name="download" size="xs" /> 엑셀
          </q-btn>
          <q-btn outline :color="$q.dark.isActive ? 'teal-3' : 'primary'" class="q-px-sm" @click="isPrintReport">
            <q-icon class="q-mr-xs" name="print" size="xs" /> 출력
          </q-btn>
          <q-btn outline :color="$q.dark.isActive ? 'teal-3' : 'primary'" class="q-px-sm" @click="closeDialog">
            <q-icon class="q-mr-xs" name="close" size="xs" /> 닫기
          </q-btn>
        </q-card-actions>
        <q-card-section class="q-pt-none">
          <!-- 여기서 rowData.rows를 사용하여 테이블 또는 내용을 표시 -->
          <div id="printZone">
            <div class="row q-px-xs">
              <span class="text-h6">역량평가 집계표 현황</span>
              <q-space />
              <span class="text-h6">기준년도 : {{ storeYear.setYear }}년</span>
            </div>

            <table>
              <tr>
                <th rowspan="1" colspan="2">소속</th>
                <th rowspan="2" colspan="1">성명</th>
                <th rowspan="1" colspan="3">평가기준</th>
                <th rowspan="1" colspan="2">1차평가</th>
                <th rowspan="1" colspan="2">2차평가</th>
              </tr>
              <tr>
                <th>소속</th>
                <th>직급</th>
                <th>항목구분</th>
                <th>평가항목</th>
                <th>가중치</th>
                <th>평가점수</th>
                <th>환산점수</th>
                <th>평가점수</th>
                <th>환산점수</th>
              </tr>
              <tr v-for="data in props.rowData" :key="data.empCd">
                <td>{{ data.deptNm }}</td>
                <td>{{ data.titlNm }}</td>
                <td>{{ data.empNm }}</td>
                <td>{{ data.itemFgNm }}</td>
                <td>{{ data.itemNm }}</td>
                <td>{{ data.weight }}</td>
                <td>{{ data.ch1MarkPoint }}</td>
                <td>{{ data.ch1MarkPointX }}</td>
                <td>{{ data.ch2MarkPoint }}</td>
                <td>{{ data.ch2MarkPointX }}</td>
              </tr>
            </table>
          </div>
        </q-card-section>
      </q-card>
    </q-card>
  </q-page>
</template>

<script setup>
import { defineProps, defineEmits, reactive, ref } from 'vue';
import printJS from 'print-js';
import * as XLSX from 'xlsx';
import { QBtn, QIcon, useQuasar } from 'quasar';
import { useYearInfoStore } from 'src/store/setYearInfo';
const storeYear = useYearInfoStore();
const $q = useQuasar();

const emit = defineEmits(['close']);
const props = defineProps({
  rowData: Array,
});

function closeDialog() {
  console.log('closeDialog called');
  emit('close');
}

const isPrintReport = () => {
  printJS({
    printable: 'printZone',
    type: 'html',
    css: ['/src/css/print/hrt2020.css'],
    scanStyles: false,
  });
};

if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
  console.log('Dark mode is enabled');
} else {
  console.log('Light mode is enabled');
}

/* ************************************************************************* *
 ** Excel저장  처리부분
 ** ************************************************************************* */
const isExcelDownload = () => {
  $q.dialog({
    dark: true,
    title: 'Excel 저장',
    html: true,
    message: '엑셀 파일로 저장 하시겠습니까?',
    // persistent: true,
    ok: {
      label: '저장',
      color: 'primary',
    },
    cancel: {
      label: '닫기',
      color: 'secondary',
    },
  })
    .onOk(() => {
      excelDownload();
    })
    .onCancel(() => {})
    .onDismiss(() => {});
};
const headerGroup = reactive({
  header: [],
  headProps: ['deptNm', 'titlNm', 'empNm', 'itemFgNm', 'itemNm', 'weight', 'ch1MarkPoint', 'ch1MarkPointX', 'ch2MarkPoint', 'ch2MarkPointX'],
  headRow1: [
    { name: '소속팀', rowspan: 1, colspan: 2 },
    { name: '성명', rowspan: 2, colspan: 1, key: 'empNm' },
    { name: '평가기준', rowspan: 1, colspan: 3 },
    { name: '1차평가', rowspan: 1, colspan: 2 },
    { name: '2차평가', rowspan: 1, colspan: 2 },
  ],
  headRow2: [
    { name: '소속', rowspan: 1, colspan: 1, key: 'deptNm' },
    { name: '직급', rowspan: 1, colspan: 1, key: 'titlNm' },
    { name: '항목구분', rowspan: 1, colspan: 1, key: 'itemFgNm' },
    { name: '평가항목', rowspan: 1, colspan: 1, key: 'itemNm' },
    { name: '가중치', rowspan: 1, colspan: 1, key: 'weight' },
    { name: '평가점수', rowspan: 1, colspan: 1, key: 'ch1MarkPoint' },
    { name: '환산점수', rowspan: 1, colspan: 1, key: 'ch1MarkPointX' },
    { name: '평가점수', rowspan: 1, colspan: 1, key: 'ch2MarkPoint' },
    { name: '환산점수', rowspan: 1, colspan: 1, key: 'ch2MarkPointX' },
  ],
});

const excelDownload = () => {
  headerGroup.header = [];
  headerGroup.header.push(headerGroup.headRow1);
  headerGroup.header.push(headerGroup.headRow2);

  let options = {
    header: headerGroup.header,
    headProps: headerGroup.headProps,
  };
  excelExport(props.rowData, options);
};

const visibleHeadProps = ref([]);
const instance = ref(undefined);
const excelExport = (data, options) => {
  let headProps = [];
  if (Array.isArray(options.headProps)) {
    headProps = options.headProps;
  } else if (options.headProps === 'header') {
    for (let h of headerGroup.header) {
      headProps.push(h.key);
    }
  } else {
    headProps = Object.keys(data[0]);
  }
  visibleHeadProps.value = headerGroup.headProps;

  instance.value = document.createElement('table');

  // Header 세팅
  let headerRows = [];
  if (!Array.isArray(headerGroup.header[0])) {
    headerRows.push(headerGroup.header);
  } else {
    headerRows = headerGroup.header;
  }
  let thead = document.createElement('thead');
  for (let row of headerRows) {
    let tr = document.createElement('tr');
    for (let h of row) {
      let rowspan = h.rowspan || '1';
      let colspan = h.colspan || '1';
      let th = document.createElement('th');
      th.setAttribute('rowspan', rowspan);
      th.setAttribute('colspan', colspan);
      th.innerText = h.name;
      tr.appendChild(th);
    }
    thead.appendChild(tr);
  }
  instance.value.appendChild(thead);

  // Body 세팅
  let tbody = document.createElement('tbody');
  for (let row of data) {
    let tr = document.createElement('tr');
    for (let cellkey of visibleHeadProps.value) {
      let td = document.createElement('td');
      td.innerText = row[cellkey];
      tr.appendChild(td);
    }
    tbody.appendChild(tr);
  }
  instance.value.appendChild(tbody);

  // instance에 만들어진 table을 엑셀파일로 저장
  const config = { raw: true, type: 'string' };
  const ws = XLSX.utils.table_to_sheet(instance.value, config);

  // Set red color to A1 cell
  ws['A1'].s = {
    font: {
      color: { rgb: 'FF0000' }, // Red color
      bold: true,
    },
  };

  // Add borders to all cells
  const range = XLSX.utils.decode_range(ws['!ref']);
  for (let R = range.s.r; R <= range.e.r; ++R) {
    for (let C = range.s.c; C <= range.e.c; ++C) {
      const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
      if (!ws[cellAddress]) continue;
      ws[cellAddress].s = {
        border: {
          // top: { style: 'thin', color: { auto: 1 } },
          // bottom: { style: 'thin', color: { auto: 1 } },
          // left: { style: 'thin', color: { auto: 1 } },
          // right: { style: 'thin', color: { auto: 1 } },
          top: { style: 'thin', color: { rgb: '0000FF' } }, // Blue color
          bottom: { style: 'thin', color: { rgb: '0000FF' } }, // Blue color
          left: { style: 'thin', color: { rgb: '0000FF' } }, // Blue color
          right: { style: 'thin', color: { rgb: '0000FF' } }, // Blue color
        },
      };
    }
  }

  let wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, '역량평가집계표현황');
  XLSX.writeFile(wb, '역량평가집계표현황.xlsx');
};
</script>

<style scoped>
@import 'src/css/print/hrt2020.css';
</style>

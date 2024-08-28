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
              <span class="text-h6">{{ storeYear.setYear }}년</span>
              <span class="text-h6 q-ml-sm">진급대상자보고서</span>
              <q-space />
            </div>

            <table>
              <tr>
                <th rowspan="2" colspan="1">직급대상</th>
                <th rowspan="2" colspan="1">소속</th>
                <th rowspan="2" colspan="1">성명</th>
                <th rowspan="2" colspan="1">생년월일</th>
                <th rowspan="2" colspan="1">입사일</th>
                <th rowspan="2" colspan="1">학력</th>
                <th rowspan="2" colspan="1">최종학교명</th>
                <th rowspan="2" colspan="1">현직급승격일</th>
                <th rowspan="2" colspan="1">년차</th>
                <th rowspan="1" colspan="5">인사평가점수(누적)</th>
                <th rowspan="2" colspan="1">평가점수</th>
              </tr>
              <tr>
                <th>{{ props.setYear - 4 }}년</th>
                <th>{{ props.setYear - 3 }}년</th>
                <th>{{ props.setYear - 2 }}년</th>
                <th>{{ props.setYear - 1 }}년</th>
                <th>{{ props.setYear }}년</th>
              </tr>
              <tr v-for="(data, index) in props.rowData" :key="index">
                <td>{{ data.titlNmNnextTitlNm }}</td>
                <td>{{ data.deptNm }}</td>
                <td>{{ data.empNm }}</td>
                <td>{{ data.birthDay }}</td>
                <td>{{ data.inDay }}</td>
                <td>{{ data.eduLevel }}</td>
                <td>{{ data.finalSchool }}</td>
                <td>{{ data.appoDay }}</td>
                <td>{{ data.yearsDiff }}</td>
                <td>{{ data.lastPointY4 }}</td>
                <td>{{ data.lastPointY3 }}</td>
                <td>{{ data.lastPointY2 }}</td>
                <td>{{ data.lastPointY1 }}</td>
                <td>{{ data.lastPointY0 }}</td>
                <td>{{ data.totalPoint }}</td>
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
  setYear: Number,
});

function closeDialog() {
  console.log('closeDialog called');
  emit('close');
}

const isPrintReport = () => {
  printJS({
    printable: 'printZone',
    type: 'html',
    css: ['/css/print/hpr2010.css'],
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
  headProps: [
    'titlNmNnextTitlNm',
    'deptNm',
    'empNm',
    'birthDay',
    'inDay',
    'eduLevel',
    'finalSchool',
    'appoDay',
    'yearsDiff',
    'lastPointY4',
    'lastPointY3',
    'lastPointY2',
    'lastPointY1',
    'lastPointY0',
    'totalPoint',
  ],
  headRow1: [
    { name: '직급대상', rowspan: 2, colspan: 1, key: 'titlNmNnextTitlNm' },
    { name: '소속팀', rowspan: 2, colspan: 1, Key: 'deptNm' },
    { name: '성명', rowspan: 2, colspan: 1, key: 'empNm' },
    { name: '생년월일', rowspan: 2, colspan: 1, key: 'birthDay' },
    { name: '입사일', rowspan: 2, colspan: 1, key: 'inDay' },
    { name: '학력', rowspan: 2, colspan: 1, key: 'eduLevel' },
    { name: '최종학교명', rowspan: 2, colspan: 1, key: 'finalSchool' },
    { name: '현직급승격일', rowspan: 2, colspan: 1, key: 'appoDay' },
    { name: '년차', rowspan: 2, colspan: 1, key: 'yearsDiff' },
    { name: '인사평가점수(누적)', rowspan: 1, colspan: 5 },
    { name: '평가점수', rowspan: 2, colspan: 1, key: 'totalPoint' },
  ],
  headRow2: [
    { name: props.setYear - 4 + '년', rowspan: 1, colspan: 1, key: 'lastPointY4' },
    { name: props.setYear - 3 + '년', rowspan: 1, colspan: 1, key: 'lastPointY3' },
    { name: props.setYear - 2 + '년', rowspan: 1, colspan: 1, key: 'lastPointY2' },
    { name: props.setYear - 1 + '년', rowspan: 1, colspan: 1, key: 'lastPointY1' },
    { name: props.setYear + '년', rowspan: 1, colspan: 1, key: 'lastPointY0' },
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
  XLSX.utils.book_append_sheet(wb, ws, '진급대상자보고서');
  XLSX.writeFile(wb, '진급대상자보고서.xlsx');
};
</script>

<style scoped>
@import 'src/css/print/hpr2010.css';
</style>

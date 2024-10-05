<template>
  <q-card bordered class="q-pa-xs">
    <q-bar class="q-py-xs text-subtitle1 text-bold">
      소속팀 조직도
      <q-space />
    </q-bar>
    <q-card-section class="q-pa-none">
      <div class="row q-col-gutter-sm-x-xs">
        <div class="col-xs-12 col-sm-3">
          <q-card bordered class="q-ma-xs-none q-ma-sm-sm">
            <div id="svg-tree1" />
          </q-card>
        </div>

        <div class="col-xs-12 col-sm-6">
          <q-card bordered class="q-ma-xs-none q-ma-sm-sm">
            <div id="svg-tree2" />
          </q-card>
        </div>

        <div class="col-xs-12 col-sm-3 q-pa-sm-sm q-pa-xs-none">
          <q-card bordered>
            <q-bar>
              <span class="text-bold text-subtitle1">소속팀 현황</span>
            </q-bar>
            <div class="q-pa-sm">
              <q-list bordered class="rounded-borders">
                <div v-for="(data, index) in rowDataDept" :key="index" class="">
                  <q-item class="row">
                    <q-item-section class="col-1">
                      <q-item-label>{{ index + 1 }}</q-item-label>
                    </q-item-section>

                    <q-item-section class="col-1">
                      <q-avatar size="35px">
                        <q-img
                          class="cursor-pointer"
                          v-if="data.imageFileNm"
                          :src="`https://hr.energyshop.co.kr/imagesThumbnail/${data.imageFileNm}`"
                          @click="handleShowImage(data)"
                        />
                        <q-icon v-else name="face" color="teal" size="md" />
                      </q-avatar>
                    </q-item-section>

                    <q-item-section class="col-2">
                      <q-item-label>{{ data.empNm }}</q-item-label>
                    </q-item-section>

                    <q-item-section class="col-4">
                      <q-item-label>{{ data.deptNm }}</q-item-label>
                      <q-item-label caption> {{ data.depgNm }}</q-item-label>
                    </q-item-section>

                    <q-item-section class="col-xs-auto col-sm-2">
                      <q-item-label>{{ data.titlNm }}</q-item-label>
                    </q-item-section>

                    <q-item-section class="col-xs-auto col-sm-2">
                      <q-item-label>{{ data.catgNm }}</q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-separator v-if="rowDataDept.length - 1 !== index" spaced />
                </div>
              </q-list>
            </div>
          </q-card>
        </div>
      </div>
    </q-card-section>
  </q-card>

  <!-- 이미지 원본보기 Dialog -->
  <q-dialog v-model="dialogOpen">
    <q-card bordered style="max-width: 450px; width: 100%">
      <q-img :src="showImage.fullImageUrl" style="max-width: 100%; max-height: 100vh" />
      <q-card-section>
        <div class="row no-wrap items-center">
          <div class="col text-h6 ellipsis">{{ showImage.empNm }}</div>
          <div class="q-gutter-x-sm">
            <span class="text-subtitle1">{{ showImage.deptNm }}</span>
            <span class="text-subtitle2">{{ showImage.titlNm }}</span>
          </div>
        </div>
      </q-card-section>

      <q-card-section class="q-pt-none"> </q-card-section>

      <q-separator />

      <q-card-actions align="right">
        <q-btn v-close-popup flat color="primary" label="닫기" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { onMounted, reactive, ref, watch } from 'vue';
import ApexTree from 'apextree';
import { api } from 'boot/axios';
import { useYearInfoStore } from 'src/store/setYearInfo';
import { QBtn } from 'quasar';
const storeYear = useYearInfoStore();

const rowDataDept = ref();
const rowData = reactive({ office: '', sale: '' });

// 이미지 팝업 뷰
const dialogOpen = ref(false);
const showImage = ref({
  fullImageUrl: '',
  empNm: '',
  deptNm: '',
  titlNm: '',
});
const handleShowImage = data => {
  showImage.value.fullImageUrl = `https://hr.energyshop.co.kr/images/${data.imageFileNm}?${new Date().getTime()}`;
  showImage.value.empNm = data.empNm;
  showImage.value.deptNm = data.deptNm;
  showImage.value.titlNm = data.titlNm;
  dialogOpen.value = true;
};
// 이미지 팝업 뷰 끝

const options_office = reactive({
  contentKey: 'data',
  width: '100%',
  height: 500,
  nodeWidth: 150,
  nodeHeight: 100,
  fontColor: '#000',
  borderColor: '#333',
  childrenSpacing: 80,
  siblingSpacing: 50,
  direction: 'top',
  enableExpandCollapse: true,
  nodeTemplate: content =>
    `<div class='node-content' style='display: flex; flex-direction: column; gap: 10px; justify-content: center; align-items: center; height: 100%;' data-empCd=${content.empCd} data-deptCd=${content.deptCd}>
          <div class='q-gutter-y-none text-center cursor-pointer' id='node-${content.id}'>
            <img style='width: 50px;height: 50px;border-radius: 50%;' src='${content.imageURL}' alt='' />
            <div style="font-weight: bold; font-family: Arial; font-size: 14px" data-name=${content.name}>${content.name}</div>
            <div style="font-weight: bold; font-family: Arial; font-size: 12px" data-dept=${content.deptCd}'> ${content.deptNm} / ${content.titlNm}</div>
          </div>
         </div>`,
  canvasStyle: '',
  // canvasStyle: 'border: 1px solid black;background: #f6f6f6;',
  enableToolbar: true,
});
const options_sale = reactive({
  contentKey: 'data',
  width: '100%',
  height: 500,
  nodeWidth: 100,
  nodeHeight: 150,
  fontColor: '#000',
  borderColor: '#333',
  childrenSpacing: 250,
  siblingSpacing: 10,
  direction: 'top',
  enableExpandCollapse: true,
  nodeTemplate: content =>
    `<div class='node-content' style='display: flex; flex-direction: column; gap: 10px; justify-content: center; align-items: center; height: 100%;' data-empCd=${content.empCd} data-deptCd=${content.deptCd}>
          <div class='q-gutter-y-none text-center cursor-pointer' id='node-${content.id}'>
            <img style='width: 50px;height: 50px;border-radius: 50%;' src='${content.imageURL}' alt='' />
            <div style="font-weight: bold; font-family: Arial; font-size: 14px" data-name=${content.name}>${content.name}</div>
            <div style="font-weight: bold; font-family: Arial; font-size: 12px" data-dept=${content.deptCd}'> ${content.deptNm} / ${content.titlNm}</div>
          </div>
         </div>`,
  canvasStyle: '',

  // canvasStyle: 'border: 1px solid black;background: #f6f6f6;',
  enableToolbar: true,
});
const deptDetailView = (resDeptCd, resEmpCd) => {
  getDeptEmpData(resDeptCd, resEmpCd).then(() => {});
};
onMounted(() => {
  getDeptOfficeTreeData().then(() => {
    const tree = new ApexTree(document.getElementById('svg-tree1'), options_office);
    tree.render(rowData.office);

    // 이벤트를 수동으로 바인딩
    const nodes = document.querySelectorAll('.node-content');
    nodes.forEach(node => {
      node.addEventListener('click', () => {
        // const content = node.__vue__; // Access the Vue component's data
        const empCd = node.getAttribute('data-empCd');
        const deptCd = node.getAttribute('data-deptCd');
        deptDetailView(deptCd, empCd);
      });
    });
  });

  getDeptSaleTreeData().then(() => {
    const tree = new ApexTree(document.getElementById('svg-tree2'), options_sale);
    tree.render(rowData.sale);

    // 이벤트를 수동으로 바인딩
    const nodes = document.querySelectorAll('.node-content');
    nodes.forEach(node => {
      node.addEventListener('click', () => {
        // const content = node.__vue__; // Access the Vue component's data
        const empCd = node.getAttribute('data-empCd');
        const deptCd = node.getAttribute('data-deptCd');
        deptDetailView(deptCd, empCd);
      });
    });
  });
});

// **************************************************************//
// ***** DataBase 연결부분    *************************************//
// **************************************************************//
// ***** DataBase 서브메뉴자료 가져오기 부분 *****************************//
const getDeptEmpData = async (resDeptCd, resEmpCd) => {
  try {
    const response = await api.post('/api/aux/dashboard_dept_emp_list', {
      paramSetYear: storeYear.setYear,
      paramDeptCd: resDeptCd,
      paramEmpCd: resEmpCd,
    });

    // console.log('data ; ', JSON.stringify(response.data.data));
    rowDataDept.value = response.data.data;
  } catch (error) {
    console.error('Error fetching users:', error);
  }
};

const getDeptOfficeTreeData = async param => {
  try {
    const response = await api.post('/api/aux/dashboard_dept_office_tree_list', { paramSetYear: storeYear.setYear });

    // console.log('data ; ', JSON.stringify(response.data.data));
    const tmpData = buildTree(response.data.data);
    // console.log('tmpData ; ', JSON.stringify(tmpData[0]));
    rowData.office = tmpData[0];
  } catch (error) {
    console.error('Error fetching users:', error);
  }
};

const getDeptSaleTreeData = async param => {
  try {
    const response = await api.post('/api/aux/dashboard_dept_sale_tree_list', { paramSetYear: storeYear.setYear });

    // console.log('data ; ', JSON.stringify(response.data.data));
    const tmpData = buildTree(response.data.data);
    // console.log('tmpData ; ', JSON.stringify(tmpData[0]));
    rowData.sale = tmpData[0];
  } catch (error) {
    console.error('Error fetching users:', error);
  }
};

function buildTree(data, parentDeptCd = '000') {
  const tree = [];
  data.forEach(item => {
    // console.log('item : ', JSON.stringify(item));
    let tmpURL = '';
    if (item.imageFileNm === '' || item.imageFileNm === null) {
      if (item.titlCd === '101') {
        tmpURL = '/icons/iszion_logo.png';
      } else {
        tmpURL = '/icons/favicon-96x96.png';
      }
    } else {
      tmpURL = `https://hr.energyshop.co.kr/imagesThumbnail/${item.imageFileNm}`;
    }
    if (item.upDeptCd === parentDeptCd) {
      const node = {
        id: item.deptCd,
        data: {
          imageURL: tmpURL,
          name: item.empNm || '',
          empCd: item.empCd,
          deptCd: item.deptCd,
          deptNm: item.deptNm,
          titlNm: item.catgNm || item.titlNm || '',
        },
        options: {
          nodeBGColor: '#cdb4db', // Default background color
          nodeBGColorHover: '#cdb4db',
        },
        children: buildTree(data, item.deptCd), // Recursively build the tree
      };

      if (item.catgCd === '02') {
        node.options.nodeBGColor = '#be8096';
        node.options.nodeBGColorHover = '#be8096';
      } else if (item.catgCd === '03') {
        node.options.nodeBGColor = '#00afb9';
        node.options.nodeBGColorHover = '#00afb9';
      } else if (item.catgCd === '04') {
        node.options.nodeBGColor = '#c5b158';
        node.options.nodeBGColorHover = '#c5b158';
      } else {
        if (item.deptCd.substring(0, 1) === '2') {
          node.options.nodeBGColor = '#eea769';
          node.options.nodeBGColorHover = '#eea769';
        } else {
          node.options.nodeBGColor = '#7c8eab';
          node.options.nodeBGColorHover = '#7c8eab';
        }
      }

      if (item.deptCd === '001') {
        node.options.nodeBGColor = '#00afb9';
        node.options.nodeBGColorHover = '#00afb9';
      } else if (item.deptCd === '011') {
        node.options.nodeBGColor = '#eea769';
        node.options.nodeBGColorHover = '#eea769';
      } else if (item.deptCd === '012') {
        node.options.nodeBGColor = '#7c8eab';
        node.options.nodeBGColorHover = '#7c8eab';
      }

      tree.push(node);
    }
  });
  // console.log('tree1 : ', JSON.stringify(tree));
  return tree;
}
</script>

<style scoped>
.full-width-chart {
  width: 100%;
}
</style>

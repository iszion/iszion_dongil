<template>
  <q-card bordered class="q-pa-xs" style="height: 100%">
    <q-bar class="q-py-xs text-subtitle1 text-bold">
      소속팀 조직도
      <q-space />
    </q-bar>
    <q-card-section class="q-pa-none">
      <div class="row q-col-gutter-sm-x-xs">
        <div class="col-xs-12 col-sm-5">
          <q-card bordered class="q-ma-xs-none q-ma-sm-sm">
            <div id="svg-tree1" />
          </q-card>
        </div>

        <div class="col-xs-12 col-sm-4 q-pa-sm-sm q-pa-xs-none">
          <q-card bordered style="height: 100%">
            <span class="text-bold flex flex-center q-pa-sm text-h6">사업장 현황</span>
            <div class="q-pa-sm">
              <q-scroll-area style="height: 430px">
                <q-list bordered class="rounded-borders">
                  <div v-for="(data, index) in rowDataDept" :key="index" class="">
                    <div class="row cursor-pointer" @click="handleRowClick(data)">
                      <div class="col-1 flex flex-center">
                        <q-item-label>{{ index + 1 }}</q-item-label>
                      </div>

                      <div class="col-4 flex flex-center">
                        <q-item-label>{{ data.depgNm }} / {{ data.deptNm }}</q-item-label>
                      </div>

                      <div class="col-1 flex flex-center">
                        <q-avatar size="35px">
                          <q-img
                            class="cursor-pointer"
                            v-if="data.imageFileNm"
                            :src="`https://hr.energyshop.co.kr/imagesThumbnail/${data.imageFileNm}`"
                            style="object-fit: cover; width: 100%; height: 100%"
                            @click="handleShowImage(data)"
                          />
                          <q-icon v-else name="face" color="teal" size="md" />
                        </q-avatar>
                      </div>

                      <div class="col-2 flex flex-center">
                        <q-item-label>{{ data.empNm }}</q-item-label>
                      </div>

                      <div class="col-2 flex flex-center">
                        <q-item-label>{{ data.titlNm }}</q-item-label>
                      </div>

                      <div class="col-2 flex flex-center">
                        <q-item-label>{{ data.catgNm }}</q-item-label>
                      </div>
                    </div>
                    <q-separator v-if="rowDataDept.length - 1 !== index" spaced />
                  </div>
                </q-list>
              </q-scroll-area>
            </div>
          </q-card>
        </div>

        <div class="col-xs-12 col-sm-3 q-pa-sm-sm q-pa-xs-none">
          <q-card bordered style="height: 100%">
            <span class="text-bold flex flex-center q-pa-sm text-h6">소속팀 현황</span>
            <div class="q-pa-sm">
              <q-list bordered class="rounded-borders">
                <div v-for="(data, index) in rowDataDeptEmp" :key="index" class="">
                  <div class="row">
                    <div class="col-1 flex flex-center">
                      <q-item-label>{{ index + 1 }}</q-item-label>
                    </div>

                    <div class="col-1 flex flex-center">
                      <q-avatar size="35px">
                        <q-img
                          class="cursor-pointer"
                          v-if="data.imageFileNm"
                          :src="`https://hr.energyshop.co.kr/imagesThumbnail/${data.imageFileNm}`"
                          @click="handleShowImage(data)"
                        />
                        <q-icon v-else name="face" color="teal" size="md" />
                      </q-avatar>
                    </div>

                    <div class="col-2 flex flex-center">
                      <q-item-label>{{ data.empNm }}</q-item-label>
                    </div>

                    <div class="col-4 flex flex-center">
                      <q-item-label>{{ data.depgNm }} / {{ data.deptNm }}</q-item-label>
                    </div>

                    <div class="col-2 flex flex-center">
                      <q-item-label>{{ data.titlNm }}</q-item-label>
                    </div>

                    <div class="col-2 flex flex-center">
                      <q-item-label>{{ data.catgNm }}</q-item-label>
                    </div>
                  </div>
                  <q-separator v-if="rowDataDeptEmp.length - 1 !== index" spaced />
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

const rowDataDeptEmp = ref();
const rowDataDept = ref();
const rowData = reactive({ office: '' });

const handleRowClick = data => {
  // console.log('Row clicked:', data);
  getDeptEmpData(data.deptCd, data.empCd);
  // Your logic to handle the row click goes here
  // For example, you might show a dialog, navigate to another page, or perform an API call
};

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
            <div style="font-weight: bold; font-family; Arial; font-size: 14px" data-name=${content.empNm}>${content.deptNm}</div>
            <div style="font-weight: bold; font-family; Arial; font-size: 12px" data-dept=${content.deptCd}'> ${content.titlNm} / ${content.empNm}</div>
          </div>
         </div>`,
  canvasStyle: '',
  // canvasStyle: 'border: 1px solid black;background: #f6f6f6;',
  enableToolbar: false,
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
        if (deptCd.substring(0, 2) === '99') {
          let callDeptCd1 = deptCd === '991' ? '3' : '2';
          getDeptData(callDeptCd1).then(() => {
            getDeptEmpData(rowDataDept.value[0].deptCd, rowDataDept.value[0].empCd);
          });
        } else {
          rowDataDept.value = [];
          deptDetailView(deptCd, empCd);
        }
      });
    });
    getDeptData('3').then(() => {
      getDeptEmpData(rowDataDept.value[0].deptCd, rowDataDept.value[0].empCd);
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
    rowDataDeptEmp.value = response.data.data;
  } catch (error) {
    console.error('Error fetching users:', error);
  }
};

const getDeptData = async resDeptCd1 => {
  rowDataDeptEmp.value = [];
  try {
    const response = await api.post('/api/aux/dashboard_dept_list', {
      paramSetYear: storeYear.setYear,
      paramDeptCd1: resDeptCd1,
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

function buildTree(data, parentDeptCd = '000') {
  const tree = [];
  data.forEach(item => {
    // console.log('item : ', JSON.stringify(item));
    let tmpURL = '';
    if (item.imageFileNm === '' || item.imageFileNm === null) {
      if (item.titlCd === '101') {
        tmpURL = '/icons/dongil_logo.png';
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
          empNm: item.empNm || '',
          empCd: item.empCd,
          deptCd: item.deptCd,
          deptNm: item.deptNm,
          catgCd: item.catgCd,
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

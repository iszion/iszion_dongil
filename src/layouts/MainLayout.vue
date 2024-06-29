<template>
  <q-layout view="hHh lpR fFf">
    <q-header class="shadow-1 bg-grey-8">
      <q-toolbar>
        {{ $q.screen.name }}
        <q-avatar square size="sm" @click="rootView" class="cursor-pointer">
          <img src="../assets/images/dongil_logo.png" />
        </q-avatar>

        <div v-if="!$q.screen.lt.lg" class="text-h6 text-weight-bold q-pl-sm self-center cursor-pointer" @click="rootView">
          {{ $t('project_name') }}
        </div>

        <q-separator class="q-mx-xs-sm" dark vertical inset />

        <div style="max-width: 300px">
          <q-select
            style="width: 125px; font-size: 1.04em"
            dense
            :bg-color="ev_set_color"
            standout="text-white"
            label-color="orange"
            class="super-small"
            v-model="ev_set_year_group"
            :options="ev_set_year_options"
            option-value="stdSetYear"
            option-label="stdYearNm"
            options-dense
            emit-value
            map-options
            @update:model-value="handleSelectedSetYear"
          >
            <template v-slot:append>
              <q-icon size="xs" name="refresh" @click="getDataSetYear()">
                <q-tooltip class="bg-indigo" :offset="[10, 10]"> 기준년도 Reset </q-tooltip>
              </q-icon>
            </template>
          </q-select>
        </div>

        <q-separator class="q-mx-xs-sm" dark vertical inset />

        <q-btn rounded color="purple" dense round icon="menu" aria-label="Menu" @click="toggleLeftDrawer" />

        <q-space />
        <!--  Main Menu List -->
        <q-tabs
          v-model="activeTab"
          active-class="text-white text-bold"
          dense
          no-caps
          inline-label
          align="center"
          active-color="primary"
          indicator-color="orange"
          v-if="$q.screen.gt.sm"
        >
          <template v-for="m in menuListData.mainMenu" :key="m.menu_cd">
            <q-tab :name="m.name" @click="selectMenu(m)" class="text-bold text-subtitle2">
              <q-icon :name="m.icon" class="q-mr-xs" />
              <q-tooltip class="lt-sm bg-indigo" :offset="[10, 10]">
                {{ m.label }}
              </q-tooltip>
              <span class="gt-sm">{{ m.label }}</span>
              <!--              {{ $q.screen.md ? null : $t(m.labelExt) }}-->
            </q-tab>
          </template>
          <!--        <q-route-tab icon="menu" exact replace label="종합정보1" to="inf" />-->
        </q-tabs>
        <!--  end of Main Menu List -->
        <q-space />
        <q-separator class="q-mx-sm-sm" dark vertical inset />
        <q-btn flat round dense :icon="$q.dark.isActive ? 'light_mode' : 'dark_mode'" @click="toggleDarkMode">
          <q-tooltip
            class="bg-amber text-black shadow-4"
            anchor="top middle"
            self="bottom middle"
            transition-show="rotate"
            transition-hide="rotate"
            :offset="[10, 10]"
          >
            <q-icon :name="$q.dark.isActive ? 'light_mode' : 'dark_mode'" size="0.8rem" />
            <strong v-if="$q.dark.isActive"> 라이트모드 전환하기 </strong>
            <strong v-if="!$q.dark.isActive"> 다크모드 전환하기 </strong>
          </q-tooltip>
        </q-btn>
        <!-- dark_mode-->
        <q-separator v-if="$q.screen.xs" class="q-mx-sm-sm" dark vertical inset />
        <!-- MAIN MENU ICON  -->
        <q-btn flat round dence icon="apps" v-if="!$q.screen.gt.sm">
          <q-menu :offset="[40, 10]" transition-show="flip-right" transition-hide="flip-left">
            <q-list dense style="min-width: 100px">
              <template v-for="m in menuListData.mainMenu" :key="m.menu_cd">
                <q-item clickable @click="selectMenu(m)">
                  <q-item-section avatar>
                    <q-icon color="primary" :name="m.icon" />
                  </q-item-section>
                  <q-item-section>{{ $t(m.labelExt) }}</q-item-section>
                </q-item>
              </template>
            </q-list>
          </q-menu>
        </q-btn>
        <!-- MAIN MENU ICON  끝  -->
        <q-separator class="q-mx-sm-sm" dark vertical inset />

        <!-- 사용자 관리 ICON   -->
        <q-btn flat size="sm" class="q-pa-none q-ml-sm">
          <div v-if="!$q.screen.xs">
            <div class="text-subtitle2 text-bold q-mr-sm text-orange" style="font-size: 1.2em">{{ storeUser.setDeptNm }}</div>
            <div class="text-subtitle2 text-bold q-mr-sm">{{ storeUser.setEmpNm }}</div>
          </div>
          <q-avatar color="deep-orange">
            <q-img loading="eager" src="https://cdn.quasar.dev/img/avatar6.jpg" />
          </q-avatar>
          <q-menu :offset="[0, 10]" transition-show="scale" transition-hide="scale">
            <q-list style="min-width: 100px">
              <q-item clickable v-close-popup to="/main/profile">
                <q-item-section>{{ $t('header_menu_profile') }}</q-item-section>
              </q-item>
              <q-separator />
              <q-item clickable v-close-popup to="/auth/sign-in">
                <q-item-section @click="logout">{{ $t('header_menu_logout') }}</q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>
        <!-- 사용자 관리 ICON 끝  -->
      </q-toolbar>

      <!--      <q-separator class="bg-grey" />-->
      <!--      <div v-if="pageTitleBarVisible" class="row" :class="$q.dark.isActive ? 'bg-grey-8 text-white' : 'bg-grey-4 text-dark'">-->
      <!--        <div v-if="!$q.screen.lt.md" style="width: 230px" class="text-center self-center bg-grey-5">-->
      <!--          <q-icon :name="menuIcon" size="sm" class="q-pb-xs q-pr-sm" />-->
      <!--          <span v-if="mainMenuTitle.titleName" class="text-h6 text-weight-bold">{{ $t(mainMenuTitle.titleName) }}</span>-->
      <!--        </div>-->
      <!--        <div class="col">-->
      <!--                <page-titlebar v-if="pageTitleBarVisible" :message="nodeValue" />-->
      <!--        </div>-->
      <!--      </div>-->
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered :class="$q.dark.isActive ? 'bg-grey-9' : 'bg-grey-3'" :width="230">
      <div v-if="mainMenuTitle.titleName" class="row q-px-sm q-pt-md q-pb-sm justify-between" :class="$q.dark.isActive ? 'bg-dark' : 'bg-grey-6'">
        <div class="text-subtitle1 text-bold">
          [ {{ $te(mainMenuTitle.titleName) ? $t(mainMenuTitle.titleName) : mainMenuTitle.titleName }} 관리 ]
        </div>
        <div>
          <q-btn :disable="!nodeValue.menuData.label" class="q-px-xs" flat size="11px" icon="bookmark_add" @click="addFavorites">
            <q-tooltip
              class="bg-amber text-black shadow-4"
              anchor="top middle"
              self="bottom middle"
              transition-show="rotate"
              transition-hide="rotate"
              :offset="[10, 10]"
            >
              <q-icon name="menu_book" size="0.8rem" />
              <strong> 즐겨찾기 저장하기 </strong>
            </q-tooltip>
          </q-btn>

          <q-btn :disable="!nodeValue.menuData.label" class="q-px-xs" flat size="11px" icon="menu_book" @click="handleHelpDialog">
            <q-tooltip
              class="bg-amber text-black shadow-4"
              anchor="top middle"
              self="bottom middle"
              transition-show="rotate"
              transition-hide="rotate"
              :offset="[10, 10]"
            >
              <q-icon name="menu_book" size="0.8rem" />
              <strong> 사용설명서 </strong>
            </q-tooltip>
          </q-btn>
        </div>
      </div>
      <q-separator size="2px" />
      <q-input class="q-mb-lg q-px-lg" dense ref="filterRef" v-model="filter" placeholder="Search" :hint="$t('searchWordMenu')">
        <template v-slot:append>
          <q-icon
            :name="filter !== '' ? 'clear search' : 'search'"
            class="cursor-pointer"
            :class="filter !== '' ? 'q-pr-md' : ''"
            @click="resetFilter"
          />
        </template>
      </q-input>

      <q-tree
        dense
        :nodes="menuList"
        node-key="id"
        :icon-key="'icon'"
        :filter="filter"
        v-model:expanded="treeExpanded"
        no-connectors
        :selected-color="$q.dark.isActive ? 'orange' : 'blue-14'"
        v-model:selected="selected"
        @click="handleNodeClick"
      >
        <template #header-folder="props">
          <div class="row items-center">
            <q-icon :color="$q.dark.isActive ? 'orange' : 'blue'" size="12px" class="q-mr-sm" :name="props.node.icon || 'share'" />
            <div class="text-bold" :class="$q.dark.isActive ? 'text-white' : 'text-dark'">
              {{ $te(props.node.labelExt) ? $t(props.node.labelExt) : props.node.label }}
            </div>
          </div>
        </template>
        <template #default-header="props">
          <div class="row items-center">
            <q-icon :color="$q.dark.isActive ? 'white' : 'dark'" size="12px" class="q-mr-sm" :name="props.node.icon || 'share'" />
            <div class="">
              {{ $te(props.node.labelExt) ? $t(props.node.labelExt) : props.node.label }}
            </div>
          </div>
        </template>
      </q-tree>
    </q-drawer>
    <q-page-container>
      <router-view />
    </q-page-container>

    <footer-bar />
  </q-layout>
  <q-dialog maximized v-model="helpDialogVisible">
    <page-manual :message="nodeValue" />
  </q-dialog>
</template>

<script setup>
import { onBeforeMount, onMounted, reactive, ref, watch } from 'vue';
import FooterBar from 'layouts/FooterBar.vue';
import { QIcon, useQuasar, Cookies, SessionStorage, QBtn } from 'quasar';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { api } from '/src/boot/axios';
import PageManual from 'components/comm/PageManual.vue';
import { useUserInfoStore } from 'src/store/setUserInfo';
import { useYearInfoStore } from 'src/store/setYearInfo';
import notifySave from 'src/js_comm/notify-save';
import JsonUtil from 'src/js_comm/json-util';

const storeUser = useUserInfoStore();
const storeYear = useYearInfoStore();

const $q = useQuasar();
const router = useRouter();

const activeTab = ref(null);
const filter = ref('');
const filterRef = ref(null);
const selected = ref(null);
const helpDialogVisible = ref(false);

const handleHelpDialog = () => {
  helpDialogVisible.value = true;
};
/* ******************************************************************************* */
/* ************   menu set  ****************************************************** */
/* ******************************************************************************* */
const menuList = ref([]);
const menuIcon = ref(null);
const mainMenuTitle = ref({
  titleName: '',
  titleCd: '',
});
const treeExpanded = ref([]);
const pageTitleBarVisible = ref(false);

const resetFilter = () => {
  filter.value = '';
  filterRef.value.focus();
};

const selectMenu = m => {
  // console.log('m ; ', m);
  setTimeout(() => {
    selected.value = null;
    menuIcon.value = m.icon;
    mainMenuTitle.value.titleName = m.labelExt;
    mainMenuTitle.value.titleCd = m.name;
    if (m.name === 'fav') {
      getFavMenuData(m.name);
    } else {
      getSubMenuData(m.name);
    }
  }, 100);
};

let tree = [];
function buildTreeMenuData(data) {
  tree = [];
  const map = {};

  // First pass: create a map of all items using mn1 and mn2
  data.forEach(item => {
    map[item.menuId] = { ...item, children: [] };
  });

  // Second pass: build the tree structure
  Object.values(map).forEach(item => {
    treeExpanded.value.push(item.id);
    if (item.menuParent === '#') {
      // Top-level menu
      tree.push(item);
      nodeValue.value.submenuName = item.labelExt;
      nodeValue.value.menuData = {};
    } else {
      // Submenu
      const parent = map[item.menuParent] || map[item.menuId];
      if (parent) {
        parent.children.push(item);
      }
    }
  });

  return tree;
}
/* ******************************************************************************* */
/* ************  end of menu set  ************************************************ */
/* ******************************************************************************* */

/* ******************************************************************************* */
/* ************   Head Main Control Menu toggle, 언어, darkMode    **************** */
/* ******************************************************************************* */
const leftDrawerOpen = ref(false);
const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value;
};
const toggleDarkMode = () => {
  $q.dark.toggle();
  $q.localStorage.set('darkMode', $q.dark.isActive);
  selectLanguage('ko-KR');
};

const selectLanguage = val => {
  import(`../../node_modules/quasar/lang/${val}.js`).then(lang => {
    $q.lang.set(lang.default);
    locale.value = val;
    $q.localStorage.set('lang', val);
  });
};

const { locale } = useI18n();

onBeforeMount(() => {
  selectLanguage('ko-KR');
  getDataSetYear().then(() => {
    getDataMainMenu();
  });
});

onMounted(() => {
  if ($q.screen.width >= $q.screen.sizes.sm) {
    toggleLeftDrawer();
    menuList.value = [];
  }
});

// 메인화면 재시작 (평가기준년도 변경시 실행)
const rootView = () => {
  leftDrawerOpen.value = false;
  pageTitleBarVisible.value = false;
  activeTab.value = null;
  menuList.value = [];
  router.push('/main');
};
/* ******************************************************************************* */
/* ************  end of Head Main Control select  ******************************** */
/* ******************************************************************************* */

/* ******************************************************************************* */
/* ************   tree Click select data    ************************************** */
/* ******************************************************************************* */
const nodeValue = ref({
  submenuName: '',
  menuData: {},
});
const handleNodeClick = () => {
  if (!selected.value) return false;
  pageTitleBarVisible.value = true;
  nodeValue.value.menuData = findValueById(menuList.value, selected.value);
  if (nodeValue.value.menuData.children.length === 0) {
    // console.log('node : ', JSON.stringify(nodeValue.value.menuData));
    router.push(nodeValue.value.menuData.url);
  }
};
function findValueById(data, id) {
  for (const node of data) {
    if (node.id === id) {
      return node;
    }
    if (node.children) {
      const foundValue = findValueById(node.children, id);
      if (foundValue !== null) {
        return foundValue;
      }
    }
  }
  return null; // Return null if id is not found
}
/* ******************************************************************************** */
/* ******    end of tree Click select data     ************************************ */
/* ******************************************************************************** */

/* ******************************************************************************** */
/* ******    token 처리 부분   ****************************************************** */
/* ******************************************************************************** */

const access_token = sessionStorage.getItem('accessToken');
const logout = () => {
  api
    .post('/api/auth/logout', access_token)
    .then(res => {
      router.push({ path: '/' });
    })
    .catch(res => {
      console.log('Error');
    });
};

const handleBeforeUnload = event => {
  const confirmationMessage = 'Are you sure you want to leave?';
  event.returnValue = confirmationMessage;

  api
    .post('/api/auth/logout', form.value)
    .then(res => {
      localStorage.removeItem('token');
      router.push({ path: '/' });
    })
    .catch(res => {
      console.log('Error');
    });
  return confirmationMessage;
};

// window.addEventListener('beforeunload', handleBeforeUnload);

/* ******************************************************************************** */
/* ******  end of  token 처리 부분   ************************************************ */
/* ******************************************************************************** */

// ***** DataBase 설정기간자료 가져오기 부분 *****************************//
const ev_set_year_group = ref(null);
const ev_set_color = ref(null);
const ev_set_year_options = ref([]);
// **************************************************************//
// ***** DataBase 연결부분  ***************************************//
// **************************************************************//

// ***** 유저정보 처리 부분 *****************************//
const getDataSetUserInfo = async () => {
  storeUser.setEmpCd = SessionStorage.getItem('empCd');
  try {
    const response = await api.post('/api/sys/user_info', { paramSetYear: storeYear.setYear, paramUserId: storeUser.setEmpCd });
    storgeUserInfoGroupSave(
      response.data.data[0].empCd +
        '|' +
        response.data.data[0].empNm +
        '|' +
        response.data.data[0].empNmx +
        '|' +
        response.data.data[0].depgCd +
        '|' +
        response.data.data[0].depgNm +
        '|' +
        response.data.data[0].deptCd +
        '|' +
        response.data.data[0].deptNm +
        '|' +
        response.data.data[0].titlCd +
        '|' +
        response.data.data[0].titlNm +
        '|' +
        response.data.data[0].pstnCd +
        '|' +
        response.data.data[0].pstnNm +
        '|' +
        response.data.data[0].catgCd +
        '|' +
        response.data.data[0].catgNm +
        '|' +
        response.data.data[0].evtgCd +
        '|' +
        response.data.data[0].evtgNm,
    );
  } catch (error) {
    console.error('Error fetching users:', error);
  }
};
// ***** 유저정보 처리 부분 끝 *****************************//

const getDataSetYear = async () => {
  try {
    const response = await api.post('/api/aux/aux1010_list', {});

    ev_set_year_options.value = [];
    ev_set_year_group.value = null;
    response.data.data.forEach(val => {
      if (!ev_set_year_group.value) {
        ev_set_year_group.value = val.stdYearNm;
        handle_ev_set_color(val.locCh);
      }
      ev_set_year_options.value.push(val);
    });
    storgeYearGroupSave(ev_set_year_options.value[0].stdYear + '|' + ev_set_year_options.value[0].stdFg + '|' + ev_set_year_options.value[0].locCh);
    getDataSetUserInfo();
  } catch (error) {
    console.error('Error fetching users:', error);
  }
};
// ***** DataBase 메인메뉴자료 가져오기 부분 *****************************//
const menuListData = reactive({
  mainMenu: {},
  subMenu: {},
});
const getDataMainMenu = async () => {
  try {
    const response = await api.post('/api/sys/menu_main_list', { paramUserId: storeUser.setEmpCd });
    menuListData.mainMenu = response.data.data;
  } catch (error) {
    console.error('Error fetching users:', error);
  }
};

// ***** DataBase 서브메뉴자료 가져오기 부분 *****************************//
const getSubMenuData = async param => {
  try {
    const response = await api.post('/api/sys/menu_sub_list', { paramGroupCd: param, paramUserId: storeUser.setEmpCd });

    const tmpMenu = response.data.data;

    // 사용자별 메뉴 추출 시 메뉴가 없는 헤더항목을 제거하는 부분
    // const menuIdValues = new Set(tmpMenu.map(entry => entry.menuId));
    const setMenuList = tmpMenu.filter(entry => {
      if (entry.menuParent === '#') {
        // Check if this menuId is a parent of any other menuParent
        return tmpMenu.some(e => e.menuParent === entry.menuId);
      }
      return true;
    });
    // 사용자별 메뉴 추출 시 메뉴가 없는 헤더항목을 제거하는 부분 끝

    menuList.value = buildTreeMenuData(setMenuList);

    leftDrawerOpen.value = true;
    pageTitleBarVisible.value = true;
    // return response.data.data;
  } catch (error) {
    console.error('Error fetching users:', error);
  }
};

// 즐겨찾기
const getFavMenuData = async param => {
  const paramData = { paramUserId: storeUser.setEmpCd };
  try {
    const response = await api.post('/api/sys/menu_fav_list', paramData);

    menuList.value = buildTreeMenuData(response.data.data);

    leftDrawerOpen.value = true;
    pageTitleBarVisible.value = true;
    // return response.data.data;
  } catch (error) {
    console.error('Error fetching users:', error);
  }
};
// **************************************************************//
// ***** DataBase 연결부분 끝  *************************************//
// **************************************************************//

const handleSelectedSetYear = resSelected => {
  console.log('selected SetYear: ', resSelected.locCh);
  handle_ev_set_color(resSelected.locCh);
  storgeYearGroupSave(resSelected.stdYear + '|' + resSelected.stdFg + '|' + resSelected.locCh);
  rootView();
};
const handle_ev_set_color = val => {
  switch (val) {
    case '0':
      ev_set_color.value = 'teal';
      break;
    case '1':
      ev_set_color.value = 'blue';
      break;
    case '2':
      ev_set_color.value = 'red';
      break;
    case '3':
      ev_set_color.value = 'orange';
      break;
    default:
      ev_set_color.value = null;
  }
};
// ***** 검색 선택 자동 처리 부분 끝 *****************************//

// ***** 즐겨찾기 정보저장 설정 부분 *****************************//
const addFavorites = () => {
  $q.dialog({
    dark: true,
    title: nodeValue.value.menuData.label,
    message: '즐겨찾기에 저장 하시겠습니까?',
    ok: {
      flat: true,
      push: true,
    },
    cancel: {
      flat: true,
      push: true,
    },
    // persistent: true,
  })
    .onOk(() => {
      // console.log('>>>> OK')
      // console.log(JSON.stringify(nodeValue.value.menuData));
      // favoritesSaveSection(resMsgProp.message.menuData);
      const resData = nodeValue.value.menuData;
      console.log(JSON.stringify(resData));

      let iu = [];
      let iuD = [];
      let jsonFormData = {
        userId: storeUser.setEmpCd,
        location: 'fav',
        progNm: resData.label,
        progId: resData.progId,
        icon: resData.icon,
        type: 'file',
      };
      let tmpJson = '{"mode":"I","data":' + JSON.stringify(jsonFormData) + '}';
      iu.push(tmpJson);
      const resFormData = JsonUtil.jsonFiller(iu, iuD);
      api
        .post('/api/sys/fav_save', resFormData)
        .then(res => {
          let saveStatus = {};
          saveStatus.rtn = res.data.rtn;
          saveStatus.rtnMsg = res.data.rtnMsg;
          notifySave.notifyView(saveStatus);
        })
        .catch(error => {
          let saveStatus = {};
          saveStatus.rtn = '2';
          saveStatus.rtnMsg = '처리되지 않았습니다.';
          notifySave.notifyView(saveStatus);
          console.log('error: ', error);
        });
    })
    .onCancel(() => {})
    .onDismiss(() => {
      // 확인/취소 모두 실행되었을때
    });
};

// ***** 유저정보 설정 부분 *****************************//
const storgeUserInfoGroupSave = resSetUserInfoGroup => {
  SessionStorage.set('setUserInfoGroup', resSetUserInfoGroup);
  getStorgeSetUserInfoGroup();
};

const getStorgeSetUserInfoGroup = () => {
  const _value = SessionStorage.getItem('setUserInfoGroup').split('|');
  storeUser.setEmpCd = _value[0];
  storeUser.setEmpNm = _value[1];
  storeUser.setEmpNmx = _value[2];
  storeUser.setDepgCd = _value[3];
  storeUser.setDepgNm = _value[4];
  storeUser.setDeptCd = _value[5];
  storeUser.setDeptNm = _value[6];
  storeUser.setTitlCd = _value[7];
  storeUser.setTitlNm = _value[8];
  storeUser.setPstnCd = _value[9];
  storeUser.setPstnNm = _value[10];
  storeUser.setCatgCd = _value[11];
  storeUser.setCatgNm = _value[12];
  storeUser.setEvtgCd = _value[13];
  storeUser.setEvtgNm = _value[14];
  // console.log(
  //   'Main SetUser Info Group :: ',
  //   storeUser.setEmpCd,
  //   storeUser.setEmpNm,
  //   storeUser.setEmpNmx,
  //   storeUser.setDepgCd,
  //   storeUser.setDepgNm,
  //   storeUser.setDeptCd,
  //   storeUser.setDeptNm,
  //   storeUser.setTitlCd,
  //   storeUser.setTitlNm,
  //   storeUser.setPstnCd,
  //   storeUser.setPstnNm,
  // );
};
const storgeYearGroupSave = resSetYearGroup => {
  SessionStorage.set('setYearGroup', resSetYearGroup);
  getStorgeSetYearGroup();
};

const getStorgeSetYearGroup = () => {
  const _value = SessionStorage.getItem('setYearGroup').split('|');
  storeYear.setYear = _value[0];
  storeYear.setFg = _value[1];
  storeYear.setLocCh = _value[2];
  console.log('Main SetYear Group :: ', storeYear.setYear, storeYear.setFg, storeYear.setLocCh);
};
</script>

<style scoped lang="scss"></style>

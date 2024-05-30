<template>
  <q-layout view="hHh lpR fFf">
    <q-header class="shadow-1 bg-grey-8">
      <q-toolbar>
        <q-avatar square size="sm" @click="rootView" class="cursor-pointer">
          <img src="../assets/images/dongil_logo.png" />
        </q-avatar>

        <div v-if="!$q.screen.xs" class="text-h6 text-weight-bold q-pl-sm self-center cursor-pointer" @click="rootView">{{ $t('project_name') }}</div>

        <q-separator class="q-mx-xs-sm" dark vertical inset />

        <div style="max-width: 300px">
          <q-select
            style="width: 100px; font-size: 1.04em"
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
          />
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
        {{ $q.screen.name }}
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
            <div class="text-subtitle2 text-bold q-mr-sm">{{ $store.state.showcase.userNmx }}</div>
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

      <q-separator class="bg-grey" />
      <div v-if="pageTitleBarVisible" class="row" :class="$q.dark.isActive ? 'bg-grey-8 text-white' : 'bg-grey-4 text-dark'">
        <div v-if="!$q.screen.xs" style="width: 230px" class="text-center self-center bg-grey-5">
          <q-icon :name="menuIcon" size="sm" class="q-pb-xs q-pr-sm" />
          <span v-if="mainMenuTitle.titleName" class="text-h6 text-weight-bold">{{ $t(mainMenuTitle.titleName) }}</span>
        </div>
        <div class="col">
          <page-titlebar v-if="pageTitleBarVisible" :message="nodeValue" />
        </div>
      </div>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered :class="$q.dark.isActive ? 'bg-grey-9' : 'bg-grey-3'" :width="230">
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
        :filter="filter"
        v-model:expanded="treeExpanded"
        no-connectors
        selected-color="red"
        v-model:selected="selected"
        @click="handleNodeClick"
      >
        <template #header-folder="props">
          <div class="row items-center">
            <q-icon :color="$q.dark.isActive ? 'orange' : 'blue'" size="12px" class="q-mr-sm" :name="props.node.icon || 'share'" />
            <div class="text-bold" :class="$q.dark.isActive ? 'text-orange' : 'text-blue'">
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
      <!--      <router-view :setYearGroup="setYearGroup" />-->
      <router-view />
    </q-page-container>

    <footer-bar />
  </q-layout>
</template>

<script setup>
import { onBeforeMount, onMounted, reactive, ref } from 'vue';
import FooterBar from 'layouts/FooterBar.vue';
import { QIcon, useQuasar, Cookies } from 'quasar';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { api } from '/src/boot/axios';
import authHeader from 'boot/authHeader';
import PageTitlebar from 'components/comm/PageTitlebar.vue';
import { useStore } from 'vuex';

const $q = useQuasar();
const router = useRouter();
const $store = useStore();

const activeTab = ref(null);
const filter = ref('');
const filterRef = ref(null);
const selected = ref(null);

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
};

const selectLanguage = val => {
  import(`../../node_modules/quasar/lang/${val}.mjs`).then(lang => {
    $q.lang.set(lang.default);
    locale.value = val;
    $q.localStorage.set('lang', val);
  });
};

const { locale } = useI18n();

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

/*const token = localStorage.getItem('token');
const accessObject = JSON.parse(token);

const form = ref({
  accessToken: accessObject.accessToken,
  refreshToken: accessObject.refreshToken,
});*/

const access_token = Cookies.get('accessToken');
const refresh_token = Cookies.get('refreshToken');

const logout = () => {
  api
    .post('/api/auth/logout', access_token, {
      headers: authHeader(),
    })
    .then(res => {
      localStorage.removeItem('token');
      Cookies.remove('accessToken');
      Cookies.remove('refreshToken');
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
    .post('/api/auth/logout', form.value, {
      headers: authHeader(),
    })
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

// **************************************************************//
// ***** DataBase 연결부분  ***************************************//
// **************************************************************//
onBeforeMount(() => {
  getDataSetYear();
  getDataMainMenu();
});
// ***** DataBase 설정기간자료 가져오기 부분 *****************************//
const ev_set_year_group = ref(null);
const ev_set_color = ref(null);
const ev_set_year_options = ref([]);
const setYearGroup = ref({
  setYear: '',
  setFg: '',
  setLocCh: '',
});
const handleSelectedSetYear = resSelected => {
  console.log('selected SetYear: ', resSelected.locCh);
  handle_ev_set_color(resSelected.locCh);
  // setYearGroup.value.setYear = resSelected.stdYear;
  // setYearGroup.value.setFg = resSelected.stdFg;
  // setYearGroup.value.setLocCh = resSelected.locCh;
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
const getDataSetYear = async () => {
  try {
    const response = await api.post('/api/aux/aux1010_list', {}, { headers: authHeader() });

    response.data.data.forEach(val => {
      if (!ev_set_year_group.value) {
        ev_set_year_group.value = val.stdYearNm;
        handle_ev_set_color(val.locCh);
      }
      ev_set_year_options.value.push(val);
    });
    // setYearGroup.value.setStdYear = ev_set_year_options.value[0].stdYear; // 기준년도
    // setYearGroup.value.setStdFg = ev_set_year_options.value[0].stdFg; // 적용구분
    // setYearGroup.value.setLocCh = ev_set_year_options.value[0].locCh; // 처리상태
    storgeYearGroupSave(ev_set_year_options.value[0].stdYear + '|' + ev_set_year_options.value[0].stdFg + '|' + ev_set_year_options.value[0].locCh);
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
    const response = await api.post('/api/sys/menu_main_list', { paramUserId: 'admin' }, { headers: authHeader() });
    menuListData.mainMenu = response.data.data;
    // console.log('menu:: ', JSON.stringify(menuListData.mainMenu));
    // console.log('name data : ' + $store.state.showcase.userNm);
    // console.log('namex data : ' + $store.state.showcase.userNmx);
    // console.log('emp data : ' + $store.state.showcase.empCd);
    // console.log('sales data : ' + $store.state.showcase.salesCd);
    // console.log('sales data : ' + $store.state.showcase.salesNm);
    // console.log('dept data : ' + $store.state.showcase.deptCd);
    // console.log('dept data : ' + $store.state.showcase.deptNm);
    // console.log('jobTitle data : ' + $store.state.showcase.jobTitleCd);
    // console.log('jobTitle data : ' + $store.state.showcase.jobTitleNm);
  } catch (error) {
    console.error('Error fetching users:', error);
  }
};

// ***** DataBase 서브메뉴자료 가져오기 부분 *****************************//
const getSubMenuData = async param => {
  const paramData = { paramGroupCd: param };
  try {
    const response = await api.post('/api/sys/menu_sub_list', paramData, { headers: authHeader() });

    menuList.value = buildTreeMenuData(response.data.data);

    leftDrawerOpen.value = true;
    pageTitleBarVisible.value = true;
    // return response.data.data;
  } catch (error) {
    console.error('Error fetching users:', error);
  }
};

// 즐겨찾기
const getFavMenuData = async param => {
  const paramData = { paramUserId: 'admin' };
  try {
    const response = await api.post('/api/sys/menu_fav_list', paramData, { headers: authHeader() });

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

const storgeYearGroupSave = resSetYearGroup => {
  $q.localStorage.set('setYearGroup', resSetYearGroup);
  getStorgeSetYearGroup();
};
const getStorgeSetYearGroup = () => {
  const _value = $q.localStorage.getItem('setYearGroup').split('|');
  setYearGroup.value.setYear = _value[0];
  setYearGroup.value.setFg = _value[1];
  setYearGroup.value.setLocCh = _value[2];
  console.log('Main SetYear Group :: ', setYearGroup.value.setYear, setYearGroup.value.setFg, setYearGroup.value.setLocCh);
};
</script>

<style scoped lang="scss">
.custom-footer {
  height: 30px; /* Adjust the height to your desired value */
  background-color: #333; /* Optional: Set background color */
  color: white; /* Optional: Set text color */
  /* Add any other styling you need */
}
.q-field__native,
.q-field__prefix,
.q-field__suffix,
.q-field__input {
  color: red !important;
}
</style>

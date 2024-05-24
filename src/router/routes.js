const routes = [
  {
    path: '/main',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/main/DashboardPage.vue') },
      { path: 'noticeboard', name: 'noticeBoard', component: () => import('pages/main/NoticeBoard.vue'), props: true },

      { path: 'sys1010', component: () => import('pages/erp/sys/SysV1010.vue') },
      { path: 'sys1110', component: () => import('pages/erp/sys/SysV1110.vue') },
      { path: 'sys1120', component: () => import('pages/erp/sys/SysV1120.vue') },
      { path: 'sys1130', component: () => import('pages/erp/sys/SysV1130.vue') },
      { path: 'sys1910', component: () => import('pages/erp/sys/SysV1910.vue') },
      { path: 'sys4010', component: () => import('pages/erp/sys/SysV4010.vue') },
      { path: 'sys4020', component: () => import('pages/erp/sys/SysV4020.vue') },
      { path: 'sys5010', component: () => import('pages/erp/sys/SysV5010.vue') },
      { path: 'sys5020', component: () => import('pages/erp/sys/SysV5020.vue') },
      { path: 'sys5030', component: () => import('pages/erp/sys/SysV5030.vue') },

      { path: 'aux1010', component: () => import('pages/erp/aux/AuxV1010.vue') },
      { path: 'aux2010', component: () => import('pages/erp/aux/AuxV2010.vue') },

      { path: 'mst1010', component: () => import('pages/erp/mst/MstV1010.vue') },
      { path: 'mst2010', component: () => import('pages/erp/mst/MstV2010.vue') },
      { path: 'mst2020', component: () => import('pages/erp/mst/MstV2020.vue') },
      { path: 'mst2030', component: () => import('pages/erp/mst/MstV2030.vue') },
      { path: 'mst2040', component: () => import('pages/erp/mst/MstV2040.vue') },
      { path: 'mst2050', component: () => import('pages/erp/mst/MstV2050.vue') },
      { path: 'mst2060', component: () => import('pages/erp/mst/MstV2060.vue') },
      { path: 'mst5090', component: () => import('pages/erp/mst/MstV5090.vue') },
      { path: 'mstgrid', component: () => import('pages/erp/mst/MstVgrid.vue') },
      { path: 'mstprint', component: () => import('pages/erp/mst/MstVprint.vue') },
      { path: 'mstexcel', component: () => import('pages/erp/mst/MstVexcel.vue') },

      { path: 'sal1010', component: () => import('pages/erp/sal/SalV1010.vue') },
      { path: 'sal2010', component: () => import('pages/erp/sal/SalV2010.vue') },
      {
        path: 'profile',
        component: () => import('pages/profile/ProfilePage.vue'),
        children: [
          { path: '', component: () => import('pages/profile/ProfilePosts.vue') },
          { path: 'saved', component: () => import('pages/profile/ProfileSaved.vue') },
          { path: 'tagged', component: () => import('pages/profile/ProfileTagged.vue') },
        ],
      },
    ],
  },
  {
    path: '/',
    component: () => import('layouts/AuthLayout.vue'),
    children: [
      { path: '', component: () => import('pages/auth/SignIn.vue') },
      { path: 'sign-up', component: () => import('pages/auth/SignUp.vue') },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
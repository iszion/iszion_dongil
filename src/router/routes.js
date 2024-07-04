const routes = [
  {
    path: '/main',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/main/DashboardPage.vue') },
      { path: 'noticeboard', name: 'noticeBoard', component: () => import('pages/main/NoticeBoard.vue'), props: true },

      { path: 'aux1010', component: () => import('pages/erp/aux/AuxV1010.vue') },
      { path: 'aux1020', component: () => import('pages/erp/aux/AuxV1020.vue') },
      { path: 'aux2010', component: () => import('pages/erp/aux/AuxV2010.vue') },

      { path: 'hpe1010', component: () => import('pages/erp/hpe/HpeV1010.vue') },
      { path: 'hpe1020', component: () => import('pages/erp/hpe/HpeV1020.vue') },
      { path: 'hpe2010', component: () => import('pages/erp/hpe/HpeV2010.vue') },
      { path: 'hpe2020', component: () => import('pages/erp/hpe/HpeV2020.vue') },

      { path: 'hce1010', component: () => import('pages/erp/hce/HceV1010.vue') },
      { path: 'hce1020', component: () => import('pages/erp/hce/HceV1020.vue') },
      { path: 'hce2010', component: () => import('pages/erp/hce/HceV2010.vue') },
      { path: 'hce2020', component: () => import('pages/erp/hce/HceV2020.vue') },

      { path: 'hrt1010', component: () => import('pages/erp/hrt/HrtV1010.vue') },
      { path: 'hrt1020', component: () => import('pages/erp/hrt/HrtV1020.vue') },
      { path: 'hrt2010', component: () => import('pages/erp/hrt/HrtV2010.vue') },
      { path: 'hrt2020', component: () => import('pages/erp/hrt/HrtV2020.vue') },
      { path: 'hrt2030', component: () => import('pages/erp/hrt/HrtV2030.vue') },
      { path: 'hrt9000', component: () => import('pages/erp/hrt/HrtV9000.vue') },
      { path: 'hrt9001', component: () => import('pages/erp/hrt/HrtV9001.vue') },
      { path: 'hrt9002', component: () => import('pages/erp/hrt/HrtV9002.vue') },

      { path: 'mst1010', component: () => import('pages/erp/mst/MstV1010.vue') },
      { path: 'mst1210', component: () => import('pages/erp/mst/MstV1210.vue') },
      { path: 'mst1220', component: () => import('pages/erp/mst/MstV1220.vue') },
      { path: 'mst1510', component: () => import('pages/erp/mst/MstV1510.vue') },
      { path: 'mst1520', component: () => import('pages/erp/mst/MstV1520.vue') },
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

      {
        path: 'profile',
        component: () => import('pages/profile/PasswordPage.vue'),
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

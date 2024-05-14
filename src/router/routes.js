const routes = [
  {
    path: '/main',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/DashboardPage.vue') },
      { path: 'noticeboard', name: 'noticeBoard', component: () => import('pages/main/NoticeBoard.vue'), props: true },

      { path: 'sysv1010', component: () => import('pages/erp/sys/SysV1010.vue') },
      { path: 'sysv1110', component: () => import('pages/erp/sys/SysV1110.vue') },
      { path: 'sysv1120', component: () => import('pages/erp/sys/SysV1120.vue') },
      { path: 'sysv1130', component: () => import('pages/erp/sys/SysV1130.vue') },
      { path: 'sysv1910', component: () => import('pages/erp/sys/SysV1910.vue') },
      { path: 'sysv4010', component: () => import('pages/erp/sys/SysV4010.vue') },
      { path: 'sysv4020', component: () => import('pages/erp/sys/SysV4020.vue') },
      { path: 'sysv5010', component: () => import('pages/erp/sys/SysV5010.vue') },
      { path: 'sysv5020', component: () => import('pages/erp/sys/SysV5020.vue') },
      { path: 'sysv5030', component: () => import('pages/erp/sys/SysV5030.vue') },

      { path: 'mstv1010', component: () => import('pages/erp/mst/MstV1010.vue') },
      { path: 'mstv1020', component: () => import('pages/erp/mst/MstV1020.vue') },
      { path: 'mstv1110', component: () => import('pages/erp/mst/MstV1110.vue') },
      { path: 'mstv1120', component: () => import('pages/erp/mst/MstV1120.vue') },
      { path: 'mstv2010', component: () => import('pages/erp/mst/MstV2010.vue') },
      { path: 'mstv5090', component: () => import('pages/erp/mst/MstV5090.vue') },
      { path: 'mstvgrid', component: () => import('pages/erp/mst/MstVgrid.vue') },
      { path: 'mstVprint', component: () => import('pages/erp/mst/MstVprint.vue') },
      { path: 'mstVexcel', component: () => import('pages/erp/mst/MstVexcel.vue') },

      { path: 'salv1010', component: () => import('pages/erp/sal/SalV1010.vue') },
      { path: 'salv2010', component: () => import('pages/erp/sal/SalV2010.vue') },
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

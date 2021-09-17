
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '/', component: () => import('pages/Timelog.vue') },
      { path: '/timelog', component: () => import('pages/Timelog.vue') },
      { path: '/timelogadd/:projectid', component: () => import('pages/TimelogAdd.vue'), props: true },
      { path: '/timelogedit/:projectid/:timelogid', component: () => import('pages/TimelogEdit.vue') },
      { path: '/projects', component: () => import('pages/Projects.vue') },
      { path: '/reports', component: () => import('pages/Reports.vue') },
      { path: '/login', component: () => import('pages/Auth.vue') }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '*',
    component: () => import('pages/Error404.vue')
  }
]

export default routes

import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/EmptyLayout.vue'),
    children: [
      { path: '', component: () => import('pages/StartPage.vue') },
      { path: 'register/:email', component: () => import('pages/RegisterPage.vue') },
      { path: 'register', component: () => import('pages/RegisterPage.vue') },
      { path: 'login/:email', component: () => import('pages/LoginPage.vue'), meta: { requiresAuth: false } },
      { path: 'login', component: () => import('pages/LoginPage.vue'), meta: { requiresAuth: false } },
      { path: 'logout', component: () => import('pages/LogoutPage.vue'), meta: { requiresAuth: false } }
  ],
    
  },

  {
    path: '/user/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/user/IndexPage.vue'), meta: { requiresAuth: true } }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;

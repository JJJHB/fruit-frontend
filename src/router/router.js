import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  { path: '/', name: 'home', component: () => import('../views/HomeView.vue') },
  { path: '/profile', name: 'userProfile', component: () => import('../views/UserProfileView.vue') },
  { path: '/users', name: 'userList', component: () => import('../views/UserListView.vue') },
  { path: '/user-manage', name: 'userManage', component: () => import('../views/UserManageView.vue') },
  { path: '/fruit-categories', name: 'fruitCategories', component: () => import('../views/FruitCategoryView.vue') },
  { path: '/fruit-info', name: 'fruitInfo', component: () => import('../views/FruitInfoView.vue') },
  { path: '/promotions', name: 'promotion', component: () => import('../views/PromotionView.vue') },
  { path: '/orders', name: 'orderQuery', component: () => import('../views/OrderQueryView.vue') },
  { path: '/login', name: 'login', component: () => import('../views/MyLogin.vue') },
  { path: '/notifications', name: 'notification', component: () => import('../views/NotificationView.vue') }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
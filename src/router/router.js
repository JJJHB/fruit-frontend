import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  { path: '/', name: 'home', component: () => import('../views/HomeView.vue') },
//   { path: '/about', name: 'about', component: () => import('./views/AboutView.vue') },
//   { path: '/menu', name: 'menu', component: () => import('./views/MenuView.vue') },
//   { path: '/customer', name: 'customer', component: () => import('./views/CustomerView.vue') },
//   { path: '/test', name: 'test', component: () => import('./views/TestView.vue') },
//   { path: '/usermanage', name: 'usermanage', component: () => import('./views/UserManageView.vue') },
//   { path: '/userbuymain', name: 'userbuymain', component: () => import('./views/UserBuyMainView.vue') },
//   { path: '/cart', name: 'cart', component: () => import('./views/CartView.vue') },
//   { path: '/userlist', name: 'userlist', component: () => import('./views/UserListView.vue') },
//   { path: '/orderquery', name: 'orderquery', component: () => import('./views/OrderQueryView.vue') },
//   { path: '/login', name: 'MyLogin', component: () => import('./views/MyLogin.vue') },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
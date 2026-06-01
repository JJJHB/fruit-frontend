import { createRouter, createWebHashHistory } from 'vue-router'

// 后台主框架
import AdminView from '../views/AdminView.vue'

// 后台子页面
import HomeView from '../views/HomeView.vue'
import UserProfileView from '../views/UserProfileView.vue'
import UserListView from '../views/UserListView.vue'
import UserManageView from '../views/UserManageView.vue'
import FruitCategoryView from '../views/FruitCategoryView.vue'
import FruitInfoView from '../views/FruitInfoView.vue'
import PromotionView from '../views/PromotionView.vue'
import OrderQueryView from '../views/OrderQueryView.vue'
import NotificationView from '../views/NotificationView.vue'
import CarouselView from '../views/CarouselView.vue'


// 普通页面
import MyLogin from '../views/MyLogin.vue'
import RegisterView from '../views/RegisterView.vue'
import SearchView from '../views/SearchView.vue'

const routes = [
  // 前台页面
  { path: '/', name: 'home', component: HomeView },
  { path: '/login', name: 'login', component: MyLogin },
  { path: '/register', name: 'register', component: RegisterView },
  { path: '/search', name: 'search', component: SearchView },

  // 后台管理（导航栏固定）
  {
    path: '/admin',
    name: 'admin',
    component: AdminView,
    children: [
      { path: 'profile', name: 'adminProfile', component: UserProfileView },
      { path: 'users', name: 'adminUsers', component: UserListView },
      { path: 'user-manage', name: 'adminUserManage', component: UserManageView },
      { path: 'fruit-categories', name: 'adminFruitCategories', component: FruitCategoryView },
      { path: 'fruit-info', name: 'adminFruitInfo', component: FruitInfoView },
      { path: 'promotions', name: 'adminPromotions', component: PromotionView },
      { path: 'orders', name: 'adminOrders', component: OrderQueryView },
      { path: 'notifications', name: 'adminNotifications', component: NotificationView },
      { path: 'carousel', name: 'adminCarousel', component: CarouselView }
    ]
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
<template>
  <div class="admin-container">
    <!-- 左侧导航栏 -->
    <aside class="sidebar">
      <div class="logo">🍎 管理系统</div>
      <ul class="menu">
        <li>
          <router-link to="/admin">系统首页</router-link>
        </li>
        <li>
          <router-link to="/admin/profile">个人中心</router-link>
        </li>
        <li>
          <router-link to="/admin/users">用户列表</router-link>
        </li>
        <li>
          <router-link to="/admin/user-manage">用户管理</router-link>
        </li>
        <li>
          <router-link to="/admin/fruit-categories">水果分类</router-link>
        </li>
        <li>
          <router-link to="/admin/fruit-info">水果信息</router-link>
        </li>
        <li>
          <router-link to="/admin/promotions">促销活动</router-link>
        </li>
        <li>
          <router-link to="/admin/carousel">轮播图管理</router-link>
        </li>
        <li>
          <router-link to="/admin/orders">订单管理</router-link>
        </li>
        <li>
          <router-link to="/admin/notifications">通知公告</router-link>
        </li>
        <li>
          <router-link to="/">返回商城</router-link>
        </li>
      </ul>
    </aside>

    <!-- 右侧内容 -->
    <main class="main-content">
      <router-view />
    </main>
  </div>
</template>

<script>
export default {
  name: "AdminView",
};
</script>

<style scoped>
.admin-container {
  display: flex;
  min-height: 100vh;
  background-color: #f0f2f5;
  font-family: "Segoe UI", "PingFang SC", sans-serif;
}

/* 左侧导航 */
.sidebar {
  width: 220px;
  background-color: #2c3e50;
  color: white;
  display: flex;
  flex-direction: column;
}

.logo {
  height: 70px;
  font-size: 24px;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid rgba(255,255,255,0.2);
}

.menu {
  list-style: none;
  padding: 0;
  margin: 0;
  flex: 1;
}

.menu li {
  border-bottom: 1px solid rgba(255,255,255,0.1);
}

.menu li a {
  display: block;
  padding: 15px 20px;
  color: #ecf0f1;
  text-decoration: none;
  transition: background 0.2s, color 0.2s;
}

.menu li a:hover {
  background-color: #34495e;
  color: #fff;
}

.menu li a.router-link-active {
  background-color: #1abc9c;
  color: white;
}

/* 右侧内容 */
.main-content {
  flex: 1;
  padding: 30px;
  background-color: #ecf0f1;
}
</style>
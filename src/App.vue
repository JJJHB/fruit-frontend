<template>
  <nav>
    <router-link to="/">系统首页</router-link> |
    <router-link to="/profile">个人中心</router-link> |
    <router-link to="/users">用户列表</router-link> |
    <router-link to="/user-manage">用户管理</router-link> |
    <router-link to="/fruit-categories">水果分类</router-link> |
    <router-link to="/fruit-info">水果信息</router-link> |
    <router-link to="/promotions">促销活动</router-link> |
    <router-link to="/orders">订单管理</router-link> |
    <router-link to="/notifications">通知公告</router-link> |
    <router-link to="/login">登录</router-link>
  </nav>
  <router-view />
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav {
  padding: 30px;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
}

nav a.router-link-exact-active {
  color: #42b983;
}


</style>

<script>
export default {
  name: 'App'
}
</script>

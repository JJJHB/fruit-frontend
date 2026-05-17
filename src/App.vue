<template>
  <nav>
    <router-link to="/">Home</router-link> |
    <router-link to="/about">About</router-link> |
    <router-link to="/customer">Customer</router-link>|
    <router-link to="/usermanage">UserManage</router-link>|
    <router-link to="/userbuymain">UserBuyMain</router-link>|
    <router-link to="/cart">Cart</router-link>|
    <router-link to="/orderquery">OrderQuery</router-link>
    <router-link to="/login">MyLogin</router-link>
  </nav>
  <router-view/>
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

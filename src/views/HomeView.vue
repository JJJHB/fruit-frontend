<template>
  <div class="home">

<!-- 顶部导航 -->
<header class="header">
  <div class="logo">
    🍎 水果商城
  </div>

  <nav class="nav">
    <a href="#">首页</a>
    <a href="#">水果分类</a>
    <a href="#">购物车</a>
    <a href="#">我的订单</a>
  </nav>

  <div class="user">
    <router-link to="/login">登录</router-link>
    <router-link to="/register">注册</router-link>
  </div>
</header>

<!-- 横幅 -->
<section class="banner">
  <h1>新鲜水果 · 当日配送</h1>
  <p>精选优质水果，让健康触手可及</p>
</section>

<!-- 热门水果 -->
<section class="product-section">
  <h2>热门水果</h2>

  <div class="product-list">
    <div class="product-card" v-for="fruit in fruits" :key="fruit.id">
      <img :src="fruit.image" alt="" />

      <h3>{{ fruit.name }}</h3>

      <p class="price">
        ￥{{ fruit.price }}
      </p>

      <button>
        加入购物车
      </button>
    </div>
  </div>
</section>

<!-- 页脚 -->
<footer class="footer">
  © 2026 水果商城 版权所有
</footer>
```

  </div>
</template>

<script>
export default {
  name: "HomeView",

  data() {
    return {
      fruits: [
        {
          id: 1,
          name: "红富士苹果",
          price: 8.8,
          image: "https://picsum.photos/300/200?1"
        },
        {
          id: 2,
          name: "香蕉",
          price: 5.9,
          image: "https://picsum.photos/300/200?2"
        },
        {
          id: 3,
          name: "橙子",
          price: 12.8,
          image: "https://picsum.photos/300/200?3"
        },
        {
          id: 4,
          name: "草莓",
          price: 18.8,
          image: "https://picsum.photos/300/200?4"
        },
        {
          id: 5,
          name: "葡萄",
          price: 15.8,
          image: "https://picsum.photos/300/200?5"
        },
        {
          id: 6,
          name: "西瓜",
          price: 25.8,
          image: "https://picsum.photos/300/200?6"
        }
      ]
    }
  }
}
</script>

<style scoped>
* {
  box-sizing: border-box;
}

.home {
  min-height: 100vh;
  background: #f5f7fa;
}

/* 顶部导航 */

.header {
  height: 70px;
  background: #fff;

  display: flex;
  justify-content: space-between;
  align-items: center;

  padding: 0 40px;

  box-shadow: 0 2px 10px rgba(0,0,0,.08);
}

.logo {
  font-size: 26px;
  font-weight: bold;
  color: #42b983;
}

.nav {
  display: flex;
  gap: 30px;
}

.nav a {
  text-decoration: none;
  color: #333;
}

.user {
  display: flex;
  gap: 15px;
}

.user a {
  color: #409eff;
  text-decoration: none;
}

/* banner */

.banner {
  height: 350px;

  background: linear-gradient(
    135deg,
    #42b983,
    #67c23a
  );

  color: white;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.banner h1 {
  font-size: 46px;
  margin-bottom: 15px;
}

.banner p {
  font-size: 20px;
}

/* 商品区域 */

.product-section {
  width: 1200px;
  margin: 40px auto;
}

.product-section h2 {
  margin-bottom: 25px;
}

.product-list {
  display: grid;
  grid-template-columns: repeat(3,1fr);
  gap: 25px;
}

.product-card {
  background: white;
  border-radius: 12px;
  padding: 15px;
  text-align: center;

  box-shadow: 0 2px 10px rgba(0,0,0,.08);
}

.product-card img {
  width: 100%;
  height: 220px;
  object-fit: cover;
  border-radius: 10px;
}

.product-card h3 {
  margin: 15px 0;
}

.price {
  color: red;
  font-size: 22px;
  font-weight: bold;
}

.product-card button {
  margin-top: 12px;

  border: none;
  background: #42b983;

  color: white;

  padding: 10px 20px;
  border-radius: 8px;

  cursor: pointer;
}

.product-card button:hover {
  opacity: 0.9;
}

/* 页脚 */

.footer {
  height: 80px;

  background: #2c3e50;
  color: white;

  display: flex;
  justify-content: center;
  align-items: center;

  margin-top: 50px;
}
</style>

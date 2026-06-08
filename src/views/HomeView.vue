<template>
  <div class="home">

    <!-- 顶部导航 -->
    <header class="header">
      <div class="logo">🍎 水果商城</div>

      <nav class="nav">
        <router-link to="/">首页</router-link>
        <router-link to="/admin/fruit-categories">水果分类</router-link>
        <router-link to="/promotions">活动中心</router-link>
      </nav>

      <div class="user">
        <!-- 登录状态切换 -->
        <template v-if="!isLogin">
          <router-link to="/login">登录</router-link>
          <router-link to="/register">注册</router-link>
        </template>
        <template v-else>
          <span>👤 {{ username }}</span>

          <router-link to="/cart">🛒购物车({{ cartCount }})</router-link>

          <router-link to="/admin/orders">📦我的订单</router-link>

          <a href="javascript:void(0)" @click="logout">退出登录</a>
        </template>
      </div>

      <!-- 搜索框 -->
      <div class="search">
        <input
          type="text"
          v-model="searchText"
          placeholder="搜索水果..."
          @keyup.enter="search"
        />
        <button @click="search">搜索</button>
      </div>
    </header>

    <!-- ================= 轮播图 ================= -->
    <section class="banner">
      <div
        class="banner-box"
        :style="{ transform: `translateX(-${currentIndex * 100}%)` }"
      >
        <img
          v-for="b in banners"
          :key="b.id"
          :src="b.img_url"
        />
      </div>
    </section>

    <!-- 公告 -->
    <section class="news">
      <h2>📢 最新公告</h2>
      <ul>
        <li v-for="n in newsList" :key="n.id">
          {{ n.title }}
        </li>
      </ul>
    </section>

    <!-- 促销 -->
    <section class="promo">
      <h2>🔥 促销活动</h2>
      <div class="promo-list">
        <div class="promo-card" v-for="p in promos" :key="p.id">
          <h3>{{ p.title }}</h3>
          <p>水果ID：{{ p.fruitId }}</p>
          <p class="price">￥{{ p.discountPrice }}</p>
        </div>
      </div>
    </section>

    <!-- 商品 -->
    <section class="product-section">
      <h2>🍓 热门水果</h2>

      <div class="product-list">
        <div class="product-card" v-for="f in filteredFruits" :key="f.id">
          <img :src="f.picture ? `${baseURL}/upload/${f.picture}` : defaultImg" />
          <h3>{{ f.name }}</h3>
          <p class="desc">{{ f.detail }}</p>
          <p class="price">￥{{ f.price }}</p>
          <p class="stock">库存：{{ f.stock }}</p>
          <button @click="addToCart(f)">加入购物车</button>
        </div>
      </div>

      <!-- 加载提示 -->
      <div class="load-more" v-if="hasMore">
        <p v-if="loading">加载中...</p>
        <p v-else>下拉加载更多...</p>
      </div>
    </section>

    <!-- 页脚 -->
    <footer class="footer">
      © 2026 水果商城
    </footer>

  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: "HomeView",
  data() {
    return {
      baseURL: "http://localhost:8082/fruit-backend",
      currentIndex: 0,
      timer: null,
      defaultImg: "https://picsum.photos/300/200",
      searchText: "",
      isLogin: false,
      username: "",
      cartCount: 0,

      loadStep: 4,
      loaded: 4,
      loading: false,

      
      

      banners: [
        { id: 1, img_url: "https://picsum.photos/1200/300?1" },
        { id: 2, img_url: "https://picsum.photos/1200/300?2" },
        { id: 3, img_url: "https://picsum.photos/1200/300?3" }
      ],
      newsList: [
        { id: 1, title: "端午节活动：满100减20" },
        { id: 2, title: "泰国榴莲新品上市" },
        { id: 3, title: "系统维护公告：6月10日升级" }
      ],
      promos: [], // 空数组，由接口赋值
      fruits: [
        { id: 1, name: "红富士苹果", price: 8.8, stock: 100, detail: "新鲜红富士苹果", picture: "https://picsum.photos/300/200?10" },
        { id: 2, name: "青苹果", price: 7.5, stock: 50, detail: "酸甜可口", picture: "https://picsum.photos/300/200?11" },
        { id: 3, name: "砂糖橘", price: 12.5, stock: 80, detail: "广西砂糖橘", picture: "https://picsum.photos/300/200?12" },
        { id: 4, name: "泰国榴莲", price: 58, stock: 30, detail: "进口金枕榴莲", picture: "https://picsum.photos/300/200?13" },
        { id: 5, name: "香蕉", price: 5.5, stock: 120, detail: "热带香蕉", picture: "https://picsum.photos/300/200?14" },
        { id: 6, name: "草莓", price: 15.0, stock: 60, detail: "新鲜草莓", picture: "https://picsum.photos/300/200?15" },
        { id: 7, name: "葡萄", price: 18.0, stock: 70, detail: "甜美葡萄", picture: "https://picsum.photos/300/200?16" },
        { id: 8, name: "橙子", price: 9.8, stock: 90, detail: "橙子新鲜", picture: "https://picsum.pho
      ]
    };
  },
  computed: {
    filteredFruits() {
      return this.allFruits
        .filter(f => f.name.includes(this.searchText))
        .slice(0, this.loaded);
    },
    hasMore() {
      // 空数组兜底，没数据时length=0
      const list = this.allFruits || []
      return this.loaded < list.length;
    }
  },
  mounted() {
    this.startBanner();
    window.addEventListener("scroll", this.handleScroll);

    this.getPromotionData(); // 初始化加载促销
  },
  beforeUnmount() {
    clearInterval(this.timer);
    window.removeEventListener("scroll", this.handleScroll);
  },
  methods: {
    // 新增拉取促销接口
    async getPromotionData() {
      try {
        const res = await fetch("http://localhost:8082/fruit-backend/promotion");
        const data = await res.json();
        if (data.code === 200) {
          this.promos = data.promotions;
        }
      } catch (e) {
        console.log("促销加载异常", e);
      }
    },
    startBanner() {
      this.timer = setInterval(() => {
        this.currentIndex = (this.currentIndex + 1) % this.banners.length;
      }, 3000);
    },
    search() {

      this.loaded = this.loadStep;
    },
    loadMore() {
      const list = this.allFruits || []
      if (this.loading || this.loaded >= list.length) return;
      this.loading = true;
      setTimeout(() => {
        this.loaded = Math.min(this.loaded + this.loadStep, list.length);
        this.loading = false;
      }, 500);
    },
    handleScroll() {
      const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
      const windowHeight = window.innerHeight;
      const scrollHeight = document.documentElement.scrollHeight;
      if (scrollTop + windowHeight + 100 >= scrollHeight) {
        this.loadMore();
      }
    },
    addToCart(fruit) {
      this.cartCount++;
      alert(`${fruit.name} 已加入购物车`);
    },
    logout() {
      // 移除 localStorage 用户信息
      localStorage.removeItem("user");

      // 清空登录状态
      this.isLogin = false;
      this.username = "";

      // 如果当前是 admin 页面，退回首页
      if (this.$route.path.startsWith("/admin")) {
        this.$router.push("/");
      }
    }
  }
};
</script>

<style>
/* ===== 全局基础 ===== */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  background: #f5f6f7;
  font-family: Arial, Helvetica, sans-serif;
}

.home {
  width: 100%;
  padding-top: 80px;
}

/* ===== 统一内容宽度容器 ===== */
.container {
  width: 1200px;
  margin: 0 auto;
}

/* ===== header ===== */
.header {
  width: 1200px;
  margin: 15px auto;
  display: flex;
  align-items: center;
  justify-content: space-between;

  padding: 12px 20px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.06);

  gap: 15px;

  /* 固定置顶 */
  position: fixed;
  left: 50%;
  top: 0;
  transform: translateX(-50%);
  z-index: 999;
  margin-top:8px;
}
/* logo */
.logo {
  font-size: 20px;
  font-weight: bold;
  white-space: nowrap;
}

/* 导航 */
.nav {
  flex: 1;
  display: flex;
  justify-content: center;
  gap: 22px;
  flex-wrap: wrap;
}

.nav a {
  text-decoration: none;
  color: #444;
  font-size: 14px;
  transition: 0.2s;
}

.nav a:hover {
  color: #2ecc71;
}

/* 用户区域 */
.user {
  display: flex;
  align-items: center;
  gap: 12px;
  white-space: nowrap;
  font-size: 14px;
}

/* 搜索 */
.search {
  display: flex;
  align-items: center;
  gap: 6px;
}

.search input {
  width: 180px;
  padding: 6px 10px;
  border: 1px solid #ddd;
  border-radius: 6px;
  outline: none;
}

.search button {
  padding: 6px 12px;
  border: none;
  border-radius: 6px;
  background: #2ecc71;
  color: #fff;
  cursor: pointer;
}

/* ===== banner ===== */
.banner {
  width: 1200px;
  margin: 15px auto;
  overflow: hidden;
  border-radius: 12px;
}

.banner-box {
  display: flex;
  transition: transform 0.5s ease;
}

.banner-box img {
  width: 1200px;
  height: 300px;
  object-fit: cover;
}

/* ===== 公告 ===== */
.news {
  width: 1200px;
  margin: 20px auto;
  background: #fff;
  padding: 15px;
  border-radius: 12px;
}

.news h2 {
  margin-bottom: 10px;
}

.news li {
  list-style: none;
  padding: 6px 0;
  border-bottom: 1px solid #eee;
  font-size: 14px;
}

/* ===== 促销 ===== */
.promo {
  width: 1200px;
  margin: 20px auto;
}

.promo-list {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px;
}

.promo-card {
  background: #fff;
  padding: 15px;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
}

.price {
  color: #e74c3c;
  font-weight: bold;
}

/* ===== 商品区 ===== */
.product-section {
  width: 1200px;
  margin: 20px auto;
}

.product-list {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 15px;
}

.product-card {
  background: #fff;
  padding: 12px;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
  transition: 0.2s;
}

.product-card:hover {
  transform: translateY(-3px);
}

.product-card img {
  width: 100%;
  height: 150px;
  object-fit: cover;
  border-radius: 8px;
}

.product-card h3 {
  font-size: 16px;
  margin: 8px 0;
}

.desc {
  font-size: 12px;
  color: #666;
}

.stock {
  font-size: 12px;
  color: #999;
}

.product-card button {
  margin-top: 8px;
  width: 100%;
  padding: 6px;
  border: none;
  border-radius: 6px;
  background: #2ecc71;
  color: #fff;
  cursor: pointer;
}

/* ===== 加载 ===== */
.load-more {
  text-align: center;
  margin: 15px 0;
  color: #888;
}

/* ===== footer ===== */
.footer {
  width: 1200px;
  margin: 30px auto;
  text-align: center;
  color: #999;
  font-size: 12px;
}

/* ===== 响应式 ===== */
@media (max-width: 1200px) {
  .header,
  .banner,
  .news,
  .promo,
  .product-section,
  .footer {
    width: 95%;
  }

  .product-list {
    grid-template-columns: repeat(2, 1fr);
  }

  .promo-list {
    grid-template-columns: repeat(2, 1fr);
  }

  .nav {
    display: none; /* 小屏先隐藏导航，避免挤爆 */
  }
}
</style>
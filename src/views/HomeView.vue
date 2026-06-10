<template>
  <div class="home">
    <!-- 顶部导航 -->
    <header class="header">
      <div class="logo">🍎 水果商城</div>

      <nav class="nav">
        <router-link to="/">首页</router-link>
        <router-link to="/admin/fruit-categories">水果分类</router-link>
        <router-link to="/frontpromotions">活动中心</router-link>
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
          <router-link to="/orders">📦我的订单</router-link>
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

    <!-- 轮播图 -->
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
          <p>水果ID：{{ p.fruit_id }}</p>
          <p class="price">￥{{ p.discount_price }}</p>
        </div>
      </div>
    </section>

    <!-- 商品 -->
<section class="product-section">
  <div class="product-head">
    <h2>🍓 热门水果</h2>
    <div class="sort-buttons">
      <!-- 价格排序 增加 type="button" + prevent -->
      <button type="button" class="sort-btn" @click.prevent="togglePriceSort">
        价格
        <span :class="{ up: priceOrder === 'asc', down: priceOrder === 'desc' }">
          {{ priceOrder === 'asc' ? '↑' : priceOrder === 'desc' ? '↓' : '⇄' }}
        </span>
      </button>
      <!-- 点击量排序 -->
      <button type="button" class="sort-btn" @click.prevent="toggleClickSort">
        点击量
        <span :class="{ up: clickOrder === 'asc', down: clickOrder === 'desc' }">
          {{ clickOrder === 'asc' ? '↑' : clickOrder === 'desc' ? '↓' : '⇄' }}
        </span>
      </button>
      <!-- 默认排序 -->
      <button
        type="button"
        class="sort-btn"
        :class="{ active: sortType === 'default' }"
        @click.prevent="changeSort('default')"
      >
        默认排序
      </button>
    </div>
  </div>

  <div class="product-list">
    <!-- 卡片整体点击跳转详情页 -->
    <div 
      class="product-card" 
      v-for="f in filteredFruits" 
      :key="f.id"
      @click="goDetail(f)"
    >
      <img :src="f.picture ? `${baseURL}/upload/${f.picture}` : defaultImg" />
      <h3>{{ f.name }}</h3>
      <p class="desc">{{ f.detail }}</p>
      <p class="price">￥{{ f.price }}/kg</p>
      <p class="clicknum">点击量：{{ f.clicknum }}</p>
      <!-- stop 阻止冒泡，点击按钮不跳详情 -->
      <button @click.stop="addToCart(f)">加入购物车</button>
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
      allFruits: [],

      // 排序相关变量
      sortType: 'default',
      priceOrder: null,
      clickOrder: null,

      banners: [],
      newsList: [],
      promos: [
        { id: 1, fruit_id: 1, title: "苹果限时特价", discount_price: 6.8 },
        { id: 2, fruit_id: 3, title: "砂糖橘促销", discount_price: 10.0 }
      ]
    };
  },
  computed: {
    filteredFruits() {
      // 拷贝数组，不污染原数据
      let list = [...this.allFruits].filter(f => f.name.includes(this.searchText));

      // 价格排序
      if (this.sortType === 'price') {
        if (this.priceOrder === 'asc') {
          list.sort((a, b) => a.price - b.price);
        } else if (this.priceOrder === 'desc') {
          list.sort((a, b) => b.price - a.price);
        }
      }
      // 点击量排序
      else if (this.sortType === 'click') {
        if (this.clickOrder === 'asc') {
          list.sort((a, b) => (a.clicknum || 0) - (b.clicknum || 0));
        } else if (this.clickOrder === 'desc') {
          list.sort((a, b) => (b.clicknum || 0) - (a.clicknum || 0));
        }
      }

      return list.slice(0, this.loaded);
    },
    hasMore() {
      const list = this.allFruits || []
      return this.loaded < list.length;
    }
  },
  mounted() {
    this.startBanner();
    window.addEventListener("scroll", this.handleScroll);
    this.getBannersFromBackend();
    this.getFruitFromBackend();
    this.getNewsData();
    const user = localStorage.getItem("user");

    if (user) {
      const userInfo = JSON.parse(user);
      if (userInfo.role === "user") {
        this.isLogin = true;
        this.username = userInfo.username;
      }
    }
  },
 beforeUnmount() {
  clearInterval(this.timer);
  window.removeEventListener("scroll", this.handleScroll);
},
  methods: {
    async getNewsData() {
      try {
        const res = await axios.get(`${this.baseURL}/NewsServlet`, {
          params: {
            action: "list",
            title: ""
          }
        });
        if (Array.isArray(res.data)) {
          this.newsList = res.data;
        }
      } catch (e) {
        console.error("前台公告加载异常:", e);
      }
    },
    // 记录并恢复滚动位置，解决抖动
    saveScroll() {
      return document.documentElement.scrollTop || document.body.scrollTop;
    },
    restoreScroll(top) {
      window.scrollTo(0, top);
    },

    async getBannersFromBackend() {
      try {
        const res = await axios.get(`${this.baseURL}/configQuery`)
        this.banners = (res.data.configs || []).map(item => ({
          id: item.id,
          img_url: `${this.baseURL}/upload/${item.imgUrl}`
        }))
      } catch (err) {
        console.error("轮播图加载失败", err)
      }
    },
    async getFruitFromBackend() {
      try {
        const res = await axios.get(`${this.baseURL}/fruitQueryList`, {
          params: {
            name: this.searchText,
            minPrice: "",
            maxPrice: ""
          }
        })
        this.allFruits = res.data.fruits || []
      } catch (err) {
        console.error("水果数据加载失败", err)
      }
    },
    startBanner() {
      this.timer = setInterval(() => {
        this.currentIndex = (this.currentIndex + 1) % this.banners.length;
      }, 3000);
    },
    search() {
      const key = this.searchText.trim()
      if (!key) return
      this.$router.push({ path: "/search", query: { keyword: key } })
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
    addCart(fruitId, quantity = 1) {
      const user = JSON.parse(localStorage.getItem("user"));

      if (!user || !user.id) {
        alert("请先登录");
        this.$router.push("/login");
        return;
      }

      axios.post(
        "http://localhost:8082/fruit-backend/cart",
        null,
        {
          params: {
            action: "add",     // ⭐关键
            userId: user.id,
            fruitId: fruitId,
            quantity: quantity
          }
        }
      ).then(res => {
        if (res.data.code === 200) {
          alert("加入购物车成功");
          this.cartCount += quantity;
        } else {
          alert(res.data.msg);
        }
      }).catch(() => {
        alert("网络异常");
      });
    },
    logout() {
      localStorage.removeItem("user");
      this.isLogin = false;
      this.username = "";
      if (this.$route.path.startsWith("/admin")) {
        this.$router.push("/");
      }
    },

    // 价格排序切换：不再重置loaded，保留滚动位置
    togglePriceSort() {
      const scrollTop = this.saveScroll();
      this.sortType = 'price';
      this.clickOrder = null;
      if (!this.priceOrder) {
        this.priceOrder = 'asc';
      } else if (this.priceOrder === 'asc') {
        this.priceOrder = 'desc';
      } else {
        this.priceOrder = null;
        this.sortType = 'default';
      }
      this.$nextTick(() => {
        this.restoreScroll(scrollTop);
      })
    },
    // 点击量排序切换：不再重置loaded，保留滚动位置
    toggleClickSort() {
      const scrollTop = this.saveScroll();
      this.sortType = 'click';
      this.priceOrder = null;
      if (!this.clickOrder) {
        this.clickOrder = 'asc';
      } else if (this.clickOrder === 'asc') {
        this.clickOrder = 'desc';
      } else {
        this.clickOrder = null;
        this.sortType = 'default';
      }
      this.$nextTick(() => {
        this.restoreScroll(scrollTop);
      })
    },
    // 恢复默认排序：不再重置loaded，保留滚动位置
    changeSort(type) {
      const scrollTop = this.saveScroll();
      this.sortType = type;
      this.priceOrder = null;
      this.clickOrder = null;
      this.$nextTick(() => {
        this.restoreScroll(scrollTop);
      })
    },

    // 点击卡片：点击量+1 + 跳转详情
    async goDetail(fruit) {
      // 1. 前端视图立即+1
      fruit.clicknum = (fruit.clicknum || 0) + 1;

      // 2. 调用后端接口更新数据库点击量（根据你后端接口修改地址）
      try {
        await axios.get(`${this.baseURL}/fruitAddClick`, {
          params: {
            id: fruit.id
          }
        })
      } catch (err) {
        console.error("点击量更新失败", err)
      }

      // 3. 新标签页打开详情
      const route = this.$router.resolve({
        path: `/fruit-detail/${fruit.id}`
      })
      window.open(route.href, '_blank')
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
  position: fixed;
  left: 50%;
  top: 0;
  transform: translateX(-50%);
  z-index: 999;
  margin-top:8px;
}
.logo {
  font-size: 20px;
  font-weight: bold;
  white-space: nowrap;
}
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
.user {
  display: flex;
  align-items: center;
  gap: 12px;
  white-space: nowrap;
  font-size: 14px;
}
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
  height: 300px;
  margin: 15px auto;
  overflow: hidden;
  border-radius: 12px;
  position: relative;
}
.banner-box {
  display: flex;
  height: 100%;
  transition: transform 0.5s ease;
}
.banner-box img {
  width: 100%;
  height: 100%;
  flex-shrink: 0;
  object-fit: cover;
  display: block;
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
/* 标题+排序同行 */
.product-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}
.sort-buttons {
  display: flex;
  gap: 12px;
}
.sort-btn {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  border: none;
  background: transparent;
  font-size: 15px;
  cursor: pointer;
  color: #333;
}
.sort-btn span {
  font-size: 16px;
  color: #ccc;
  transition: color 0.2s;
}
.sort-btn span.up {
  color: #2ecc71;
}
.sort-btn span.down {
  color: #e74c3c;
}
.sort-btn:hover {
  color: #2ecc71;
}
.sort-btn.active {
  color: #2ecc71;
  font-weight: bold;
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
.clicknum {
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
  .product-head {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
  .product-list {
    grid-template-columns: repeat(2, 1fr);
  }
  .promo-list {
    grid-template-columns: repeat(2, 1fr);
  }
  .nav {
    display: none;
  }
}
</style>
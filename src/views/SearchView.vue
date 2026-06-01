<template>
  <div class="search-page">
    <!-- 搜索框 -->
    <div class="search-box">
      <input
        v-model="keyword"
        type="text"
        placeholder="搜索水果..."
        @keyup.enter="doSearch"
      />
      <button @click="doSearch">搜索</button>
    </div>

    <!-- 搜索结果 -->
    <div class="result">
      <h2 v-if="keyword">搜索结果：{{ keyword }}</h2>
      <p v-else>请输入关键词进行搜索</p>

      <div class="fruit-list">
        <div class="fruit-card" v-for="f in filteredFruits" :key="f.id">
          <img :src="f.picture || defaultImg" />
          <h3>{{ f.name }}</h3>
          <p class="price">￥{{ f.price }}</p>
          <p class="desc">{{ f.detail }}</p>
        </div>

        <p v-if="filteredFruits.length === 0 && keyword">没有找到相关水果 😢</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "SearchView",
  data() {
    return {
      keyword: "",
      defaultImg: "https://picsum.photos/200/150",
      fruits: [
        { id: 1, name: "红富士苹果", price: 8.8, detail: "新鲜红富士苹果", picture: "https://picsum.photos/200/150?1" },
        { id: 2, name: "青苹果", price: 7.5, detail: "酸甜可口", picture: "https://picsum.photos/200/150?2" },
        { id: 3, name: "砂糖橘", price: 12.5, detail: "广西砂糖橘", picture: "https://picsum.photos/200/150?3" },
        { id: 4, name: "泰国榴莲", price: 58, detail: "进口金枕榴莲", picture: "https://picsum.photos/200/150?4" },
        { id: 5, name: "香蕉", price: 5.5, detail: "热带香蕉", picture: "https://picsum.photos/200/150?5" },
        { id: 6, name: "草莓", price: 15.0, detail: "新鲜草莓", picture: "https://picsum.photos/200/150?6" }
      ]
    };
  },
  computed: {
    filteredFruits() {
      if (!this.keyword.trim()) return [];
      return this.fruits.filter(f => f.name.includes(this.keyword));
    }
  },
  mounted() {
    this.keyword = this.$route.query.keyword || "";
  },
  watch: {
    "$route.query.keyword"(val) {
      this.keyword = val || "";
    }
  },
  methods: {
    doSearch() {
      if (!this.keyword.trim()) return;
      this.$router.push({ path: "/search", query: { keyword: this.keyword } });
    }
  }
};
</script>

<style scoped>
.search-page {
  width: 1200px;
  margin: 20px auto;
  font-family: Arial, Helvetica, sans-serif;
}

.search-box {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 20px;
}

.search-box input {
  flex: 1;
  padding: 6px 10px;
  border: 1px solid #ddd;
  border-radius: 6px;
  outline: none;
}

.search-box button {
  padding: 6px 12px;
  border: none;
  border-radius: 6px;
  background: #2ecc71;
  color: #fff;
  cursor: pointer;
}

.search-box button:hover {
  background: #27ae60;
}

.fruit-list {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px;
}

.fruit-card {
  background: #fff;
  padding: 12px;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
  text-align: center;
}

.fruit-card img {
  width: 100%;
  height: 150px;
  object-fit: cover;
  border-radius: 8px;
}

.fruit-card h3 {
  font-size: 16px;
  margin: 8px 0;
}

.price {
  color: #e74c3c;
  font-weight: bold;
}

.desc {
  font-size: 12px;
  color: #666;
}
</style>